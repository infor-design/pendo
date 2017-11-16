#!/bin/bash

npm prune && npm install && gulp

API_USER=hookandloop
API_PASS=hookandloop

VERSION=$(node -p -e "require('./package.json').version")
CONTAINER=$(node -p -e "require('./package.json').name")
NGINX_PATH="$CONTAINER-$(echo $VERSION | tr "." -)"
ORG=hookandloop
REGISTRY=docker.infor.com
NETWORK=soho-pool
PORT=4000
SWARM_URL=http://usalvlhlpool1.infor.com/swarmproxy
NGINX_URL=http://usalvlhlpool1/swarm/

# Create Dockerfile
# Using the pendo-styles image to house the appication code.
printf "
FROM docker.infor.com/hookandloop/pendo-styles-base:1.0.0
MAINTAINER Hook & Loop Dev <hookandloopjenkins@gmail.com>\n
ADD ./site /app/site\n
ADD ./scripts/server.py /app/scripts/\n
RUN npm install -g browser-sync\n" > Dockerfile

# Build and push container
docker build -t $REGISTRY/$ORG/$CONTAINER:$VERSION .
docker push $REGISTRY/$ORG/$CONTAINER:$VERSION

# Remove Dockerfile
rm -rf Dockerfile

# Remove current running service.
curl -X DELETE -H "Content-Type: application/json" \
    -u $API_USER:$API_PASS \
    $SWARM_URL/rm_service/ \
    -d '{"name":"'"$CONTAINER-$(echo $VERSION | tr "." -)"'"}'
 
# Add updated service.
curl -X POST -H "Content-Type: application/json" \
    -u $API_USER:$API_PASS \
    $SWARM_URL/create_service/ \
    -d '{"version":"'"$VERSION"'","name":"'"$CONTAINER-$(echo $VERSION | tr "." -)"'","network":"'"$NETWORK"'","label":"'"endpoint=$NGINX_PATH"'","env":"'"BASEPATH=/$NGINX_PATH/"'","port":"'"$PORT"'","image":"'"$REGISTRY/$ORG/$CONTAINER:$VERSION"'"}'

# This should just happen automatically on the backend.
# TODO: Find out why its not...
curl -X POST -u $API_USER:$API_PASS $NGINX_URL/update_config
