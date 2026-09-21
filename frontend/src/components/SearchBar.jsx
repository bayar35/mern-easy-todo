export default function SearchBar({ value, onChange, placeholder = 'Хайх...' }) {
  return (
    <div style={{ position: 'relative', marginBottom: '10px' }}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '10px 35px 10px 10px',
          borderRadius: '6px',
          border: '1px solid #ccc',
          fontSize: '14px',
          boxSizing: 'border-box',
        }}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          style={{
            position: 'absolute',
            right: '8px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '16px',
            color: '#999',
          }}
        >
          ✕
        </button>
      )}
    </div>
  );
}