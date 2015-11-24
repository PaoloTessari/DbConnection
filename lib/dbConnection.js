NpmSequelize = Npm.require('sequelize');

mongo = Npm.require('mongodb');
assert = Npm.require('asserts');
//assert = require('assert');

/* DbConnection */
DbConnection = function(options) {
    this.options = options;
    this.dbInstance = null;



}

DbConnection.prototype.open = function(callback) {
}

DbConnection.prototype.close = function(callback) {
}

DbConnection.prototype.getInstance = function() {
    return this.dbInstance;
}


/* MongoConnection */
MongoConnection = function(options) {
    DbConnection.call(this, options)
}

MongoConnection.prototype = Object.create(DbConnection.prototype);

MongoConnection.prototype.open = function(callback) {
    var self = this;

    mongo.MongoClient.connect(self.connectionsString(), function(err, db) {
        //assert(null, err);

        self.dbInstance = db;

        callback(err != null);
    });

}

MongoConnection.prototype.close = function(callback) {
    this.dbInstance.close(function (err, result) {

        //assert(null, err);

        callback(err);
    });
}


MongoConnection.prototype.connectionsString = function() {
    return  'mongodb://' + this.options.host + ':' + this.options.port + '/' + this.options.db;
}

/*
MongoConnection.prototype.find = function(collectionName, callback) {
    var collection = this.dbInstance.collection(collectionName);
    collection.find({}).toArray(function(err, docs) {
        callback(err, docs);
    });
}
*/

SequelizeConnection = function(options) {
    DbConnection.call(this, options)
}



SequelizeConnection.prototype = Object.create(DbConnection.prototype);

SequelizeConnection.prototype.open = function(callback) {
    var self = this;

    try {
        self.dbInstance = new NpmSequelize(this.options.database, this.options.username, this.options.password, this.options);

        self.checkConnection(function(err) {
           callback(err);
        });
    }
    catch (error) {
        callback(true);
    }
}



SequelizeConnection.prototype.close = function(callback) {
}

SequelizeConnection.prototype.checkConnection = function(callback) {
    var self = this;
    var error = false;


    self.dbInstance.authenticate()
          .then(
            function() {
                console.log('checkConnection success');
                error = false;
            })
          .catch(
             function() {
             console.log('checkConnection fail');
             error = true;
        })
         .always(callback(error));

}


/*
SqlizeConnection = function(alias) {
    this.settingsDBConn = Meteor.settings.DbConnections;
    this.settingsDocMaps = Meteor.settings.DocMpas;
    this.alias = alias;
    this.sequelize = null



    this.getConnectionString = function() {

        var sect = this.settingsDBConn[this.alias];
        if (sect.dialect == 'mongo') {
            return 'mongodb://' + sect.host + ':' + sect.port + '/' + sect.db;
        }
    }

    this.createConnection = function(callback) {
        console.log('createConnection');
        self = this
        //process.nextTick(function() {
            try {
                var sect = self.settingsDBConn[self.alias];

                console.log(sect);

                if (sect.dialect == 'mongo') {

                }
                else {
                    self.createSqlConnection(sect, function (err, msg) {
                        callback(err, msg);
                    });
                }
            }

            catch (error) {
                console.log('Create connection error ' + error);
                callback(true, error);
            }

        //});


    }

    this.createSqlConnection = function(sect, callback) {
        console.log('createSqlConnection');
        console.log(sect);

        //console.log(NpmSequelize);
        self = this;
            try {
                console.log('before NpmSequelize');
                self.sequelize = new NpmSequelize(sect.database, sect.username, sect.password, sect);
                console.log('after NpmSequelize');
                callback(false, "createSqlConnection");
            }
            catch (error) {
                callback(true, "createSqlConnection " + error);
            }
    }

    this.checkConnection = function( callback) {
        self = this;
        process.nextTick(function() {

            var test = SqlizeConnections.find(this.alias).authenticate()
                .then(function () {
                    console.log("CONNECTED! ");
                })
                .catch(function (err) {
                    console.log("SOMETHING DONE GOOFED");
                })
                .done();
        });
    }

    /*
    this.closeConnection = function(alias, callback) {
        self = this;
        //process.nextTick(function() {

            try {
                self.connections[alias];
                callback(false);
            }
            catch (e) {

                callback(true)
            }
        //});
    }
}

}
*/

