const Category = require("../models").Category;

module.exports = {
    create: function (req, res) {
        Category.create({ //creo nuevas categorias en la tabla "Categories"
            title: req.body.title,
            color: req.body.color,
        })
            .then((result) => {//Promesa devuelve resultado en formato json
                res.json(result);
            })
            .catch((err) => { // en caso de error
                console.log(err);
                res.json(err);
            });
    },
    new: function (req, res) { //creando nueva categoría en la vista
        res.render("categories/new");
    },
    index: function (req, res) {// Muestra todas las categorías
        Category.findAll().then(function (categories) {
            res.render("categories/index", { categories: categories });
        });
    },
    show: function (req, res) {// Muestra una sola categoría, la recién creada
        Category.findByPk(req.params.id).then(function (category) {
            res.render("categories/show", { category: category });
        });
    },
    edit: function (req, res) { // Para editar las categorias desde la vista
        Category.findByPk(req.params.id).then(function (category) {
            res.render("categories/edit", { category: category });
        });
    },
    update: function (req, res) {
        Category.update({ // Actualiza las categorias, la recién editada
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
    destroy: function (req, res) { // Elimina las categorias
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
