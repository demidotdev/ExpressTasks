//Código para conectar el cliente con el servidor de socket.io y exportar el módulo
import { connect } from "socket.io-client";

let host = "http://localhost:8080 ";

if (process.env.NODE_ENV && process.env.NODE_ENV === "production") {
  host = process.env.HOST;
}

let socket = connect(host, { reconnect: true });

socket.on("connect", function () {
  console.log("\n\nSocket connected from NodeJS\n\n");
});

export default socket;
