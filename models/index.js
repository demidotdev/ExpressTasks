"use strict";
/**
 * La función principal de este archivo es leer todos los modelos en la carpeta "models"
 * y cargarlos en un objeto db. También se encarga de establecer las asociaciones entre los modelos.
 * Este archivo index.js se encarga de cargar todos los modelos y asociaciones.
 * Estos archivos son generados de forma automática por el CLI de Sequelize.
 */
import { readdirSync } from "fs";
import { basename as _basename, join } from "path";
import Sequelize, { DataTypes } from "sequelize";
import { env as _env } from "process";
const basename = _basename(__filename);
const env = _env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];
const db = {};
import PostgresDialect from "@sequelize/postgres";
/**
 *
 * Crea una nueva instancia de Sequelize.
 * Si la configuración usa una variable de entorno, se conecta a la base de datos
 * usando la variable de entorno. De lo contrario, se conecta usando la configuración
 * proporcionada en el archivo config.json.
 */
let sequelize;
if (config.use_env_variable) {
  // Si la configuración usa una variable de entorno
  sequelize = new Sequelize(
    _env[config.use_env_variable],
    { dialect: PostgresDialect },
    config
  ); // Conexión a la base de datos
} else {
  // Si no usa una variable de entorno
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

readdirSync(__dirname) // Leemos el directorio actual
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      file.indexOf(".test.js") === -1
    );
  })
  .forEach((file) => {
    const model = require(join(__dirname, file))(
      // Importamos el modelo
      sequelize,
      DataTypes
    );
    db[model.name] = model; // Agregamos el modelo al objeto db
  });

Object.keys(db).forEach((modelName) => {
  // Iteramos sobre los modelos
  if (db[modelName].associate) {
    // Si el modelo tiene un método "associate"
    db[modelName].associate(db); // Llamamos al método "associate"
  }
});

db.sequelize = sequelize; // Agregamos la instancia de sequelize al objeto db
db.Sequelize = Sequelize; // Agregamos Sequelize al objeto db

export default db; // Exportamos el objeto db
