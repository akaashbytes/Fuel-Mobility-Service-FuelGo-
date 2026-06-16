import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { ShieldCheck, X, FileText, AlertTriangle, Eye, Edit2, Trash2, ShieldAlert, CheckCircle2, RotateCcw } from 'lucide-react';

export default function ProviderManagement() {
  const [filterTab, setFilterTab] = useState('ACTIVE');
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [editingProvider, setEditingProvider] = useState(null);
  const [providerToDelete, setProviderToDelete] = useState(null);

  const [providers, setProviders] = useState([
    { id: 'RF-928', name: 'Marcus Vance', vehicle: 'Mobile Tanker (Ford F-250)', licensePlate: '92-XDW-8', email: 'marcus@nexfuel.com', documents: { cdl: 'CDL_MarcusVance.pdf', hazmat: 'Hazmat_Certified_2026.pdf', insurance: 'Commercial_Insurance.pdf' }, status: 'ACTIVE', completedDeliveries: 142 },
    { id: 'RF-312', name: 'Diana Prince', vehicle: 'Flatbed Tow (Dodge Ram)', licensePlate: '12-ZXC-4', email: 'diana@nexfuel.com', documents: { cdl: 'CDL_DianaPrince.pdf', hazmat: 'Hazmat_Tow_Clearance.pdf', insurance: 'Commercial_Insurance.pdf' }, status: 'ACTIVE', completedDeliveries: 85 },
    { id: 'RF-774', name: 'Peter Parker', vehicle: 'Service EV (Tesla Model X)', licensePlate: '41-XDF-2', email: 'peter@nexfuel.com', documents: { cdl: 'CDL_PeterParker.pdf', hazmat: 'Hazmat_EV_Clearance.pdf', insurance: 'Commercial_Insurance.pdf' }, status: 'PENDING', completedDeliveries: 0 },
    { id: 'RF-819', name: 'Clark Kent', vehicle: 'Service Van (Chevy Express)', licensePlate: '88-SLD-9', email: 'clark@nexfuel.com', documents: { cdl: 'CDL_ClarkKent.pdf', hazmat: 'Expired_Hazmat.pdf', insurance: 'Commercial_Insurance.pdf' }, status: 'REJECTED', completedDeliveries: 0 },
    { id: 'RF-504', name: 'Bruce Wayne', vehicle: 'Heavy Fuel Tanker (Kenworth T680)', licensePlate: '77-BAT-3', email: 'bruce@nexfuel.com', documents: { cdl: 'CDL_BruceWayne.pdf', hazmat: 'Hazmat_Heavy_Clearance.pdf', insurance: 'Commercial_Insurance.pdf' }, status: 'SUSPENDED', completedDeliveries: 320 }
  ]);

  const filteredProviders = providers.filter((p) => p.status === filterTab);

  const handleApprove = (id) => {
    setProviders((prev) =>
      prev.map((p) => p.id === id ? { ...p, status: 'ACTIVE' } : p)
    );
    setSelectedProvider(null);
    alert('Provider credentials successfully verified. Shift credentials activated.');
  };

  const handleReject = (id) => {
    setProviders((prev) =>
      prev.map((p) => p.id === id ? { ...p, status: 'REJECTED' } : p)
    );
    setSelectedProvider(null);
    alert('Provider credentials set to Rejected. Notification email logs transmitted.');
  };

  const handleToggleSuspend = (id) => {
    setProviders((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const isSuspended = p.status === 'SUSPENDED';
          const nextStatus = isSuspended ? 'ACTIVE' : 'SUSPENDED';
          alert(`Provider credentials successfully ${isSuspended ? 'activated' : 'suspended'}.`);
          return { ...p, status: nextStatus };
        }
        return p;
      })
    );
  };

  const handleDeleteConfirm = (id) => {
    setProviders((prev) =>
      prev.map((p) => p.id === id ? { ...p, status: 'REMOVED' } : p)
    );
    setProviderToDelete(null);
    alert('Provider successfully marked as Removed from active operations.');
  };

  const handleSaveEdit = (updatedProvider) => {
    setProviders((prev) =>
      prev.map((p) => p.id === updatedProvider.id ? updatedProvider : p)
    );
    setEditingProvider(null);
    alert('Provider profile settings successfully updated.');
  };

  const getBadgeVariant = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'SUSPENDED':
        return 'danger';
      case 'REJECTED':
        return 'danger';
      case 'REMOVED':
      default:
        return 'ghost';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold font-display text-brand-dark">Provider Fleet Audit</h1>
        <p className="text-sm text-text-secondary mt-0.5">Approve driver licensing registrations, review Hazmat insurance credentials, manage provider status, and inspect safety files.</p>
      </div>

      {/* Tabs HUD */}
      <div className="flex flex-wrap gap-2 font-mono text-xs">
        {['ACTIVE', 'PENDING', 'SUSPENDED', 'REJECTED', 'REMOVED'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilterTab(tab)}
            className={`px-4 py-2.5 rounded-btn border font-bold transition-all cursor-pointer ${
              filterTab === tab
                ? 'border-brand-primary bg-brand-primary/5 text-brand-primary'
                : 'border-borders-outline/15 hover:border-borders-outline/35 bg-white text-text-muted'
            }`}
          >
            {tab} ({providers.filter((p) => p.status === tab).length})
          </button>
        ))}
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProviders.length > 0 ? (
          filteredProviders.map((p) => (
            <Card
              key={p.id}
              title={p.name}
              subtitle={`${p.vehicle} | Plate: ${p.licensePlate}`}
              headerAction={
                <Badge variant={getBadgeVariant(p.status)}>
                  {p.status}
                </Badge>
              }
            >
              <div className="space-y-4 font-mono text-xs text-text-secondary">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] text-text-muted">Driver Identity Code</span>
                    <p className="font-bold text-text-primary">{p.id}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-text-muted">Email Log Address</span>
                    <p className="font-bold text-text-primary break-all">{p.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] text-text-muted">Completed Deliveries</span>
                    <p className="font-bold text-text-primary">{p.completedDeliveries} Trips</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-text-muted">Current System Status</span>
                    <p className="font-bold text-text-primary">{p.status}</p>
                  </div>
                </div>

                {/* Card Actions Layout */}
                <div className="flex flex-wrap gap-2 justify-between items-center pt-3 border-t border-borders-outline/10">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1 font-mono text-[10px] uppercase font-bold"
                    onClick={() => setSelectedProvider(p)}
                  >
                    <Eye className="w-3.5 h-3.5" /> Audit
                  </Button>

                  <div className="flex gap-1">
                    {p.status !== 'REMOVED' && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex items-center gap-1 font-mono text-[10px] uppercase font-bold text-text-secondary"
                          onClick={() => setEditingProvider(p)}
                        >
                          <Edit2 className="w-3.5 h-3.5" /> Edit
                        </Button>

                        {(p.status === 'ACTIVE' || p.status === 'SUSPENDED') && (
                          <Button
                            variant={p.status === 'ACTIVE' ? 'outline' : 'success'}
                            size="sm"
                            className="flex items-center gap-1 font-mono text-[10px] uppercase font-bold"
                            onClick={() => handleToggleSuspend(p.id)}
                          >
                            <ShieldAlert className="w-3.5 h-3.5" />
                            {p.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                          </Button>
                        )}

                        <Button
                          variant="danger"
                          size="sm"
                          className="flex items-center gap-1 font-mono text-[10px] uppercase font-bold"
                          onClick={() => setProviderToDelete(p)}
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </Button>
                      </>
                    )}

                    {p.status === 'REMOVED' && (
                      <Button
                        variant="success"
                        size="sm"
                        className="flex items-center gap-1 font-mono text-[10px] uppercase font-bold"
                        onClick={() => {
                          setProviders((prev) =>
                            prev.map((prov) => prov.id === p.id ? { ...prov, status: 'ACTIVE' } : prov)
                          );
                          alert('Provider credentials restored to Active status.');
                        }}
                      >
                        <RotateCcw className="w-3.5 h-3.5" /> Restore
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-2 bg-white border border-borders-outline/10 rounded-card p-12 text-center text-text-muted text-sm font-mono">
            NO PROVIDER PROFILES FOUND FOR CURRENT COMPLIANCE TAB
          </div>
        )}
      </div>

      {/* Verification Audit Modal */}
      {selectedProvider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300">
          <div className="w-full max-w-lg bg-[linear-gradient(135deg,#fdf4f5_0%,#f1eef8_100%)] rounded-card shadow-floating border border-borders-outline/10 overflow-hidden relative p-8 flex flex-col">
            
            {/* Header */}
            <div className="flex justify-between items-center pb-4 border-b border-borders-outline/10">
              <div>
                <span className="font-mono text-xs font-bold text-brand-primary">SAFETY COMPLIANCE AUDIT</span>
                <h3 className="text-lg font-bold font-display text-brand-dark mt-0.5">{selectedProvider.name}</h3>
              </div>
              <button
                onClick={() => setSelectedProvider(null)}
                className="p-1 rounded-btn hover:bg-surface-low text-text-muted hover:text-text-primary cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Document logs */}
            <div className="py-6 space-y-4 text-sm font-mono text-text-secondary">
              
              <div className="bg-white p-3 rounded-input border border-borders-outline/10 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-brand-primary" />
                  <span>Commercial License (CDL)</span>
                </div>
                <span className="font-semibold text-text-primary underline cursor-pointer">{selectedProvider.documents.cdl}</span>
              </div>

              <div className="bg-white p-3 rounded-input border border-borders-outline/10 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-brand-primary" />
                  <span>Hazmat Clearance Permit</span>
                </div>
                <span className="font-semibold text-text-primary underline cursor-pointer">{selectedProvider.documents.hazmat}</span>
              </div>

              <div className="bg-white p-3 rounded-input border border-borders-outline/10 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-brand-primary" />
                  <span>Commercial Liability Insurance</span>
                </div>
                <span className="font-semibold text-text-primary underline cursor-pointer">{selectedProvider.documents.insurance}</span>
              </div>

              {selectedProvider.status === 'REJECTED' && (
                <div className="bg-red-50 border border-red-200 p-3 rounded-btn text-xs text-red-700 leading-normal flex items-start gap-1.5 font-sans">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <p>Credentials rejected: Driver's uploaded Hazmat documentation certificate has expired. Please contact driver for re-submission.</p>
                </div>
              )}

            </div>

            {/* Actions footer */}
            <div className="flex gap-3 pt-4 border-t border-borders-outline/10 font-sans">
              {selectedProvider.status === 'PENDING' ? (
                <>
                  <button
                    onClick={() => handleReject(selectedProvider.id)}
                    className="w-1/2 py-3 border border-borders-outline/15 rounded-btn hover:bg-red-50 hover:text-brand-primary hover:border-red-500 font-bold text-xs cursor-pointer transition-colors"
                  >
                    Reject Driver
                  </button>
                  <Button
                    variant="success"
                    className="w-1/2 justify-center flex items-center gap-1.5"
                    onClick={() => handleApprove(selectedProvider.id)}
                  >
                    <ShieldCheck className="w-4.5 h-4.5" /> Approve Driver
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  className="w-full justify-center"
                  onClick={() => setSelectedProvider(null)}
                >
                  Close Audit
                </Button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Edit Provider Modal */}
      {editingProvider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300">
          <div className="w-full max-w-lg bg-[linear-gradient(135deg,#fdf4f5_0%,#f1eef8_100%)] rounded-card shadow-floating border border-borders-outline/10 overflow-hidden relative p-8 flex flex-col">
            
            {/* Header */}
            <div className="flex justify-between items-center pb-4 border-b border-borders-outline/10">
              <div>
                <span className="font-mono text-xs font-bold text-brand-primary font-sans">EDIT PROVIDER SETTINGS</span>
                <h3 className="text-lg font-bold font-display text-brand-dark mt-0.5">Edit Profile</h3>
              </div>
              <button
                onClick={() => setEditingProvider(null)}
                className="p-1 rounded-btn hover:bg-surface-low text-text-muted hover:text-text-primary cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Fields */}
            <div className="py-6 space-y-4 text-sm font-sans">
              <div className="space-y-1">
                <label className="text-xs text-text-secondary font-bold font-mono">Provider Name</label>
                <input
                  type="text"
                  className="w-full p-3 bg-white rounded-input border border-borders-outline/15 text-text-primary font-mono focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                  value={editingProvider.name}
                  onChange={(e) => setEditingProvider({ ...editingProvider, name: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-text-secondary font-bold font-mono">Email Address</label>
                <input
                  type="email"
                  className="w-full p-3 bg-white rounded-input border border-borders-outline/15 text-text-primary font-mono focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                  value={editingProvider.email}
                  onChange={(e) => setEditingProvider({ ...editingProvider, email: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-text-secondary font-bold font-mono">Vehicle Model</label>
                <input
                  type="text"
                  className="w-full p-3 bg-white rounded-input border border-borders-outline/15 text-text-primary font-mono focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                  value={editingProvider.vehicle}
                  onChange={(e) => setEditingProvider({ ...editingProvider, vehicle: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-text-secondary font-bold font-mono">License Plate</label>
                  <input
                    type="text"
                    className="w-full p-3 bg-white rounded-input border border-borders-outline/15 text-text-primary font-mono focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                    value={editingProvider.licensePlate}
                    onChange={(e) => setEditingProvider({ ...editingProvider, licensePlate: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-text-secondary font-bold font-mono">Completed Deliveries</label>
                  <input
                    type="number"
                    className="w-full p-3 bg-white rounded-input border border-borders-outline/15 text-text-primary font-mono focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                    value={editingProvider.completedDeliveries}
                    onChange={(e) => setEditingProvider({ ...editingProvider, completedDeliveries: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
            </div>

            {/* Actions footer */}
            <div className="flex gap-3 pt-4 border-t border-borders-outline/10 font-sans">
              <button
                onClick={() => setEditingProvider(null)}
                className="w-1/2 py-3 border border-borders-outline/15 rounded-btn hover:bg-surface-low text-text-muted hover:text-text-primary font-bold text-xs cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <Button
                variant="primary"
                className="w-1/2 justify-center"
                onClick={() => handleSaveEdit(editingProvider)}
              >
                Save Settings
              </Button>
            </div>

          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {providerToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300">
          <div className="w-full max-w-md bg-white rounded-card shadow-floating border border-red-200 overflow-hidden relative p-8 flex flex-col">
            
            {/* Warning Header */}
            <div className="flex items-center gap-3 pb-4 border-b border-borders-outline/10">
              <div className="p-2.5 bg-red-100 text-red-600 rounded-full shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <span className="font-mono text-xs font-bold text-red-600">CONFIRM REMOVAL</span>
                <h3 className="text-lg font-bold font-display text-brand-dark mt-0.5">Remove Provider Profile?</h3>
              </div>
            </div>

            {/* Detail Stats */}
            <div className="py-6 space-y-4 text-sm font-mono text-text-secondary bg-surface-low/50 p-4 rounded-input border border-borders-outline/5 my-4">
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Provider Name</span>
                <span className="font-bold text-text-primary">{providerToDelete.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Provider ID</span>
                <span className="font-bold text-text-primary">{providerToDelete.id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Completed Deliveries</span>
                <span className="font-bold text-text-primary">{providerToDelete.completedDeliveries}</span>
              </div>
            </div>

            <p className="text-xs text-text-muted leading-relaxed font-sans text-center mb-6">
              Are you sure you want to remove this provider from the platform?
            </p>

            {/* Actions footer */}
            <div className="flex gap-3 font-sans">
              <button
                onClick={() => setProviderToDelete(null)}
                className="w-1/2 py-3 border border-borders-outline/15 rounded-btn hover:bg-surface-low text-text-muted hover:text-text-primary font-bold text-xs cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteConfirm(providerToDelete.id)}
                className="w-1/2 py-3 bg-red-600 text-white rounded-btn hover:bg-red-700 font-bold text-xs cursor-pointer transition-colors text-center"
              >
                Delete Provider
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
