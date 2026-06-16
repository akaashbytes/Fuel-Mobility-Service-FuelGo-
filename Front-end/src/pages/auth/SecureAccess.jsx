import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { Shield, Mail, Lock, User, CheckCircle2 } from 'lucide-react';

export default function SecureAccess() {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('customer'); // 'customer', 'responder', 'admin'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const loginStore = useAuthStore((state) => state.login);
  const registerStore = useAuthStore((state) => state.register);
  const loading = useAuthStore((state) => state.loading);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all required fields.');
      return;
    }
    if (!isLogin && !name) {
      setError('Please enter your name.');
      return;
    }

    try {
      if (isLogin) {
        await loginStore(email, password, role);
      } else {
        await registerStore(name, email, password, role);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    }
  };

  return (
    <div className="min-h-screen bg-brand-light flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Background Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:32px_32px]" />
      
      {/* Decorative Brand Watermark */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-brand-primary/5 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-brand-dark/5 rounded-full filter blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-surface-lowest rounded-card shadow-floating border border-borders-outline/15 overflow-hidden"
      >
        <div className="bg-brand-dark text-white px-8 py-7 text-center relative">
          <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/30">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-primary" />
            </span>
            <span className="font-mono text-[9px] font-bold text-white tracking-widest">SECURE</span>
          </div>

          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand-primary/10 border border-brand-primary/20 mb-3">
            <Shield className="w-6 h-6 text-brand-primary animate-pulse" />
          </div>
          
          <h1 className="font-sans text-2xl font-bold tracking-tight">NEXFUEL</h1>
          <p className="font-mono text-[10px] text-text-secondary uppercase tracking-widest mt-1">Logistics & Mobility Hub</p>
        </div>

        <div className="p-8">
          {/* Role selector to easily switch flows */}
          <div className="mb-6">
            <label className="font-mono text-[11px] font-semibold text-text-secondary uppercase tracking-wider block mb-2 text-center">
              Select Operating Environment
            </label>
            <div className="grid grid-cols-3 gap-2 bg-surface-low p-1 rounded-input border border-borders-outline/10">
              {['customer', 'responder', 'admin'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`py-2 px-3 rounded-btn text-xs font-bold font-mono tracking-wider transition-all duration-200 capitalize ${
                    role === r
                      ? 'bg-brand-dark text-white shadow-sm'
                      : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  key="name-field"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Input
                    label="Full Name"
                    placeholder="Enter your name"
                    id="name"
                    icon={User}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <Input
              label="Secure ID / Email"
              placeholder="Enter your email"
              id="email"
              type="email"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Access Code / Password"
              placeholder="••••••••"
              id="password"
              type="password"
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && (
              <div className="bg-red-50 border-l-2 border-red-500 p-3 rounded-md">
                <p className="text-xs text-red-700 font-medium font-mono">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full py-3"
              loading={loading}
            >
              {isLogin ? `Access ${role === 'admin' ? 'Operations' : role === 'responder' ? 'Responder Hub' : 'Dashboard'}` : 'Register Access Account'}
            </Button>
          </form>

          {/* Toggle Login/Register */}
          <div className="mt-6 text-center border-t border-borders-outline/10 pt-4">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-xs text-text-secondary hover:text-brand-primary font-semibold transition-colors duration-150"
            >
              {isLogin
                ? "Don't have credentials? Request Access Account"
                : 'Already have credentials? Access Dashboard'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
