import express from 'express';
const app = express();
import http from 'https';
const server = http.createServer(app);
import {Server as SocketIO} from 'socket.io';
const io = new SocketIO(server);
import cors from 'cors';

app.use(express.json());
app.use(
  cors({
    origin: 'https://videochatfront-git-main-manojbrnjs-projects.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('offer', (offer) => {
    socket.broadcast.emit('offer', offer);
  });

  socket.on('answer', (answer) => {
    socket.broadcast.emit('answer', answer);
  });

  socket.on('ice-candidate', (candidate) => {
    socket.broadcast.emit('ice-candidate', candidate);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
