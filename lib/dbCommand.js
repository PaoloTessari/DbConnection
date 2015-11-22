
DbCommand = function(DbConnection) {
  this.conn = DbConnection;
}

DbCommand.prototype.execute = function(callback) {
}

SqlCommand.prototype = Object.create(DbCommand.prototype);

SqlCommand.prototype.execute = function(
  TDbCommandExecute,
  TDoc,
  TParameters,
  CDbCommandExecuteCallback)
)
{

}


