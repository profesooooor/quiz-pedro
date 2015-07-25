//  routes/index.js

var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');         // quiz_controller.js
var commentController = require('../controllers/comment_controller');
var sessionController = require('../controllers/session_controller');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Quiz', errors: [] });
});

// Autoload de comandos con :quizId (se ejecuta cuando la ruta contiene :quizId; ídem commentId)
router.param('quizId',                     quizController.load);
router.param('commentId',                  commentController.load);

// Definición de rutas de sesión
router.get('/login',                       sessionController.new);  // Formulario login
router.post('/login',                      sessionController.create);// Abrir la sesión
router.get('/logout',                      sessionController.destroy);// Cerrar la sesión

// Definición de rutas de /quizes
// Hay dos que parecen iguales (show y update) pero no lo son porque una es get y la otra put
router.get('/quizes',                      quizController.index);   // Esto incluye /quizes?search
router.get('/quizes/:quizId(\\d+)',        quizController.show);    // Muestra una pregunta y pide respuesta
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);  // Comprueba respuesta y dice correcto/incorrecto
router.get('/quizes/new',                  sessionController.loginRequired, quizController.new);     // Pide pregunta/respuesta al usuario para añadirla
router.post('/quizes/create',              sessionController.loginRequired, quizController.create);  // Guarda en bd lo que se pidió en new
router.get('/quizes/:quizId(\\d+)/edit',   sessionController.loginRequired, quizController.edit);    // Pide pregunta/respuesta a usuario para modificarla
router.put('/quizes/:quizId(\\d+)',        sessionController.loginRequired, quizController.update);  // Guarda en bd lo que se modificó en edit
router.delete('/quizes/:quizId(\\d+)',     sessionController.loginRequired, quizController.destroy); // Elimina de la bd lo que el usuario ha pedido

// Definición de rutas de comentarios
router.get('/quizes/:quizId(\\d+)/comments/new',    commentController.new);     // Pide comentario al usuario para añadirlo
router.post('/quizes/:quizId(\\d+)/comments',       commentController.create);  // Guarda en bd lo que se pidió en new
router.get('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish',
                                                    sessionController.loginRequired,
                                                    commentController.publish);


/*
     Estas eran las rutas antes del módulo 7, punto Quiz:9 Lista de preguntas
router.get('/quizes/question', quizController.question);
router.get('/quizes/answer', quizController.answer);
*/


/* Ruta de créditos, que se añadió en el ejercicio P2P del módulo 6 */
router.get('/author', function(req, res) {
    res.render('author');
});

module.exports = router;