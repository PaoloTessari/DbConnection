var Future = Npm.require('fibers/future');
var Fiber = Npm.require("fibers");
var Async = Npm.require("async");
 Log = function(error, msg) {
    console.log("Error "+error+ " msg "+msg);

}


var connManager = new DbConnectionManager(Meteor.settings.DbConnections);
var dbDef =  new DbDef(Meteor.settings.Def);
var sequelizeCommandManager = new SequelizeCommandManager(dbDef);

/**
 * Created by paolo on 06/12/15.
 */

Tinytest.add('MongoConnectionOpen', function (test) {

    test.isNotNull(connManager.open('link').wait());
    //Meteor.call('dbOpen','TEX', function(err, response) {
    //    test.equal(response, false, err);
    //})

});


Tinytest.add('ImportToLegacy', function (test) {
  var  documents= [];
  var conn = connManager.getConnection("link").wait();
  var coll = conn.dbInstance.collection("doc");


  var getDocs = function() {
    var future = new Future();
    coll.find({}).toArray(function (err, docs) {
      future.return(docs);
      return future.wait();
    });
  }.future();


  documents = getDocs().wait();

  Async.each(documents,
        function(doc, callback) {
            var future = new Future();
            console.log('Processing doc ' + doc);
            future.return( sequelizeCommandManager.import('doc', doc.wait()));
            console.log('doc processed');
            callback();
            return future.wait()
        },
       function(err) {
         if (err) {
             console.log('A file failed to process');
         }
         else {
           console.log('All files have been processed successfully');
         }
         test.equal(false, err);
    });
});



Tinytest.add('MongoConnectionClose', function (test) {

    test.equal(connManager.close('link').wait(),true);

});


Tinytest.add('POSTGRESConnectionOpen', function (test) {

    test.isNotNull(connManager.open('POSTGRES').wait());
});

Tinytest.add('MSSQLConnectionOpen', function (test) {

 test.isNotNull(connManager.open('MSSQL').wait());
});



Tinytest.add('POSTGRESConnectionClose', function (test) {

    test.equal(connManager.close('POSTGRES').wait(), true);

});

Tinytest.add('MSSQLConnectionClose', function (test) {

    test.equal(connManager.close('MSSQL').wait(), true);

});


Tinytest.add('DbDef', function (test) {

    var dbDef = new DbDef(Meteor.settings.Def);
    var fields = dbDef.getFields('doc');
    console.log(fields);
    test.isNotNull(fields);
});





