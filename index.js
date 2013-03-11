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

layer._call = function(ctx, fn, args) {
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
    case 4:
      ret = fn.call(ctx, args[0], args[1], args[2], args[3]);
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
      var fns = [proxy, orig];
      return function() {
        var idx, args = arguments, ret;
        function next() {
          var r;
          if (idx === undefined) {
            idx = 0;
          } else {
            idx += 1;
            args = arguments;
          }
          // last stop
          if (fns.length === idx + 1) {
            r = layer._call(ctx[0], fns[idx], args);
          } else {
            // avoid using array slice, this is faster
            var alen = args.length;
            args[alen] = next;
            args.length = alen + 1;
            r = layer._call(ctx[0], fns[idx], args);
          }
          if (r) ret = r;
        };
        next();
        return ret;
      }
    }();
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