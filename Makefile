.PHONY: start install

start: node_modules
	npm start

node_modules: package.json
	npm install

