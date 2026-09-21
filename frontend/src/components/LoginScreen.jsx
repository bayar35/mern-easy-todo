import { useState } from 'react';
import api from '../utils/api';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from './LoadingSpinner';

export default function LoginScreen({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [authInput, setAuthInput] = useState({ user: '', pass: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const url = isRegister ? 'register' : 'login';
      const res = await api.post(`/api/auth/${url}`, {
        username: authInput.user,
        password: authInput.pass,
      });

      if (isRegister) {
        toast.success('Амжилттай бүртгэгдлээ!');
        setIsRegister(false);
        setAuthInput({ user: '', pass: '' });
      } else {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('username', res.data.username);
        toast.success(`Тавтай морил, ${res.data.username}!`);
        onLogin(res.data.token, res.data.username);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Алдаа гарлаа';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>{isRegister ? 'Бүртгүүлэх 📝' : 'Нэвтрэх 🔒'}</h2>

      {error && <p style={{ color: 'red', fontSize: '14px' }}>{error}</p>}

      {loading ? (
        <LoadingSpinner text="Түр хүлээнэ үү..." />
      ) : (
        <form onSubmit={handleAuth} className="login-form">
          <input
            type="text"
            placeholder="Хэрэглэгчийн нэр"
            value={authInput.user}
            onChange={(e) =>
              setAuthInput({ ...authInput, user: e.target.value })
            }
            required
            minLength={3}
          />
          <input
            type="password"
            placeholder="Нууц үг (6+ тэмдэгт)"
            value={authInput.pass}
            onChange={(e) =>
              setAuthInput({ ...authInput, pass: e.target.value })
            }
            required
            minLength={6}
          />
          <button type="submit" className="btn-primary">
            {isRegister ? 'Бүртгүүлэх' : 'Нэвтрэх'}
          </button>
        </form>
      )}

      <p className="toggle-auth" onClick={() => setIsRegister(!isRegister)}>
        {isRegister ? 'Бүртгэлтэй юу? Нэвтрэх' : 'Шинэ үү? Бүртгүүлэх'}
      </p>
    </div>
  );
}