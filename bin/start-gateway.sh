#!/bin/bash

set -eo pipefail

set -x

if [ -f /opt/workshop/envvars/gateway.sh ]; then
    set -a
    . /opt/workshop/envvars/gateway.sh
    set +a
fi

if [ -f /opt/app-root/envvars/gateway.sh ]; then
    set -a
    . /opt/app-root/envvars/gateway.sh
    set +a
fi

URI_ROOT_PATH=
export URI_ROOT_PATH

cd /opt/workshop/gateway

NODE_PATH=`pwd`/node_modules
export NODE_PATH

exec npm run prod
