//config
var options = { 
       server: 'irc.freenode.net'
      ,nick: 'bullwinkle_sfw'
      ,channels: ["#external-ning"]
    }

//libraries
var  jerkenstein = require('../lib/jerkenstein')
    ,fs = require('fs')
    ,path = require('path');

//global vars
var plugins_dir = path.join(__dirname, 'plugins');
var disabled_plugins = ['stack'];

//init
fs.readdir(plugins_dir, function(err, files){
  if (err) throw err;
  //load all plugins
  files.forEach(function(filename){
    filename = filename.slice(0,-3)
    for(i in disabled_plugins){
      if (filename == disabled_plugins[i]){ return; }
    }
    console.log('loading %s…', filename)
    filename = path.join(plugins_dir, filename)
    jerkenstein.plug(require(filename).plugin)
  });
  //connect
  jerkenstein.connect(options);
});