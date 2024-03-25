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
    db_password = random_password.db_password.result
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