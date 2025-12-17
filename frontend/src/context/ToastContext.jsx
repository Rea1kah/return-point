import { createContext, useContext, useState, useCallback } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';
import '../styles/Toast.css';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.map(toast => 
      toast.id === id ? { ...toast, closing: true } : toast
    ));
    
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 400); 
  }, []);

  const showToast = useCallback((message, type = 'info', title) => {
    const id = Date.now();
    
    let defaultTitle = 'Notification';
    if (!title) {
      if (type === 'success') defaultTitle = 'Success!';
      if (type === 'error') defaultTitle = 'Error!';
      if (type === 'info') defaultTitle = 'Information';
    } else {
      defaultTitle = title;
    }

    const duration = 5000;

    setToasts((prev) => [...prev, { id, message, type, title: defaultTitle }]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, [removeToast]);

  const getIcon = (type) => {
    switch(type) {
      case 'success': return <FaCheckCircle />;
      case 'error': return <FaExclamationCircle />;
      default: return <FaInfoCircle />;
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div 
            key={toast.id} 
            className={`toast-card toast-${toast.type} ${toast.closing ? 'closing' : ''}`}
          >
            <div className="toast-icon">
              {getIcon(toast.type)}
            </div>
            <div className="toast-content">
              <h4 className="toast-title">{toast.title}</h4>
              <p className="toast-message">{toast.message}</p>
            </div>
            <button 
              className="toast-close" 
              onClick={() => removeToast(toast.id)}
            >
              <FaTimes />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};