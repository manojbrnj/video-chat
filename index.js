import express from 'express';
const app = express();
import http from 'http';
const server = http.createServer(app);
import {Server as SocketIO} from 'socket.io';
const io = new SocketIO(server);
import cors from 'cors'; // Import cors module
//jo req aa rhi hai uska data json hai json ko js me badnaha i to req ko middleware se gujarna padenga
app.use(express.json());
// Use CORS middleware
app.use(
  cors({
    origin: 'http://localhost:3000', // Replace with the origin of your frontend
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
  }),
);

app.post('/api/save-score', (req, res) => {
  const {userId, score} = req.body;
  // Save the score in the database (this is just a mock example)
  res.status(200).json({message: 'Score saved successfully!'});
});

io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('offer', (offer) => {
    socket.broadcast.emit('offer', offer);
  });
  socket.on('answer', (answer) => {
    socket.broadcast.emit('answer', answer);
  });
  socket.on('ice-candidate', (candidate) => {
    socket.broadcast.emit('ice-candidate', candidate);
  });
  // socket.on('disconnect', () => {
  //   console.log('A user disconnected');
  // });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
