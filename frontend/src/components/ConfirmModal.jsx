import { useEffect } from 'react';
import '../styles/ConfirmModal.css';

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", isDanger = false, icon }) {
  
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="confirm-overlay" onClick={onClose}>
      <div className="confirm-card" onClick={(e) => e.stopPropagation()}>
        <div className={`confirm-icon-wrapper ${isDanger ? 'icon-danger' : 'icon-primary'}`}>
          {icon}
        </div>
        <div className="confirm-content">
        
          <h3 className="confirm-title">{title}</h3>
          <p className="confirm-message">{message}</p>
        </div>

        <div className="confirm-actions">
          <button className="btn-cancel" onClick={onClose}>
            Batal
          </button>
          <button 
            className={`btn-confirm ${isDanger ? 'btn-danger' : 'btn-primary'}`} 
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}