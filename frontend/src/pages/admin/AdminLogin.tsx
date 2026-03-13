import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, Lock, AlertCircle } from 'lucide-react';
import LCornerMarkers from '../../components/LCornerMarkers';

const AdminLogin: React.FC = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/admin/benchmark';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'sentinel_admin_2026') {
      sessionStorage.setItem('sx_admin', '1');
      navigate(from, { replace: true });
    } else {
      setError('Invalid password');
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div className="min-h-screen mosaic-bg flex items-center justify-center p-6" data-testid="admin-login-page">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 bg-[#1A3C2B] flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="font-heading font-bold text-[#1A3C2B] text-xl tracking-tight">SENTINELX</span>
        </div>

        {/* Form Card */}
        <LCornerMarkers className={`bg-white border border-[rgba(58,58,56,0.2)] p-8 ${shake ? 'animate-[shake_0.5s]' : ''}`}>
          <div className="flex items-center gap-2 mb-6">
            <Lock className="w-4 h-4 text-[#1A3C2B]" />
            <h1 className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#6B6B68]">ADMIN ACCESS</h1>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-[rgba(255,140,105,0.1)] border border-[rgba(255,140,105,0.3)] mb-6" data-testid="login-error">
              <AlertCircle className="w-4 h-4 text-[#FF8C69]" />
              <p className="font-mono text-[11px] text-[#FF8C69]">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#6B6B68] mb-2 block">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-11 px-4 border border-[rgba(58,58,56,0.2)] bg-white font-mono text-sm focus:outline-none focus:border-[#1A3C2B] transition-colors"
                required
                data-testid="password-input"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#1A3C2B] text-white font-heading font-bold text-sm uppercase tracking-wide hover:bg-[#2C4E3D] transition-colors"
              data-testid="login-submit"
            >
              Access Control Panel
            </button>
          </form>
        </LCornerMarkers>

        {/* Back Link */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/')}
            className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#6B6B68] hover:text-[#1A3C2B]"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  );
};

export default AdminLogin;
