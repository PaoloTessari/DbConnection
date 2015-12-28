

DbTable = function(DbConnection, tableName) {
    this.conn = DbConnection;
    this.tableName = tableName
};

DbCommand.prototype.execute = function(callback) {
};

SqlCommand = function(DbConnection) {
    DbCommand.call(this, DbConnection);
};

SqlCommand.prototype = Object.create(DbCommand.prototype);

