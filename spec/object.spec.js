'use strict';

/***********************************************************************************************************************************************
 *  VALENCE OBJECT TESTS
 ***********************************************************************************************************************************************
 * @description
 */
var vows = require('vows');
var assert = require('assert');
var Valence = require('..');
var suite = vows.describe('Objects');

//
// SUITE
//------------------------------------------------------------------------------------------//
// @description
suite.addBatch({
  'When creating a Valence Object': {
    topic: function() {
      return new Valence.Types.Object();
    },
    'We should be provided an interface': function(Obj) {
      assert.notEqual(Obj, undefined);
      assert.notEqual(Obj, null);
      assert.notEqual(Obj.__proto__, undefined);
      assert.notEqual(Obj.__proto__, null);
    }
  },
  'When adding properties to an object': {
    topic: function() {
      return (new Valence.Types.Object({foo: 'bar'})).add();
    },
    'We should see the properties we added': function(Obj) {
      assert.notEqual(null, Obj);
      assert.notEqual(undefined, Obj);
      assert.notEqual(undefined, Obj.foo);
    }
  },
  'When removing properties from an object': {
    topic: function() {
      return (new Valence.Types.Object({foo: 'bar'})).add();
    },
    'We should no longer see the properties we removed': function(Obj) {
      Obj.remove('foo');

      assert.notEqual(null, Obj);
      assert.notEqual(undefined, Obj);
      assert.equal(undefined, Obj.foo);
    }
  },
  'When removing all properties from an object': {
    topic: function() {
      return (new Valence.Types.Object({foo: 'bar', bar: 'baz'})).add();
    },
    'We should see an empty object': function(Obj) {
      Obj.clean();

      assert.notEqual(null, Obj);
      assert.notEqual(undefined, Obj);
      assert.equal(Object.keys(Obj).length, 0);
    }
  }
}).export(module);