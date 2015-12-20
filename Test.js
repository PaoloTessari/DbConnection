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

    connOpen =  Meteor.wrapAsync(connManager.open);
    test.isNotNull(connOpen('TEX',connManager));
    //test.isNotNull(connManager.open('TEX').wait());

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

    connClose =  Meteor.wrapAsync(connManager.close);
    test.equal(connClose('TEX',connManager), false);
});


Tinytest.add('POSTGRESConnectionOpen', function (test) {

    connMgr =  Meteor.wrapAsync(connManager.open);
    test.isNotNull(connMgr('POSTGRES',connManager));
    //test.equal(connManager.open('POSTGRES').wait(),false);
});

Tinytest.add('MSSQLConnectionOpen', function (test) {
    connMgr =  Meteor.wrapAsync(connManager.open);
    test.isNotNull(connMgr('MSSQL',connManager))

    //test.equal(connManager.open('MSSQL').wait(),false);
});


/*
Tinytest.add('POSTGRESConnectionClose', function (test) {

    //test.equal(seqConn.close(), false);
    test.equal(connManager.close('POSTGRES').wait(), false);

});

Tinytest.add('MSSQLConnectionClose', function (test) {

    test.equal(connManager.close('MSSQL').wait(), false);

});
*/

Tinytest.add('DbDef', function (test) {

    var dbDef = new DbDef(Meteor.settings.Def);
    var fields = dbDef.getFields('doc');
    console.log(fields);
    test.isNotNull(fields);
});





