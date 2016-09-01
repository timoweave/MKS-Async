var path = require('path');

/* 
 * (note: use with npm start)
 * usage: process.argv  [--port=1235] 
 *                      [--host=127.0.0.1] 
 *                      [--mlab=mongodb://USER:PSWD@XXX.mlab.com:45031/YYY] 
 *                      [--localhost=mongodb://localhost:27017/XYZ]
 *                      [--testing=$USER]
 * 
 */

var config = {
  server: {
    host: '::',
    port: process.env.PORT || 3000,
    config: function configServer(args) {
      args.forEach(function(arg, index) {
        if (arg.match('^--port')) {
          config.server.port = arg.split('=')[1] || args[index + 1];
          return;
        }
        if (arg.match('^--host')) {
          config.server.host = arg.split('=')[1] || args[index + 1];
          return;
        }
      });
    }
  },
  mongoose: {
    url: undefined,
    jsonfile: path.join(__dirname, 'models.json'),
    localhost: 'mongodb://localhost:27017/async',
    mlab: 'mongodb://mks.async:Makersquare_1234@ds045031.mlab.com:45031/heroku_d4w7lpz9',
    localhost_test: 'mongodb://localhost:27017/async_test',
    mlab_test : 'mongodb://asyncuser:asyncpass@ds019956.mlab.com:19956/async_test',
    option: {
      server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
      replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }
    },
    restfulApi : function getApi() {
      var server_host = config.server.host;
      if (server_host === '::') {
        server_host = 'localhost';
      }
      return ["http://"  , server_host, ':', config.server.port, '/api'].join('');
    },
    config: function configUrl(args) {
      args.forEach(function(arg) {
        if (arg.match('^--localhost')) {
          config.mongoose.url = arg.split('=')[1] || config.mongoose.localhost;
          return;
        }
        if (arg.match('^--mlab_test')) {
          config.mongoose.url = arg.split('=')[1] || config.mongoose.mlab_test;
          return;
        }
        if (arg.match('^--mlab')) {
          config.mongoose.url = arg.split('=')[1] || config.mongoose.mlab;
          return;
        }
        if (arg.match('^--jsonfile')) { // experiment
          config.mongoose.url = arg.split('=')[1] || config.mongoose.jsonfile;
          return;
        }
        if (arg.match('^--testing')) {
          var user = arg.split('=')[1][0] || process.env.USER[0];
          var tester = {'t' : 'tim', 's' : 'sergey', 'c' : 'cindy', 'd' : 'dana' };
          config.mongoose.url = [config.mongoose.mlab_test, tester[user]].join('_');
          return;
        }
      });

      config.mongoose.url = config.mongoose.url || config.mongoose.mlab;
    }
  }
};

config.server.config(process.argv.slice(2));
config.mongoose.config(process.argv.slice(2));

module.exports = config;
