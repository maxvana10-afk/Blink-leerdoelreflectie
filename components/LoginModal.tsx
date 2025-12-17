import React, { useState } from 'react';
import { AUTH_CODES } from '../constants';

interface LoginModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onClose, onSuccess }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Only check teacher code
    if (input.trim().toUpperCase() === AUTH_CODES.TEACHER) {
      onSuccess();
    } else {
      setError(true);
      setInput(''); // Clear input on error
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl relative transform transition-all scale-100">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold text-xl"
        >
          ✕
        </button>

        <div className="text-center mb-6">
          <div className="text-5xl mb-2">🔐</div>
          <h2 className="text-2xl font-bold text-slate-800">
            Leerkracht Login
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Voer de toegangscode in
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <input
            type="password"
            autoFocus
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setError(false);
            }}
            placeholder="Wachtwoord..."
            className={`w-full p-4 text-center text-xl font-bold tracking-widest border-2 rounded-xl outline-none transition-colors mb-4
              ${error ? 'border-red-400 bg-red-50 text-red-600' : 'border-slate-200 focus:border-blue-400 focus:bg-blue-50 text-slate-800'}
            `}
          />
          
          {error && (
            <p className="text-red-500 text-sm text-center font-bold mb-4 animate-pulse">
              ⛔ Foute code, probeer het opnieuw.
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-xl font-bold text-white text-lg shadow-md transform active:scale-95 transition-all bg-blue-500 hover:bg-blue-600"
          >
            Inloggen
          </button>
        </form>
        
        {/* Hint for demo purposes */}
        <p className="mt-6 text-xs text-center text-slate-300">
          (Demo code: {AUTH_CODES.TEACHER})
        </p>
      </div>
    </div>
  );
};
