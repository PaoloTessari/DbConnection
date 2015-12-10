var Future = Npm.require('fibers/future');
 Log = function(error, msg) {
    console.log("Error "+error+ " msg "+msg);

}

//var t = {};

//t.MongoConnection = Meteor.wrapAsync(TestMongoConnection)

var mongoConn = null;
var seqConn = null;

/**
 * Created by paolo on 06/12/15.
 */
Tinytest.addAsync('MongoConnectionOpen', function (test, next) {

    mongoConn = new MongoConnection(Meteor.settings.DbConnections['TEX']);
    var err =  mongoConn.open().wait();
    test.equal(err,false);
    next();

});


Tinytest.addAsync('MongoConnectionClose', function (test, next) {

    if(mongoConn != null) {
        var err = mongoConn.close().wait();
        test.equal(err, false);
    }
    next();
});


Tinytest.addAsync('SequelizeConnectionOpen', function (test, next) {

   seqConn = new SequelizeConnection(Meteor.settings.DbConnections['PLMSQL']);
   var err = seqConn.open().wait();
   test.equal(err,false);
    next();
});



