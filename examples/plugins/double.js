this.plugin = {
   'name': 'double'
  ,'pattern': /^\?double (.+)$/ 
  ,'description': 'Print the same message twice.'
  ,'example': "?double Oh my God it's full on!"
  ,'action': function(message) {
    message.say(message.match_data[1]+' '+message.match_data[1])
  }
  ,'url': 'http://gist.github.com/575881'
}