'use strict';

/***********************************************************************************************************************************************
 *  ARRAY SPEC
 ***********************************************************************************************************************************************
 * @description
 */
var vows = require('vows');
var assert = require('assert');
var Valence = require('..');
var suite = vows.describe('Arrays');

suite
  .addBatch({
    'When creating a Valence Array': {
      topic: function() {
        return new Valence.Types.Array();
      },
      'We should be provided an interface': function(arr) {
        
      }
    },
    'When Adding some data to an array': {
      topic: function() {
        return new (Valence.Types.Array('foo')).add();
      },
      'We should see our primitive': function(arr) {
        
        assert.notEqual(null, arr);
        assert.notEqual(undefined, arr);
        assert.notEqual(0, arr.length);
        assert.notEqual(-1, arr.indexOf('foo'));
      }
    }
  }).export(module);