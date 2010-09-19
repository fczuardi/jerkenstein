//config
var options = { 
    server: 'irc.freenode.net'
  , nick: 'bullwinkle_sfw'
  , channels: ["#external-ning"]
  };

//libraries
var   jerkenstein = require('../lib/jerkenstein')
    , fs = require('fs')
    , path = require('path');

//global vars
var plugins_dir = path.join(__dirname, 'plugins');

//init
fs.readdir(plugins_dir, function (err, files) {
  if (err) {
    throw err;
  }
  //load all plugins
  var plugins = [];
  files.sort();
  files.forEach(function (filename) {
    filename = path.join(plugins_dir, filename);
    console.log('requiring %s…', filename);
    plugins.push(require(filename.slice(0, -3)).plugin);
  });
  jerkenstein.plug(plugins);
  //connect
  jerkenstein.connect(options);
});