var config = require('../config')
var sql = require('mssql')


sql.connect(config,function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log("connected ");
});


exports.home = function (req, res) {
  res.json({json:'work'});
};


