var util = Npm.require("util");
var Future = Npm.require('fibers/future');
var Fiber = Npm.require('fibers');
var async = Npm.require('async');
var util = Npm.require('util');
var EventEmitter = Npm.require('events').EventEmitter;


DbCommandManager = function(connection) {
    this.connection = connection;
    this.command = null;
};


DbCommandManager.prototype.setCommand = function(command) {
  this.command = command;
};

SqlCommandManager = function(connection, dbTables) {
    DbCommandManager.call(this, connection);
    this.dbTables = dbTables;
    this.attrFields = [];
//    this.sql = '';

};

SqlCommandManager.prototype = Object.create(DbCommandManager.prototype);


SqlCommandManager.prototype.prepareSql = function(tableName, doc, action) {
    var future = new Future();
    var sql = '';
    if(action == 'i') {
        var fields =  this.getInsertFields(tableName,doc, false).wait();

        if(fields == '')
            future.return( '');


        var params = this.getInsertFields(tableName,doc, true).wait();
        //console.log('params:'+params)

        future.return(util.format('INSERT INTO %s (%s) VALUES (%s)', tableName, fields,params));
    }
    else  if(action == 'u') {

        // no fields to write in sql table
        var fields = this.getUpdateFields(tableName,doc).wait();
        //console.log(fields);
        // no fields to write in sql table
        if(fields == '')
            future.return( '');
         else
           future.return( util.format("UPDATE %s set %s %s", tableName, fields, this.getFilter(tableName)));
    }
    else  if(action == 'd') {
        future.return( util.format("DELETE FROM  %s %s ", tableName, this.getFilter(tableName)));
    }
    return future.wait();
}.future();

/*
SqlCommandManager.prototype.prepareSql = function(tableName, doc, action) {
    var future = new Future();
    var sql = ''
    if(action == 'i') {
        var fields =  this.getInsertFields(tableName,doc, false).wait();

        //console.log('fields:'+fields)
        // no fields to write in sql table
        if(fields == '')
            future.return( '');


        var params = this.getInsertFields(tableName,doc, true).wait();
        //console.log('params:'+params)

        future.return(util.format('INSERT INTO %s (%s) VALUES (%s)', tableName, fields,params));
    }
    else  if(action == 'u') {

        // no fields to write in sql table
        var fields = this.getUpdateFields(tableName,doc).wait();
        //console.log(fields);
        // no fields to write in sql table
        if(fields == '')
            future.return( '');
        else
            future.return( util.format("UPDATE %s set %s %s", tableName, fields, this.getFilter(tableName)));
    }
    else  if(action == 'd') {
        future.return( util.format("DELETE FROM  %s %s ", tableName, this.getFilter(tableName)));
    }
    return future.wait();
}.future();
*/

SqlCommandManager.prototype.getFilter = function(tableName) {
    return (' WHERE mid = :_id');
};

// Return list of field as
// 'fieldName1, fieldName
// :fieldName1, fieldNamen (if asParam == true)
SqlCommandManager.prototype.getInsertFields = function (tableName,doc, asParam) {
    var self = this;

    var future = new Future();

    var result = '';
    var field = null;

    async.forEachOf(doc.o, function (itemValue, item, callback) {
        if (doc.o[item] && doc.o[item].constructor == {}.constructor && self.isPhysicalFieldName(item)) {
            async.forEachOf(doc.o[item], function (item2Value, item2, callback) {
                field = self.dbTables.getField(tableName, item, item2);
                // for nested value  linkFieldName is mandatory
                if (field && field.linkFieldName && self.isPhysicalFieldName(field.linkFieldName))
                    result += asParam ? ':' + item + '_' + item2 + ',' : field.linkFieldName + ',';
                callback();
             },
             function (err) {
                //console.log('done bb' + item)
            });
            callback();
        }

        else {
            field = self.dbTables.getField(tableName, item);
            if (field)
                result += asParam ? ':' + item + ',' : (field.linkFieldName || item) + ',';
            else {
                field = self.dbTables.getField(tableName, '$DEF');
                if (field != null) {
                    self.dbTables.getAttrField(tableName, doc.o['defid'], item, function(field) {
                        if (field && self.isPhysicalFieldName(field.linkFieldName)) {
                            result += asParam ? ':' + item + ',' : (field.linkFieldName || item) + ',';
                            self.attrFields.push(_.extend({}, field));
                        }
                    });
                }
            }
            callback();
        }

    },
    function (err) {
        //console.log('done bb' + item)
        result = result.slice(0, -1);
        future.return(result);
    });



    return future.wait();
}.future();

