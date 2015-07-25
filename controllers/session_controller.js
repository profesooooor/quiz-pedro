// controllers/session_controller.js
// req.session.inicio() lo estoy metiendo para controlar el tiempo de sesión para el ejercicio P2P

exports.loginRequired = function(req, res, next) {
    if (req.session.user) {
        var t0, t1;
        t0 = req.session.inicio;
        t1 = new Date();
        t1 = t1.getHours() * 3600 + t1.getMinutes() * 60 + t1.getSeconds();
        console.log("Desde la última acción estos segundos han transcurrido: "+(t1-t0));
        if (t1-t0<120) {
            // Iniciamos de nuevo el cronómetro
            var t;
            t = new Date();
            req.session.inicio = req.session.inicio = t.getHours() * 3600 + t.getMinutes() * 60 + t.getSeconds();
            next();
        } else {
            console.log('Sesión inactiva durante más de 2 minutos - se cierra automáticamente');
            res.redirect('/login');
        }
    } else {
        res.redirect('/login');
    }
}

// GET /login   Formulario de login
exports.new = function(req, res) {
    var errors = req.session.errors || {};
    req.session.errors = {};   
    res.render('sessions/new', {errors: errors});
};

// POST /login  Abrir la sesión
exports.create = function(req, res) {
    var login = req.body.login;
    var password = req.body.password;
    var userController = require('./user_controller');
    userController.autenticar(login, password, function(error, user) {
        if (error) {
            // si hay error retornamos mensajes de error de sesión
            req.session.errors = [{"message": 'Se ha producido un error: '+error}];
            res.redirect("/login");
            return;
        }
        // Crear req.session.user y guardar campos id y username
        // La sesión se define por la existencia de: req.session.user
        var t;
        req.session.user = {id:user.id, username:user.username};
        t = new Date();
        req.session.inicio = t.getHours() * 3600 + t.getMinutes() * 60 + t.getSeconds();
        res.redirect(req.session.redir.toString()); // Redirección a path anterior a login (guardado en app.js)
    });
};

// DELETE /logout   Cerrar la sesión
exports.destroy = function(req, res) {
    delete req.session.user;
    res.redirect(req.session.redir.toString()); // Redirección a path anterior a login (guardado en app.js)
}