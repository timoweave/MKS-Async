var path = require('path');

/* 
 * (note: use with npm start)
 * usage: process.argv  [--port=1235] 
 *                      [--host=127.0.0.1] 
 *                      [--mlab=mongodb://USER:PSWD@XXX.mlab.com:45031/YYY] 
 *                      [--localhost=mongodb://localhost:27017/XYZ]
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
    url: 'mongodb://mks.async:Makersquare_1234@ds045031.mlab.com:45031/heroku_d4w7lpz9',
    jsonfile: path.join(__dirname, 'models.json'),
    localhost: 'mongodb://localhost:27017/async',
    mlab_test1 : 'mongodb://asyncuser:asyncpass@ds053190.mlab.com:53190/async',
    mlab_test2 : 'mongodb://asyncuser:asyncpass@ds019956.mlab.com:19956/testasync',
    mlab: 'mongodb://mks.async:Makersquare_1234@ds045031.mlab.com:45031/heroku_d4w7lpz9',
    option: {
      server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
      replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }
    },
    config: function configUrl(args) {
      args.forEach(function(arg) {
        if (arg.match('^--localhost')) {
          config.mongoose.url = arg.split('=')[1] || config.mongoose.localhost;
          return;
        }
        if (arg.match('^--mlab_test1')) {
          config.mongoose.url = arg.split('=')[1] || config.mongoose.mlab_test1;
          return;
        }
        if (arg.match('^--mlab_test2')) {
          config.mongoose.url = arg.split('=')[1] || config.mongoose.mlab_test2;
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
      });

      config.mongoose.url = config.mongoose.url || config.mongoose.mlab;
    }
  }
};

config.server.config(process.argv.slice(2));
config.mongoose.config(process.argv.slice(2));

module.exports = config;
