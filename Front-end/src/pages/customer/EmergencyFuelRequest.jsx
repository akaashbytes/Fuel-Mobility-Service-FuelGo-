import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Badge from '../../components/common/Badge';
import { Fuel, MapPin, Navigation, DollarSign, Clock, AlertTriangle } from 'lucide-react';

export default function EmergencyFuelRequest() {
  const navigate = useNavigate();
  const [fuelType, setFuelType] = useState('91 Premium');
  const [gallons, setGallons] = useState(5);
  const [location, setLocation] = useState('Interstate 95, Mile Marker 23.5 (Northbound)');
  const [coords, setCoords] = useState('42.3601° N, 71.0589° W');
  const [useCurrentLocation, setUseCurrentLocation] = useState(true);
  const [requestSent, setRequestSent] = useState(false);

  const pricePerGallon = fuelType === '91 Premium' ? 4.85 : fuelType === 'Diesel' ? 4.99 : 4.25;
  const fuelCost = pricePerGallon * gallons;
  const dispatchFee = 25.00;
  const total = fuelCost + dispatchFee;

  const handleDispatch = (e) => {
    e.preventDefault();
    setRequestSent(true);
    setTimeout(() => {
      navigate('/tracking');
    }, 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
          ← Back to Dashboard
        </Button>
        <div className="h-4 w-px bg-borders-outline/20" />
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Fuel className="w-5 h-5 text-brand-primary" /> Emergency Fuel Request
        </h1>
      </div>

      {requestSent ? (
        <Card className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center mx-auto mb-4 animate-bounce">
            <Fuel className="w-8 h-8 text-brand-primary" />
          </div>
          <h2 className="text-2xl font-bold text-text-primary">Dispatch Request Received</h2>
          <p className="text-text-secondary text-sm mt-2 max-w-md mx-auto">
            NexFuel dispatch system is pairing you with the closest mobile refueler. Redirecting to live tracking dashboard...
          </p>
          <div className="mt-6 flex justify-center">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-primary" />
            </span>
          </div>
        </Card>
      ) : (
        <form onSubmit={handleDispatch} className="space-y-6">
          <Card title="Fuel Configuration" subtitle="Select the required fuel type and capacity">
            <div className="space-y-6">
              {/* Fuel Type */}
              <div>
                <label className="font-mono text-[11px] font-semibold text-text-secondary uppercase tracking-wider block mb-3">
                  Fuel Grade / Type
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['87 Regular', '91 Premium', 'Diesel'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setFuelType(t)}
                      className={`p-4 rounded-card border-[1.5px] font-bold text-sm transition-all duration-200 text-center ${
                        fuelType === t
                          ? 'border-brand-primary bg-brand-primary/5 text-brand-primary shadow-sm'
                          : 'border-borders-outline/20 text-text-muted hover:border-borders-outline/50'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="font-mono text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                    Volume (Gallons)
                  </label>
                  <span className="font-mono text-sm font-bold text-brand-dark">{gallons} Gallons</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="15"
                  step="1"
                  value={gallons}
                  onChange={(e) => setGallons(parseInt(e.target.value))}
                  className="w-full accent-brand-primary cursor-pointer h-2 bg-surface-high rounded-lg appearance-none"
                />
                <div className="flex justify-between text-[10px] font-mono text-text-muted mt-2">
                  <span>MIN: 2 Gal</span>
                  <span>MAX: 15 Gal</span>
                </div>
              </div>
            </div>
          </Card>

          <Card title="Coordinates & Dispatch Location" subtitle="Precision location ensures fast responder pairing">
            <div className="space-y-4">
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={useCurrentLocation ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setUseCurrentLocation(true);
                    setLocation('Interstate 95, Mile Marker 23.5 (Northbound)');
                    setCoords('42.3601° N, 71.0589° W');
                  }}
                  className="font-mono text-[10px] uppercase tracking-wider flex items-center gap-1.5"
                >
                  <Navigation className="w-3.5 h-3.5" /> GPS Location
                </Button>
                <Button
                  type="button"
                  variant={!useCurrentLocation ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setUseCurrentLocation(false);
                    setLocation('');
                    setCoords('');
                  }}
                  className="font-mono text-[10px] uppercase tracking-wider"
                >
                  Manual Address
                </Button>
              </div>

              <Input
                label="Street / Highway Description"
                placeholder="e.g., Highway exit 12 near shell station"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                icon={MapPin}
                required
              />

              <Input
                label="Coordinates (Auto-derived)"
                placeholder="42.XXXX° N, 71.XXXX° W"
                value={coords}
                onChange={(e) => setCoords(e.target.value)}
                disabled={useCurrentLocation}
                required
              />
            </div>
          </Card>

          <Card title="Fare & Payment Summary">
            <div className="space-y-3 font-mono text-xs text-text-secondary">
              <div className="flex justify-between">
                <span>{gallons} Gallons @ ${pricePerGallon.toFixed(2)}/gal</span>
                <span className="font-bold text-text-primary">${fuelCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Mobile Dispatch Fee</span>
                <span className="font-bold text-text-primary">${dispatchFee.toFixed(2)}</span>
              </div>
              <div className="h-px bg-borders-outline/10 my-2" />
              <div className="flex justify-between text-base font-bold text-brand-dark">
                <span>TOTAL DISPATCH FARE</span>
                <span className="font-sans">${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="bg-amber-50 border-l-2 border-amber-500 p-3 rounded-md flex items-start gap-2.5 mt-4">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-[11px] text-amber-700 leading-relaxed">
                <strong>Emergency roadside safety:</strong> Turn on your hazard lights, stay inside your vehicle if parked on a busy highway, and verify the responder's identity via your live tracker upon arrival.
              </p>
            </div>

            <div className="mt-6">
              <Button type="submit" variant="emergency" className="w-full py-4 text-base">
                Confirm Dispatch & Charge Card
              </Button>
            </div>
          </Card>
        </form>
      )}
    </div>
  );
}
