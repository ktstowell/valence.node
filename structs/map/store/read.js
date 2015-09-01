'use strict';

/***********************************************************************************************************************************************
 * MAP STORE READ
 ***********************************************************************************************************************************************
 * @description
 */
module.exports = function(store) {
  var Strategies = {
    key: find.key,
    val: find.val
  };

  /**
   * [find description]
   * @param  {[type]} spec [description]
   * @return {[type]}      [description]
   */
  function find(spec) {
    var results = {};

    spec.data.forEach(function(key, idx) {
      results[key] = scan({src: store.data, key: key, options: spec.options});
    });

    return results;
  }

  /**
   * [scan description]
   * @param  {[type]} obj  [description]
   * @param  {[type]} key  [description]
   * @param  {[type]} deep [description]
   * @return {[type]}      [description]
   */
  function scan(spec) {
    var result = {path: spec.key},
        results = [],
        path = '';

    (function inner(obj, key) {
      for(var prop in obj) {
        if(prop === key) {
          path += prop;
          result = { path: path, value: obj[prop] };

          if(!spec.options.all) { break; }
            else {
              results.push(result); }
        } else {
          if((spec.options.deep || spec.options.all) && obj[prop].constructor === Object) {
            path += prop + '.';
            inner(obj[prop], key);
          }
        }
      }
    })(spec.src, spec.key);

    return (spec.options.all && results.length?  results : result);
  }

  /**
   * [read description]
   * @param  {[type]} spec [description]
   * @return {[type]}      [description]
   */
  return function read(spec) {
   var strategy,
        results = [];

    spec = spec || {};
    spec.data = (spec.data && (spec.data.constructor === Array? spec.data : [spec.data])) || [];
    spec.options = spec.options || {};

    return {data: find(spec), options: spec.options};
  };
};