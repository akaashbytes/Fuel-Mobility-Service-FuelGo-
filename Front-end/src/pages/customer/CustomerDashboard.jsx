import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import LivePulse from '../../components/common/LivePulse';
import { Fuel, Truck, MapPin, CreditCard, Shield, Clock, ArrowRight, User } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const services = [
    {
      title: 'Emergency Fuel Request',
      description: 'Run out of gas? Dispatch a nearby mobile refueler with premium grade fuel in minutes.',
      icon: Fuel,
      route: '/fuel-request',
      color: 'text-brand-primary',
      bg: 'bg-brand-primary/10',
    },
    {
      title: 'Roadside Specialist Towing',
      description: 'Flat tire, battery failure, or lockouts. Connect to specialized industrial support.',
      icon: Truck,
      route: '/roadside-request',
      color: 'text-blue-600',
      bg: 'bg-blue-600/10',
    },
    {
      title: 'Live Logistics Tracking',
      description: 'Track active dispatches, responder details, and real-time ETAs on interactive map.',
      icon: MapPin,
      route: '/tracking',
      color: 'text-success',
      bg: 'bg-success/10',
    },
    {
      title: 'Emergency Safety Hub',
      description: 'Active SOS response, live sharing, and safe-route navigation tools.',
      icon: Shield,
      route: '/safety-hub',
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-brand-dark rounded-card p-8 text-white relative overflow-hidden shadow-floating">
        <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-10 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-brand-primary via-transparent to-transparent pointer-events-none" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div>
            <Badge variant="primary" className="mb-3">CUSTOMER WORKSPACE</Badge>
            <h1 className="text-3xl font-bold">Welcome back, {user?.name || 'Alex'}</h1>
            <p className="text-text-secondary text-sm mt-1">Select an operation below to request assistance or monitor live dispatches.</p>
          </div>
          <div className="flex items-center gap-4 bg-brand-light/5 backdrop-blur-sm border border-white/10 p-3 rounded-input">
            <div className="flex items-center gap-3">
              <img src={user?.avatar} alt="avatar" className="w-10 h-10 rounded-full border border-white/20 bg-brand-dark" />
              <div>
                <p className="text-xs text-text-muted font-mono font-bold tracking-wider">{user?.email}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <LivePulse status="success" />
                  <span className="font-mono text-[10px] text-white font-bold tracking-wider">ACTIVE CLIENT</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Order Alert Section (Mock) */}
      <div className="bg-white border-[1.5px] border-brand-primary/20 rounded-card p-6 shadow-industrial flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-brand-primary/10 rounded-btn text-brand-primary shrink-0 animate-pulse">
            <Fuel className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-brand-dark">Active Dispatch: Mobile Refueling</h2>
              <LivePulse status="primary" label="EN ROUTE" />
            </div>
            <p className="text-xs text-text-secondary mt-1">Vehicle refueler dispatched to 42.3601° N, 71.0589° W.</p>
            <div className="flex items-center gap-4 mt-3 text-xs font-mono font-medium text-text-muted">
              <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> ETA: 12 Mins</span>
              <span>•</span>
              <span>Refueler: Marcus V. (ID: RF-928)</span>
            </div>
          </div>
        </div>
        <Button
          variant="secondary"
          size="sm"
          className="shrink-0"
          onClick={() => navigate('/tracking')}
        >
          Track Live Dispatch <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Services Grid */}
      <div>
        <h2 className="font-mono text-xs font-bold text-text-secondary uppercase tracking-widest mb-4">Core Dispatch Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((svc, idx) => {
            const Icon = svc.icon;
            return (
              <Card
                key={idx}
                hoverable
                onClick={() => navigate(svc.route)}
                className="group border border-borders-outline/10 hover:border-brand-primary/20"
              >
                <div className="flex items-start gap-5">
                  <div className={`p-4 rounded-card shrink-0 transition-colors duration-200 ${svc.bg} ${svc.color} group-hover:scale-105`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold group-hover:text-brand-primary transition-colors duration-150 flex items-center gap-1.5">
                      {svc.title}
                    </h3>
                    <p className="text-sm text-text-secondary leading-relaxed">{svc.description}</p>
                    <div className="pt-2 text-xs font-mono font-bold tracking-wider text-brand-primary inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      REQUEST NOW <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Bottom widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Vehicle & Subscription" className="lg:col-span-2">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-surface-low rounded-input border border-borders-outline/10">
            <div className="flex items-center gap-3">
              <div className="bg-brand-dark p-2 text-white rounded-btn">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-text-primary">Tesla Model Y (Red) - 82-SLD-9</p>
                <p className="text-xs text-text-secondary font-mono">VIN: 5YJ3E1EB8LF82930</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/settings')}>
              Edit Settings
            </Button>
          </div>
          <div className="mt-4 flex justify-between items-center text-xs font-mono font-bold text-text-secondary px-2">
            <span>MEMBERSHIP PLAN: Premium Route SOS</span>
            <span className="text-success">ACTIVE UNTIL JUNE 2027</span>
          </div>
        </Card>

        <Card title="Secure Wallet" className="flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-text-secondary font-mono uppercase tracking-wider">Available Balance</span>
              <Badge variant="success">Secured</Badge>
            </div>
            <p className="text-2xl font-mono font-bold text-brand-dark">$140.50</p>
          </div>
          <div className="mt-6">
            <Button
              variant="outline"
              size="sm"
              className="w-full flex justify-center gap-2"
              onClick={() => navigate('/wallet')}
            >
              <CreditCard className="w-4 h-4" /> Manage Wallet
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
