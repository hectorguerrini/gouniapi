module.exports = function(app) {
  var list = require('./controllers/listController');


  // todoList Routes
  app.route('/gouniapi/')
    .get(list.home);
};
