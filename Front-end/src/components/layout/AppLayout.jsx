import React from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { LogOut, Fuel, Shield, LayoutDashboard, DollarSign, Users, Award, HelpCircle, ArrowLeft } from 'lucide-react';
import Button from '../common/Button';
import Badge from '../common/Badge';

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const role = useAuthStore((state) => state.role);
  const logout = useAuthStore((state) => state.logout);

  const getNavLinks = () => {
    switch (role) {
      case 'admin':
        return [
          { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
          { name: 'Revenue Audit', path: '/revenue', icon: DollarSign },
          { name: 'Fleet Nodes', path: '/fleet', icon: Users },
        ];
      case 'responder':
        return [
          { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
          { name: 'Earnings & Payouts', path: '/earnings', icon: Award },
        ];
      case 'customer':
      default:
        return [
          { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
          { name: 'Safety Hub', path: '/safety-hub', icon: Shield },
          { name: 'Protection Tiers', path: '/pricing', icon: Award },
          { name: 'Support', path: '/help', icon: HelpCircle },
        ];
    }
  };

  const navLinks = getNavLinks();

  return (
    <div className="min-h-screen bg-brand-light flex flex-col">
      {/* Sticky Global Glassmorphic Navbar */}
      <header className="sticky top-0 z-40 glassmorphic border-b border-borders-outline/10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="p-2 bg-brand-primary rounded-btn text-white">
              <Fuel className="w-5 h-5" />
            </div>
            <div>
              <span className="font-display font-bold text-lg tracking-tight text-brand-dark">NEXFUEL</span>
              <span className="font-mono text-[9px] block text-text-secondary uppercase tracking-widest -mt-1 font-bold">LOGISTICS</span>
            </div>
          </div>

          {/* Navigation tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-surface-low border border-borders-outline/5 p-1 rounded-input">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-btn text-xs font-bold font-mono tracking-wider transition-all ${
                    isActive
                      ? 'bg-brand-dark text-white shadow-sm'
                      : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {link.name}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="hidden lg:flex items-center gap-1.5 font-mono text-[10px] uppercase font-bold"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Landing
            </Button>
            
            <div className="flex items-center gap-2.5">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-text-primary">{user?.name}</p>
                <p className="text-[10px] text-text-secondary font-mono capitalize">{role} Account</p>
              </div>
              <img src={user?.avatar} alt="User Avatar" className="w-8.5 h-8.5 rounded-full border border-borders-outline/10 bg-surface-low" />
            </div>
            
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="p-2.5 rounded-btn bg-surface-low hover:bg-red-50 hover:text-brand-primary text-text-muted border border-borders-outline/10 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-borders-outline/10 py-6 mt-12 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4 font-mono text-[10px] text-text-secondary">
          <span>© 2026 NEXFUEL LOGISTICS INC. ALL RIGHTS RESERVED.</span>
          <div className="flex gap-4">
            <span className="cursor-pointer hover:underline" onClick={() => navigate('/help')}>SECURE DISPATCH NODE</span>
            <span>•</span>
            <span className="text-success">SYSTEM ONLINE</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
