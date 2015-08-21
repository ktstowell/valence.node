'use strict';

/***********************************************************************************************************************************************
 *  MAP STORE
 ***********************************************************************************************************************************************
 * @description
 */
module.exports = function() {
  var Store = Object.create({write: write, read: read, remove: remove});
      Store.meta = {};
      Store.data = {};

  return Store;
};

function write(spec) {

}

function read(spec) {

}

function remove(spec) {

}