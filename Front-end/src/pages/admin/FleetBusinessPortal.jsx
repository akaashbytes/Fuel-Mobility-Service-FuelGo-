import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import LivePulse from '../../components/common/LivePulse';
import { Truck, Search, Plus, Filter, Navigation, Zap, BatteryCharging, ShieldCheck } from 'lucide-react';

export default function FleetBusinessPortal() {
  const [searchTerm, setSearchTerm] = useState('');

  const fleetResponders = [
    { id: 'RF-928', name: 'Marcus Vance', vehicle: 'Mobile Tanker (Ford F-250)', type: 'Fuel Delivery', capacity: '120 Gal Premium', status: 'Online', battery: '92%', completed: '12 Tasks' },
    { id: 'RF-312', name: 'Diana Prince', vehicle: 'Flatbed Tow (Dodge Ram)', type: 'Specialized Towing', capacity: 'Heavy Duty Lift', status: 'Online', battery: '85%', completed: '8 Tasks' },
    { id: 'RF-774', name: 'Peter Parker', vehicle: 'Service EV (Tesla Model X)', type: 'Battery Jump', capacity: '100 kWh Booster', status: 'Idle', battery: '42%', completed: '15 Tasks' },
    { id: 'RF-819', name: 'Clark Kent', vehicle: 'Service Van (Chevy Express)', type: 'Lockout Assistance', capacity: 'Hydraulic Entry Kit', status: 'Offline', battery: '100%', completed: '6 Tasks' },
  ];

  const filteredFleet = fleetResponders.filter(
    (res) =>
      res.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Fleet & Business Portal</h1>
          <p className="text-xs text-text-secondary mt-0.5">Allocate dispatcher assets, monitor equipment telemetry, and add custom fleet nodes.</p>
        </div>
        <Button variant="primary" size="sm" className="font-mono text-[10px] uppercase tracking-wider font-bold flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> Provision Fleet Node
        </Button>
      </div>

      {/* Search HUD */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4" />
          <input
            type="text"
            placeholder="Search fleet nodes by ID, name, or service class..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white text-text-primary placeholder:text-text-muted/60 border border-borders-outline/15 rounded-input py-2.5 pl-11 pr-4 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 focus:outline-none transition-all text-xs"
          />
        </div>
        <Button variant="outline" size="sm" className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider font-bold">
          <Filter className="w-3.5 h-3.5" /> Filters
        </Button>
      </div>

      {/* Fleet Nodes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredFleet.map((res) => (
          <Card
            key={res.id}
            title={res.name}
            subtitle={`${res.vehicle} | ID: ${res.id}`}
            headerAction={
              <Badge variant={res.status === 'Online' ? 'success' : res.status === 'Idle' ? 'info' : 'danger'}>
                {res.status}
              </Badge>
            }
          >
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 font-mono text-xs text-text-secondary">
                <div className="bg-surface-low p-3 rounded-btn border border-borders-outline/5">
                  <span className="text-[9px] uppercase block">SERVICE CLASS</span>
                  <span className="font-bold text-text-primary block mt-0.5">{res.type}</span>
                </div>
                <div className="bg-surface-low p-3 rounded-btn border border-borders-outline/5">
                  <span className="text-[9px] uppercase block">BOOSTER CAPACITY</span>
                  <span className="font-bold text-text-primary block mt-0.5">{res.capacity}</span>
                </div>
                <div className="bg-surface-low p-3 rounded-btn border border-borders-outline/5 flex justify-between items-center">
                  <div>
                    <span className="text-[9px] uppercase block">BATTERY HEALTH</span>
                    <span className="font-bold text-text-primary block mt-0.5">{res.battery}</span>
                  </div>
                  <BatteryCharging className="w-4 h-4 text-success" />
                </div>
                <div className="bg-surface-low p-3 rounded-btn border border-borders-outline/5 flex justify-between items-center">
                  <div>
                    <span className="text-[9px] uppercase block">COMPLETED TASKS</span>
                    <span className="font-bold text-text-primary block mt-0.5">{res.completed}</span>
                  </div>
                  <ShieldCheck className="w-4 h-4 text-blue-500" />
                </div>
              </div>

              {res.status !== 'Offline' && (
                <div className="flex gap-2 justify-end pt-2 border-t border-borders-outline/10">
                  <Button variant="ghost" size="sm" className="font-mono text-[9px] uppercase tracking-wider font-bold">
                    View Logs
                  </Button>
                  <Button variant="outline" size="sm" className="font-mono text-[9px] uppercase tracking-wider font-bold flex items-center gap-1">
                    <Navigation className="w-3 h-3" /> Track Unit
                  </Button>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
