[![Build Status](https://travis-ci.org/lovebear/layer.png)](https://travis-ci.org/lovebear/layer)

# layer

Unobtrusive transparent proxies with very little setup. Doesn't require re-writing existing code. You can just drop it right in!

Runs anywhere there's javascript (browser & node).

--> (layer) --> (function/object)


```js
// add a simple proxy without modifying any existing code!
var addBig = function(x, y) { 
  x = x * 100;
  y = y * 100;
  return [x, y];
}
layer.set(null, add, addBig);

// existing code...
function add(x, y) {
  return x + y;
}

add(2, 2); // 400
```
And that's it, all instances of calling `add()` in your existing code now go through `addBig()` then `add()`

You don't re-write your code! Or have to call `addBig()` directly.


## Usage / API

### Setting a proxy

`layer.set(context, function to proxy, proxy function)`

### Skipping your proxy
For those times when you want turn skip a layer...

`func.skip()` or following out add example `add.skip(2, 2)`

### Unsetting a proxy

`layer.unset(func)` or following the example: `layer.unset(add)`

### Replacing not proxying (monkey patching)

`layer.replace(context, function to replace, new function)`
