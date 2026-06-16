import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import LivePulse from '../../components/common/LivePulse';
import Button from '../../components/common/Button';
import { useFeedbackStore } from '../../store/useFeedbackStore';
import { useContactStore } from '../../store/useContactStore';
import { useCollaboratorStore } from '../../store/useCollaboratorStore';
import {
  Compass,
  Users,
  Activity,
  AlertCircle,
  Clock,
  Briefcase,
  CheckCircle2,
  TrendingUp,
  MapPin,
  RefreshCw,
  Navigation
} from 'lucide-react';

export default function AdminOperationsCenter() {
  const feedbacks = useFeedbackStore((state) => state.feedbacks);
  const requests = useContactStore((state) => state.requests);
  const bunks = useCollaboratorStore((state) => state.bunks);

  // Dynamic calculations from stores
  const openFeedbackCount = feedbacks.filter((f) => ['New', 'Escalated'].includes(f.status)).length;
  const openCollabCount = requests.filter((r) =>
    ['Partnership Request', 'Petrol Bunk Collaboration', 'Business Proposal'].includes(r.category) &&
    ['New', 'In Review'].includes(r.status)
  ).length;

  // Mock operations statistics
  const activeOrdersCount = 3;
  const availableProvidersCount = bunks.filter((b) => b.status === 'Active Partner').reduce((acc, curr) => acc + (curr.assignedDrivers?.filter((d) => d.task === 'Idle').length || 0), 0) + 1; // Peter Parker + other online
  const busyProvidersCount = bunks.reduce((acc, curr) => acc + (curr.assignedDrivers?.filter((d) => d.task !== 'Idle').length || 0), 0); // Marcus, Diana
  const pendingPaymentsCount = 1;

  const logs = [
    { time: '15:32:01', event: 'Dispatch paired: Customer NX-28941-F with Refueler RF-928' },
    { time: '15:28:15', event: 'HP Fuel Station reserves synchronized: 14,200 Liters Petrol remaining.' },
    { time: '15:21:40', event: 'New contact inquiry logged: Alice Smith (ID: CON-101).' },
    { time: '15:10:59', event: 'Customer evaluation received: Rating 5.0 from Alex Mercer.' }
  ];

  const activeDispatches = [
    { id: 'NX-28941-F', client: 'Alex Mercer', provider: 'Marcus Vance', vehicle: 'F-250 Tanker', status: 'En Route', eta: '12 min' },
    { id: 'NX-10294-A', client: 'Sarah Connor', provider: 'Diana Prince', vehicle: 'Flatbed Tow', status: 'Arrived', eta: '0 min' },
  ];

  return (
    <div className="space-y-6 font-sans text-body">
      
      {/* HUD Header */}
      <div className="bg-brand-dark rounded-card p-6 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border border-white/10 shadow-floating">
        <div>
          <Badge variant="danger" className="mb-2 animate-pulse">ADMIN OPERATION OVERWATCH</Badge>
          <h1 className="text-2xl font-bold tracking-tight text-white font-display">System Operations Center</h1>
          <p className="text-xs text-text-secondary mt-0.5 text-desc">Real-time system orchestration, telemetry logs, and dispatch pairing.</p>
        </div>
        <div className="flex gap-2 font-mono text-[10px]">
          <Button variant="emergency" size="sm" className="tracking-wider uppercase font-bold flex items-center gap-1">
            🚨 Emergency Override
          </Button>
        </div>
      </div>

      {/* Grid Stats Counters */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
        
        {/* Active Orders */}
        <div className="bg-white border border-borders-outline/10 p-5 rounded-card shadow-industrial flex items-center justify-between">
          <div>
            <span className="text-[10px] text-text-secondary font-mono uppercase tracking-wider block">Active Dispatches</span>
            <span className="text-xl font-bold text-brand-dark block mt-1">{activeOrdersCount} Active</span>
          </div>
          <LivePulse status="primary" />
        </div>

        {/* Available Providers */}
        <div className="bg-white border border-borders-outline/10 p-5 rounded-card shadow-industrial flex items-center justify-between">
          <div>
            <span className="text-[10px] text-text-secondary font-mono uppercase tracking-wider block">Available Refuelers</span>
            <span className="text-xl font-bold text-success block mt-1">{availableProvidersCount} Online</span>
          </div>
          <LivePulse status="success" />
        </div>

        {/* Busy Providers */}
        <div className="bg-white border border-borders-outline/10 p-5 rounded-card shadow-industrial flex items-center justify-between">
          <div>
            <span className="text-[10px] text-text-secondary font-mono uppercase tracking-wider block">Busy Dispatchers</span>
            <span className="text-xl font-bold text-brand-primary block mt-1">{busyProvidersCount} In Transit</span>
          </div>
          <LivePulse status="warning" />
        </div>

        {/* Pending Payments */}
        <div className="bg-white border border-borders-outline/10 p-5 rounded-card shadow-industrial flex items-center justify-between">
          <div>
            <span className="text-[10px] text-text-secondary font-mono uppercase tracking-wider block">Pending Payments</span>
            <span className="text-xl font-bold text-brand-primary block mt-1">${(pendingPaymentsCount * 39.25).toFixed(2)} Due</span>
          </div>
          <Clock className="w-5 h-5 text-brand-primary animate-pulse" />
        </div>

        {/* Open Feedback Issues */}
        <div className="bg-white border border-borders-outline/10 p-5 rounded-card shadow-industrial flex items-center justify-between">
          <div>
            <span className="text-[10px] text-text-secondary font-mono uppercase tracking-wider block">Open Review Issues</span>
            <span className="text-xl font-bold text-text-primary block mt-1">{openFeedbackCount} Reviews</span>
          </div>
          <div className="bg-brand-primary/10 text-brand-primary w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px]">
            {openFeedbackCount}
          </div>
        </div>

        {/* Open Collaboration Requests */}
        <div className="bg-white border border-borders-outline/10 p-5 rounded-card shadow-industrial flex items-center justify-between">
          <div>
            <span className="text-[10px] text-text-secondary font-mono uppercase tracking-wider block">Partnership Requests</span>
            <span className="text-xl font-bold text-text-primary block mt-1">{openCollabCount} Proposals</span>
          </div>
          <div className="bg-surface-high text-text-primary w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px]">
            {openCollabCount}
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Operations Grid Map */}
        <div className="lg:col-span-2 relative h-[420px] bg-slate-950 rounded-card border border-borders-outline/15 overflow-hidden shadow-floating">
          <div className="absolute inset-0 bg-slate-900 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-75" />
          
          {/* Mock Grid Nodes */}
          <div className="absolute top-[120px] left-[140px] flex flex-col items-center">
            <LivePulse status="primary" />
            <span className="bg-slate-900/90 text-white font-mono text-[8px] px-1.5 py-0.5 border border-white/10 rounded mt-1 shadow-md">
              NX-28941-F (En Route)
            </span>
          </div>

          <div className="absolute top-[280px] left-[320px] flex flex-col items-center">
            <LivePulse status="success" />
            <span className="bg-slate-900/90 text-white font-mono text-[8px] px-1.5 py-0.5 border border-white/10 rounded mt-1 shadow-md">
              RF-774 (Idle)
            </span>
          </div>

          {/* Map Title Bar overlay */}
          <div className="absolute top-4 left-4 flex gap-2">
            <div className="glassmorphic-dark px-3 py-1.5 rounded-btn text-white font-mono text-[10px] flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-brand-primary animate-spin" /> Overwatch Active Map Grid
            </div>
          </div>
        </div>

        {/* Live dispatches and logs */}
        <div className="space-y-6">
          <Card title="Live Dispatches Tracker" subtitle="Dispatch route summaries">
            <div className="space-y-3 max-h-[160px] overflow-y-auto pr-1">
              {activeDispatches.map((d, i) => (
                <div key={i} className="p-3 bg-surface-low rounded-input border border-borders-outline/5 space-y-1 text-xs font-mono text-text-secondary">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-bold text-text-primary">{d.id}</span>
                    <Badge variant={d.status === 'Arrived' ? 'success' : 'primary'}>{d.status}</Badge>
                  </div>
                  <p className="text-[10px] text-text-muted">Driver: {d.provider} ({d.vehicle})</p>
                  <p className="text-[9px] text-brand-primary font-bold">ETA: {d.eta}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card title="System Overwatch Feed" subtitle="Real-time command center logs">
            <div className="space-y-2.5 font-mono text-[10px] max-h-[140px] overflow-y-auto pr-1">
              {logs.map((log, idx) => (
                <div key={idx} className="flex gap-1.5 text-text-secondary leading-relaxed border-b border-borders-outline/5 pb-1.5">
                  <span className="text-brand-primary font-bold shrink-0">{log.time}</span>
                  <span>{log.event}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

      </div>

    </div>
  );
}
