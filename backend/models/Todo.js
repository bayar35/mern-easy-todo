const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({ 
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // 📝 ШИНЭЭР НЭМЭГДСЭН:
  category: { type: String, default: 'Хувийн' }, // Ажил, Хувийн, Хичээл гэх мэт
  dueDate: { type: Date } // Хийж дуусгах эцсийн хугацаа
}, { timestamps: true }); // Хэзээ үүсгэснийг автоматаар хадгална (createdAt)

module.exports = mongoose.model('Todo', TodoSchema);
