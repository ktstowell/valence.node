# valence.node
Synchronous data framework for node.js applications.

## Installation
`npm install valence.node`

## Usage

```
var Valence = require('valence.node');

// MAPS
var map = new Valence.Structs.Map();

// Add some data to your map
var set = map({foo: 'bar'}).set();

// returns a Valence.Transactions.Writeable object
// { time: 1440700348332,
//  type: 'write',
//  options: {},
//  success: { foo: 'bar' },
//  error: {},
//  struct: 'Map' }

// Query the map
var get = map('foo').get();

// Returns a Valence.Transactions.Readable object
// { time: 1440700627224,
//   type: 'read',
//   options: {},
//   success: { foo: { path: 'foo', value: 'bar' } },
//   error: {},
//   struct: 'Map' }

// Write some readonly values to the map
```