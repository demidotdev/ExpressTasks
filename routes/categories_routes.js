// Archivo que contiene las rutas de la API para las categorías
import { Router } from "express";

import {
  index,
  create,
  newCategory,
  edit,
  show,
  update,
  destroy,
} from "../controllers/categories";

let router = Router();

router
  .route("/categories") // Opciones para obtener todas las categorías y crear una nueva
  .get(index)
  .post(create);

// Rutas para mostrar el formulario de creación y edición de categorías
router.get("/categories/new", newCategory);
router.get("/categories/:id/edit", edit);
// Para mostrar, actualizar y eliminar una categoría
router
  .get("/categories/:id", show)
  .put("/categories/:id", update)
  .delete("/categories/:id", destroy);

export default router;
