var shield = require('../index.js');
var should = require('should');

var testData, proxy, context;

var testProxy = function() {
  var r = context.actual('no modifications', 'no modifications');
  r[0].should.equal('modified by proxy');
  r[1].should.equal('no modifications');
  testData.should.equal('proxyactual');
}

describe('shield', function() {

  beforeEach(function() {
    testData = '';
    proxy = function(arg_a, arg_b) {
      testData += 'proxy';
      arg_a.should.equal('no modifications');
      arg_b.should.equal('no modifications');
      arg_a = 'modified by proxy';
      return [arg_a, arg_b];
    }
    context = {
      actual: function(arg_a, arg_b) {
        testData += 'actual';
        return [arg_a, arg_b];
      }
    }
  })

  it('set proxy', function() {
    shield.set(context, context.actual, proxy);
    testProxy();
  });

  it('skips proxy', function() {
    shield.set(context, context.actual, proxy);
    var r = context.actual.skip('no mod', 'no mod');
    r[0].should.equal('no mod');
    r[1].should.equal('no mod');
    testData.should.equal('actual');
  });

  it('unset proxy', function() {
    // double check proxy is set
    shield.set(context, context.actual, proxy);
    //testProxy();

    shield.unset(context.actual);
    var r = context.actual('no modifications', 'no modifications');
    r[0].should.equal('no modifications');
    r[1].should.equal('no modifications');
    testData.should.equal('proxyactualactual');
    should.not.exist(context.actual.skip);
    should.not.exist(context.actual._context);
  });

  it('find context', function() {
    shield.set(null, context.actual, proxy);
    testProxy();
  });

});