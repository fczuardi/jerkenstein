//lynx installed on your machine is required
var spawn = require('child_process').spawn
var google_search_url = "http://www.google.com/search?q="

this.plugin = {
   'name': 'google'
  ,'pattern': /^\?google (.+)$/ 
  ,'description': 'Top 5 Google search results for a query. Excluding Google products links.'
  ,'example': '?google ning atom api'
  ,'action': function(message) {
    var google_results = spawn('lynx', [
                                   '-dump'
                                  ,'-listonly'
                                  ,google_search_url+encodeURI(message.match_data[1])
                                ]);
    google_results.stdout.on('data', function (data) {
      this.data += data
    });     
    google_results.on('exit', function (code) {
      var  google_urls_pattern = /^.*http[^\.]+\.(google|googleusercontent).com.*\n/gm
          ,urls_pattern = /http[^\.]+\.[^\n]+/gm
          ,results = this.stdout.data.toString()
                                              .replace(google_urls_pattern,'')
                                              .match(urls_pattern)
      console.log('search complete')
      message.say(message.user + ': Search results for '+message.match_data[1]+
                                  '\n'+results.splice(0,5).reverse().join('\n'))
    });
    google_results.stderr.on('data', function (data) {
      console.log('stderr: ' + data);
      message.say('stderr: ' + data)
    });

  }
  ,'url': ''
}