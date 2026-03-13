import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Shield, FileSearch, BarChart3, Database, Cpu, LogOut, ExternalLink } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { Button } from '../components/ui/button';

const Layout = () => {
  const location = useLocation();
  const { isAdmin, logout, user } = useAuth();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Shield, index: '01', public: true },
    { path: '/scanner', label: 'Scanner', icon: FileSearch, index: '02', public: true },
    { path: '/benchmark', label: 'Benchmark', icon: BarChart3, index: '03', public: false },
    { path: '/dataset', label: 'Dataset', icon: Database, index: '04', public: false },
    { path: '/model', label: 'Model', icon: Cpu, index: '05', public: false },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-paper border-b border-hairline/20">
        <div className="max-w-[1600px] mx-auto px-6 h-14 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3" data-testid="logo-link">
            <div className="w-8 h-8 bg-forest flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-heading font-bold text-forest text-lg tracking-tight">SentinelX</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const showItem = item.public || isAdmin;
              if (!showItem) return null;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  data-testid={`nav-${item.label.toLowerCase()}`}
                  className={`px-4 py-2 font-mono text-[10px] uppercase tracking-widest transition-colors ${
                    isActive(item.path)
                      ? 'text-forest bg-forest/5'
                      : 'text-hairline hover:text-forest hover:bg-forest/5'
                  }`}
                >
                  <span className="mr-2 opacity-50">{item.index}.</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <a
              href={`${process.env.REACT_APP_BACKEND_URL}/docs`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-hairline border border-hairline/20 hover:border-forest/50 transition-colors"
              data-testid="api-docs-link"
            >
              API Docs
              <ExternalLink className="w-3 h-3" />
            </a>
            
            {isAdmin ? (
              <div className="flex items-center gap-2">
                <span className="hidden sm:block font-mono text-[10px] text-hairline/60">{user?.email}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="h-8 px-3 font-mono text-[10px] uppercase tracking-widest"
                  data-testid="logout-btn"
                >
                  <LogOut className="w-3 h-3 mr-1" />
                  Logout
                </Button>
              </div>
            ) : (
              <Link to="/admin/login" data-testid="admin-login-link">
                <Button
                  variant="default"
                  size="sm"
                  className="h-8 px-4 bg-forest hover:bg-forest-light font-mono text-[10px] uppercase tracking-widest rounded-xs"
                >
                  Admin
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-hairline/20 py-6">
        <div className="max-w-[1600px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-mono text-[10px] text-hairline/60 uppercase tracking-widest">
            SentinelX Defender v2.0 · Hybrid Malware Detection System
          </p>
          <p className="font-mono text-[10px] text-hairline/40 uppercase tracking-widest">
            YARA + GBM + LLM Fusion Architecture
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
