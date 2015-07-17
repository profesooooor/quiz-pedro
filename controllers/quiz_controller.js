// controllers/quiz_controller.js

var models = require('../models/models.js');

// Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
    // models.Quiz.find(quizId).then(               -- no funciona en la versión actual de sequelize
    //models.Quiz.findOne().then (                  // funciona pero siempre devuelve la primera
    models.Quiz.findById(quizId). then (
    // models.Quiz.findAll({ where: {id: {eq: quizId} } })
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
exports.index = function(req, res) {
    models.Quiz.findAll().then(function(quizes) {
        res.render('quizes/index', {quizes: quizes});
    }).catch(function(error) { next(error);});
};

// GET /quizes/:quizId
// Mostramos la pregunta escogida y pedimos la respuesta. Utilizamos quizes/show.jade
exports.show = function(req, res) {
    console.log("models/models.js exports.show() Ahora req.params.quizId vale...",req.params.quizId);
    res.render('quizes/show', { quiz: req.quiz});
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
    res.render('quizes/answer', {quiz:req.quiz, respuesta:resultado});
};


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