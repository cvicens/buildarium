#!/bin/sh

. ./image-env.sh

docker build -t ${IMAGE_NAME}:${IMAGE_VERSION} .
docker tag ${IMAGE_NAME}:${IMAGE_VERSION} ${REMOTE_IMAGE}
