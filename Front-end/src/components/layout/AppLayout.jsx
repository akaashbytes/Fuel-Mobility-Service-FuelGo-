import React, { useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import {
  LogOut,
  Fuel,
  Shield,
  LayoutDashboard,
  DollarSign,
  Users,
  Award,
  HelpCircle,
  ArrowLeft,
  Menu,
  X,
  User,
  ShoppingBag,
  ShieldCheck,
  ClipboardList,
  Map,
  CreditCard,
  PieChart,
  Briefcase,
  MessageSquare,
  Activity
} from 'lucide-react';
import Button from '../common/Button';
import Badge from '../common/Badge';

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const role = useAuthStore((state) => state.role);
  const logout = useAuthStore((state) => state.logout);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getNavLinks = () => {
    switch (role) {
      case 'admin':
        return [
          { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
          { name: 'Orders', path: '/admin/orders', icon: ClipboardList },
          { name: 'Providers', path: '/admin/providers', icon: Users },
          { name: 'Payments', path: '/revenue', icon: DollarSign },
          { name: 'Analytics', path: '/admin/analytics', icon: PieChart },
          { name: 'Collaborators', path: '/admin/collaborators', icon: Briefcase },
          { name: 'Feedback', path: '/admin/feedback', icon: MessageSquare },
          { name: 'Contact Center', path: '/admin/contact-center', icon: ShieldCheck },
          { name: 'Operations', path: '/admin/operations', icon: Activity },
          { name: 'Service Areas', path: '/admin/service-areas', icon: Map },
        ];
      case 'responder':
        return [
          { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
          { name: 'Earnings', path: '/earnings', icon: DollarSign },
          { name: 'Verification', path: '/verification', icon: ShieldCheck },
        ];
      case 'customer':
      default:
        return [
          { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
          { name: 'Request Fuel', path: '/fuel-request', icon: Fuel },
          { name: 'Orders', path: '/orders', icon: ShoppingBag },
          { name: 'Profile', path: '/settings', icon: User },
        ];
    }
  };

  const navLinks = getNavLinks();

  const handleLinkClick = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-brand-light flex flex-col relative">
      
      {/* Sticky Global Glassmorphic Navbar */}
      <header className="sticky top-0 z-40 glassmorphic border-b border-borders-outline/10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="p-2 bg-brand-primary rounded-btn text-white">
              <Fuel className="w-5 h-5" />
            </div>
            <div>
              <span className="font-display font-bold text-lg tracking-tight text-brand-dark">NEXFUEL</span>
              <span className="font-mono text-[9px] block text-text-secondary uppercase tracking-widest -mt-1 font-bold">LOGISTICS</span>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-surface-low border border-borders-outline/5 p-1 rounded-input">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => handleLinkClick(link.path)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-btn text-xs font-bold font-mono tracking-wider transition-all cursor-pointer ${
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

          {/* Right Header Panel */}
          <div className="flex items-center gap-4">
            
            {/* Hamburger button on Mobile */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-btn bg-surface-low text-text-muted border border-borders-outline/10 hover:text-text-primary transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>

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
                <p className="text-[10px] text-text-secondary font-mono capitalize">{role === 'responder' ? 'Provider' : role} Account</p>
              </div>
              <img src={user?.avatar} alt="User Avatar" className="w-8.5 h-8.5 rounded-full border border-borders-outline/10 bg-surface-low" />
            </div>
            
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="p-2.5 rounded-btn bg-surface-low hover:bg-red-50 hover:text-brand-primary text-text-muted border border-borders-outline/10 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-borders-outline/10 bg-white/95 backdrop-blur-md transition-all duration-300">
            <nav className="flex flex-col gap-2 p-4">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                return (
                  <button
                    key={link.path}
                    onClick={() => handleLinkClick(link.path)}
                    className={`flex items-center gap-3 w-full px-4 py-3 rounded-btn text-sm font-bold font-mono tracking-wider transition-all cursor-pointer ${
                      isActive
                        ? 'bg-brand-primary text-white shadow-sm'
                        : 'text-text-muted hover:bg-surface-low hover:text-text-primary'
                    }`}
                  >
                    <Icon className="w-4.5 h-4.5" />
                    {link.name}
                  </button>
                );
              })}
            </nav>
          </div>
        )}
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
