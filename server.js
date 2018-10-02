var express = require('express');

var graphqlHTTP = require('express-graphql');
//var { buildSchema } = require('graphql');

const schema = require('./graphql/universidade.js');

var bodyParser = require('body-parser');
var app = express();
// Body Parser Middleware

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json()); 

//CORS Middleware
app.use(function (req, res, next) {
    //Enabling CORS 
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,POST");
    res.header("Access-Control-Allow-Headers", "*");
    //res.header('Content-disposition', 'attachment; filename=');
    next();
});

app.use('/gouniapi/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true
}));


var routes = require('./route'); //importing route
routes(app); //register the route

 var server = app.listen(process.env.PORT || 3000,  function () {
    var port = server.address().port;
    console.dir("App now running on port: "+ port);
 });

