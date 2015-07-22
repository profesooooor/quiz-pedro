// controllers/quiz_controller.js

var models = require('../models/models.js');

// Autoload - se activa si la ruta incluye :quizId, carga valor en variable quiz y pasa control a quien corresponda
exports.load = function(req, res, next, quizId) {
    // models.Quiz.find(quizId).then(               -- no funciona en la versión actual de sequelize
    //models.Quiz.findOne().then (                  // funciona pero siempre devuelve la primera
    models.Quiz.findById(quizId). then (
    // models.Quiz.findAll({ where: {id: {eq: quizId} } }) // jamás lo probé
       function(quiz) {
 console.log('He buscado ',quiz.id,' que es lo mismo que el ',quizId    )           
           if (quiz) {
               req.quiz = quiz;
               next();  // Este next() salta a index, show o answer según la ruta
           } else {
               next(new Error('No existe el quizId=' + quizId));
           }
       }
       ).catch(function(error) { next(error);});
};

// GET /quizes
// Mostramos todas las preguntas que hay almacenadas en la base de datos. Utilizamos quizes/index.jade
// Si se pasa el parámetro de URL "search" sólo se muestran las que cumplan el criterio
exports.index = function(req, res) {
    if (req.query.search) {
        var search='%'+req.query.search.replace(/ /g,'%')+'%';  // query porque viene en la URL
        console.log('---Estoy en exports.index. search vale ',search);
        models.Quiz.findAll({where:["pregunta LIKE ?", search], order:"pregunta"}).then(function(quizes) {
        // models.Quiz.findAll().then(function(quizes) {    // Versión antes del ejercicio P2P del módulo 7, ruta GET /quizes
            res.render('quizes/index', {quizes: quizes, errors: []});
        }).catch(function(error) { next(error);});
    } else
        res.render('quizes/index', {quizes: {}, errors: []});
};

// GET /quizes/:quizId
// Mostramos la pregunta escogida y pedimos la respuesta. Utilizamos quizes/show.jade
exports.show = function(req, res) {
    console.log("models/models.js exports.show() Ahora req.params.quizId vale...",req.params.quizId);
    // Cuando ponemos quizes/show queremos decir /view/quizes/show.jade
    res.render('quizes/show', { quiz: req.quiz, errors: []});
/* Este era el fragmento de código que no iba de ninguna de las maneras, al parecer POR UN ERROR EN EL PDF, PG 27
    models.Quiz.find(req.params.quizId).then(function(quiz) {    
        res.render('quizes/show', { quiz: req.quiz});
    })
*/
};

// GET /quizes/:quizId/answer
// Comprobamos que la respuesta introducida se corresponde con la almacenada en la BD para esa pregunta
// Utilizamos quizes/answer.jade
exports.answer = function(req, res) {
    var resultado;
    if (req.query.respuesta.toUpperCase() === req.quiz.respuesta.toUpperCase())
        resultado = 'Correcto';
    else
        resultado = 'Incorrecto';
    res.render('quizes/answer', {quiz:req.quiz, respuesta:resultado, errors: []});
};

// GET /quizes/new
exports.new = function(req, res) {
    // Construir objeto Quiz válido que el usuario editará:
    var quiz = models.Quiz.build ({pregunta:"Pregunta", respuesta:"Respuesta"});
    res.render('quizes/new', {quiz: quiz, errors: []});
}

// POST /quizes/create  (aquí se llega desde el formulario de GET /quizes/new, véase new.jade)
exports.create = function (req, res) {
    console.log("Estoy en exports.create");
    //var quiz = models.Quiz.build(req.query.quiz); // Ese objeto viene de un FORM con GET (ver new.jade)
    var quiz = models.Quiz.build(req.body.quiz); // Ese objeto quiz viene de un FORM con POST (ver new.jade)

    console.log("Voy a guardar en la bd: ",quiz['pregunta']," ",quiz.respuesta);
    quiz
    .validate()         // Comprobar reglas de la BD que hemos puesto en models/quiz.js
    .then(
        function(err) {
            if (err) {
                res.render('quizes/new', {quiz: quiz, errors: err.errors});
            } else {
                quiz
                // Guarda en la BD (save) y, si fue bien, redirijir a lista de preguntas, donde ya saldrá la nueva
                .save({fields: ["pregunta", "respuesta"]})
                .then(function() { res.redirect('/quizes'); })
            }
        }
    )    
}

exports.edit = function (req,res) {
    var quiz = req.quiz; // El autoload, es decir, exports.load, ya ha leído los datos
    res.render('quizes/edit', {quiz: quiz, errors: []});
}

exports.update = function (req,res) {
    // El exports.load ha cargado automáticamente req.quiz porque está :quizId en el camino
    console.log("exports.update pregunta ya editada: ",req.body.quiz.pregunta);
    req.quiz.pregunta = req.body.quiz.pregunta;
    req.quiz.respuesta = req.body.quiz.respuesta;
    console.log("voy a validar y actualizar en la bd")
    req.quiz
    .validate()
    .then(function (err) {
        if (err) {
            res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
        } else {
            req.quiz
            .save( {fields: ["pregunta", "respuesta"]} )
            .then( function() { res.redirect('/quizes');});
        }
    });
}

exports.destroy = function (req, res) {
    // Intenta borrar de la bd. Si va bien, vuelve a la lista de preguntas (/quizes). Si no, muestra error.
    req.quiz.destroy().then( function() {
        res.redirect('/quizes');
    }).catch(function (error) {next(error)});
}
/*
     Estas eran las rutas antes del módulo 7, punto Quiz:9 Lista de preguntas
// GET /quizes/question
exports.question = function(req, res) {
    models.Quiz.findAll().then(function(quiz) {
        res.render('quizes/question', {pregunta: quiz[0].pregunta})
    })
};

// GET /quizes/answer
exports.answer = function(req, res) {
    models.Quiz.findAll().then(function(quiz) {
	if (req.query.respuesta.toUpperCase() === quiz[0].respuesta.toUpperCase()) {
		res.render('quizes/answer', {respuesta: 'Correcto'});
	} else {
		res.render('quizes/answer', {respuesta: 'Incorrecto'});
	}
 })
};
*/

/*
    VERSIÓN SIMPLE SIN BASE DE DATOS
// GET /quizes/question
exports.question = function(req, res) {
	res.render('quizes/question', {pregunta: 'Capital de Italia'});
};

// GET /quizes/answer
exports.answer = function(req, res) {
	if(req.query.respuesta.toUpperCase() === 'ROMA'){
		res.render('quizes/answer', {respuesta: 'Correcto'});
	} else {
		res.render('quizes/answer', {respuesta: 'Incorrecto'});
	}
};
*/