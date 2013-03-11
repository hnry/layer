'use strict';

var layer = require('../index.js')
  , should = require('should');

var testData;

describe('context', function() {

  it('_find_context', function() {
    var ctx = {
      actual: function() {}
    }
    var ret = layer._find_context(ctx, ctx.actual);
    ret[0].should.be.equal(ctx);
    ret[1].should.be.equal('actual');

    // throws error when no context found
    // also test ===
    var err = false;
    var fakectx = {
      actual: function() {}
    }
    try {
      layer._find_context(fakectx, ctx.actual);
    } catch(e) {
      e.message.should.match(/context/);
      err = true;
    }
    if (!err) throw new Error('_find_context did not throw error');
  });

  /*
   *  Possible use case scenarios 
   *  where things should work, or pitfalls to watch out for
   */
  describe('use cases', function() {

    beforeEach(function() {
      testData = '';
    });

    /*
     *  proxying a prototype function, will proxy a protoype 
     *  function (for now ?) )
     */
    it('prototype', function() {
      function Cat() {}
      Cat.prototype.meow = function() {
        testData += 'meow';
      }

      var purr = function(next) {
        testData += 'purr';
        next();
      }

      var cat1 = new Cat();
      // set for specific Cat
      layer.set(Cat.prototype, cat1.meow, purr);
      cat1.meow();
      testData.should.be.equal('purrmeow'); 

      testData = '';
      // Doing this modifies the prototype property for all other Cats too!
      var cat2 = new Cat();
      cat2.meow();
      testData.should.be.equal('purrmeow'); 

      testData = '';
      layer.unset(cat1.meow);
      // the much more obvious way
      layer.set(Cat.prototype, Cat.prototype.meow, purr);
      var cat = new Cat();
      cat.meow();
      testData.should.be.equal('purrmeow');   
    });

    /*
     *  private is private! (it won't work)
     */
    it('private var', function() {
      var glob = {
        local: function() {
          var priv = function() {
            testData += 'private';
          }
          try {
            layer.set(this, priv, function() { testData += 'proxy' })
          } catch(e) {
            e.message.should.be.equal('Unable to find context');
          } finally { 
            priv();
          }
        }
      }
      glob.local();
      testData.should.be.equal('private');
    });

  });


  /*
   *  Context helper, situations where layer will guess context
   */
  describe('helper', function() {

    it('node module.exports', function() {
      if (layer._isNode) {
        // layer will throw a can't find context error if this fails
        var nullHelper = require('./helper/null.js');
      }
    });

    /*
     *  When a constructor is given, but really you want the prototype
     */
    it.skip('prototype not constructor', function() {
      // when no context is given, it should be obvious to find the right context
      layer.unset(cat1.meow);
      layer.set(null, cat1.meow, purr);
      cat1.meow();
      testData.should.be.equal('purrmeow'); testData = '';
    });
  });

});
