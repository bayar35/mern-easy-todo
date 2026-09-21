import { useState, useCallback, lazy, Suspense } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import LoginScreen from './components/LoginScreen';
import ThemeToggle from './components/ThemeToggle';
import UserProfileModal from './components/UserProfileModal';

// 🚀 Code splitting — lazy load
const TodoTab = lazy(() => import('./components/TodoTab'));
const ChatTab = lazy(() => import('./components/ChatTab'));
const ShopTab = lazy(() => import('./components/ShopTab'));

function MainApp() {
  const [activeTab, setActiveTab] = useState('todo');
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [username, setUsername] = useState(
    localStorage.getItem('username') || ''
  );
  const [showProfile, setShowProfile] = useState(false);

  const handleLogout = useCallback(() => {
    localStorage.clear();
    setToken('');
    setUsername('');
    window.location.reload();
  }, []);

  const handleLogin = useCallback((newToken, newUsername) => {
    setToken(newToken);
    setUsername(newUsername);
  }, []);

  if (!token) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  const tabs = [
    { key: 'todo', label: '📋 Ажил' },
    { key: 'chat', label: '💬 Чат' },
    { key: 'shop', label: '🛒 Дэлгүүр' },
  ];

  return (
    <div className="app-container">
      <div className="app-header">
        <span>
          <b>{username}</b> 👋
        </span>
        <div className="header-actions">
          <ThemeToggle />
          <button
            onClick={() => setShowProfile(true)}
            className="btn-icon"
            title="Профайл"
          >
            👤
          </button>
          <button onClick={handleLogout} className="btn-danger">
            Гарах
          </button>
        </div>
      </div>

      <div className="tabs">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <Suspense fallback={<LoadingSpinner text="Ачаалж байна..." />}>
        {activeTab === 'todo' && <TodoTab token={token} />}
        {activeTab === 'chat' && (
          <ChatTab token={token} username={username} />
        )}
        {activeTab === 'shop' && <ShopTab token={token} />}
      </Suspense>

      {showProfile && (
        <UserProfileModal
          username={username}
          onClose={() => setShowProfile(false)}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <MainApp />
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}