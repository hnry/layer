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

layer.set = function(context, actual, proxy) {
  var completed = false;

  if (!context) context = layer._default_context;

  var props = Object.keys(context);
  //if (actual && proxy) 
  for (var i = 0, l = props.length; i < l; i++) {
    var orig = context[props[i]];
    if (orig && orig === actual) {
      //var orig_arg_len = context[props[i]].length;
      context[props[i]] = function () {
        var ret = proxy.apply(null, Array.prototype.slice.call(arguments));
        if (ret) ret = Array.prototype.slice.call(ret);
        var actualRet = orig.apply(null, ret);
        if (actualRet) return actualRet;
      }
      context[props[i]].skip = orig;
      context[props[i]].skip._context = context;
      completed = true;
      break;
    }
  }
  if (!completed) throw new Error('Could not set proxy');
}

layer.unset = function(proxy) {
  var completed = false;
  var orig = proxy.skip;
  if (proxy.skip && proxy.skip._context) {
    var props = Object.keys(proxy.skip._context);
    for (var i = 0, l = props.length; i < l; i++) {
      if (proxy.skip._context[props[i]].toString() === proxy.toString()) {
        proxy.skip._context[props[i]] = orig;
        if (orig._context) delete(orig._context);
        completed = true;
        break;
      }
    }
  }
  if (!completed) throw new Error('Could not unset proxy');
}

// node
if (layer.environment === 'nodejs') module.exports = layer;