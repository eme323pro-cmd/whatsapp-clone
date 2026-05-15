const express = require('express');
const http = require('http');
const { Server } = require('socket.io'); 
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
        "http://localhost:5173",
        "https://whatsapp-clone-ten-alpha.vercel.app/"
    ],
    methods: ["GET", "POST"]
  }
});

// Lista para guardar usuarios conectados (en memoria)
let usuarios = [];

io.on('connection', (socket) => {

    // Cuando un usuario envía sus datos al conectar
    socket.on('entrar-chat', (datosUsuario) => {
        const nuevoUsuario = { ...datosUsuario, id: socket.id };
        usuarios.push(nuevoUsuario);

        io.emit('lista-usuarios', usuarios);

        // Mandamos un mensaje a todos
        io.emit('nuevo-mensaje', {
            nombre: 'Aviso',
            texto: `${datosUsuario.nombre} se ha unido al chat`,
            hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
    });


    socket.on('enviar-mensaje', (texto) => {
        // Buscamos quién es el usuario que envía el mensaje usando su id de socket
        const usuario = usuarios.find(u => u.id === socket.id);

        if (usuario) {
            const mensajeCompleto = {
            texto: texto,
            nombre: usuario.nombre,
            avatar: usuario.avatar,
            hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) // Hora formateada
        };

        // Enviamos el mensaje a todods los conectados
        io.emit('nuevo-mensaje', mensajeCompleto);
        }
    });

    socket.on('disconnect', () => {
        const usuarioQueSeVa = usuarios.find(u => u.id === socket.id);
        
        if (usuarioQueSeVa) {
            io.emit('nuevo-mensaje', {
                nombre: 'Aviso',
                texto: `${usuarioQueSeVa.nombre} ha salido del chat`,
                hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            });
        }

        usuarios = usuarios.filter(u => u.id !== socket.id);
        io.emit('lista-usuarios', usuarios);
    });

    // Cuando alguien teclea
    socket.on('escribiendo', (estaEscribiendo) => {
        const usuario = usuarios.find(u => u.id === socket.id);
        if (usuario) {
            // Avisamos a todos los demás quién está escribiendo
            socket.broadcast.emit('usuario-escribiendo', {
                nombre: usuario.nombre,
                escribiendo: estaEscribiendo
            });
        }
    });
});

server.listen(3000, () => {
    console.log('Servidor en puerto 3000');
});