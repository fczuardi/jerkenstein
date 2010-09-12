this.plugin = {
   'name': 'pipe'
  ,'pattern': /^(\?[^\s]+ [^\|]+)\|(.+)$/
  ,'description': 'Feed the output of a command as the input of the next command'
  ,'example': '?echo What does it mean?|upper|double|rainbow'
  ,'action': function(message) {
    message.say(JSON.stringify(message));
  }
}
