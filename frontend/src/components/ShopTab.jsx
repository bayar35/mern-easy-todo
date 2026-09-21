import {
  useState,
  useEffect,
  useMemo,
  useCallback,
  memo,
} from 'react';
import api from '../utils/api';
import { useToast } from '../context/ToastContext';
import useDebounce from '../hooks/useDebounce';
import SearchBar from './SearchBar';
import LoadingSpinner from './LoadingSpinner';
import ProductModal from './ProductModal';
import CheckoutModal from './CheckoutModal';

const ProductCard = memo(function ProductCard({ product, onView, onAdd }) {
  return (
    <div className="product-card">
      <img
        src={product.image}
        alt={product.name}
        onClick={() => onView(product)}
        loading="lazy"
        className="product-image"
      />
      <h4 onClick={() => onView(product)}>{product.name}</h4>
      <p className="product-price">
        {product.price.toLocaleString()} ₮
      </p>
      <div className="product-actions">
        <button onClick={() => onView(product)} className="btn-secondary">
          Дэлгэрэнгүй
        </button>
        <button onClick={() => onAdd(product)} className="btn-cart">
          🛒
        </button>
      </div>
    </div>
  );
});

export default function ShopTab({ token }) {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const toast = useToast();

  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    const params = debouncedSearch ? `?search=${debouncedSearch}` : '';
    api
      .get(`/api/products${params}`)
      .then((res) => setProducts(res.data))
      .catch(() => toast.error('Бараа татахад алдаа'))
      .finally(() => setLoading(false));
  }, [token, debouncedSearch, toast]);

  const addToCart = useCallback(
    (product) => {
      setCart((prev) => {
        const exists = prev.find((i) => i._id === product._id);
        if (exists) {
          return prev.map((i) =>
            i._id === product._id ? { ...i, qty: i.qty + 1 } : i
          );
        }
        return [...prev, { ...product, qty: 1 }];
      });
      toast.success(`${product.name} сагсанд нэмэгдлээ`);
    },
    [toast]
  );

  const removeFromCart = useCallback((id) => {
    setCart((prev) => prev.filter((i) => i._id !== id));
  }, []);

  const cartTotal = useMemo(
    () => cart.reduce((s, i) => s + i.price * i.qty, 0),
    [cart]
  );

  const cartCount = useMemo(
    () => cart.reduce((s, i) => s + i.qty, 0),
    [cart]
  );

  return (
    <div>
      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="🔍 Бараа хайх..."
      />

      <div className="shop-layout">
        <div className="products-grid">
          {loading ? (
            <LoadingSpinner text="Бараа ачаалж байна..." />
          ) : products.length === 0 ? (
            <p className="empty">Бараа олдсонгүй</p>
          ) : (
            products.map((p) => (
              <ProductCard
                key={p._id}
                product={p}
                onView={setSelectedProduct}
                onAdd={addToCart}
              />
            ))
          )}
        </div>

        <div className="cart-panel">
          <h3>
            🛒 Сагс {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </h3>

          {cart.length === 0 ? (
            <p className="empty">Сагс хоосон</p>
          ) : (
            <>
              <ul className="cart-list">
                {cart.map((item) => (
                  <li key={item._id} className="cart-item">
                    <div>
                      <b>{item.name}</b>
                      <div className="cart-qty">
                        {item.qty} × {item.price.toLocaleString()} ₮
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="btn-remove"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>

              <div className="cart-total">
                Нийт: <b>{cartTotal.toLocaleString()} ₮</b>
              </div>

              <button
                onClick={() => setShowCheckout(true)}
                className="btn-primary"
                style={{ width: '100%' }}
              >
                Захиалах
              </button>
            </>
          )}
        </div>
      </div>

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={addToCart}
        />
      )}

      {showCheckout && (
        <CheckoutModal
          cart={cart}
          total={cartTotal}
          onClose={() => setShowCheckout(false)}
          onComplete={() => setCart([])}
        />
      )}
    </div>
  );
}