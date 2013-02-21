'use strict';

var layer = {};

// assume browser
layer.environment = 'browser';
if (typeof module !== 'undefined' && module.exports) layer.environment = 'nodejs';

/*
 * this is only good for browser's
 * require.js will mess this up
 * find a better default for node
 * aka we need to detect environment
 */
layer._default_context = this;
if (layer.environment === 'nodejs') layer._default_context = module.parent.exports;

layer._find_context = function(context, actual, level) {
  var props = Object.keys(context);
  //if (actual && proxy) 
  for (var i = 0, l = props.length; i < l; i++) {
    var orig = context[props[i]];
    if (orig && orig === actual) {
      //var orig_arg_len = context[props[i]].length;
      return [context, props[i]];
    }
  }
}

layer.set = function(context, actual, proxy) {
  var completed = false;

  if (!context) context = layer._default_context;

  var ctx = this._find_context(context, actual, 0);
  if (ctx) {
    var orig = ctx[0][ctx[1]];
    ctx[0][ctx[1]] = function () {
      var ret = proxy.apply(ctx[0], Array.prototype.slice.call(arguments));
      if (ret) ret = Array.prototype.slice.call(ret);
      var actualRet = orig.apply(ctx[0], ret);
      if (actualRet) return actualRet;
    }
    ctx[0][ctx[1]].skip = orig;
    ctx[0][ctx[1]].skip._context = ctx[0];
    completed = true;
  }

  if (!completed) throw new Error('Could not set proxy');
}

layer.unset = function(proxy) {
  var completed = false;
  var orig = proxy.skip;
  if (proxy.skip && proxy.skip._context) {
    var ctx = this._find_context(proxy.skip._context, proxy, 0);
    if (ctx) {
      ctx[0][ctx[1]] = orig;
      if (orig._context) delete(orig._context);
      completed = true;
    }
  }
  if (!completed) throw new Error('Could not unset proxy');
}

// node
if (layer.environment === 'nodejs') module.exports = layer;