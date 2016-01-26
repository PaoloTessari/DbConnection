//"use strict";

var DateFormat = Npm.require("date-format-lite");
var Future = Npm.require('fibers/future');
var mongo = Npm.require('mongodb');


/* settings: Meteor.settings.Def.Collections) */
DbTables = function(settings, localConnection) {
    var self = this;
    this.settings = settings  || {};
    this.localConnection = localConnection;
    this.defColl = null;
};

DbTables.prototype.init = function() {
    this.loadDefColl();
};

DbTables.prototype.getTable = function(tableName) {
    return this.settings && this.settings[tableName] ? this.settings[tableName] : null ;
};

DbTables.prototype.getFields = function(tableName) {
    return this.getTable(tableName).fields ;
};

DbTables.prototype.getField = function(tableName, fieldName1, fieldName2) {

    var field =  _.find(this.getTable(tableName).fields, function(field) {
        return (field.fieldName == fieldName1 && fieldName2 == undefined ) ||
               (field.fieldName == fieldName1+'.'+fieldName2);
    });
     return field;
};

DbTables.prototype.getDefId = function(tableName,id, callback) {
    if(this.getField(tableName, '$DEF') == null) {
        callback(null);
    }
    else
    {
        var self = this;
        self.localConnection.dbInstance.collection(tableName).find({_id: id}, { defid: 1 }).toArray(function (err, docs) {

            callback(docs.length == 1 ? docs[0]['defid'] : null);
        });
    }
};

DbTables.prototype.getAttrField = function(tableName,defid,fieldName, callback) {

    var self = this;

    //self.localConnection.dbInstance.collection('def').find({_id: defid}).toArray(function(err, docs) {
       doc = self.getDefDoc(defid);

        //var doc = docs.length == 1 ?  docs[0] : null;
        if(doc) {
            //console.log(rec);
            var fld = _.find(doc.params.fields, function (field) {
                return (field.aliasName.toUpperCase() == fieldName.toUpperCase())
            });

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

    //});

};


DbTables.prototype.normalizeRecord = function(tableName, record, attrFields) {
    var self = this;
    try {
        for (var fieldName in record) {

            if(record[fieldName] && record[fieldName].constructor == {}.constructor) {
                for (var item2 in record[fieldName]) {
                    var field = self.getField(tableName,fieldName+'.'+item2);
                    if(field != null)
                        record[fieldName+'_'+item2] = self.normalizeFieldValue(field, record[fieldName][item2]);
                }
                delete record[fieldName];
            }
            else {
                field = self.getField(tableName,fieldName);
                if(field != null)
                    record[fieldName] = self.normalizeFieldValue(field, record[fieldName]);
                else {
                    var field =  _.find(attrFields, function(field) {
                        return (field.fieldName.toUpperCase() == fieldName.toUpperCase() || null);
                    });

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

};



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

DbTables.prototype.loadDefColl = function() {
     var self = this;

     try {
         self.localConnection.dbInstance.collection("def").find({}).toArray(function (err, docs) {
             console.log(err);
             console.log(docs);
             self.defColl = _.extend([], docs);

         });
     }
    catch(e) {
        console.log(e);

    }

 };

DbTables.prototype.getDefDoc = function(_id) {
    var self = this;

    var doc =  _.find(self.defColl, function(doc) {
        return (doc['_id'] === _id);
    });
    return doc;
};

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
*/