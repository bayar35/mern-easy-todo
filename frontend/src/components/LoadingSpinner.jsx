export default function LoadingSpinner({ size = 40, text = '' }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        gap: '10px',
      }}
    >
      <div
        style={{
          width: size,
          height: size,
          border: '4px solid #e0e0e0',
          borderTop: '4px solid #007BFF',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}
      />
      {text && <p style={{ color: '#666', fontSize: '14px' }}>{text}</p>}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}