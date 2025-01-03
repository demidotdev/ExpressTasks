const express = require('express')

let CategoriesController = require('../controllers/categories')

let router = express.Router();

router.route('/categories')
.get(CategoriesController.index)
.post(CategoriesController.create)

router.get('/categories/new', CategoriesController.new)
router.get('/categories/:id/edit', CategoriesController.edit)
router.get('/categories/:id', CategoriesController.show).put('/categories/:id', CategoriesController.update).delete('/categories/:id', CategoriesController.destroy)

module.exports = router