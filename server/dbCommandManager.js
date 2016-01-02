var util = Npm.require("util");
var Future = Npm.require('fibers/future');


DbCommandManager = function(connection) {
    this.connection = connection;
    this.command = null;
};


DbCommandManager.prototype.setCommand = function(command) {
  this.command = command;
}

SqlCommandManager = function(connection, dbUtil) {
    DbCommandManager.call(this, connection);
    this.dbUtil = dbUtil;
//    this.sql = '';


};

SqlCommandManager.prototype = Object.create(DbCommandManager.prototype);


SqlCommandManager.prototype.prepareSql = function(tableName, doc, action) {
    var sql = ''
    if(action == 'i') {
        var fields =  this.getInsertFields(tableName,doc, false);
        var params = this.getInsertFields(tableName,doc, true);
         return util.format('INSERT INTO %s (%s) VALUES (%s)', tableName, fields,params);
    }
    else  if(action == 'u') {
        return util.format("UPDATE %s set %s %s", tableName, this.getUpdateFields(tableName,doc), this.getFilter(tableName));
    }
    else  if(action == 'd') {
        return util.format("DELETE FROM  %s %s ", tableName, this.getFilter(tableName));
    }
    //console.log(this.sql);
    //return sql;

}

SqlCommandManager.prototype.prepareInsert = function(tableName, doc) {

  return this,prepareSql(tableName,doc, 'i');
};

SqlCommandManager.prototype.prepareUpdate = function(tableName, doc) {

    return this.prepareSql(tableName,doc, 'u');
};

SqlCommandManager.prototype.prepareDelete = function(tableName) {
    return this.prepareSql(tableName,doc, 'd');
};

SqlCommandManager.prototype.getFilter = function(tableName) {
    return (' WHERE mid = :_id');
};

// Return list of field as
// 'fieldName1, fieldName
// :fieldName1, fieldNamen (if asParam == true)
SqlCommandManager.prototype.getInsertFields = function (tableName,doc, asParam) {
    var self = this;
    var result = '';
    var field = null;
    for (item in doc.o) {

        if(doc.o[item].constructor == {}.constructor) {
            for(item2 in doc.o[item]) {
                field = self.dbUtil.getLinkField(tableName, item+'.'+item2).wait();
                if(field != null)
                 result+= asParam ? ':'+item+'_'+item2+',' : field.linkFieldName+',';
            }
        }
        else {
            field = self.dbUtil.getLinkField(tableName, item).wait();
            result += asParam ? ':' + item + ',' : field.linkFieldName != null ? field.linkFieldName+',' : item+ ',';
        }
    }
    result = result.slice(0, -1);
    return result;
};

// Return list of field as
// 'fieldName1, fieldName
// :fieldName1, fieldNamen (if asParam == true)
SqlCommandManager.prototype.getUpdateFields = function (tableName,doc) {
    var result = '';
    var linkFieldName = '';
    for (item in doc.o.$set) {

        if(doc.o.$set[item].constructor == {}.constructor) {
            for (item2 in doc.o.$set[item]) {
                linkFieldName =  self.getLinkFieldName(tableName, item + '.' + item2);
               result += asParam ? ':' + item + '_' + item2 + ',' : + linkFieldName+ ',';
            }
        }
        else {
            linkFieldName =  self.getLinkFieldName(tableName, item + '.' + item2);
            result += util.format(" %s = :%s,",linkFieldName, item);
        }

    }
    result = result.slice(0, -1);

    return result;
};


SequelizeCommandManager = function(connection, dbUtil) {
    SqlCommandManager.call(this, connection, dbUtil);

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
    SequelizeCommandManager.call(this, connection, dbUtil);
//    this.tableName = '';
}

OpSequelizeCommandManager.prototype = Object.create(SqlCommandManager.prototype);



OpSequelizeCommandManager.prototype.execSql = function(sql, tableName, doc, action) {
    try {

        var self = this;
        var future = new Future();
        var record =  action == 'u' ? _.extend({}, doc.o.$set)  : _.extend({}, doc.o);
        if( action == 'u')
            record['_id'] = doc.o2['_id'].toString();
        else if(action == 'd')
            record['_id'] = doc.o['_id'].toString();

        this.dbUtil.normalizeValues(tableName, record).wait();

        future.return(this.command.execSql(sql, record, action).wait());
        return future.wait();
    }
    catch(e) {
        console.log(e)
    }
}.future();

OpSequelizeCommandManager.prototype.prepareInsert = function(tableName, doc) {
   return this.prepareSql(tableName,doc, 'i');
    //this.sql = this.dbUtil.renameLinkFields(tableName, this.sql);
}

OpSequelizeCommandManager.prototype.prepareUpdate = function(tableName, doc) {
    return this.prepareSql(tableName,doc, 'u');
    //return  this.dbUtil.renameLinkFields(tableName, sql);
}

OpSequelizeCommandManager.prototype.prepareDelete = function(tableName, doc) {
    return this.prepareSql(tableName,doc, 'd');
    //return  this.dbUtil.renameLinkFields(tableName, sql);
}

//sql = this.options.dbUtil.renameLinkFields(this.getCollectionName(doc), sql);


