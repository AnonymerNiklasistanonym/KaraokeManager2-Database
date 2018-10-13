#!/usr/bin/env make -f

# I am a comment
PROJECT = "KaraokeManager2"

all: install

test: ;@echo "Test ${PROJECT}....."; \
	npm run test

format: ;@echo "Format ${PROJECT}....."; \
	npm run format

server : ;@echo "Starting ${PROJECT}....."; \
	npm start

install: ;@echo "Installing ${PROJECT}....."; \
	./setup.sh; \
	npm install; \
	npm run createImages

update: ;@echo "Updating ${PROJECT}....."; \
	git pull; \
	npm install

document: ;@echo "Creating docs ${PROJECT}....."; \
	npm run documentation; \
	npm run jsdoc; \
	npm run typedoc;

clean : ;@echo "Clean ${PROJECT}....."; \
	rm -rf node_modules; \
	rm -rf docs; \
	rm -rf log; \
	rm -rf http2; \
	rm -rf dh; \
	rm -rf uploads; \
	rm -rf public/favicons; \
	rm -rf public/pictures; \
	rm -rf build; \
	rm -rf database; \
	rm -f database.db; \
	rm -f package-lock.json; \
	find views -name "*.html" -type f -delete
