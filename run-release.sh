#!/bin/bash

set -e

ROOT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $ROOT_DIR

docker run --network="container-test_app-network" --env "REDIS_URL=redis://redis:6379/" container-test_release
