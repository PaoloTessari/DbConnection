NpmSequelize = Npm.require('sequelize');
var Future = Npm.require('fibers/future');

mongo = Npm.require('mongodb');
assert = Npm.require('asserts');
//assert = require('assert');

/* DbConnection */
DbConnection = function(options) {
    this.options = options;
    this.dbInstance = null;
}


DbConnection.prototype.open = function() {
};

DbConnection.prototype.close = function() {
};

DbConnection.prototype.getInstance = function() {
    return this.dbInstance;
};

/* MongoConnection */
MongoConnection = function(options) {
    DbConnection.call(this, options)
}

MongoConnection.prototype = Object.create(DbConnection.prototype);

MongoConnection.prototype.open = function() {

     var future = new Future();
     var self = this;

     mongo.MongoClient.connect(self.connectionsString(), function (err, db) {
         self.dbInstance = db;
         future.return(err != null);

     });
     return future.wait();

 }.future(this);


MongoConnection.prototype.close = function() {
    var future = new Future()
    this.dbInstance.close(function (err, result) {

       future.return(err != null);
    });
    return future.wait();

}.future(this);


MongoConnection.prototype.connectionsString = function() {
    return  'mongodb://' + this.options.host + ':' + this.options.port + '/' + this.options.db;
};


/* SequelizeConnection */
SequelizeConnection = function(options) {
    DbConnection.call(this, options)
};

SequelizeConnection.prototype = Object.create(DbConnection.prototype);

SequelizeConnection.prototype.open = function() {
    var self = this;
    var future = new Future();

    self.dbInstance = new NpmSequelize(this.options.database, this.options.user, this.options.password, this.options);

    future.return(self.checkConnection().wait());

    return future.wait()

}.future();

SequelizeConnection.prototype.close = function() {
}.future();

SequelizeConnection.prototype.checkConnection = function() {
    var self = this;

    var future = new Future();


     self.dbInstance.authenticate()
            .then(
            function () {
                future.return(false);
            }).catch(
            function () {
                future.return(true)
            }

     ).done(future.return(false))
   return future.wait();
}.future(this);



