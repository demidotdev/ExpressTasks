// Archivo que contiene las rutas de la API para los registros
import { Router } from "express";

import { newUser, create } from "../controllers/registrations.js";

let router = Router();

// Ruta para mostrar el formulario de registro
router.get("/signup", newUser);

// Ruta a la que redirecciona una vez creado el usuario
router.route("/users").post(create);

export default router;
