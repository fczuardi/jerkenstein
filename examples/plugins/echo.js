this.plugin = {
   'name': 'echo'
  ,'pattern': /^\?echo (.+)$/ 
  ,'description': 'Repeat a message.'
  ,'example': '?echo Hello World.'
  ,'action': function(message) {
    message.say(message.match_data[1])
  }
  ,'url': 'http://gist.github.com/575847'
}