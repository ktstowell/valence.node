'use strict';

/***********************************************************************************************************************************************
 * MAP READ VALIDATION
 ***********************************************************************************************************************************************
 * @TODO: Validation works but is extremely inefficient as it is O(n^2) to run on a single key. Clean it up
 *        so that it runs onces and abstracts the conditionals away. 
 */
module.exports = function(store) {

  /**
   * [description]
   * @param  {[type]} src [description]
   * @return {[type]}     [description]
   */
  function validate(src) {
    var validators = [start(src), exists, hidden];


    // Run validation composition
    return validators.reduce(function(prev, curr) {
      return curr(prev());
    });
  }

  //
  // VALIDATION INIT AND HELPERS
  //------------------------------------------------------------------------------------------//
  // @description
  
  /**
   * [start description]
   * @param  {[type]} spec [description]
   * @return {[type]}      [description]
   */
  function start(spec) {
    return function() {
      return {passed: (spec.results || {}), failed: {}, keys: spec.keys, options: spec.options};
    }
  }

  /**
   * transfers a kvp from passed to fail
   * @param  {[type]} key  [description]
   * @param  {[type]} val  [description]
   * @param  {[type]} spec [description]
   * @param  {[type]} msg  [description]
   * @return {[type]}      [description]
   */
  function fail(key, val, spec, msg) {
    spec.failed[key] = {value: val, error: msg};
    delete spec.passed[key];
  }

  //
  // VALIDATION HELPERS
  //------------------------------------------------------------------------------------------//
  // @description
  
  function exists(spec) {
    spec.keys.filter(function(key) {
      return !spec.passed[key];
    }).forEach(function(key) {
      fail(key, null, spec, 'Key not found in store');
    });

    return function() {
      return spec;
    }
  }

  /**
   * [hidden description]
   * @param  {[type]} spec [description]
   * @return {[type]}      [description]
   */
  function hidden(spec) {
    
    for(var key in spec.passed) {
      if(store.options[key] && store.options[key].hidden) {
        fail(key, null, spec, 'Value is hidden. Use {forece: true} to override.');
      }
    }

    return spec;
  }

  return validate;
};