const User = require("../models").default.User;

export default (req, res, next) => {
  if (!req.session.userId) return next(); // Si el usuario no está loggeado, se ejecuta el siguiente middleware
  User.findByPk(
    req.session.userId, // pasamos el id del usuario loggeado
    {
      include: [
        // Eager Loading o carga anticipada de datos
        {
          association: "tasks", // Incluimos las tareas del usuario
        },
      ],
    }
  ).then((user) => {
    if (user) {
      req.user = user; // asignamos el usuario al parámetro "user" de la petición
      next(); // ejecutamos el siguiente middleware
    }
  });
};
