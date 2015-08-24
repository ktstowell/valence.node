'use strict';

var Transaction = require('../../transactions')({struct: 'Map'});
var Store = require('./store');
var Validation = require('./validation');

/***********************************************************************************************************************************************
 *  VALENCE MAP STRUCT
 ***********************************************************************************************************************************************
 * @description
 */
module.exports = function(spec) {

  // Create instances
  var store = new Store();
  var validation = Validation(store);

  //
  // MAP STATE MACHINE
  //------------------------------------------------------------------------------------------//
  // @description
  var Map = function(state) {
    return {
      get: function(opts) { return get(normalize(state, opts)); },
      set: function(opts) { return set(normalize(state, opts)); },
      remove: function(opts) { return remove(normalize(state, opts)); }
    };
  };
  
  /**
   * Instance API. *hoisting happens*
   */
  return Map;

  //
  // MAP STATEFUL METHODS
  //------------------------------------------------------------------------------------------//
  // @description
  
  function get(spec) {
    var query = store.read(spec);
    var validated = validation.readable(query);

    return new Transaction.Readable({
      options: spec.options,
      success: validated.passed,
      error: validated.failed
    });
  }

  /**
   * SET
   *
   * @description Writes data to the struct.
   * @param {[type]} spec [description]
   */
  function set(spec) {
    var validated = validation.writeable(spec); // returns {passed, failed}
    
    return new Transaction.Writeable({
      options: spec.options,
      success: store.write({data: validated.passed, options: spec.options}).data,
      error: validated.failed
    });
  }

  /**
   * [remove description]
   * @param  {[type]} spec [description]
   * @return {[type]}      [description]
   */
  function remove(spec) {

  }

  //
  // NORMALIZATION
  //------------------------------------------------------------------------------------------//
  // @description
  function normalize(state, options) {
    return {data: (state = state || {}), options: (options = options || {})};
  }
};