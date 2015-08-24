'use strict';

/***********************************************************************************************************************************************
 *  MAP STORE
 ***********************************************************************************************************************************************
 * @description
 */
module.exports = function() {
  this.data = {};
  this.options = {};

  this.write = require('./write')(this);
  this.read = require('./read')(this);
  this.remove = require('./remove')(this);

  return this;
};

