export default (req, res, next) => {
  // Middleware para verificar si el usuario está loggeado
  if (!req.originalUrl.includes("tasks")) return next(); // Si la URL no incluye "tasks" no se ejecuta el middleware
  if (req.session.userId) return next(); // Si el usuario está loggeado, se ejecuta el siguiente middleware

  res.redirect("/sessions");
};
