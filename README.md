[![Build Status](https://travis-ci.org/lovebear/proxy.png)](https://travis-ci.org/lovebear/proxy)


Transparent proxies with very little setup. Doesn't require re-writing existing code. You can just drop it right in!


```
// existing code (lets imagine it's really large)
var add = function(x, y) {
  return x + y;
}

// add a simple proxy without modifying any existing code!
var proxy = require('proxy??');
proxy.set(null, function(x, y) { 
  x = x * 100;
  y = y * 100;
}, add);
```


## Usage / API

proxy.set(context, proxy function, function to proxy)

