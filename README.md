[![Build Status](https://travis-ci.org/lovebear/shield.png)](https://travis-ci.org/lovebear/shield)

# shield

Unobtrusive transparent proxies with very little setup. Doesn't require re-writing existing code. You can just drop it right in!

Runs anywhere there's javascript (browser & node).

--> (shield) --> (function/object)


```js
// add a simple proxy without modifying any existing code!
var addBig = function(x, y) { 
  x = x * 100;
  y = y * 100;
  return [x, y];
}
shield.set(null, add, addBig);

// existing code...
var add = function(x, y) {
  return x + y;
}

add(2, 2);
```
And that's it, all instances of calling `add()` in your existing code now go through `addBig()` then `add()`

You don't re-write your code! Or have to call `addBig()` directly.


## Usage / API

### Setting a proxy

`shield.set(context, function to proxy, proxy function)`

### Skipping your proxy
For those times when you want turn the shields down...

`func.skip()` or following out add example `add.skip(2, 2)`

### Unsetting a proxy

`shield.unset(func)` or following the example: `shield.unset(add)`
