import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

// 🌐 БЭКЭНД СЕРВЕРИЙН ХАЯГ (Render дээрх backend)
const API_URL = 'https://easy-todo-backend.onrender.com';
// const API_URL = 'https://easy-todo-backend.onrender.com';
const socket = io(API_URL);
function App() {
  const [activeTab, setActiveTab] = useState('todo');

  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [category, setCategory] = useState('Хувийн');
  const [dueDate, setDueDate] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Бүгд');

  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef(null);

  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [isRegister, setIsRegister] = useState(false);
  const [authInput, setAuthInput] = useState({ user: '', pass: '' });
  const [error, setError] = useState('');

  const handleLogout = () => {
    localStorage.clear();
    setToken('');
    setUsername('');
    setTodos([]);
    setMessages([]);
    setCart([]);
  };

  useEffect(() => {
    if (token && activeTab === 'todo') {
      axios
        .get(`${API_URL}/api/todos?category=${selectedCategory}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setTodos(res.data))
        .catch((err) => {
          if (err.response?.status === 401) handleLogout();
        });
    }
  }, [token, selectedCategory, activeTab]);

  useEffect(() => {
    if (token && activeTab === 'chat') {
      axios
        .get(`${API_URL}/api/messages`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setMessages(res.data))
        .catch(() => {});

      socket.on('receiveMessage', (message) => {
        setMessages((prev) => [...prev, message]);
      });

      return () => socket.off('receiveMessage');
    }
  }, [token, activeTab]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (token && activeTab === 'shop') {
      axios
        .get(`${API_URL}/api/products`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setProducts(res.data))
        .catch(() => {});
    }
  }, [token, activeTab]);

  const handleAuth = (e) => {
    e.preventDefault();
    setError('');
    const url = isRegister ? 'register' : 'login';
    axios
      .post(`${API_URL}/api/auth/${url}`, {
        username: authInput.user,
        password: authInput.pass,
      })
      .then((res) => {
        if (isRegister) {
          alert('Амжилттай бүртгэгдлээ!');
          setIsRegister(false);
          setAuthInput({ user: '', pass: '' });
        } else {
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('username', res.data.username);
          setToken(res.data.token);
          setUsername(res.data.username);
        }
      })
      .catch((err) =>
        setError(err.response?.data?.message || 'Алдаа гарлаа')
      );
  };

  const addTodo = () => {
    if (!input.trim()) return;
    axios
      .post(
        `${API_URL}/api/todos`,
        { text: input, category, dueDate },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        setTodos([res.data, ...todos]);
        setInput('');
        setDueDate('');
      })
      .catch((err) => alert(err.response?.data?.message || 'Алдаа'));
  };

  const toggleComplete = (id) => {
    axios
      .put(
        `${API_URL}/api/todos/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) =>
        setTodos(todos.map((todo) => (todo._id === id ? res.data : todo)))
      )
      .catch(() => {});
  };

  const deleteTodo = (id) => {
    axios
      .delete(`${API_URL}/api/todos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => setTodos(todos.filter((todo) => todo._id !== id)))
      .catch(() => {});
  };

  const sendChatMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    socket.emit('sendMessage', { sender: username, text: chatInput });
    setChatInput('');
  };

  const addToCart = (product) => {
    setCart((prevCart) => {
      const exists = prevCart.find((item) => item._id === product._id);
      if (exists)
        return prevCart.map((item) =>
          item._id === product._id ? { ...item, qty: item.qty + 1 } : item
        );
      return [...prevCart, { ...product, qty: 1 }];
    });
  };

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  if (!token) {
    return (
      <div
        style={{
          padding: '30px',
          fontFamily: 'Arial',
          maxWidth: '350px',
          margin: '100px auto',
          boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
          borderRadius: '8px',
          textAlign: 'center',
        }}
      >
        <h2>{isRegister ? 'Бүртгүүлэх 📝' : 'Нэвтрэх 🔒'}</h2>
        {error && <p style={{ color: 'red', fontSize: '14px' }}>{error}</p>}
        <form
          onSubmit={handleAuth}
          style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
        >
          <input
            type="text"
            placeholder="Хэрэглэгчийн нэр"
            value={authInput.user}
            onChange={(e) =>
              setAuthInput({ ...authInput, user: e.target.value })
            }
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
            required
          />
          <input
            type="password"
            placeholder="Нууц үг"
            value={authInput.pass}
            onChange={(e) =>
              setAuthInput({ ...authInput, pass: e.target.value })
            }
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
            required
          />
          <button
            type="submit"
            style={{
              padding: '10px',
              backgroundColor: '#007BFF',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            {isRegister ? 'Бүртгүүлэх' : 'Нэвтрэх'}
          </button>
        </form>
        <p
          style={{
            marginTop: '15px',
            fontSize: '14px',
            color: '#555',
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
          onClick={() => setIsRegister(!isRegister)}
        >
          {isRegister ? 'Бүртгэлтэй юу? Нэвтрэх' : 'Шинэ үү? Бүртгүүлэх'}
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: '20px',
        fontFamily: 'Arial',
        maxWidth: '650px',
        margin: '20px auto',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        borderRadius: '12px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '15px',
          borderBottom: '2px solid #eee',
          paddingBottom: '10px',
        }}
      >
        <span>
          Хэрэглэгч: <b>{username}</b> 👋
        </span>
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            padding: '6px 12px',
            cursor: 'pointer',
            borderRadius: '4px',
          }}
        >
          Гарах
        </button>
      </div>

      <div
        style={{
          display: 'flex',
          gap: '5px',
          marginBottom: '20px',
          backgroundColor: '#eee',
          padding: '5px',
          borderRadius: '8px',
        }}
      >
        {[
          { key: 'todo', label: '📋 Ажил' },
          { key: 'chat', label: '💬 Чат' },
          { key: 'shop', label: '🛒 Дэлгүүр' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              flex: 1,
              padding: '10px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              backgroundColor: activeTab === tab.key ? 'white' : 'transparent',
              fontWeight: activeTab === tab.key ? 'bold' : 'normal',
              boxShadow:
                activeTab === tab.key ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'todo' && (
        <div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              marginBottom: '20px',
              backgroundColor: '#f9f9f9',
              padding: '15px',
              borderRadius: '6px',
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Юу хийх вэ..."
              style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
            <div style={{ display: 'flex', gap: '10px' }}>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ padding: '8px', flex: 1, borderRadius: '4px', border: '1px solid #ccc' }}
              >
                <option value="Хувийн">🏠 Хувийн</option>
                <option value="Ажил">💼 Ажил</option>
                <option value="Хичээл">📚 Хичээл</option>
              </select>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                style={{ padding: '8px', flex: 1, borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            <button
              onClick={addTodo}
              style={{
                padding: '10px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              Нэмэх
            </button>
          </div>

          <div style={{ display: 'flex', gap: '5px', marginBottom: '15px' }}>
            {['Бүгд', 'Хувийн', 'Ажил', 'Хичээл'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '20px',
                  border: '1px solid #ccc',
                  cursor: 'pointer',
                  backgroundColor:
                    selectedCategory === cat ? '#007BFF' : 'white',
                  color: selectedCategory === cat ? 'white' : '#333',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <ul style={{ paddingLeft: '0', listStyle: 'none' }}>
            {todos.map((todo) => (
              <li
                key={todo._id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '12px 10px',
                  borderBottom: '1px solid #eee',
                  alignItems: 'center',
                  backgroundColor: todo.completed ? '#f1f1f1' : 'white',
                }}
              >
                <div
                  style={{ flex: 1, cursor: 'pointer' }}
                  onClick={() => toggleComplete(todo._id)}
                >
                  <span
                    style={{
                      textDecoration: todo.completed ? 'line-through' : 'none',
                      color: todo.completed ? '#888' : '#333',
                    }}
                  >
                    {todo.completed ? '✅ ' : '⬜ '} {todo.text}
                  </span>
                  <div
                    style={{
                      display: 'flex',
                      gap: '10px',
                      marginTop: '4px',
                      fontSize: '11px',
                      color: '#666',
                    }}
                  >
                    🏷️ {todo.category}
                    {todo.dueDate &&
                      ` ⏰ ${new Date(todo.dueDate).toLocaleDateString()}`}
                  </div>
                </div>
                <button
                  onClick={() => deleteTodo(todo._id)}
                  style={{
                    backgroundColor: '#ff4d4d',
                    color: 'white',
                    border: 'none',
                    padding: '6px 12px',
                    cursor: 'pointer',
                    borderRadius: '4px',
                  }}
                >
                  Устгах
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {activeTab === 'chat' && (
        <div>
          <div
            style={{
              height: '300px',
              overflowY: 'auto',
              border: '1px solid #ddd',
              padding: '15px',
              borderRadius: '6px',
              marginBottom: '10px',
              backgroundColor: '#fcfcfc',
            }}
          >
            {messages.map((msg, index) => (
              <div
                key={msg._id || index}
                style={{
                  marginBottom: '10px',
                  textAlign: msg.sender === username ? 'right' : 'left',
                }}
              >
                <div
                  style={{
                    fontSize: '11px',
                    color: '#777',
                    marginBottom: '2px',
                  }}
                >
                  {msg.sender}
                </div>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '8px 12px',
                    borderRadius: '12px',
                    backgroundColor:
                      msg.sender === username ? '#007BFF' : '#e9e9e9',
                    color: msg.sender === username ? 'white' : 'black',
                    maxWidth: '70%',
                    wordBreak: 'break-word',
                  }}
                >
                  {msg.text}
                </span>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <form onSubmit={sendChatMessage} style={{ display: 'flex', gap: '5px' }}>
            <input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Мессеж бичих..."
              style={{
                padding: '10px',
                flex: 1,
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            />
            <button
              type="submit"
              style={{
                padding: '10px 20px',
                backgroundColor: '#007BFF',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Илгээх
            </button>
          </form>
        </div>
      )}

      {activeTab === 'shop' && (
        <div style={{ display: 'flex', gap: '15px' }}>
          <div
            style={{
              flex: 2,
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px',
            }}
          >
            {products.map((prod) => (
              <div
                key={prod._id}
                style={{
                  border: '1px solid #eee',
                  padding: '10px',
                  borderRadius: '6px',
                  textAlign: 'center',
                  backgroundColor: '#fff',
                }}
              >
                <img
                  src={prod.image}
                  alt={prod.name}
                  style={{
                    width: '100%',
                    height: '100px',
                    objectFit: 'cover',
                    borderRadius: '4px',
                  }}
                />
                <h4 style={{ margin: '8px 0 4px 0', fontSize: '14px' }}>
                  {prod.name}
                </h4>
                <p
                  style={{
                    margin: '0 0 8px 0',
                    color: '#ff5722',
                    fontWeight: 'bold',
                    fontSize: '13px',
                  }}
                >
                  {prod.price.toLocaleString()} ₮
                </p>
                <button
                  onClick={() => addToCart(prod)}
                  style={{
                    padding: '6px 10px',
                    backgroundColor: '#ff9800',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px',
                  }}
                >
                  Сагсанд хийх
                </button>
              </div>
            ))}
          </div>

          <div
            style={{
              flex: 1,
              backgroundColor: '#f9f9f9',
              padding: '15px',
              borderRadius: '6px',
              border: '1px solid #ddd',
              minHeight: '200px',
            }}
          >
            <h3
              style={{
                margin: '0 0 10px 0',
                fontSize: '16px',
                borderBottom: '1px solid #ccc',
                paddingBottom: '5px',
              }}
            >
              🛒 Сагс
            </h3>
            {cart.length === 0 ? (
              <p style={{ fontSize: '12px', color: '#888' }}>Сагс хоосон.</p>
            ) : (
              <>
                <ul
                  style={{
                    paddingLeft: '0',
                    listStyle: 'none',
                    fontSize: '13px',
                    margin: '0',
                  }}
                >
                  {cart.map((item) => (
                    <li
                      key={item._id}
                      style={{
                        marginBottom: '8px',
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span>
                        {item.name} (x{item.qty})
                      </span>
                      <span>
                        {(item.price * item.qty).toLocaleString()} ₮
                      </span>
                    </li>
                  ))}
                </ul>
                <div
                  style={{
                    borderTop: '1px solid #ccc',
                    marginTop: '10px',
                    paddingTop: '10px',
                    textAlign: 'right',
                  }}
                >
                  Нийт:{' '}
                  <span style={{ color: '#ff5722', fontWeight: 'bold' }}>
                    {cartTotal.toLocaleString()} ₮
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;