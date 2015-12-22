/**
 * Created by paolo on 22/12/15.
 */


var connectionManager = null;
Meteor.methods({
    dbOpen: function (alias) {
        try {
            if (connectionManager == null) {
                connectionManager = new DbConnectionManager(Meteor.settings.DbConnections);
            }
            console.log('before dbOpen '+alias);
            var err = connectionManager.open(alias).wait();
            console.log('dbOpen err='+err);
        }
        catch(e) {
          return false;
        }
    }
});
