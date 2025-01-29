const express = require('express')
let TasksController = require('../controllers/tasks')

let router = express.Router();


router.route('/tasks').get(
    TasksController.index
).post(TasksController.create)

router.get('/tasks/new', TasksController.new)

router.get('/tasks/:id/edit', TasksController.edit)

router.route('/tasks/:id')
.get(TasksController.show)
.put(TasksController.update)
.delete(TasksController.destroy)
// se utiliza el "wildcard" ":id" que traducido sería algo así como un "comodin"
// esto permite todo lo que se coloque desde la URL despues de "/tasks/...." será manejado por esta función.
// Esta funcion ira sustituyendo en el lugar del wildcard el identificador único del recurso al que queremos 
// acceder en nuestra DB

module.exports = router