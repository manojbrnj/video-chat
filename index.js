import express from 'express';
const app = express();

import http from 'http';
import cors from 'cors';
import fs from 'fs';

import {Server as SocketIO} from 'socket.io';

const server = http.createServer(app);

const io = new SocketIO(server);
const offers = [];

app.use(express.json());
app.use(
  cors({
    origin: 'https://videochatfront-git-main-manojbrnjs-projects.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);
io.use((socket, next) => {
  const username = socket.handshake.auth.userName;
  const password = socket.handshake.auth.password;
  if (username === 'abcd' && password === 'x') {
    console.log('socket', socket.id);
    next();
  } else {
    next(new Error('Authentication error'));
  }
});
// next();

io.on('connection', (socket) => {
  console.log('Nya connecter client connected');

  socket.on('offer', (offer) => {
    socket.broadcast.emit('offer', offer);
  });

  socket.on('answer', (answer) => {
    socket.broadcast.emit('answer', answer);
  });

  socket.on('ice-candidate', (candidate) => {
    socket.broadcast.emit('ice-candidate', candidate);
  });
  socket.on('chat-message', (message) => {
    console.log('message', message);
    socket.broadcast.emit('chat-message', message);
  });
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
