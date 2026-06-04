import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import LivePulse from '../../components/common/LivePulse';
import { Truck, MapPin, Navigation, Navigation2, Compass, AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function ResponderDashboard() {
  const [isOnline, setIsOnline] = useState(true);
  const [activeJob, setActiveJob] = useState(null);
  const [jobProgress, setJobProgress] = useState(0); // 0 = accepted, 1 = arriving, 2 = refueling, 3 = completed

  const incomingRequests = [
    {
      id: 'REQ-102',
      service: 'Fuel Delivery',
      detail: '5 Gallons (91 Premium)',
      location: 'Interstate 95, Mile Marker 23.5 (Northbound)',
      dist: '1.2 miles away',
      fare: '$49.25',
    },
    {
      id: 'REQ-105',
      service: 'Roadside Towing',
      detail: 'Flatbed (Tesla Model 3)',
      location: '450 Washington St, Boston',
      dist: '3.8 miles away',
      fare: '$85.00',
    },
  ];

  const handleAcceptJob = (job) => {
    setActiveJob(job);
    setJobProgress(0);
  };

  const handleUpdateProgress = () => {
    setJobProgress((prev) => {
      if (prev >= 3) {
        setActiveJob(null);
        return 0;
      }
      return prev + 1;
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="bg-brand-dark rounded-card p-6 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Badge variant="success" className="mb-2">RESPONDER ACTIVE CONTEXT</Badge>
          <h1 className="text-2xl font-bold">Responder Command Hub</h1>
          <p className="text-xs text-text-secondary mt-0.5">Manage dispatched dispatches and navigation logs.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant={isOnline ? 'success' : 'secondary'}
            size="sm"
            onClick={() => setIsOnline(!isOnline)}
            className="font-mono text-[10px] uppercase tracking-wider font-bold"
          >
            {isOnline ? '✓ Online & Dispatchable' : '✗ Offline'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Work Area */}
        <div className="lg:col-span-2 space-y-6">
          {activeJob ? (
            <Card title="Active Dispatch Task" subtitle={`Task ID: ${activeJob.id}`}>
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-surface-low p-4 rounded-input border border-borders-outline/10 text-center">
                    <p className="text-[10px] text-text-secondary font-mono uppercase">SERVICE TYPE</p>
                    <p className="text-base font-bold text-brand-dark mt-1">{activeJob.service}</p>
                  </div>
                  <div className="bg-surface-low p-4 rounded-input border border-borders-outline/10 text-center">
                    <p className="text-[10px] text-text-secondary font-mono uppercase">DISPATCH FARE</p>
                    <p className="text-base font-bold text-success mt-1">{activeJob.fare}</p>
                  </div>
                  <div className="bg-surface-low p-4 rounded-input border border-borders-outline/10 text-center">
                    <p className="text-[10px] text-text-secondary font-mono uppercase">DISTANCE</p>
                    <p className="text-base font-bold text-text-primary mt-1">{activeJob.dist}</p>
                  </div>
                </div>

                <div className="space-y-2 border-t border-borders-outline/10 pt-5">
                  <h4 className="text-xs font-mono font-bold text-text-secondary uppercase">DELIVERY DESTINATION</h4>
                  <div className="flex items-start gap-2.5 text-sm text-text-primary">
                    <MapPin className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">{activeJob.location}</p>
                      <p className="text-xs text-text-secondary font-mono mt-0.5">LAT/LON: Auto-linked in GPS navigation</p>
                    </div>
                  </div>
                </div>

                {/* Job progress state indicator */}
                <div className="space-y-3 pt-4 border-t border-borders-outline/10">
                  <div className="flex justify-between items-center text-xs font-mono font-bold">
                    <span>DISPATCH TIMELINE</span>
                    <span className="text-brand-primary">
                      {jobProgress === 0 ? 'EN ROUTE TO TARGET' : jobProgress === 1 ? 'ARRIVED & REFUELING' : jobProgress === 2 ? 'VERIFYING SIGN-OFF' : 'TASK COMPLETED'}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {['Dispatched', 'Arrived', 'Action', 'Complete'].map((step, idx) => (
                      <div
                        key={idx}
                        className={`h-2.5 rounded-full transition-all duration-300 ${
                          idx <= jobProgress ? 'bg-brand-primary shadow-[0_0_6px_rgba(163,0,18,0.4)]' : 'bg-surface-highest'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <Button variant="secondary" size="md">
                    <Navigation className="w-4 h-4" /> Open In GPS
                  </Button>
                  <Button variant="primary" size="md" onClick={handleUpdateProgress}>
                    {jobProgress === 0 ? 'Mark Arrived' : jobProgress === 1 ? 'Mark Action Completed' : jobProgress === 2 ? 'Verify Sign-Off & Close' : 'Finish Job'}
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Card title="Online Dispatch Map" subtitle="Mock GPS navigation overlay">
              <div className="relative h-96 bg-brand-dark rounded-input overflow-hidden border border-borders-outline/10">
                <div className="absolute inset-0 bg-slate-900 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-75" />
                <svg className="absolute inset-0 w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
                  <path d="M-100,180 L900,220" fill="none" stroke="#475569" strokeWidth="4" />
                  <path d="M400,-50 L400,500" fill="none" stroke="#475569" strokeWidth="4" />
                </svg>

                {/* Responder node */}
                <div className="absolute left-[350px] top-[180px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                  <div className="relative flex h-10 w-10 items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success/30 opacity-75" />
                    <div className="h-4 w-4 bg-success border-2 border-white rounded-full shadow-lg" />
                  </div>
                  <div className="bg-brand-dark border border-white/10 rounded px-2.5 py-1 text-[8px] font-bold font-mono text-white mt-1 shadow-md whitespace-nowrap">
                    YOUR PATROL UNIT
                  </div>
                </div>

                {isOnline && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-brand-dark/90 border border-brand-primary/20 p-4 rounded-card text-center max-w-xs shadow-floating pointer-events-auto">
                      <LivePulse status="success" label="SCANNING OPERATIONS GRID" className="mb-2" />
                      <p className="text-[11px] text-text-secondary leading-relaxed">
                        Stand by. Incoming roadside fuel dispatches will alert you dynamically.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar Dispatch Alerts */}
        <div className="space-y-6">
          <Card title="Available Requests" subtitle="Tap to accept nearby customer dispatches">
            <div className="space-y-4">
              {!isOnline ? (
                <div className="text-center py-6 text-text-muted text-xs font-mono">
                  GO ONLINE TO PREVIEW INCOMING ASSISTANCE JOBS
                </div>
              ) : incomingRequests.length > 0 && !activeJob ? (
                incomingRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-4 rounded-input border border-borders-outline/15 hover:border-brand-primary/30 transition-all duration-200 space-y-3 bg-surface-lowest shadow-sm"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-xs font-bold text-brand-dark">{req.id}</span>
                      <Badge variant="primary">{req.service}</Badge>
                    </div>
                    <div className="text-xs text-text-secondary font-mono space-y-1">
                      <p>• DETAILS: {req.detail}</p>
                      <p className="truncate">• ADDR: {req.location}</p>
                      <p className="font-bold text-brand-primary">• DISTANCE: {req.dist}</p>
                    </div>
                    <div className="flex gap-2 pt-1">
                      <Button
                        variant="primary"
                        size="sm"
                        className="w-full text-xs py-2"
                        onClick={() => handleAcceptJob(req)}
                      >
                        Accept Dispatch
                      </Button>
                    </div>
                  </div>
                ))
              ) : activeJob ? (
                <div className="text-center py-6 text-text-muted text-xs font-mono">
                  COMPLETE CURRENT TASK TO ACCEPT NEW REQUESTS
                </div>
              ) : (
                <div className="text-center py-6 text-text-muted text-xs font-mono">
                  NO ACTIVE PENDING REQUESTS IN YOUR AREA
                </div>
              )}
            </div>
          </Card>

          <Card title="Telemetry HUD">
            <div className="space-y-3 font-mono text-xs text-text-secondary">
              <div className="flex justify-between">
                <span>OPERATIONAL STATE</span>
                <span className="font-bold text-success">ONLINE</span>
              </div>
              <div className="flex justify-between">
                <span>RESPONDER FLEET ID</span>
                <span className="font-bold text-text-primary">RF-UNIT-928</span>
              </div>
              <div className="flex justify-between">
                <span>COORDINATES</span>
                <span className="font-bold text-text-primary">42.3601° N, 71.0589° W</span>
              </div>
              <div className="flex justify-between">
                <span>SATELLITES PEERED</span>
                <span className="font-bold text-success">14 SECURE</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
