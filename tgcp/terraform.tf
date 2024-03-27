terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 3.5"
    }
  }

  required_version = ">= 0.12"
}

provider "google" {
  credentials = file(var.credentials_file)
  project     = var.project_id
  region      = var.region
}

resource "google_compute_network" "vpc" {
  name                    = "my-vpc"
  auto_create_subnetworks = false
  routing_mode            = "REGIONAL"
  project                 = var.project_id
}

resource "google_compute_subnetwork" "webapp_subnet" {
  name          = "webapp-subnet"
  ip_cidr_range = "10.0.1.0/24"
  region        = var.region
  network       = google_compute_network.vpc.id
}

resource "google_compute_firewall" "allow_web_ssh_traffic" {
  name    = "allow-web-ssh-traffic"
  network = google_compute_network.vpc.id

  allow {
    protocol = "tcp"
    ports    = ["22", "80", "443"]
  }

  source_ranges = ["0.0.0.0/0"]
}

resource "google_compute_address" "static_ip" {
  name   = "csye-static-ip"
  region = var.region
}

resource "google_compute_managed_ssl_certificate" "ssl_certificate" {
  name    = "sarkarilinks-ssl-cert"
  managed {
    domains = ["sarkarilinks.com"]
  }
}
resource "google_sql_database_instance" "instance" {
  name             = "csye-sql-instance"
  database_version = "MYSQL_8_0"
  region           = var.region

  settings {
    tier = "db-f1-micro"
    
  }
}

resource "google_sql_database" "database" {
  name     = "csye-database"
  instance = google_sql_database_instance.instance.name
}

resource "random_password" "db_password" {
  length  = 16
  special = true
}

resource "google_sql_user" "user" {
  name     = "csye-user"
  instance = google_sql_database_instance.instance.name
  password = random_password.db_password.result
}

resource "google_compute_instance" "csye_instance" {
  name         = "csye-instance"
  machine_type = "e2-standard-2"
  zone         = "us-central1-a"

  boot_disk {
    initialize_params {
      image = "projects/${var.project_id}/global/images/${var.image_name}"
    }
  }

  network_interface {
    network    = google_compute_network.vpc.id
    subnetwork = google_compute_subnetwork.webapp_subnet.id

    access_config {
      nat_ip = google_compute_address.static_ip.address
    }
  }

  tags = ["http-server", "https-server", "csye-group"]

 metadata = {
  db_name     = google_sql_database.database.name
  db_user     = google_sql_user.user.name
  db_password = google_sql_user.user.password
  db_host     = google_sql_database_instance.instance.private_ip_address
}
  metadata_startup_script = <<-EOF
  
    #!/bin/bash
    yum update -y
    yum install -y httpd mod_ssl
    systemctl start httpd
    systemctl enable httpd
    echo '<html><body><h1>Welcome to My Custom Web App!</h1><p>This is a custom CentOS Stream 8 instance created with Packer.</p></body></html>' > /var/www/html/index.html
    firewall-cmd --zone=public --add-port=80/tcp --permanent
    firewall-cmd --zone=public --add-port=443/tcp --permanent
    firewall-cmd --reload

    # Configure Apache for HTTPS
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/pki/tls/private/apache.key -out /etc/pki/tls/certs/apache.crt -subj "/C=US/ST=California/L=San Francisco/O=Your Company/OU=IT Department/CN=sarkarilinks.com"
    cat /etc/pki/tls/certs/apache.crt /etc/pki/tls/private/apache.key > /etc/pki/tls/certs/apache.pem
    cp /etc/pki/tls/certs/apache.pem /etc/pki/tls/private/
    sed -i 's/^#ServerName/ServerName sarkarilinks.com/' /etc/httpd/conf/httpd.conf
    echo "<VirtualHost *:443>
    ServerName sarkarilinks.com
    SSLEngine on
    SSLCertificateFile /etc/pki/tls/certs/apache.pem
    SSLCertificateKeyFile /etc/pki/tls/private/apache.key
    </VirtualHost>" >> /etc/httpd/conf/httpd.conf
    systemctl restart httpd
  EOF

  service_account {
    email  = google_service_account.vm_service_account.email
    scopes = ["https://www.googleapis.com/auth/cloud-platform"]
  }
}



# ... (rest of the Terraform configuration remains the same)

# Pub/Sub topic for user registration
resource "google_pubsub_topic" "user_registered" {
  name = "user-registered"
}

# Pub/Sub subscription for user registration
resource "google_pubsub_subscription" "user_registered_subscription" {
  name  = "user-registered-subscription"
  topic = google_pubsub_topic.user_registered.name

  ack_deadline_seconds = 20
}

# Cloud Storage bucket for Cloud Function source code
resource "google_storage_bucket" "function_bucket" {
  name     = "japangor_bucket_serverless"
  location = "US"
}

# Archive the Cloud Function source code
data "archive_file" "function_source" {
  type        = "zip"
  source_dir  = "./serverless"
  output_path = "./serverless.zip"
}

