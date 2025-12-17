import { useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import '../styles/InfoModal.css';

export default function InfoModal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="btn-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        
        <div className="modal-content-scroll">
          <div className="modal-body">
            {children}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-understand" onClick={onClose}>
            Saya Mengerti
          </button>
        </div>
      </div>
    </div>
  );
}