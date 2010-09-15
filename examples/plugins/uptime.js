this.plugin = {
   'name': 'uptime'
  ,'pattern': /^\?uptime(\s|$)/ 
  ,'description': 'The ammount of time (in milliseconds) the bot is running uninterrupted.'
  ,'example': '?uptime'
  ,'action': function(message, env) {
    var delta = (Date.now() - env.start_time)
    message.say(delta.toString());
  }
  ,'url': ''
}