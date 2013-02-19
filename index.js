var shield = {};

shield.set = function(context, actual, proxy) {
  if (!context) {
    // figure out a reasonable context
  }

  var props = Object.keys(context);
  for (var i = 0, l = props.length; i < l; i++) {
    var original = context[props[i]];
    if (original.toString() === actual.toString()) {
      //var orig_arg_len = context[props[i]].length;
      context[props[i]] = function () {
        var ret = proxy.apply(null, Array.prototype.slice.call(arguments));
        if (ret) ret = Array.prototype.slice.call(ret);
        original.apply(null, ret);
      }
    }
  }
}

// node
if (module && module.exports) module.exports = shield;