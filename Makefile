.PHONY: build up down logs

ENV ?= dev

build:
	docker-compose -f docker-compose.$(ENV).yml build

up:
	docker-compose -f docker-compose.$(ENV).yml up -d

down:
	docker-compose -f docker-compose.$(ENV).yml down

logs:
	docker-compose -f docker-compose.$(ENV).yml logs -f

test-back:
	docker exec -it my-app_backend_1 deno test

test-front:
	docker exec -it my-app_frontend_1 npm test

prepare:
	cp hooks/pre-commit .git/hooks/pre-commit && chmod +x .git/hooks/pre-commit
	cp hooks/commit-msg .git/hooks/commit-msg && chmod +x .git/hooks/commit-msg