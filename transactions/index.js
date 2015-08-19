'use strict';

/***********************************************************************************************************************************************
 * VALENCE TRANSACTIONS
 ***********************************************************************************************************************************************
 * @description Creates Transaction objects. Not super robust at the moment.
 */
module.exports = function(spec) {
  console.log(spec);
  return {
    struct: spec.struct,
    type: spec.type,
    time: Date.now(),
    data: spec.data,
    options: spec.options
  };
};
