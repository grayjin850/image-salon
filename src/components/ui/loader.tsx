'use client';

import { useEffect, useState } from 'react';

export function Loader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#000',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: visible ? 'none' : 'fadeOut 0.5s ease forwards',
      }}
    >
      <p style={{
        fontFamily: 'var(--font-display), serif',
        fontSize: '2rem',
        fontStyle: 'italic',
        color: '#B8860B',
        letterSpacing: '0.1em',
        fontWeight: 300,
      }}>
        Image Salon
      </p>
    </div>
  );
}