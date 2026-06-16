import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Badge from '../../components/common/Badge';
import { Fuel, MapPin, Navigation, DollarSign, Clock, AlertTriangle, Car, ShieldCheck, Zap } from 'lucide-react';

export default function EmergencyFuelRequest() {
  const navigate = useNavigate();
  const [selectedVehicle, setSelectedVehicle] = useState('BMW 330i (Black)');
  const [fuelType, setFuelType] = useState('91 Premium');
  const [gallons, setGallons] = useState(5);
  const [location, setLocation] = useState('Interstate 95, Mile Marker 23.5 (Northbound)');
  const [coords, setCoords] = useState('42.3601° N, 71.0589° W');
  const [useCurrentLocation, setUseCurrentLocation] = useState(true);
  const [serviceType, setServiceType] = useState('Standard'); // 'Standard', 'Rapid'
  const [requestSent, setRequestSent] = useState(false);

  const vehicleOptions = [
    { name: 'BMW 330i (Black) - 41-XDF-2', fuel: '91 Premium' },
    { name: 'Tesla Model Y (Red) - 82-SLD-9', fuel: 'Electric (EV Boost)' },
    { name: 'Honda Civic (Silver) - 10-PKW-5', fuel: '87 Regular' }
  ];

  const pricePerGallon = fuelType === '91 Premium' ? 4.85 : fuelType === 'Diesel' ? 4.99 : 4.25;
  const fuelCost = pricePerGallon * gallons;
  const baseDispatchFee = 15.00;
  const prioritySurcharge = serviceType === 'Rapid' ? 15.00 : 0.00;
  const total = fuelCost + baseDispatchFee + prioritySurcharge;

  const handleVehicleChange = (e) => {
    const selected = e.target.value;
    setSelectedVehicle(selected);
    
    // Auto-select corresponding fuel type for convenience
    const matchingVehicle = vehicleOptions.find(v => v.name.includes(selected));
    if (matchingVehicle) {
      if (matchingVehicle.fuel === 'Electric (EV Boost)') {
        setFuelType('Diesel'); // EV gets specialized support, mock fallback fuel
      } else {
        setFuelType(matchingVehicle.fuel);
      }
    }
  };

  const handleDispatch = (e) => {
    e.preventDefault();
    setRequestSent(true);
    setTimeout(() => {
      navigate('/tracking');
    }, 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </Button>
        <div className="h-4 w-px bg-borders-outline/20" />
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Fuel className="w-5 h-5 text-brand-primary" /> Request Mobile Refueling
        </h1>
      </div>

      {requestSent ? (
        <Card className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center mx-auto mb-4 animate-bounce">
            <Fuel className="w-8 h-8 text-brand-primary" />
          </div>
          <h2 className="text-2xl font-bold text-text-primary font-display">Securing Your Dispatcher</h2>
          <p className="text-text-secondary text-sm mt-2 max-w-md mx-auto leading-relaxed">
            Razorpay transaction authorized. NexFuel is matching your coordinate pins with the closest mobile patrol tanker. Redirecting to live tracking...
          </p>
          <div className="mt-6 flex justify-center">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-primary" />
            </span>
          </div>
        </Card>
      ) : (
        <form onSubmit={handleDispatch} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Main forms - Col span 2 */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Vehicle Selection */}
            <Card title="1. Select Target Vehicle" subtitle="Select a car from your garage profiles">
              <div className="space-y-3">
                <label className="font-mono text-[11px] font-semibold text-text-secondary uppercase tracking-wider block">
                  GARAGE VEHICLE
                </label>
                <div className="relative">
                  <select
                    value={selectedVehicle}
                    onChange={handleVehicleChange}
                    className="w-full bg-white text-text-primary border border-borders-outline/25 rounded-input py-3.5 pl-4 pr-10 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all text-sm font-semibold appearance-none"
                  >
                    {vehicleOptions.map((v, i) => (
                      <option key={i} value={v.name}>{v.name}</option>
                    ))}
                  </select>
                  <Car className="w-4 h-4 text-text-muted absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </Card>

            {/* Fuel configuration */}
            <Card title="2. Fuel Specifications" subtitle="Select volume and octane rating">
              <div className="space-y-6">
                
                {/* Fuel Grade Selector */}
                <div>
                  <label className="font-mono text-[11px] font-semibold text-text-secondary uppercase tracking-wider block mb-3">
                    FUEL CLASS / GRADE
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {['87 Regular', '91 Premium', 'Diesel'].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setFuelType(t)}
                        className={`p-4 rounded-card border-[1.5px] font-bold text-sm transition-all duration-200 text-center cursor-pointer ${
                          fuelType === t
                            ? 'border-brand-primary bg-brand-primary/5 text-brand-primary shadow-sm'
                            : 'border-borders-outline/20 text-text-muted hover:border-borders-outline/50 bg-white'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Volume slider */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="font-mono text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                      VOLUME (GALLONS)
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

            {/* Location Selector */}
            <Card title="3. Delivery Target Coordinates" subtitle="Accurate locations prevent wrong-lane dispatches">
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
                    <Navigation className="w-3.5 h-3.5" /> Auto GPS
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
                    Manual Map Coordinates
                  </Button>
                </div>

                <Input
                  label="Street / Landmark Address"
                  placeholder="e.g., Highway Exit 23, Northbound Side shoulder"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  icon={MapPin}
                  required
                />

                <Input
                  label="GPS Coordinates (Auto-computed)"
                  placeholder="42.XXXX° N, 71.XXXX° W"
                  value={coords}
                  onChange={(e) => setCoords(e.target.value)}
                  disabled={useCurrentLocation}
                  required
                />
              </div>
            </Card>

          </div>

          {/* Pricing & Checkout summary - Col span 1 */}
          <div className="space-y-6">
            
            {/* Service Speed */}
            <Card title="Delivery Speed">
              <div className="space-y-3">
                {[
                  { name: 'Standard', desc: 'Dispatched in order of queue', price: 'Free', icon: Clock },
                  { name: 'Rapid', desc: 'Guaranteed under 15 mins', price: '+$15.00', icon: Zap }
                ].map((s) => (
                  <div
                    key={s.name}
                    onClick={() => setServiceType(s.name)}
                    className={`p-3.5 rounded-card border-[1.5px] transition-all cursor-pointer flex items-center justify-between ${
                      serviceType === s.name
                        ? 'border-brand-primary bg-brand-primary/5 text-brand-dark'
                        : 'border-borders-outline/15 hover:border-borders-outline/30 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <s.icon className={`w-4 h-4 ${serviceType === s.name ? 'text-brand-primary' : 'text-text-muted'}`} />
                      <div className="text-left">
                        <p className="text-xs font-bold">{s.name}</p>
                        <p className="text-[10px] text-text-muted leading-none mt-0.5">{s.desc}</p>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold text-brand-primary">{s.price}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Billing breakdown */}
            <Card title="Fare Invoice">
              <div className="space-y-4 font-mono text-xs text-text-secondary">
                <div className="flex justify-between">
                  <span>{gallons} Gal @ ${pricePerGallon.toFixed(2)}/gal</span>
                  <span className="font-bold text-text-primary">${fuelCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Base Dispatch Fee</span>
                  <span className="font-bold text-text-primary">${baseDispatchFee.toFixed(2)}</span>
                </div>
                {prioritySurcharge > 0 && (
                  <div className="flex justify-between text-brand-primary">
                    <span>Priority Dispatch (Rapid)</span>
                    <span className="font-bold">${prioritySurcharge.toFixed(2)}</span>
                  </div>
                )}
                <div className="h-px bg-borders-outline/10 my-2" />
                <div className="flex justify-between text-base font-bold text-brand-dark">
                  <span>TOTAL ESTIMATED</span>
                  <span className="font-sans font-extrabold text-brand-primary">${total.toFixed(2)}</span>
                </div>

                <div className="bg-blue-50 border border-blue-200 p-3 rounded-btn text-[10px] text-blue-800 leading-normal flex items-start gap-1.5 font-sans">
                  <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <p>Pay-on-Delivery: No upfront payment required. Fares are settled securely via Razorpay once refueling has finished.</p>
                </div>

                <div className="bg-amber-50 border-l-2 border-amber-500 p-3 rounded-md flex items-start gap-2.5 mt-2 font-sans">
                  <AlertTriangle className="w-4.5 h-4.5 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-amber-700 leading-normal">
                    Turn on hazard flashers, remain inside vehicle while on express shoulder lanes, and review driver ID badge.
                  </p>
                </div>

                <Button type="submit" variant="emergency" className="w-full py-4 text-sm font-bold uppercase tracking-wider">
                  Confirm & Request Refuel
                </Button>
              </div>
            </Card>

          </div>

        </form>
      )}
    </div>
  );
}
