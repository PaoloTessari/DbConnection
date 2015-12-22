/**
 * Created by paolo on 20/12/15.
 */

var Future = Npm.require('fibers/future');
DbConnectionManager = function(settingConnections) {
    this.connections = [];
    this.aliases = [];
    this.settings = settingConnections;
}




DbConnectionManager.prototype.open = function(alias) {

    var future = new Future();

    var conn = null;
    if(this.settings[alias].dialect == 'mongo') {
        conn = new MongoConnection(this.settings[alias]);
    }
    else {
        conn = new SequelizeConnection(this.settings[alias]);
    }

    this.connections.push(conn);
    this.aliases.push(alias);

    future.return( conn.open().wait());

    return future.wait();

}.future();


DbConnectionManager.prototype.getConnection = function(name) {
    var future = new Future();
    var self = this;
    var ind = _.indexOf(this.aliases, name);
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
        var self = this;
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
                future.return(false);
            });
        }
        catch(e) {
            console.log(e);
            future.return(true);

        }
    }
    else {
        console.log(name+ 'is not a valid connection');
        future.return(true);
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
            return false;
        }
        else
        //future.return(true);
            return true;
    }
    catch(e) {
        //future.return(true);
        return true;

    }
    //return future.wait();
}//.future();