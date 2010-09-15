this.plugin = {
   'name': 'colorize'
  ,'pattern': /^\?colorize ((.|\n)+)/m 
  ,'description': 'Randomly colorize the message.'
  ,'example': "?colorize I feel funny. Is this real life?"
  ,'action': function(message) {
    var output = ''
    for(i in message.match_data[1]){
      var color_code = (Math.floor(Math.random()*14)+2).toString() //2 to 15
      color_code = '\x03'+((color_code.length<2) ? ('0'+color_code) : color_code)
      output += color_code+message.match_data[1][i]
    }
    message.say(output)
  }
  ,'url': 'http://gist.github.com/575880'
}
// after Supybot by Jeremiah Fincher and others
// http://supybot.git.sourceforge.net/git/gitweb.cgi?p=supybot/supybot;a=blob;f=plugins/Filter/plugin.py;h=23b6277ffa4b23d9023f1f179a649e76ba1e7214;hb=HEAD#l353