#!/bin/bash

set -e

ROOT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $ROOT_DIR

docker pull debian:9.5-slim
DOCKER_BUILDKIT=1 docker build --tag dev:container-test-base .
DOCKER_BUILDKIT=1 docker build --tag container-test_release --file Dockerfile.release --build-arg "IMAGE_NAME=dev:container-test-base" .
