const User = require("../models").User;

module.exports = (req, res, next) => {
    if (!req.session.userId) return next(); 
    User.findByPk(req.session.userId, 
        { include: [
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