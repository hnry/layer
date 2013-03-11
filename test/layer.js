var layer = require('../index.js')
  , should = require('should')
  , bench = require('../benchmark/setup');

var testData, proxy, context;

var testProxyRunner = function(fn) {
  var r = fn('no modifications', 'no modifications');
  r[0].should.equal('modified by proxy');
  r[1].should.equal('no modifications');
  testData.should.equal('proxyactual');
}

describe('layer', function() {

  beforeEach(function() {
    testData = '';
    proxy = function(arg_a, arg_b, next) {
      testData += 'proxy';
      arg_a.should.equal('no modifications');
      arg_b.should.equal('no modifications');
      arg_a = 'modified by proxy';
      next(arg_a, arg_b);
    }
    context = {
      actual: function(arg_a, arg_b) {
        testData += 'actual';
        return [arg_a, arg_b];
      },
      // used for replace test
      replaceTest: function(x, y) {
        throw new Error('it didn\'t replace');
      }
    }
  })

  describe('set', function() {

    beforeEach(function() {
      testData = '';
    });

    it('proxy', function() {
      layer.set(context, context.actual, proxy);
      testProxyRunner(context.actual);
      context.actual.skip.should.be.a('function');
      should.exist(context.actual.skip._context);
    });

    it('errors when can\'t set', function() {
      var noerr = true;
      var nonproxy = undefined;
      try {
        layer.set(null, nonproxy, function() {});
      } catch(e) {
        e.message.should.match(/context/);
        noerr = false;
      }
      if (noerr) throw new Error('expected an error');
    });

    // old test case, doesn't really apply anymore
    it('non-array return', function() {
      context.nonarrayReturn = function(x) {
        x.should.eql({a: 1})
        testData += 'actual';
      }
      layer.set(context, context.nonarrayReturn, function(y, next) {
        y.should.eql(2);
        testData += 'proxy';
        next({a: 1});
      });
      context.nonarrayReturn(2);
      testData.should.be.equal('proxyactual');
    });

    it('no arguments uses call instead of apply', function() {
      context.noargs = function() {
        // since arguments is {} then call was used over apply
        arguments.should.eql({});
        testData += 'actual';
      }
      layer.set(context, context.noargs, function(next) { testData = 'proxy'; next(); });
      context.noargs();
      testData.should.be.equal('proxyactual');
    });

    it('maintains scope of the original function', function() {
      context.maintains = 'scope';
      layer.set(context, context.actual, function(next) { 
        this.maintains.should.be.equal('scope');
        testData += 'proxy';
        next();
      });
      context.actual();
      testData.should.be.equal('proxyactual');
    });

    it('async proxy', function(done) {
      var ctxAsync = {
        actual: function(arg, cb) {
          // ensure last function doesn't get a layer cb
          arguments.length.should.be.equal(2);
          testData += arg + 'actual';
          cb();
        }
      }

      var proxyAsync = function (arg, cb, donee) {
        setTimeout(function() {
          testData += arg + 'proxy';
          donee(arg + 'modified', cb);
        }, 1);
      }

      layer.set(ctxAsync, ctxAsync.actual, proxyAsync);
      ctxAsync.actual(123, function() {
        testData.should.be.equal('123proxy123modifiedactual');
        done();
      });
    });

    it.skip('multiple (async/sync) proxies', function() {

    });

    it('forwards the proper arguments', function() {
      bench(true);
    })

  });


  describe('unset', function() {

    it('proxy', function() {
      // double check proxy is set
      layer.set(context, context.actual, proxy);
      testProxyRunner(context.actual);

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
        e.message.should.match(/unset/);
        noerr = false;
      }
      if (noerr) throw new Error('expected an error');
    });

    /*
     *  It'll unset all proxies (for now?)
     */
    it('multiple (async/sync) proxies');

  });


  describe('skip', function() {

    it('directly', function() {
      layer.set(context, context.actual, proxy);
      var r = context.actual.skip('no mod', 'no mod');
      r[0].should.equal('no mod');
      r[1].should.equal('no mod');
      testData.should.equal('actual');
    });
    
    it.skip('within proxy', function() {
      // sync
      var proxyFunc = function(a, b, next) {
        next.skip(a, b);
      }

      // async
      proxyFunc = function(a, b, cb, next) {
        setTimeout(function() {
          next.skip(a, b, cb);
        }, 1);
      }
      
    });

    /*
     *  It'll skip all proxies (for now?)
     */
    it('multiple (async/sync) proxies');

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

    it('throws error when can\'t replace', function() {
      var err = false;
      try {
        layer.replace(context, undefined, function() { });
      } catch(e) {
        e.message.should.match(/context/);
        err = true;
      }
      if (!err) throw new Error('Expected an error');
    });

  });

  /*
   *  Basically to stop early, you don't call next
   */
  it('stopping a proxy', function(done) {
    var ctx = {
      actual: function() {
        throw new Error('did not stop');
      }
    }
    // sync
    var proxyFunc = function(a, next) {
      testData += 'proxy';
      return a;
    }
    layer.set(ctx, ctx.actual, proxyFunc);
    var ret = ctx.actual('test');
    testData.should.be.equal('proxy');
    ret.should.be.equal('test');

    // async
    proxyFunc = function(a, cb, next) {
      setTimeout(function() {
        testData += 'proxy';
        cb(a);
      }, 1);
    }
    testData = ''; // reset testData
    var ret = layer.set(ctx, ctx.actual, proxyFunc);
    ctx.actual('test', function(a) {
      a.should.be.equal('test');
      testData.should.be.equal('proxy');
      should.not.exist(ret);
      done();
    });
  });

});