this.plugin = {
    name: 'upper'
  , pattern: new RegExp("^\\?upper ((.|\\n)+)", 'm')
  , description: 'Uppercase a message.'
  , example: '?upper consequences will never be the same.'
  , action: function (message) {
      message.say(message.match_data[1].toUpperCase());
    }
  , url: 'http://gist.github.com/576171'
  };