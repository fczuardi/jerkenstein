this.plugin = {
   'name': 'pipe'
  ,'pattern': /^(\?[^\s]+ [^\|]+)\|(.+)$/
  ,'description': 'Feed the output of a command as the input of the next command'
  ,'example': '?upper Oh my god its full on!|double|rainbow'
  ,'action': function(message) {
    var  first_command_string = message.match_data[1]
        ,other_command_names = message.match_data[2].split('|')
        ,pipeOutput = function(text){
          var  next_command_name = other_command_names.shift()
              ,stop_condition = (other_command_names.length == 0)
              ,command_string = '?'+next_command_name+' '+text
          if (stop_condition) {
            processCommandString.call(this,command_string, message.say)
            return true;
          }
          processCommandString.call(this,command_string, pipeOutput)
        }
        ,processCommandString = function(command_string,output_function){
          message.plugs.forEach(function(plug){
            if (md = command_string.match(plug.pattern)){
              message.mutePlugin(plug.name);
              plug.action.call(this,{
                match_data:md
                ,say:output_function
              });
            }
          });
        }
    processCommandString.call(this,first_command_string, pipeOutput)
  }
}
