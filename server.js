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

app.use(bodyParser.urlencoded({ extended: true })); // Para tomar la data del body ya formateada

app.use(overrideMethod("_method"));

app.set("view engine", "pug");//Para integrar nuestro motor de vistas con nuestro servidor

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

      let s = sockets[userId];
      if(s.id == socket.id) sockets[userId] = null;
    })
    console.log(sockets);


    usersCount--;
    io.emit('count_updated', {count: usersCount});
  })
});
//const client = require('./realtime/client');