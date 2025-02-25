const express = require("express"); // Para crear el servidor
const bodyParser = require("body-parser"); //Para extraer la data del "body"
const { Sequelize } = require("sequelize"); // Para manejar la base de datos
const overrideMethod = require("method-override"); //Para poder usar los verbos PUT y DELETE
const session = require("express-session"); //Para manejar las sesiones, como el login

const socketio = require("socket.io"); //Para manejar las conexiones en tiempo real

const app = express();

const tasksRoutes = require("./routes/tasks_routes"); //Para manejar las rutas
const registrationsRoutes = require("./routes/registrations_routes"); // Para manejar las rutas de registro de nuevos usuarios
const sessionsRoutes = require("./routes/sessions_routes"); // Para manejar las rutas de las sesiones (usuarios loggeados)
const categoriesRoutes = require("./routes/categories_routes"); // Para manejar las rutas de las categorias
const findUserMiddleware = require("./middlewares/find_user"); // Para mostrar el ususario loggeado en el home
const authUserMiddeleware = require("./middlewares/auth_user");

//El método "use" inserta un nuevo Middleware en el stack.
app.use(bodyParser.urlencoded({ extended: true })); // Para tomar la data del body ya formateada

app.use(overrideMethod("_method")); // Para poder usar los verbos PUT, PATCH,  DELETE

app.set("view engine", "pug"); //Para integrar nuestro motor de vistas con nuestro servidor

let sessionConfig = {
  // Middleware de manejo de sesiones
  secret: ["98rgj9gamámgpdfog65477865km", "12412mjp9oiupm34535mlnhfvswtfrhj"],
  resave: false, // Indica si se debe reescribir la sesión que aún no ha cambiado
  saveUninitialized: false, // Indica si se debe guardar una sesión sin contenido al ser inicializada
};

if (process.env.NODE_ENV && process.env.NODE_ENV === "production") {
  sessionConfig["store"] = new (require("connect-pg-simple")(session))(); // Para guardar las sesiones en la base de datos
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

let server = app.listen(process.env.NODE_ENV || 8080); //Asignamos la escucha del puerto a una variable para poder implementarlo en las sockets

// Sección de manejo de sockets "realtime"
let io = socketio(server);
let sockets = {};

let usersCount = 0;

io.on("connection", function (socket) {
  let userId = socket.request._query.loggeduser;
  if (userId) sockets[userId] = socket; // si hay un usuario loggeado lo guardamos en sockets
  console.log(socket.id);

  //Actualiza usuarios en tiempo real
  usersCount++;

  // Enviamos la data de los usuarios conectados (es decir , al cliente)
  io.emit("count_updated", { count: usersCount }); // el 1er argumento es un identificador, el segundo la data

  //Envia la data de una nueva tarea al servidor de sockets
  socket.on("new_task", function (data) {
    if (data.userId) {
      let userSocket = sockets[data.userId];
      if (!userSocket) return; // Si no hay data, retorna vacío

      userSocket.emit("new_task", data);
    }
  });

  socket.on("disconnect", function () {
    Object.keys(sockets).forEach((userId) => {
      // Para cerrar sesiones en tiempo real

      if (sockets[userId] === socket) delete sockets[userId];
      //la forma sugerida por Codeium //Funciona mejor!!

      /*
      // la forma vista en el curso, desconecta el server
      let s = sockets[userId]; 
     if(s.id == socket.id) sockets[userId] = null;
      */
      console.log(sockets);
    });

    usersCount--;
    io.emit("count_updated", { count: usersCount });
  });
});
