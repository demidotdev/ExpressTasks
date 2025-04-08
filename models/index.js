"use strict";
/**
 * La función principal de este archivo es leer todos los modelos en la carpeta "models"
 * y cargarlos en un objeto db. También se encarga de establecer las asociaciones entre los modelos.
 * Este archivo index.js se encarga de cargar todos los modelos y asociaciones.
 * Estos archivos son generados de forma automática por el CLI de Sequelize.
 */

/** @type {import('sequelize').Sequelize} */
import * as fs from "node:fs/promises";
import path from "node:path";
import Sequelize from "sequelize";
import process from "process";
import { PostgresDialect } from "@sequelize/postgres";
import dotenv from "dotenv";
dotenv.config();

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
import config from "/../config/config.json";
const configEnv = config[env];
const db = {};
const dbUrl = config.databaseUrl;
console.log("el env es " + env);
console.log(" el configEnv es " + configEnv);

/**
 * Crea una nueva instancia de Sequelize.
 * Si la configuración usa una variable de entorno, se conecta a la base de datos
 * usando la variable de entorno. De lo contrario, se conecta usando la configuración
 * proporcionada en el archivo config.json.
 */
let sequelize;
if (configEnv.use_env_variable) {
  // Si la configuración usa una variable de entorno
  sequelize = new Sequelize(dbUrl, { dialect: PostgresDialect }, config); // Conexión a la base de datos
} else {
  // Si no usa una variable de entorno
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

fs.readdirSync(__dirname) // Leemos el directorio actual
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      file.indexOf(".test.js") === -1
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      // Importamos el modelo
      sequelize,
      Sequelize.DataTypes
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

module.exports = db; // Exportamos el objeto db
