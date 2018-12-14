#!/bin/bash

set -e

ROOT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $ROOT_DIR

APP_NAME=${1}
if [ "$APP_NAME" = "" ]; then
  echo "You need to pass first positional argument as APP_NAME"
  exit 1
fi

./build.sh

heroku container:login
heroku container:push --recursive --app $APP_NAME --arg "IMAGE_NAME=dev:container-test-base"
heroku container:release --app $APP_NAME web release
