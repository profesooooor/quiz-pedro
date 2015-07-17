// models.js

var path = require('path');


// Postgres DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite   DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
console.log('La url es: ',url);
var DB_name  = (url[6]||null);
var user     = (url[2]||null);
var pwd      = (url[3]||null);
var protocol = (url[1]||null);
var dialect  = (url[1]||null);
var port     = (url[5]||null);
var host     = (url[4]||null);
var storage  = process.env.DATABASE_STORAGE;

// Cargar el ORM
var Sequelize = require('sequelize');

/* Versión vieja
// Usar BBDD SQLite
var sequelize = new Sequelize(null, null, null,
                    {dialect: "sqlite", storage: "quiz.sqlite"}
                    );
*/

// Usar BBDD SQLite o Postgres
var sequelize = new Sequelize(DB_name, user, pwd, 
  { dialect:  protocol,
    protocol: protocol,
    port:     port,
    host:     host,
    storage:  storage,  // solo SQLite (.env)
    omitNull: true      // solo Postgres
  }      
);
                    
// Importar la definición de la tabla Quiz en "models/quiz.js"
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));

exports.Quiz = Quiz;    // Exportar definición de la tabla Quiz

// sequelize.sync() crea e inicializa la tabla "preguntas" en la base de datos
sequelize.sync().then(function() {
    // then(...) ejecuta el manejador una vez creada la tabla
    Quiz.count().then(function (count){
        if (count === 0) {  //la tabla se inicializa sólo si está vacía
            Quiz.create({ pregunta: 'Capital de Italia',
                      respuesta: 'Roma'
                   }).then(function(){console.log('Base de datos inicializada')});
            Quiz.create({ pregunta: 'Capital de Portugal',
                      respuesta: 'Lisboa'
                   }).then(function(){console.log('Tiene dos registros')});
        };
    });
});

/* DA ERROR. Al parecer el problema es que el success() que pone en los apuntes "ya no se lleva", ya no existe
// sequelize.sync() crea e inicializa la tabla "preguntas" en la base de datos
sequelize.sync().success(function() {
    // success(...) ejecuta el manejador una vez creada la tabla
    Quiz.count().success(function (count){
        if (count === 0) {  //la tabla se inicializa sólo si está vacía
            Quiz.create({ pregunta: 'Capital de Italia',
                      respuesta: 'Roma'
                   })
            .success(function(){console.log('Base de datos inicializada')});
        };
    });
});
*/