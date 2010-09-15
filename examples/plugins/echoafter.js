this.plugin = {
   'name': 'echoafter'
  ,'pattern': /^\?echoafter ([0-9]+) ((.|\n)+)/m 
  ,'description': 'Echo a message after n seconds.'
  ,'example': '?echoafter 5 Hello Five-Seconds-Later-World.'
  ,'action': function(message) {
    setTimeout(function(message){
      message.say(message.match_data[2])
    }, 1000*message.match_data[1], message);
  }
  ,'url': ''
}