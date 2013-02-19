var layer = require('../index.js');
var should = require('should');


describe('errors', function() {
  describe('set', function() {
    it('when `actual` or `proxy` functions are undefined');

    it('when set called but context can\'t be found', function() {
      var noerr = true;
      var nonproxy = function() {};
      try {
        layer.set(null, nonproxy, function() {});
      } catch(e) {
        noerr = false;
      }
      if (noerr) throw new Error('expected an error');
    });
  });

  describe('unset', function() {
    it('when unset called on non-proxy', function() {
      var noerr = true;
      var nonproxy = function() {};
      try {
        layer.unset(nonproxy);
      } catch(e) {
        noerr = false;
      }
      if (noerr) throw new Error('expected an error');
    });
  });

  describe('skip', function() {

  });

  describe('replace', function() {
    
  });

});