'use strict';

/***********************************************************************************************************************************************
 *  MAP WRITE VALIDATION
 ***********************************************************************************************************************************************
 * @description
 */
module.exports = function(store)  {

  return function(src) {
    var validators = [start(src), type, readonly];
        src.data = src.data || {};
        src.options = src.options || {};

    // Run chain
    return validators.reduce(function(prev, curr) {
      return curr(prev());
    });
  }

  /**
   * This sets up the validation composition with the right structure/values
   * @param  {[type]} spec [description]
   * @return {[type]}      [description]
   */
  function start(spec) {
    return function() {
      return {passed: spec.keys, failed: {}, options: spec.options, type: spec.type};
    };
  }

  //
  // HELPERS
  //------------------------------------------------------------------------------------------//
  // @description
  
  function fail(key, spec, msg) {
    spec.failed[key] = spec.passed[key];
    spec.failed[key].message = msg;
    delete spec.passed[key];
  }
  
  // VALIDATORS
  //------------------------------------------------------------------------------------------//
  // @description
  function type(spec) {
    for(var key in spec.passed) {
      if(spec.passed[key].constructor !== spec.type) {
        fail(key, spec, 'Invalid type.');
      }
    }

    return function() {
      return spec;
    };
  }

  /**
   * READONLY - retrofit for recursion
   * @param  {[type]} spec [description]
   * @return {[type]}      [description]
   */
  function readonly(spec) {
    for(var key in spec.passed) {
      if(store.data[key] && (store.options[key] && store.options[key].readonly && !spec.options.force)) {
        spec.failed[key] = spec.passed[key];
        delete spec.passed[key];
      }
    }

    return spec;
  }
};
