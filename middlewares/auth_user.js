module.exports = (req, res, next) => {
    if(!req.originalUrl.includes("tasks")) return next();
    if(req.session.userId) return next();

    res.redirect("/sessions")
}