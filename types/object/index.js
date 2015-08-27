'use strict';

/***********************************************************************************************************************************************
 *  OBJECT TYPES
 ***********************************************************************************************************************************************
 * @description
 */

module.exports = function() {
  var Valence = {};

  //
  // OBJECT CONSTRUCTOR
  //------------------------------------------------------------------------------------------//
  // @description
  Valence.Object = function(data) {
    var obj;

    var API = {
      add: function(opts) { return add.call(obj, data, opts); },
      remove: function(opts) { return remove.call(obj, data, opts); },
      clean: function(opts) { return clean.call(obj, data, opts); }
    };

    obj = Object.create(API);

    return obj;
  };

  /**
   * [add description]
   * @param {[type]} data [description]
   */
  function add(data) {
    if(!data || data.constructor !== Object) {
      throw new Error('Valence.Object.add requires Object. Got: ' + data);
    }

    for(var prop in data) {
      this[prop] = data[prop];
    }

    return this;
  };

  /**
   * [remove description]
   * @param  {[type]} data [description]
   * @return {[type]}      [description]
   */
  function remove(key) {
    delete this[key];
    return this;
  };

  /**
   * [clean description]
   * @return {[type]} [description]
   */
  function clean() {
    for(var prop in this) {
      delete this[prop];
    }
    
    return this;
  }

  return Valence.Object;
};