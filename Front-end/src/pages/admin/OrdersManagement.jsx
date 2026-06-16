import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { Search, Filter, Compass, AlertCircle, X, CheckSquare, RefreshCw } from 'lucide-react';

export default function OrdersManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTab, setFilterTab] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [assigningDriver, setAssigningDriver] = useState(false);

  const [orders, setOrders] = useState([
    { id: 'NX-28941-F', customer: 'Alex Mercer', phone: '+919876543210', service: 'Fuel Delivery', detail: '5 Gal (91 Premium)', location: 'Interstate 95, Northbound side', status: 'ACTIVE', provider: 'Marcus Vance', providerId: 'RF-928', total: '$49.25' },
    { id: 'NX-10294-A', customer: 'Sarah Connor', phone: '+919888877777', service: 'Towing Lift', detail: 'Flatbed Flat Tire', location: '450 Washington St, Boston', status: 'COMPLETED', provider: 'Diana Prince', providerId: 'RF-312', total: '$110.00' },
    { id: 'NX-09281-C', customer: 'Bruce Wayne', phone: '+919999988888', service: 'Fuel Delivery', detail: '10 Gal (Regular 87)', location: '90 Main St, Cambridge', status: 'CANCELLED', provider: 'Unassigned', providerId: 'N/A', total: '$0.00' }
  ]);

  const idleDrivers = [
    { id: 'RF-774', name: 'Peter Parker', vehicle: 'Service EV (Model X)' },
    { id: 'RF-819', name: 'Clark Kent', vehicle: 'Service Van (Chevy)' }
  ];

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.detail.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterTab === 'ALL' || order.status === filterTab;

    return matchesSearch && matchesStatus;
  });

  const handleManualAssign = (driver) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === selectedOrder.id
          ? { ...o, provider: driver.name, providerId: driver.id, status: 'ACTIVE' }
          : o
      )
    );
    setAssigningDriver(false);
    setSelectedOrder(null);
    alert(`Order successfully matched to dispatch unit ${driver.name} (${driver.id}).`);
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold font-display text-brand-dark">Orders Command Center</h1>
        <p className="text-xs text-text-secondary mt-0.5">Audit transaction states, monitor dispatch alerts, and execute override matches.</p>
      </div>

      {/* Filters HUD */}
      <div className="flex flex-col sm:flex-row gap-3 font-mono text-xs">
        <div className="relative flex-1 font-sans">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted w-4.5 h-4.5" />
          <input
            type="text"
            placeholder="Search orders by ID, client name, or fuel specification..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white text-text-primary placeholder:text-text-muted/65 border border-borders-outline/25 rounded-input py-2.5 pl-11 pr-4 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 focus:outline-none transition-all text-xs font-mono"
          />
        </div>
        <div className="flex gap-2">
          {['ALL', 'ACTIVE', 'COMPLETED', 'CANCELLED'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterTab(tab)}
              className={`px-4 py-2.5 rounded-btn border font-bold transition-all cursor-pointer ${
                filterTab === tab
                  ? 'border-brand-primary bg-brand-primary/5 text-brand-primary'
                  : 'border-borders-outline/15 hover:border-borders-outline/35 bg-white text-text-muted'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              onClick={() => setSelectedOrder(order)}
              className="bg-white border border-borders-outline/10 hover:border-brand-primary/20 rounded-card p-5 shadow-sm hover:shadow-industrial transition-all duration-200 cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
            >
              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-text-primary text-sm">{order.id}</span>
                  <Badge variant={order.status === 'ACTIVE' ? 'primary' : order.status === 'COMPLETED' ? 'success' : 'danger'}>
                    {order.status}
                  </Badge>
                </div>
                <div className="text-text-secondary text-[11px] space-y-0.5">
                  <p>• Client: {order.customer} ({order.phone})</p>
                  <p>• Service: {order.detail} | Location: {order.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono w-full sm:w-auto justify-between sm:justify-end">
                <div className="text-left sm:text-right">
                  <p className="text-[10px] text-text-secondary font-sans">Provider Assigned</p>
                  <p className="font-bold text-text-primary mt-0.5">{order.provider}</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-[10px] text-text-secondary font-sans">Ledger Fare</p>
                  <p className="font-bold text-brand-primary mt-0.5">{order.total}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white border border-borders-outline/10 rounded-card p-12 text-center text-text-muted text-xs font-mono">
            NO CORRESPONDING TRANSACTION LEDGERS REGISTERED
          </div>
        )}
      </div>

      {/* Details & Manual Assignment Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300">
          <div className="w-full max-w-lg bg-[linear-gradient(135deg,#fdf4f5_0%,#f1eef8_100%)] rounded-card shadow-floating border border-borders-outline/10 overflow-hidden relative p-8 flex flex-col">
            
            {/* Header */}
            <div className="flex justify-between items-center pb-4 border-b border-borders-outline/10">
              <div>
                <span className="font-mono text-xs font-bold text-brand-primary">ADMIN OPERATIONS LEDGER</span>
                <h3 className="text-lg font-bold font-display text-brand-dark mt-0.5">{selectedOrder.id}</h3>
              </div>
              <button
                onClick={() => {
                  setSelectedOrder(null);
                  setAssigningDriver(false);
                }}
                className="p-1 rounded-btn hover:bg-surface-low text-text-muted hover:text-text-primary cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Details body */}
            <div className="py-6 space-y-5 text-xs font-mono text-text-secondary">
              <div className="space-y-1 bg-white p-4 rounded-input border border-borders-outline/10">
                <p className="text-[10px] text-text-secondary font-sans uppercase">Target Destination</p>
                <p className="font-sans font-bold text-text-primary mt-0.5">{selectedOrder.location}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-3 rounded-input border border-borders-outline/10 space-y-0.5">
                  <p className="text-[10px] text-text-secondary font-sans uppercase">Client Profile</p>
                  <p className="font-sans font-bold text-text-primary truncate">{selectedOrder.customer}</p>
                </div>
                <div className="bg-white p-3 rounded-input border border-borders-outline/10 space-y-0.5">
                  <p className="text-[10px] text-text-secondary font-sans uppercase">Phone Number</p>
                  <p className="font-bold text-text-primary">{selectedOrder.phone}</p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-input border border-borders-outline/10 space-y-2">
                <div className="flex justify-between">
                  <span>Service Package Details</span>
                  <span className="font-bold text-text-primary">{selectedOrder.detail}</span>
                </div>
                <div className="flex justify-between">
                  <span>Assigned Dispatcher</span>
                  <span className="font-bold text-brand-primary">{selectedOrder.provider} (ID: {selectedOrder.providerId})</span>
                </div>
                <div className="flex justify-between">
                  <span>Transaction Status</span>
                  <Badge variant={selectedOrder.status === 'ACTIVE' ? 'primary' : selectedOrder.status === 'COMPLETED' ? 'success' : 'danger'}>
                    {selectedOrder.status}
                  </Badge>
                </div>
              </div>

              {/* Manual matching controls */}
              {assigningDriver ? (
                <div className="bg-white p-4 rounded-input border border-brand-primary/25 space-y-3">
                  <h4 className="text-xs font-bold text-brand-dark font-sans">Select Dispatcher to Override Assignment</h4>
                  <div className="space-y-2">
                    {idleDrivers.map((d) => (
                      <div
                        key={d.id}
                        onClick={() => handleManualAssign(d)}
                        className="p-3 bg-surface-low hover:bg-brand-primary/5 border border-borders-outline/10 hover:border-brand-primary/20 rounded-btn cursor-pointer transition-all flex justify-between items-center"
                      >
                        <div>
                          <p className="font-bold text-text-primary text-xs">{d.name} ({d.id})</p>
                          <p className="text-[10px] text-text-muted leading-none mt-0.5">{d.vehicle}</p>
                        </div>
                        <CheckSquare className="w-4 h-4 text-brand-primary" />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                selectedOrder.status === 'ACTIVE' || selectedOrder.provider === 'Unassigned' ? (
                  <Button
                    variant="emergency"
                    className="w-full justify-center"
                    onClick={() => setAssigningDriver(true)}
                  >
                    🚨 Execute Manual Dispatch Override
                  </Button>
                ) : null
              )}
            </div>

            {/* Actions footer */}
            <div className="flex gap-3 pt-4 border-t border-borders-outline/10">
              <Button
                variant="outline"
                className="w-full justify-center"
                onClick={() => {
                  setSelectedOrder(null);
                  setAssigningDriver(false);
                }}
              >
                Close Logs
              </Button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
