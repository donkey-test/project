import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, ExternalLink } from 'lucide-react';

const Navigation: React.FC = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  const publicLinks = [
    { path: '/', label: 'Dashboard', index: '01' },
    { path: '/scanner', label: 'Scanner', index: '02' },
    { path: '/threats', label: 'Threat Feed', index: '03' },
    { path: '/reports', label: 'Reports', index: '04' },
  ];

  const adminLinks = [
    { path: '/admin/benchmark', label: 'Benchmark', index: '01' },
    { path: '/admin/dataset', label: 'Dataset', index: '02' },
    { path: '/admin/model', label: 'Model', index: '03' },
  ];

  const links = isAdminRoute ? adminLinks : publicLinks;
  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    sessionStorage.removeItem('sx_admin');
    window.location.href = '/';
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-white/90 backdrop-blur-sm border-b border-[rgba(58,58,56,0.2)]">
      <div className="max-w-[1600px] mx-auto px-6 h-full flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3" data-testid="logo-link">
          <div className="w-8 h-8 bg-[#1A3C2B] flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="font-heading font-bold text-[#1A3C2B] text-lg tracking-tight">SENTINELX</span>
          <span className="font-mono text-[9px] px-1.5 py-0.5 bg-[rgba(26,60,43,0.1)] text-[#1A3C2B] uppercase tracking-[0.1em]">
            v2.0
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {isAdminRoute && (
            <Link
              to="/"
              className="px-3 py-2 font-mono text-[10px] uppercase tracking-[0.1em] text-[#6B6B68] hover:text-[#1A3C2B] transition-colors"
            >
              ← Public View
            </Link>
          )}
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              data-testid={`nav-${link.label.toLowerCase().replace(' ', '-')}`}
              className={`px-4 py-2 font-mono text-[10px] uppercase tracking-[0.1em] transition-colors ${
                isActive(link.path)
                  ? 'text-[#1A3C2B] bg-[rgba(26,60,43,0.05)]'
                  : 'text-[#6B6B68] hover:text-[#1A3C2B] hover:bg-[rgba(26,60,43,0.03)]'
              }`}
            >
              <span className="opacity-50 mr-1">{link.index}.</span>
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <a
            href="http://localhost:8000/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-[#6B6B68] border border-[rgba(58,58,56,0.2)] hover:border-[#1A3C2B] hover:text-[#1A3C2B] transition-colors"
            data-testid="api-docs-link"
          >
            API Docs
            <ExternalLink className="w-3 h-3" />
          </a>
          
          {isAdminRoute && (
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-[#FF8C69] border border-[rgba(255,140,105,0.3)] hover:bg-[rgba(255,140,105,0.1)] transition-colors"
              data-testid="logout-btn"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navigation;
