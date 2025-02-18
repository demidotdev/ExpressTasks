// Archivos para manejar las rutas en la URL
const express = require('express')
let TasksController = require('../controllers/tasks') // Importamos el controlador

let router = express.Router();


router.route('/tasks').get(// Ruta para obtener todas las tareas
    TasksController.index // Método del controlador
).post(TasksController.create) // Ruta para crear una tarea nueva

router.get('/tasks/new', TasksController.new) // Ruta para mostrar el formulario de creación
router.get('/tasks/:id/edit', TasksController.edit) //Ruta para editar una tarea

router.route('/tasks/:id') // Opciones para una tarea específica
.get(TasksController.show)
.put(TasksController.update)
.delete(TasksController.destroy)

module.exports = router