'use strict';

var q = require('q');

/***********************************************************************************************************************************************
 *  MAP WRITE VALIDATION
 ***********************************************************************************************************************************************
 * @description
 */

// Left to right composistion
var validators = [readonly];

module.exports = function(store)  {

  return function(data) {
    var def = q.defer(),
        comp;

    // Set up reduce
    validators.unshift(start(data));
    // Run chain
    comp = validators.reduce(function(prev, curr) {
      console.log('PREV: ', prev, 'CURR:', curr)
      return curr(prev());
    });

    console.log('COMP: ', comp)

    return def.promise;
  };
};

function start(data) {
  return function() {
    return data;
  }
}

function readonly(spec) {
  console.log('FROM READ ONLY', spec);
  return spec;
}