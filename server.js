"use strict";
import express from "express"; // Para crear el servidor
import bodyParser from "body-parser"; //Para extraer la data del "body"
//const { Sequelize } = require("sequelize"); // Para manejar la base de datos
import overrideMethod from "method-override"; //Para poder usar los verbos PUT y DELETE
import session from "express-session"; //Para manejar las sesiones, como el login
import pg from "pg";
import connectPgSimple from "connect-pg-simple";

import { Server } from "socket.io"; //Para manejar las conexiones en tiempo real

import tasksRoutes from "./routes/tasks_routes.js"; //Para manejar las rutas
import registrationsRoutes from "./routes/registrations_routes.js"; // Para manejar las rutas de registro de nuevos usuarios
import sessionsRoutes from "./routes/sessions_routes.js"; // Para manejar las rutas de las sesiones (usuarios loggeados)
import categoriesRoutes from "./routes/categories_routes.js"; // Para manejar las rutas de las categorias
import findUserMiddleware from "./middlewares/find_user.js"; // Para mostrar el ususario loggeado en el home
import authUserMiddeleware from "./middlewares/auth_user.js";

import dotenv from "dotenv";
dotenv.config();

console.log(
  "La database url es " +
    process.env.DATABASE_URL +
    " y el puerto  es " +
    process.env.PGPORT +
    " el entorno es " +
    process.env.NODE_ENV +
    " y el host es " +
    process.env.PGHOST
);

const { Pool } = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

const app = express();

let urlencoded = bodyParser.urlencoded;

const port = process.env.PGPORT || 8080; //Para manejar el puerto en el que se ejecutará el servidor

//El método "use" inserta un nuevo Middleware en el stack.
app.use(urlencoded({ extended: true })); // Para tomar la data del body ya formateada

app.use(overrideMethod("_method")); // Para poder usar los verbos PUT, PATCH,  DELETE

app.set("view engine", "pug"); //Para integrar nuestro motor de vistas con nuestro servidor

let sessionConfig = {
  // Middleware de manejo de sesiones
  secret: ["98rgj9gamámgpdfog65477865km", "12412mjp9oiupm34535mlnhfvswtfrhj"],
  resave: false, // Indica si se debe reescribir la sesión que aún no ha cambiado
  saveUninitialized: false, // Indica si se debe guardar una sesión sin contenido al ser inicializada
  pool: Pool,
  cookie: {
    secure: true,
    maxAge: 30 * 24 * 60 * 60 * 1000,
  },
};

if (process.env.NODE_ENV && process.env.NODE_ENV === "production") {
  sessionConfig["store"] = new (connectPgSimple(session))(); // Para guardar las sesiones en la base de datos
}
app.use(session(sessionConfig));

/* Se insertan nuestros middlewares despues del middleware de sesiones debemos esperar a que las sesiones sean leídas, 
y recordemos que JS lee de izquierda a derecha, de arriba hacia abajo, y es en tal orden que se va interpretando el código JS,
más allá del efecto de Hoisting.*/
app.use(findUserMiddleware);
app.use(authUserMiddeleware);

//Implementamos nuestras rutas
app.use(tasksRoutes);
app.use(registrationsRoutes);
app.use(sessionsRoutes);
app.use(categoriesRoutes);

/*Implementamos el render de nuestra vista "home" ya que en la carpeta "routes" solo se renderizan las vistas de "tasks", 
"sessions", "registrations" y "categories" */
app.get("/", function (req, res) {
  res.render("home", {
    user: req.user,
  });
});

let server = app.listen(port || 8080, () => {
  console.log(`Server is running on port ${port}`);
}); //Asignamos la escucha del puerto a una variable para poder implementarlo en las Serversockets

// Sección de manejo de Serversockets "realtime"
let io = new Server(server);
let Serversockets = {};

let usersCount = 0;

io.on("connection", function (socket) {
  let userId = socket.request._query.loggeduser;
  if (userId) Serversockets[userId] = socket; // si hay un usuario loggeado lo guardamos en Serversockets
  console.log(socket.id);

  //Actualiza usuarios en tiempo real
  usersCount++;

  // Enviamos la data de los usuarios conectados (es decir , al cliente)
  io.emit("count_updated", { count: usersCount }); // el 1er argumento es un identificador, el segundo la data

  //Envia la data de una nueva tarea al servidor de Serversockets
  socket.on("new_task", function (data) {
    if (data.userId) {
      let userSocket = Serversockets[data.userId];
      if (!userSocket) return; // Si no hay data, retorna vacío

      userSocket.emit("new_task", data);
    }
  });

  socket.on("disconnect", function () {
    Object.keys(Serversockets).forEach((userId) => {
      // Para cerrar sesiones en tiempo real

      if (Serversockets[userId] === socket) delete Serversockets[userId];
      //la forma sugerida por Codeium //Funciona mejor!!

      /*
      // la forma vista en el curso, desconecta el server
      let s = Serversockets[userId]; 
    if(s.id == socket.id) Serversockets[userId] = null;
      console.log(Serversockets);
      */
    });

    usersCount--;
    io.emit("count_updated", { count: usersCount });
  });
});
