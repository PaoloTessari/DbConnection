

DbTables = function(settings) {
    var self = this;
    this.settings = settings  || {};


};

DbTables.prototype.table = function(tableName) {
    return this.settings && this.settings[tableName] ? this.settings[tableName] : null ;
};

DbTables.prototype.fields = function(tableName) {
    return this.table(tableName).fields ;
};

DbTables.prototype.field = function(tableName, fieldName1, fieldName2) {
    return  _.find(this.table(tableName).fields, function(field) {
        return (field.fieldName == fieldName1 && fieldName2 == undefined ) ||
               (field.fieldName == fieldName1+'.'+fieldName2);
    })
};



DbTables.prototype.normalizeRecord = function(tableName, record) {
    var self = this;
    try {
        for (fieldName in record) {

            if(record[fieldName].constructor == {}.constructor) {
                for (item2 in record[fieldName]) {
                    field = self.field(tableName,fieldName+'.'+item2);
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
        console.log('normalizeValues');
        console.log(record);
        return  record;
    }
    catch(e) {
        console.log(e)
        throw(e);
        //return record;
    }

}

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
                for (obj in value)
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