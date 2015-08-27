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
    console.log('VALIDATION: ', src)
    var validators = [start(src), exists, hidden];
        src = src || {};
        src.data = src.data || {};
        src.options = src.options || {};

    // Run validation composition
    return validators.reduce(function(prev, curr) {
      return curr(prev());
    });
  }

  /**
   * [start description]
   * @param  {[type]} spec [description]
   * @return {[type]}      [description]
   */
  function start(spec) {
    return function() {
      return {passed: spec.data, failed: {}, options: spec.options};
    }
  }

  /**
   * [exists description]
   * @param  {[type]} spec [description]
   * @return {[type]}      [description]
   */
  function exists(spec) {
    var msg = 'No record found in Map.';

    for(var key in spec.passed) {
      exists[spec.passed[key].constructor](key, spec, msg);
    }

    return function() {
      return spec;
    };
  }

  exists[Array] = function(key, spec, msg) {
    spec.passed[key] = spec.passed[key].filter(function(itm) {
      console.log(itm)
      return itm.path && itm.value;
    });

    spec.failed[key] = spec.passed[key].filter(function(itm) {
      return !itm.value;
    }).forEach(function(itm) {
      itm.value = null; itm.failure = msg
    });
  };

  exists[Object] = function(key, spec, msg) {
    if(spec.passed[key].path && !spec.passed[key].value) {
      spec.failed[key] = spec.passed[key];
      spec.failed[key].value = null;
      spec.failed[key].failure = msg;
      delete spec.passed[key];
    }
  };

  /**
   * [hidden description]
   * @param  {[type]} spec [description]
   * @return {[type]}      [description]
   */
  function hidden(spec) {
    var msg = 'Item cannot be accessed. Please use {force:true} for visibility';
    console.log('SPEC FROM EXISTS: ', spec)
    console.log(store.options)
    for(var key in spec.passed) {
      hidden[spec.passed[key].constructor](key, spec, msg);
    }

    return spec;
  }

  hidden[Array] = function(key, spec, msg) {
    spec.passed[key] = spec.passed[key].filter(function(itm) {
      return !store.options[itm.path] || !store.options[itm.path].hidden;
    });

    spec.failed[key] = spec.passed[key].filter(function(itm) {
      return store.options[itm.path]  && store.options[itm.path].hidden;
    }).forEach(function(itm) {
      itm.value = null; itm.failure = msg
    });
  };

  hidden[Object] = function(key, spec, msg) {
    if(store.options[spec.passed[key].path] && store.options[spec.passed[key].path].hidden) {
      spec.failed[key] = spec.passed[key];
      spec.failed[key].value = null;
      spec.failed[key].failure = msg;
      delete spec.passed[key];
    }
  };

  return validate;
};