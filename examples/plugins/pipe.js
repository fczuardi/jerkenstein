this.plugin = {
    name: 'pipe'
  , pattern: new RegExp("^(\\?[^\\s]+[^\\|]+)\\|(.+)$")
  , description: 'Feed the output of a plugin as the input of the next plugin'
  , example: '?upper Oh my god its full on!|double|rainbow'
  , action: function (message, env) {
      var   first_command = message.match_data[1]
          , other_commands = message.match_data[2].split('|')
          , processCommand = function (command_string, message, output_fn) {
              env.plugins.forEach(function (plug) {
                var   matches = command_string.match(plug.pattern)
                    , input_message;
                if (matches) {
                  input_message = JSON.parse(JSON.stringify(message));
                  input_message.match_data = matches;
                  input_message.say = output_fn;
                  message.mutePlugin(plug.name);
                  message.runPlugin(plug.name, input_message);
                }
              });
            }
          , pipeOutput = function (text, env) {
              var   next_command_name = other_commands.shift().trim()
                  , stop_condition = (other_commands.length === 0)
                  , command_string = '?' + next_command_name + ' ' + text;
              if (stop_condition) {
                processCommand.call(this, command_string, 
                                          message, message.say);
                return true;
              }
              processCommand.call(this, command_string, message, pipeOutput);
            };
      processCommand.call(this, first_command, message, pipeOutput);
    }
  };