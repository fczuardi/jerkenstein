//= Private vars
var  _plugs = [] 
    ,_output = {}
    ,_debug = false;

//== Libraries
var jerk = require('./Jerk/lib/jerk')

//add the watch_for rule that will be executed lastly
jerk(function(j) { j.watch_for(/^.*?$/, function(message) {
  afterLastMatch(message);
}); });

//= Public Attributes
this.__defineGetter__('debug',function(){
  return _debug;
});
this.__defineSetter__('debug',function(value){
  _debug = value;
  return value;
});


//= Public Methods

//== plug()
this.plug = function(){
  var plugins = [];
  for (var i = 0; i < arguments.length; i++){
    plugins = plugins.concat(arguments[i]);
  }
  jerk(function(j) {
    var i = plugins.length
    while (i--){
      var index = _plugs.push(plugins[i]) - 1
      var pattern = _plugs[index].pattern
      var wrapped_action = function(m){
            _plugs[index].action({
               user:m.user
              ,source:m.source
              ,text:m.text
              ,match_data:m.match_data
              ,say:function(text){
                // _output[m.source]
                //apply output changes here
                m.say.call(this, text);
              }
            });
          }
      var action = eval('['+wrapped_action.toString().replace('index',index)+']')[0]
      j.watch_for(pattern, action);
    }
  });
}

//== connect()
this.connect = function(options){
  //add the watch_for rule that will be executed first
  jerk(function(j) { j.watch_for(/^.*?$/, function(message) {
      beforeFirstMatch(message);
  }); }).connect(options);
}

//= Private functions

function beforeFirstMatch(m){
  if(_debug) m.say('before first match')
}
function afterLastMatch(m){
  if(_debug) m.say('after last match')
}