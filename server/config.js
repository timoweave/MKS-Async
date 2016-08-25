var config = {
    mongoose: {
      url : 'mongodb://localhost:27017/async',
      option : {
        db: { native_parser: true },
        server: { poolSize: 5 },
        replset: { rs_name: 'myReplicaSetName' },
        user: 'myMongoUserName',
        pass: 'myMongoPassword'
      }
    }
};

module.exports = config;