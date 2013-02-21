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
    // Doing it this way modifies the prototype property for all other Cats too!
    var cat2 = new Cat();
    cat2.meow();
    testData.should.be.equal('purrmeow'); testData = '';

    console.log(Object.keys(cat1))
    console.log(Object.getOwnPropertyNames(cat1))
    console.log(cat1.constructor)
    console.log(cat1 instanceof Cat)
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
          e.message.should.be.equal('Could not set proxy');
        } finally { 
          priv();
        }
      }
    }
    glob.local();
    testData.should.be.equal('private');
  });
});
