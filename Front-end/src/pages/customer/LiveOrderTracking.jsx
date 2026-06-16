import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import LivePulse from '../../components/common/LivePulse';
import { useFeedbackStore } from '../../store/useFeedbackStore';
import {
  MapPin,
  Phone,
  MessageSquare,
  Compass,
  Clock,
  Navigation2,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  CreditCard,
  ShieldCheck,
  Star
} from 'lucide-react';

export default function LiveOrderTracking() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [eta, setEta] = useState(12);
  const [progress, setProgress] = useState(35);
  const [status, setStatus] = useState('dispatching'); // 'dispatching', 'en_route', 'arrived', 'delivered', 'completed'
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  
  const addFeedback = useFeedbackStore((state) => state.addFeedback);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [rating, setRating] = useState(5);
  const [feedbackCategory, setFeedbackCategory] = useState('Overall Experience');
  const [recommend, setRecommend] = useState('Yes');
  const [contactPermission, setContactPermission] = useState(true);
  const [comment, setComment] = useState('');

  const steps = [
    { name: 'Request Created', desc: 'Pre-auth secured' },
    { name: 'Provider Assigned', desc: 'Refueler matched' },
    { name: 'En Route', desc: 'Tanker transit' },
    { name: 'Arrived', desc: 'On location shoulder' },
    { name: 'Delivered', desc: 'Fuel pump handshake' },
    { name: 'Completed', desc: 'Invoice settled' }
  ];

  const getStepIndex = () => {
    switch (status) {
      case 'completed': return 5;
      case 'delivered': return 4;
      case 'arrived': return 3;
      case 'en_route': return 2;
      case 'dispatching':
      default:
        return progress > 50 ? 1 : 0;
    }
  };

  const getPaymentStatusText = () => {
    if (status === 'completed') return 'Payment Completed';
    if (status === 'delivered') return 'Awaiting Payment';
    return 'Pending Delivery';
  };

  const getPaymentStatusColor = () => {
    if (status === 'completed') return 'success';
    if (status === 'delivered') return 'warning';
    return 'primary';
  };

  useEffect(() => {
    // Initial loading skeleton state
    const loadTimer = setTimeout(() => {
      setLoading(false);
    }, 600);

    const telemetryTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(telemetryTimer);
          setStatus('delivered');
          setEta(0);
          return 90;
        }
        if (prev > 65) {
          setStatus('arrived');
        } else if (prev > 45) {
          setStatus('en_route');
        }
        setEta(Math.max(1, Math.round((100 - prev) * 0.15)));
        return prev + 5;
      });
    }, 3000);

    return () => {
      clearTimeout(loadTimer);
      clearInterval(telemetryTimer);
    };
  }, []);

  const handlePayNow = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStatus('completed');
      setProgress(100);
      setPaymentCompleted(true);
    }, 800);
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-surface-high rounded-btn w-1/3" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-[450px] bg-surface-high rounded-card" />
          <div className="space-y-6">
            <div className="h-44 bg-surface-high rounded-card" />
            <div className="h-44 bg-surface-high rounded-card" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header HUD */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
            ← Back to Dashboard
          </Button>
          <div className="h-4 w-px bg-borders-outline/20" />
          <h1 className="text-xl font-bold flex items-center gap-2 font-display text-brand-dark">
            Live Dispatch Telemetry
          </h1>
        </div>
        <div className="flex items-center gap-3 font-mono text-[11px] font-bold">
          <span className="text-text-secondary">PAYMENT STATE:</span>
          <Badge variant={getPaymentStatusColor()}>{getPaymentStatusText().toUpperCase()}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column: Mock Map Container */}
        <div className="lg:col-span-2 relative h-[480px] bg-slate-950 rounded-card overflow-hidden shadow-floating border border-borders-outline/25">
          <div className="absolute inset-0 bg-slate-900 bg-[radial-gradient(#475569_1px,transparent_1px)] [background-size:24px_24px] opacity-85" />
          
          {/* Mock Road routes */}
          <svg className="absolute inset-0 w-full h-full opacity-45" xmlns="http://www.w3.org/2000/svg">
            <path d="M-100,220 L800,270 L1200,420" fill="none" stroke="#64748B" strokeWidth="6" strokeLinecap="round" />
            <path d="M300,-50 L420,240 L600,600" fill="none" stroke="#64748B" strokeWidth="4" strokeLinecap="round" />
            <path d="M420,240 L490,245 L800,400" fill="none" stroke="#EF4444" strokeWidth="3" strokeDasharray="6 4" strokeLinecap="round" />
          </svg>

          {/* Customer marker pin */}
          <div className="absolute left-[300px] top-[220px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <div className="relative flex h-10 w-10 items-center justify-center">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500/40 opacity-75" />
              <div className="h-4.5 w-4.5 bg-blue-500 border-2 border-white rounded-full shadow-lg" />
            </div>
            <div className="bg-slate-800 border border-white/20 rounded px-2.5 py-0.5 text-[8px] font-bold font-mono text-white mt-1 shadow-md">
              MY VEHICLE
            </div>
          </div>

          {/* Responder tanker pin */}
          <div
            style={{
              left: `${300 + (progress / 100) * 250}px`,
              top: `${220 + (progress / 100) * 30}px`,
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center transition-all duration-1000 ease-out"
          >
            <div className="relative flex h-14 w-14 items-center justify-center">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary/30 opacity-75" />
              <div className="h-7.5 w-7.5 bg-brand-primary border-2 border-white rounded-full shadow-lg flex items-center justify-center text-white">
                <Navigation2 className="w-4 h-4 rotate-[75deg] fill-current" />
              </div>
            </div>
            <div className="bg-slate-850 border border-brand-primary/45 rounded px-2.5 py-0.5 text-[8px] font-bold font-mono text-white mt-1 shadow-md flex items-center gap-1 whitespace-nowrap">
              <LivePulse status="primary" /> REFUELLER UNIT
            </div>
          </div>

          {/* GPS HUD metrics overlay on dark map */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            <div className="bg-slate-900/90 border border-white/20 px-3 py-1.5 rounded-btn text-white flex items-center gap-1.5 text-[10px] font-mono shadow-lg">
              <Compass className="w-3.5 h-3.5 text-brand-primary animate-spin" />
              <span className="text-gray-200">COORDS: 42.3601° N | 71.0589° W</span>
            </div>
          </div>

        </div>

        {/* Right column: Timeline & Interactive payments */}
        <div className="space-y-6">
          
          {/* Order Progress Timeline */}
          <Card title="Dispatch Timeline">
            <div className="space-y-6 relative pl-4 border-l border-borders-outline/10">
              {steps.map((step, idx) => {
                const isCompleted = idx <= getStepIndex();
                const isCurrent = idx === getStepIndex();
                return (
                  <div key={idx} className="relative space-y-1">
                    <div
                      className={`absolute -left-[22px] top-1.5 w-3 h-3 rounded-full border-2 transition-all ${
                        isCurrent
                          ? 'bg-brand-primary border-brand-primary ring-4 ring-brand-primary/15'
                          : isCompleted
                          ? 'bg-success border-success'
                          : 'bg-white border-borders-outline/25'
                      }`}
                    />
                    <h4 className={`text-xs font-bold font-mono ${isCompleted ? 'text-brand-dark' : 'text-text-muted'}`}>
                      {step.name}
                    </h4>
                    <p className="text-[10px] text-text-secondary leading-tight">{step.desc}</p>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Dynamic Payment Confirmation / Driver Card */}
          {status === 'delivered' && !paymentCompleted ? (
            <Card title="Payment Confirmation" className="border-brand-primary border-2">
              <div className="space-y-4 text-xs font-mono text-text-secondary">
                <div className="bg-brand-dark p-4 rounded-input border border-white/10 text-white space-y-1.5">
                  <p className="text-[10px] text-gray-300 font-sans uppercase font-bold">NEXFUEL INVOICE</p>
                  <div className="h-px bg-white/10 my-2" />
                  <div className="flex justify-between text-gray-300">
                    <span>91 Premium Fuel</span>
                    <span className="font-bold text-white">5 Gallons</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Delivery Charge</span>
                    <span className="font-bold text-white">$15.00</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Fuel Cost</span>
                    <span className="font-bold text-white">$24.25</span>
                  </div>
                  <div className="h-px bg-white/10 my-2" />
                  <div className="flex justify-between text-white font-sans text-sm font-bold">
                    <span>Total Amount Due</span>
                    <span className="text-brand-primary-container font-extrabold font-mono">$39.25</span>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 p-3 rounded-btn text-[10px] text-amber-800 leading-normal flex items-start gap-1.5 font-sans">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p>Fuel delivered. Handshake OTP verified by refueler unit. Fares must be settled to close the order.</p>
                </div>

                <Button
                  variant="emergency"
                  className="w-full py-3.5 flex justify-center items-center gap-1.5 font-sans uppercase font-bold"
                  onClick={handlePayNow}
                >
                  <CreditCard className="w-4.5 h-4.5" /> Pay Now via Razorpay
                </Button>
              </div>
            </Card>
          ) : status === 'completed' && paymentCompleted ? (
            !feedbackSubmitted ? (
              <Card title="Rate Your Experience">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    addFeedback({
                      orderId: 'NX-28941-F',
                      customerId: 'usr_alex',
                      customerName: 'Alex Mercer',
                      providerId: 'RF-928',
                      providerName: 'Marcus Vance',
                      rating,
                      category: feedbackCategory,
                      recommend,
                      contactPermission,
                      comment
                    });
                    setFeedbackSubmitted(true);
                  }}
                  className="space-y-4 text-xs font-sans text-text-secondary"
                >
                  {/* Star Rating */}
                  <div className="space-y-1.5 text-center">
                    <label className="text-[10px] font-bold text-text-secondary block font-mono uppercase tracking-wider">STAR RATING</label>
                    <div className="flex justify-center gap-1.5 py-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="cursor-pointer transition-transform hover:scale-110"
                        >
                          <Star
                            className={`w-7 h-7 ${
                              star <= rating
                                ? 'text-amber-500 fill-amber-500'
                                : 'text-surface-high'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Feedback Category */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-text-secondary block font-mono uppercase tracking-wider">FEEDBACK CATEGORY</label>
                    <select
                      value={feedbackCategory}
                      onChange={(e) => setFeedbackCategory(e.target.value)}
                      className="w-full bg-white text-text-primary border border-borders-outline/25 rounded-input py-2.5 px-4 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/10 text-xs font-semibold focus:outline-none"
                    >
                      <option value="Service Quality">Service Quality</option>
                      <option value="Provider Behaviour">Provider Behaviour</option>
                      <option value="Delivery Speed">Delivery Speed</option>
                      <option value="Fuel Quality">Fuel Quality</option>
                      <option value="Overall Experience">Overall Experience</option>
                    </select>
                  </div>

                  {/* Recommendation Option */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-text-secondary block font-mono uppercase tracking-wider">WOULD YOU RECOMMEND OUR SERVICE?</label>
                    <div className="flex gap-4 mt-1">
                      {['Yes', 'No'].map((opt) => (
                        <label key={opt} className="flex items-center gap-2 cursor-pointer font-semibold text-text-primary">
                          <input
                            type="radio"
                            name="recommend"
                            value={opt}
                            checked={recommend === opt}
                            onChange={() => setRecommend(opt)}
                            className="text-brand-primary focus:ring-brand-primary h-4 w-4 border-gray-300"
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Contact Permission Checkbox */}
                  <label className="flex items-start gap-2.5 cursor-pointer font-sans leading-normal text-text-muted mt-2">
                    <input
                      type="checkbox"
                      checked={contactPermission}
                      onChange={(e) => setContactPermission(e.target.checked)}
                      className="rounded border-borders-outline/20 text-brand-primary focus:ring-brand-primary mt-0.5"
                    />
                    <span>I allow the company to contact me regarding this feedback.</span>
                  </label>

                  {/* Comments textarea */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-text-secondary block font-mono uppercase tracking-wider">COMMENTS</label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share your experience (optional)..."
                      className="w-full bg-white text-text-primary border border-borders-outline/25 rounded-input py-2.5 px-4 focus:border-brand-primary focus:outline-none text-xs font-semibold"
                      rows={3}
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full py-3 justify-center text-xs font-bold font-sans"
                  >
                    Submit Feedback
                  </Button>
                </form>
              </Card>
            ) : (
              <Card title="Thank You!">
                <div className="text-center py-6 space-y-4">
                  <div className="w-12 h-12 bg-emerald-100 border border-emerald-300 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                    <CheckCircle2 className="w-6 h-6 animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-text-primary text-base font-display">Feedback Submitted Confirmation</h4>
                    <p className="text-xs text-text-secondary font-mono mt-1">Order Reference: NX-28941-F</p>
                    <p className="text-xs text-text-muted mt-3 leading-relaxed font-sans px-4">
                      Thank you for helping us improve! Your feedback has been logged successfully and shared with your provider.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-center mt-2"
                    onClick={() => navigate('/dashboard')}
                  >
                    Return to Dashboard
                  </Button>
                </div>
              </Card>
            )
          ) : (
            <Card title="Assigned Refueler">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src="https://api.dicebear.com/7.x/adventurer/svg?seed=Marcus"
                      alt="Marcus"
                      className="w-12 h-12 rounded-full border border-borders-outline/25 bg-surface-low"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-text-primary font-display">Marcus Vance</h4>
                      <p className="text-xs text-text-secondary">NexFuel Tanker #RF-928</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href="tel:+91987654321"
                      className="p-2.5 rounded-btn bg-surface-low border border-borders-outline/10 text-text-primary hover:bg-brand-primary/5 hover:text-brand-primary transition-colors cursor-pointer"
                    >
                      <Phone className="w-4.5 h-4.5" />
                    </a>
                  </div>
                </div>

                <div className="bg-surface-low border border-borders-outline/5 p-4 rounded-input flex justify-between items-center text-xs font-mono">
                  <div>
                    <span className="text-[9px] uppercase text-text-secondary block">Estimated Wait</span>
                    <span className="font-bold text-brand-dark text-base mt-0.5 block">{eta > 0 ? `${eta} Mins` : 'ARRIVED'}</span>
                  </div>
                  <LivePulse status="primary" />
                </div>
              </div>
            </Card>
          )}

        </div>

      </div>

    </div>
  );
}
