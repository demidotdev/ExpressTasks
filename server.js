const express = require("express");
const bodyParser = require("body-parser"); //Para extraer la data del "body"
const { Sequelize } = require("sequelize");
const overrideMethod = require("method-override");
const session = require("express-session");

const socketio = require("socket.io");

const app = express();

const tasksRoutes = require('./routes/tasks_routes');
const registrationsRoutes = require('./routes/registrations_routes');
const sessionsRoutes = require("./routes/sessions_routes");
const categoriesRoutes = require("./routes/categories_routes");
const findUserMiddleware = require("./middlewares/find_user");
const authUserMiddeleware = require("./middlewares/auth_user");

//const tasks = require("./controllers/tasks"); //importamos nuestro controlador
//Línea anterior se comenta porque se reemplaza con "tasksRoutes" 

app.use(bodyParser.urlencoded({ extended: true })); // Para tomar la data del body ya formateada

app.use(overrideMethod("_method"));

//Para integrar nuestro motor de vistas con nuestro servidor debemos indicarle a nuestro objeto "app" que utilize
// al motor instalado, que en este caso es "pug"

app.set("view engine", "pug");
//Recordar que las "views" deben ir en nuestra carpeta "views"

// se comenta porque se usa tasksRoutes app.get("/tasks", tasks.home); //Creamos la ruta que renderiza nuestro controlador arriba importado

/*
// se comenta porque se usa tasksRoutes app.post("/pendientes", function (req, res) 

  res.send("Inserción finalizada");
});
*/

app.use(session({ 
  secret: ["98rgj9gamámgpdfog65477865km", "12412mjp9oiupm34535mlnhfvswtfrhj"],
  resave: false,  // Indica si se debe reescribir la sesión que aún no ha cambiado
  saveUninitialized: false // Indica si se debe guardar una sesión sin contenido al ser inicializada
}));

app.use(findUserMiddleware);
app.use(authUserMiddeleware);

app.use(tasksRoutes);
app.use(registrationsRoutes);
app.use(sessionsRoutes);
app.use(categoriesRoutes);

app.get('/', function (req, res) {
  res.render('home', {
  user: req.user})
})

let server = app.listen(3000);

let io = socketio(server);
let sockets = {};

let usersCount = 0;

io.on('connection', function(socket){

  let userId = socket.request._query.loggeduser;
  if(userId) sockets[userId] = socket;
  console.log(sockets);
  

  //Actualiza usuarios en tiempo real
  usersCount++;

  io.emit('count_updated', {count: usersCount});

  socket.on('new_task', function(data){
    if(data.userId){
      let userSocket = sockets[data.userId];
      if(!userSocket) return;

      userSocket.emit('new_task', data)
    }
  })

  socket.on('disconnect', function(){

    

    Object.keys(sockets).forEach(userId=>{
      //if(sockets[userId] === socket) delete sockets[userId];
      //Arriba es la forma sugerida por Codeium

      let s = sockets[userId];
      if(s.id == socket.id) sockets[userId] = null;
    })
    console.log(sockets);


    usersCount--;
    io.emit('count_updated', {count: usersCount});
  })
});
//const client = require('./realtime/client');

/*
Todo esto lo comento porque como ahora pasamos a usar un ORM, no es necesario hacer esta parte

//Queremos lograr que se cierre la conexion cuando el servidor fue finalizado 

process.on('SIGINT', function(){ // Cada ve que ejecutamos nuestro programa, un nuevo proceso del sistema operativo es creado para correr 
  // nuestro programa, este proceso puede recibir mensajes externos como el que recibe cuando presionamos Ctrl + C para cerrar el servidor. Con 
  // el obj "process" podemos escuchar estos mensajes y ejecutar codigo acorde. en este caso escucharemos el mensaje "SIGINT" que es el que envia
  // el proceso cuando presionamos Ctrl + C.

  console.log('Adios - Atte. El servidor') //Probando con un mensaje que indique que se cerró el servidor

  db.close()//Aprovechamos que esta función solo se ejecuta solo cuando el servidor se esta por cerrar y cerraremos la base de datos

  process.exit()//para evitar interrumpir el flujo de cerrar el servidor colocamos esta instruccion la cual permite cerrar el servidor de Node
  // "process.exit" puede ser ejecutada en cualquier parte de nuestro codigo, equivale a Ctrl + C para cerrar el servidor, pero desde el código
})

*/