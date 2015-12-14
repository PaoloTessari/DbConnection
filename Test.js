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
Tinytest.add('MongoConnectionOpen', function (test) {

    mongoConn = new MongoConnection(Meteor.settings.DbConnections['TEX']);
    test.equal( mongoConn.open().wait(), false);

});


Tinytest.add('MongoConnectionClose', function (test) {

    if(mongoConn != null) {
        test.equal(mongoConn.close().wait(), false);
    }
});


Tinytest.add('SequelizeConnectionOpen', function (test) {

   seqConn = new SequelizeConnection(Meteor.settings.DbConnections['PLMSQL']);
    //test.length(seqConn.open().wait(), 1);

    test.equal( Meteor.wrapAsync(seqConn.open()), false);

   /*seqConn.open(function(err) {
       test.equal(err, false);
   });
    //next();
    */
});




