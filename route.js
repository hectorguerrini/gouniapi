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
  app.route('/gouniapi/listaCursos')
    .post(list.listaCursos);
  app.route('/gouniapi/universidade/:id/:user?')
    .post(list.getUniversidade);
  app.route('/gouniapi/curso/:id/:user?')
    .post(list.getCurso);
  app.route('/gouniapi/avaliacao/:tipo/:user')
    .post(list.updateAvaliacao);
  app.route('/gouniapi/compare/universidade/:curso')
    .post(list.compareUniversidades);
  app.route('/gouniapi/combo/:combo')
    .post(list.getCombo);
};
