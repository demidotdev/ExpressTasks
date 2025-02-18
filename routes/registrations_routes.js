// Archivo que contiene las rutas de la API para los registros
const express = require('express')

let RegistrationsController = require('../controllers/registrations')

let router = express.Router();

// Ruta para mostrar el formulario de registro
router.get('/signup', RegistrationsController.new) 

// Ruta a la que redirecciona una vez creado el usuario
router.route('/users').post(RegistrationsController.create)

module.exports = router