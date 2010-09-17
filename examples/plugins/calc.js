/*globals process*/
var   basic = "[0-9\\+\\-\\*\\/\\%\\.\\,\\(\\)\\s]"
    , math_properties = "E|LN2|LN10|LOG2E|LOG10E|PI|SQRT1_2|SQRT2"
    , math_methods = "abs|acos|asin|atan|atan2|ceil|cos|exp|floor" +
                     "|log|max|min|pow|random|round|sin|sqrt|tan"
    , pattern = new RegExp('^\\?calc ((' + basic + 
                           '|Math\\.(' + math_properties +
                           '|((' + math_methods + ')\\()))+)$')
    , Script = process.binding('evals').Script;

this.plugin = {
    name: 'calc'
  , pattern: pattern
  , description: 'Calculate basic arithmetic.'
  , example: '?calc 2+2'
  , action: function (message) {
      try {
        var prefix = (message.user) ? (message.user + ': ') : ('');
        message.say(prefix + 
                    message.match_data[1] + ' = ' + 
                    Script.runInThisContext((message.match_data[1]).toString())
                    );
      } catch (e) {
        message.say('err');
      }
    }
  , url: 'http://gist.github.com/575830'
  };