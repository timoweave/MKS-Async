var config = {
  server: {
    port: 3000
  },
  mongoose: {
    local: 'mongodb://localhost:27017/async',
    mlab: 'mongodb://mks.async:Makersquare_1234@ds045031.mlab.com:45031/heroku_d4w7lpz9',
    option: {
      server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
      replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }
    }
  }
};

module.exports = config;