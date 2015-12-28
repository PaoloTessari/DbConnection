var util = Npm.require("util");


DbCommandManager = function(connection) {
    this.connection = connection;
};



SqlCommandManager = function(connection) {
    DbCommandManager.call(this, connection);
};

SqlCommandManager.prototype = Object.create(DbCommandManager.prototype);

SqlCommandManager.prototype.prepareInsert = function(tableName, doc) {

    var sql = util.format('INSERT INTO %s (%s) VALUES (%s)',
      tableName,
      this.getInsertFields(doc, false),
      this.getInsertFields(doc, true));
  return sql;
};

SqlCommandManager.prototype.prepareUpdate = function(tableName, doc) {

  var sql = util.format("UPDATE %s set %s %s", tableName, this.getUpdateFields(doc),this.getFilter(tableName));
  return sql;
};

SqlCommandManager.prototype.prepareDelete = function(tableName) {
  var sql = util.format("DELETE FROM  %s ", tableName) + this.getFilter(tableName);
  return sql;
};

SqlCommandManager.prototype.getFilter = function(tableName) {
    return (' WHERE mid = :_id');
};

// Return list of field as
// 'fieldName1, fieldName
// :fieldName1, fieldNamen (if asParam == true)
SqlCommandManager.prototype.getInsertFields = function (doc, asParam) {
    var result = '';
    for (item in doc.o) {
       result+= asParam ? ':'+item : '{'+item+'}';
    }
    result = result.slice(0, -1);
    return result;
};

// Return list of field as
// 'fieldName1, fieldName
// :fieldName1, fieldNamen (if asParam == true)
SqlCommandManager.prototype.getUpdateFields = function (doc) {
    var result = '';
    for (item in doc.o.$set) {
    //for (item in doc.o) {
        console.log('getUpdateFields '+item);
        result += util.format(" {%s} = :%s,", item, item);
    }
    result = result.slice(0, -1);

    return result;
};


SequelizeCommandManager = function(connection) {
    SqlCommandManager.call(this, connection);
};

SequelizeCommandManager.prototype = Object.create(SqlCommandManager.prototype);

SequelizeCommandManager.prototype.execSql = function(tableName, doc, action) {

};

