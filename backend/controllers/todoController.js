const Todo = require('../models/Todo');

// Бүх todo авах (category + search)
exports.getTodos = async (req, res) => {
  try {
    const { category, search } = req.query;
    const filter = { userId: req.userId };

    if (category && category !== 'Бүгд') {
      filter.category = category;
    }

    if (search && search.trim()) {
      filter.text = { $regex: search.trim(), $options: 'i' };
    }

    const todos = await Todo.find(filter).sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Шинэ todo нэмэх
exports.createTodo = async (req, res) => {
  try {
    const { text, category, dueDate } = req.body;

    const todo = new Todo({
      userId: req.userId,
      text,
      category: category || 'Хувийн',
      dueDate: dueDate || undefined,
      completed: false,
    });

    await todo.save();
    res.status(201).json(todo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Todo toggle (complete/incomplete)
exports.toggleTodo = async (req, res) => {
  try {
    const todo = await Todo.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!todo) {
      return res.status(404).json({ message: 'Олдсонгүй' });
    }

    todo.completed = !todo.completed;
    await todo.save();
    res.json(todo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✨ ШИНЭ: Todo засах (edit)
exports.updateTodo = async (req, res) => {
  try {
    const { text, category, dueDate, completed } = req.body;

    const todo = await Todo.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!todo) {
      return res.status(404).json({ message: 'Олдсонгүй' });
    }

    if (text !== undefined) todo.text = text;
    if (category !== undefined) todo.category = category;
    if (dueDate !== undefined) todo.dueDate = dueDate || undefined;
    if (completed !== undefined) todo.completed = completed;

    await todo.save();
    res.json(todo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Todo устгах
exports.deleteTodo = async (req, res) => {
  try {
    const result = await Todo.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!result) {
      return res.status(404).json({ message: 'Олдсонгүй' });
    }

    res.json({ message: 'Устгагдлаа' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};