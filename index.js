var shield = {};
shield.set = function(context, actual, proxy) {
  if (!context) {
    context = global;
  }
  var props = Object.keys(context);
  for (var i = 0, l = props.length; i < l; i++) {
    var orig = context[props[i]];
    if (orig.toString() === actual.toString()) {
      //var orig_arg_len = context[props[i]].length;
      context[props[i]] = function () {
        var ret = proxy.apply(null, Array.prototype.slice.call(arguments));
        if (ret) ret = Array.prototype.slice.call(ret);
        var actualRet = orig.apply(null, ret);
        if (actualRet) return actualRet;
      }
      context[props[i]].skip = orig;
      context[props[i]].skip._context = context;
    }
  }
}
shield.unset = function(proxy) {
  var orig = proxy.skip;
  var props = Object.keys(proxy.skip._context);
  for (var i = 0, l = props.length; i < l; i++) {
    if (proxy.skip._context[props[i]].toString() === proxy.toString()) {
      proxy.skip._context[props[i]] = orig;
      if (orig._context) delete(orig._context);
    }
  }
}
// node
if (module && module.exports) module.exports = shield;