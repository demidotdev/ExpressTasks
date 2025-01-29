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
      User.hasMany(models.Task, { as: "tasks"})
    }
  }
  //Acá la definición del modelo User
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
  User.login = async (email, password) => {
    const user = await User.findOne({ where: { email } })
    if (!user) {
      return null
    }
    const isValid = await user.authenticatePassword(password)
    return isValid ? user : null
  }
  /**
   * Compares the given `password` with the hashed password stored in `password_hash`.
   * @param {string} password - The password to compare.
   * @returns {Promise<boolean>} A promise that resolves to `true` if the passwords match
   * and rejects with an error if they don't.
   */
  User.prototype.authenticatePassword = function (password) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, this.password_hash, (err, valid) => {
        if (err)  return reject(err)
        resolve(valid)
        })
      })
    }

  User.beforeCreate((user, options) => { // Función que se ejecuta antes de insertar un registro
    return new Promise((resolve, reject) => { 
      if (user.password) { // Si el usuario tiene una contraseña
        bcrypt.hash(user.password, 10, (err, hash) => { // Encriptar la contraseña
          if (err) { // Si hay un error
            reject(err); // Rechazar la promesa
          } else { // Si no hay error
            user.password_hash = hash; // Asignar la contraseña encriptada
            resolve(); // Resolver la promesa
          }
        }); 
      }
    })
  });
  return User;
};