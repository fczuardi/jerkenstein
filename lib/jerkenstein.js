/*
Glossary:

  job = the process that starts with the arrival of a message and ends when 
        all plugins activated by that message have finished their work.
  
*/
var  jerk = require('../vendor/Jerk/lib/jerk')
    ,fs = require('fs')
    ,path = require('path');

var config = {
   ENGINE: 'fczuardi/jerkenstein'
  ,HEAD_FILE_PATH: path.join(__dirname, '../.git/refs/heads/master')
}
    
var _bot
    ,_plugs = []
    ,_running_jobs = []
    ,_current_job = -1
    ,_robot_env = {}
    ,_debug = false;

init();

//= Public Methods

//== plug()
this.plug = function(){
  var plugins = [];
  for (var i = 0; i < arguments.length; i++){
    plugins = plugins.concat(arguments[i]);
  }
  jerk(function(j) {
    for (var i = plugins.length-1; i > 0; i--){
      var index = _plugs.push(plugins[i]) - 1;
      var extendedAction = function(env, message){
        message.say = jerkensteinSay.bind(null, _current_job, this.name)
        message.mutePlugin = mutePlugin.bind(null, _current_job)
        message.runPlugin = runPlugin;
        this.action(message, env)
      }
      var bound_action = extendedAction.bind(_plugs[index], _robot_env)
      j.watch_for(_plugs[index].pattern, bound_action);
    }
  });
}

//== connect()
this.connect = function(options){
  setupConnection(options);
} 

//= Functions
function beforeFirstMatch(message){
  if(_debug) message.say('before first match')
  startJob(message);
}
function afterLastMatch(message){
  if(_debug) message.say('after last match')
  unlockOutput(_current_job);
}
function startJob(message){
  _current_job = _running_jobs.push({
     id: _running_jobs.length
    ,channel: message.source
    ,user: message.user
    ,text: message.text
    ,muteList: {}
    ,output_queue: {}
    ,output_locked: true
  }) -1;
}
function jerkensteinSay(job_id, plugin_name, text){
  if (!_running_jobs[job_id].output_locked) {
    if (_running_jobs[job_id].muteList[plugin_name]) return;
    _bot.say(_running_jobs[job_id].channel, text);
  }else{
    queueOutput(job_id, plug_name, text)
  }
}
function queueOutput(job_id, plugin_name, text){
  _running_jobs[job_id].output_queue[plugin_name] = 
                    _running_jobs[job_id].output_queue[plugin_name] ?
                    _running_jobs[job_id].output_queue[plugin_name] : []
  _running_jobs[job_id].output_queue[plugin_name].push(text)
}
function unlockOutput(job_id){
  _running_jobs[job_id].output_locked = false;
  for (var plugin_name in _running_jobs[job_id].output_queue){
    for (var line_number in _running_jobs[job_id].output_queue[plugin_name]){
      jerkensteinSay(job_id, plugin_name, _running_jobs[job_id].output_queue[plugin_name][line_number])
    }
  }
}
var mutePlugin = function(job_id, plug_name){
  _running_jobs[job_id].muteList[plug_name] = true
}
function runPlugin(plug_name, message){
  _plugs.forEach(function(plug){
    if(plug.name == plug_name){
      plug.action(message, _robot_env);
    }
  });
}
function init(){
  //setup environment variables
  _robot_env.engine = config.ENGINE
  _robot_env.running_since = Date.now()
  fs.readFile(config.HEAD_FILE_PATH, function (err, data) {
    if (err) throw err;
    _robot_env.version = data.toString();
  });  
  
  //add the watch_for rule that will be executed lastly
  jerk(function(j) { 
    j.watch_for(/.*/, function(message) {
      afterLastMatch(message);
    }); 
  });
}

function setupConnection(options){
  _robot_env.start_time = parseInt(Date.now().toString())
  _robot_env.plugs = _plugs; //@TODO do not pass _plugs, but only the list of names
  
  //add the watch_for rule that will be executed first
  _bot = jerk(function(j) { 
    j.watch_for(/.*/, function(message) {
      beforeFirstMatch(message);
    });
  }).connect(options);
}

//= Debug
this.__defineGetter__('debug',function(){
  return _debug;
});
this.__defineSetter__('debug',function(value){
  _debug = value;
  return value;
});
