'use strict';
console.log(__dirname+'/../../');
var resolve = require('resolve');
var t = resolve.sync('transactions', {baseDir: __dirname+'/../../'});
console.log(t, __dirname);

var Transaction = require('../../transactions')({struct: 'Map'});
var Store = require('./store');
var Validation = require('./validation');

/***********************************************************************************************************************************************
 *  VALENCE MAP STRUCT
 ***********************************************************************************************************************************************
 * @description
 */
module.exports = function(spec) {

  if(!spec || spec && !spec.type) {
    throw new Error('Valence - Map: please instantiate your map with a type. e,g String, Number or Object');
  }

  // Create instances
  var store = new Store();
  var validation = Validation(store);

  //
  // MAP STATE MACHINE
  //------------------------------------------------------------------------------------------//
  // @description
  var Map = function(key) {

    if(!key) {
      throw new Error('Valence - Map: key not provided');
    }

    return {
      get: function(opts) { return get(normalize(key, null, opts, spec.type)); },
      set: function(val, opts) { return set(normalize(key, val, opts, spec.type)); },
      remove: function(opts) { return remove(normalize(key, null, opts, spec.type)); }
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
    var validated = validation.readable(store.read(spec));

    return new Transaction.readable({
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
    
    return new Transaction.writeable({
      options: spec.options,
      success: store.write({data: validated.passed, options: spec.options, value: spec.value}),
      error: validated.failed
    });
  }

  /**
   * [remove description]
   * @param  {[type]} spec [description]
   * @return {[type]}      [description]
   */
  function remove(spec) {
    var validated = validation.removeable(spec);

    return new Transaction.removeable({
      options: spec.options,
      success: store.remove({data: validated.passed, options: spec.options}),
      error: validated.error
    });
  }

  //
  // NORMALIZATION
  //------------------------------------------------------------------------------------------//
  // @description Normalizes state variables into a map for further use.
  //              At this point, key and type have been validated
  function normalize(key, val, options, type) {
    return {keys: (key.constructor === Array? key : [key]), value: val, options: (options || {}), type: type};
  }
};