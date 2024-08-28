import express from 'express';
const app = express();
import http from 'http';
const server = http.createServer(app);
import {Server as SocketIO} from 'socket.io';
const io = new SocketIO(server);
import cors from 'cors';

app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
  }),
);

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('create-room', () => {
    const roomId = generateUniqueRoomId();
    socket.join(roomId);
    socket.emit('room-created', roomId);
  });

  socket.on('makeCall', (targetRoomId) => {
    socket
      .to(targetRoomId)
      .emit('incomingCall', {from: socket.id, roomId: targetRoomId});
  });

  socket.on('callAccepted', (data) => {
    const {to, roomId} = data;
    socket.to(to).emit('callConnected', {roomId});
  });

  socket.on('offer', (data) => {
    const {offer, roomId} = data;
    socket.to(roomId).emit('offer', offer);
  });

  socket.on('answer', (answer) => {
    socket.to(answer.roomId).emit('answer', answer);
  });

  socket.on('ice-candidate', (candidate) => {
    socket.to(candidate.roomId).emit('ice-candidate', candidate);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

function generateUniqueRoomId() {
  return Math.random().toString(36).substr(2, 9);
}

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
