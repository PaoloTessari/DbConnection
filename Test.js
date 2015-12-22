var Future = Npm.require('fibers/future');
 Log = function(error, msg) {
    console.log("Error "+error+ " msg "+msg);

}

//var t = {};

//t.MongoConnection = Meteor.wrapAsync(TestMongoConnection)

var connManager = new DbConnectionManager(Meteor.settings.DbConnections);
var dbDef =  new DbDef(Meteor.settings.Def);
var sequelizeCommandManager = new SequelizeCommandManager(dbDef);

/**
 * Created by paolo on 06/12/15.
 */
Tinytest.add('MongoConnectionOpen', function (test) {

    //test.isNotNull(connManager.open('TEX').wait());
    Meteor.call('dbOpen','TEST', function(err, response) {
        test.equal(response, false, err);
    });


});
/*
Tinytest.add('MongoConnectionFind', function (test) {

  var fetch = function(name) {
      var future = new Future();
      try {
          var conn = connManager.getConnection("TEX").wait();
          var coll = conn.dbInstance.collection("doc");
          coll.find({}).toArray(function (err, docs) {


              future.return(sequelizeCommandManager.import('doc', docs).wait());

          })
      }
      catch(e) {
          console.log(e);
          future.return(true);

      }
      return future.wait();
   }.future();

   test.equal(false, fetch().wait());
});
*/

Tinytest.add('MongoConnectionClose', function (test) {

    test.isNotNull(connManager.close('TEX').wait());

});


Tinytest.add('POSTGRESConnectionOpen', function (test) {

    test.equal(connManager.open('POSTGRES').wait(),false);
});

Tinytest.add('MSSQLConnectionOpen', function (test) {

 test.equal(connManager.open('MSSQL').wait(),false);
});



Tinytest.add('POSTGRESConnectionClose', function (test) {

    test.equal(connManager.close('POSTGRES').wait(), false);

});

Tinytest.add('MSSQLConnectionClose', function (test) {

    test.equal(connManager.close('MSSQL').wait(), false);

});


Tinytest.add('DbDef', function (test) {

    var dbDef = new DbDef(Meteor.settings.Def);
    var fields = dbDef.getFields('doc');
    console.log(fields);
    test.isNotNull(fields);
});





