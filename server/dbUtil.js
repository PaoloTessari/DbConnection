
DbUtil = function(Def) {
 this.def = _.extend({}, Def);
 this.fields = null;
};

/*
DbDef.prototype.init = function(tableName) {
    this.fields = this.getFields(tableName);
    this.getLinkField( this.def['Collections'][tableName], '_id');

};
*/

/*
DbDef.prototype.getFields = function(tableName) {
    console.log('getFields');
    return _.extend([], this.def['Collections'][tableName]['fields'], this.def['Collections']['extend']['fields']);
};
*/

DbUtil.prototype.getLinkField = function(tableName, fieldName) {
    var obj = null;
    try {
        //var key = _.findKey(this.def.Collections[tableName].fields, fieldName );
        obj = _.find(this.def.Collections[tableName].fields, function(obj) {
            return obj.fieldName == fieldName })

        if(obj != undefined)
          console.log('getLinkField '+obj.linkFieldName)
    }
    catch (e) {
        console.log(e)

    }
    finally {
      //return  obj != undefined && obj.linkFieldName != undefined ? obj.linkFieldName : fieldName;
      return  obj == undefined ? null : obj;
    }
};

// Return an array of all instance {item[.itemn]} in str without {}
// Example str = 'update DOC set {_id} = :id, {updated.userName} where ...'
// Returns [{_id}, {updated.userName}]
DbUtil.prototype.getLinkFields = function(str) {
    var arr = str.match(/({\w+(.)\w+\})/g);
    // remove {}

    if(arr != null)
      arr  = arr.toString().replace(/\{/g, '').replace(/\}/g, '').split(',')
    console.log(arr);
    return arr;
};

DbUtil.prototype.renameLinkFields = function(tableName, sql) {
  var self = this;
  var fieldName = '';
  var linkField = null;
  var fields = _.extend([], this.getLinkFields(sql));
  fields.forEach(function(element, index,array) {

      linkField = self.getLinkField(tableName, element);
      linkFieldName = linkField == null ? element : linkField.linkFieldName;
      sql = sql.replace('{'+element+'}', linkFieldName);

  })

  return sql;
};


DbUtil.prototype.normalizeValues = function(tableName, doc) {
    var self = this;
    for(fieldName in doc)
        doc[fieldName] = self.getFieldValue(tableName, fieldName,doc)
};

DbUtil.prototype.getFieldValue = function (tableName,fieldName, doc) {
    var self = this;
    var field = this.getLinkField(tableName, fieldName);

    try {
        if(field != null) {
            if (field.fieldType == 'ISODATE') {
                return doc[fieldName] ? new Date(doc[fieldName]).format('DD-MMM-YYYY hh:mm:ss:SS') : null;
            }
            else if (field.fieldType == 'OBJECT') {
                return doc[fieldName] ? doc[fieldName].toString() : null;
            }
            else if (field.fieldType == 'ARRAY') {
                if (doc[fieldName]) {
                    var result = '';
                    for (obj in doc[fieldName])
                        result += obj + ' ';
                    return result;
                }
                else
                    return null;
            }
            else {
                return doc[fieldName] ? doc[fieldName] : null;
            }
        }
        else {
            return doc[fieldName] ? doc[fieldName] : null;
        }
    }
    catch (error) {
        console.log(error);
        return null;
    }

/*
    var self = this;
    var fields = this.fields;
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
*/
};



