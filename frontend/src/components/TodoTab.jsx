import { useState, useEffect, useMemo, useCallback, memo } from 'react';
import api from '../utils/api';
import { useToast } from '../context/ToastContext';
import useDebounce from '../hooks/useDebounce';
import SearchBar from './SearchBar';
import LoadingSpinner from './LoadingSpinner';

const TodoItem = memo(function TodoItem({
  todo,
  onToggle,
  onDelete,
  onEdit,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleSave = () => {
    if (editText.trim() && editText !== todo.text) {
      onEdit(todo._id, { text: editText.trim() });
    }
    setIsEditing(false);
  };

  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <div className="todo-content" onClick={() => onToggle(todo._id)}>
        <span className="todo-checkbox">
          {todo.completed ? '✅' : '⬜'}
        </span>
        {isEditing ? (
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            autoFocus
            onClick={(e) => e.stopPropagation()}
            className="todo-edit-input"
          />
        ) : (
          <span className="todo-text">{todo.text}</span>
        )}
        <div className="todo-meta">
          🏷️ {todo.category}
          {todo.dueDate &&
            ` ⏰ ${new Date(todo.dueDate).toLocaleDateString()}`}
        </div>
      </div>
      <div className="todo-actions">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsEditing(!isEditing);
          }}
          className="btn-edit"
          title="Засах"
        >
          ✏️
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(todo._id);
          }}
          className="btn-delete"
          title="Устгах"
        >
          🗑️
        </button>
      </div>
    </li>
  );
});

export default function TodoTab({ token }) {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [category, setCategory] = useState('Хувийн');
  const [dueDate, setDueDate] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Бүгд');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const debouncedSearch = useDebounce(search, 400);

  // 📋 Todo татах
  const fetchTodos = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        category: selectedCategory,
        ...(debouncedSearch && { search: debouncedSearch }),
      });
      const res = await api.get(`/api/todos?${params}`);
      setTodos(res.data);
    } catch (err) {
      toast.error('Todo татахад алдаа гарлаа');
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, debouncedSearch, toast]);

  useEffect(() => {
    if (token) fetchTodos();
  }, [token, fetchTodos]);

  const addTodo = async () => {
    if (!input.trim()) return;
    try {
      const res = await api.post('/api/todos', {
        text: input,
        category,
        dueDate,
      });
      setTodos((prev) => [res.data, ...prev]);
      setInput('');
      setDueDate('');
      toast.success('Todo нэмэгдлээ');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Алдаа');
    }
  };

  const toggleComplete = useCallback(
    async (id) => {
      try {
        const res = await api.put(`/api/todos/${id}`);
        setTodos((prev) =>
          prev.map((t) => (t._id === id ? res.data : t))
        );
      } catch {
        toast.error('Алдаа');
      }
    },
    [toast]
  );

  const deleteTodo = useCallback(
    async (id) => {
      if (!window.confirm('Устгах уу?')) return;
      try {
        await api.delete(`/api/todos/${id}`);
        setTodos((prev) => prev.filter((t) => t._id !== id));
        toast.success('Устгагдлаа');
      } catch {
        toast.error('Алдаа');
      }
    },
    [toast]
  );

  const editTodo = useCallback(
    async (id, updates) => {
      try {
        const res = await api.patch(`/api/todos/${id}`, updates);
        setTodos((prev) =>
          prev.map((t) => (t._id === id ? res.data : t))
        );
        toast.success('Шинэчлэгдлээ');
      } catch {
        toast.error('Алдаа');
      }
    },
    [toast]
  );

  // Performance: stats
  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter((t) => t.completed).length;
    return { total, completed, remaining: total - completed };
  }, [todos]);

  return (
    <div>
      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="🔍 Todo хайх..."
      />

      <div className="stats">
        <span>Нийт: {stats.total}</span>
        <span>✅ {stats.completed}</span>
        <span>⏳ {stats.remaining}</span>
      </div>

      <div className="todo-form">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Юу хийх вэ..."
          onKeyDown={(e) => e.key === 'Enter' && addTodo()}
        />
        <div className="form-row">
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="Хувийн">🏠 Хувийн</option>
            <option value="Ажил">💼 Ажил</option>
            <option value="Хичээл">📚 Хичээл</option>
          </select>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        <button onClick={addTodo} className="btn-primary">
          Нэмэх
        </button>
      </div>

      <div className="filter-row">
        {['Бүгд', 'Хувийн', 'Ажил', 'Хичээл'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner text="Ачаалж байна..." />
      ) : (
        <ul className="todo-list">
          {todos.length === 0 ? (
            <p className="empty">Todo байхгүй. Нэмээрэй!</p>
          ) : (
            todos.map((todo) => (
              <TodoItem
                key={todo._id}
                todo={todo}
                onToggle={toggleComplete}
                onDelete={deleteTodo}
                onEdit={editTodo}
              />
            ))
          )}
        </ul>
      )}
    </div>
  );
}