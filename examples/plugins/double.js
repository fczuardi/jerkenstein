this.plugin = {
   'name': 'double'
  ,'pattern': /^\?double (.+)$/ 
  ,'description': 'Print the same message but two times larger by repeating each character once.'
  ,'example': "?double Oh my God it's full on!."
  ,'action': function(message) {
    var output = ''
    for(i in message.match_data[1]){
      output += message.match_data[1][i]+message.match_data[1][i]
    }
    message.say(output)
  }
  ,'url': 'http://gist.github.com/575881'
}