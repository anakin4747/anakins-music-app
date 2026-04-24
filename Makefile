.PHONY: test server install

test: node_modules
	npm test

server: node_modules
	npm start

node_modules: package.json
	npm install

