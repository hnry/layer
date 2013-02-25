'use strict';

/*
 *  Possible use case scenarios 
 *  where things should work, or pitfalls to watch out for
 */
var layer = require('../index.js')
  , should = require('should');

var testData;
describe('layer', function() {
  beforeEach(function() {
    testData = '';
  });

  it('async proxy');

  /*
   *  Sets multiple proxies are different times async or sync
   *  Can still skip and unset
   */
  it('proxies a proxy that\'s a proxy of another proxy');  

  /*
   *  proxying a prototype function, will proxy a protoype 
   *  function! (for now at least ;) )
   */
  it('prototype proxy', function() {
    function Cat() {}
    Cat.prototype.meow = function() {
      testData += 'meow';
    }

    var purr = function() {
      testData += 'purr';
    }

    var cat1 = new Cat();
    // set for specific Cat
    layer.set(Cat.prototype, cat1.meow, purr);
    cat1.meow();
    testData.should.be.equal('purrmeow'); testData = '';
    // Doing this modifies the prototype property for all other Cats too!
    var cat2 = new Cat();
    cat2.meow();
    testData.should.be.equal('purrmeow'); testData = '';

    // when no context is given, it should be obvious to find the right context
    layer.unset(cat1.meow);
    layer.set(null, cat1.meow, purr);
    cat1.meow();
    testData.should.be.equal('purrmeow'); testData = '';

    layer.unset(cat1.meow);
    // the much more obvious way
    layer.set(Cat.prototype, Cat.prototype.meow, purr);
    var cat = new Cat();
    cat.meow();
    testData.should.be.equal('purrmeow');   
  });

  /*
   *  private is private!
   */
  it('doesn\'t work on private var', function() {
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
