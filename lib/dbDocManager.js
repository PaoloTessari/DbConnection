

DbCommandManager = function(TDbDocMaps) {
    this.docMaps = TDbDocMaps;
}


DbCommandManager.prototype = Object.create(DbDocManager.prototype);

DbCommandManager.prototype.prepare = function (type, doc) {
    if(type == TDbCommandType.Insert) {
        return this.prepareInsert(doc);
    }
}


SqlCommandManager.prototype = Object.create(DbCommand.prototype);

SqlCommandManager = function(TDbDocMaps) {
    DbCommandManager.call(TDbDocMaps);
}



SqlCommandManager.prototype.prepareInsert = function(doc) {
  var sql = util.format(
   "INSERT INTO %s (%s) values (%s)",
   this.docMaps.tableName,
   this.docMaps.getFields(this.docMaps.tableName, doc, false),
   this.docMaps.getFields(this.docMaps.tableName, doc, true)
 );
  return sql;
}

SqlCommandManager.prototype.prepareUpdate = function(doc) {
  var fields = doc.o.$set;
  var sql = util.format("UPDATE %s set ", this.docMaps.tableName);
  for (field in fields) {
     sql += util.format("%s=:%s", field, field);
  }
  sql += util.format(' WHERE mid = :_id');
  return sql;
}

SqlCommandManager.prototype.prepareDelete = function(doc) {
  var sql = util.format("DELETE FROM  %s ", this.docMaps.tableName);
  sql += util.format(' WHERE mid = :_id');
  return sql;
}