# Upload the Cloud Function source code to the bucket
resource "google_storage_bucket_object" "function_archive" {
  name   = "serverless.zip"
  bucket = google_storage_bucket.function_bucket.name
  source = data.archive_file.function_source.output_path
}

# Cloud Function for sending verification email
resource "google_cloudfunctions_function" "send_verification_email" {
  name        = "send-verification-email"
  description = "Sends verification email to newly registered users"
  runtime     = "nodejs14"

  event_trigger {
    event_type = "google.pubsub.topic.publish"
    resource   = google_pubsub_topic.user_registered.name
  }

  source_archive_bucket = google_storage_bucket.function_bucket.name
  source_archive_object = google_storage_bucket_object.function_archive.name

  entry_point = "sendVerificationEmail"

  environment_variables = {
    MAILCHIMP_API_KEY = var.mailchimp_api_key
    FROM_EMAIL        = var.from_email
    DB_HOST           = google_sql_database_instance.instance.private_ip_address
    DB_NAME           = google_sql_database.database.name
    DB_USER           = google_sql_user.user.name
    DB_PASSWORD       = google_sql_user.user.password
  }
}

# IAM policy for Cloud Function to access Pub/Sub
resource "google_cloudfunctions_function_iam_member" "pubsub_invoker" {
  project        = google_cloudfunctions_function.send_verification_email.project
  region         = google_cloudfunctions_function.send_verification_email.region
  cloud_function = google_cloudfunctions_function.send_verification_email.name

  role   = "roles/cloudfunctions.invoker"
  member = "serviceAccount:${google_service_account.pubsub_service_account.email}"
}

# IAM policy for Pub/Sub subscription
resource "google_pubsub_subscription_iam_member" "pubsub_subscriber" {
  subscription = google_pubsub_subscription.user_registered_subscription.name
  role         = "roles/pubsub.subscriber"
  member       = "serviceAccount:${google_service_account.pubsub_service_account.email}"
}

# IAM policy for Pub/Sub topic
resource "google_pubsub_topic_iam_member" "pubsub_publisher" {
  topic  = google_pubsub_topic.user_registered.name
  role   = "roles/pubsub.publisher"
  member = "serviceAccount:${google_service_account.pubsub_service_account.email}"
}

# Service account for Pub/Sub
resource "google_service_account" "pubsub_service_account" {
  account_id   = "pubsub-service-account"
  display_name = "Pub/Sub Service Account"
}

# Grant service account token creator role to the Pub/Sub service account
resource "google_project_iam_member" "pubsub_token_creator" {
  project = var.project_id
  role    = "roles/iam.serviceAccountTokenCreator"
  member  = "serviceAccount:service-${data.google_project.current_project.number}@gcp-sa-pubsub.iam.gserviceaccount.com"
}

# Retrieve the current project information
data "google_project" "current_project" {}
resource "google_dns_record_set" "default" {
  name         = "sarkarilinks.com."
  managed_zone = "sarkar"  # Use the existing DNS zone name
  type         = "A"
  ttl          = 300
  rrdatas      = [google_compute_address.static_ip.address]
}

resource "google_compute_target_https_proxy" "https_proxy" {
  name             = "https-proxy"
  url_map          = google_compute_url_map.url_map.id
  ssl_certificates = [google_compute_managed_ssl_certificate.ssl_certificate.self_link]
}

resource "google_compute_url_map" "url_map" {
  name            = "url-map"
  default_service = google_compute_backend_bucket.static_bucket.self_link
}

resource "google_compute_backend_bucket" "static_bucket" {
  name        = "static-bucket"
  bucket_name = google_storage_bucket.static_website.name
  enable_cdn  = true
}

resource "google_storage_bucket" "static_website" {
  name     = "sarkarilinks-static-website"
  location = "US"

  website {
    main_page_suffix = "index.html"
    not_found_page   = "404.html"
  }
}

resource "google_service_account" "vm_service_account" {
  account_id   = "vm-service-account"
  display_name = "VM Service Account"
}

resource "google_project_iam_binding" "logging_admin" {
  project = var.project_id
  role    = "roles/logging.admin"

  members = [
    "serviceAccount:${google_service_account.vm_service_account.email}",
  ]
}

resource "google_compute_global_forwarding_rule" "default" {
  name       = "global-forwarding-rule"
  target     = google_compute_target_https_proxy.https_proxy.self_link
  port_range = "443"
}

resource "google_project_iam_binding" "monitoring_metric_writer" {
  project = var.project_id
  role    = "roles/monitoring.metricWriter"

  members = [
    "serviceAccount:${google_service_account.vm_service_account.email}",
  ]
}
  variable "from_email" {
      type    = string
      default = "japangor@gmail.com"
    }
      variable "mailchimp_api_key" {
      type    = string
      default = "bb0b883f788dc7a0d70f4b72d4462081-us9"
    }