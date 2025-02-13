'use strict';

const bcrypt = require('bcrypt');

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // hasMany: 1 a muchos
      // belongsTo: 1 a 1
      // belongsToMany: muchos a muchos
      User.hasMany(models.Task, { as: "tasks"}) // "as" para uniformidad usando mayúsculas y minúsculas
    }
  }
  //Acá la definición del modelo User, con validaciones en el modelo
  User.init({
    email: { // Sintaxis de objeto json
      type: DataTypes.STRING, // definir tipo de dato
      unique: true, // solo un correo por usuario
      allowNull: false // no puede ser nulo
    },
    password_hash: DataTypes.STRING, // Sintaxis básica
    password: DataTypes.VIRTUAL // campo virtual, no se inserta en la base de datos
  }, 
  {
    sequelize,
    modelName: 'User',
  });
  User.login = async (email, password) => { // Método para loggearse
    const user = await User.findOne({ where: { email } }) // Buscar un usuario por email
    if (!user) {
      return null 
    }
    const isValid = await user.authenticatePassword(password) // Comparar contraseñas
    return isValid ? user : null // Si las contraseñas coinciden, retornar el usuario
  }
  /**
   * Compares the given `password` with the hashed password stored in `password_hash`.
   * @param {string} password - The password to compare.
   * @returns {Promise<boolean>} A promise that resolves to `true` if the passwords match
   * and rejects with an error if they don't.
   */
  User.prototype.authenticatePassword = function (password) { // Método para comparar contraseñas
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, this.password_hash, (err, valid) => {
        if (err)  return reject(err)
        resolve(valid)
        })
      })
    }

  User.beforeCreate((user, options) => { // Función que se ejecuta antes de insertar un registro
    // user es el objeto que se va a crear después de "beforeCreate"
    // options son las opciones de la consulta
    return new Promise((resolve, reject) => { // Crear una promesa para respetar orden de ejecución
      if (user.password) { // Si el usuario tiene una contraseña
        bcrypt.hash(user.password, 10, (err, hash) => { // Encriptar la contraseña
          //1er argumento: la contraseña a encriptar
          //2do argumento: el número de veces que se encripta
          //3er argumento: función de callback
          if (err) { // Si hay un error
            reject(err); // Rechazar la promesa
          } else { // Si no hay error
            user.password_hash = hash; // Asignar la contraseña encriptada
            resolve(); // Resolver la promesa
          }
        }); 
      }
    });
  });
  return User;
};