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
      'We should see a transaction object with: "success: {foo:bar}"': function(err, data) {
        assert.equal(err, null);
        assert.equal(data.success.foo, 'bar');
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
        'We should see a transaction object with {error: {foo:bar}}': function(err, data) {
          assert.equal(err, null);
          assert.equal(data.error.foo, 'baz');
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
        'We should see a transaction object with {success: {{foo:baz}}': function(err, data) {
          assert.equal(err, null);
          assert.equal(data.success.bang, 'baz');
        }
      }
    }
  })
  .addBatch({
    'Given we have a map that contains {foo:bar}': {
      topic: function() {
        var map = new Valence.Structs.Map(),
            foo = map({foo:'bar'}).set();
        return map;
      },
      'Requesting those values should yeild a transaction with success: {foo: bar}': function(map) {
        var query = map('foo').get();

        assert.notEqual(null, query);
        assert.notEqual(undefined, query);
        assert.equal('bar', query.success.foo.value);
      }
    },
    'Given we have a map that contains {foo:bar} that is "hidden"': {
      topic: function() {
        var map = new Valence.Structs.Map(),
            foo = map({foo:'bar'}).set({hidden: true});
        return map;
      },
      'Requesting those values should yeild a transaction with error: {foo: {value: null, hidden: true}}': function(map) {
        var query = map('foo').get();
        assert.notEqual(null, query);
        assert.notEqual(undefined, query);
        assert.equal(null, query.error.foo.value);
        assert.equal(true, query.error.foo.hidden);
      }
    },
    'Given we have a map that contains multiple key value pairs': {
      topic: function() {
        var map = new Valence.Structs.Map(),
            foo = map({foo:'bar', bar: 'baz', baz: 'bang'}).set();

        return map;
      },
      'I should be able to query for multiple values at a time using ["foo", "bar"]': function(map) {
        var query = map(['foo', 'bar']).get();
        
        assert.notEqual(null, query);
        assert.notEqual(undefined, query);
        assert.notEqual(undefined, query.success.foo.value);
        assert.notEqual(undefined, query.success.bar.value);
      }
    },
    'Given we have a map with a nested object': {
      topic: function() {
        var map = new Valence.Structs.Map(),
            foo = map({foo: {bar: {baz: 'bang'}, foo: 'bar', baz: 'bang'}}).set();

        return map;
      },
      'And a query for a value using "{all:true}"': {
        topic: function(map) {
          return map(['foo', 'baz', 'wat']).get({all: true});
        },
        'I should see a result telling me the value of the returned keys and where they are located': function(query) {
          console.log(query)
        }
      }
    }
  }).export(module);