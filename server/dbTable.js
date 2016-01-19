//"use strict";

var DateFormat = Npm.require("date-format-lite");
var Future = Npm.require('fibers/future');
var mongo = Npm.require('mongodb')



/* settings: Meteor.settings.Def.Collections) */
DbTables = function(settings, localConnection) {
    var self = this;
    this.settings = settings  || {};
    this.localConnection = localConnection;

    //this.query = null;
   // this.handle = null;

    //this.localDef = _.extend([], this.loadLocalDef().wait());
    //this.defCursor = this.openDefCursor().wait();

    //console.log("** localDef**");
    //console.dir(this.localDef);


    //this.observeLocalDef();


}

DbTables.prototype.table = function(tableName) {
    return this.settings && this.settings[tableName] ? this.settings[tableName] : null ;
};

DbTables.prototype.fields = function(tableName) {
    return this.table(tableName).fields ;
};

DbTables.prototype.field = function(tableName, fieldName1, fieldName2) {

    var field =  _.find(this.table(tableName).fields, function(field) {
        return (field.fieldName == fieldName1 && fieldName2 == undefined ) ||
               (field.fieldName == fieldName1+'.'+fieldName2);
    })
     return field;
};

/*
DbTables.prototype.getDefId = function(tableName,id) {

    // todo try catch
    var self = this;
    var future = new Future();
    self.localConnection.dbInstance.collection(tableName).find({_id: id}).toArray(function(err, docs) {

        future.return(docs.length == 1 ? docs[0]['defid'] : null);


    });
    return future.wait();
}.future();
*/
DbTables.prototype.getDefId = function(tableName,id, callback) {
    if(this. field(tableName, '$DEF') == null) {
        callback(null);
    }
    else
    {
        var self = this;
        self.localConnection.dbInstance.collection(tableName).find({_id: id}, { defid: 1 }).toArray(function (err, docs) {

            callback(docs.length == 1 ? docs[0]['defid'] : null);
        });
    }
}

DbTables.prototype.tableField = function(tableName,defid,fieldName, callback) {

    var self = this;



    self.localConnection.dbInstance.collection('def').find({_id: defid}).toArray(function(err, docs) {

        var doc = docs.length == 1 ?  docs[0] : null;
        if(doc) {
            //console.log(rec);
            var fld = _.find(doc.params.fields, function (field) {
                return (field.aliasName.toUpperCase() == fieldName.toUpperCase())
            })

            if (fld != null && fld.fieldName.slice(0, 4).toUpperCase() == 'ATTR') {
                var field = {};
                field.fieldName = fld.aliasName;
                field.linkFieldName = fld.fieldName;
                field.fieldType =
                     fld.fieldName.slice(0, 5).toUpperCase() == 'ATTRN' ? 'NUMBER' :
                     fld.fieldName.slice(0, 5).toUpperCase() == 'ATTRC' ? 'STRING' :
                     fld.fieldName.slice(0, 5).toUpperCase() == 'ATTRD' ? 'ISODATE' :
                     'STRING';
                //console.log(fld);
                callback(field);
            }
            else
               callback(null);
        }
        else
            callback(null);

    });


}


DbTables.prototype.normalizeRecord = function(tableName, record, attrFields) {
    var self = this;
    try {
        for (var fieldName in record) {

            if(record[fieldName] && record[fieldName].constructor == {}.constructor) {
                for (var item2 in record[fieldName]) {
                    var field = self.field(tableName,fieldName+'.'+item2);
                    if(field != null)
                        record[fieldName+'_'+item2] = self.normalizeFieldValue(field, record[fieldName][item2]);
                }
                delete record[fieldName];
            }
            else {
                field = self.field(tableName,fieldName);
                if(field != null)
                    record[fieldName] = self.normalizeFieldValue(field, record[fieldName]);
                else {
                    var field =  _.find(attrFields, function(field) {
                        return (field.fieldName.toUpperCase() == fieldName.toUpperCase() || null);
                    })

                    if(field != null) {
                        record[fieldName] = self.normalizeFieldValue(field, record[fieldName]);
                    }
                    else
                      delete record[fieldName];
                }
            }
        }
    }
    catch(e) {
        console.log(e)

    }
    finally {
        return record;
    }

}


