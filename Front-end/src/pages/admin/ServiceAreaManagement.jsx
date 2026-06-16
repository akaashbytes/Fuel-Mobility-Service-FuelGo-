import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { Plus, Edit3, Globe, Trash2, MapPin, X } from 'lucide-react';

export default function ServiceAreaManagement() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingArea, setEditingArea] = useState(null);
  
  const [areas, setAreas] = useState([
    { id: 1, name: 'Bangalore South (Koramangala/HSR)', coordinates: 'Polygon (12.9348° N, 77.6189° E)', radius: '5.2 km Radius', status: 'ACTIVE' },
    { id: 2, name: 'Bangalore East (Indiranagar/Whitefield)', coordinates: 'Polygon (12.9784° N, 77.6408° E)', radius: '8.0 km Radius', status: 'ACTIVE' },
    { id: 3, name: 'Bangalore Central (MG Road)', coordinates: 'Polygon (12.9716° N, 77.5946° E)', radius: '3.5 km Radius', status: 'INACTIVE' }
  ]);

  const [formData, setFormData] = useState({
    name: '',
    coordinates: '',
    radius: '',
    status: 'ACTIVE'
  });

  const handleToggleStatus = (id) => {
    setAreas((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, status: a.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' }
          : a
      )
    );
  };

  const handleEditTrigger = (area) => {
    setEditingArea(area);
    setFormData({
      name: area.name,
      coordinates: area.coordinates,
      radius: area.radius,
      status: area.status
    });
    setShowAddModal(true);
  };

  const handleAddAreaTrigger = () => {
    setEditingArea(null);
    setFormData({
      name: '',
      coordinates: '',
      radius: '',
      status: 'ACTIVE'
    });
    setShowAddModal(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (editingArea) {
      // Update
      setAreas((prev) =>
        prev.map((a) =>
          a.id === editingArea.id
            ? { ...a, ...formData }
            : a
        )
      );
      alert('Service area configuration updated successfully.');
    } else {
      // Add
      const newArea = {
        id: Date.now(),
        ...formData
      };
      setAreas((prev) => [...prev, newArea]);
      alert('New service geofence registered successfully.');
    }
    setShowAddModal(false);
  };

  const handleDeleteArea = (id) => {
    if (confirm('Are you sure you want to remove this service area polygon?')) {
      setAreas((prev) => prev.filter((a) => a.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-brand-dark">Service Areas (Geofences)</h1>
          <p className="text-xs text-text-secondary mt-0.5">Define operational boundaries, adjust matching limits, and toggle regional dispatch centers.</p>
        </div>
        <Button variant="primary" size="sm" className="font-mono text-[10px] uppercase font-bold flex items-center gap-1.5" onClick={handleAddAreaTrigger}>
          <Plus className="w-4 h-4" /> Add Service Area
        </Button>
      </div>

      {/* Areas List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {areas.map((area) => (
          <Card
            key={area.id}
            title={area.name}
            subtitle={area.radius}
            headerAction={
              <Badge variant={area.status === 'ACTIVE' ? 'success' : 'danger'}>
                {area.status}
              </Badge>
            }
          >
            <div className="space-y-4 font-mono text-xs text-text-secondary">
              <div className="space-y-1">
                <span className="text-[10px] text-text-muted">Bound Coordinates</span>
                <p className="font-bold text-text-primary text-[11px] truncate flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-brand-primary" /> {area.coordinates}
                </p>
              </div>

              <div className="flex gap-2 justify-end pt-3 border-t border-borders-outline/10 font-sans">
                <button
                  onClick={() => handleToggleStatus(area.id)}
                  className={`px-3 py-1.5 border rounded-btn text-[10px] font-bold transition-all cursor-pointer ${
                    area.status === 'ACTIVE'
                      ? 'border-red-500/20 text-red-500 hover:bg-red-50'
                      : 'border-emerald-500/20 text-emerald-600 hover:bg-emerald-50'
                  }`}
                >
                  {area.status === 'ACTIVE' ? 'Disable' : 'Enable'}
                </button>
                <button
                  onClick={() => handleEditTrigger(area)}
                  className="p-1.5 rounded-btn bg-surface-low border border-borders-outline/10 text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                  title="Edit Boundaries"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteArea(area.id)}
                  className="p-1.5 rounded-btn bg-surface-low border border-borders-outline/10 text-text-muted hover:text-brand-primary transition-colors cursor-pointer"
                  title="Delete Polygon"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add / Edit Geofence Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300">
          <form onSubmit={handleFormSubmit} className="w-full max-w-lg bg-[linear-gradient(135deg,#fdf4f5_0%,#f1eef8_100%)] rounded-card shadow-floating border border-borders-outline/10 overflow-hidden relative p-8 flex flex-col">
            
            {/* Header */}
            <div className="flex justify-between items-center pb-4 border-b border-borders-outline/10">
              <h3 className="text-lg font-bold font-display text-brand-dark">
                {editingArea ? 'Edit Geofence Boundary' : 'Register New Geofence Polygon'}
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
            <div className="py-6 space-y-4">
              <Input
                label="Sector / City Area Name"
                placeholder="e.g. Bangalore West (Rajajinagar)"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />

              <Input
                label="Primary Landmark Coordinates"
                placeholder="e.g. Polygon (12.9XXXX° N, 77.5XXXX° E)"
                value={formData.coordinates}
                onChange={(e) => setFormData({ ...formData, coordinates: e.target.value })}
                required
              />

              <Input
                label="Operational Dispatch Radius"
                placeholder="e.g. 5.5 km Radius"
                value={formData.radius}
                onChange={(e) => setFormData({ ...formData, radius: e.target.value })}
                required
              />

              <div className="space-y-1.5 font-sans">
                <label className="font-mono text-[11px] font-semibold text-text-secondary uppercase tracking-wider block">
                  Initial Boundary Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full bg-white text-text-primary border border-borders-outline/25 rounded-input py-3.5 px-4 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all text-sm font-semibold appearance-none"
                >
                  <option value="ACTIVE">ACTIVE (Accept matching dispatches)</option>
                  <option value="INACTIVE">INACTIVE (Disable area dispatches)</option>
                </select>
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
                {editingArea ? 'Update Geofence' : 'Activate Boundary'}
              </Button>
            </div>

          </form>
        </div>
      )}

    </div>
  );
}
