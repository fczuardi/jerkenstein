/*
Glossary:

  job = the process that starts with the arrival of a message and ends when 
        all plugins activated by that message have finished their work.
  
*/
var  _jerk = require('../vendor/Jerk/lib/jerk')
    ,_bot
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
  _jerk(function(j) {
    var i = plugins.length
    while (i--){
      var  index = _plugs.push(plugins[i]) - 1
          ,encapsulated_action = function(message){
            _plugs[index].action(eeval("[replaceSayMethod(message, _current_job, 'plugin_name')]")[0], _robot_env);
          }
          ,hollaback = eval('['+encapsulated_action.toString().replace(/index/gm,index)
                                .replace('eeval', 'eval').replace('plugin_name',_plugs[index].name)+']')[0];
      j.watch_for(_plugs[index].pattern, hollaback);
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
  var mutePluginString = function(plug_name){
    _running_jobs[job_id].muteList[plug_name] = true
  }.toString()
  var sayString = function(text){
    if (!_running_jobs[job_id].output_locked) {
      say(job_id, 'plugin_name', text)
    }else{
      queueOutput(job_id, 'plugin_name', text)
    }
  }.toString()  
  message_obj.mutePlugin = eval('['+mutePluginString.replace('job_id',job_id)+']')[0]
  message_obj.say = eval('['+sayString.replace(/job_id/gm,job_id).replace(/plugin_name/gm, plugin_name)+']')[0]
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
  //add the watch_for rule that will be executed lastly
  _jerk(function(j) { 
    j.watch_for(/.*/, function(message) {
      afterLastMatch(message);
    }); 
  });
}

function setupConnection(options){
  _robot_env.plugs = _plugs;
  
  //add the watch_for rule that will be executed first
  _bot = _jerk(function(j) { 
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
