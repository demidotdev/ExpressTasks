//Código para conectar el cliente con el servidor de socket.io y exportar el módulo
import { connect } from "socket.io-client";
import dotenv from "dotenv";
import path from "node:path";
dotenv.config(path.join(__dirname, "/../.env"), { debug: true });

let host = "http://localhost:8080 ";

if (process.env.NODE_ENV && process.env.NODE_ENV === "production") {
  host = process.env.PGHOST;
  console.log("Estoy en el host: " + host);
}

let socket = connect(host, { reconnect: true });

socket.on("connect", function () {
  console.log("\n\nSocket connected from NodeJS\n\n");
});

export default socket;
