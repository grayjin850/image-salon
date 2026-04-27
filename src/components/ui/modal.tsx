'use client';

import { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 9999, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={onClose}
    >
      <div
        style={{ backgroundColor: '#1a1a1a', border: '1px solid #B8860B', padding: '2rem', maxWidth: '400px', width: '90%' }}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <h2 style={{ color: '#B8860B', fontSize: '1.25rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
            {title}
          </h2>
        )}
        {children}
        <button
          onClick={onClose}
          style={{ marginTop: '1.5rem', color: '#999', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}
        >
          Close
        </button>
      </div>
    </div>
  );
}