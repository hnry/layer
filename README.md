[![Build Status](https://travis-ci.org/lovebear/layer.png)](https://travis-ci.org/lovebear/layer)

# layer

Unobtrusive transparent proxies with very little setup. Doesn't require re-writing existing code. You can just drop it right in!

Runs anywhere there's javascript (browser & node).

--> (layer) --> (function/object)


```js
// add a simple proxy without modifying any existing code!
var addBig = function(x, y, next) { 
  x = x * 100;
  y = y * 100;
  next(x, y);
}

var that = this;
layer.set(that, add, addBig);

// existing code...
function add(x, y) {
  return x + y;
}

add(2, 2); // 400
```
And that's it, all instances of calling `add()` in your existing code now go through `addBig()` then `add()`

You don't re-write your code! Or have to call `addBig()` directly.

(Note: this won't work in node.js because `add` is private, see [here](#some-advice-on-knowing-the-context).)

For some fun stuff you can do with layer, check out [intercept.js](https://github.com/lovebear/intercept.js).

## Usage / API

### Setting a proxy

`layer.set(context, function to proxy, proxy function)`

Context being scope or this, read more about it [here](#some-advice-on-knowing-the-context).

In the browser when you set 'null' as the context, it'll default to global (browser only).

### Unsetting a proxy

`layer.unset(func)` or following the example: `layer.unset(add)`

### Skipping your proxy
For those times when you want turn skip a layer...

`func.skip()` or following out add example `add.skip(2, 2)`

### Replacing not proxying (monkey patching)

`layer.replace(context, function to replace, new function)`

### Stopping a proxy early

At anytime you may stop early by not calling `next`.

And either call your callback (async) or return (sync);

## Install

- node:
`npm install layer`

- browser:
use `layer.min.js`


## Some advice on knowing the context. 

(You can't proxy private variables!)

Because they're private. Not a big deal, and it's obvious enough. But keep in mind that in a node.js, the root of the module all your var's are effectively private (so the readme example above will not work).

Work around would be `exports.add` and the context being 'exports' would work.
Or if add was in an object `var obj = { add: ... }`, context being 'obj'.

(Basically, it works like normal except for private variables.)

Some more examples:

```js
var somelib = require('somelib'); 
layer.set(somelib, somelib.func, proxyFn)
```

```js
function Cat() {}
Cat.prototype.meow = function() {...}

layer.set(Cat.prototype, Cat.prototype.meow, proxyFn)
```
