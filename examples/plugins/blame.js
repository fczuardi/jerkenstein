this.plugin = {
   'name': 'blame'
  ,'pattern': /^\?blame (.+)$/ 
  ,'description': 'Find out who was the responsible for something.'
  ,'example': '?blame Who let the dogs out?'
  ,'action': function(message) {
    message.say(message.user + ': Do you want to know ' + message.match_data[1] + ' Of course it was Paul Lloyd!')
  }
  ,'url': 'http://gist.github.com/575841'
}