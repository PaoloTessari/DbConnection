Package.describe({
  name: "link:dbaccess",
  version: "0.9.1",
  // Brief, one-line summary of the package.
  summary: "",
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
    "sequelize": "3.14.1",
    "tedious": "1.13.1",
    "pg": "4.4.3",
    "pg-hstore": "2.3.2",
    "mongo-oplog": "1.0.1"
});

Package.onUse(function(api) {
  api.versionsFrom("1.2.1");
  api.use("ecmascript");
    //api.addFiles("lib/dbConnection.js");
  api.export("MongoConnection", ["server"]);
  api.export("SequelizeConnection", ["server"]);
});

Package.onTest(function(api) {
  api.use("ecmascript");
  api.use("tinytest",["client","server"]);
  api.use("link:dbaccess", ["server"]);
    api.add_files('lib/dbConnection.js', ["server"]);
  api.add_files('./Test.js', ["server"]);
  //api.addAssets("test/server/settings.json", ["client"]);
});
