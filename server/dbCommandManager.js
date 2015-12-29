var util = Npm.require("util");
var Future = Npm.require('fibers/future');


DbCommandManager = function(connection) {
    this.connection = connection;
    this.command = null;
};


DbCommandManager.prototype.setCommand = function(command) {
  this.command = command;
}

SqlCommandManager = function(connection) {
    DbCommandManager.call(this, connection);
    this.sql = '';


};

SqlCommandManager.prototype = Object.create(DbCommandManager.prototype);


SqlCommandManager.prototype.prepareSql = function(tableName, doc, action) {
    this.sql = ''
    if(action == 'i') {
        var fields =  this.getInsertFields(doc, false);
        var params = this.getInsertFields(doc, true);
        this.sql = util.format('INSERT INTO %s (%s) VALUES (%s)', tableName, fields,params);
    }
    else  if(action == 'u') {
        this.sql = util.format("UPDATE %s set %s %s", tableName, this.getUpdateFields(doc), this.getFilter(tableName));
    }
    else  if(action == 'd') {
        this.sql = util.format("DELETE FROM  %s %s ", tableName, this.getFilter(tableName));
    }
    console.log(this.sql);
    //return sql;

}

SqlCommandManager.prototype.prepareInsert = function(tableName, doc) {

  this.prepareSql(tableName,doc, 'i');
};

SqlCommandManager.prototype.prepareUpdate = function(tableName, doc) {

    this.prepareSql(tableName,doc, 'u');
};

SqlCommandManager.prototype.prepareDelete = function(tableName) {
    this.prepareSql(tableName,doc, 'd');
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
       result+= asParam ? ':'+item+',' : '{'+item+'},';
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

    this.setCommand(new SequelizeCommand(connection));
}


SequelizeCommandManager.prototype = Object.create(SqlCommandManager.prototype);

SequelizeCommandManager.prototype.execSql = function(sql, doc, action) {
    try {

    var future = new Future();

    future.return(this.command.execSql(sql, doc, action).wait());
    return future.wait();
}
    catch(e) {
        console.log(e)
    }
}.future();



OpSequelizeCommandManager = function(connection, dbUtil) {
    SequelizeCommandManager.call(this, connection);
    this.dbUtil = dbUtil;
    this.tableName = '';
}

OpSequelizeCommandManager.prototype = Object.create(SqlCommandManager.prototype);



OpSequelizeCommandManager.prototype.execSql = function(doc, action) {
    try {

        var self = this;
        var future = new Future();
        var record =  action == 'u' ? _.extend({}, doc.o.$set)  : _.extend({}, doc.o);
        if( action == 'u')
            record['_id'] = doc.o2['_id'].toString();
        else if(action == 'd')
            record['_id'] = doc.o['_id'].toString();

        this.dbUtil.normalizeValues(this.tableName, record);

        future.return(this.command.execSql(this.sql, record, action).wait());
        return future.wait();
    }
    catch(e) {
        console.log(e)
    }
}.future();

OpSequelizeCommandManager.prototype.prepareInsert = function(tableName, doc) {
    this.tableName = tableName;
    this.prepareSql(tableName,doc, 'i');
    this.sql = this.dbUtil.renameLinkFields(tableName, this.sql);
}

OpSequelizeCommandManager.prototype.prepareUpdate = function(tableName, doc) {
    var sql = this.prepareSql(tableName,doc, 'u');
    return  this.dbUtil.renameLinkFields(tableName, sql);
}

OpSequelizeCommandManager.prototype.prepareDelete = function(tableName, doc) {
    var sql = this.prepareSql(tableName,doc, 'd');
    return  this.dbUtil.renameLinkFields(tableName, sql);
}

//sql = this.options.dbUtil.renameLinkFields(this.getCollectionName(doc), sql);


