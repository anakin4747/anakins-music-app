.PHONY: test test:e2e server install

test: node_modules
	npm test

test\:e2e: node_modules
	npm run test:e2e

server: node_modules
	npm run start:dev

node_modules: package.json
	npm install

