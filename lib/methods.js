/**
 * Created by paolo on 22/12/15.
 */


var connectionManager = null;

var getConnectionManager = function() {
    if (connectionManager == null) {
        connectionManager = new DbConnectionManager(Meteor.settings.DbConnections);
    }
    return connectionManager;

};
Meteor.methods({
    dbOpen: function (alias) {
        try {

            console.log('before dbOpen '+alias);
            var err = getConnectionManager().open(alias).wait();
            console.log('dbOpen err='+err);
        }
        catch(e) {
          return false;
        }
    }
});


if (Meteor.isServer) {
        Meteor.startup(function () {

            // Global API configuration
            api = new Restivus({
                useDefaultAuth: true,
                prettyJson: true
            });

            // Maps to: db/open/:id
            api.addRoute('db/open/:alias', {authRequired: false}, {
                get: function () {
                    console.log('open');
                    return getConnectionManager().open(this.urlParams.alias)
                }
            });
        });
}