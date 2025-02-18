//Código para conectar el cliente con el servidor de socket.io y exportar el módulo
const io = require('socket.io-client');

let socket = io.connect('http://localhost:3000', {reconnect: true});

socket.on('connect',function(){  
    console.log("\n\nSocket connected from NodeJS\n\n")
})

module.exports = socket;