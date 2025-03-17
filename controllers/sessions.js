import User from "../models/user.js";

export function newSession(req, res) {
    res.render("sessions/newSession");
}
export function create(req, res) {
    User.login(req.body.email, req.body.password)
        .then((user) => {
            if (user) {
                req.session.userId = user.id; // guardamos el id del usuario en la sesion
            }
            res.json(user);
        })
        .catch((err) => {
            console.log(err);
            res.json(err);
        });
}
export function destroy(req, res) {
    req.session.destroy(function () {
        res.redirect("/sessions");
    });
}
