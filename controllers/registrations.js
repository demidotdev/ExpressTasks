const User = require("../models").default.User;

export function newUser(req, res) {
    res.render("registrations/new");
}
export function create(req, res) {
    let data = {
        email: req.body.email,
        password: req.body.password,
    };
    User.create(data)
        .then((result) => {
            res.json(result);
        })
        .catch((err) => {
            console.log(err);
            res.json(err);
        });
}
