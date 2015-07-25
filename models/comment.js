// models/comment.js
// Tabla "Comment" con los comentarios a las preguntas

module.exports = function(sequelize, DataTypes) {
    return sequelize.define(
        // No se indican los campos "Id", "createdAt", "updatedAt" porque los pone automáticamente
        // No se indica la clave externa "QuizId" porque se declara en models.js
        'Comment', {
            texto: {
                type: DataTypes.STRING,
                validate: {notEmpty: {msg: "-> Falta Comentario"}}
            },
            publicado: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            }
        }
    );
}