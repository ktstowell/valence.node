'use strict';

/***********************************************************************************************************************************************
 *  MAP WRITE VALIDATION
 ***********************************************************************************************************************************************
 * @description
 */
module.exports = function(store)  {

  return function(src) {
    var validators = [readonly];
        src.data = src.data || {};
        src.options = src.options || {};

    // Set up reduce - this ensure our data will be passed
    // to the first validator function available
    validators.unshift(start(src));

    // Run chain
    return validators.reduce(function(prev, curr) {
      return curr(prev());
    });
  };

  /**
   * This sets up the validation chain with the right structure/values
   * @param  {[type]} spec [description]
   * @return {[type]}      [description]
   */
  function start(spec) {
    return function() {
      return {passed: spec.data, failed: {}, options: spec.options};
    };
  }

  //
  // VALIDATORS
  //------------------------------------------------------------------------------------------//
  // @description
  
  /**
   * READONLY
   * @param  {[type]} spec [description]
   * @return {[type]}      [description]
   */
  function readonly(spec) {
    for(var key in spec.passed) {
      // console.log('READONLY: ', key, store, store.data[key], store.meta)
      if(store.data[key] && (store.options[key] && store.options[key].readonly && !spec.options.force)) {
        spec.failed[key] = spec.passed[key];
        delete spec.passed[key];
      }
    }

    return spec;
  }
};
