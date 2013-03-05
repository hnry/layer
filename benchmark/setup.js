var layer = require('../index')
  , bench = require('../../workbench/index');

var actual = {
  args0: function() {},
  args1: function(x) { return x; },
  args2: function(x,y) { return [x,y]; },
  args3: function(x,y,z) { return [x,y,z]; },
  args4: function(a,b,c,d) { return [a,b,c,d]; },
  //args5: function(a,b,c,d,e) {}
}

var args0 = function() {}
  , args1 = function(x) {}
  , args2 = function(x,y) {}
  , args3 = function(x,y,z) {}
  , args4 = function(a,b,c,d) {};


layer.set(actual, actual.args0, args0);
layer.set(actual, actual.args1, args1);
layer.set(actual, actual.args2, args2);
layer.set(actual, actual.args3, args3);
layer.set(actual, actual.args4, args4);

var prettyNum = function(i) {
  var a = i.toString().split('')
    , alen = a.length
    , howMany = Math.floor(alen / 3);
  for (var idx = alen - 3; howMany > 0; howMany--) {
    a.splice(idx, 0, ',');
    idx = idx - 3;
  }
  return a.join('');
}

function runner(fn, name) {
  var cycles = prettyNum(bench.cycles(fn, 5));
  console.log(name, cycles);
}

runner(args0, 'args0');
runner(args1, 'args1');
runner(args2, 'args2');
runner(args3, 'args3');
runner(args4, 'args4');