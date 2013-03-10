release:
		make dist && make pack

dist:
		echo "// Copyright 2013 lovebear https://github.com/lovebear/layer.js" > layer.min.js
		./node_modules/uglify-js/bin/uglifyjs ./index.js -mc >> layer.min.js

pack:
		rm -rf package; rm -rf layer*.tgz; 
		npm pack .

bench:
		node benchmark/run.js

test:
		./node_modules/mocha/bin/mocha -R spec

.PHONY: test

