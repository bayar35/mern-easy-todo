import { useState } from 'react';
import { useToast } from '../context/ToastContext';

export default function UserProfileModal({ username, onClose, onLogout }) {
  const [activeTab, setActiveTab] = useState('info');
  const toast = useToast();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content profile-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        <div className="profile-header">
          <div className="profile-avatar">
            {username.charAt(0).toUpperCase()}
          </div>
          <h2>{username}</h2>
        </div>

        <div className="profile-tabs">
          <button
            className={activeTab === 'info' ? 'active' : ''}
            onClick={() => setActiveTab('info')}
          >
            📋 Мэдээлэл
          </button>
          <button
            className={activeTab === 'settings' ? 'active' : ''}
            onClick={() => setActiveTab('settings')}
          >
            ⚙️ Тохиргоо
          </button>
        </div>

        <div className="profile-body">
          {activeTab === 'info' && (
            <div>
              <p>
                <b>Хэрэглэгчийн нэр:</b> {username}
              </p>
              <p>
                <b>Гишүүн болсон:</b> Өнөөдөр
              </p>
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <button
                onClick={() => toast.info('Тун удахгүй')}
                className="btn-secondary"
                style={{ width: '100%', marginBottom: '10px' }}
              >
                🔒 Нууц үг солих
              </button>
              <button
                onClick={onLogout}
                className="btn-danger"
                style={{ width: '100%' }}
              >
                🚪 Гарах
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}