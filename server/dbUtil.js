var Future = Npm.require('fibers/future');

var DateFormat = Npm.require("date-format-lite");

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
    var future = new Future();
    var obj = null;
    try {
        obj = _.find(this.def.Collections[tableName].fields, function(obj) {
            return obj.fieldName == fieldName })
/*
        if(obj != undefined)
          console.log('getLinkField '+obj.fieldName+' '+obj.linkFieldName);
          */
    }
    catch (e) {
        console.log(e)

    }
    finally {

      //return  obj != undefined && obj.linkFieldName != undefined ? obj.linkFieldName : fieldName;
      future.return( obj == undefined ? null : obj);
      return future.wait();
    }
}.future();

DbUtil.prototype.getLinkFieldName = function(tableName, fieldName) {
    var field = this.getLinkField(tableName, fieldName).wait();
    var result = field == null || field.linkFieldName == undefined || field.linkFieldName == null ? fieldName : field.linkFieldName;
    if(result.toUpperCase().slice(0,7) == 'DECODE_')
      result = '';
    return result;
}

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

      linkField = self.getLinkField(tableName, element).wait();
      linkFieldName = (linkField == null || linkField.linkFieldName == undefined || linkField.linkFieldName == null) ? element : linkField.linkFieldName;
      sql = sql.replace('{'+element+'}', linkFieldName);

  })

  return sql;
};


DbUtil.prototype.normalizeValues = function(tableName, record) {
    var self = this;
    var future = new Future();
    try {
        for (fieldName in record) {

            if(record[fieldName].constructor == {}.constructor) {
                for (item2 in record[fieldName]) {
                    field = self.getLinkField(tableName,fieldName+'.'+item2).wait();
                    if(field != null)
                        record[fieldName+'_'+item2] = self.getFieldValue(field, record[fieldName][item2]).wait();

                }
                delete record[fieldName];
            }
            else {
                field = self.getLinkField(tableName,fieldName).wait();
                if(field != null)
                  record[fieldName] = self.getFieldValue(field, record[fieldName]).wait();
                else
                    delete record[fieldName];
            }
        }
        future.return(true);
        console.log('normalizeValues');
        console.log(record);
    }
    catch(e) {
        console.log(e);
        future.return(false);
    }
    return future.wait();

}.future();

DbUtil.prototype.getFieldValue = function (field, value) {
    var self = this;

    var future = new Future();

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
        future.return(result);
        return future.wait();

    }


}.future();




