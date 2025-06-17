import React from 'react';

const modalStyles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  modal: {
    backgroundColor: '#14171C',
    padding: '1.5rem',
    borderRadius: '4px',
    width: '100%',
    maxWidth: '400px',
    position: 'relative'
  },
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '14px',
    fontSize: '18px',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer'
  }
};

export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.modal}>
        <button style={modalStyles.closeButton} onClick={onClose}>×</button>
        {children}
      </div>
    </div>
  );
}