/*
DbTables.prototype.normalizeRecord = function(tableName, record, attrFields) {
    var self = this;
    var future = new Future();
    try {
        for (var fieldName in record) {

            if(record[fieldName] && record[fieldName].constructor == {}.constructor) {
                for (var item2 in record[fieldName]) {
                    var field = self.field(tableName,fieldName+'.'+item2);
                    if(field != null)
                        record[fieldName+'_'+item2] = self.normalizeFieldValue(field, record[fieldName][item2]);
                }
                delete record[fieldName];
            }
            else {
                field = self.field(tableName,fieldName);
                if(field != null)
                    record[fieldName] = self.normalizeFieldValue(field, record[fieldName]);
                else {
                    var field =  _.find(attrFields, function(field) {
                        return (field.fieldName.toUpperCase() == fieldName.toUpperCase() || null);
                    })

                    if(field != null) {
                        record[fieldName] = self.normalizeFieldValue(field, record[fieldName]);
                    }
                    else
                        delete record[fieldName];
                }
            }
        }
        //console.log('normalizeValues');
        //console.log(record);
        future.return(record);
    }
    catch(e) {
        console.log(e)
        //throw(e);
        //return record;
        future.return(record);

    }
    finally {
        return future.wait();
    }

}.future();
*/


DbTables.prototype.normalizeFieldValue = function (field, value) {
    var self = this;

    var result = null;

    if(field == null)
      return value || null;

    try {
        if (field.fieldType &&  field.fieldType.toUpperCase() == 'ISODATE') {
            if(value) {
                try {
                    var date = new Date(value);
                    result = date.format('DD-MMM-YYYY hh:mm:ss:SS');
                }
                catch(e) {
                   result = null;
                }
            }
        }
        else if (field.fieldType &&  field.fieldType.toUpperCase() == 'OBJECT') {
            result  = value ? value.toString() : null;
        }
        else if (field.fieldType &&  field.fieldType.toUpperCase() == 'ARRAY') {
            if (value) {
                for (var obj in value)
                    result += obj + ' ';
            }
        }
        else if (field.fieldType &&  field.fieldType.toUpperCase() == 'NUMBER') {
            result = _.isNaN(Number(value)) ? 0 : Number(value);
            //console.log(result);
        }
        else {
            result  = value || null;
        }
        return result;
    }
    catch (error) {
        console.log(error);
        throw(e);
    }
};

/*
DbTables.prototype.loadLocalDef = function() {
    try {
          var self = this;

          var future = new Future();
          self.localConnection.dbInstance.collection("def").find({}).toArray(function(err, docs) {

           //self.localDef = _.extend([], docs);
           future.return(docs);
           return future.wait();
            //callback(docs);
        });
    }
    catch (error) {
        console.log(error);
        future.return(null);
        return future.wait();
    }

}.future();
*/

/*
DbTables.prototype.openDefCursor = function() {
    try {
        self = this;

        var future = new Future();
        future.return(self.localConnection.dbInstance.collection("def").find({}));
         return future.wait();
            //callback(docs);
    }
    catch (error) {
        console.log(error);
        future.return(null);
        return future.wait();
    }

}.future();
*/
/*
DbTables.prototype.observeLocalDef = function() {
self = this;
    Meteor.subscribe('def', function() {
        self.query =  self.localConnection.dbInstance.collection("def").find({});

        self.query.observe({
            addedAt: function(doc, atIndex) {
                if(atIndex > (msgCount - 1)) console.log('added');
            }
        });
    });

};
/*

DbRow = function(dbTable) {
    this.dbTable = dbTable;
}

DbRow.prototype.normalize = function(row) {
    var self = this;
    try {
        for (fieldName in row) {

            if(row[fieldName].constructor == {}.constructor) {
                for (item2 in row[fieldName]) {
                    field = self.dbTable.getFieldProp(fieldName+'.'+item2);
                    if(field != null)
                        row[fieldName+'_'+item2] = self.normalizeFieldValue(field, record[fieldName][item2]);

                }
                delete row[fieldName];
            }
            else {
                field = self.dbTable.getFieldProp(fieldName);
                if(field != null)
                    row[fieldName] = self.normalizeFieldValue(field, row[fieldName]);
                else
                    delete row[fieldName];
            }
        }
        console.log('normalize');
        console.log(row);
        return true;
    }
    catch(e) {
        console.log(e);
        return false;
    }
}


DbRow.prototype.normalizeFieldValue = function (field, value) {
    var self = this;

    var result = null;

    try {
        if(field != null) {
            if (field.fieldType == 'ISODATE') {
                if(value != undefined) {
                    var date = new Date(value);
                    result = date.format('DD-MMM-YYYY hh:mm:ss:SS');
                }
                else
                    result = null;

            }
            else if (field.fieldType == 'OBJECT') {
                result  = value ? value.toString() : null;
            }
            else if (field.fieldType == 'ARRAY') {
                if (value) {
                    var result = '';
                    for (obj in value)
                        result += obj + ' ';
                    result  =result;
                }

            }
            else {

                result  = value ? value: null;


            }
        }
        else {
            result  = value ? value : null;
        }
    }
    catch (error) {
        console.log(error);
        result  = null;
    }
    finally {
        return result;

    }
}
*/