import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, Lock, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { adminLogin } from '../lib/api';
import { useAuth } from '../lib/auth';
import { toast } from 'sonner';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const from = location.state?.from?.pathname || '/benchmark';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await adminLogin(email, password);
      login(response.data.token, response.data.user);
      toast.success('Login successful');
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen mosaic-bg flex items-center justify-center p-6" data-testid="admin-login-page">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 bg-forest flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="font-heading font-bold text-forest text-xl tracking-tight">SentinelX</span>
        </div>

        {/* Form Card */}
        <div className="bg-white border border-hairline/20 p-8 relative">
          {/* Corner Markers */}
          <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-forest" />
          <div className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 border-forest" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-l-2 border-b-2 border-forest" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-forest" />

          <div className="flex items-center gap-2 mb-6">
            <Lock className="w-4 h-4 text-forest" />
            <h1 className="font-mono text-[10px] text-hairline uppercase tracking-widest">Admin Authentication</h1>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-coral/10 border border-coral/20 mb-6" data-testid="login-error">
              <AlertCircle className="w-4 h-4 text-coral" />
              <p className="font-mono text-xs text-coral">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label className="font-mono text-[10px] text-hairline uppercase tracking-widest mb-2 block">
                Email
              </Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@sentinelx.io"
                className="h-11 rounded-none border-hairline/20 font-mono text-sm"
                required
                data-testid="email-input"
              />
            </div>

            <div>
              <Label className="font-mono text-[10px] text-hairline uppercase tracking-widest mb-2 block">
                Password
              </Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-11 rounded-none border-hairline/20 font-mono text-sm"
                required
                data-testid="password-input"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-forest hover:bg-forest-light rounded-xs font-mono text-xs uppercase tracking-widest"
              data-testid="login-submit"
            >
              {loading ? 'Authenticating...' : 'Access Control Panel'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-hairline/10">
            <p className="font-mono text-[10px] text-hairline/60 text-center">
              Demo credentials: admin@sentinelx.io / sentinel2024
            </p>
          </div>
        </div>

        {/* Back to Dashboard */}
        <div className="text-center mt-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="font-mono text-[10px] text-hairline uppercase tracking-widest"
            data-testid="back-to-dashboard"
          >
            ← Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
