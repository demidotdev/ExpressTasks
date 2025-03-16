// Archivos para manejar las rutas en la URL
import { Router } from "express";
import {
  index,
  create,
  newTask,
  edit,
  show,
  update,
  destroy,
} from "../controllers/tasks"; // Importamos el controlador

let router = Router();

router
  .route("/tasks")
  .get(
    // Ruta para obtener todas las tareas
    index // Método del controlador
  )
  .post(create); // Ruta para crear una tarea nueva

router.get("/tasks/new", newTask); // Ruta para mostrar el formulario de creación
router.get("/tasks/:id/edit", edit); //Ruta para editar una tarea

router
  .route("/tasks/:id") // Opciones para una tarea específica
  .get(show)
  .put(update)
  .delete(destroy);

export default router;
