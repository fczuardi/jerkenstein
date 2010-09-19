this.plugin = {
    name: 'help'
  , pattern: new RegExp("^\\?help\\s?(([^\\s])+|$)")
  , description:
      'List available plugins or get information about a specific plugin'
  , example: '?help calc'
  , action: function (message, env) {
      var i, plugin, plugin_names = [];
      if (message.match_data[1] === '') {
        env.plugins.forEach(function (p) {
          plugin_names.push(p.name);
        });
        message.say(
          'Type ?help <plugin> to get information about a specific plugin.' +
          '\nAvailable plugins: ' + plugin_names.sort().join(', ')
          );
      } else {
        for (i = 0; i < env.plugins.length; i = i + 1) {
          if (env.plugins[i].name === message.match_data[1]) {
            plugin = env.plugins[i];
            message.say(
              plugin.name + ' — ' +
              plugin.description +
              '\nExample: ' + plugin.example
              );
            break;
          }
        }
      }
    }
  , url: ''
  };