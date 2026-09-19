const Todo = require('../models/Todo');

exports.getTodos = async (req, res) => {
  const todos = await Todo.find({ userId: req.userId });
  res.json(todos);
};

exports.createTodo = async (req, res) => {
  const newTodo = new Todo({ text: req.body.text, userId: req.userId });
  await newTodo.save();
  res.json(newTodo);
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
