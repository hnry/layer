var layer = require('../index.js');
var should = require('should');

var testData, proxy, context;

var testProxy = function(f) {
  var r = f('no modifications', 'no modifications');
  r[0].should.equal('modified by proxy');
  r[1].should.equal('no modifications');
  testData.should.equal('proxyactual');
}

describe('layer', function() {

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

  it('sets proxy', function() {
    layer.set(context, context.actual, proxy);
    testProxy(context.actual);
    context.actual.skip.should.be.a('function');
    should.exist(context.actual.skip._context);
  });

  it('skips proxy', function() {
    layer.set(context, context.actual, proxy);
    var r = context.actual.skip('no mod', 'no mod');
    r[0].should.equal('no mod');
    r[1].should.equal('no mod');
    testData.should.equal('actual');
  });

  it('unsets proxy', function() {
    // double check proxy is set
    layer.set(context, context.actual, proxy);
    testProxy(context.actual);

    layer.unset(context.actual);
    var r = context.actual('no modifications', 'no modifications');
    r[0].should.equal('no modifications');
    r[1].should.equal('no modifications');
    testData.should.equal('proxyactualactual');
    should.not.exist(context.actual.skip);
    Object.keys(context.actual).should.have.lengthOf(0);
  });

  /*
   *  should be smart enough to know when you look up a prototype chain
   *  or find the right scope
   */
  it('finds context', function() {
    layer.set(null, context.actual, proxy);
    testProxy(context.actual);
  });

  it('replace', function() {
    layer.replace(context, context.actual, proxy);
    var r = context.actual.skip('no mod', 'no mod');
    r[0].should.equal('no mod');
    r[1].should.equal('no mod');
    testData.should.equal('actual');
  });

  it('async proxy');

  /*
   *  Sets multiple proxies are different times async or sync
   *  Can still skip and unset
   */
  it('proxies a proxy that\'s a proxy of another proxy');  
});