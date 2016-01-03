Package.describe({
  name: "link:dbaccess",
  version: "1.1.9",
  // Brief, one-line summary of the package.
  summary: "dbaccess",
  // URL to the Git repository containing the source code for this package.
  git: "",
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: "README.md"
});


/* This lets you use npm packages in your package*/
Npm.depends({
    "asserts" : "4.0.2",
    "mongodb": "2.0.48",
    "sequelize": "3.14.2",
    "tedious": "1.13.1",
    "pg": "4.4.3",
    "pg-hstore": "2.3.2",
    //"mongo-oplog": "1.0.1",
    "fibers": "1.0.5",
    "future": "2.3.1",
    "date-format-lite": "0.7.4"
    //"async" : "1.5.0"
});

Package.onUse(function(api) {
  api.versionsFrom("1.2.1");
  api.use("ecmascript");
  api.use("underscore", "server");
  //api.use("nimble:restivus", "server");
  //api.use("iron:router@1.0.12");
  //api.addFiles("server/dbDocDef.js");
  api.addFiles("server/dbCommand.js");
  api.addFiles("server/dbCommandManager.js");
  api.addFiles("server/dbConnection.js")
  api.addFiles("server/dbConnectionManager.js");
  api.addFiles("server/dbUtil.js");
  api.export("DbConnectionManager", "server");
  api.export("SqlCommandManager", "server");
  api.export("SequelizeCommandManager", "server");
  api.export("OpSequelizeCommandManager", "server");
  api.export("DbUtil", "server");
  //api.export("DbDef", "server");
});

/*
Package.onTest(function(api) {
  api.use("ecmascript");
  api.use("underscore", "server");
  api.use("tinytest",["server"]);
  api.use("http");
  //api.use("iron:router");
  api.use("link:dbaccess", ["server"]);
  api.add_files('lib/dbConnection.js', ["server"]);
  api.add_files('lib/dbConnectionManager.js', ["server"]);
  api.add_files('lib/dbCommandManager.js', ["server"]);
  api.add_files('lib/dbCommand.js', ["server"]);
  api.add_files('lib/dbDocDef.js', ["server"]);
  api.add_files('server/router.js', ["server"]);
  api.add_files('./Test.js', ["server"]);
  //api.addAssets("test/server/settings.json", ["client"]);
});
*/
