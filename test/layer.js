var layer = require('../index.js');
var should = require('should');

var testData, proxy, context;

var testProxy = function(fn) {
  var r = fn('no modifications', 'no modifications');
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
      },
      replaceTest: function(x, y) {
        throw new Error('it didn\'t replace');
      }
    }
  })

  describe('set', function() {

    it('proxy', function() {
      layer.set(context, context.actual, proxy);
      testProxy(context.actual);
      context.actual.skip.should.be.a('function');
      should.exist(context.actual.skip._context);
    });

    it('errors when can\'t set', function() {
      var noerr = true;
      var nonproxy = undefined;
      try {
        layer.set(null, nonproxy, function() {});
      } catch(e) {
        noerr = false;
      }
      if (noerr) throw new Error('expected an error');
    });

  });


  describe('unset', function() {

    it('proxy', function() {
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

    it('throws error when can\'t unset', function() {
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

    it('proxy', function() {
      layer.set(context, context.actual, proxy);
      var r = context.actual.skip('no mod', 'no mod');
      r[0].should.equal('no mod');
      r[1].should.equal('no mod');
      testData.should.equal('actual');
    });

  });


  describe('replace', function() {

    it('replace function', function() {
      layer.replace(context, context.actual, function(x, y) {
        return 'replaced func' + x + y;
      });
      var r = context.actual('1', '2');
      r.should.be.equal('replaced func12');
      r = context.actual('1', '2');
      r.should.be.equal('replaced func12');
      should.not.exist(context.actual.skip);
      should.not.exist(context.actual._context);
    });

    it('throws error when can\'t replace');

  });


  it('Stop, stops', function() {
    var stop = new layer.Stop;
    stop.should.be.an.instanceof(layer.Stop);
    /*
      TODO test stop actually stops
    */
  });

});