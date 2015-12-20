

DbCommandManager = function(connection, dbdef) {
    this.connection = connection;
    this.dbdef = dbdef;
}



SqlCommandManager = function(connection, dbdef) {
    DbCommandManager.call(this, connection, dbdef);
}

SqlCommandManager.prototype = Object.create(DbCommandManager.prototype);

SqlCommandManager.prototype.prepareInsert = function(tableName, doc) {

    /*
    var sql = util.format(
   "INSERT INTO %s (%s) values (%s)",
   this. tableName,
   this.dbdef.getInsertFields(tableName, doc, false),
   this.dbdef.getInsertFields(tableName, doc, true)
 );

 */

    var sql = 'INSERT INTO '+tableName+ ' '+'('+this.dbdef.getInsertFields(tableName, doc, false)+') VALUES ('+
        this.dbdef.getInsertFields(tableName, doc, true)+')';
  return sql;
}

SqlCommandManager.prototype.prepareUpdate = function(tableName, doc) {
  //var fields = this.dbdef.getFields(tableName,doc);
  //var linkFields = this.dbdef.getLinkFields(tableName,doc);
  var fields = this.dbdef.getFields(tableName,doc);
  var sql = util.format("UPDATE %s set ", tableName);

  for (field in fields) {
     sql += util.format("%s=:%s", field.linkFieldName, field);
  }
  sql += util.format(' WHERE mid = :_id');
  return sql;
}

SqlCommandManager.prototype.prepareDelete = function(tableName) {
  var sql = util.format("DELETE FROM  %s ", tableName);
  sql += util.format(' WHERE mid = :_id');
  return sql;
}


SequelizeCommandManager = function(dbdef) {
    SqlCommandManager.call(this, dbdef);
}

SequelizeCommandManager.prototype = Object.create(SqlCommandManager.prototype);

SequelizeCommandManager.prototype.import = function(tableName, docs, options) {
    var self = this;
    var future = new Future();
    var sql = '';

    try {
        var seqCommand = new SequelizeCommand(self.connection);
        for (doc in docs) {
            sql = self.prepareInsert(tableName, doc);
            seqCommand.Insert(sql, doc).wait();
        }
        future.return(false);
    }
    catch(e) {
        future.return(true);

    }
    return future.wait();
}.future();
