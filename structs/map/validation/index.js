'use strict';

/***********************************************************************************************************************************************
 *  MAP VALIDATION
 ***********************************************************************************************************************************************
 * @description
 */
module.exports = function(store) {
  var validators = {};
      validators.readable = require('./read')(store);
      validators.writeable = require('./write')(store);
      validators.removeable = require('./remove')(store);

  //
  // VALIDATION API
  //------------------------------------------------------------------------------------------//
  // @description
  return {
    readable: readable,
    writeable: writeable,
    removeable: removeable
  };

  /**
   * [readable description]
   * @param  {[type]} spec [description]
   * @return {[type]}      [description]
   */
  function readable(spec) {
    return validate(([validators.readable.first(spec)].concat(validators.readable.validators)));
  }

  /**
   * [writeable description]
   * @param  {[type]} spec [description]
   * @return {[type]}      [description]
   */
  function writeable(spec) {
    return validate(([validators.writeable.first(spec)].concat(validators.writeable.validators)));
  }

  /**
   * [removeable description]
   * @param  {[type]} spec [description]
   * @return {[type]}      [description]
   */
  function removeable(spec) {
    return validate(([validators.removeable.first(spec)].concat(validators.removeable.validators)));
  }

  //
  // VALIDATION ENGINE
  //------------------------------------------------------------------------------------------//
  // @description
  function validate(strategies) {
    strategies = strategies || [];
    
    // Run chain
    return strategies.reduce(function(prev, curr) {
      return curr(prev());
    })();
  }
};
