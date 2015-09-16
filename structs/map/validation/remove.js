'use strict';

/***********************************************************************************************************************************************
 *  MAP
 ***********************************************************************************************************************************************
 * @description
 */

module.exports = function(store) {
  return function(src) {
    var validators = [start(src), exists, readonly];
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
  
  function fail(key, val, spec, msg) {
    spec.passed.splice(spec.passed.indexOf(key), 1);
    spec.failed[key] = {error: msg, value: spec.value};
  }

  //
  // VALIDATION
  //------------------------------------------------------------------------------------------//
  // @description
  function exists(spec) {
    spec.passed.forEach(function(key) {
      if(!store.data[key]) { fail(key, null, spec, 'Could not remove. Not found in Map.'); }
    });

    return function() {
      return spec;
    }
  }

  /**
   * @param  {[type]} spec [description]
   * @return {[type]}      [description]
   */
  function readonly(spec) {
    spec.passed.forEach(function(key) {
      if((store.options[key] && store.options[key].readonly && !spec.options.force)) {
        fail(key, null, spec, ('Requested value is readonly. Use {force: true} to override.'));
      }
    });

    return spec;
  }
};