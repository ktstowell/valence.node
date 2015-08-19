'use strict';

var q = require('q');
var Transaction = require('../../transactions');

/***********************************************************************************************************************************************
 *  VALENCE MAP STRUCT
 ***********************************************************************************************************************************************
 * @description
 */
module.exports = function(spec) {

  /**
   * Protected data struct for this map instance.
   * @type {Object}
   */
	var Store = Object.create({read: read, write: write});
      Store.meta = {};
      Store.data = {};

  /**
   * Option handling strategies
   * @type {Object}
   */
  var Strategies = {
    read: {},
    write: {
      readonly: readonly
    },
    remove: {}
  };

  /**
   * Map State machine/API
   * @param {[type]} state [description]
   */
	var Map = function(state) {
		return {
			get: function(opts) { return validate(state, opts, 'read').then(function(data) { return get(data); }); },
			set: function(opts) { return validate(state, opts, 'write').then(function(data) { return set(data); }); },
			remove: function(opts) { return validate(state, opts, 'remove').then(function(data) { return remove(data); }); }
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
  
  function get(state, opts) {

  }

  /**
   * SET
   *
   * @description Writes data to the struct.
   * @param {[type]} spec [description]
   */
  function set(spec) {
    var def = q.defer(),
        options = [];

    // Process all option strategies to ensure we can write
    for(var option in spec.options) {
      options.push(Strategies.write[option](spec));
    }

    q.all(options)
      .then(function(resolved) {
        // all strategies successfull, write away!
        Store.write(spec).then(function(write) {
          console.log(write, store);
          def.resolve(write);
        });
      }).catch(function(err) {
        def.reject(err);
      });

    return def.promise;
  }

  function remove(state, opts) {

  }

  //
  // VALIDATION
  //------------------------------------------------------------------------------------------//
  // @description
  function validate(state, options, strategy) {
    var def = q.defer();

    state = state || {};
    options = options || {};

    // remove unsupported options
    Object.keys(options).filter(function(key) {
      return !Strategies[strategy].hasOwnProperty(key);
    }).forEach(function(option) {
      delete options[option];
    });

    // Resolve failsafe structures
    def.resolve({state: state, options: options});

    return def.promise;
  }

  //
  // STRATEGY METHOS
  //------------------------------------------------------------------------------------------//
  // @description
  function readonly() {

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
    
    console.log('WRITE: ', spec)
    for(var key in spec.state) {
      // Write to key value store
      this.data[key] = spec.state[key];
      // Write to meta map
      // this.meta[key] = spec.options[key];
      // this.meta[key].modified = Date.now();
      // 
      // I NEED TO DO ERROR HANDLING HERE BUT IT"S LATE
    }

    // Resolve transaction
    def.resolve((Transaction({struct: Map, type: 'write', data: spec.state, options: spec.options})));

    return def.promise;
  }
};