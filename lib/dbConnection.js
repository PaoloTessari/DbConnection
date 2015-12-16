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

//SequelizeConnection.prototype.open = function(callback) {
SequelizeConnection.prototype.open = function() {
    var self = this;
    self.dbInstance = new NpmSequelize(this.options.database, this.options.user, this.options.password, this.options);
    /*
    self.dbInstance.query("SELECT 1 AS RESULT", { type: self.dbInstance.QueryTypes.SELECT})
        .then(function(result) {
            callback(result);
            // We don't need spread here, since only the results will be returned for select queries
        })
   */
/*
    var p1  = self.dbInstance.query("SELECT 1 AS RESULT", { type: self.dbInstance.QueryTypes.SELECT});
    p1.then(function(results) {
          return false
          //console.log(results);
          //return false;
    },function(reason) {
        //console.log(reason);
        return true;
        //callback(true)
    });

*/

     //return future.wait();
    var future = new Future();
    self.dbInstance.authenticate()
        .then(
        function (value) {
            future.return(false);
        },
        function (value) {
            future.return(true);
        })
        .catch(function (err) {
            future.return(err);
        }).done(function() {
            //return future.wait()
        })
 return future.wait()

}.future(this);

SequelizeConnection.prototype.close = function() {
    try {
        this.dbInstance.close();
        console.log('SequelizeConnection.close success');
        return false;
    }
    catch (e) {
        console.log('SequelizeConnection.close error');
       return true;
    }

}
/*
SequelizeConnection.prototype.checkConnection = function(callback) {
    var self = this;
    self.dbInstance.authenticate()
        .then(
        function (err) {
            callback(false)
        })
        .catch(function (err) {
            callback(true)
        })



}
*/



