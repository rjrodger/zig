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

Some callbacks:

```js
function color(val,callback) {
  callback(null,{color:val})
}

function sound(val,callback) {
  callback(null,{sound:val})
}
```


Nice and linear down the page.

```js
var zig = require('..')

zig()
  .start()
  .wait(function(data,done){
    color('red',done)
  })
  .step(function(data){
    console.log('color:'+data.color)
    return {sound:true};
  })

  .if( 'data.sound' )
  .wait(function(data,done){
    sound('violin',done)
  })
  .step(function(data){
    console.log('sound:'+data.sound)
    return data;
  })
  .endif()

  .end(function(err,result){
    if( err ) return console.log(err)
    console.log(result)
  })
```


Versus callback hell:

```js
color('red', function(err,data){
  if( err ) return console.log(err)

  console.log('color:'+data.color)
  var state = {sound:true}

  if( state.sound ) {
    sound('violin',function(err,data){
      if( err ) return console.log(err)
      console.log('sound:'+data.sound)
      printresults(data)
    })
  }
  else printresults()

  function printresults(results) {
    console.log(results)
  }
})
```


## Testing

```sh
npm test
```


## Releases

   * 0.0.2: steps can exit
   * 0.0.1: first working version




