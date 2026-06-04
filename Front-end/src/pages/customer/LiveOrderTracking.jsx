import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import LivePulse from '../../components/common/LivePulse';
import { MapPin, Phone, MessageSquare, Compass, Shield, Clock, Navigation2, Check } from 'lucide-react';

export default function LiveOrderTracking() {
  const navigate = useNavigate();
  const [eta, setEta] = useState(12);
  const [progress, setProgress] = useState(35);
  const [status, setStatus] = useState('dispatching'); // 'dispatching', 'en_route', 'arrived'

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setStatus('arrived');
          setEta(0);
          return 100;
        }
        if (prev > 75) setStatus('en_route');
        setEta(Math.max(1, Math.round((100 - prev) * 0.15)));
        return prev + 5;
      });
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
            ← Dashboard
          </Button>
          <div className="h-4 w-px bg-borders-outline/20" />
          <h1 className="text-xl font-bold flex items-center gap-2">
            Live Order Tracking
          </h1>
        </div>
        <div className="flex items-center gap-3 font-mono text-[11px] font-bold">
          <span className="text-text-secondary">TRACKING ID:</span>
          <span className="text-brand-primary bg-brand-primary/10 border border-brand-primary/20 px-2 py-0.5 rounded">NX-28941-F</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Area */}
        <div className="lg:col-span-2 relative h-[500px] bg-brand-dark rounded-card overflow-hidden shadow-floating border border-borders-outline/10">
          {/* Mock Map Layout using Custom Styling */}
          <div className="absolute inset-0 bg-slate-900 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-75" />
          
          {/* Mock Highways & Routes */}
          <svg className="absolute inset-0 w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
            <path d="M-100,200 L800,250 L1200,450" fill="none" stroke="#475569" strokeWidth="6" strokeLinecap="round" />
            <path d="M300,-50 L450,220 L600,600" fill="none" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
            <path d="M450,220 L520,228 L800,400" fill="none" stroke="#d0021b" strokeWidth="3" strokeDasharray="6 4" strokeLinecap="round" />
          </svg>

          {/* User Location Node */}
          <div className="absolute left-[300px] top-[200px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <div className="relative flex h-10 w-10 items-center justify-center">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500/30 opacity-75" />
              <div className="h-4 w-4 bg-blue-500 border-2 border-white rounded-full shadow-lg" />
            </div>
            <div className="bg-brand-dark/95 border border-white/10 rounded px-2.5 py-1 text-[9px] font-bold font-mono text-white mt-1 shadow-md">
              YOUR LOCATION
            </div>
          </div>

          {/* Responder Delivery Truck Node */}
          <div
            style={{
              left: `${300 + (progress / 100) * 220}px`,
              top: `${200 + (progress / 100) * 28}px`,
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center transition-all duration-1000 ease-out"
          >
            <div className="relative flex h-14 w-14 items-center justify-center">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary/20 opacity-75" />
              <div className="h-7 w-7 bg-brand-primary border-2 border-white rounded-full shadow-lg flex items-center justify-center text-white">
                <Navigation2 className="w-3.5 h-3.5 rotate-[70deg] fill-current" />
              </div>
            </div>
            <div className="bg-brand-dark border border-brand-primary/30 rounded px-2.5 py-1 text-[9px] font-bold font-mono text-white mt-1 shadow-md flex items-center gap-1.5 whitespace-nowrap">
              <LivePulse status="primary" /> RESPONDER (REFUELER)
            </div>
          </div>

          {/* Map Overlay HUD */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            <div className="glassmorphic-dark px-3.5 py-2 rounded-btn text-white flex items-center gap-2 text-xs font-mono">
              <Compass className="w-4 h-4 text-brand-primary animate-spin" />
              <span>LAT: 42.3601° N | LON: 71.0589° W</span>
            </div>
            <div className="glassmorphic-dark px-3.5 py-2 rounded-btn text-white text-xs font-mono">
              SPEED: <span className="text-brand-primary font-bold">42 MPH</span>
            </div>
          </div>

          {/* Map Controls */}
          <div className="absolute bottom-4 right-4 flex flex-col gap-1.5">
            <button className="w-8 h-8 rounded-btn bg-brand-dark/90 hover:bg-brand-dark text-white border border-white/10 font-bold flex items-center justify-center text-sm">+</button>
            <button className="w-8 h-8 rounded-btn bg-brand-dark/90 hover:bg-brand-dark text-white border border-white/10 font-bold flex items-center justify-center text-sm">-</button>
          </div>
        </div>

        {/* Sidebar Info Panels */}
        <div className="space-y-6">
          <Card title="Dispatch Progress">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-text-secondary font-mono">ESTIMATED ARRIVAL</p>
                  <p className="text-2xl font-bold font-mono text-brand-dark">{eta > 0 ? `${eta} Mins` : 'ARRIVED'}</p>
                </div>
                <Badge variant={status === 'arrived' ? 'success' : 'primary'}>
                  {status === 'arrived' ? 'Completed' : 'En Route'}
                </Badge>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono font-medium text-text-secondary">
                  <span>DISPATCHED</span>
                  <span>ARRIVED</span>
                </div>
                <div className="w-full bg-surface-high h-2.5 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${progress}%` }}
                    className="bg-brand-primary h-full rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(163,0,18,0.5)]"
                  />
                </div>
              </div>

              {/* Responder Profile */}
              <div className="border-t border-borders-outline/10 pt-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src="https://api.dicebear.com/7.x/adventurer/svg?seed=Marcus"
                      alt="Responder"
                      className="w-11 h-11 rounded-full border border-borders-outline/20 bg-surface-low"
                    />
                    <div>
                      <p className="text-sm font-bold text-text-primary">Marcus Vance</p>
                      <p className="text-xs text-text-secondary">NexFuel Unit #928</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2.5 rounded-btn bg-surface-low hover:bg-surface-high border border-borders-outline/10 text-text-primary transition-colors">
                      <Phone className="w-4 h-4" />
                    </button>
                    <button className="p-2.5 rounded-btn bg-surface-low hover:bg-surface-high border border-borders-outline/10 text-text-primary transition-colors relative">
                      <MessageSquare className="w-4 h-4" />
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-primary rounded-full" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card title="Live Dispatch Log" subtitle="Real-time network events telemetry">
            <div className="space-y-3.5 font-mono text-xs max-h-48 overflow-y-auto pr-1">
              <div className="flex gap-2 text-text-muted">
                <span className="text-brand-primary shrink-0">13:40:12</span>
                <span className="text-text-primary">[SYS] Dispatch confirmed by refueler unit.</span>
              </div>
              <div className="flex gap-2 text-text-muted">
                <span className="text-brand-primary shrink-0">13:41:05</span>
                <span>[GPS] Route established. Distance 4.2 miles.</span>
              </div>
              {progress > 40 && (
                <div className="flex gap-2 text-text-muted">
                  <span className="text-brand-primary shrink-0">13:43:55</span>
                  <span>[GPS] Responder passed highway milestone 24.</span>
                </div>
              )}
              {progress > 75 && (
                <div className="flex gap-2 text-text-muted">
                  <span className="text-brand-primary shrink-0">13:46:12</span>
                  <span>[SYS] Responder is within 1 mile range. Preparing safety protocol.</span>
                </div>
              )}
              {status === 'arrived' && (
                <div className="flex gap-2 text-text-muted">
                  <span className="text-brand-primary shrink-0">13:48:00</span>
                  <span className="text-success font-bold">[SYS] Unit arrived. Initiating refueling dispatch.</span>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
