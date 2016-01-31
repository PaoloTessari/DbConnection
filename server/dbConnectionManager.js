//"use strict";

var Future = Npm.require('fibers/future');



DbConnectionManager = function(settingConnections) {
    this.connections = {};
    //this.aliases = [];
    this.settings = settingConnections;

    // private functions
    /*
    var getIndex = function(name) {
        try {
            return  _.indexOf(this.aliases, name);
        }
        catch(e) {
            return -1;
        }
    };
    */
};


DbConnectionManager.prototype.getConnectionString = function(alias) {
    if(this.settings[alias].dialect == 'mongo') {
      return 'mongodb://'+this.settings[alias].host+':'+this.settings[alias].port+'/'+this.settings[alias].db;
    }
    else
      return "todo sql connection string"
};


DbConnectionManager.prototype.open = function(alias) {
    var self = this;


    var future = new Future();

    var conn = self.get(alias).wait();
    if(!conn) {
        if (self.settings[alias].dialect == 'mongo') {
            conn = new MongoConnection(self.settings[alias]);
        }
        else {
            conn = new SequelizeConnection(self.settings[alias]);
        }

        self.connections[alias.toLowerCase()] = conn;
    }

    future.return( conn.open().wait());
    return future.wait();

}.future();


DbConnectionManager.prototype.get = function(alias) {
    var self = this;
    var future = new Future();
    /*
    var ind = _.indexOf(self.aliases, name);
    if(ind != -1) {
        future.return(self.connections[ind]);
    }
    else
        future.return(null);
    */
    future.return(self.connections[alias.toLowerCase()]);
    return future.wait();

}.future();

/*
DbConnectionManager.prototype.getIndex = function(name) {
    try {
        return  _.indexOf(this.aliases, name);
    }
    catch(e) {
        return -1;
    }
};
*/


DbConnectionManager.prototype.close = function(alias) {
    var self = this;

    var future = new Future();

    var conn = self.connections[alias.toLowerCase()];
    if(conn != null) {
        try {
            self.connections[ind].close().resolve(function () {
                future.return(true);
            });
        }
        catch(e) {
            console.log(e);
            future.return(false);
        }
    }
    else {
        console.log(alias+ 'is not a valid connection');
        future.return(false);
    }

        /*
        var ind = getIndex(name);
        if(ind != -1) {
            try {
                self.connections[ind].close().resolve(function() {
                    self.remove(ind);
                    future.return(true);
                });
            }
            catch(e) {
                console.log(e);
                future.return(false);

            }
        }
        else {
            console.log(name+ 'is not a valid connection');
            future.return(false);
        }
        */

    return future.wait();

}.future();

/*
DbConnectionManager.prototype.remove = function(ind) {
    try {
        if (ind != -1) {
            this.aliases.splice(ind, 1);
            this.connections.splice(ind, 1);
            return true;
        }
        else
            return false;
    }
    catch(e) {
        return false;

    }
};
*/

DbError = function(name, message) {
    this.name = name;
    this.message = message;
};

DbError.prototype.connectionRefused = function() {
    return this.name.toLowerCase() == "sequelizeconnectionerror";
};



