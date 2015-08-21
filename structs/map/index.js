'use strict';

var q = require('q');
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
  var store = Store();
  var validation = Validation(store);

  /**
   * Map State machine/API
   * @param {[type]} state [description]
   */
  var Map = function(state) {
    return {
      get: function(opts) { return normalize(state, opts, 'read').then(function(data) { return get(data); }); },
      set: function(opts) { return normalize(state, opts, 'write').then(function(data) { return set(data); }); },
      remove: function(opts) { return normalize(state, opts, 'remove').then(function(data) { return remove(data); }); }
    };
  };

  //
  // MAP STATELESS METHODS
  //------------------------------------------------------------------------------------------//
  // @description By 'stateless' I mean that they don't transfer the original constructor
  //              state to the api. Just the real-time opts.
  
  /**
   * Proxies get for whole data set.
   * @param  {[type]} opts [description]
   * @return {[type]}      [description]
   */
  Map.get = function(opts) {
    return get({}, opts);
  };

  /**
   * Proxies remove for whole data set.
   * @param  {[type]} opts [description]
   * @return {[type]}      [description]
   */
  Map.empty = function(opts) {
    return remove({}, opts);
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

  }

  /**
   * SET
   *
   * @description Writes data to the struct.
   * @param {[type]} spec [description]
   */
  function set(spec) {
    var def = q.defer();

    // Determine if objects are writeable
    validation.write(spec.data)
      .then(function(resolved) {
        // Attempt to write
        store.write(spec).then(function(write) {
          def.resolve(write);
        }, function(write) {
          def.reject(write);
        });
      }, function(err) {
        console.log('write reject', err)
      }).catch(function(err) {
        console.log('write catch', err);
      }).done();

    return def.promise;
  }

  function remove(spec) {

  }

  //
  // VALIDATION
  //------------------------------------------------------------------------------------------//
  // @description
  function normalize(state, options, strategy) {
    var def = q.defer();

    state = state || {};
    options = options || {};

    // Resolve failsafe structures
    def.resolve({data: state, options: options});

    return def.promise;
  }

  //
  // STRATEGY METHOS
  //------------------------------------------------------------------------------------------//
  // @description
  function readonly(spec) {
    var def = q.defer(),
        rejected = {},
        writeable = {};

    // determine if an option can be written
    for(var key in spec.data) {
      console.log({
        key: key,
        store: {data: Store.data[key], meta: Store.meta[key]}
      })
      if(Store.data[key] && (Store.meta[key] && Store.meta[key].options && Store.meta[key].options.readonly)) {
        rejected[key] = spec.data[key];
      } else {
        writeable[key] = spec.data[key];
      }
    }

    // Resolve writeable keys
    def.resolve(writeable);

    // Reject if present
    if(Object.keys(rejected).length) {
      def.reject({error: 'The following values are marked as readonly', data: rejected});
    }

    return def.promise;
  }

  //
  // STORE METHODS
  //------------------------------------------------------------------------------------------//
  // @description
  
  /**
   * Storage lookup
   * @param  {[type]} spec [description]
   * @return {[type]}      [description]
   */
  function read(spec) {

  }

  /**
   * Writes to Store.
   * @param  {[type]} spec [description]
   * @return {[type]}      [description]
   */
  function write(spec) {
    var def = q.defer();

    

    return def.promise;
  }
};