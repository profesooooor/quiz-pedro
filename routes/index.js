//  routes/index.js

var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Quiz', errors: [] });
});

// Autoload de comandos con :quizId (se ejecuta cuando la ruta contiene :quizId)
router.param('quizId',                     quizController.load);    // autoload :quizId

// Definición de rutas de /quizes
// Hay dos que parecen iguales (show y update) pero no lo son porque una es get y la otra put
router.get('/quizes',                      quizController.index);   // Esto incluye /quizes?search
router.get('/quizes/:quizId(\\d+)',        quizController.show);    // Muestra una pregunta y pide respuesta
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);  // Comprueba respuesta y dice correcto/incorrecto
router.get('/quizes/new',                  quizController.new);     // Pide pregunta/respuesta al usuario para añadirla
router.post('/quizes/create',              quizController.create);  // Guarda en bd lo que se pidió en new
router.get('/quizes/:quizId(\\d+)/edit',   quizController.edit);    // Pide pregunta/respuesta a usuario para modificarla
router.put('/quizes/:quizId(\\d+)',        quizController.update);  // Guarda en bd lo que se modificó en edit
router.delete('/quizes/:quizId(\\d+)',     quizController.destroy); // Elimina de la bd lo que el usuario ha pedido

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