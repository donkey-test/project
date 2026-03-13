import React, { useState, useEffect } from 'react';

interface ToastProps {
  message: string;
  type?: 'error' | 'success';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'error', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const borderColor = type === 'error' ? 'border-[#FF8C69]' : 'border-[#9EFFBF]';

  return (
    <div className={`toast-error ${borderColor}`}>
      {message}
    </div>
  );
};

// Toast Container Component
interface ToastContainerProps {
  toasts: { id: string; message: string; type: 'error' | 'success' }[];
  removeToast: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, removeToast }) => {
  return (
    <div className="fixed bottom-6 right-6 space-y-2 z-50">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

// Hook for toast management
export const useToast = () => {
  const [toasts, setToasts] = useState<{ id: string; message: string; type: 'error' | 'success' }[]>([]);

  const addToast = (message: string, type: 'error' | 'success' = 'error') => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return { toasts, addToast, removeToast };
};

export default Toast;
