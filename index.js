'use strict';

var layer = {};

if (typeof module !== 'undefined' && module.exports) layer._isNode = true;
(layer._isNode) ? layer._default_context = {} : layer._default_context = this;

layer._find_context = function(context, actual) {
  var props = Object.keys(context);
  for (var i = 0, l = props.length; i < l; i++) {
    var orig = context[props[i]];
    if (orig && orig === actual) {
      //var orig_arg_len = context[props[i]].length;
      return [context, props[i]];
    }
  }
  throw new Error('Unable to find context');
}

layer.Stop = function() {};

layer._call = function(ctx, fn, args) {
  // this is worth doing for the performance
  var ret;
  switch(args.length) {
    case 0:
      ret = fn.call(ctx);
      break;
    case 1:
      ret = fn.call(ctx, args[0]);
      break;
    case 2:
      ret = fn.call(ctx, args[0], args[1]);
      break;
    case 3:
      ret = fn.call(ctx, args[0], args[1], args[2]);
      break;
    default:
      ret = fn.apply(ctx, args);
      break;
  }
  return ret;
}

layer.set = function(context, actual, proxy) {
  var completed = false;
  if (!context) context = layer._default_context;
  var ctx = this._find_context(context, actual, this._context_level);
  if (ctx) {
    var orig = ctx[0][ctx[1]];
    ctx[0][ctx[1]] = function () {
      var ret = layer._call(ctx[0], proxy, Array.prototype.slice.call(arguments));
      //  Unless ret is true and ret is an instace of layer.Stop...
      if (!(!!ret && (ret instanceof layer.Stop))) {
        var actualRet;
        if (ret) {
          if (Array.isArray(ret)) {
            ret = Array.prototype.slice.call(ret);
            actualRet = layer._call(ctx[0], orig, ret);
          } else {
            actualRet = orig.call(ctx[0], ret);
          }
        } else {
          actualRet = orig.call(ctx[0]);
        }
        if (actualRet) return actualRet;
      }
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
    var ctx = this._find_context(proxy.skip._context, proxy, this._context_level);
    if (ctx) {
      if (orig._context) delete(orig._context);
      ctx[0][ctx[1]] = orig;
      completed = true;
    }
  }
  if (!completed) throw new Error('Could not unset proxy');
}

layer.replace = function(context, actual, newFn) {
  var completed = false;
  var ctx = this._find_context(context, actual, this._context_level);
  if (ctx) {
    ctx[0][ctx[1]] = newFn;
    completed = true;
  }
  if (!completed) throw new Error('Could not replace function');
}

if (layer._isNode) module.exports = layer;