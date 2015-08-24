'use strict';

/***********************************************************************************************************************************************
 * VALENCE TRANSACTIONS
 ***********************************************************************************************************************************************
 * @description Creates Transaction objects. Not super robust at the moment.
 */
module.exports = function(spec) {
  // Create state defaults
  spec = spec || {};
  spec.struct = spec.struct || 'Not Specified'

  return {
    Writeable: Type('write'),
    Readable: Type('read'),
    Removeable: Type('remove')
  };

  /**
   * Creates an execution context with the Type type.
   * @param  {[type]} desc [description]
   * @return {[type]}      [description]
   */
  function Type(desc) {

    return function(data) {
      var transaction = {};
          transaction.time = Date.now();
          transaction.type = desc;

      // Esnure transaction has defaults.
      data = data || {};

      // Add anything rpovided
      for(var key in data) {
        transaction[key] = data[key];
      }

      // Ensure error and success are present
      transaction.success = transaction.success || null;
      transaction.error = transaction.error || null;

      // Copy spec reference into transaction.
      // Abstract this into a lib.
      for(var key in spec) {
        transaction[key] = spec[key];
      }

      return transaction;
    };
  }
};
