'use strict';

/***********************************************************************************************************************************************
 *  MAP WRITE VALIDATION
 ***********************************************************************************************************************************************
 * @description
 */
module.exports = function(store)  {

  return {
    first: normalize,
    validators: [type, mutable]
  }

  /**
   * This sets up the validation composition with the right structure/values
   * @param  {[type]} spec [description]
   * @return {[type]}      [description]
   */
  function normalize(spec) {
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

    return function() { return spec; }
  }

  /**
   * @param  {[type]} spec [description]
   * @return {[type]}      [description]
   */
  function mutable(spec) {
    spec.passed.forEach(function(key) {
      if(store.data[key] && (store.options[key] && (store.options[key].hasOwnProperty('mutable') && store.options[key].mutable === false && !spec.options.force))) {
        fail(key, null, spec, ('Requested value is immutable. Use {force: true} to override.'));
      }
    });

    return function() { return spec; }
  }
};
