// models/models.js
// Modelo de datos de la aplicación Quiz
// Desde aquí se importan las definiciones de las tablas, que están en comment.js y en quiz.js
// Además, aquí es donde se definen las relaciones entre tablas

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
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));      // Importar definición tabla Quiz de models/quiz.js
var Comment = sequelize.import(path.join(__dirname, 'comment')) // Importar definición tabla Comment de models/comment.js

// Relaciones entre tablas.
// Un Comment pertenece a un único Quiz, un Quiz tiene muchos Comment
// Estas relaciones hacen que se añada la columna QuizId en la tabla Comment (clave externa)
Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

exports.Quiz = Quiz;        // Exportar definición de la tabla Quiz
exports.Comment = Comment;  // Exportar definición de la tabla Comment

// sequelize.sync() crea e inicializa la tabla "Quiz" en la base de datos
sequelize.sync().then(function() {
    // then(...) ejecuta el manejador una vez creada la tabla
    Quiz.count().then(function (count){
        console.log("A ver si hay que crear la bd...");
        if (count === 0) {  //la tabla se inicializa sólo si está vacía
            Quiz.create({ pregunta: 'Capital de Italia',
                      respuesta: 'Roma',
                      tema: 'Otro'
                   }).then(function(){console.log('Base de datos inicializada')});
            Quiz.create({ pregunta: 'Capital de Portugal',
                      respuesta: 'Lisboa',
                      tema: 'Otro'
                   }).then(function(){console.log('Tiene dos registros')});
            Quiz.create({ pregunta: 'Mejor piloto de F1',
                      respuesta: 'Fernando Alonso',
                      tema: 'Humanidades'
                   }).then(function(){console.log('Tiene tres')});
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