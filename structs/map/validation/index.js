'use strict';

/***********************************************************************************************************************************************
 *  MAP VALIDATION
 ***********************************************************************************************************************************************
 * @description
 */
module.exports = function(store) {
  return {
    writeable: require('./write')(store),
    readable: require('./read')(store),
    removeable: require('./remove')(store)
  }
};