import User from "../models/user.js";

export function newUser(req, res) {
    res.render("registrations/new");
}
export function create(req, res) {
    try {
        const email = req.body.email;
        const password = req.body.password;

        if (!email || !password) {
            return res
                .status(400)
                .json({ error: "Email and password are required." });
        }

        const data = { email, password };

        User.create(data)
            .then((result) => {
                res.json(result);
            })
            .catch((err) => {
                console.error("Error creating user:", err);
                res.status(500).json({ error: "Internal server error." });
            });
    } catch (err) {
        console.error("Unexpected error:", err);
        res.status(500).json({ error: "Unexpected server error." });
    }
}
