// Archivo que contiene las rutas de la API para las categorías
const express = require('express')

let CategoriesController = require('../controllers/categories')

let router = express.Router();

router.route('/categories') // Opciones para obtener todas las categorías y crear una nueva
.get(CategoriesController.index)
.post(CategoriesController.create)

// Rutas para mostrar el formulario de creación y edición de categorías
router.get('/categories/new', CategoriesController.new)
router.get('/categories/:id/edit', CategoriesController.edit)
// Para mostrar, actualizar y eliminar una categoría
router.get('/categories/:id', CategoriesController.show).put('/categories/:id', CategoriesController.update).delete('/categories/:id', CategoriesController.destroy)

module.exports = router