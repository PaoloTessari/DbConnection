var Future = Npm.require('fibers/future');
 Log = function(error, msg) {
    console.log("Error "+error+ " msg "+msg);

}

//var t = {};

//t.MongoConnection = Meteor.wrapAsync(TestMongoConnection)

var connManager = new DbConnectionManager(Meteor.settings.DbConnections);

/**
 * Created by paolo on 06/12/15.
 */
Tinytest.add('MongoConnectionOpen', function (test) {
/*
    mongoConn = new MongoConnection(Meteor.settings.DbConnections['TEX']);
    test.equal( mongoConn.open().wait(), false);
*/
    test.isNotNull(connManager.open('TEX').wait());

});

Tinytest.add('MongoConnectionFind', function (test) {

  var fetch = function(name) {
      var future = new Future();
      try {
          var conn = connManager.getConnection("TEX").wait();
          var coll = conn.dbInstance.collection("doc");
          var recs = coll.find({}).toArray(function (err, docs) {

              console.log(docs);
              future.return(false);
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

Tinytest.add('MongoConnectionClose', function (test) {
/*
    if(mongoConn != null) {
        test.equal(mongoConn.close().wait(), false);
    }
    connManager.add('TEX');
*/
    test.equal(connManager.close('TEX').wait(), false);
});


Tinytest.add('POSTGRESConnectionOpen', function (test) {
/*
      var f = function(seqConn) {
        return new Promise(function (fulfill, reject){
            seqConn.open( function(err) {
                if (err) reject(err);
                else fulfill(err);
            });
        });
    }
    seqConn = new SequelizeConnection(Meteor.settings.DbConnections['PLMSQL']);
    f(seqConn).then(function(err) {
        test.equal(err,false);
    });

   /*seqConn.open(function(err) {
       C
   });
    //next();
    */
    test.equal(connManager.open('POSTGRES').wait(),false);
});

Tinytest.add('MSSQLConnectionOpen', function (test) {
    /*
     var f = function(seqConn) {
     return new Promise(function (fulfill, reject){
     seqConn.open( function(err) {
     if (err) reject(err);
     else fulfill(err);
     });
     });
     }
     seqConn = new SequelizeConnection(Meteor.settings.DbConnections['PLMSQL']);
     f(seqConn).then(function(err) {
     test.equal(err,false);
     });

     /*seqConn.open(function(err) {
     C
     });
     //next();
     */
    test.equal(connManager.open('MSSQL').wait(),false);
});



Tinytest.add('POSTGRESConnectionClose', function (test) {

    //test.equal(seqConn.close(), false);
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




