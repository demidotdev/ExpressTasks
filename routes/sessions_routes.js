//Archivo que contiene las rutas de la API para las sesiones
const express = require('express')

let SessionsController = require('../controllers/sessions')

let router = express.Router()

router.route('/sessions') // Opciones para crear y destruir una sesión
.get(SessionsController.new)
.post(SessionsController.create)
.delete(SessionsController.destroy)

module.exports = router