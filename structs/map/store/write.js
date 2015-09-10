'use strict';

/***********************************************************************************************************************************************
 * WRITE
 ***********************************************************************************************************************************************
 * @description
 */
module.exports = function(store) {
  /**
   * [write description]
   * @param  {[type]} spec [description]
   * @return {[type]}      [description]
   */
  return function write(spec) {
    var block = {};

    if(!spec || spec && (!spec.value || !spec.data)) {
      throw new Error('Valence - Map: could not write to map. Insufficient data provided.');
    }

    // Create a write-block that gets returned
    // and prepares data for being written to the store.
    spec.data.forEach(function(key) {
      block[key] = spec.value;
    });

    // Write data and options to "permanent"
    // memory structure
    for(var key in block) {
      store.data[key] = block[key];
      store.options[key] = spec.options;
    }

    return block;
  };
};