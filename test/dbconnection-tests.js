// Write your tests here!
// Here is an example.

//Tinytest = require('tinytest');

Tinytest.add('MongoConnection.open', function (test) {
  if(Meteor.isServer) {
      console.log(Meteor.settings.DbConnections['MONGO']);
      dbConn = new MongoConnection(Meteor.settings.DbConnections['MONGO'])
      dbConn.open(function(err) {
          if(err == null) {
              console.log("Connected correctly to server Mongo");

          }

      });
  }
  test.equal(err, null);

});


Tinytest.add('SequelizeConnection.open', function (test) {
    if(Meteor.isServer) {
        console.log(Meteor.settings.DbConnections['LINK01']);
        dbConn = new SequelizeConnection(Meteor.settings.DbConnections['LINK01'])
        dbConn.open(function(err) {
            if(err == null) {
                console.log("Connected correctly to server LINK01");

            }

        });
    }
    test.equal(true, true);
});
