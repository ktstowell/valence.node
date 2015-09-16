'use strict';

/***********************************************************************************************************************************************
 * MAP STORE READ
 ***********************************************************************************************************************************************
 * @description
 */
module.exports = function(store) {
  return function read(spec) {
    var block = {};

    if(!spec || spec && !spec.keys) {
      throw new Error('Valence - Map: could not read from map. Insufficient query.');
    }

    spec.keys.filter(function(key) {
      return store.data[key];
    }).forEach(function(key) {
      block[key] = store.data[key];
    });

    if(Object.keys(block).length) {
      spec.results = block;
    }

    return spec;
  }
};