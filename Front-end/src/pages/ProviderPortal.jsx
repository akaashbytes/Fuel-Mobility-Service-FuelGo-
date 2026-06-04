import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Badge from '../components/common/Badge';
import { Truck, ShieldCheck, User, Mail, Phone, ChevronRight, ArrowLeft, Upload, Car, Award } from 'lucide-react';

export default function ProviderPortal() {
  const navigate = useNavigate();
  const loginStore = useAuthStore((state) => state.login);
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [vehicleType, setVehicleType] = useState('Fuel Delivery');
  const [vehicleMake, setVehicleMake] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [licenseVerified, setLicenseVerified] = useState(false);
  const [regVerified, setRegVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleNextStep = (e) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleBackStep = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate('/');
    }
  };

  const handleFinalize = async (e) => {
    e.preventDefault();
    if (!licenseVerified || !regVerified) {
      alert('Please complete the mock document verification checks first.');
      return;
    }
    setLoading(true);
    try {
      // Authenticates partner driver and assigns role "responder"
      await loginStore(email || 'rider@nexfuel.com', 'password', 'responder');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-light flex flex-col justify-between">
      {/* Header */}
      <header className="sticky top-0 z-40 glassmorphic border-b border-borders-outline/10 shadow-sm py-4 px-6 flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="p-2 bg-brand-primary rounded-btn text-white">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <span className="font-display font-bold text-lg tracking-tight text-brand-dark">NEXFUEL</span>
            <span className="font-mono text-[9px] block text-text-secondary uppercase tracking-widest -mt-1 font-bold">PARTNERS</span>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="font-mono text-[10px] uppercase font-bold flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </Button>
      </header>

      {/* Main Form Area */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-6 py-12 flex flex-col justify-center">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <Badge variant="primary">FLEET REGISTRATION WIZARD</Badge>
            <h1 className="text-3xl font-bold font-display text-brand-dark">Join the NexFuel Responder Fleet</h1>
            <p className="text-xs text-text-secondary max-w-md mx-auto">
              Deliver emergency fuel and specialized towing to commuters stranded in your area. Secure payouts, active shifts.
            </p>
          </div>

          {/* Progress Indicators */}
          <div className="grid grid-cols-3 gap-2">
            {['Partner Details', 'Vehicle Assets', 'Document Check'].map((name, idx) => (
              <div key={idx} className="space-y-1.5 text-center">
                <div className={`h-1.5 rounded-full ${idx + 1 <= step ? 'bg-brand-primary' : 'bg-surface-highest'}`} />
                <span className="font-mono text-[9px] font-bold text-text-secondary uppercase tracking-wider">{name}</span>
              </div>
            ))}
          </div>

          <Card title={`Step ${step} of 3: ${step === 1 ? 'Contact Details' : step === 2 ? 'Vehicle Information' : 'Documents Validation'}`}>
            {step === 1 && (
              <form onSubmit={handleNextStep} className="space-y-4">
                <Input
                  label="Full Name"
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  icon={User}
                  required
                />
                <Input
                  label="Secure Email"
                  type="email"
                  placeholder="john.doe@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  icon={Mail}
                  required
                />
                <Input
                  label="Contact Phone"
                  type="tel"
                  placeholder="10-digit number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  icon={Phone}
                  required
                />
                <div className="flex justify-between pt-2">
                  <Button type="button" variant="ghost" onClick={handleBackStep}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" className="flex items-center gap-1">
                    Proceed <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleNextStep} className="space-y-6">
                <div>
                  <label className="font-mono text-[11px] font-semibold text-text-secondary uppercase tracking-wider block mb-3">
                    Service Specialization
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {['Fuel Delivery', 'Specialized Towing', 'EV Battery Boost', 'Lockout Assistance'].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setVehicleType(t)}
                        className={`p-3.5 rounded-card border-[1.5px] font-bold text-xs transition-all text-center ${
                          vehicleType === t
                            ? 'border-brand-primary bg-brand-primary/5 text-brand-primary'
                            : 'border-borders-outline/20 text-text-muted hover:border-borders-outline/40 bg-white'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Vehicle Model (e.g. Ford F-250)"
                    value={vehicleMake}
                    onChange={(e) => setVehicleMake(e.target.value)}
                    icon={Car}
                    required
                  />
                  <Input
                    label="License Plate Number"
                    value={licensePlate}
                    onChange={(e) => setLicensePlate(e.target.value)}
                    required
                  />
                </div>

                <div className="flex justify-between pt-2">
                  <Button type="button" variant="outline" onClick={handleBackStep}>
                    Back
                  </Button>
                  <Button type="submit" variant="primary" className="flex items-center gap-1">
                    Proceed <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            )}

            {step === 3 && (
              <form onSubmit={handleFinalize} className="space-y-6">
                <div className="space-y-4">
                  <div className="p-4 bg-surface-low rounded-input border border-borders-outline/10 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-brand-dark p-2 text-white rounded-btn">
                        <Award className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-text-primary">Commercial Driver's License (CDL)</p>
                        <p className="text-[10px] text-text-secondary font-mono">Requires verification scans</p>
                      </div>
                    </div>
                    {licenseVerified ? (
                      <Badge variant="success">✓ Verified</Badge>
                    ) : (
                      <Button
                        type="button"
                        variant="primary"
                        size="sm"
                        onClick={() => setLicenseVerified(true)}
                        className="font-mono text-[9px] uppercase tracking-wider py-1 px-3"
                      >
                        <Upload className="w-3 h-3 mr-1" /> Mock Verify
                      </Button>
                    )}
                  </div>

                  <div className="p-4 bg-surface-low rounded-input border border-borders-outline/10 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-brand-dark p-2 text-white rounded-btn">
                        <Truck className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-text-primary">Commercial Vehicle Registration</p>
                        <p className="text-[10px] text-text-secondary font-mono">Requires vehicle plate match</p>
                      </div>
                    </div>
                    {regVerified ? (
                      <Badge variant="success">✓ Verified</Badge>
                    ) : (
                      <Button
                        type="button"
                        variant="primary"
                        size="sm"
                        onClick={() => setRegVerified(true)}
                        className="font-mono text-[9px] uppercase tracking-wider py-1 px-3"
                      >
                        <Upload className="w-3 h-3 mr-1" /> Mock Verify
                      </Button>
                    )}
                  </div>
                </div>

                <div className="flex justify-between pt-2">
                  <Button type="button" variant="outline" onClick={handleBackStep}>
                    Back
                  </Button>
                  <Button
                    type="submit"
                    variant="success"
                    disabled={!licenseVerified || !regVerified || loading}
                    className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider font-bold"
                  >
                    <ShieldCheck className="w-4.5 h-4.5" /> Verify & Open console
                  </Button>
                </div>
              </form>
            )}
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-borders-outline/10 py-6 bg-white text-center font-mono text-[10px] text-text-secondary">
        <span>© 2026 NEXFUEL LOGISTICS PARTNER ONBOARDING PLATFORM</span>
      </footer>
    </div>
  );
}
