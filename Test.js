/**
 * Created by paolo on 06/12/15.
 */
Tinytest.add('MongoConnection', function (test) {

    //var self = this;
    var result = false;
    var mongoConn = new MongoConnection(Meteor.settings.DbConnections['TEX']);

    mongoConn.open(function (err) {
        Result(err, "mongoConn.open()");
        test.equal(err, false);

        mongoConn.close(function(err) {
            Result(err, "mongoConn.close()");

        })
    });


});


Tinytest.add('SequelizeConnection', function (test) {


    var sqlConn = new SequelizeConnection(Meteor.settings.DbConnections['PLMSQL']);
    var self = this;
    sqlConn.open(function (err) {
        Result(err, "SequelizeConnection.open()");
        test.equal(err, false);

        sqlConn.close(function(err) {
            Result(err, "SequelizeConnection.close()");

        })
    });
});


var Result = function(error, msg) {
    console.log("Error "+error+ " msg "+msg);

}