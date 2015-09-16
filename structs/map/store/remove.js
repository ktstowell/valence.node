'use strict';

/***********************************************************************************************************************************************
 * MAP STORE REMOVE
 ***********************************************************************************************************************************************
 * @description
 */
module.exports = function(store) {
  return function(spec) {
    var block = {};

    spec.data.forEach(function(key) {
      block[key] = store.data[key];
      
      delete store.data[key];
      delete store.options[key];
    });

    return block;
  };
};