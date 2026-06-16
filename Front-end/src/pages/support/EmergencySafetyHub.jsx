import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Input from '../../components/common/Input';
import LivePulse from '../../components/common/LivePulse';
import { Shield, ShieldAlert, Phone, Users, Share2, AlertTriangle, ArrowRight, Lock } from 'lucide-react';

export default function EmergencySafetyHub() {
  const navigate = useNavigate();
  const [sosTriggered, setSosTriggered] = useState(false);
  const [phone, setPhone] = useState('+1 (555) 019-2831');
  const [contacts, setContacts] = useState([
    { name: 'Sarah Mercer (Spouse)', phone: '+1 (555) 902-8491', activeShare: false },
    { name: 'NexFuel Global Dispatcher', phone: '+1 (800) 555-FUEL', activeShare: true },
  ]);

  const handleToggleShare = (index) => {
    setContacts((prev) =>
      prev.map((c, i) => (i === index ? { ...c, activeShare: !c.activeShare } : c))
    );
  };

  const triggerSOS = () => {
    setSosTriggered(true);
    setTimeout(() => {
      // In real application, sends dispatch signal & coordinates
    }, 1000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
          ← Back to Dashboard
        </Button>
        <div className="h-4 w-px bg-borders-outline/20" />
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Shield className="w-5 h-5 text-brand-primary" /> Emergency Safety Hub
        </h1>
      </div>

      {sosTriggered ? (
        <Card className="border-2 border-emergency bg-red-50/50 text-center py-10 space-y-4">
          <div className="w-20 h-20 rounded-full bg-emergency/15 border border-emergency/30 flex items-center justify-center mx-auto animate-pulse">
            <ShieldAlert className="w-10 h-10 text-emergency" />
          </div>
          <h2 className="text-2xl font-bold text-red-950 uppercase tracking-wide">ACTIVE SOS SIGNAL BROADCASTING</h2>
          <p className="text-sm text-red-800 max-w-md mx-auto leading-relaxed">
            Your emergency location coordinates (42.3601° N, 71.0589° W) have been dispatched directly to global operations, local state troopers, and your active sharing contacts. Stay calm.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <Button
              variant="outline"
              className="border-red-500 text-red-700 hover:bg-red-500 hover:text-white"
              onClick={() => setSosTriggered(false)}
            >
              False Alarm (Cancel SOS)
            </Button>
            <a href="tel:911" className="inline-flex items-center justify-center font-semibold transition-all px-5 py-2.5 rounded-btn bg-brand-dark text-white hover:bg-black">
              Call 911 Directly
            </a>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main SOS button card */}
          <Card title="Immediate SOS Response" className="md:col-span-1 flex flex-col justify-between text-center">
            <p className="text-xs text-text-secondary leading-relaxed mb-4">
              Tap below to broadcast emergency coordinates to local dispatch and patrol units.
            </p>
            <div className="py-6 flex justify-center">
              <button
                onClick={triggerSOS}
                className="w-32 h-32 rounded-full bg-emergency text-white flex flex-col items-center justify-center gap-1 font-bold text-lg border-4 border-white shadow-floating hover:bg-red-700 animate-pulse-glow transition-colors focus:outline-none"
              >
                <ShieldAlert className="w-8 h-8" />
                <span>SOS</span>
              </button>
            </div>
            <p className="text-[9px] font-mono text-text-secondary mt-2">
              AUTO-LAT: 42.3601° N<br />AUTO-LON: 71.0589° W
            </p>
          </Card>

          {/* Trusted contacts list & share coordinates */}
          <Card title="Trusted Contacts Sharing" className="md:col-span-2" subtitle="Broadcasting live safety telemetry maps">
            <div className="space-y-4">
              <div className="space-y-3">
                {contacts.map((contact, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 bg-surface-low rounded-input border border-borders-outline/10"
                  >
                    <div>
                      <p className="text-xs font-bold text-text-primary">{contact.name}</p>
                      <p className="text-[10px] text-text-secondary font-mono mt-0.5">{contact.phone}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {contact.activeShare && <LivePulse status="success" label="SHARING" />}
                      <Button
                        variant={contact.activeShare ? 'secondary' : 'outline'}
                        size="sm"
                        onClick={() => handleToggleShare(index)}
                        className="font-mono text-[9px] uppercase tracking-wider font-bold py-1 px-3"
                      >
                        {contact.activeShare ? 'Stop' : 'Share GPS'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add contact */}
              <div className="border-t border-borders-outline/10 pt-4 flex gap-2">
                <Input
                  placeholder="Trusted phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="max-w-[200px]"
                />
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    if (!phone) return;
                    setContacts((prev) => [...prev, { name: 'Emergency Partner', phone, activeShare: false }]);
                    setPhone('');
                  }}
                  className="font-mono text-[10px] uppercase tracking-wider"
                >
                  Add Partner
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Safety Protocol guides */}
      <Card title="Roadside Safety Protocols" subtitle="Verified security guidelines under transit stress">
        <div className="space-y-4 text-xs text-text-secondary leading-relaxed">
          <div className="flex gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-text-primary">Highway Breakdown</p>
              <p>Pull vehicle to the rightmost shoulder. Keep hazard indicators blinking. Stay inside your vehicle with doors locked unless safety dictates otherwise.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Lock className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-text-primary">Verify Responder Identity</p>
              <p>Cross-reference the dispatch code on your mobile tracker with the responder's physical unit label before rolling down windows or exiting the vehicle.</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
