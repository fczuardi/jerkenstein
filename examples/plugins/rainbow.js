this.plugin = {
   'name': 'rainbow'
  ,'pattern': /^\?rainbow (.+)$/ 
  ,'description': 'Colorize the message like a rainbow.'
  ,'example': "?rainbow What does it mean?"
  ,'action': function(message) {
    var output = ''
    var lettercount = 0
    for(i=0; i < message.match_data[1].length; i++){
      var rainbow_colors = [4, 7, 8, 3, 12, 6]
      if (message.match_data[1][i] != '\x03'){
        color_code = rainbow_colors[lettercount % rainbow_colors.length].toString()
        color_code = '\x03'+((color_code.length<2) ? ('0'+color_code) : color_code)
        output += color_code+message.match_data[1][i]
        lettercount++;
      }else{
        i = i+2;
      }
    }
    message.say(output)
  }
  ,'url': 'http://gist.github.com/575882'
}
// after Supybot by Jeremiah Fincher and others
// http://supybot.git.sourceforge.net/git/gitweb.cgi?p=supybot/supybot;a=blob;f=plugins/Filter/plugin.py;h=23b6277ffa4b23d9023f1f179a649e76ba1e7214;hb=HEAD#l353