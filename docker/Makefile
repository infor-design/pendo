include .env

.PHONY: up

validate :
	docker-compose config

build : validate
	docker-compose build

push:
	docker push $(REGISTRY)/$(IMAGE):$(VERSION)
