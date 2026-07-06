'use client';
import { useNav } from '../hooks/useNav';

export default function NotFound() {
  const navigate = useNav();
  return (
    <div style={{
      minHeight: '80vh', display: 'grid', placeItems: 'center', textAlign: 'center',
      fontFamily: 'var(--mono)', padding: '2rem',
    }}>
      <div>
        <div style={{ color: 'var(--accent)', fontSize: '1rem', marginBottom: '1rem' }}>// 404</div>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>Page not found</h1>
        <p style={{ color: 'var(--muted)', marginBottom: '2rem' }}>
          The page you're looking for doesn't exist.
        </p>
        <button
          onClick={() => navigate('home')}
          style={{
            background: 'var(--accent)', color: '#fff', border: 'none',
            padding: '0.75rem 1.5rem', borderRadius: '4px', cursor: 'pointer',
            fontFamily: 'var(--mono)', fontSize: '0.875rem',
          }}
        >
          Go home →
        </button>
      </div>
    </div>
  );
}
