var Sequelize = Npm.require('sequelize');
var Future = Npm.require('fibers/future');
var mongo = Npm.require('mongodb');
var assert = Npm.require('asserts');


/* DbConnection */
DbConnection = function( options) {
    this.options = options;
    this.dbInstance = null;
};

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
};

MongoConnection.prototype = Object.create(DbConnection.prototype);

MongoConnection.prototype.open = function() {

     var future = new Future();
     var self = this;

     mongo.MongoClient.connect(self.connectionsString(), function (err, db) {
         self.dbInstance = db;
         future.return(self);

     });
     return future.wait();

 }.future();


MongoConnection.prototype.close = function() {
    var future = new Future();

    try {
        this.dbInstance.close(function (err, result) {

            future.return(true);
        });
    }
    catch(e) {
        future.return(null);
    }
    return future.wait();


}.future();


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
    self.dbInstance = new Sequelize(this.options.database, this.options.username, this.options.password, this.options);

    var future = new Future();
    self.dbInstance.authenticate()
        .then(
        function (value) {
            future.return(self);
        },
        function (value) {
            self.dbInstance = null;
            future.return(self);
        })
        .catch(function (err) {
            self.dbInstance = null;
            future.return(self);
        });/*.done(function(err) {
            future.return(err);
        })*/
   return future.wait()

}.future();

SequelizeConnection.prototype.close = function() {
    var future = new Future();
    try {
        this.dbInstance.close();
        console.log('SequelizeConnection.close success');
        future.return( true);
    }
    catch (e) {
        console.log('SequelizeConnection.close error');
        future.return(false);
    }
    return future.wait();


}.future();

KlabDataAccess = {
    connectionsOptions: {},
    connections: {},

    setConnections: function (conns) {
        KlabDataAccess.connectionsOptions = conns;
    },

    openConnection: function (name, options) {
        var conn = KlabDataAccess.connections[name.toLowerCase()];
        if (!conn) {
            if (['sqlite', 'postgres', 'mssql', 'mysql'].indexOf(options.dialect) > -1) {
                conn = new SequelizeConnection(options);
                KlabDataAccess.connections[name.toLowerCase()] = conn;
            }
            if (options.dialect == 'oracle') {
                conn = new OracleConnection(options);
                KlabDataAccess.connections[name.toLowerCase()] = conn;
            }
            if (['link','mongo'].indexOf(options.dialect) > -1) {
                conn = new MongoConnection(options);
                KlabDataAccess.connections[name.toLowerCase()] = conn;
            }
        }
        return conn;
    },

    connectionByName: function (name) {
        if (!KlabDataAccess.connections[name.toLowerCase()]) {
            if (KlabDataAccess.connectionsOptions[name.toLowerCase()]) {
                KlabDataAccess.connections[name.toLowerCase()] =
                    KlabDataAccess.openConnection(name, KlabDataAccess.connectionsOptions[name.toLowerCase()]);
                return KlabDataAccess.connections[name.toLowerCase()]
            }
            else
                new Meteor.Error('Connection ' + name + ' not found!')
        }
        else
            return KlabDataAccess.connections[name.toLowerCase()];
    }

};


