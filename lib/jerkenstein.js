
//= Libraries
var   jerk = require('../vendor/Jerk/lib/jerk')
    , fs = require('fs')
    , path = require('path');


var config = {
    ENGINE: 'fczuardi/jerkenstein'
  , VERSION: fs.readFileSync(path.join(process.cwd(), 
                                        '.git/refs/heads/master')).toString()
  };
    
var   bot
    , plugs = []
    , running_jobs = []
    , current_job = -1
    , robot_env = {
    version: null
  , engine: null
  , start_time: null
  , plugins: null
  };

//= Private Functions

/*
We call a "job" the process that starts with the arrival of a message and 
ends when all plugins activated by that message have finished their work.
*/
function Job(message, id) {
  this.id = id;
  this.message = message;
  this.plugins_to_mute = {};
  this.output_queue = {};
  this.output_locked = true;
}
function queueOutput(job_id, plugin_name, text) {
  running_jobs[job_id].output_queue[plugin_name] = 
                    running_jobs[job_id].output_queue[plugin_name] ?
                    running_jobs[job_id].output_queue[plugin_name] : [];
  running_jobs[job_id].output_queue[plugin_name].push(text);
}
function jerkensteinSay(job_id, plugin_name, text) {
  if (!running_jobs[job_id].output_locked) {
    if (running_jobs[job_id].plugins_to_mute[plugin_name]) { 
      return;
    }
    bot.say(running_jobs[job_id].message.source, text);
  } else {
    queueOutput(job_id, plugin_name, text);
  }
}
function unlockOutput(job_id) {
  var   plugin_name
      , plugin_output_queue
      , line;
  running_jobs[job_id].output_locked = false;
  for (plugin_name in running_jobs[job_id].output_queue) {
    if (running_jobs[job_id].output_queue.hasOwnProperty(plugin_name)) {
      plugin_output_queue = running_jobs[job_id].output_queue[plugin_name];
      for (line = 0; line < plugin_output_queue.length; line = line + 1) {
        jerkensteinSay(job_id, plugin_name, plugin_output_queue[line]);
      }
    }
  }
}
function beforeFirstMatch(message) {
  current_job = running_jobs.push(new Job(message, running_jobs.length)) - 1;
}
function afterLastMatch(message) {
  unlockOutput(current_job);
}
function mutePlugin(job_id, plug_name) {
  running_jobs[job_id].plugins_to_mute[plug_name] = true;
}
function runPlugin(plug_name, message) {
  plugs.forEach(function (plugin) {
    if (plugin.name === plug_name) {
      plugin.action(message, robot_env);
    }
  });
}
function setupConnection(options) {
  robot_env.start_time = parseInt(Date.now().toString(), 10);
  robot_env.version = config.VERSION;
  robot_env.engine = config.ENGINE;
  robot_env.plugins = [];
  plugs.forEach(function (plugin) {
    var public_accessible_plugin = JSON.parse(JSON.stringify(plugin));
    public_accessible_plugin.pattern = plugin.pattern;
    robot_env.plugins.push(public_accessible_plugin);
  });
  
  //add the watch_for rule that will be executed first
  bot = jerk(function (j) { 
    j.watch_for(new RegExp(".*"), function (message) {
      beforeFirstMatch(message);
    });
  }).connect(options);
}

//= Public Methods

//== plug()
exports.plug = function () {
  var   plugins = []
      , i;
  for (i = 0; i < arguments.length; i = i + 1) {
    plugins = plugins.concat(arguments[i]);
  }
  jerk(function (j) {
    var   i
        , index
        , bound_action
        , extendedAction = function (env, message) {
          message.say = jerkensteinSay.bind(null, current_job, this.name);
          message.mutePlugin = mutePlugin.bind(null, current_job);
          message.runPlugin = runPlugin.bind(null);
          this.action(message, env);
        };
    for (i = plugins.length - 1; i >= 0; i = i - 1) {
      index = plugs.push(plugins[i]) - 1;
      bound_action = extendedAction.bind(plugs[index], robot_env);
      j.watch_for(plugs[index].pattern, bound_action);
    }
  });
};

//== connect()
exports.connect = function (options) {
  setupConnection(options);
};

//= Init
jerk(function (j) { 
  j.watch_for(new RegExp(".*"), afterLastMatch); 
});
