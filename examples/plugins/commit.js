var   http = require('http')
    , commit_messages = []
    , github = http.createClient(80, 'github.com')
    , request = github.request('GET', 
        '/ngerakines/commitment/raw/master/commit_messages.txt', 
        {'host': 'github.com'}
        );

request.on('response', function (response) {
  response.setEncoding('utf8');
  response.on('data', function (chunk) {
    if (!this.body) {
      this.body = '';
    }
    this.body += chunk;
  });
  response.on('end', function () {
    var result = this.body.split('\n');
    if (result.length > 100) {
      commit_messages = result;
    }
  });
});
request.end();
this.plugin = {
    name: 'commit'
  , pattern: new RegExp("^\\?commit(\\s|$)")
  , description: 'A random commit message from whatthecommit.com'
  , example: '?commit'
  , action: function (message, env) {
      message.say(commit_messages[Math.floor(Math.random() * commit_messages.length)]);
    }
  , url: ''
  };