var shield = {};

shield.set = function(context, proxy, actual) {
  if (!context) {
    context = this;
  }

  var props = Object.keys(context);
}

// node
if (module && module.exports) module.exports = shield;