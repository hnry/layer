var shield = require('../index.js');
var should = require('should');

describe('shield', function() {

  it('set proxy', function() {
    var testData = '';
    var proxy = function(arg_a, arg_b) {
      testData += 'proxy';
      arg_a.should.equal('no modifications');
      arg_b.should.equal('no modifications');
      arg_a = 'modified by proxy';
      return [arg_a, arg_b];
    }
    var context = {
      actual: function(arg_a, arg_b) {
        testData += 'actual';
        arg_a.should.equal('modified by proxy');
        arg_b.should.equal('no modifications');
      }
    }
    shield.set(context, context.actual, proxy);
    context.actual('no modifications', 'no modifications');
    testData.should.equal('proxyactual');
  });

});