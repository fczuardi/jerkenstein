var monologues = {};
this.plugin = {
    name: 'monologue'
  , pattern: new RegExp("^(\\?monologue(\\s|$))|^([^\\?].*)", 'm')
  , description: 'Number of lines the last user spent talking alone.'
  , example: '?monologue'
  , action: function (message, env) {
      var channel_name = message.source;
      if (message.match_data[0].substring(0, 10) !== '?monologue') {
        if ((!monologues[channel_name]) ||
            (monologues[channel_name].user !== message.user)) {
          monologues[channel_name] = {user: message.user, count: 1};
        } else {
          monologues[channel_name].count += 1;
        }
      } else {
        message.say(
          monologues[channel_name].user + ' has been talking alone for ' +
          monologues[channel_name].count + ' lines.'
          );
      }
    }
  , url: ''
  };