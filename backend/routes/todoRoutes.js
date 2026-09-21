const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const todoController = require('../controllers/todoController');
const validate = require('../middleware/validate');
const {
  createTodoSchema,
  updateTodoSchema,
} = require('../validators/todoValidator');

router.get('/', auth, todoController.getTodos);
router.post('/', auth, validate(createTodoSchema), todoController.createTodo);
router.put('/:id', auth, todoController.toggleTodo); // Toggle
router.patch(
  '/:id',
  auth,
  validate(updateTodoSchema),
  todoController.updateTodo
); // Edit
router.delete('/:id', auth, todoController.deleteTodo);

module.exports = router;