'use strict';

/***********************************************************************************************************************************************
 *  MAP STORE
 ***********************************************************************************************************************************************
 * @description
 */
module.exports = function() {
  this.data = {};
  this.options = {};

  this.write = write.bind(this);
  this.read = read.bind(this);
  this.remove = remove.bind(this);

  return this;
};

function write(spec) {
  spec = spec || {};
  spec.data = spec.data || {};
  spec.options = spec.options || {};

  for(var key in spec.data) {
    this.data[key] = spec.data[key];
    this.options[key] = this.options[key] || {};

    for(var option in spec.options) {
      this.options[key][option] = spec.options[option];
    }
  }

  return spec;
}

function read(spec) {

}

function remove(spec) {

}