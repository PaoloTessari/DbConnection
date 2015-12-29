var Future = Npm.require('fibers/future');
var Sequelize = Npm.require("sequelize");

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
  return sql.replace(/\{/g, "").replace(/\}/g, "");
}

/* SequelizeCommand */
SequelizeCommand = function(DbConnection) {
    SqlCommand.call(this, DbConnection);
};

SequelizeCommand.prototype = Object.create(SqlCommand.prototype);


// action : sequelize.QueryTypes.INSERT
SequelizeCommand.prototype.execSql = function(sql, replacements, action) {

    self = this;


    try {
        var sql = self.normalizeSql(sql);

        var future = new Future();
        this.conn.getInstance().query(sql,
            {
                replacements: replacements,
                type: action == 'i' ? Sequelize.QueryTypes.INSERT :
                    action == 'u' ? Sequelize.QueryTypes.UPDATE :
                        action == 'd' ? Sequelize.QueryTypes.DELETE : ''
            }
        ).then(function (rec) {
                console.log(rec);
                console.log("Execute success: " + action);
                future.return(true)
            }, function (err) {
                console.log(err);
                console.log("Execute fail: " + action);
                future.return(false)

            }).catch(function (err) {
                console.log(err);
                console.log("Execute fail: " + action);
                future.return(false);
            });
        return future.wait();
    }
    catch(e) {
        console.log(e);
        future.return(false);
        return future.wait();
    }
}.future();


