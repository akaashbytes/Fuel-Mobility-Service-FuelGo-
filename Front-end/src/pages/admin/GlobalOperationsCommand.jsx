import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import LivePulse from '../../components/common/LivePulse';
import Button from '../../components/common/Button';
import { Shield, Users, Activity, Eye, AlertCircle, Compass } from 'lucide-react';

export default function GlobalOperationsCommand() {
  const [logs, setLogs] = useState([
    { time: '13:45:01', event: 'Dispatch paired: Customer NX-28941-F with Refueler RF-928' },
    { time: '13:43:22', event: 'New Emergency SOS triggered: User ID usr_829. Coordinating response.' },
    { time: '13:41:10', event: 'System health check: 14/14 GPS satellites synchronized.' },
    { time: '13:38:59', event: 'Towing dispatch closed: TXN-129. Fare settled.' },
  ]);

  const activeResponders = [
    { id: 'RF-928', name: 'Marcus Vance', task: 'Emergency Refueling', status: 'En Route', lat: '42.3601° N', lon: '71.0589° W' },
    { id: 'RF-312', name: 'Diana Prince', task: 'Specialized Towing', status: 'On Scene', lat: '42.3642° N', lon: '71.0610° W' },
    { id: 'RF-774', name: 'Peter Parker', task: 'Battery Jump Start', status: 'Idle', lat: '42.3551° N', lon: '71.0504° W' },
  ];

  const systemStats = [
    { label: 'Active Dispatches', value: '4 Requests', status: 'primary' },
    { label: 'Responders Online', value: '12 Units', status: 'success' },
    { label: 'Pending Queue', value: '0 Tasks', status: 'success' },
    { label: 'Active Alerts', value: '1 SOS Trigger', status: 'emergency' },
  ];

  return (
    <div className="space-y-6">
      {/* HUD Header */}
      <div className="bg-brand-dark rounded-card p-6 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Badge variant="danger" className="mb-2 animate-pulse">ADMIN OPERATION OVERWATCH</Badge>
          <h1 className="text-2xl font-bold tracking-tight">Global Operations Command</h1>
          <p className="text-xs text-text-secondary mt-0.5">Real-time system orchestration, telemetry logs, and dispatch pairing.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="emergency" size="sm" className="font-mono text-[10px] tracking-wider uppercase font-bold">
            🚨 Trigger Emergency Override
          </Button>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {systemStats.map((stat, idx) => (
          <div key={idx} className="bg-white border border-borders-outline/10 p-5 rounded-card shadow-industrial flex items-center justify-between">
            <div>
              <span className="text-[10px] text-text-secondary font-mono uppercase tracking-wider block">{stat.label}</span>
              <span className="text-xl font-bold text-brand-dark block mt-1">{stat.value}</span>
            </div>
            <LivePulse status={stat.status} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Operations Grid Map */}
        <div className="lg:col-span-2 relative h-[450px] bg-slate-950 rounded-card border border-borders-outline/15 overflow-hidden shadow-floating">
          <div className="absolute inset-0 bg-slate-900 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-75" />
          
          {/* Mock Grid Nodes */}
          <div className="absolute top-[100px] left-[150px] flex flex-col items-center">
            <LivePulse status="primary" />
            <span className="bg-slate-900/90 text-white font-mono text-[8px] px-1.5 py-0.5 border border-white/10 rounded mt-1">NX-28941-F (Active)</span>
          </div>

          <div className="absolute top-[280px] left-[450px] flex flex-col items-center">
            <LivePulse status="success" />
            <span className="bg-slate-900/90 text-white font-mono text-[8px] px-1.5 py-0.5 border border-white/10 rounded mt-1">RF-774 (Idle)</span>
          </div>

          <div className="absolute top-[150px] left-[520px] flex flex-col items-center animate-pulse">
            <LivePulse status="emergency" />
            <span className="bg-red-950 text-white font-mono text-[8px] px-1.5 py-0.5 border border-red-500/30 rounded mt-1">SOS ACTIVE: USR-829</span>
          </div>

          {/* Map Title Bar overlay */}
          <div className="absolute top-4 left-4 flex gap-2">
            <div className="glassmorphic-dark px-3 py-1.5 rounded-btn text-white font-mono text-[10px] flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-brand-primary animate-spin" /> Operations Grid Map v1.4
            </div>
          </div>
        </div>

        {/* Dispatch Feeds and Active Alerts */}
        <div className="space-y-6">
          <Card title="Active Responders List" subtitle="Live tracking coordinates of active fleet units">
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {activeResponders.map((res) => (
                <div key={res.id} className="p-3 bg-surface-low rounded-input border border-borders-outline/5 space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-xs font-bold text-text-primary">{res.name} ({res.id})</span>
                    <Badge variant={res.status === 'Idle' ? 'info' : res.status === 'On Scene' ? 'success' : 'primary'}>
                      {res.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-text-secondary">
                    <span>Task: {res.task}</span>
                    <span>{res.lat}, {res.lon}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card title="System Overwatch Feed" subtitle="Real-time network log logs">
            <div className="space-y-2.5 font-mono text-[10px] max-h-40 overflow-y-auto pr-1">
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
