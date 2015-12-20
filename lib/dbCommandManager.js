

DbCommandManager = function(dbdef) {
    this.dbdef = dbdef;
}

DbCommandManager.prototype = Object.create(DbDocManager.prototype);


SqlCommandManager.prototype = Object.create(DbCommand.prototype);

SqlCommandManager = function(dbdef) {
    DbCommandManager.call(dbdef);
}


SqlCommandManager.prototype.prepareInsert = function(tableName, doc) {
  var sql = util.format(
   "INSERT INTO %s (%s) values (%s)",
   this. tableName,
   this.dbdef.getLinkFields(tableName, doc, false),
   this.dbdef.getLinkFields(tableName, doc, true)
 );
  return sql;
}

SqlCommandManager.prototype.prepareUpdate = function(tableName, doc) {
  //var fields = this.dbdef.getFields(tableName,doc);
  var linkFields = this.dbdef.getLinkFields(tableName,doc);
  var sql = util.format("UPDATE %s set ", tableName);

  for (field in linkFields) {
     sql += util.format("%s=:%s", field, linkFields);
  }
  sql += util.format(' WHERE mid = :_id');
  return sql;
}

SqlCommandManager.prototype.prepareDelete = function(tableName) {
  var sql = util.format("DELETE FROM  %s ", tableName);
  sql += util.format(' WHERE mid = :_id');
  return sql;
}


