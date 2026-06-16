import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Badge from '../../components/common/Badge';
import { Truck, AlertCircle, Compass, Settings, Wrench, ShieldAlert } from 'lucide-react';

export default function RoadsideAssistanceRequest() {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState('towing');
  const [details, setDetails] = useState('');
  const [address, setAddress] = useState('Interstate 95, Exit 24 (Southbound)');
  const [sent, setSent] = useState(false);

  const services = [
    {
      id: 'towing',
      title: 'Flatbed Towing',
      description: 'Standard flatbed transport for EVs, sedans, and SUVs.',
      icon: Truck,
      price: '$85.00 Base',
    },
    {
      id: 'tire',
      title: 'Tire Replacement',
      description: 'On-site swap with your spare or industrial replacement patch.',
      icon: Wrench,
      price: '$45.00 Flat',
    },
    {
      id: 'battery',
      title: 'Battery Jump / Boost',
      description: 'High-voltage jump pack dispatch for quick power recovery.',
      icon: Settings,
      price: '$35.00 Flat',
    },
    {
      id: 'lockout',
      title: 'Vehicle Lockout',
      description: 'Non-destructive hydraulic entry system unlock.',
      icon: ShieldAlert,
      price: '$40.00 Flat',
    },
  ];

  const handleRequest = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      navigate('/tracking');
    }, 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
          ← Back to Dashboard
        </Button>
        <div className="h-4 w-px bg-borders-outline/20" />
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Truck className="w-5 h-5 text-brand-primary" /> Roadside Specialized Services
        </h1>
      </div>

      {sent ? (
        <Card className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Truck className="w-8 h-8 text-brand-primary" />
          </div>
          <h2 className="text-2xl font-bold text-text-primary">Dispatch Service Requested</h2>
          <p className="text-text-secondary text-sm mt-2 max-w-md mx-auto">
            NexFuel emergency unit has been notified. Redirecting to live tracking dashboard...
          </p>
        </Card>
      ) : (
        <form onSubmit={handleRequest} className="space-y-6">
          <Card title="Select Required Service" subtitle="Pairing with specialized responder equipment">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {services.map((svc) => {
                const Icon = svc.icon;
                return (
                  <div
                    key={svc.id}
                    onClick={() => setSelectedService(svc.id)}
                    className={`p-5 rounded-card border-[1.5px] cursor-pointer transition-all duration-200 flex flex-col justify-between h-40 ${
                      selectedService === svc.id
                        ? 'border-brand-primary bg-brand-primary/5 text-brand-primary shadow-sm'
                        : 'border-borders-outline/20 hover:border-borders-outline/40 bg-surface-lowest'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className={`p-2.5 rounded-btn ${selectedService === svc.id ? 'bg-brand-primary/10' : 'bg-surface-low'}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="font-mono text-xs font-bold text-text-primary">{svc.price}</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-text-primary">{svc.title}</h3>
                      <p className="text-xs text-text-secondary mt-1 line-clamp-2">{svc.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card title="Dispatch Location & Details">
            <div className="space-y-4">
              <Input
                label="Dispatch Address / Location"
                placeholder="e.g., I-95 North, near Exit 24"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                icon={Compass}
                required
              />

              <div className="flex flex-col gap-1.5 w-full">
                <label className="font-mono text-[11px] font-semibold text-text-secondary uppercase tracking-wider block">
                  Describe Vehicle Issue (Optional)
                </label>
                <textarea
                  className="w-full bg-surface-lowest text-text-primary border-[1.5px] border-borders-outline/30 rounded-input py-3 px-4 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 focus:outline-none transition-all duration-200 text-sm h-28 resize-none"
                  placeholder="Provide vehicle details or specific issues (e.g. Model Y tires, keys inside, battery dead)"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                />
              </div>

              <div className="bg-blue-50 border-l-2 border-blue-500 p-3 rounded-md flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <p className="text-[11px] text-blue-700 leading-relaxed font-mono">
                  DISPATCH PROTOCOL: Base dispatch includes professional setup and the first 5 miles of towing. Additional miles are charged at $3.50/mile.
                </p>
              </div>

              <div className="pt-2">
                <Button type="submit" variant="primary" className="w-full py-3.5">
                  Request Emergency Dispatch
                </Button>
              </div>
            </div>
          </Card>
        </form>
      )}
    </div>
  );
}
