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
    // Validation - TODO: consolidate into partial or something
    spec = spec || {};
    spec.data = spec.data || {};
    spec.options = spec.options || {};

    for(var key in spec.data) {
      store.data[key] = spec.data[key];
      store.options[key] = spec.options[key];
    }

    return spec;
  };
};