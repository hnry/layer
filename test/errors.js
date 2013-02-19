var shield = require('../index.js');
var should = require('should');


describe('errors', function() {

  it('when proxy can\'t be set', function() {
    var noerr = true;
    var nonproxy = function() {};
    try {
      shield.set(null, nonproxy, function() {});
    } catch(e) {
      noerr = false;
    }
    if (noerr) throw new Error('expected an error');
  });

  it('when unset called on non-proxy', function() {
    var noerr = true;
    var nonproxy = function() {};
    try {
      shield.unset(nonproxy);
    } catch(e) {
      noerr = false;
    }
    if (noerr) throw new Error('expected an error');
  });

});