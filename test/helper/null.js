var layer = require('../../index');
exports.actual = function() {};
//console.log(module.exports);
layer.set(exports, exports.actual, function() {});