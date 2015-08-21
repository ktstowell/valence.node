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
    Write: Transaction('write'),
    Read: Transaction('read'),
    Delete: Transaction('delete')
  };

  /**
   * Creates an execution context with the transaction type.
   * @param  {[type]} desc [description]
   * @return {[type]}      [description]
   */
  function Transaction(desc) {

    return function(data) {
      var transaction = {};
          transaction.type = desc;

      data = data || {};
      
      // Copy any data options into the transaction
      for(var obj in data) {
        transaction[obj] = data[obj];
      }

      // Copy spec reference into transaction.
      // Abstract this into a lib.
      for(var key in spec) {
        transaction[key] = spec[key];
      }

      return {
        success: function(msg) {
          transaction.success = msg || 'Transaction Successful';
          return transaction;
        },
        error: function(msg) {
          transaction.error = msg || 'An error occured';
          return transaction;
        }
      };
    };
  }
};
