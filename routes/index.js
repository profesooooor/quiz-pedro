//  routes/index.js

var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Quiz' });
});

// Autoload de comandos con :quizId (se ejecuta cuando la ruta contiene :quizId)
router.param('quizId',                     quizController.load);    // autoload :quizId

// Definición de rutas de /quizes
router.get('/quizes',                      quizController.index);   // Esto incluye /quizes?search
router.get('/quizes/:quizId(\\d+)',        quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);

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
