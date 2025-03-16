//Archivo que contiene las rutas de la API para las sesiones
import { Router } from "express";

import { newSession, create, destroy } from "../controllers/sessions.js";

let router = Router();

router
  .route("/sessions") // Opciones para crear y destruir una sesión
  .get(newSession)
  .post(create)
  .delete(destroy);

export default router;
