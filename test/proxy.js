var shield = require('../index.js');
var should = require('should');

describe('shield', function() {

  it('set proxy', function() {
    var testData = '';

    var proxy = function() {
      testData += 'proxy';
    }

    var actual = function() {
      testData += 'actual';
    }

    shield.set(null, proxy, actual);
    actual();

    testData.should.equal('proxyactual');
  });

});