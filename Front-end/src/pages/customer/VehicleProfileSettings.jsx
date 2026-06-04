import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Badge from '../../components/common/Badge';
import { useAuthStore } from '../../store/useAuthStore';
import { User, Phone, Shield, Car, Save } from 'lucide-react';

export default function VehicleProfileSettings() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const updateProfile = useAuthStore((state) => state.updateProfile);

  const [name, setName] = useState(user?.name || 'Alex Mercer');
  const [phone, setPhone] = useState('+1 (555) 902-8491');
  const [vehicleMake, setVehicleMake] = useState('Tesla');
  const [vehicleModel, setVehicleModel] = useState('Model Y');
  const [vehicleColor, setVehicleColor] = useState('Red');
  const [licensePlate, setLicensePlate] = useState('82-SLD-9');
  const [vin, setVin] = useState('5YJ3E1EB8LF82930');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile({ name });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
          ← Back to Dashboard
        </Button>
        <div className="h-4 w-px bg-borders-outline/20" />
        <h1 className="text-xl font-bold flex items-center gap-2">
          Vehicle & Profile Settings
        </h1>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <Card title="Personal Details" subtitle="Primary contact for emergency dispatch communication">
          <div className="space-y-4">
            <div className="flex items-center gap-4 mb-4">
              <img src={user?.avatar} alt="Avatar" className="w-16 h-16 rounded-full border border-borders-outline/20 bg-surface-low" />
              <div>
                <Badge variant="primary">Access Level: Client</Badge>
                <p className="text-xs text-text-secondary font-mono mt-1">ID: {user?.id}</p>
              </div>
            </div>

            <Input
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              icon={User}
              required
            />

            <Input
              label="Contact Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              icon={Phone}
              required
            />
          </div>
        </Card>

        <Card title="Primary Dispatch Vehicle" subtitle="Used by responders to identify your car on arrival">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Make"
              value={vehicleMake}
              onChange={(e) => setVehicleMake(e.target.value)}
              icon={Car}
              required
            />
            <Input
              label="Model"
              value={vehicleModel}
              onChange={(e) => setVehicleModel(e.target.value)}
              required
            />
            <Input
              label="Exterior Color"
              value={vehicleColor}
              onChange={(e) => setVehicleColor(e.target.value)}
              required
            />
            <Input
              label="License Plate Number"
              value={licensePlate}
              onChange={(e) => setLicensePlate(e.target.value)}
              required
            />
            <div className="sm:col-span-2">
              <Input
                label="Vehicle Identification Number (VIN)"
                value={vin}
                onChange={(e) => setVin(e.target.value)}
                required
              />
            </div>
          </div>
        </Card>

        <div className="flex justify-between items-center gap-4">
          {saved && (
            <span className="font-mono text-xs text-success font-bold flex items-center gap-1.5 animate-pulse">
              ✓ SETTINGS SAVED SECURELY
            </span>
          )}
          <div className="ml-auto">
            <Button type="submit" variant="primary" className="flex items-center gap-2">
              <Save className="w-4 h-4" /> Save Configuration
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
