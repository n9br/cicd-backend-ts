terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.58.0"
    }
  }

  required_version = ">= 1.2.0"
}

provider "aws" {
  region = var.aws_region
}

# # .deploy/terraform/static-site/s3.tf
resource "aws_s3_bucket" "cicd-otf-state" {
  bucket = "cicd-otf-state"
  # acl = "my-acl"
}