// Return list of field as
// 'fieldName1, fieldName
// :fieldName1, fieldNamen (if asParam == true)
SqlCommandManager.prototype.getUpdateFields = function (tableName,doc) {
    //var field = '';
    var self = this;

    //var set = _.extend({}, doc.o.$set || doc.o);

    var future = new Future();
    var result = '';
    var field;
    var set = _.extend({}, doc.o.$set || doc.o);
    var defid = null;

    self.dbTables.getDefId(tableName, doc.o2['_id'], function(id) {
       defid = id;

       async.forEachOf(set, function (itemValue, item, callback) {
           //var item = item;
           if (set[item] && set[item].constructor == {}.constructor && self.isPhysicalFieldName(item)) {

               async.forEachOf(set[item], function (item2Value, item2, callback) {

                   field = self.dbTables.getField(tableName, item, item2);
                   // for nested value  linkFieldName is mandatory
                   if (field && field.linkFieldName && self.isPhysicalFieldName(field.linkFieldName))
                       result += util.format(" %s = :%s,", field.linkFieldName, item + '_' + item2);
                   callback();
               }, function (err) {
                   //console.log('done bb' + item)
               });
               callback();

           }
           else {
               field = self.dbTables.getField(tableName, item);
               if (field && self.isPhysicalFieldName(field.linkFieldName || item)) {
                   result += util.format(" %s = :%s,", field.linkFieldName || item, item);
                   callback();
               }
               else if (defid) {
                   self.dbTables.getAttrField(tableName, defid, item, function (field) {
                       if (field && self.isPhysicalFieldName(field.linkFieldName)) {
                           result += util.format(" %s = :%s,", field.linkFieldName || item, item);
                           self.attrFields.push(_.extend({}, field));
                       }
                       callback();

                   })
               }
               else
                  callback();

           }
       }, function (err) {
           //console.log('done aa' + result);
           if (result != '')
               result = result.slice(0, -1);
           future.return(result);
       });
   });

    return future.wait();
}.future();


SqlCommandManager.prototype.isPhysicalFieldName = function(fieldName) {
    return true;

};

SequelizeCommandManager = function(connection, dbTables) {
    SqlCommandManager.call(this, connection, dbTables);

    this.ee = new EventEmitter();

    this.setCommand(new SequelizeCommand(connection));
};


SequelizeCommandManager.prototype = Object.create(SqlCommandManager.prototype);


SequelizeCommandManager.prototype.execSql = function(sql, doc, action) {
    try {
      var self = this;
      var future = new Future();

      self.ee.emit('beforeExecSql', sql,doc,action);
      future.return(this.command.execSql(sql, doc, action).wait());
      return future.wait();
    }
      catch(e) {
          console.log(e);
          future.return(false);
          return future.wait();
      }
}.future();


SequelizeCommandManager.prototype.isPhysicalFieldName = function(fieldName) {
    return fieldName.toUpperCase().slice(0, 7) != 'DECODE_' &&
        fieldName.toUpperCase().slice(0, 5) != 'CALC_'

};



OpSequelizeCommandManager = function(connection, dbTables) {
    SequelizeCommandManager.call(this, connection, dbTables);
//    this.tableName = '';
};


OpSequelizeCommandManager.prototype = Object.create(SequelizeCommandManager.prototype);


OpSequelizeCommandManager.prototype.execSql = function(sql, tableName, doc, action) {
    var self = this;
    try {
        var record = self.prepareRecord(tableName,doc,action).wait();

        var future = new Future();
        /*
        var record =  action == 'u' ? _.extend({}, doc.o.$set || doc.o)  : _.extend({}, doc.o);
        if( action == 'u')
            record['_id'] = doc.o2['_id'].toString();
        else if(action == 'd')
            record['_id'] = doc.o['_id'].toString();

        if(action != 'd') {
            record = this.dbTables.normalizeRecord(tableName, record, self.attrFields);
        }
        */

        self.ee.emit('beforeExecSql', tableName, sql,record,action);

        future.return(this.command.execSql(sql, record, action).wait());
        console.log(sql);
        return future.wait();
    }
    catch(e) {
        console.log(e);
        future.return(false);
        return future.wait();

    }
}.future();


OpSequelizeCommandManager.prototype.prepareRecord = function(tableName, doc, action) {
    var self = this;

    var future = new Future();
    var record =  action == 'u' ? _.extend({}, doc.o.$set || doc.o)  : _.extend({}, doc.o);
    if( action == 'u')
        record['_id'] = doc.o2['_id'].toString();
    else if(action == 'd')
        record['_id'] = doc.o['_id'].toString();

    if(action != 'd') {
        record = this.dbTables.normalizeRecord(tableName, record, self.attrFields);
    }
    future.return(record);
    return future.wait();
}.future();



