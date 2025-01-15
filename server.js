const express = require("express");
// const sqlite3  = require('sqlite3')
//nuestro Driver de conexion. Con "sqlite3" la conexión se abre automaticamente al crear un obj de contrl,
// no hace falta abrir una, nueva conexion con la base de datos y luego cerrarla como en otros lenguajes de base de datos
const bodyParser = require("body-parser"); //PAra extraer la data del "body"
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

// se comenta porque se usa tasksRoutes const tasks = require("./controllers/tasks"); //importamos nuestro controlador

app.use(bodyParser.urlencoded({ extended: true })); // Para tomar la data del body ya formateada

// const db = new sqlite3.Database(':memory') //":memory" crea una base de datos anónima en la RAM que se elimina cuando se cierra el programa,
// no es un comportamiento que quisieramos para nuestra DB, pero serviria para pruebas iniciales.

// Sustituimos la siguiente linea de código para usar el ORM "sequelize"
// const db = new sqlite3.Database('proyecto-backend')

/**
 * @object Este es nuestro objeto de conexion a la base de datos
 * @params Nombre de la base
 * @params Usuario
 * @params Contraseña
 * @tip Recordar que solo debemos conectarnos 1 sola vez a la base de datos, c/vez que instanciamos este objeto
 * generamos una nueva conexion a la DB, es por eso que el objeto "sequelize" tiene un metodo "import" 
 * que nos permite importar la data que le pasemos desde un archivo diferente. 
 * Para que nuestro modelo pueda ser importado por el método "import", tiene que exportar una funcion que reciba
 * 2 paramtros, 1º el objeto conectado a la DB y 2º la clase "DataTypes" (ver ./models/task.j) 
 * 
 * Comentamos esta instancia del objeto "Sequelize" porque este lo hace por si solo utilizando el "require" dentro 
 * de "./models/index.js" importara todo lo que se exporte en nuestros modelos  
const sequelize = new Sequelize("proyecto-backend", null, null, {
  dialect: "sqlite", //Nuestro motor de DB
  storage: "./proyecto-backend", //La ruta al archivo en el que sew almacenara la DB
});
*/

// Comentamos las siguientes lineas de código para usar el ORM "sequelize"
// db.run('CREATE TABLE tasks(id int AUTO_INCREMENT, description varchar(255))')
// db.close
app.use(overrideMethod("_method"));

//Para integrar nuestro motor de vistas con nuestro servidor debemos indicarle a nuestro objeto "app" que utilize
// al motor instalado, que en este caso es "pug"

app.set("view engine", "pug");
//Recordar que las "views" deben ir en nuestra carpeta "views"

// se comenta porque se usa tasksRoutes app.get("/tasks", tasks.home); //Creamos la ruta que renderiza nuestro controlador arriba importado

/*
// se comenta porque se usa tasksRoutes app.post("/pendientes", function (req, res) {
  // db.run("INSERT INTO tasks(description) VALUES('${req.body.description}')")

  Haciendo esto exponemos nuestra aplicación a toda clase de ataque del tipo "SQL injection" ya que le pasamos los parametros y luego no son limpiados. 
  Los ataques de inyección de SQL ocurren cuando no limpiamos los parametros que enviamos a una consulta. 
  Para evitarlo los Drivers que usamos para conectar un lenguaje con un motor de base de datos, tienen la funcionalidad e hacer un proceso llamado "sanitizer", 
  este proceso se aplica sobre los datos que el usuario nos haya enviado y evita que se ejecute como codigo SQL, mas bien se termina interpretando como un string comun.
  Nunca debemos insertar datos del usuarios en una inserción SQL de ningun tipo, inserción, consulta, actualización, etc. sin antes haber limpiado la información,
  tocaria investigar como hacer esta limpieza en drivers de otros mototores de bases de datos.

  
  

  // Para evitar lo anterior:
  db.run(`INSERT INTO tasks(description) VALUES(?)`, req.body.description ) 

  lo que ibamos a mandar como parametros de consulta dentro de VALUES() lo pasamos como siguiente argumento 
  separado por coma ",", y sustituimos este dentro de "VALUES()" con un signo de interrogación "?", 
  de esta forma el driver limpia la data antes de pasarla. El método "run" ira reemplanzando uno a uno, 
  de primero a último, cada uno de los signos de interrogacion por cada argumento que hayamos mandado como extra 
  al método "run", por lo que admite una tantos signos de interrogación como necesitemos, de acuerdo a la 
  cantidad de argumentos pasados en la consulta
  

  db.run("INSERT INTO tasks(description) VALUES('Hola Mundo')")

  Si no se especifican una descripción, actualizara todos los valores de la tabla
  Se asignan los campos justos despues del nombre de la tabla, entre paréntesis y separadados por ',', en este caso solo le pasamos "descriptions"
  seguguido de "VALUES()rr"

  // Todo esto lo comento porque como ahora pasamos a usar un ORM, no es necesario hacer esta parte

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

let usersCount = 0;

io.on('connection', function(socket){
  usersCount++;

  io.emit('count_updated', {count: usersCount});

  socket.on('disconnect', function(){
    usersCount--;
    io.emit('count_updated', {count: usersCount});
  })
});


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