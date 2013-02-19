[![Build Status](https://travis-ci.org/lovebear/shield.png)](https://travis-ci.org/lovebear/shield)

# shield

Unobtrusive transparent proxies with very little setup. Doesn't require re-writing existing code. You can just drop it right in!

Runs anywhere there's javascript (browser & node).

--> (shield) --> (function/object)


```js
// existing code (lets imagine it's really large)
var add = function(x, y) {
  return x + y;
}

add(2 + 2);

// add a simple proxy without modifying any existing code!
var addBig = function(x, y) { 
  x = x * 100;
  y = y * 100;
}
shield.set(null, add, addBig);
```
And that's it, all instances of calling `add()` in your existing code now go through `addBig()` then `add()`

You don't re-write your code! Or have to call `addBig()` directly.


## Usage / API

shield.set(context, function to proxy, proxy function)
