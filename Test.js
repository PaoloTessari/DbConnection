var Future = Npm.require('fibers/future');
 Log = function(error, msg) {
    console.log("Error "+error+ " msg "+msg);

}

//var t = {};

//t.MongoConnection = Meteor.wrapAsync(TestMongoConnection)

/**
 * Created by paolo on 06/12/15.
 */
Tinytest.addAsync('MongoConnection', function (test, next) {

    var err = TestMongoConnection().wait();
    test.equal(err, false);
    next();



});

/*
Tinytest.addAsync('SequelizeConnection', function (test, next) {

    var err = TestSequelizeConnection();
    test.equal(err, false);
    next();
});
*/

var TestMongoConnection = function TestMongoConnection() {


    var mongoConn = new MongoConnection(Meteor.settings.DbConnections['TEX']);

    return mongoConn.open().wait();

}.future();
/*
function TestMongoConnection() {
//var self = this;
    var future = new Future();


    var mongoConn = new MongoConnection(Meteor.settings.DbConnections['TEX']);

    mongoConn.open(function (err) {

        future.return( err );

    })
    return future.wait();


}
*/

function TestSequelizeConnection () {

    var future = new Future();


    var sqlConn = new SequelizeConnection(Meteor.settings.DbConnections['PLMSQL']);
    sqlConn.open(function (err) {
        future.return( err );

    })
    return future.wait();
}

/*
Tinytest.add('DocsDef', function (test) {

    Fiber(function () {
        console.log(Meteor.settings.Def.Collections);

        var docsDef = new DocsDef(Meteor.settings.Def.Collections)
        var fieldAttr = docsDef.getFieldAttr('doc', '_id');
        console.log(fieldAttr);
        test.notEqual(fieldAttr, null);

        //Log(fieldAttr, '');
        //next();
    }).run();

});

*/