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

exports.updateUsuario = function(req, res) {

  var query = " EXEC sp_gou_update_usuarios ";
  query +=" @USUARIO='"+req.body.usuario +"'";
  query +=" ,@PW='"+req.body.pw +"'";
  query +=" ,@NOME='"+req.body.nome +"'";
  query +=" ,@EMAIL='"+req.body.email +"'";
  query +=" ,@DT_NASC='"+req.body.dt_nasc +"'";
  query +=" ,@TIPO='"+req.body.tipo +"'";
  

  var conn = new sql.Request();
  conn.query(query, function(error, result) {
    if (error) {
      console.dir(error);
    }

    if (result.recordset.length > 0) {   
      res.json({ message: true, string: query, jsonRetorno: result.recordset });
    } else {
      res.json({ message: false, string: query, jsonRetorno: [] });
    }
  });
};

exports.loginUsuario = function(req, res) {

  var query = " EXEC sp_gou_login ";
  query +=" @PW='"+req.body.pw +"'";
  query +=" ,@EMAIL='"+req.body.email +"'";

  var conn = new sql.Request();
  conn.query(query, function(error, result) {
    if (error) {
      console.dir(error);
    }

    if (result.recordset.length > 0) {   
      res.json({ message: true, string: query, jsonRetorno: result.recordset });
    } else {
      res.json({ message: false, string: query, jsonRetorno: [] });
    }
  });
};

