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
      var fn_action_template = function(message){
        message = __EVAL__("[replaceSayMethod(message, _current_job, '__PLUGINNAME__')]")[0]
        _plugs[__INDEX__].action(message, _robot_env);
      }.toString()
      fn_action_string =  fn_action_template.
                            replace(/__INDEX__/gm, index).
                            replace('__EVAL__', 'eval').
                            replace('__PLUGINNAME__', _plugs[index].name);
      console.log(fn_action_string)
      j.watch_for(_plugs[index].pattern, eval('['+fn_action_string+']')[0]);
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
function replaceSayMethod(message_obj, job_id, plugin_name){
  message_obj.runPlugin = runPlugin;
  var fn_mutePlugin_template = function(plug_name){
    _running_jobs[__JOB_ID__].muteList[plug_name] = true
  }.toString()
  var fn_say_template = function(text){
    if (!_running_jobs[__JOB_ID__].output_locked) {
      say(job_id, '__PLUGINNAME__', text)
    }else{
      queueOutput(__JOB_ID__, '__PLUGINNAME__', text)
    }
  }.toString()
  fn_mutePlugin_string = fn_mutePlugin_template.replace('__JOB_ID__',job_id)
  fn_say_string = fn_say_template.
                    replace(/__JOB_ID__/gm,job_id).
                    replace(/__PLUGINNAME__/gm, plugin_name)
  message_obj.mutePlugin = eval('['+fn_mutePlugin_string+']')[0]
  message_obj.say = eval('['+fn_say_string+']')[0]
  console.log(fn_mutePlugin_string)
  console.log(fn_say_string)
  return message_obj
}
function say(job_id, plugin_name, text){
  if (_running_jobs[job_id].muteList[plugin_name]) return;
  _bot.say(_running_jobs[job_id].channel, text);
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
      say(job_id, plugin_name, _running_jobs[job_id].output_queue[plugin_name][line_number])
    }
  }
}
function runPlugin(plug_name, message){
  _plugs.forEach(function(plug){
    if(plug.name == plug_name){
      plug.action(message);
    }
  });
}
function init(){
  //setup environment variables
  _robot_env.engine = config.ENGINE
  fs.readFile(config.HEAD_FILE_PATH, function (err, data) {
    if (err) throw err;
    _robot_env.version = data.toString();
  });  
  _robot_env.plugs = _plugs; //@TODO do not pass _plugs, but only the list of names
  
  //add the watch_for rule that will be executed lastly
  jerk(function(j) { 
    j.watch_for(/.*/, function(message) {
      afterLastMatch(message);
    }); 
  });
}

function setupConnection(options){
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
