#!/bin/sh

export REGISTRY=quay.io
export REGISTRY_USER_ID=cvicensa
export IMAGE_NAME=buildarium
export IMAGE_VERSION=0.1

export REMOTE_IMAGE=${REGISTRY}/${IMAGE_NAME}:${IMAGE_VERSION}