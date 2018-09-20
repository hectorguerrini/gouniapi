module.exports = function(app) {
  var list = require('./controllers/listController');


  // todoList Routes
  app.route('/gouniapi/')
    .get(list.home);
  app.route('/gouniapi/updateUsuario')
    .post(list.updateUsuario);
  app.route('/gouniapi/loginUsuario')
    .post(list.loginUsuario);
  app.route('/gouniapi/listaUniversidades')
    .post(list.listaUniversidades);
};
