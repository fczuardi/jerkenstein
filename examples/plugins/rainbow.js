this.plugin = {
    name: 'rainbow'
  , pattern: new RegExp("^\\?rainbow ((.|\\n)+)", 'm') 
  , description: 'Colorize the message like a rainbow.'
  , example: "?rainbow What does it mean?"
  , action: function (message) {
      var i
          , output = ''
          , lettercount = 0
          , rainbow_colors = ['04', '07', '08', '03', '12', '06']
          , color_code;
      for (i = 0; i < message.match_data[1].length; i = i + 1) {
        if (message.match_data[1][i] !== '\x03') {
          color_code = rainbow_colors[lettercount % rainbow_colors.length];
          color_code = '\x03' + color_code;
          output += color_code + message.match_data[1][i];
          lettercount = lettercount + 1;
        } else {
          i = i + 2;
        }
      }
      message.say(output);
    }
  , url: 'http://gist.github.com/575882'
  };
// after Supybot by Jeremiah Fincher and others
// http://supybot.git.sourceforge.net/git/gitweb.cgi?p=supybot/supybot;a=blob;f=plugins/Filter/plugin.py;h=23b6277ffa4b23d9023f1f179a649e76ba1e7214;hb=HEAD#l353