'use strict';

/***********************************************************************************************************************************************
 *  VALENCE ARRAY TYPE
 ***********************************************************************************************************************************************
 * @description
 */
module.exports = function() {
  var Valence = {},
      helpers = {};

  //
  // ARRAY CONSTRUCTOR
  //------------------------------------------------------------------------------------------//
  // @description
  Valence.Array = function(data) {
    var arr = [];

    arr.add = function(opts) { return add.call(arr, data, opts); }
    arr.spread = function(opts) { return spread.call(arr, data, opts); }
    arr.remove = function(opts) { return remove.call(arr, data, opts); }
    
    return arr;
  };

  /**
   * [fill description]
   * @return {[type]} [description]
   */
  function add(data) {
    this.push(data);
    return this;
  };

  /**
   * [spread description]
   * @param  {[type]} data [description]
   * @return {[type]}      [description]
   */
  function spread(data) {
    return (spread[data.constructor] || spread.primitive).call(this, data);
  }

  spread[Array] = function(arr) {
    var self = this;

    arr.forEach(function(itm) {
      self.push(itm);
    });

    return this;
  };

  spread[Object] = function(obj) {
    for(var prop in obj) {
      var tmp = {};
          tmp[prop] = obj[prop];

      this.push(tmp);
    }

    return this;
  };

  spread.primitive = function(data) {
    this.push(data);
    return this;
  };

  /**
   * [remove description]
   * @param  {[type]} data [description]
   * @return {[type]}      [description]
   */
  function remove(data) {
    return (remove[data.constructor] || remove['primitive']).call(this, data);
  }

  remove[Array] = function(data) {
    console.log(this)
  };

  remove[Object] = function(data) {
    console.log(this)
  };

  remove['primitive'] = function(data) {
    this.push(data);
    return this;
  };
  return Valence.Array;
};