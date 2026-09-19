import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  
  // 📝 ШИНЭЭР НЭМЭГДСЭН: Категори болон Хугацааны төлөвүүд
  const [category, setCategory] = useState('Хувийн'); 
  const [dueDate, setDueDate] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Бүгд'); // Шүүлтүүр хийх категор

  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [isRegister, setIsRegister] = useState(false);
  const [authInput, setAuthInput] = useState({ user: '', pass: '' });
  const [error, setError] = useState('');

  // 📝 ШИНЭЧЛЭГДСЭН: Сонгосон категори өөрчлөгдөх бүрт серверээс шүүж татах
  useEffect(() => {
    if (token) {
      axios.get(`https://onrender.com{selectedCategory}`, {
        headers: { 'Authorization': token }
      })
        .then(res => setTodos(res.data))
        .catch(err => {
          if (err.response?.status === 401) handleLogout();
        });
    }
  }, [token, selectedCategory]);

  const handleAuth = (e) => {
    e.preventDefault();
    setError('');
    const url = isRegister ? 'register' : 'login';

    axios.post(`https://onrender.com{url}`, {
      username: authInput.user,
      password: authInput.pass
    })
      .then(res => {
        if (isRegister) {
          alert('Амжилттай бүртгэгдлээ! Одоо нэвтэрнэ үү.');
          setIsRegister(false);
          setAuthInput({ user: '', pass: '' });
        } else {
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('username', res.data.username);
          setToken(res.data.token);
          setUsername(res.data.username);
        }
      })
      .catch(err => setError(err.response?.data?.message || 'Алдаа гарлаа'));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setToken(''); setUsername(''); setTodos([]);
  };

  // 📝 ШИНЭЧЛЭГДСЭН: Категори, Хугацааг сервер рүү хамт илгээх
  const addTodo = () => {
    if (!input) return;
    axios.post('https://onrender.com', { 
      text: input,
      category: category,
      dueDate: dueDate
    }, { headers: { 'Authorization': token } })
      .then(res => {
        setTodos([res.data, ...todos]); // Шинэ тэмдэглэлийг жагсаалтын дээр нэмэх
        setInput(''); setDueDate('');
      });
  };

  const toggleComplete = (id) => {
    axios.put(`https://onrender.com/${id}`, {}, { headers: { 'Authorization': token } })
      .then(res => {
        setTodos(todos.map(todo => todo._id === id ? res.data : todo));
      });
  };

  const deleteTodo = (id) => {
    axios.delete(`https://onrender.com/${id}`, { headers: { 'Authorization': token } })
      .then(() => {
        setTodos(todos.filter(todo => todo._id !== id));
      });
  };

  if (!token) {
    return (
      <div style={{ padding: '30px', fontFamily: 'Arial', maxWidth: '350px', margin: '100px auto', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', borderRadius: '8px', textAlign: 'center' }}>
        <h2>{isRegister ? 'Бүртгүүлэх 📝' : 'Нэвтрэх 🔒'}</h2>
        {error && <p style={{ color: 'red', fontSize: '14px' }}>{error}</p>}
        <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input type="text" placeholder="Хэрэглэгчийн нэр" value={authInput.user} onChange={e => setAuthInput({ ...authInput, user: e.target.value })} style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} required />
          <input type="password" placeholder="Нууц үг" value={authInput.pass} onChange={e => setAuthInput({ ...authInput, pass: e.target.value })} style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} required />
          <button type="submit" style={{ padding: '10px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>{isRegister ? 'Бүртгүүлэх' : 'Нэвтрэх'}</button>
        </form>
        <p style={{ marginTop: '15px', fontSize: '14px', color: '#555', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setIsRegister(!isRegister)}>{isRegister ? 'Бүртгэлтэй юу? Нэвтрэх' : 'Шинэ үү? Бүртгүүлэх'}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial', maxWidth: '550px', margin: '30px auto', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', borderRadius: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
        <span>Хэрэглэгч: <b>{username}</b> 👋</span>
        <button onClick={handleLogout} style={{ backgroundColor: '#f44336', color: 'white', border: 'none', padding: '6px 12px', cursor: 'pointer', borderRadius: '4px' }}>Гарах</button>
      </div>

      <h2 style={{ textAlign: 'center', color: '#333' }}>Ажил Төлөвлөгч Систем 🚀</h2>
      
      {/* 📝 1. ТЭМДЭГЛЭЛ НЭМЭХ ХЭСЭГ (ӨРГӨТГӨСӨН) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '25px', backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '6px' }}>
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Юу хийх вэ..." style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '16px' }} />
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ padding: '8px', flex: 1, borderRadius: '4px', border: '1px solid #ccc' }}>
            <option value="Хувийн">🏠 Хувийн</option>
            <option value="Ажил">💼 Ажил</option>
            <option value="Хичээл">📚 Хичээл</option>
          </select>
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} style={{ padding: '8px', flex: 1, borderRadius: '4px', border: '1px solid #ccc' }} />
        </div>
        
        <button onClick={addTodo} style={{ padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>Нэмэх</button>
      </div>

      {/* 📝 2. ШҮҮЛТҮҮР ХИЙХ ТАБНУУД */}
      <div style={{ display: 'flex', gap: '5px', marginBottom: '15px', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
        {['Бүгд', 'Хувийн', 'Ажил', 'Хичээл'].map(cat => (
          <button key={cat} onClick={() => setSelectedCategory(cat)} style={{ padding: '6px 12px', borderRadius: '20px', border: '1px solid #ccc', cursor: 'pointer', backgroundColor: selectedCategory === cat ? '#007BFF' : 'white', color: selectedCategory === cat ? 'white' : '#333', fontSize: '14px' }}>
            {cat === 'Бүгд' ? '🌐 Бүгд' : cat === 'Хувийн' ? '🏠 Хувийн' : cat === 'Ажил' ? '💼 Ажил' : '📚 Хичээл'}
          </button>
        ))}
      </div>

      {/* 📝 3. ЖАГСААЛТ ХАРАГДАЦ */}
      <ul style={{ paddingLeft: '0', listStyle: 'none' }}>
        {todos.length === 0 ? <p style={{ color: '#888', textAlign: 'center' }}>Энэ категорит тэмдэглэл алга.</p> : null}
        {todos.map(todo => (
          <li key={todo._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 10px', borderBottom: '1px solid #eee', alignItems: 'center', backgroundColor: todo.completed ? '#f1f1f1' : 'white' }}>
            <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => toggleComplete(todo._id)}>
              <span style={{ textDecoration: todo.completed ? 'line-through' : 'none', color: todo.completed ? '#888' : '#333', fontWeight: '500' }}>
                {todo.completed ? '✅ ' : '⬜ '} {todo.text}
              </span>
              <div style={{ display: 'flex', gap: '10px', marginTop: '4px', fontSize: '12px' }}>
                <span style={{ backgroundColor: todo.category === 'Ажил' ? '#e1f5fe' : todo.category === 'Хичээл' ? '#efebe9' : '#e8f5e9', color: '#555', padding: '2px 6px', borderRadius: '4px' }}>{todo.category}</span>
                {todo.dueDate && <span style={{ color: '#d32f2f' }}>⏰ Дуусах: {new Date(todo.dueDate).toLocaleDateString()}</span>}
              </div>
            </div>
            <button onClick={() => deleteTodo(todo._id)} style={{ backgroundColor: '#ff4d4d', color: 'white', border: 'none', padding: '6px 12px', cursor: 'pointer', borderRadius: '4px', fontSize: '14px' }}>Устгах</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
