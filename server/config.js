var config = {
  server: {
    port: 3000
  },
  mongoose: {
    local: 'mongodb://localhost:27017/async',
    mlab: 'mongodb://asyncuser:asyncpass@ds053190.mlab.com:53190/async',
    option: {
      server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }, 
      replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }
    }
  }
};

module.exports = config;