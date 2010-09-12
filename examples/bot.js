//config
var options = { 
       server: 'irc.freenode.net'
      ,nick: 'bullwinkle'
      ,channels: ['#bullwinkle-dev', "#external-ning-2.0"]
    }

//libraries
var  jerkenstein = require('../lib/jerkenstein')
    ,fs = require('fs')
    ,path = require('path');

//global vars
var plugins_dir = path.join(__dirname, 'plugins');

//init
fs.readdir(plugins_dir, function(err, files){
  if (err) throw err;
  //load all plugins
  files.forEach(function(filename){
    filename = path.join(plugins_dir, filename)
    jerkenstein.plug(require(filename.slice(0,-3)).plugin)
  });
  //connect
  jerkenstein(function(){}).connect(options)
});