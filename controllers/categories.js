const Category = require("../models").Category;

module.exports = {
    create: function (req, res) {
        Category.create({
            title: req.body.title,
            color: req.body.color,
        })
            .then((result) => {
                res.json(result);
            })
            .catch((err) => {
                console.log(err);
                res.json(err);
            });
    },
    new: function (req, res) {
        res.render("categories/new");
    },
    index: function (req, res) {
        Category.findAll().then(function (categories) {
            res.render("categories/index", { categories: categories });
        });
    },
    show: function (req, res) {
        Category.findByPk(req.params.id).then(function (category) {
            res.render("categories/show", { category: category });
        });
    },
    edit: function (req, res) {
        Category.findByPk(req.params.id).then(function (category) {
            res.render("categories/edit", { category: category });
        });
    },
    update: function (req, res) {
        Category.update({
            title: req.body.title,
            color: req.body.color,
            },{where: {id: req.params.id}
            }).then((result) => {
                res.redirect(`/categories/${req.params.id}`);
            })
            .catch((err) => {
                console.log(err);
                res.json(err);
            });
    },
    destroy: function (req, res) {
        Category.destroy({
            where: { id: req.params.id }
        }).then((contadorElementosEliminados) => {
                res.redirect("/categories");
            }).catch((err) => {
                console.log(err);
                res.json(err);
            });
    },
};
