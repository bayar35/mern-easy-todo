import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  
  // Хэрэглэгчийн төлөвүүд
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [isRegister, setIsRegister] = useState(false); // Бүртгүүлэх үү, Нэвтрэх үү гэдгийг солих
  const [authInput, setAuthInput] = useState({ user: '', pass: '' });
  const [error, setError] = useState('');

  // Токен өөрчлөгдөх бүрт серверээс түүнд тохирох тэмдэглэлийг татах
  useEffect(() => {
    if (token) {
      axios.get('https://easy-todo-backend.onrender.com/api/todos', {
        headers: { 'Authorization': token } // Хамгаалалттай API руу токен илгээх
      })
        .then(res => setTodos(res.data))
        .catch(err => {
          if (err.response?.status === 401) handleLogout(); // Токен хүчингүй бол устгах
        });
    }
  }, [token]);

  // Нэвтрэх болон Бүртгүүлэх функц
  const handleAuth = (e) => {
    e.preventDefault();
    setError('');
    const url = isRegister ? 'register' : 'login';

    axios.post(`https://easy-todo-backend.onrender.com/api/auth/${url}`, {
      username: authInput.user,
      password: authInput.pass
    })
      .then(res => {
        if (isRegister) {
          alert('Амжилттай бүртгэгдлээ! Одоо нэвтэрнэ үү.');
          setIsRegister(false);
          setAuthInput({ user: '', pass: '' });
        } else {
          // Нэвтрэх үед Токен болон Нэрийг хадгалах
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('username', res.data.username);
          setToken(res.data.token);
          setUsername(res.data.username);
        }
      })
      .catch(err => setError(err.response?.data?.message || 'Алдаа гарлаа'));
  };

  // Гарах функц
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setToken('');
    setUsername('');
    setTodos([]);
  };

  const addTodo = () => {
    if (!input) return;
    axios.post('https://easy-todo-backend.onrender.com/api/todos', { text: input }, { headers: { 'Authorization': token } })
      .then(res => {
        setTodos([...todos, res.data]);
        setInput('');
      });
  };

  const toggleComplete = (id) => {
    axios.put(`https://easy-todo-backend.onrender.com/api/todos/${id}`, {}, { headers: { 'Authorization': token } })
      .then(res => {
        setTodos(todos.map(todo => todo._id === id ? res.data : todo));
      });
  };

  const deleteTodo = (id) => {
    axios.delete(`https://easy-todo-backend.onrender.com/api/todos/${id}`, { headers: { 'Authorization': token } })
      .then(() => {
        setTodos(todos.filter(todo => todo._id !== id));
      });
  };

  // 1. ХЭРЭГЛЭГЧ НЭВТРЭЭГҮЙ ҮЕД ХАРАГДАХ ЦОНХ
  if (!token) {
    return (
      <div style={{ padding: '30px', fontFamily: 'Arial', maxWidth: '350px', margin: '100px auto', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', borderRadius: '8px', textAlign: 'center' }}>
        <h2>{isRegister ? 'Бүртгүүлэх 📝' : 'Нэвтрэх 🔒'}</h2>
        {error && <p style={{ color: 'red', fontSize: '14px' }}>{error}</p>}
        <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input 
            type="text" 
            placeholder="Хэрэглэгчийн нэр" 
            value={authInput.user}
            onChange={e => setAuthInput({ ...authInput, user: e.target.value })}
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} 
            required 
          />
          <input 
            type="password" 
            placeholder="Нууц үг" 
            value={authInput.pass}
            onChange={e => setAuthInput({ ...authInput, pass: e.target.value })}
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} 
            required 
          />
          <button type="submit" style={{ padding: '10px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            {isRegister ? 'Бүртгүүлэх' : 'Нэвтрэх'}
          </button>
        </form>
        <p style={{ marginTop: '15px', fontSize: '14px', color: '#555', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? 'Бүртгэлтэй юу? Нэвтрэх' : 'Шинэ үү? Бүртгүүлэх'}
        </p>
      </div>
    );
  }

  // 2. ХЭРЭГЛЭГЧ НЭВТЭРСЭН ҮЕД ХАРАГДАХ ҮНДСЭН ЦОНХ
  return (
    <div style={{ padding: '30px', fontFamily: 'Arial', maxWidth: '450px', margin: '30px auto', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', borderRadius: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
        <span>Хэрэглэгч: <b>{username}</b> 👋</span>
        <button onClick={handleLogout} style={{ backgroundColor: '#f44336', color: 'white', border: 'none', padding: '6px 12px', cursor: 'pointer', borderRadius: '4px' }}>Гарах</button>
      </div>

      <h2 style={{ textAlign: 'center', color: '#333' }}>Миний хувийн MERN апп 🚀</h2>
      
      <div style={{ display: 'flex', marginBottom: '20px' }}>
        <input 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          placeholder="Тэмдэглэл бичих..." 
          style={{ padding: '10px', flex: 1, border: '1px solid #ccc', borderRadius: '4px 0 0 4px', fontSize: '16px' }}
        />
        <button onClick={addTodo} style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '0 4px 4px 0', cursor: 'pointer', fontSize: '16px' }}>Нэмэх</button>
      </div>

      <ul style={{ paddingLeft: '0', listStyle: 'none' }}>
        {todos.map(todo => (
          <li key={todo._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 10px', borderBottom: '1px solid #eee', alignItems: 'center', backgroundColor: todo.completed ? '#f9f9f9' : 'white' }}>
            <span onClick={() => toggleComplete(todo._id)} style={{ textDecoration: todo.completed ? 'line-through' : 'none', color: todo.completed ? '#888' : '#333', cursor: 'pointer', flex: 1, userSelect: 'none' }}>
              {todo.completed ? '✅ ' : '⬜ '} {todo.text}
            </span>
            <button onClick={() => deleteTodo(todo._id)} style={{ backgroundColor: '#ff4d4d', color: 'white', border: 'none', padding: '6px 12px', cursor: 'pointer', borderRadius: '4px', fontSize: '14px' }}>Устгах</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
