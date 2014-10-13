
function color(val,callback) {
  callback(null,{color:val})
}

function sound(val,callback) {
  callback(null,{sound:val})
}


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

