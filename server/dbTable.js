var DateFormat = Npm.require("date-format-lite");
var Future = Npm.require('fibers/future');


/* settings: Meteor.settings.Def.Collections) */
DbTables = function(settings, localConnection) {
    var self = this;
    this.settings = settings  || {};
    this.localConnection = localConnection;

    //this.query = null;
   // this.handle = null;

    this.localDef = _.extend([], this.loadLocalDef());

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

DbTables.prototype.tableField = function(tableName,doc fieldName) {
    var field = null;

    var doc = self.localConnection.dbInstance.collection(tableName).findOne({_id: _id},);
    if(doc) {

        var rec;
        console.log("Found the following record ");
        console.dir(doc);

        rec = _.find(this.localDef, function (rec) {
            return (rec._id == doc['defid'] || null);

       })
       if(rec != null) {
           field = _.find(rec.fields, function (field) {
               return (field.aliasName == fieldname || null)
           })

           if (field == null || field.fiedlName.slice(0, 4) != 'ATTR');
           field = null;
       }


    }
    return field;
};


DbTables.prototype.normalizeRecord = function(tableName, record) {
    var self = this;
    try {
        for (var fieldName in record) {

            if(record[fieldName].constructor == {}.constructor) {
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
                else
                    delete record[fieldName];
            }
        }
        //console.log('normalizeValues');
        //console.log(record);
        return  record;
    }
    catch(e) {
        console.log(e)
        throw(e);
        //return record;
    }

};

DbTables.prototype.normalizeFieldValue = function (field, value) {
    var self = this;

    var result = null;

    if(field == null)
      return value || null;

    try {
        if (field.fieldType == 'ISODATE') {
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
        else if (field.fieldType == 'OBJECT') {
            result  = value ? value.toString() : null;
        }
        else if (field.fieldType == 'ARRAY') {
            if (value) {
                for (var obj in value)
                    result += obj + ' ';
            }
        }
        else {
            result  = value ||  field.default || null;
        }
        return result;
    }
    catch (error) {
        console.log(error);
        throw(e);
    }
};


DbTables.prototype.loadLocalDef = function() {
    try {
          self = this;

          var future = new Future();
          self.localConnection.dbInstance.collection("def").find({}).toArray(function(err, docs) {

           console.log("Found the following records");
           //console.dir(docs);
           //self.localDef = _.extend([], docs);
           future.return(docs);
           return future.wait();
            //callback(docs);
        });
    }
    catch (error) {
        console.log(error);
        future.return(null);
    }

}.future();
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