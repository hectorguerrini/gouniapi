var config = require('../config')
var sql = require('mssql')

/*
sql.connect(config,function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log("connected ");
});
*/
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
  

  queryDB(query, (err, result) => {
    if(err){
      console.dir(err);
      return;
    }    
    res.json({string: query, jsonRetorno: result });    
  })
  
};

exports.loginUsuario = function(req, res) {
  var query = ` EXEC sp_gou_login @PW='${req.body.pw}', @EMAIL='${req.body.email}' `;
  
  queryDB(query, (err, result) => {
    if(err){
      console.dir(err);
      return;
    }    
    res.json({string: query, jsonRetorno: result });    
  })
};

exports.listaUniversidades = function(req, res){
  var query = ` EXEC sp_gou_get_universidades @NOME='${req.body.nome}'`;
  
  queryDB(query, (err, result) => {
    if(err){
      console.dir(err);
      return;
    }    
  
    res.json({string: query, jsonRetorno: result });    
  })
}
exports.listaCursos = function(req, res){
  var query = ` EXEC sp_gou_get_cursos @NOME='${req.body.nome}'`;
  
  queryDB(query, (err, result) => {
    if(err){
      console.dir(err);
      return;
    }    
  
    res.json({string: query, jsonRetorno: result });    
  })
}

exports.getUniversidade = function(req, res){
 
  var query = ` EXEC sp_gou_get_detalhe_universidade @ID=${req.params.id}
    ${req.params.user ? `,@ID_USUARIO=${req.params.user}` : ''}`;
  // query +=" @ID='"+req.params.id +"'";
  var query2 = ` EXEC sp_gou_get_detalhe_universidade_curso @ID=${req.params.id} `;
  queryDB(query, (err, result) => {
    if(err){
      console.dir(err);
      return;
    }    
    var r = result;
    queryDB(query2, (err, result) => {
      if(err){
        console.dir(err);
        return;
      }    
      r[0].filhos = result
      res.json({string: query, jsonRetorno: r });    
    })  
    
  })
}

exports.getCurso = function(req, res){
 
  var query = ` EXEC sp_gou_get_detalhe_curso @ID=${req.params.id}
    ${req.params.user ? `,@ID_USUARIO=${req.params.user}` : ''}`;
  var query2 = ` EXEC sp_gou_get_detalhe_curso_universidade @ID=${req.params.id} `;
  queryDB(query, (err, result) => {
    if(err){
      console.dir(err);
      return;
    }    
   
    var r = result;
    queryDB(query2, (err, result) => {
      if(err){
        console.dir(err);
        return;
      }    
      r[0].filhos = result
      res.json({string: query, jsonRetorno: r });    
    })  
    
  })
}

exports.updateAvaliacao = function(req, res) {
  var proc = req.params.tipo == 'universidade' ? 'sp_gou_update_universidade_avaliacao' : ( req.params.tipo == 'curso' ? 'sp_gou_update_curso_avaliacao' : false );
  if (!proc) {
    console.dir('parametro errado',req.params.tipo);
    res.status(404);
    return;
  }
  var query = ` EXEC ${proc} 
    @ID_USUARIO=${req.params.user}
    ,@ID=${req.body.id}
    ,@AVAL=${req.body.avaliacao}
    ${req.body.comment ? `,@COMENTARIO='${req.body.comment}'`: '' }`;
  
  queryDB(query, (err, result) => {
    if(err){
      console.dir(err);
      return;
    }    
    res.json({string: query, jsonRetorno: result });    
  })
};

