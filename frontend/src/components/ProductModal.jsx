export default function ProductModal({ product, onClose, onAddToCart }) {
  if (!product) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>
        <img
          src={product.image}
          alt={product.name}
          className="modal-image"
          loading="lazy"
        />
        <h2>{product.name}</h2>
        <p className="modal-price">{product.price.toLocaleString()} ₮</p>
        <p className="modal-desc">{product.description}</p>
        <button
          onClick={() => {
            onAddToCart(product);
            onClose();
          }}
          className="btn-primary"
        >
          🛒 Сагсанд хийх
        </button>
      </div>
    </div>
  );
}