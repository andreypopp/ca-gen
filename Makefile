install:
	npm install browserify regeneratorify regenerator bluebird gens jsonp

bundle.js: index.js
	./node_modules/.bin/browserify -d -t regeneratorify $< > $@

