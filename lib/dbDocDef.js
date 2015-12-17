
DbDef = function(Def) {
 this.def = _.extend({}, Def);
}

/*
DbDef.prototype.getField = function(tableName, fieldName) {
    var self = this;
    try {
        return self.getCollection(tableName)[fieldName];
    }
    catch(e) {
        return null;

    }
}
*/

DbDef.prototype.getCollection = function(tableName) {
    //return self.def['Collections'][tableName]['fields'];
    //return _.extend([], this.def['Collections'][tableName], this.def['Collections']['extend']);

    var fields = _.extend({}, this.def['Collections'][tableName]);
    _.each(this.def['Collections']['extend'], function(element, index, list) {
        fields.push(element);
    });
    return fields;
}



DbDef.prototype.normalizeValues = function(tableName, record) {
    var self = this;
    for(fieldName in record)
    {
        record[item] = self.getFieldValue(tableName, fieldName,record)
    }
}

DbDef.prototype.getFieldValue = function (tableName,fieldName, record) {
    var self = this;
    var fields = self.getCollection(tableName);
    try {
      var field = fields[fieldName];
      if (field.fieldType == 'ISODATE') {
          return record[fieldName] ? new Date(record[fieldName]).format('DD-MMM-YYYY hh:mm:ss:SS') : null;
      }
      else if (field.fieldType == 'OBJECT') {
          return record[fieldName] ? record[fieldName].toString() : null;
      }
      else if (field.fieldType == 'ARRAY' ) {
              if(record[fieldName]) {
                  var result = '';
                  for (obj in record[fieldName])
                      result += obj+' ';
                  return result;
              }
              else
                  return null;
      }
      else {
          return record[fieldName] ? record[fieldName] : null;
      }


      }
    catch (error) {
            return null;
        }

}

DbDef.prototype.remapFields = function (tableName, record) {
    var remapField;
    var self = this;
    var fields = self.getCollection(tableName);
    for (fieldName in record) {
        remapField = fields[fieldName].fieldType;
        if (remapField) {
            var value = record[fieldName];
            delete record[fieldName];
            record[remapField] = value;
        }
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

*/

