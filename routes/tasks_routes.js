const express = require('express')
let TasksController = require('../controllers/tasks')

let router = express.Router();

// Ennruto desde la URL hacia "/tasks", si bien puede llamarse como yo quiera, es comun que se llame
// segun la tarea que realizará en forma plural, por eso "tasks" y no "task"
router.route('/tasks').get(
    TasksController.index
    // function(req, res){res.send('Hola mundo desde una subruta')} se comenta para ser reemplazada
    // por "TasksController.index"
).post(TasksController.create)

router.get('/tasks/new', TasksController.new)
// colocamos "/tasks/new" arriba del wildcard "/tasks/:id" ya que este matchea con todo lo que vaya despues 
// "/tastks/" por lo que si estuviese abajo, el "/new" sería manejado por la función que maneja el wildcard

// 
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