import { useState, useEffect, useRef, memo } from 'react';
import api, { API_URL } from '../utils/api';
import { io } from 'socket.io-client';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from './LoadingSpinner';

const socket = io(API_URL, { autoConnect: true });

const MessageItem = memo(function MessageItem({ msg, isOwn }) {
  return (
    <div className={`message-row ${isOwn ? 'own' : 'other'}`}>
      <div className="message-sender">{msg.sender}</div>
      <span className="message-bubble">{msg.text}</span>
    </div>
  );
});

export default function ChatTab({ token, username }) {
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(socket.connected);
  const chatEndRef = useRef(null);
  const toast = useToast();

  // Socket events
  useEffect(() => {
    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  // Load + receive
  useEffect(() => {
    if (!token) return;

    api
      .get('/api/messages')
      .then((res) => setMessages(res.data))
      .catch(() => toast.error('Мессеж татахад алдаа'))
      .finally(() => setLoading(false));

    socket.on('receiveMessage', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => socket.off('receiveMessage');
  }, [token, toast]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendChatMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    socket.emit('sendMessage', { sender: username, text: chatInput });
    setChatInput('');
  };

  return (
    <div>
      <div className="chat-status">
        <span className={connected ? 'dot-online' : 'dot-offline'} />
        {connected ? 'Холбогдсон' : 'Холбогдоогүй'}
      </div>

      <div className="chat-box">
        {loading ? (
          <LoadingSpinner text="Мессеж ачаалж байна..." />
        ) : messages.length === 0 ? (
          <p className="empty">Мессеж байхгүй. Эхлээд бичээрэй!</p>
        ) : (
          messages.map((msg, i) => (
            <MessageItem
              key={msg._id || i}
              msg={msg}
              isOwn={msg.sender === username}
            />
          ))
        )}
        <div ref={chatEndRef} />
      </div>

      <form onSubmit={sendChatMessage} className="chat-form">
        <input
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Мессеж бичих..."
          maxLength={500}
        />
        <button type="submit" className="btn-primary">
          Илгээх
        </button>
      </form>
    </div>
  );
}