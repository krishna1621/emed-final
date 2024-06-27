terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "3.0.2"
    }
  }
}

provider "docker" {
 host = "npipe:////.//pipe//docker_engine"
}


resource "docker_image" "alpine" {
  name = "claritui"
  build {
    context = "."
    dockerfile = "./Dockerfile"
  } 
}

# Create a container
resource "docker_container" "alpine" {
  image = docker_image.alpine.image_id
  name  = "claritui"

  ports {
    internal = 3000
    external = 3000
  }
}