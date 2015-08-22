'use strict';

/***********************************************************************************************************************************************
 * MAP TESTS
 ***********************************************************************************************************************************************
 * @description
 */
var vows = require('vows');
var assert = require('assert');
var Valence = require('..');
var suite = vows.describe('Maps');

//
// SUITE
//------------------------------------------------------------------------------------------//
// @description
// w
suite
  .addBatch({
    'When creating a map': {
      topic: function() {
        this.callback(null, new Valence.Structs.Map());
      },
      'We should be provided an interface': function(err, map) {
        assert.notEqual(null, map);
        assert.notEqual(undefined, map);
      }
    },
  }).addBatch({
    'When writing "{foo:bar}" to a map': {
      topic: function() {
        return (new Valence.Structs.Map()({foo:'bar'}).set());
      },
      'We should see a transaction object with: "success: {data: {foo:bar}}"': function(err, data) {
        assert.equal(err, null);
        assert.equal(data.success.data.foo, 'bar');
      }
    },
    'When writing "{foo:bar}" to a map as "readonly"': {
      topic: function() {
        var map = new Valence.Structs.Map();
            map({foo:'bar'}).set({readonly: true});

        return map;
      },
      'And we try to re-write the value of foo to "baz"': {
        topic: function(map) {
          return map({foo:'baz'}).set();
        },
        'We should see a transaction object with {error: {data: {foo:bar}}}': function(err, data) {
          assert.equal(err, null);
          assert.equal(data.error.data.foo, 'baz');
        }
      }
    },
    'When writing "{bang:bar}" to a map as "readonly"': {
      topic: function() {
        var map = new Valence.Structs.Map();
            map({bang:'bar'}).set({readonly: true});

        return map;
      },
      'And we try to re-write the value of bang to "baz" using "{force: true}"': {
        topic: function(map) {
          return map({bang:'baz'}).set({force: true});
        },
        'We should see a transaction object with {success: {data: {foo:baz}}}': function(err, data) {
          assert.equal(err, null);
          assert.equal(data.success.data.bang, 'baz');
        }
      }
    }
  }).export(module);