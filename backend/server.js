const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

// ✅ CORS тохиргоо
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://mern-easy-todo.vercel.app',
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith('.vercel.app')
      ) {
        return callback(null, true);
      }
      callback(new Error('CORS-д зөвшөөрөгдөөгүй: ' + origin));
    },
    credentials: true,
  })
);

app.use(express.json());

// ✅ Socket.io тохиргоо
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (
        !origin ||
        origin.endsWith('.vercel.app') ||
        origin.includes('localhost')
      ) {
        return callback(null, true);
      }
      callback(new Error('Socket CORS-д зөвшөөрөгдөөгүй'));
    },
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// ✅ Routes — try/catch-тай
const routes = [
  { path: '/api/auth', file: './routes/authRoutes' },
  { path: '/api/todos', file: './routes/todoRoutes' },
  { path: '/api/messages', file: './routes/messageRoutes' },
  { path: '/api/products', file: './routes/productRoutes' },
];

routes.forEach(({ path, file }) => {
  try {
    app.use(path, require(file));
    console.log(`✅ Route бүртгэгдлээ: ${path}`);
  } catch (err) {
    console.error(`❌ Route алдаа (${path}):`, err.message);
  }
});

// ✅ Health check
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'API ажиллаж байна',
    timestamp: new Date().toISOString(),
  });
});

// ✅ Socket.io холболт
io.on('connection', (socket) => {
  console.log('Хэрэглэгч холбогдлоо:', socket.id);

  socket.on('sendMessage', (data) => {
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

// ✅ MongoDB — зөвхөн 1 удаа холбох
const MONGO_URI =
  process.env.MONGO_URI ||
  'mongodb+srv://bayaryo:bayar456@cluster0.kmijiq0.mongodb.net/easy-todo?appName=Cluster0';

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB-тай амжилттай холбогдлоо!'))
  .catch((err) => console.error('❌ MongoDB алдаа:', err.message));

// ✅ Server эхлүүлэх — зөвхөн 1 удаа
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Сервер ${PORT} порт дээр ажиллаж байна.`);
});