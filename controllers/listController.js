var config = require('../config')
var sql = require('mssql')
const configPool = {
  user: 'gouniadmin',
  password: 'Luka1523',
  server: 'gounidb.database.windows.net', // You can use 'localhost\\instance' to connect to named instance
  database: 'DBGouni',
  options: {
    encrypt: true // Use this if you're on Windows Azure
  },
  pool: {
      max: 20,
      min: 0,
      idleTimeoutMillis: 30000
  }
}
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
  const pool = new sql.ConnectionPool(configPool, function (err) {
    if (err) {
      console.error("error connecting: " + err.stack);
      callback(true);
    }
    console.log("query: ", query);
    var conn = new sql.Request(pool);
    conn.query(query, function (error, result) {
      
      if (error) {
        console.dir(error);
        callback(true);
      } else {
        callback(false,result.recordset);
      }

    });

  });

};
exports.executeQuery = function (query) {
  return new Promise((resolve, reject) => {


    const pool = new sql.ConnectionPool(configPool, function (err) {
      if (err) {
        console.error("error connecting: " + err.stack);
        reject();
      }
      console.log("query: ", query);
      var conn = new sql.Request(pool);
      conn.query(query, function (error, result) {
        
        if (error) {
          console.dir(error);
          reject();
        } else {
          resolve(result.recordset);
        }

      });

    });
  })
}

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
    ${req.body.limpeza ? `,@LIMPEZA='${req.body.limpeza}'`: '' }
    ${req.body.professores ? `,@PROFESSORES='${req.body.professores}'`: '' }
    ${req.body.instalacoes ? `,@INSTALACOES='${req.body.instalacoes}'`: '' }
    ${req.body.estacionamento ? `,@ESTACIONAMENTO='${req.body.estacionamento}'`: '' }
    ${req.body.lanchonetes ? `,@LANCHONETES='${req.body.lanchonetes}'`: '' }
    ${req.body.ensino ? `,@ENSINO='${req.body.ensino}'`: '' }
    ${req.body.comment ? `,@COMENTARIO='${req.body.comment}'`: '' }
    `;
   
  queryDB(query, (err, result) => {
    if(err){
      console.dir(err);
      return;
    }    
    res.json({string: query, jsonRetorno: result });    
  })
};

