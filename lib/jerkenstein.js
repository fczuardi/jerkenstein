var jerk = require('./Jerk/lib/jerk')

jerk.plugs = []
jerk.plug = function(){
  var plugins = [];
  for (var i = 0; i < arguments.length; i++){
    plugins = plugins.concat(arguments[i]);
  }
  jerk(function(j) {
    for(var i in plugins){
      var index = jerk.plugs.push(plugins[i]) - 1
      var pattern = jerk.plugs[index].pattern
      var wrapped_action = function(m){
            jerk.plugs[index].action({
               user:m.user
              ,source:m.source
              ,text:m.text
              ,match_data:m.match_data
              ,say:function(text){
                //apply output changes here
                m.say.call(this, text);
              }
            });
          }
      var action = eval('['+wrapped_action.toString().replace('index',index)+']')[0]
      j.watch_for(pattern, action);
    }
  });
}

module.exports = jerk;
