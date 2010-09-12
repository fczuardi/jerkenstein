//= Private vars
var  _plugs = [] 
    ,_output = {}
    ,_output_disabled = {}
    ,_debug = false;

//== Libraries
var jerk = require('../vendor/Jerk/lib/jerk')

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
              ,plugs:_plugs
              ,say:function(text){
                _output[m.source][_plugs[index].name] = text;
              }
              ,mutePlugin: disableNextOutputFromPlugin
            });
          }
      var action = eval('['+wrapped_action.toString().replace(/index/gm,index)+']')[0]
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
function disableNextOutputFromPlugin(plugin_name){
  _output_disabled[plugin_name] = true;
}
function beforeFirstMatch(m){
  if(_debug) m.say('before first match')
  _output[m.source] = {};
  _output_disabled = {};
  _plugs.forEach(function(plugin){
    _output[m.source][plugin.name] = []
  });
  
}
function afterLastMatch(m){
  if(_debug) m.say('after last match')
  //apply output changes here
  for(var command_name in _output[m.source]){
    var outputs_from_command = _output[m.source][command_name]
    if ((!_output_disabled[command_name]) && (_output[m.source][command_name].length!=0)){
      m.say(_output[m.source][command_name]);
    }
  }
}