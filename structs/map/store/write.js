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
    spec = spec || {};
    spec.data = spec.data || {};
    spec.options = spec.options || {};

    for(var key in spec.data) {
      store.data[key] = spec.data[key];
      // Save the path as akey name in options to ease lookup
      store.options[(key + path(spec.data[key]))] = spec.options;
    }

    return spec;
  };

  /**
   * Builds dot separated pathname - abstract this into some util module
   * @param  {[type]} obj [description]
   * @return {[type]}     [description]
   */
  function path(obj) {
    var str = '';

    if(obj.constructor === Object) {
      str = '.';

      for(var key in obj) {
        str += key + '.';
      }

      str = str.substr(0, str.length-1);
    }

    return str;
  }
};