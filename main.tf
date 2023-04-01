terraform {
  cloud {
    organization = "gtb08177"

    workspaces {
      name = "cloudflare-zoom-monitor-workspace"
    }
  }
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.2.0"
    }
  }
}

# https://registry.terraform.io/providers/cloudflare/cloudflare/latest/docs
# Use Env variables to provide defaults
provider "cloudflare" {}

variable "account_id" {
  type = string
}

resource "cloudflare_worker_script" "main_script" {
  name       = "zoom-monitor-v2"
  content    = file("js/script.js")
  account_id = var.account_id

  kv_namespace_binding {
    name         = "ZoomMonitor_Keyspace"
    namespace_id = cloudflare_workers_kv_namespace.zoom_monitor_ns.id
  }
}

resource "cloudflare_workers_kv_namespace" "zoom_monitor_ns" {
  account_id = var.account_id
  title      = "ZoomMonitor_Keyspace"
}

resource "cloudflare_workers_kv" "zoom_monitor_kv_in_meeting" {
  account_id   = var.account_id
  namespace_id = cloudflare_workers_kv_namespace.zoom_monitor_ns.id
  key          = "in_meeting"
  value        = "false"
}

resource "cloudflare_workers_kv" "zoom_monitor_kv_last_update" {
  account_id   = var.account_id
  namespace_id = cloudflare_workers_kv_namespace.zoom_monitor_ns.id
  key          = "last_update"
  value        = "2023-12-23T23:23:23Z"
}

resource "cloudflare_worker_route" "catch_all_route" {
  depends_on = [cloudflare_worker_script.main_script]

  zone_id     = "0e6bd24836efa1518ee1ade856989385"
  pattern     = "api.mcnulty.network/v2/zoom"
  script_name = cloudflare_worker_script.main_script.name
}