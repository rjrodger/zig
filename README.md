Zig - Simple, but naughty, control flow for Node.js
======================================================

> Why have an if statement when you can have an if function?

A special case solution for callback hell that focuses on developer
ease-of-use. Executes your functions in series or parallel, tracks errors and
results, and provides conditionals.


[![Build Status](https://travis-ci.org/rjrodger/zig.png?branch=master)](https://travis-ci.org/rjrodger/zig)

[![NPM](https://nodei.co/npm/zig.png)](https://nodei.co/npm/zig/)
[![NPM](https://nodei.co/npm-dl/zig.png)](https://nodei.co/npm-dl/zig/)

If you're using this plugin module, feel free to contact me on twitter if you
have any questions! :) [@rjrodger](http://twitter.com/rjrodger)

Current Version: 0.0.2

Tested on: Node 0.10.31


### Install

```sh
npm install zig
```


## Quick Example

Here's the classic Mongo example. Look ma, no callbacks! Nice and
linear down the page.

```js
var zig = require('..') 

var MongoClient = require('mongodb').MongoClient
var format = require('util').format;

var db,collection

zig({trace:false})
  .wait(function(data,done){
    MongoClient.connect('mongodb://127.0.0.1:27017/test', done)
  })
  .step(function(data){
    db = data
    return collection = db.collection('test_insert')
  })
  .wait(function(data,done){
    collection.insert({a:2},done)
  })
  .wait(function(data,done){
    collection.count(done)
  })
  .step(function(count){
    console.log(format("count = %s", count));
    return true;
  })
  .wait(function(data,done){
    collection.find().toArray(done)
  })
  .end(function(err,docs){
    if( err ) return console.log(err);
    console.dir(docs)
    db.close()
  })
```


And the original, callback hell:

```js
  var MongoClient = require('mongodb').MongoClient
  , format = require('util').format;

  MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, db) {
    if(err) throw err;

    var collection = db.collection('test_insert');
    collection.insert({a:2}, function(err, docs) {

      collection.count(function(err, count) {
        console.log(format("count = %s", count));
      });

      collection.find().toArray(function(err, results) {
        console.dir(results);
        db.close();
      });
    });
  })
```


## Testing

```sh
npm test
```


## Releases

   * 0.0.2: steps can exit
   * 0.0.1: first working version




