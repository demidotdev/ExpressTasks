const User = require("../models").User;

module.exports = (req, res, next) => {
    if (!req.session.userId) return next(); //Se introduce esta linea
    // fuera de la respuesta asincrona para que no se ejecute la promesa 
    //si no se ha iniciado sesión.
    User.findByPk(req.session.userId, { include: [
        {
        association: "tasks" // Eager Loading
        }
    ] }).then(user => {
            if (user) {
                req.user = user;
                next();
            }
        })
        
    };