'use strict';

var Store = require('./store');
var q = require('q');

/***********************************************************************************************************************************************
 *  MAP VALIDATION
 ***********************************************************************************************************************************************
 * @description
 */
module.exports = function(store) {
  return {
    writeable: require('./validation/write')(store),
    readable: require('./validation/read')(store),
    removeable: require('./validation/remove')(store)
  }
};
