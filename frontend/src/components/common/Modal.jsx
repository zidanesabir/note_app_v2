import React from 'react';
import Button from './Button.jsx';

const Modal = ({ title, isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="glass-card p-6 rounded-2xl w-full max-w-lg shadow-2xl border border-neutral-200 animate-scale-in">
        <div className="flex justify-between items-center mb-4 border-b pb-3 border-neutral-200">
          <h3 className="text-xl font-heading font-bold text-gradient">{title}</h3>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-800 text-2xl font-bold transition-colors duration-200"
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>
        <div className="modal-content max-h-96 overflow-y-auto pr-2">
          {children}
        </div>
        <div className="mt-4 pt-3 border-t border-neutral-200 flex justify-end">
          <Button onClick={onClose} className="bg-neutral-200 hover:bg-neutral-300 text-neutral-700 py-2 px-4 rounded-lg font-semibold">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Modal;