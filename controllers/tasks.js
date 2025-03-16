const Task = require("../models").default.Task;

// Creamos nuestras funciones manejadoras:
// "index" para mostrar la "view" de inicio,
// "show" para mostrar los recursos consultados en el servidor,
// "create" para crear un nuevo recurso,
// "new" para crear una nueva instancia de un recurso,
// "view" donde se muestra el recurso creado,
// "edit" para que se muestre la "view" donde editaremos,
// "update" para actualizar un recurso y
// "destroy" para eliminar un recurso.
export function index(req, res) {
    Task.findAll().then((tasks) => {
        // con "req.user.tasks" renderizamos únicamente las tareas que le pertenecen al usuario logeado
        res.render("tasks/index", { tasks: req.user.tasks });
    });
}
export function show(req, res) {
    Task.findByPk(req.params.id, {
        include: ["user", "categories"],
    }).then(function (task) {
        res.render("tasks/show", { task }); // "shorthand property sintax"
    });
}
export function edit(req, res) {
    Task.findByPk(req.params.id).then(function (task) {
        res.render("tasks/edit", { task });
    });
}
export function destroy(req, res) {
    Task.destroy({
        where: {
            id: req.params.id,
        },
    })
        .then((contadorElementosEliminados) => {
            res.redirect("/tasks");
        })
        .catch((err) => {
            console.log(err);
            res.json(err);
        });
}
export function create(req, res) {
    Task.create({
        description: req.body.description, // Le pasamos el "description" del formulario
        userId: req.user.id, // Le pasamos el id del usuario logeado
    })
        .then((result) => {
            res.json(result);
        })
        .catch((err) => {
            console.log(err);
            res.json(err);
        });
}
export function update(req, res) {
    Task.findByPk(req.params.id).then((task) => {
        task.description = req.body.description;
        task.save().then(() => {
            let categoriesIds = req.body.categories.split(","); // "1,5,4" => [1, 5, 4]

            task.addCategories(categoriesIds).then(() => {
                res.redirect(`/tasks/${task.id}`);
            });
        });
    });
}
export function newTask(req, res) {
    res.render("tasks/new");
}
