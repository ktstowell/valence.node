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
    write: require('./validation/write')(store),
    read: require('./validation/read')(store),
    remove: require('./validation/remove')(store)
  }
};
