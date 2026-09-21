const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const { apiLimiter } = require('./middleware/rateLimiter');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();
const server = http.createServer(app);

// 🔒 Security: Helmet
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// ⚡ Compression
app.use(compression());

// 📝 Logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// ✅ CORS
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

app.use(express.json({ limit: '10mb' }));

// 🛡️ Rate limiting (бүх API-д)
app.use('/api', apiLimiter);

// ✅ Socket.io
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

// ✅ Routes
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
    env: process.env.NODE_ENV || 'development',
  });
});

// ✅ Socket.io
io.on('connection', (socket) => {
  console.log('Хэрэглэгч холбогдлоо:', socket.id);

  socket.on('sendMessage', async (data) => {
    try {
      if (!data.sender || !data.text) return;
      if (data.text.length > 500) return;

      const Message = require('./models/Message');
      const newMessage = new Message({
        sender: data.sender,
        text: data.text.substring(0, 500),
      });
      await newMessage.save();

      io.emit('receiveMessage', newMessage);
    } catch (err) {
      console.error('Мессеж хадгалах алдаа:', err.message);
    }
  });

  socket.on('disconnect', () => {
    console.log('Хэрэглэгч салсан:', socket.id);
  });
});

// ✅ MongoDB
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('❌ MONGO_URI тохируулагдаагүй байна!');
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB-тай амжилттай холбогдлоо!'))
  .catch((err) => console.error('❌ MongoDB алдаа:', err.message));

// ✅ 404 + Error handler (хамгийн сүүлд)
app.use(notFound);
app.use(errorHandler);

// ✅ Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Сервер ${PORT} порт дээр ажиллаж байна.`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});