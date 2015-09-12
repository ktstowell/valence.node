# valence.node
Synchronous data framework for node.js applications.

## Installation
`npm install valence.node`

## Usage

```
var Valence = require('valence.node');

// TYPED STRUCTURES:

// Maps
var map = new Valence.Structs.Map({type: String});
var foo = map('foo');

// Add some data to your map
foo.set('bar');

// returns a Valence.Transactions.Writeable object
// { time: 1440700348332,
//  type: 'write',
//  options: {},
//  success: { foo: 'bar' },
//  error: {},
//  struct: 'Map' }

// Query the map
foo.get();

// Returns a Valence.Transactions.Readable object
// { time: 1440700627224,
//   type: 'read',
//   options: {},
//   success: { foo: 'bar' },
//   error: {},
//   struct: 'Map' }

// Write some readonly values to the map
map('bar').set('bang', {readonly: true});

// returns a Valence.Transactions.Writeable object
// { time: 1440700348332,
//  type: 'write',
//  options: {readonly: true},
//  success: { bar: 'bang' },
//  error: {},
//  struct: 'Map' }

map('bar').set('bam');

// returns a Valence.Transactions.Writeable object
// { time: 1440700348332,
//  type: 'write',
//  options: {},
//  success: {},
//  error: {bar: {error: 'Value is readonly. Use {force: true} to override.'}},
//  struct: 'Map' }

// Remove a value from a map.
foo.remove();

// returns a Valence.Transactions.Removeable object
// { time: 1440700348332,
//  type: 'remove',
//  options: {},
//  success: {foo: 'bar'},
//  error: {},
//  struct: 'Map' }
```