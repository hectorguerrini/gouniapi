const univer = require('./uni.js');

let {
    // These are the basic GraphQL types need in this tutorial
    GraphQLString,
    GraphQLID,
    GraphQLList,
    GraphQLInt,
    GraphQLObjectType,
    // This is used to create required fileds and arguments
    GraphQLNonNull,
    // This is the class we need to create the schema
    GraphQLSchema,
} = require('graphql');
var list = require('../controllers/listController');

const UniversidadeType = new GraphQLObjectType({
    name: "Universidade",
    description: "Representa as universidade",
    fields: () => ({
        id: {
            type: new GraphQLNonNull(GraphQLID)
        },
        nome: {
            type: new GraphQLNonNull(GraphQLString)
        },
        descricao: {
            type: GraphQLString
        },
        cursos: {
            type: new GraphQLList(CursoType),
            resolve: function (obj,args,context,info) {            
                var res = list.executeQuery(` EXEC sp_gou_get_detalhe_universidade_curso @ID=${obj.id} `);
                return res;                    
           }
        }
    })
});

const CursoType = new GraphQLObjectType({
    name: "Curso",
    description: "Representa o curso",
    fields: () => ({
        id: {
            type: new GraphQLNonNull(GraphQLID)
        },
        nome: {
            type: new GraphQLNonNull(GraphQLString)
        },
        descricao: {
            type: GraphQLString
        },
        duracao: {
            type: GraphQLInt
        },
        universidade:{
            type: new GraphQLList(UniversidadeType),
            resolve: function (obj,args,context,info) {            
                var res = list.executeQuery(` EXEC sp_gou_get_detalhe_curso_universidade @ID=${obj.id} `);
                return res;                    
           }
        }
    })
});


const listaUniversidadeQuery = new GraphQLObjectType({
    name: 'SchemaUniversidade',
    description: "Universidadae Schema Query Root",
    fields: () => ({
        universidade: {
            type: new GraphQLList(UniversidadeType),
            description: "List of all universidade",
            args: {
                nome: {
                  type: GraphQLString
                }
            },
            resolve:  function (obj,args,context,info) {            
                 var res = list.executeQuery(` EXEC sp_gou_get_universidades @NOME='${args.nome?args.nome:''}'`);
                 return res;                    
            }
        },
        curso:{
            type: new GraphQLList(CursoType),
            args: {
                nome: {
                  type: GraphQLString
                }
            },
            description: "List of all cursos",
            resolve:  function (obj,args,context,info) {            
                 var res = list.executeQuery(` EXEC sp_gou_get_cursos @NOME='${args.nome?args.nome:''}'`);
                 return res;                    
            }
        }
    })
});

const UniSchema = new GraphQLSchema({
    query: listaUniversidadeQuery,
    // If you need to create or updata a datasource, 
    // you use mutations. Note:
    // mutations will not be explored in this post.
    // mutation: BlogMutationRootType 
});
module.exports = UniSchema;