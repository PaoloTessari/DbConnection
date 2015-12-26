
DbCommand = function(DbConnection) {
  this.conn = DbConnection;
};

DbCommand.prototype.execute = function(callback) {
};

SqlCommand = function(DbConnection) {
    DbCommand.call(this, DbConnection);
};

SqlCommand.prototype = Object.create(DbCommand.prototype);

SequelizeCommand = function(DbConnection) {
    SqlCommand.call(this, DbConnection);
};


SequelizeCommand.prototype = Object.create(SqlCommand.prototype);


SequelizeCommand.prototype.Insert = function(sql, replacements) {
    var future = new Future();

    this.conn.query(sql,
        { replacements:  replacements, type: sequelize.QueryTypes.INSERT }
    ).then(function(rec) {
            console.log(rec);
            console.log("LinkSql.Insert");
            future.return(false)
        },function(err) {
            console.log(err);
            console.log("LinkSql.Insert Fail");
            future.return(true)

        }).catch(function(err) {
            console.log(err);
            console.log("LinkSql.Insert Fail");
            future.return(true);
        });
    return future.wait();
}.future();
