#!/usr/bin/env make -f

# I am a comment
PROJECT = "My KaraokeManager2-Database Node.js project"

all: install test

test: ;@echo "Test ${PROJECT}....."; \
	npm run test

server : ;@echo "Starting ${PROJECT}....."; \
	npm start

install: ;@echo "Installing ${PROJECT}....."; \
	./setup.sh; \
	npm install

update: ;@echo "Updating ${PROJECT}....."; \
	git pull; \
	npm install

clean : ;@echo "Clean ${PROJECT}....."; \
	rm -rf node_modules; \
	rm -rf docs; \
	rm -rf log; \
	rm -rf http2; \
	rm -rf dh; \
	rm -rf build; \
	rm -rf database; \
	rm -f database.db; \
	rm -f package-lock.json; \
	git clean -dfx
