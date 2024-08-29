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

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
