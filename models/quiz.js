// models/quiz.js
// Definición del modelo de datos de Quiz

module.exports = function(sequelize, DataTypes) {
    // Definimos la tabla 'Quiz'.
    // Utilizamos la regla de validación notEmpty. Para más reglas, ver pg 11 del PDF del módulo 8
    return sequelize.define(
        'Quiz', {
            pregunta: {
                type: DataTypes.STRING,
                validate: {notEmpty: {msg: "-> Falta Pregunta"}}},
            respuesta: {
                type: DataTypes.STRING,
                    validate: {notEmpty: {msg: "-> Falta Respuesta"}}},
            tema: {
                type: DataTypes.STRING,
                validate: {
                    notEmpty: {msg: "-> Falta tema"},
                    //values: {['otro','humanidades','ciencia','tecnologia']}
                    }
                }
            }
        );
}