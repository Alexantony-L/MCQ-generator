import express from 'express';
import cors from 'cors';
import videoRoutes from './routes/videoRoutes';
import auth from './routes/auth';
import http from 'http';
import { Server } from 'socket.io';
const app = express();
const PORT = 5000;

// ( async()=>{await connectToMongo()})()

const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL, 
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('🟢 Client connected:', socket.id);

  socket.on('join', (roomId) => {
    console.log(`Socket ${socket.id} joined room: ${roomId}`);
    socket.join(roomId);
  });

  socket.on('message', (data) => {
    console.log('📩 Message received:', data);
  });

  socket.on('disconnect', () => {
    console.log('🔴 Client disconnected:', socket.id);
  });
});

app.use(cors());
app.use(express.json());
app.use('/api/video', videoRoutes);
app.use('/api/auth', auth);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
