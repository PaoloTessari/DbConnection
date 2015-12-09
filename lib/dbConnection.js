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


DbConnection.prototype.open = function(callback) {
};

DbConnection.prototype.close = function(callback) {
    try {
    this.close();
        callback(false);
    }
    catch(e) {
        callback(true);


    }
};

DbConnection.prototype.getInstance = function() {
    return this.dbInstance;
};

/* MongoConnection */
MongoConnection = function(options) {
    DbConnection.call(this, options)
}

MongoConnection.prototype = Object.create(DbConnection.prototype);

/*
MongoConnection.prototype.open = function(callback) {
    var self = this;

    mongo.MongoClient.connect(self.connectionsString(), function(err, db) {
        //assert(null, err);

        self.dbInstance = db;

        callback(err != null);
    });

};
*/

 MongoConnection.prototype.open = function() {

     //var future = new Future();
     var self = this;

     mongo.MongoClient.connect(self.connectionsString(), function (err, db) {
         self.dbInstance = db;
         return err == null;

     });

 }.future(this);


MongoConnection.prototype.close = function(callback) {
    this.dbInstance.close(function (err, result) {

        //assert(null, err);

        callback(err);
    });
};


MongoConnection.prototype.connectionsString = function() {
    return  'mongodb://' + this.options.host + ':' + this.options.port + '/' + this.options.db;
};


/* SequelizeConnection */
SequelizeConnection = function(options) {
    DbConnection.call(this, options)
};

SequelizeConnection.prototype = Object.create(DbConnection.prototype);

SequelizeConnection.prototype.open = function(callback) {
    var self = this;

    try {
        self.dbInstance = new NpmSequelize(this.options.database, this.options.user, this.options.password, this.options);

        var future = new Future();
        self.checkConnection( function(err) {
            future.return(err);
        })
        return future.wait()

    }
    catch (error) {
        callback(true);
    }
};

SequelizeConnection.prototype.close = function(callback) {
};

SequelizeConnection.prototype.checkConnection = function(callback) {
    var self = this;

    process.nextTick( function() {
        var error = false;


        self.dbInstance.authenticate()
            .then(
            function () {
                callback(false);
            }).catch(
            function () {
                callback(true);
            });

    });

};



