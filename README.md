[![Build Status](https://travis-ci.org/lovebear/shield.png)](https://travis-ci.org/lovebear/shield)

# shield

Unobtrusive transparent proxies with very little setup. Doesn't require re-writing existing code. You can just drop it right in!

--> (shield) --> (function/object)


```js
// existing code (lets imagine it's really large)
var add = function(x, y) {
  return x + y;
}

// add a simple proxy without modifying any existing code!
var shield = require('shield');
var addBig = function(x, y) { 
  x = x * 100;
  y = y * 100;
}
shield.set(null, addBig, add);
```


## Usage / API

shield.set(context, proxy function, function to proxy)
