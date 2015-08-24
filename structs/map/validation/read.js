'use strict';

/***********************************************************************************************************************************************
 * MAP READ VALIDATION
 ***********************************************************************************************************************************************
 * @description
 */
module.exports = function(store) {

  /**
   * [description]
   * @param  {[type]} src [description]
   * @return {[type]}     [description]
   */
  return function(src) {
    var validators = [start(src), exists, hidden];
        src = src || {};
        src.data = src.data || {};
        src.options = src.options || {};

    // Run validation composition
    return validators.reduce(function(prev, curr) {
      console.log(prev, curr)
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

  function exists(spec) {
    console.log(spec)
    for(var key in spec.passed) {
      if(spec.passed[key].constructor === Object && !spec.passed[key].value) {
        spec.passed[key].value = null;
        spec.failed[key] = spec.passed[key];
        delete spec.passed[key];
      }
    }

    return function() {
      return spec;
    };
  }

  /**
   * [hidden description]
   * @param  {[type]} spec [description]
   * @return {[type]}      [description]
   */
  function hidden(spec) {
    console.log(spec)
    for(var key in spec.passed) {
      if(spec.passed[key].constructor === Array) {
        spec.passed[key].forEach(function(obj) {
          console.log('ARRAY IN HIDDEN: ', obj)
          if(store.options[obj.path] && store.options[obj.path].hidden & !spec.options.force) {
            spec.failed[key] = spec.passed[key];
            spec.failed[key].value = null;
            spec.failed[key].hidden = true;
            delete spec.passed[key];
          }
        });
      } else if(store.options[spec.passed[key].path] && store.options[spec.passed[key].path].hidden & !spec.options.force) {
        spec.failed[key] = spec.passed[key];
        spec.failed[key].value = null;
        spec.failed[key].hidden = true;
        delete spec.passed[key];
      }
    }

    return spec;
  }
};