var layer = require('../index.js');

function Cat() {}
Cat.prototype.meow = function() {
  console.log('meow')
}


var purr = function() {
  console.log('purr')
}


var cat1 = new Cat();
// set for specific Cat
layer.set(Cat.prototype, cat1.meow, purr);
cat1.meow();

// Doing it this way modifies the prototype property for all other Cats too!
var cat2 = new Cat();
cat2.meow();

// set for all Cat
//layer.set(Cat.prototype, Cat.prototype.meow, purr);
//var cat = new Cat();
//cat.meow();
