
var MongoClient = require('mongodb').MongoClient;
var Promise = require('bluebird');
var days = require('./days');
Promise.promisifyAll(MongoClient);
var config = require('../config').mongo;
var uri = 'mongodb://';
if(config.username && config.password) {
  uri += config.username + ':' + config.password + '@';
}
uri += config.host + '/' + config.db;

var Mongo;
module.exports = Mongo = {
  dbPromise: MongoClient.connectAsync(uri).then(function(db) {
    return Mongo.db = db;
  }),
  getCollection: function(name) {
    var collection = this.db.collection(name);
    Promise.promisifyAll(collection);
    return collection;
  },
  setToday: function(set) {
    var collection = this.getCollection('days');
    return collection.updateAsync({
      day: days.today(),
    }, {
      $set: set
    }, {
      upsert: true
    });
  },
  getToday: function() {
    return this.getCollection('days').findOneAsync({
      day: days.today()
    });
  },
  getOnDuty: function() {
    return this.getCollection('users').findOneAsync({
      ref: 'on-duty'
    });
  },
  setOnDuty: function(set) {
    return this.getCollection('users').updateAsync({
      ref: 'on-duty'
    }, {
      $set: set
    }, {upsert: true});
  }
};
