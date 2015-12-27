var util = Npm.require("util");


DbCommandManager = function(connection, dbdef) {
    this.connection = connection;
    this.dbdef = dbdef;
};



SqlCommandManager = function(connection, dbdef) {
    DbCommandManager.call(this, connection, dbdef);
};

SqlCommandManager.prototype = Object.create(DbCommandManager.prototype);

SqlCommandManager.prototype.prepareInsert = function(tableName, doc) {

    var sql = util.format('INSERT INTO %s (%s) VALUES (%s)',
      tableName,
      this.dbdef.getInsertFields(tableName, doc, false),
      this.dbdef.getInsertFields(tableName, doc, true));
  return sql;
};

SqlCommandManager.prototype.prepareUpdate = function(tableName, doc) {
  //var fields = this.dbdef.getFields(tableName,doc);
  //var linkFields = this.dbdef.getLinkFields(tableName,doc);
  var fields = this.dbdef.getFields(tableName,doc);
  var sql = util.format("UPDATE %s set ", tableName);

  for (field in fields) {
      console.log(field)
     sql += util.format("%s = :%s,", fields[field]['linkFieldName'] == undefined ? field : fields[field]['linkFieldName'], field);
  }
  // remove the last ','
  sql = sql.slice(0, -1);
  sql += util.format(' WHERE mid = :_id');
  return sql;
};

SqlCommandManager.prototype.prepareDelete = function(tableName) {
  var sql = util.format("DELETE FROM  %s WHERE mid = :_id'", tableName);
  return sql;
};


SequelizeCommandManager = function(dbdef) {
    SqlCommandManager.call(this, dbdef);
};

SequelizeCommandManager.prototype = Object.create(SqlCommandManager.prototype);

SequelizeCommandManager.prototype.execSql = function(tableName, doc, action) {

}

/*
SequelizeCommandManager.prototype.import = function(tableName, doc, options) {
    var self = this;
    var future = new Future();
    var sql = '';

    try {
        var seqCommand = new SequelizeCommand(self.connection);
            sql = self.prepareInsert(tableName, doc);
            seqCommand.Insert(sql, doc).wait();
        future.return(true);
    }
    catch(e) {
        future.return(false);

    }
    return future.wait();
}.future();
*/