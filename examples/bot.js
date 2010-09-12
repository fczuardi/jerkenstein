var options = { 
       server: 'irc.freenode.net'
      ,nick: 'bullwinkle'
      ,channels: ['#bullwinkle-dev', "#external-ning-2.0"]
    }

var  jerkenstein = require('../lib/jerkenstein')

jerkenstein.plug(
   require('../examples/plugins/echo').plugin
  ,require('../examples/plugins/calc').plugin
  ,require('../examples/plugins/double').plugin
  ,require('../examples/plugins/colorize').plugin
  ,require('../examples/plugins/rainbow').plugin
  );

var blame = require('../examples/plugins/blame').plugin

jerkenstein.plug(blame);
jerkenstein(function(){}).connect(options)
