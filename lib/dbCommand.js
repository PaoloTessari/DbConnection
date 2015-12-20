
DbCommand = function(DbConnection) {
  this.conn = DbConnection;
}

DbCommand.prototype.execute = function(callback) {
}

SqlCommand.prototype = Object.create(DbCommand.prototype);

SqlCommand = function(DbConnection) {
    DbConnection.call(DbConnection);
}


SqlCommand.prototype.makeInsert = function(callback) {

};

SequelizeCommand.prototype = Object.create(SqlCommand.prototype);

/*
SequelizeCommand.prototype.execute = function(
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
*/

SequelizeCommand.prototype.Insert = function(sql, replacements) {
    var future = new Future();

    this.conn.query(TSql.sql,
        { replacements:  replacements, type: sequelize.QueryTypes.INSERT }
    ).then(function(rec) {
            console.log(rec)
            console.log("LinkSql.Insert");
            future.return(false)
        },function(err) {
            console.log(err)
            console.log("LinkSql.Insert Fail");
            future.return(true)

        }).catch(function(err) {
            console.log(err);
            console.log("LinkSql.Insert Fail");
            future.return(true)
        })
    return future.wait();
}.future();
