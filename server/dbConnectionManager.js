
var Future = Npm.require('fibers/future');


DbConnectionManager = function(settingConnections) {
    this.connections = [];
    this.aliases = [];
    this.settings = settingConnections;
};



DbConnectionManager.prototype.getConnectionString = function(alias) {
    "use strict";
    if(this.settings[alias].dialect == 'mongo') {
      return 'mongodb://'+this.settings[alias].host+':'+this.settings[alias].port+'/'+this.settings[alias].db;
    }
    else
      return "todo sql connection string"


}

DbConnectionManager.prototype.open = function(alias) {

    var self = this;
    var future = new Future();

    console.log(this.settings[alias]);
    var conn = null;
    if(self.settings[alias].dialect == 'mongo') {
        conn = new MongoConnection(self.settings[alias]);
    }
    else {
        conn = new SequelizeConnection(self.settings[alias]);
    }

    self.connections.push(conn);
    self.aliases.push(alias);

    future.return( conn.open().wait());
    return future.wait();

}.future();


DbConnectionManager.prototype.getConnection = function(name) {
    var self = this;
    var future = new Future();
    var ind = _.indexOf(self.aliases, name);
    if(ind != -1) {
        future.return(self.connections[ind]);
    }
    else
        future.return(null);
    return future.wait();

}.future();

DbConnectionManager.prototype.getIndex = function(name) {
    //var future = new Future();
    try {
        var ind = _.indexOf(this.aliases, name);
        //future.return(ind);
        return ind;
    }
    catch(e) {
        //future.return(-1);
        return -1;
    }
    //return future.wait();

}//.future();


DbConnectionManager.prototype.close = function(name) {
    var self = this;

    var future = new Future();
    var ind = self.getIndex(name);
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

    return future.wait();

}.future();


DbConnectionManager.prototype.remove = function(ind) {
    //var future = new Future();
    try {
        if (ind != -1) {
            this.aliases.splice(ind, 1);
            this.connections.splice(ind, 1);
            //future.return(false);
            return true;
        }
        else
        //future.return(true);
            return false;
    }
    catch(e) {
        //future.return(true);
        return false;

    }
    //return future.wait();
}//.future();