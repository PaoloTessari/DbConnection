
DocsDef = function(docsDef) {
 this.docDefs = _.extend({}, docsDef);
}


DocsDef.prototype.getFieldAttr = function(tableName, fieldName) {
    var self = this;
    try {
        return self.docDefs['Collections'][tableName]['fields'][fieldName];
    }
    catch(e) {
        return null;

    }
}

/*
DbDef.prototype.getValues = function (doc) {
    if(doc.op=='i') {
        var record = extend({}, doc.o);

        this.fieldsRemap(this.tableName, record);
        this.normalizeValues(this.tableName, record);

        return record;
    }
    else if (doc.op =='u') {
        var record = extend({}, doc.o.$set);
        record['_id'] = doc.o2['_id'].toString();
        return record;
    }
    else if (doc.op =='d') {
        var record = extend({}, doc.o);
        record['_id'] = doc.o['_id'].toString();
        return record;
    }
 }

DbDef.prototype.getFields = function (tableName, doc, asParam) {
  var self = this;
  var result = '';
  var itemName;
  for (item in doc.o) {
    if(result!='')
    result+=',';
    result+= asParam ? ':' : '';

    var fieldsMap = $.extend(self.fMaps[tableName],self.fMaps[ALL]);
    itemName = (fieldsMap && fieldsMap[item]) ? fieldsMap[item] : item;
    result+= itemName;
  }
  return result;
}

DbDef.prototype.normalizeValues = function(tableName, record) {
    self = this;
    for(item in record)
    {
        record[item] = self.getFieldValue(tableName, record, item)
    }
 }

DbDef.prototype.this.getFieldValue = function (tableName,record,  item) {
    self = this;
    var fieldsType = $.extend(self.fTypes[tableName], self.fTypes[ALL]);
    if (fieldsType[item] == 'ISODATE') {
        try {
            return record[item] ? new Date(record[item]).format('DD-MMM-YYYY hh:mm:ss:SS') : null;
        }
        catch (error) {
            return null;
        }
    }
    else if (fieldsType[item] == 'OBJECT')
       return record[item] ? record[item].toString() : null;
    else if (fieldsType[item] == 'ARRAY' ) {
        if(record[item]) {
            var result = '';
            for (obj in record[item])
                result += obj+' ';
            return result;
        }
        else
            return null;
    }
    else
        return record[item] ? record[item] : null;

}

DbDef.prototype.fieldsRemap = function (tableName, record) {
    var remapField;
    var self = this;
    var fieldsType = $.extend(self.fTypes[tableName], self.fTypes[ALL]);
    for (item in record) {
        remapField = fieldsType[item];
        if (remapField) {
            var value = record[item];
            delete record[item];
            record[remapField] = value;
        }
    }
}
*/

