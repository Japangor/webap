#!/bin/bash
# Update the system
yum update -y
yum install -y httpd mod_ssl

# Start the HTTP server
systemctl start httpd
systemctl enable httpd

# Create a simple index.html for testing
echo '<html><body><h1>Welcome to My Custom Web App!</h1><p>This is a custom CentOS Stream 8 instance created with Packer.</p></body></html>' > /var/www/html/index.html

# Open firewall for HTTP and HTTPS
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

# Set environment variables for the web application to connect to CloudSQL
export DB_HOST="your-cloudsql-private-ip"
export DB_USER="webapp_user"
export DB_PASS="your-generated-password"
export DB_NAME="webapp"

# Replace the following line with the command to start your web application
# For example, if you're using Node.js, it might be something like:
# node /path/to/your/app.js
