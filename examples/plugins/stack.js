this.plugin = {
   'name': 'stack'
  ,'pattern': /^\?(.*(\{\{.+\}\}).*)+$/
  ,'description': 'Support for nested commands.'
  ,'example': '?blame Who didn\'t answer {{?rainbow {{?calc Math.PI}} }}as the value of PI on the Math test?'
  ,'action': function(message) {
    message.say('nested functions comming soon.')
  }
}