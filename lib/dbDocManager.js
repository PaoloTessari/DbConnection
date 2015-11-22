

DbDocManager = function(TDbDocMaps) {
    this.docMaps = TDbDocMaps;
}


DbCommandManager.prototype = Object.create(DbDocManager.prototype);

DbCommandManager.prototype.prepare = function (type, TDoc) {
  var tdbCommandTex
    if(type == TDbCommandType.Insert) {
        return this.prepareInsert(doc);
    }
}

DbCommandManager.prototype.prepareInsert = function(doc) {
  var sql = util.format(
   "INSERT INTO %s (%s) values (%s)",
   this.docMaps.tableName,
   this.docMaps.getFields(this.docMaps.tableName, doc, false),
   this.docMaps.getFields(this.docMaps.tableName, doc, true)
 );
  return sql;
}

DbCommandManager.prototype.prepareUpdate = function(doc) {
  var fields = doc.o.$set;
  var sql = util.format("UPDATE %s set ", this.docMaps.tableName);
  for (field in fields) {
     sql += util.format("%s=:%s", field, field);
  }
  sql += util.format(' WHERE mid = :_id');
  return sql;
}

DbCommandManager.prototype.prepareDelete = function(doc) {
  var sql = util.format("DELETE FROM  %s ", this.docMaps.tableName);
  sql += util.format(' WHERE mid = :_id');
  return sql;
}


