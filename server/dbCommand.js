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
/*
SqlCommand.prototype.normalizeSql = function(sql) {
  return replace(/\{/g, "").sql.replace(/\}/g, "");
}
*/

/* SequelizeCommand */
SequelizeCommand = function(DbConnection) {
    SqlCommand.call(this, DbConnection);
};

SequelizeCommand.prototype = Object.create(SqlCommand.prototype);



SequelizeCommand.prototype.execSql = function(sql, replacements, action) {

    var self = this;
    try {

        var future = new Future();
        this.conn.getInstance().query(sql,
            {
                replacements: replacements,
                type:
                    action == 'i' ? Sequelize.QueryTypes.INSERT :
                        action == 'u' ? Sequelize.QueryTypes.UPDATE :
                            action == 'd' ? Sequelize.QueryTypes.DELETE : ''
            }
        ).then(function (rec) {
                //console.log("[OK] execSql: " + sql);
                future.return(true)
            }, function (err) {
                console.log("**[KO] execSql: " + err.message+' '+sql);
                future.return(false)

            }).catch(function (err) {
                console.log("**[KO] execSql: " + err.message+' '+sql);
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
