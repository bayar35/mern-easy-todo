const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const todoRoutes = require('./routes/todoRoutes');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb+srv://bayaryo:bayar456@cluster0.kmijiq0.mongodb.net/easy-todo?appName=Cluster0')
  .then(() => console.log("MongoDB Atlas-тай амжилттай холбогдлоо!🚀"))
  .catch(err => console.log(err));

// Замуудыг холбох
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);

app.listen(5000, () => console.log("Сервер 5000 порт дээр ажиллаж байна."));
