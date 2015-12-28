/* DbCommand */
DbCommand = function(DbConnection) {
  this.conn = DbConnection;
};

DbCommand.prototype.execute = function(callback) {
};

SqlCommand = function(DbConnection) {
    DbCommand.call(this, DbConnection);
};

SqlCommand.prototype = Object.create(DbCommand.prototype);



// Remove {} from sql
SqlCommand.prototype.normalizeSql = function(sql) {
//    var sql = sql.replace(/\{/g, "").sql.replace(/\}/g, "");
}

/* SequelizeCommand */
SequelizeCommand = function(DbConnection) {
    SqlCommand.call(this, DbConnection);
};

SequelizeCommand.prototype = Object.create(SqlCommand.prototype);


// action : sequelize.QueryTypes.INSERT
SequelizeCommand.prototype.ExecSql = function(sql, replacements, action) {

    self = this;
    var future = new Future();

    sql = self.normalizeSql(sql);

    this.conn.getInstance().query(sql,
        { replacements:  replacements,
            type: action == 'i' ?  sequelize.QueryTypes.INSERT :
                  action == 'u' ?  sequelize.QueryTypes.UPDATE :
                  action == 'd' ?  sequelize.QueryTypes.DELETE : ''
        }
    ).then(function(rec) {
            console.log(rec);
            console.log("Execute success: "+action);
            future.return(true)
        },function(err) {
            console.log(err);
            console.log("Execute fail: "+action);
            future.return(false)

        }).catch(function(err) {
            console.log(err);
            console.log("Execute fail: "+action);
            future.return(false);
        });
    return future.wait();
}.future();


