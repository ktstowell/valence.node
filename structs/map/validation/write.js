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
      return {passed: spec.keys, failed: {}, options: spec.options, type: spec.type, value: spec.value};
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

  // VALIDATORS
  //------------------------------------------------------------------------------------------//
  // @description
  
  /**
   * [type description]
   * @param  {[type]} spec [description]
   * @return {[type]}      [description]
   */
  function type(spec) {
    if(!spec.value || spec.value && spec.value.constructor !== spec.type) {
      spec.passed.forEach(function(key) {
        fail(key, spec.value, spec, ('Invalid type. Expected '+ spec.type + ', got '+ (spec.value && spec.value.constructor)));
      });
    }

    return function() {
      return spec;
    };
  }

  /**
   * @param  {[type]} spec [description]
   * @return {[type]}      [description]
   */
  function readonly(spec) {
    spec.passed.forEach(function(key) {
      if(store.data[key] && (store.options[key] && store.options[key].readonly && !spec.options.force)) {
        fail(key, null, spec, ('Requested value is readonly. Use {force: true} to override.'));
      }
    });

    return spec;
  }
};
