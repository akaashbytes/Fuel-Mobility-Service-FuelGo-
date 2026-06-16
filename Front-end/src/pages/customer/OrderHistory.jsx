import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { Search, Filter, Calendar, CreditCard, ChevronRight, X, Download, ShieldAlert } from 'lucide-react';

export default function OrderHistory() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const orders = [
    {
      id: 'NX-28941-F',
      date: 'June 14, 2026',
      time: '13:40',
      vehicle: 'BMW 330i (Black)',
      plate: '41-XDF-2',
      fuelType: '91 Premium',
      quantity: '5 Gallons',
      status: 'COMPLETED',
      location: 'Interstate 95, Mile Marker 23.5 (Northbound)',
      provider: 'Marcus Vance',
      providerId: 'RF-928',
      basePrice: '$15.00',
      fuelCost: '$24.25',
      surcharge: '$10.00',
      total: '$49.25',
      paymentMethod: 'Razorpay UPI'
    },
    {
      id: 'NX-10294-A',
      date: 'June 08, 2026',
      time: '09:15',
      vehicle: 'BMW 330i (Black)',
      plate: '41-XDF-2',
      fuelType: '87 Regular',
      quantity: '8 Gallons',
      status: 'COMPLETED',
      location: '450 Washington St, Boston',
      provider: 'Marcus Vance',
      providerId: 'RF-928',
      basePrice: '$15.00',
      fuelCost: '$34.00',
      surcharge: '$0.00',
      total: '$49.00',
      paymentMethod: 'Razorpay Card (Visa *4921)'
    },
    {
      id: 'NX-09281-C',
      date: 'May 22, 2026',
      time: '21:05',
      vehicle: 'Honda Civic (Silver)',
      plate: '10-PKW-5',
      fuelType: 'Diesel',
      quantity: '12 Gallons',
      status: 'CANCELLED',
      location: '90 Main St, Cambridge',
      provider: 'Diana Prince',
      providerId: 'RF-312',
      basePrice: '$15.00',
      fuelCost: '$59.88',
      surcharge: '$10.00',
      total: '$84.88',
      paymentMethod: 'Razorpay Wallet'
    }
  ];

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.fuelType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus =
      statusFilter === 'ALL' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleDownloadInvoice = (order) => {
    alert(`Mock Invoice for ${order.id} downloaded successfully.`);
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold font-display text-brand-dark">My Orders Ledger</h1>
          <p className="text-xs text-text-secondary mt-0.5">Track, search, and download invoices for previous deliveries.</p>
        </div>
      </div>

      {/* Filters HUD */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted w-4.5 h-4.5" />
          <input
            type="text"
            placeholder="Search orders by ID, vehicle model, or fuel type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white text-text-primary placeholder:text-text-muted/65 border border-borders-outline/25 rounded-input py-2.5 pl-11 pr-4 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all text-xs font-mono"
          />
        </div>
        <div className="flex gap-2 font-mono text-xs">
          {['ALL', 'COMPLETED', 'CANCELLED'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2.5 rounded-btn border font-bold transition-all cursor-pointer ${
                statusFilter === status
                  ? 'border-brand-primary bg-brand-primary/5 text-brand-primary'
                  : 'border-borders-outline/15 hover:border-borders-outline/35 bg-white text-text-muted'
              }`}
            >
              {status}
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
              <div className="space-y-2">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold text-brand-dark">{order.id}</span>
                  <Badge variant={order.status === 'COMPLETED' ? 'success' : 'danger'}>
                    {order.status}
                  </Badge>
                </div>
                <div className="text-xs font-mono text-text-secondary space-y-0.5">
                  <p>• Vehicle: {order.vehicle} | Fuel: {order.fuelType}</p>
                  <p>• Location: {order.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-6 justify-between w-full sm:w-auto font-mono text-xs">
                <div className="text-left sm:text-right">
                  <p className="text-[10px] text-text-secondary font-sans uppercase">Fare Settled</p>
                  <p className="font-bold text-brand-dark">{order.total}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-text-muted hidden sm:block" />
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white border border-borders-outline/10 rounded-card p-12 text-center text-text-muted text-xs font-mono">
            NO CORRESPONDING ORDERS FOUND MATCHING FILTER CRITERIA
          </div>
        )}
      </div>

      {/* Order Details Drawer / Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300">
          <div className="w-full max-w-lg bg-[linear-gradient(135deg,#fdf4f5_0%,#f1eef8_100%)] rounded-card shadow-floating border border-borders-outline/10 overflow-hidden relative p-8 flex flex-col">
            
            {/* Header */}
            <div className="flex justify-between items-center pb-4 border-b border-borders-outline/10">
              <div>
                <span className="font-mono text-xs font-bold text-brand-primary">ORDER DETAILS SUMMARY</span>
                <h3 className="text-lg font-bold font-display text-brand-dark mt-0.5">{selectedOrder.id}</h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 rounded-btn hover:bg-surface-low text-text-muted hover:text-text-primary cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content Body */}
            <div className="py-6 space-y-5 text-xs font-mono text-text-secondary">
              
              <div className="space-y-1 bg-white p-4 rounded-input border border-borders-outline/10">
                <p className="text-[10px] text-text-secondary font-sans uppercase">Delivery Destination</p>
                <p className="font-sans font-bold text-text-primary mt-0.5">{selectedOrder.location}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 bg-white p-3 rounded-input border border-borders-outline/10">
                  <p className="text-[10px] text-text-secondary font-sans uppercase">Vehicle Profile</p>
                  <p className="font-sans font-bold text-text-primary mt-0.5">{selectedOrder.vehicle}</p>
                </div>
                <div className="space-y-1 bg-white p-3 rounded-input border border-borders-outline/10">
                  <p className="text-[10px] text-text-secondary font-sans uppercase">License Plate</p>
                  <p className="font-sans font-bold text-text-primary mt-0.5">{selectedOrder.plate}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 bg-white p-3 rounded-input border border-borders-outline/10">
                  <p className="text-[10px] text-text-secondary font-sans uppercase">Fuel Type</p>
                  <p className="font-bold text-text-primary mt-0.5">{selectedOrder.fuelType}</p>
                </div>
                <div className="space-y-1 bg-white p-3 rounded-input border border-borders-outline/10">
                  <p className="text-[10px] text-text-secondary font-sans uppercase">Volume</p>
                  <p className="font-bold text-text-primary mt-0.5">{selectedOrder.quantity}</p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-input border border-borders-outline/10 space-y-2">
                <div className="flex justify-between">
                  <span>Base Dispatch Fee</span>
                  <span className="font-bold text-text-primary">{selectedOrder.basePrice}</span>
                </div>
                <div className="flex justify-between">
                  <span>Fuel Volume Cost</span>
                  <span className="font-bold text-text-primary">{selectedOrder.fuelCost}</span>
                </div>
                <div className="flex justify-between">
                  <span>Speed Priority Surcharge</span>
                  <span className="font-bold text-text-primary">{selectedOrder.surcharge}</span>
                </div>
                <div className="h-px bg-borders-outline/10 my-2.5" />
                <div className="flex justify-between text-sm font-bold text-brand-primary">
                  <span>Total Amount Paid</span>
                  <span>{selectedOrder.total}</span>
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-input border border-borders-outline/10 flex justify-between items-center">
                <span>Payment Method: {selectedOrder.paymentMethod}</span>
                <Badge variant="success">PAID</Badge>
              </div>

            </div>

            {/* Actions Footer */}
            <div className="flex gap-3 pt-4 border-t border-borders-outline/10">
              <Button
                variant="outline"
                className="w-1/2 justify-center flex items-center gap-1.5"
                onClick={() => handleDownloadInvoice(selectedOrder)}
              >
                <Download className="w-4 h-4" /> Download PDF Invoice
              </Button>
              <Button
                variant="primary"
                className="w-1/2 justify-center"
                onClick={() => setSelectedOrder(null)}
              >
                Close Details
              </Button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
