import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import LivePulse from '../../components/common/LivePulse';
import {
  Fuel,
  Truck,
  MapPin,
  CreditCard,
  Shield,
  Clock,
  ArrowRight,
  User,
  Bell,
  AlertTriangle,
  RefreshCw,
  Plus,
  X,
  CheckCircle2
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [vehicles, setVehicles] = useState([
    { id: 1, make: 'Tesla', model: 'Model Y', color: 'Red', plate: '82-SLD-9', vin: '5YJ3E1EB8LF82930', fuel: 'Electric (EV Boost)' },
    { id: 2, make: 'BMW', model: '330i', color: 'Black', plate: '41-XDF-2', vin: 'WBA8K1C58KF20391', fuel: '91 Premium' }
  ]);
  const [activeOrder, setActiveOrder] = useState({
    id: 'NX-28941-F',
    type: 'Mobile Refueling',
    fuelType: '91 Premium',
    quantity: '5 Gallons',
    location: '42.3601° N, 71.0589° W',
    eta: '12 Mins',
    provider: 'Marcus Vance',
    providerId: 'RF-928'
  });

  const [recentOrders, setRecentOrders] = useState([
    { id: 'NX-28901-C', date: 'June 12, 2026', type: '91 Premium', quantity: '8 Gallons', status: 'COMPLETED', total: '$63.80' },
    { id: 'NX-10294-A', date: 'June 08, 2026', type: '87 Regular', quantity: '5 Gallons', status: 'COMPLETED', total: '$46.25' },
    { id: 'NX-09281-C', date: 'May 22, 2026', type: 'Diesel', quantity: '12 Gallons', status: 'CANCELLED', total: '$84.88' },
  ]);

  const notifications = [
    { id: 1, text: 'Refueler Marcus Vance is en route to your vehicle.', time: '2 mins ago', type: 'info' },
    { id: 2, text: 'Payment of $49.25 authorized successfully via Razorpay.', time: '5 mins ago', type: 'success' },
    { id: 3, text: 'New vehicle BMW 330i added to your garage profile.', time: '1 day ago', type: 'system' }
  ];

  useEffect(() => {
    // Simulate API fetch delay for skeleton loading state
    const timer = setTimeout(() => {
      setLoading(false);
    }, 750);
    return () => clearTimeout(timer);
  }, []);

  const handleSimulateError = () => {
    setError('Failed to fetch real-time dispatch coordinates. Please check your connectivity.');
  };

  const handleClearError = () => {
    setError(null);
    setLoading(true);
    setTimeout(() => setLoading(false), 500);
  };

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-6">
        <div className="bg-red-50 border-[1.5px] border-red-500/20 rounded-card p-8 text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-red-800 font-display">System Sync Interrupted</h2>
          <p className="text-sm text-red-700 max-w-md mx-auto leading-relaxed">{error}</p>
          <div className="flex justify-center gap-3 pt-2">
            <Button variant="primary" size="sm" onClick={handleClearError} className="flex items-center gap-1">
              <RefreshCw className="w-4 h-4" /> Retry Sync
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        {/* Header Banner Skeleton */}
        <div className="h-44 bg-surface-high rounded-card w-full" />
        
        {/* Active Order Card Skeleton */}
        <div className="h-28 bg-surface-high rounded-card w-full" />

        {/* Services / Recent Orders grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-64 bg-surface-high rounded-card md:col-span-2" />
          <div className="h-64 bg-surface-high rounded-card" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 relative">
      
      {/* Header Banner with Notifications Button */}
      <div className="bg-brand-dark rounded-card p-8 text-white relative overflow-hidden shadow-floating">
        <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-10 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-brand-primary via-transparent to-transparent pointer-events-none" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div>
            <Badge variant="primary" className="mb-3">CUSTOMER WORKSPACE</Badge>
            <h1 className="text-3xl font-bold font-display">Welcome back, {user?.name || 'Alex'}</h1>
            <p className="text-text-secondary text-sm mt-1">Manage vehicles, request refuels, and track live dispatches.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-3 rounded-btn bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all cursor-pointer relative"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-brand-primary rounded-full animate-ping" />
            </button>
            <button 
              onClick={handleSimulateError}
              className="p-3 rounded-btn bg-white/5 border border-white/10 text-text-secondary hover:bg-white/10 transition-all text-xs font-mono font-bold cursor-pointer"
            >
              Simulate Error
            </button>
          </div>
        </div>
      </div>

      {/* Notifications Sidebar Panel */}
      {showNotifications && (
        <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-floating border-l border-borders-outline/15 z-50 p-6 flex flex-col justify-between animate-in slide-in-from-right duration-300">
          <div className="space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-borders-outline/10">
              <h3 className="font-bold text-text-primary flex items-center gap-2">
                <Bell className="w-4.5 h-4.5 text-brand-primary" /> Active Feed
              </h3>
              <button onClick={() => setShowNotifications(false)} className="text-text-muted hover:text-text-primary cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              {notifications.map((n) => (
                <div key={n.id} className="p-3.5 bg-surface-low rounded-btn border border-borders-outline/5 text-xs">
                  <p className="text-text-primary leading-relaxed">{n.text}</p>
                  <span className="text-[10px] text-text-secondary font-mono block mt-1.5">{n.time}</span>
                </div>
              ))}
            </div>
          </div>
          <Button variant="outline" size="sm" className="w-full text-center" onClick={() => setShowNotifications(false)}>
            Close Feed
          </Button>
        </div>
      )}

      {/* Active Order Card */}
      {activeOrder ? (
        <div className="bg-white border-[1.5px] border-brand-primary/20 rounded-card p-6 shadow-industrial flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3.5 bg-brand-primary/10 rounded-btn text-brand-primary shrink-0 animate-pulse">
              <Fuel className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-brand-dark">Active Dispatch: {activeOrder.type}</h2>
                <LivePulse status="primary" label="EN ROUTE" />
              </div>
              <p className="text-xs text-text-secondary mt-1">Assigned refueler is heading to: <strong className="font-mono text-text-primary">{activeOrder.location}</strong></p>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-xs font-mono font-medium text-text-muted">
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-brand-primary" /> ETA: {activeOrder.eta}</span>
                <span>•</span>
                <span>Fuel: {activeOrder.fuelType} ({activeOrder.quantity})</span>
                <span>•</span>
                <span>Refueler: {activeOrder.provider} (ID: {activeOrder.providerId})</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setActiveOrder(null)}
              className="px-4 py-2 border border-borders-outline/10 hover:border-red-500 hover:text-red-500 rounded-btn text-xs font-mono font-bold cursor-pointer transition-all"
            >
              Cancel Request
            </button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate('/tracking')}
            >
              Track Live Dispatch <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-surface-low border border-dashed border-borders-outline/20 rounded-card p-6 text-center">
          <p className="text-xs text-text-muted font-mono uppercase tracking-wider">No Active Fuel Dispatches</p>
          <Button variant="primary" size="sm" onClick={() => navigate('/fuel-request')} className="mt-3">
            Request Fuel Now
          </Button>
        </div>
      )}

      {/* Main Grid: Garage & Quick Action */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Vehicles / Garage Summary */}
        <Card title="My Garage" className="lg:col-span-2" headerAction={
          <Button variant="ghost" size="sm" className="font-mono text-[10px] uppercase font-bold flex items-center gap-1" onClick={() => navigate('/settings')}>
            <Plus className="w-3.5 h-3.5" /> Add Vehicle
          </Button>
        }>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {vehicles.map((v) => (
              <div key={v.id} className="p-4 bg-surface-low rounded-input border border-borders-outline/10 flex items-start gap-3">
                <div className="p-2 bg-brand-dark rounded-btn text-white mt-0.5">
                  <User className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-text-primary">{v.make} {v.model} ({v.color})</h4>
                  <p className="text-xs font-mono text-text-secondary">Plate: {v.plate}</p>
                  <p className="text-[10px] text-text-muted font-mono">{v.fuel}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Fuel Request */}
        <Card title="Quick Request" subtitle="Express checkout using your primary profile">
          <div className="space-y-4">
            <div className="p-3 bg-brand-primary/5 rounded-input border border-brand-primary/10 text-xs">
              <p className="font-bold text-brand-dark">Auto-Matched Primary Profile:</p>
              <ul className="mt-2 space-y-1 text-text-secondary font-mono">
                <li>• Vehicle: BMW 330i (Black)</li>
                <li>• Fuel Class: 91 Premium</li>
                <li>• Preferred Vol: 5 Gallons</li>
              </ul>
            </div>
            <Button
              variant="emergency"
              className="w-full justify-center flex gap-1.5"
              onClick={() => navigate('/fuel-request')}
            >
              <Fuel className="w-4.5 h-4.5" /> Request 5 Gallons
            </Button>
          </div>
        </Card>
      </div>

      {/* Recent Orders Section */}
      <Card title="Recent Orders Log" subtitle="Audit checklist of previous dispatches">
        {recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full font-mono text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-borders-outline/10 text-text-secondary">
                  <th className="py-3 font-semibold">ORDER ID</th>
                  <th className="py-3 font-semibold">DATE</th>
                  <th className="py-3 font-semibold">FUEL GRADE</th>
                  <th className="py-3 font-semibold">QUANTITY</th>
                  <th className="py-3 font-semibold">STATUS</th>
                  <th className="py-3 font-semibold text-right">TOTAL PAID</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-borders-outline/5 text-text-muted hover:bg-surface-low/30">
                    <td className="py-3.5 font-bold text-text-primary">{order.id}</td>
                    <td className="py-3.5">{order.date}</td>
                    <td className="py-3.5">{order.type}</td>
                    <td className="py-3.5">{order.quantity}</td>
                    <td className="py-3.5">
                      <Badge variant={order.status === 'COMPLETED' ? 'success' : 'danger'}>
                        {order.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 text-right font-bold text-text-primary">{order.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-6 text-text-muted text-xs font-mono">
            NO COMPLETED TRANSACTIONS REGISTERED
          </div>
        )}
      </Card>

    </div>
  );
}
