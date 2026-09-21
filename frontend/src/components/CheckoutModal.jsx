import { useState } from 'react';
import { useToast } from '../context/ToastContext';

export default function CheckoutModal({ cart, total, onClose, onComplete }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    payment: 'cash',
  });
  const toast = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address) {
      toast.error('Бүх талбарыг бөглөнө үү');
      return;
    }
    setStep(2);
  };

  const handleConfirm = () => {
    toast.success('Захиалга амжилттай! 🎉');
    setTimeout(() => {
      onComplete();
      onClose();
    }, 1500);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content checkout-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        {step === 1 && (
          <>
            <h2>🚚 Хүргэлтийн мэдээлэл</h2>
            <form onSubmit={handleSubmit} className="checkout-form">
              <input
                placeholder="Нэр"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <input
                placeholder="Утасны дугаар"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                required
              />
              <input
                placeholder="Хаяг"
                value={form.address}
                onChange={(e) =>
                  setForm({ ...form, address: e.target.value })
                }
                required
              />
              <select
                value={form.payment}
                onChange={(e) =>
                  setForm({ ...form, payment: e.target.value })
                }
              >
                <option value="cash">💵 Бэлэн</option>
                <option value="card">💳 Карт</option>
                <option value="qpay">📱 QPay</option>
              </select>
              <button type="submit" className="btn-primary">
                Үргэлжлүүлэх
              </button>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <h2>✅ Захиалга баталгаажуулах</h2>
            <div className="checkout-summary">
              <p>
                <b>Нэр:</b> {form.name}
              </p>
              <p>
                <b>Утас:</b> {form.phone}
              </p>
              <p>
                <b>Хаяг:</b> {form.address}
              </p>
              <p>
                <b>Төлбөр:</b> {form.payment}
              </p>
              <hr />
              {cart.map((item) => (
                <p key={item._id}>
                  {item.name} × {item.qty} ={' '}
                  {(item.price * item.qty).toLocaleString()} ₮
                </p>
              ))}
              <hr />
              <p className="checkout-total">
                Нийт: <b>{total.toLocaleString()} ₮</b>
              </p>
            </div>
            <div className="checkout-actions">
              <button
                onClick={() => setStep(1)}
                className="btn-secondary"
              >
                ← Буцах
              </button>
              <button onClick={handleConfirm} className="btn-primary">
                Захиалах
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}