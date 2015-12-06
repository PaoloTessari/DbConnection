/**
 * Created by paolo on 06/12/15.
 */
Tinytest.add('MongoConnection', function (test) {

    //var self = this;
    var result = false;
    var mongoConn = new MongoConnection(Meteor.settings.DbConnections['TEX']);
    mongoConn.open(function(err) {
        if (err) {
            console.log('MongoConnection. open fail');
            result = false;
        }
        else {

            console.log('MongoConnection.open success');
            result = true;

        }
        test.equal(err, false);
    });


});


Tinytest.add('SequelizeConnection', function (test) {


    var sqlConn = new SequelizeConnection(Meteor.settings.DbConnections['LINK01']);
    var self = this;
    sqlConn.open(function (err) {
        if (err) {
            console.log('SequelizeConnection.open fail');

        }

        else
          console.log('SequelizeConnection.open success');

        test.equal(err, false);

    });
});