var config = require('../config')
var sql = require('mssql')

const db = function(){

    function queryDB (query, callback ){
        sql.connect(config,function(err) {
          if (err) {
            console.error("error connecting: " + err.stack);
            callback(true);
            return;
          }
          console.log("query: ",query);
          var conn = new sql.Request();
          conn.query(query, function(error, result) {
            sql.close();
            if (error) {
              console.dir(error);
              callback(true);
            }else{ 
              callback(false,result.recordset)
            }
                
          });
          
        });
      
      };





}


module.exports = db