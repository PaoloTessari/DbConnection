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




        // Global API configuration
var   api = new Restivus({
            useDefaultAuth: true,
            prettyJson: true
        });

        // Maps to: db/open/:id
        api.addRoute('/db/open/:alias', {authRequired: false}, {
            get: function () {
                console.log('/db/open/:alias');


                return getConnectionManager().open(this.urlParams.alias)
                return;
            },
            post: function () {
                console.log('/db/open/:alias');


                return getConnectionManager().open(this.urlParams.alias)
                return;
            }
    });




