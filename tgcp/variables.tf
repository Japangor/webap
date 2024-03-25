variable "credentials_file" {
  description = "key.json"
  default     = "key.json"

}
variable "credentials" {
  description = "key.json"
  default     = "key.json"

}

variable "project_id" {
  description = "csye-417822"
  default     = "csye-417822"

}
variable "project" {
  description = "csye-417822"
  default     = "csye-417822"

}

variable "region" {
  description = "us-central-a"
  default     = "us-central1"

}
variable "zone" {
  description = "The Google Cloud zone where resources will be created"
  default     = "us-central1-a"
}
variable "image_name" {
  description = "The name of the custom image to use for the instance"
  type        = string
  default     = "packer-1711289121"
}

variable "network"      { default =  "default" }
variable "prefix"       { default = "apache-" }
variable "desc"         { default = "This template is used to create Apache server instances." }
variable "tags"         { default = "webserver" }
variable "desc_inst"    { default = "Apache Web server instance" }
variable "machine_type" { default =  "n1-standard-1" }
variable "source_image" { default =  "apache" } //This is the family tag used when building the Golden Image with Packer.
#
# Managed Instace Group
variable "rmig_name"          { default =  "apache-rmig" }
variable "base_instance_name" { default =  "apache" }
variable "target_size"        { default =  "3" }
#
# Healthcheck
variable "hc_name" { default = "apache-healthcheck" }
variable "hc_port" { default = "80" }
#
# Backend
variable "be_name"              { default = "http-backend" }
variable "be_protocol"          { default = "HTTP" }
variable "be_port_name"         { default = "http" }
variable "be_timeout"           { default = "10" }
variable "be_session_affinity"  { default = "NONE" }
#
# RMIG Autoscaler
variable "rmig_as_name" { default = "rmig-as" }
#
# Global Forwarding Rule
variable "gfr_name"      { default = "website-forwarding-rule" }
variable "gfr_portrange" { default = "80" }
variable "thp_name"      { default = "http-proxy" }
variable "urlmap_name"   { default = "http-lb-url-map" }
#
# Firewall Rules
variable "fwr_name" { default = "allow-http-https" }