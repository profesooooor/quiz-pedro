// controllers/comment_controller.js

var models = require('../models/models.js');    // La extensión .js es opcional ponerla

// Autoload :id de comentarios
exports.load = function (req, res, next, commentId) {
    models.Comment.findOne({ where: { id: Number(commentId)} } ) // Ver en quiz_controller.js justificación de findOne.
    .then(function(comment) {
        if (comment) {
            req.comment = comment;
            next();
        } else { next(new Error('No existe commentId = ' + commentId))}
    }
    ).catch(function(error) { next(error) });
}

// GET /quizes/:quizId/comments/new
exports.new = function(req, res) {
    // Construir objeto Quiz válido que el usuario editará:
    res.render('comments/new', {quizid: req.params.quizId, errors: []});
}

// POST /quizes/:quizId/comments
exports.create = function (req, res) {
    var comment = models.Comment.build ( 
        {texto: req.body.comment.texto, 
        QuizId: req.params.quizId           // quizId está cogido de la ruta definida en index.js
        } );
    comment
    .validate()         // Comprobar reglas de la BD que hemos puesto en models/comment.js
    .then(
        function(err) {
            if (err) {
                res.render('comments/new', {comment: comment, quizId: req.params.quizId, errors: err.errors});
            } else {
                comment
                // Guarda en la BD (save) y salta a la vista de esa pregunta
                .save()
                .then(function() { res.redirect('/quizes/'+req.params.quizId); })
            }
        }
    ).catch(function(error){next(error)});
}

// GET /quizes/:quidIz/comments/:commentId/publish
exports.publish = function (req, res) {
    console.log("publicando.........................................");
    req.comment.publicado = true;
    req.comment.save( { fields: ["publicado"] } )
      .then ( function () { res.redirect('/quizes/'+req.params.quizId) } )
      .catch( function (error) { next(error)});
}