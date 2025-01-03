//const { response } = require("express");

const Task = require("../models").Task;

// Creamos nuestras funciones manejadoras "index" para mostrar la "view" de inicio, "show" para mostrar
// los recursos consultados en el servidor, "create" para crear un nuevo recurso, "new" para que se muestre
// la "view" donde crearemos un nuevo recurso, "edit" para que se muestre la "view" donde editaremos, "update" para 
// actualizar un recurso y "destroy" para eliminar un recurso.
module.exports = {
  index: function(req, res){
    Task.findAll().then((tasks)=>{
      res.render('tasks/index', {tasks: req.user.tasks});// agregamos "req.user.tasks" para renderizar únicamente todas las tareas que le pertenecen al usuario logueado
    })
  },

  show: function(req,res){
    // res.send(req.params.id);// en el objeto "params" se guardan los datos de la URL, esto ademas hace que el
    // identificador del "wildcard" ":id" se transforme en una propiedad del objeto "params",
    // por lo que podremos acceder a la propiedad "id" del "params" para hacer la consulta.

    /**
     * Para consultar esta información, "sequelize" expone un metodo llamado "findByPk" (find by param key)
     * que nos permite realizar este tipo de consultas, por lo que podemos invocar el metodo "findByPk"
     * desde nuestro modelo. Este método devuelve una promesa que se resuelve con la informacion que
     * nos interesa
     */

    Task.findByPk(req.params.id, {
      include: [
        'user'
      ]
    }).then(function(task){
    res.render('tasks/show', {task});// Usando "shorthand property sintax"
    })

  },
 edit: function(req, res){
    Task.findByPk(req.params.id).then(function(task){
      res.render('tasks/edit', {task});
    })

  },
  destroy: function(req, res){
    Task.destroy({
      where: {
        id: req.params.id
      }
    }).then(contadorElementosEliminados => {
      res.redirect('/tasks');
      }).catch(err =>{
        console.log(err);
        res.json(err);
    })
  },
  create: function(req, res){
    Task.create({
      description: req.body.description,
      userId: req.user.id
    }).then(result => {
      res.json(result);
      }).catch(err =>{
        console.log(err);
        res.json(err);
    })
  },
  update: function(req, res){
   Task.update({
     description: req.body.description
   }, {
     where: {
       id: req.params.id
     }
   }).then(response => {
     res.redirect(`/tasks/${req.params.id}`);
     }).catch(err =>{
       console.log(err);
       res.json(err);
   })
  },
  new: function(req, res){
    res.render('tasks/new');
  }
}

/*
Comentamos esto para implementar como se crea un nuevo registro conla arquiectura REST
module.exports = {
  //Usamos claves ("home" en este caso) para identificar a las funciones que manejaran las peticiones http
  home: function (req, res) {
    Task.findAll().then(function (tasks) {
      res.render("tasks/index", { tasks: tasks });
    });
  },
};
*/
