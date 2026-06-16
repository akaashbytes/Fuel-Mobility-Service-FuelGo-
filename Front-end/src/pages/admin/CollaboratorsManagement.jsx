import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useCollaboratorStore } from '../../store/useCollaboratorStore';
import {
  Building,
  Phone,
  Mail,
  MapPin,
  Activity,
  Plus,
  Trash2,
  Edit3,
  Calendar,
  X,
  FileText,
  Clock,
  Compass,
  DollarSign
} from 'lucide-react';

export default function CollaboratorsManagement() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedBunkId, setSelectedBunkId] = useState(1);
  const [editingBunk, setEditingBunk] = useState(null);

  const bunks = useCollaboratorStore((state) => state.bunks);
  const addCollaborator = useCollaboratorStore((state) => state.addCollaborator);
  const updateCollaborator = useCollaboratorStore((state) => state.updateCollaborator);
  const deleteCollaborator = useCollaboratorStore((state) => state.deleteCollaborator);

  const selectedBunk = bunks.find(b => b.id === selectedBunkId) || bunks[0];

  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    phone: '',
    email: '',
    address: '',
    serviceArea: 'Bangalore South',
    status: 'Prospect',
    contractDate: '',
    notes: '',
    petrolPrice: '$3.50',
    dieselPrice: '$3.15',
    premiumPrice: '$4.20'
  });

  const handleToggleAddModal = () => {
    setEditingBunk(null);
    setFormData({
      name: '',
      contact: '',
      phone: '',
      email: '',
      address: '',
      serviceArea: 'Bangalore South',
      status: 'Prospect',
      contractDate: '',
      notes: '',
      petrolPrice: '$3.50',
      dieselPrice: '$3.15',
      premiumPrice: '$4.20'
    });
    setShowAddModal(!showAddModal);
  };

  const handleEditTrigger = (bunk) => {
    setEditingBunk(bunk);
    setFormData({
      name: bunk.name,
      contact: bunk.contact,
      phone: bunk.phone,
      email: bunk.email,
      address: bunk.address,
      serviceArea: bunk.serviceArea,
      status: bunk.status,
      contractDate: bunk.contractDate,
      notes: bunk.notes,
      petrolPrice: bunk.petrolPrice,
      dieselPrice: bunk.dieselPrice,
      premiumPrice: bunk.premiumPrice
    });
    setShowAddModal(true);
  };

  const handleDeleteBunk = (id) => {
    if (confirm('Are you sure you want to remove this petrol bunk collaborator partner?')) {
      deleteCollaborator(id);
      if (selectedBunkId === id) {
        setSelectedBunkId(null);
      }
      alert('Collaborator successfully deleted.');
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const nowTimestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
    if (editingBunk) {
      updateCollaborator(editingBunk.id, {
        ...formData,
        priceLastUpdated: nowTimestamp
      });
      alert('Collaborator partner configuration updated successfully.');
    } else {
      addCollaborator({
        ...formData,
        priceLastUpdated: nowTimestamp
      });
      alert('New petrol bunk partner registered successfully.');
    }
    setShowAddModal(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active Partner': return 'success';
      case 'Suspended': return 'danger';
      case 'Prospect': return 'primary';
      case 'Inactive':
      default:
        return 'warning';
    }
  };

  return (
    <div className="space-y-6 font-sans text-body">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-brand-dark">Collaborators & Partners</h1>
          <p className="text-xs text-text-secondary mt-0.5 text-desc">Manage petrol bunk partnerships, check fuel availability records, and audit driver reload locations.</p>
        </div>
        <Button variant="primary" size="sm" className="font-mono text-[10px] uppercase font-bold flex items-center gap-1.5 text-btn" onClick={handleToggleAddModal}>
          <Plus className="w-4 h-4" /> Add Collaborator Station
        </Button>
      </div>

      {/* Main Grid: Bunks & Side details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Collaborators List */}
        <div className="lg:col-span-2 space-y-4">
          {bunks.map((bunk) => (
            <div
              key={bunk.id}
              onClick={() => setSelectedBunkId(bunk.id)}
              className={`bg-white border rounded-card p-5 shadow-sm hover:shadow-industrial transition-all duration-200 cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
                selectedBunk && selectedBunk.id === bunk.id ? 'border-brand-primary border-2' : 'border-borders-outline/10'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2.5">
                  <span className="font-bold text-text-primary text-sm font-sans">{bunk.name}</span>
                  <Badge variant={getStatusColor(bunk.status)}>{bunk.status.toUpperCase()}</Badge>
                </div>
                <div className="text-xs font-mono text-text-secondary space-y-0.5 text-desc">
                  <p>• Contact: {bunk.contact} ({bunk.phone})</p>
                  <p className="truncate max-w-sm sm:max-w-md">• Area: {bunk.serviceArea} | Address: {bunk.address}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end font-sans">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditTrigger(bunk);
                  }}
                  className="p-2 rounded-btn bg-surface-low border border-borders-outline/10 text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                  title="Edit Station"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteBunk(bunk.id);
                  }}
                  className="p-2 rounded-btn bg-surface-low border border-borders-outline/10 text-text-muted hover:text-brand-primary transition-colors cursor-pointer"
                  title="Delete Station"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Partner details sidebar */}
        <div className="space-y-6">
          {selectedBunk ? (
            <Card title={selectedBunk.name} subtitle={`Contact: ${selectedBunk.contact}`}>
              <div className="space-y-5 text-xs font-mono text-text-secondary text-desc">
                
                {/* Fuel Pricing Section */}
                <div className="bg-white p-4 rounded-input border border-brand-primary/10 space-y-2">
                  <h4 className="text-[10px] text-brand-primary font-sans font-bold uppercase tracking-wider flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5" /> Fuel Pricing Manager
                  </h4>
                  <div className="h-px bg-borders-outline/5 my-1" />
                  <div className="flex justify-between">
                    <span>Regular Octane (87)</span>
                    <span className="font-bold text-text-primary">{selectedBunk.petrolPrice} / gal</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Premium Octane (91)</span>
                    <span className="font-bold text-brand-primary">{selectedBunk.premiumPrice} / gal</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Diesel Grade</span>
                    <span className="font-bold text-text-primary">{selectedBunk.dieselPrice} / gal</span>
                  </div>
                  <div className="h-px bg-borders-outline/5 my-1.5" />
                  <div className="text-[9px] text-text-muted flex justify-between font-sans">
                    <span>Last Updated:</span>
                    <span>{selectedBunk.priceLastUpdated || 'N/A'}</span>
                  </div>
                </div>

                {/* Fuel stock parameters */}
                <div className="bg-surface-low p-4 rounded-input border border-borders-outline/10 space-y-2 font-mono">
                  <h4 className="text-[10px] text-text-secondary font-sans font-bold uppercase tracking-wider">AVAILABLE FUEL RESERVES</h4>
                  <div className="h-px bg-borders-outline/5 my-1.5" />
                  <div className="flex justify-between">
                    <span>87 Regular</span>
                    <span className="font-bold text-text-primary">{selectedBunk.stocks?.petrol || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>91 Premium</span>
                    <span className="font-bold text-brand-primary">{selectedBunk.stocks?.premiumPetrol || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Diesel Fuel</span>
                    <span className="font-bold text-text-primary">{selectedBunk.stocks?.diesel || 'N/A'}</span>
                  </div>
                </div>

                {/* Assigned Providers */}
                <div className="bg-surface-low p-4 rounded-input border border-borders-outline/10 space-y-2 font-mono">
                  <h4 className="text-[10px] text-text-secondary font-sans font-bold uppercase tracking-wider">ON-GRID ASSIGNED DRIVERS ({selectedBunk.assignedDrivers?.length || 0})</h4>
                  <div className="h-px bg-borders-outline/5 my-1.5" />
                  {selectedBunk.assignedDrivers && selectedBunk.assignedDrivers.length > 0 ? (
                    selectedBunk.assignedDrivers.map((d) => (
                      <div key={d.id} className="flex justify-between items-center text-text-muted">
                        <span className="font-sans font-bold text-text-primary">{d.name} ({d.id})</span>
                        <Badge variant="primary">{d.task}</Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-[10px] text-text-muted">No active drivers refilling at this depot.</p>
                  )}
                </div>

                {/* Partner Statistics */}
                <div className="bg-surface-low p-4 rounded-input border border-borders-outline/10 space-y-2">
                  <h4 className="text-[10px] text-text-secondary font-sans font-bold uppercase tracking-wider">STATION DISPATCH PERFORMANCE</h4>
                  <div className="h-px bg-borders-outline/5 my-1.5" />
                  <div className="flex justify-between">
                    <span>Total Deliveries</span>
                    <span className="font-bold text-text-primary">{selectedBunk.stats?.deliveries || 0} jobs</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fuel Disbursed</span>
                    <span className="font-bold text-text-primary">{selectedBunk.stats?.purchased || '0 Gal'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Payout Wait</span>
                    <span className="font-bold text-success">{selectedBunk.stats?.avgTime || 'N/A'}</span>
                  </div>
                </div>

                {/* Notes & Contract Dates */}
                <div className="bg-surface-low p-4 rounded-input border border-borders-outline/10 space-y-2 font-sans">
                  <h4 className="text-[10px] text-text-secondary font-sans font-bold uppercase tracking-wider font-mono">INTERNAL COLLABORATION NOTES</h4>
                  <div className="h-px bg-borders-outline/5 my-1.5" />
                  <p className="leading-relaxed text-[11px]">{selectedBunk.notes}</p>
                  <p className="text-[10px] text-brand-primary font-mono font-bold mt-1.5 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> Expiry: {selectedBunk.contractDate}
                  </p>
                </div>

              </div>
            </Card>
          ) : (
            <div className="bg-white border border-borders-outline/10 rounded-card p-6 text-center text-text-muted text-xs font-mono">
              SELECT A COLLABORATOR STATION TO AUDIT DEPOT RESERVES AND ASSIGNED TELEMETRY
            </div>
          )}
        </div>

      </div>

      {/* Add / Edit Collaborator Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300">
          <form onSubmit={handleFormSubmit} className="w-full max-w-lg bg-[linear-gradient(135deg,#fdf4f5_0%,#f1eef8_100%)] rounded-card shadow-floating border border-borders-outline/10 overflow-hidden relative p-8 flex flex-col">
            
            {/* Header */}
            <div className="flex justify-between items-center pb-4 border-b border-borders-outline/10">
              <h3 className="text-lg font-bold font-display text-brand-dark">
                {editingBunk ? 'Edit Collaborator Station' : 'Register Collaborator Station'}
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-btn hover:bg-surface-low text-text-muted hover:text-text-primary cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Form Fields */}
            <div className="py-6 space-y-4 max-h-[350px] overflow-y-auto pr-1">
              <Input
                label="Petrol Bunk Station Name"
                placeholder="e.g. Shell Petrol Station - Indiranagar"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <Input
                label="Contact Person"
                placeholder="e.g. Anil Kumar"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                required
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Contact Phone"
                  placeholder="e.g. +919876543210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
                <Input
                  label="Contact Email"
                  placeholder="e.g. station@shell.in"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <Input
                label="Station Address"
                placeholder="e.g. 12th Main Road, Indiranagar"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
              />
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5 font-sans">
                  <label className="font-mono text-[11px] font-semibold text-text-secondary uppercase tracking-wider block">
                    Service Area Sector
                  </label>
                  <select
                    value={formData.serviceArea}
                    onChange={(e) => setFormData({ ...formData, serviceArea: e.target.value })}
                    className="w-full bg-white text-text-primary border border-borders-outline/25 rounded-input py-3.5 px-4 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all text-xs font-semibold appearance-none focus:outline-none"
                  >
                    <option value="Bangalore South">Bangalore South</option>
                    <option value="Bangalore East">Bangalore East</option>
                    <option value="Bangalore Central">Bangalore Central</option>
                  </select>
                </div>
                <div className="space-y-1.5 font-sans">
                  <label className="font-mono text-[11px] font-semibold text-text-secondary uppercase tracking-wider block">
                    Partnership Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-white text-text-primary border border-borders-outline/25 rounded-input py-3.5 px-4 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all text-xs font-semibold appearance-none focus:outline-none"
                  >
                    <option value="Prospect">Prospect</option>
                    <option value="Active Partner">Active Partner</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>

              {/* Pricing Inputs */}
              <div className="bg-surface-low/50 p-4 rounded-input border border-borders-outline/10 space-y-3 font-sans">
                <h4 className="text-[10px] text-text-secondary font-mono font-bold uppercase tracking-wider">Configure Fuel Pricing per Gallon</h4>
                <div className="grid grid-cols-3 gap-2">
                  <Input
                    label="Regular (87)"
                    placeholder="e.g. $3.50"
                    value={formData.petrolPrice}
                    onChange={(e) => setFormData({ ...formData, petrolPrice: e.target.value })}
                    required
                  />
                  <Input
                    label="Premium (91)"
                    placeholder="e.g. $4.20"
                    value={formData.premiumPrice}
                    onChange={(e) => setFormData({ ...formData, premiumPrice: e.target.value })}
                    required
                  />
                  <Input
                    label="Diesel"
                    placeholder="e.g. $3.15"
                    value={formData.dieselPrice}
                    onChange={(e) => setFormData({ ...formData, dieselPrice: e.target.value })}
                    required
                  />
                </div>
              </div>

              <Input
                label="Contract Expiration Date"
                type="date"
                value={formData.contractDate}
                onChange={(e) => setFormData({ ...formData, contractDate: e.target.value })}
                required
              />
              <div className="space-y-1.5 font-sans">
                <label className="font-mono text-[11px] font-semibold text-text-secondary uppercase tracking-wider block">
                  Collaboration Internal Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Enter contract constraints, reload specifications..."
                  className="w-full bg-white text-text-primary border border-borders-outline/25 rounded-input py-2.5 px-4 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/10 text-xs font-semibold"
                  rows={3}
                />
              </div>
            </div>

            {/* Actions footer */}
            <div className="flex gap-3 pt-4 border-t border-borders-outline/10 font-sans">
              <Button
                type="button"
                variant="outline"
                className="w-1/2 justify-center"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="w-1/2 justify-center"
              >
                {editingBunk ? 'Update Partner' : 'Register Partner'}
              </Button>
            </div>

          </form>
        </div>
      )}

    </div>
  );
}
