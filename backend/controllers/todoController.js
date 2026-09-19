const Todo = require('../models/Todo');

// Бүх тэмдэглэлийг авах (Шүүлтүүртэй болгосон)
exports.getTodos = async (req, res) => {
  try {
    const { category } = req.query; // Вэбээс /api/todos?category=Ажил гэж орж ирвэл шүүнэ
    let query = { userId: req.userId };

    if (category && category !== 'Бүгд') {
      query.category = category;
    }

    const todos = await Todo.find(query).sort({ createdAt: -1 }); // Шинэ нь дээрээ харагдана
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Шинэ тэмдэглэл үүсгэх (Категори, Хугацаатай)
exports.createTodo = async (req, res) => {
  try {
    const { text, category, dueDate } = req.body;
    const newTodo = new Todo({ 
      text, 
      category, 
      dueDate, 
      userId: req.userId 
    });
    await newTodo.save();
    res.json(newTodo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.toggleTodo = async (req, res) => {
  const todo = await Todo.findOne({ _id: req.params.id, userId: req.userId });
  if (!todo) return res.status(404).json({ message: "Олдсонгүй" });
  todo.completed = !todo.completed;
  await todo.save();
  res.json(todo);
};

exports.deleteTodo = async (req, res) => {
  const todo = await Todo.findOneAndDelete({ _id: req.params.id, userId: req.userId });
  if (!todo) return res.status(404).json({ message: "Олдсонгүй" });
  res.json({ message: "Устгагдлаа" });
};
