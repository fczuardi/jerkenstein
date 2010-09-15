this.plugin = {
   'name': 'engine'
  ,'pattern': /^\?engine(\s|$)/
  ,'description': 'Information about the engine of the current bot.'
  ,'example': '?engine'
  ,'action': function(message, env) {
    message.say('Engine: '+env.engine+'\nVersion: '+env.version);
  }
  ,'url': ''
}