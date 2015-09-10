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
    'When creating a map without a type': {
      topic: function() {
        return new Valence.Structs.Map();
      },
      'We should see an error': function(err, map) {
        assert.notEqual(null, err);
      }
    },
    'When creating a map with a type of String': {
      topic: function() {
        return new Valence.Structs.Map({type: String});
      },
      'We should see a Valence Map struct interface': function(err, map) {
        assert.notEqual(null, map);
        assert.equal(Function, map.constructor);
      }
    }
  })
  .addBatch({
    'When creating a map context with a falsy key': {
      topic: function() {
        return (new Valence.Structs.Map({type: String})());
      },
      'We should see an error': function(err, map) {
        assert.notEqual(null, err);
      }
    },
    'When writing "foo" to a String Map with a value of "bar"': {
      topic: function() {
        return (new Valence.Structs.Map({type: String})('foo').set('bar'));
      },
      'We should see a transaction object with: "success: {foo:bar}"': function(err, data) {
        assert.equal(err, null);
        assert.notEqual(data, undefined);
        assert.equal(data.success.foo, 'bar');
      }
    },
    'When writing 100 to a String Map with a value of "bar"': {
      topic: function() {
        return (new Valence.Structs.Map({type: String})('foo').set(7));
      },
      'We should see a transaction object with: "error: {foo:bar}"': function(err, data) {
        assert.equal(err, null);
        assert.notEqual(data, undefined);
        assert.notEqual(data.error.foo, undefined);
      }
    },
    'When writing "{foo:bar}" to a map as "readonly"': {
      topic: function() {
        var map = (new Valence.Structs.Map({type: String})('foo'));

        map.set('bar', {readonly: true});

        return map;
      },
      'And we try to re-write the value of foo to "baz"': {
        topic: function(map) {
          return map.set('baz');
        },
        'We should see a transaction object with {error: {foo:bar}}': function(err, data) {
          assert.equal(err, null);
          assert.notEqual(data.error.foo, undefined);
        }
      }
    },
    'Given we have written {foo: bar} to a map as "readonly"': {
      topic: function() {
        var map = (new Valence.Structs.Map({type: String})('foo'));

        map.set('bar', {readonly: true});

        return map;
      },
      'When we try to re-write the value of bang to "baz" using "{force: true}"': {
        topic: function(map) {
          return map.set('baz', {force: true});
        },
        'We should see a transaction object with {success: {{foo:baz}}': function(err, data) {
          assert.equal(err, null);
          assert.equal(data.success.foo, 'baz');
        }
      }
    }
  })
  .addBatch({
    'Given we have a map that contains {foo:bar}': {
      topic: function() {
        var map = new Valence.Structs.Map({type: String});
            map('foo').set('bar');
        return map;
      },
      'Requesting those values should yeild a transaction with success: {foo: bar}': function(map) {
        var query = map('foo').get();

        assert.notEqual(null, query);
        assert.notEqual(undefined, query);
        assert.equal('bar', query.success.foo);
      }
    },
    'Given we have a map that contains {foo:bar} that was written with {hidden: true}': {
      topic: function() {
        var map = new Valence.Structs.Map({type: String});
            map('foo').set('bar', {hidden: true});

        return map;
      },
      'Requesting those values should yeild a transaction with error.foo': function(map) {
        var query = map('foo').get();

        assert.notEqual(null, query);
        assert.notEqual(undefined, query);
        assert.notEqual(undefined, query.error.foo);
      }
    },
    'Given we have a map that contains multiple key value pairs': {
      topic: function() {
        var map = new Valence.Structs.Map({type: String});
            map('foo').set('bar');
            map('bar').set('baz');
            map('baz').set('bang');

        return map;
      },
      'I should be able to query for multiple values at a time using ["foo", "bar"]': function(map) {
        var query = map(['foo', 'bar', 'baz']).get();

        assert.notEqual(null, query);
        assert.notEqual(undefined, query);
        assert.equal(query.success.foo, 'bar');
        assert.equal(query.success.bar, 'baz');
        assert.equal(query.success.baz, 'bang');
      }
    },
    'Given we have a map that contains multiple key value pairs with various options': {
      topic: function() {
        var map = new Valence.Structs.Map({type: String});
            map('foo').set('bar');
            map('bar').set('baz', {hiddon: true});
            map('baz').set('bang');

        return map;
      },
      'And I query for a value that is not in the store': {
        topic: function(map) {
          return map('wat').get();
        },
        'I should see an a populated error object': function(query) {

          assert.notEqual(null, query);
          assert.notEqual(undefined, query);
          assert.notEqual(query.error.wat, undefined)
        }
      }
    }
  })
  .addBatch({
    'Given we have a map with {foo:bar}': {
      topic: function() {
        var map = new Valence.Structs.Map({type: String});
            map('foo').set('bar');

        return map;
      },
      'When I remove "foo" from the map': {
        topic: function(map) {
          return {map: map,  transaction: map('foo').remove()};
        },
        'I should a success object with foo': function(data) {
          assert.notEqual(undefined, data.transaction);
          assert.equal(data.transaction.success.foo, 'bar');
        },
        'And when I query for "foo"': {
          topic: function(data) {
            console.log(data)
          }
        }
      }
    }
  })
  .export(module);