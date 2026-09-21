const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// ✅ CORS — local + Vercel + Render
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://mern-easy-todo.vercel.app',           // ← Таны Vercel URL
  'https://mern-easy-todo-git-main-*.vercel.app', // preview deployments
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.some((o) => origin.startsWith(o.replace('*', ''))) ||
        origin.endsWith('.vercel.app')
      ) {
        return callback(null, true);
      }
      callback(new Error('CORS-д зөвшөөрөгдөөгүй'));
    },
    credentials: true,
  })
);
app.use(express.json());

// Socket.io CORS
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || origin.endsWith('.vercel.app') || origin.includes('localhost')) {
        return callback(null, true);
      }
      callback(new Error('Socket CORS-д зөвшөөрөгдөөгүй'));
    },
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/todos', require('./routes/todoRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/products', require('./routes/productRoutes'));

// Health check
app.get('/', (req, res) => res.json({ status: 'ok', message: 'API ажиллаж байна' }));

// Socket.io
io.on('connection', (socket) => {
  console.log('Хэрэглэгч холбогдлоо:', socket.id);

  socket.on('sendMessage', async (data) => {
    io.emit('receiveMessage', {
      _id: Date.now().toString(),
      sender: data.sender,
      text: data.text,
      createdAt: new Date(),
    });
  });

  socket.on('disconnect', () => {
    console.log('Хэрэглэгч салсан:', socket.id);
  });
});

// MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB-тай амжилттай холбогдлоо!'))
  .catch((err) => console.error('MongoDB алдаа:', err));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Сервер ${PORT} порт дээр ажиллаж байна.`);
});