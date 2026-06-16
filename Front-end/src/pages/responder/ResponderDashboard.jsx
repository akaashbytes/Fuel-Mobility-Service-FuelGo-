import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import LivePulse from '../../components/common/LivePulse';
import { useFeedbackStore } from '../../store/useFeedbackStore';
import { useCollaboratorStore } from '../../store/useCollaboratorStore';
import {
  Truck,
  MapPin,
  Navigation,
  Compass,
  AlertCircle,
  CheckCircle2,
  DollarSign,
  User,
  ShieldCheck,
  X,
  Clock,
  RefreshCw,
  Star,
  Fuel,
  TrendingUp
} from 'lucide-react';

export default function ResponderDashboard() {
  const [availability, setAvailability] = useState('Available'); // 'Available', 'Unavailable'
  const [lastActive, setLastActive] = useState('14:52 Today');
  const [activeJob, setActiveJob] = useState(null);
  const [jobProgress, setJobProgress] = useState(0); // 0 = en_route, 1 = arrived, 2 = refueling, 3 = otp_verification, 4 = awaiting_payment, 5 = payment_received, 6 = closed
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState('');

  // Read reviews and collaborators from global state stores
  const feedbacks = useFeedbackStore((state) => state.feedbacks).filter((f) => f.providerId === 'RF-928');
  const bunks = useCollaboratorStore((state) => state.bunks);

  // Calculate rating statistics dynamically
  const totalReviews = feedbacks.length;
  const averageRating = totalReviews > 0 ? (feedbacks.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews).toFixed(1) : '0.0';
  const positiveReviews = feedbacks.filter((f) => f.rating >= 4).length;
  const positivePercentage = totalReviews > 0 ? Math.round((positiveReviews / totalReviews) * 100) : 0;

  // Render nearest collaborator details
  const nearestBunk = bunks.find(b => b.status === 'Active Partner') || bunks[0] || {
    name: 'HP Fuel Station - Koramangala',
    serviceArea: 'Bangalore South',
    stocks: { petrol: '14,200 Liters', diesel: '12,500 Liters', premiumPetrol: '8,400 Liters' },
    petrolPrice: '$3.45',
    dieselPrice: '$3.10',
    premiumPrice: '$4.15',
    priceLastUpdated: '2026-06-16 12:00'
  };

  const incomingRequests = [
    {
      id: 'REQ-102',
      service: 'Fuel Delivery',
      detail: '5 Gallons (91 Premium)',
      location: 'Interstate 95, Mile Marker 23.5 (Northbound)',
      dist: '1.2 miles away',
      fare: '$49.25',
      otp: '1234'
    },
    {
      id: 'REQ-105',
      service: 'Roadside Assistance',
      detail: 'EV Emergency Boost',
      location: '450 Washington St, Boston',
      dist: '3.8 miles away',
      fare: '$35.00',
      otp: '5678'
    },
  ];

  const handleAcceptJob = (job) => {
    setActiveJob(job);
    setJobProgress(0);
    setOtpCode('');
    setOtpError('');
  };

  const handleRejectJob = (jobId) => {
    alert(`Request ${jobId} passed. Re-routing.`);
  };

  const handleUpdateProgress = () => {
    if (jobProgress === 2) {
      setJobProgress(3);
    } else if (jobProgress === 3) {
      if (otpCode === activeJob.otp || otpCode === '0000') {
        setJobProgress(4); // Awaiting Payment
        setOtpError('');
      } else {
        setOtpError('Invalid customer OTP signature.');
      }
    } else if (jobProgress === 4) {
      // Driver simulates checking customer payment status
      setJobProgress(5); // Payment Received
      alert('Mock Ledger Update: Payment authorization verified.');
    } else if (jobProgress === 5) {
      // Order Closed
      setJobProgress(6);
    } else if (jobProgress === 6) {
      setActiveJob(null);
      setJobProgress(0);
    } else {
      setJobProgress(jobProgress + 1);
    }
  };

  const handleToggleAvailability = () => {
    const nextState = availability === 'Available' ? 'Unavailable' : 'Available';
    setAvailability(nextState);
    const now = new Date();
    setLastActive(`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} Today`);
  };

  return (
    <div className="space-y-6 font-sans text-body">
      
      {/* Header Panel with availability states */}
      <div className="bg-brand-dark rounded-card p-6 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border border-white/10 shadow-floating">
        <div>
          <Badge variant="success" className="mb-2">RESPONDER ACTIVE CONTEXT</Badge>
          <h1 className="text-2xl font-bold font-display text-white">Responder Command Hub</h1>
          <div className="flex items-center gap-3 text-xs text-gray-300 mt-1 font-mono">
            <span className="flex items-center gap-1">
              Status: <strong className={availability === 'Available' ? 'text-success' : 'text-red-400'}>{availability.toUpperCase()}</strong>
            </span>
            <span>•</span>
            <span>Last Active: {lastActive}</span>
          </div>
        </div>
        <button
          onClick={handleToggleAvailability}
          className={`px-4 py-2.5 rounded-btn font-mono text-xs font-bold transition-all cursor-pointer ${
            availability === 'Available'
              ? 'bg-success text-white border-none'
              : 'bg-white/10 text-white/60 border border-white/20'
          }`}
        >
          Toggle Availability
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column: Active job task area & feedback stats */}
        <div className="lg:col-span-2 space-y-6">
          {activeJob ? (
            <Card title="Active Dispatch Task" subtitle={`Task ID: ${activeJob.id}`}>
              <div className="space-y-6">
                
                {/* Stats grid */}
                <div className="grid grid-cols-3 gap-4 font-mono text-xs text-text-secondary">
                  <div className="bg-surface-low p-4 rounded-input border border-borders-outline/10 text-center">
                    <p className="text-[10px] text-text-secondary font-mono uppercase">SERVICE</p>
                    <p className="text-sm font-bold text-brand-dark mt-1">{activeJob.service}</p>
                  </div>
                  <div className="bg-surface-low p-4 rounded-input border border-borders-outline/10 text-center">
                    <p className="text-[10px] text-text-secondary font-mono uppercase">ETA WAIT</p>
                    <p className="text-sm font-bold text-brand-dark mt-1">{activeJob.dist}</p>
                  </div>
                  <div className="bg-surface-low p-4 rounded-input border border-borders-outline/10 text-center">
                    <p className="text-[10px] text-text-secondary font-mono uppercase">FARE</p>
                    <p className="text-sm font-bold text-brand-primary mt-1">{activeJob.fare}</p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-text-muted">TASK DISPATCH PROGRESS:</span>
                    <span className="font-bold text-brand-primary uppercase">
                      {['En Route', 'Arrived', 'Refueling Active', 'Verifying OTP', 'Awaiting Payment', 'Payment Received', 'Closed'][jobProgress]}
                    </span>
                  </div>
                  <div className="w-full bg-surface-low h-2.5 rounded-full overflow-hidden border border-borders-outline/10">
                    <div
                      className="bg-brand-primary h-full transition-all duration-500 rounded-full"
                      style={{ width: `${(jobProgress / 6) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Map/Location coords */}
                <div className="bg-surface-low p-4 rounded-input border border-borders-outline/10 space-y-2 font-mono text-xs">
                  <p className="text-text-muted uppercase text-[9px]">TARGET COORD ADDRESS</p>
                  <p className="font-sans font-semibold text-text-primary text-sm flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-brand-primary shrink-0" /> {activeJob.location}
                  </p>
                </div>

                {/* Task flow actions control */}
                {jobProgress === 3 ? (
                  <div className="bg-white p-4 rounded-input border border-borders-outline/15 text-center space-y-4">
                    <h4 className="font-bold text-sm text-brand-dark">Input Customer Signature OTP Code</h4>
                    <p className="text-xs text-text-muted">Retrieve the code from the customer page to start refuel pump pumps.</p>
                    <div className="flex flex-col items-center gap-2">
                      <input
                        type="text"
                        placeholder="e.g. 1234"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        className="w-48 bg-surface-low text-text-primary font-mono font-bold text-center tracking-widest text-lg border border-borders-outline/25 rounded-input py-2 focus:border-brand-primary focus:outline-none"
                      />
                      {otpError && <p className="text-[10px] text-emergency font-mono font-semibold">{otpError}</p>}
                    </div>
                  </div>
                ) : jobProgress === 4 ? (
                  <div className="bg-amber-50 border border-amber-300 p-4 rounded-input text-center space-y-3">
                    <AlertCircle className="w-8 h-8 text-amber-600 mx-auto animate-bounce" />
                    <h4 className="font-bold text-sm text-amber-800">Awaiting Customer Fare Settlement</h4>
                    <p className="text-xs text-amber-700 leading-normal font-sans">
                      Fuel pumping completed. Fares must be settled on the customer portal via Razorpay to close the ledger.
                    </p>
                  </div>
                ) : jobProgress === 5 ? (
                  <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-input text-center space-y-3">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                    <h4 className="font-bold text-sm text-emerald-800">Fares Successfully Settled</h4>
                    <p className="text-xs text-emerald-700 font-sans">
                      Payment log recorded. Please click the button below to close the dispatch record.
                    </p>
                  </div>
                ) : null}

                <Button
                  variant={jobProgress === 3 ? 'success' : jobProgress === 5 ? 'primary' : 'outline'}
                  className="w-full py-3.5 flex justify-center uppercase font-bold text-xs"
                  onClick={handleUpdateProgress}
                >
                  {jobProgress === 6 ? 'Clear Dispatch logs' : 'Update Dispatch State'}
                </Button>

              </div>
            </Card>
          ) : (
            <Card title="Operational Status Map">
              <div className="relative h-96 bg-brand-dark rounded-input overflow-hidden border border-borders-outline/10">
                <div className="absolute inset-0 bg-slate-900 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-75" />
                
                {/* Center marker */}
                <div className="absolute top-[180px] left-[240px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                  <div className="relative flex h-10 w-10 items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary/40 opacity-75" />
                    <div className="h-4 w-4 bg-brand-primary border-2 border-white rounded-full shadow-lg" />
                  </div>
                  <span className="bg-brand-dark/95 border border-brand-primary/20 p-2 rounded-card text-center max-w-xs shadow-floating pointer-events-auto text-[8px] font-mono text-white mt-1 whitespace-nowrap">
                    MY VEHICLE (Active)
                  </span>
                </div>

                {availability === 'Unavailable' && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm">
                    <div className="bg-brand-dark/95 border border-red-500/20 p-5 rounded-card text-center max-w-xs shadow-floating">
                      <AlertCircle className="w-8 h-8 text-emergency mx-auto mb-2 animate-bounce" />
                      <p className="font-display font-bold text-white text-sm">System Offline</p>
                      <p className="text-[10px] text-text-secondary mt-1 font-mono">Set status to AVAILABLE to connect with dispatchers.</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Feedback Analytics Card */}
          <Card title="Feedback & Ratings Analytics" subtitle="Recent performance reviews and grading split metrics">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs text-text-secondary">
              
              {/* Ratings Grid */}
              <div className="md:col-span-1 space-y-4 border-r border-borders-outline/10 pr-6">
                <div className="text-center py-2 bg-surface-low rounded-input border border-borders-outline/5">
                  <span className="text-[9px] text-text-muted uppercase tracking-wider block">AVERAGE RATING</span>
                  <p className="text-3xl font-extrabold text-brand-dark mt-1 flex items-center justify-center gap-1">
                    ⭐ {averageRating}
                  </p>
                  <span className="text-[9px] text-text-muted mt-1 block">Based on {totalReviews} reviews</span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between font-mono">
                    <span>Positive Score</span>
                    <span className="font-bold text-success">{positivePercentage}%</span>
                  </div>
                  <div className="w-full bg-surface-low h-2 rounded-full overflow-hidden border border-borders-outline/5">
                    <div className="bg-success h-full" style={{ width: `${positivePercentage}%` }} />
                  </div>
                </div>
              </div>

              {/* Monthly Rating Trend */}
              <div className="md:col-span-2 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-[10px] text-text-secondary font-sans font-bold uppercase tracking-wider flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 text-brand-primary" /> Monthly Rating Trend
                  </h4>
                  <span className="text-[9px] text-success font-bold font-mono">AVG. 4.8 / 5.0</span>
                </div>
                
                {/* SVG Mini Trendline */}
                <div className="bg-surface-low/50 border border-borders-outline/5 rounded-input p-3 h-20 flex items-center justify-center">
                  <svg className="w-full h-12 text-brand-primary" viewBox="0 0 100 20" preserveAspectRatio="none">
                    <path
                      d="M0,15 Q25,8 50,12 T100,5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <circle cx="0" cy="15" r="2" fill="currentColor" />
                    <circle cx="25" cy="8" r="2" fill="currentColor" />
                    <circle cx="50" cy="12" r="2" fill="currentColor" />
                    <circle cx="75" cy="9" r="2" fill="currentColor" />
                    <circle cx="100" cy="5" r="2" fill="currentColor" />
                  </svg>
                </div>
                <div className="flex justify-between text-[8px] text-text-muted font-mono px-1">
                  <span>Feb 2026</span>
                  <span>Mar 2026</span>
                  <span>Apr 2026</span>
                  <span>May 2026</span>
                  <span>Jun 2026</span>
                </div>
              </div>

            </div>

            {/* Recent Reviews list */}
            <div className="mt-6 border-t border-borders-outline/10 pt-4">
              <h4 className="text-[10px] text-text-secondary font-sans font-bold uppercase tracking-wider mb-3 font-mono">
                Recent Reviews feed
              </h4>
              <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
                {feedbacks.length > 0 ? (
                  feedbacks.map((f) => (
                    <div key={f.id} className="p-3 bg-surface-low rounded-input border border-borders-outline/5 space-y-1 text-xs font-sans text-text-secondary">
                      <div className="flex justify-between items-center font-mono text-[10px]">
                        <span className="font-bold text-text-primary">{f.customerName}</span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-amber-600">⭐ {f.rating}.0</span>
                          <span className="text-text-muted">• {f.date}</span>
                        </div>
                      </div>
                      <p className="text-text-muted italic">"{f.comment}"</p>
                      <div className="flex gap-2 pt-1 font-mono text-[9px]">
                        <span className="bg-brand-primary/5 text-brand-primary px-1.5 py-0.5 rounded border border-brand-primary/10 uppercase font-bold">
                          {f.category}
                        </span>
                        {f.recommend === 'Yes' && (
                          <span className="bg-success/5 text-success px-1.5 py-0.5 rounded border border-success/10 uppercase font-bold">
                            Recommended
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-text-muted font-mono text-xs">
                    NO REVIEWS SUBMITTED YET
                  </div>
                )}
              </div>
            </div>
          </Card>

        </div>

        {/* Right column: Incoming match requests, Payouts & Nearest Bunk */}
        <div className="space-y-6">
          
          {/* Requests list */}
          <Card title="Available Requests" subtitle="On-grid dispatch alerts">
            <div className="space-y-4 font-mono text-xs">
              {availability === 'Unavailable' ? (
                <div className="text-center py-6 text-text-muted text-xs font-mono">
                  SET STATUS TO AVAILABLE TO PREVIEW JOBS
                </div>
              ) : incomingRequests.length > 0 && !activeJob ? (
                incomingRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-4 rounded-input border border-borders-outline/15 hover:border-brand-primary/30 transition-all duration-200 space-y-3 bg-surface-lowest shadow-sm text-xs font-mono"
                  >
                    <div className="flex justify-between items-center font-sans">
                      <span className="font-mono text-xs font-bold text-brand-dark">{req.id}</span>
                      <Badge variant="primary">{req.service}</Badge>
                    </div>
                    <div className="text-text-secondary space-y-1 font-mono text-[10px]">
                      <p>• DETAILS: {req.detail}</p>
                      <p className="truncate">• TARGET: {req.location}</p>
                      <p className="font-bold text-brand-primary">• DISTANCE: {req.dist}</p>
                    </div>
                    <div className="flex gap-2 font-sans">
                      <button
                        onClick={() => handleRejectJob(req.id)}
                        className="w-1/3 py-2 border border-borders-outline/15 rounded-btn hover:border-red-500 hover:text-red-500 text-xs font-bold cursor-pointer transition-colors"
                      >
                        Pass
                      </button>
                      <Button
                        variant="primary"
                        size="sm"
                        className="w-2/3 py-2 text-xs"
                        onClick={() => handleAcceptJob(req)}
                      >
                        Accept match
                      </Button>
                    </div>
                  </div>
                ))
              ) : activeJob ? (
                <div className="text-center py-6 text-text-muted text-xs font-mono">
                  COMPLETE CURRENT DISPATCH TO MATCH PENDING JOBS
                </div>
              ) : (
                <div className="text-center py-6 text-text-muted text-xs font-mono">
                  NO ACTIVE PENDING REQUESTS
                </div>
              )}
            </div>
          </Card>

          {/* Nearest Depot reload partner coordinates */}
          <Card title="Nearest Depot Partner" subtitle="Driver reload hub coordinates">
            <div className="space-y-4 font-mono text-xs text-text-secondary">
              <div className="space-y-1 font-sans">
                <span className="text-[10px] text-text-muted font-mono block uppercase">PARTNER STATION</span>
                <span className="font-bold text-text-primary text-sm flex items-center gap-1.5 mt-0.5">
                  <Fuel className="w-4.5 h-4.5 text-brand-primary" /> {nearestBunk.name}
                </span>
                <span className="text-[10px] text-brand-primary font-semibold mt-0.5 block">
                  📍 1.2 miles away | {nearestBunk.serviceArea}
                </span>
              </div>

              {/* Reserves list */}
              <div className="bg-surface-low p-3 rounded-input border border-borders-outline/5 space-y-1.5 text-[11px]">
                <span className="text-[9px] text-text-muted block font-semibold uppercase">DEPOT FUEL PARAMETERS</span>
                <div className="flex justify-between">
                  <span>Regular Petrol</span>
                  <span className="font-bold text-text-primary">{nearestBunk.stocks.petrol}</span>
                </div>
                <div className="flex justify-between">
                  <span>Premium Petrol</span>
                  <span className="font-bold text-brand-primary">{nearestBunk.stocks.premiumPetrol}</span>
                </div>
                <div className="flex justify-between">
                  <span>Diesel Fuel</span>
                  <span className="font-bold text-text-primary">{nearestBunk.stocks.diesel}</span>
                </div>
              </div>

              {/* Pricing parameters */}
              <div className="bg-surface-low p-3 rounded-input border border-borders-outline/5 space-y-1.5 text-[11px]">
                <span className="text-[9px] text-text-muted block font-semibold uppercase">DEPOT RETAIL PRICES</span>
                <div className="flex justify-between">
                  <span>Regular</span>
                  <span className="font-bold text-text-primary">{nearestBunk.petrolPrice} / gal</span>
                </div>
                <div className="flex justify-between">
                  <span>Premium</span>
                  <span className="font-bold text-brand-primary">{nearestBunk.premiumPrice} / gal</span>
                </div>
                <div className="flex justify-between">
                  <span>Diesel</span>
                  <span className="font-bold text-text-primary">{nearestBunk.dieselPrice} / gal</span>
                </div>
                <div className="h-px bg-borders-outline/5 my-1" />
                <div className="text-[9px] text-text-muted flex justify-between font-sans">
                  <span>Last Updated:</span>
                  <span>{nearestBunk.priceLastUpdated}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Earnings ledger summary */}
          <Card title="Earnings Summary">
            <div className="space-y-4 font-mono text-xs text-text-secondary">
              <div className="flex justify-between">
                <span>Completed Deliveries</span>
                <span className="font-bold text-brand-dark text-sm">3 Jobs</span>
              </div>
              <div className="flex justify-between">
                <span>Pending Earnings</span>
                <span className="font-bold text-brand-primary text-sm">
                  {activeJob && jobProgress < 6 ? activeJob.fare : '$0.00'}
                </span>
              </div>
              <div className="flex justify-between border-t border-borders-outline/10 pt-3 mt-3">
                <span>Monthly Salary Balance</span>
                <span className="font-bold text-success text-sm">$2,840.50</span>
              </div>
            </div>
          </Card>

        </div>

      </div>

    </div>
  );
}
