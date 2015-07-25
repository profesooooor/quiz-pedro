// controllers/user_controller.js


var users = { admin: {id:1, username:"admin", password:"1234"},
               pepe: {id:2, username:"pepe",  password:"5678"}
            };
            
// Comprueba si el usuario está registrado en users
// Si autenticación falla o hay errores se ejecuta callback(error)
exports.autenticar = function(login, password, callback) {
    if (users[login]) {
        if (password === users[login].password) {
            callback(null, users[login]);
        }
        else { callback(new Error('Usuario o contraseña no válida')); } // Es la contraseña pero no hay que dar pistas
    } else { callback(new Error('Usuario o contraseña no válida'));}    // Es el usuario pero no hay que dar pistas
};