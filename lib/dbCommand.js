
DbCommand = function(DbConnection) {
  this.conn = DbConnection;
}

DbCommand.prototype.execute = function(callback) {
}

SqlCommand.prototype = Object.create(DbCommand.prototype);

SqlCommand = function(DbConnection) {
    DbConnection.call(DbConnection);
}
/*

SqlCommand.prototype.makeInsert = function(callback) {

};

SequelizeCommand.prototype = Object.create(DbCommand.prototype);

SqlCommand.prototype.execute = function(
  TDbCommandExecute,
  TDoc,
  TParameters,
  CDbCommandExecuteCallback)
)
{

    this.conn.query(TSql.sql,
        { replacements:  tblLink.getValues(doc), type: sequelize.QueryTypes.INSERT }
    ).then(function(rec) {
            console.log(rec)
        }).catch(function(error) {
            console.log(error);
        })

    //  sequelize.query(sql)
    console.log("LinkSql.Insert");
    callback(false);
}

}

SqlCommand.prototype.Insert = function(TSql, callback) {
    this.conn.query(TSql.sql,
        { replacements:  tblLink.getValues(doc), type: sequelize.QueryTypes.INSERT }
    ).then(function(rec) {
            console.log(rec)
        }).catch(function(error) {
            console.log(error);
        })

    //  sequelize.query(sql)
    console.log("LinkSql.Insert");
    callback(false);
}
{
    tblLink = new tablesLink(doc.ns.split('.')[1]);
    //replace.getValues(doc);

    var sql = this.MakeInsert(doc, tblLink);
    var sequelize = Application.locals.DBCONNECTION.getConnection(Application.locals.AppConfigJson.Databases.link);
    sequelize.query(sql,
        { replacements:  tblLink.getValues(doc), type: sequelize.QueryTypes.INSERT }
    ).then(function(rec) {
            console.log(rec)
        }).catch(function(error) {
            console.log(error);
        })

    //  sequelize.query(sql)
    console.log("LinkSql.Insert");
    callback(false);
}
*/