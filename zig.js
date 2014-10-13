//"use strict";

var _ = require('underscore')


function Zig( options ) {
  var self = this
  options = options || {}

  var trace = options.trace || function(){}
  trace = (_.isBoolean(trace) && trace) ? function(){
    var args = Array.prototype.slice.apply(arguments)
    args.unshift('zig')
    console.log.apply(null,args)
  } : trace

  var errhandler = console.log
  var complete   = console.log
  var ifdepth    = 0

  var steps = []

  function execute() {
    var step,data,dead=false
    var ifdepth = 0, active = true
    var collect = 0, collector = []

    //console.log(options)

    if( options.timeout ) {
      setTimeout(function(){
        //console.log('TO')
        dead = true

        // TODO: use eraro
        var err = new Error('TIMEOUT')
        err.code = 'timeout'
        errhandler(err)

      },options.timeout)
    }

    function nextstep() {
      if( dead ) return;

      step = steps.shift()
      trace(step,data)

      if( !step ) {
        if( 0 < ifdepth ) throw new Error(ifdepth+' missing endifs.')
        return complete(null,data);
      }

      if( 'step' == step.type && active ) {
        trace('step')
        data = step.fn(data)
        setImmediate(nextstep)
      } 
      else if( 'run' == step.type && active ) {
        //console.log('run')
        collect++
        step.fn(data,function(err,out){
          if( err ) return errhandler(err);
          collector.push(out)
          check_collect()
        })
        setImmediate(nextstep)
      }
      else if( 'wait' == step.type && active ) {
        //console.log('wait')
        
        if( 0 == collect ) return wait_fn();
        check_collect()
      }
      else if( 'if' == step.type ) {
        //console.log('if')
        if( 0 == ifdepth ) {
          active = evalif(data,step.cond)
          ifdepth++;
        }
        else ifdepth++;
        setImmediate(nextstep)
      }
      else if( 'endif' == step.type ) {
        //console.log('endif')
        ifdepth--;
        ifdepth = ifdepth < 0 ? 0 : ifdepth;
        active = 0 == ifdepth;
        setImmediate(nextstep)
      }
      else setImmediate(nextstep)


      function check_collect() {
        if( dead ) return;

        if( collector.length == collect ) {
          data = _.clone(collector)
          collect = 0
          collector = []
          wait_fn()
        }
      }

      function wait_fn() {
        step.fn(data,function(err,out){
          if( err ) return errhandler(err);
          data = out
          setImmediate(nextstep)
        })
      }

    }
    nextstep()
  }

  
  function evalif(data,cond) {
    var bool = false

    if( _.isFunction(cond) ) {
      bool = cond(data)
    }
    else if( _.isBoolean(cond) ) {
      bool = cond
    }
    else if( _.isString(cond) ) {
      bool = !!eval(cond)
    }

    //console.log('evalif',bool,cond)
    return bool
  }


  self.start = function( cb ) {
    errhandler = cb
    return self;
  }

  self.end = function( cb ) {
    // TODO: catch unmatched if-endif
    complete = cb || errhandler
    errhandler = complete
    execute()
  }
  
  self.wait = function( fn ) {
    steps.push({
      type:'wait',
      fn:fn
    })
    return self;
  }

  self.step = function( fn ) {
    steps.push({
      type:'step',
      fn:fn
    })
    return self;
  }

  self.if = function( cond ) {
    steps.push({
      type:'if',
      cond:cond
    })
    return self;
  }

  self.endif = function() {
    steps.push({
      type:'endif'
    })
    return self;
  }

  self.run = function( fn ) {
    steps.push({
      type:'run',
      fn:fn
    })
    return self;
  }

}



module.exports = function(options){
  return new Zig(options)
}
