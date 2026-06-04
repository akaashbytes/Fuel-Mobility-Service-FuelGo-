import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import LivePulse from '../components/common/LivePulse';
import Input from '../components/common/Input';
import {
  Fuel,
  Truck,
  Shield,
  Clock,
  Compass,
  ArrowRight,
  ShieldAlert,
  Zap,
  MapPin,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  Star,
  X,
  Phone,
  Lock
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const loginStore = useAuthStore((state) => state.login);
  
  const [activeFaq, setActiveFaq] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalStep, setModalStep] = useState(1); // 1 = Phone Input, 2 = OTP Input
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [otpError, setOtpError] = useState('');

  const services = [
    {
      title: 'Emergency Petrol Delivery',
      description: 'Run out of petrol? We dispatch prompt mobile refuelers equipped with 87 Octane / 91 Premium unleaded directly to your roadside location.',
      icon: Fuel,
      time: '12-15 Mins Response',
      price: 'From $25.00',
    },
    {
      title: 'Emergency Diesel Delivery',
      description: 'Industrial and passenger grade diesel fuel dispatched in custom containers safely sealed to prevent vehicle contamination.',
      icon: Fuel,
      time: '15-20 Mins Response',
      price: 'From $28.00',
    },
    {
      title: 'EV Emergency Boost',
      description: 'Stranded EV battery? Our responder units carry mobile high-capacity battery boosters to give you enough range to reach a charging station.',
      icon: Zap,
      time: '15 Mins Response',
      price: 'From $35.00',
    },
    {
      title: 'Flatbed Towing Support',
      description: 'Full transport flatbed tow trucks dispatched to relocate passenger vehicles, sports cars, and SUVs securely without drivetrain stress.',
      icon: Truck,
      time: '25-30 Mins Response',
      price: 'From $85.00',
    },
  ];

  const steps = [
    {
      step: '01',
      title: 'Pin Location',
      description: 'Open the console and transmit your coordinates or type your highway exit marker.',
    },
    {
      step: '02',
      title: 'Select Fuel & Volume',
      description: 'Specify fuel type (Premium, regular, diesel) and select volume up to 15 gallons.',
    },
    {
      step: '03',
      title: 'Pair With Refueler',
      description: 'Our dispatch algorithm coordinates with the closest mobile unit and shares details.',
    },
    {
      step: '04',
      title: 'Fast Delivery',
      description: 'The dispatch rider arrives, completes safety checks, and refuels your vehicle on the spot.',
    },
  ];

  const faqs = [
    {
      q: 'How does the on-spot fuel delivery service work?',
      a: 'If you run out of fuel on a highway or in a remote area, you can open our portal, pin your GPS location, select your fuel grade, and place a request. A mobile refueler with proper container safety kits will be dispatched immediately.',
    },
    {
      q: 'Is it safe to get fuel delivered on the highway?',
      a: 'Absolutely. Our responders are trained in highway breakdown safety. They carry specialized flame-arresting containers, cones, and high-visibility markers to ensure refueling is completed under safe compliance protocols.',
    },
    {
      q: 'What types of fuel do you deliver?',
      a: 'We deliver 87 Regular Gasoline, 91 Premium Gasoline, Diesel, and offer mobile EV roadside battery boost charging packages.',
    },
    {
      q: 'Is there a dispatch fee under subscription plans?',
      a: 'Under our "Premium Route SOS" membership ($19.99/mo), all dispatch fees are completely waived. You only pay for the fuel volume delivered, based on local market rates.',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Jenkins',
      role: 'Commuter',
      text: 'My car stalled on the highway with zero gas. The dispatcher arrived in 14 minutes, verified his code, filled my tank, and got me back on my way safely. Fantastic service!',
      rating: 5,
    },
    {
      name: 'James Rodriguez',
      role: 'Fleet Manager',
      text: 'We use the Fleet Enterprise subscription to cover our delivery vans. It has minimized breakdown downtime significantly. Highly recommend NexFuel.',
      rating: 5,
    },
  ];

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const handleBookingTrigger = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      setShowModal(true);
      setModalStep(1);
      setPhoneNumber('');
      setOtpCode('');
      setPhoneError('');
      setOtpError('');
    }
  };

  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    setPhoneError('');
    if (!phoneNumber || phoneNumber.length < 10) {
      setPhoneError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setModalStep(2);
  };

  const handleOtpVerify = async (e) => {
    e.preventDefault();
    setOtpError('');
    if (!otpCode || otpCode.length < 4) {
      setOtpError('Please enter the 4-digit code.');
      return;
    }
    try {
      // Authenticates client and assigns role "customer"
      await loginStore(`${phoneNumber}@nexfuel.com`, 'password', 'customer');
      setShowModal(false);
      navigate('/dashboard');
    } catch (err) {
      setOtpError('Verification failed. Try again.');
    }
  };

  return (
    <div className="bg-brand-light min-h-screen relative">
      
      {/* Phone Verification Booking Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300">
          <div className="w-full max-w-lg bg-[linear-gradient(135deg,#fdf4f5_0%,#f1eef8_100%)] rounded-card shadow-floating border border-borders-outline/10 overflow-hidden relative p-8 flex flex-col items-center">
            
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-5 right-5 text-text-muted hover:text-brand-primary transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Illustration */}
            <div className="w-full max-w-[280px] h-[200px] flex items-center justify-center mb-6">
              {/* Premium Custom SVG Illustration matching the Welcome rider mockup */}
              <svg viewBox="0 0 280 200" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Background soft circles */}
                <circle cx="140" cy="100" r="80" fill="url(#circleGradient)" opacity="0.6"/>
                <path d="M70,80 C90,40 180,40 210,80" stroke="#a30012" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="4 4" opacity="0.4"/>
                
                {/* Paper Airplane Mock */}
                <path d="M190,40 L210,35 L200,50 L195,43 Z" fill="#926e6b" opacity="0.6" />
                <line x1="210" y1="35" x2="160" y2="55" stroke="#926e6b" strokeWidth="1" strokeDasharray="3 3" opacity="0.4"/>

                {/* Handheld Smartphone mockup */}
                <rect x="130" y="55" width="45" height="85" rx="8" fill="#FFFFFF" stroke="#926e6b" strokeWidth="2" transform="rotate(10 152.5 97.5)" />
                <rect x="134" y="60" width="37" height="70" rx="4" fill="#FBF9F8" transform="rotate(10 152.5 97.5)" />
                <circle cx="160" cy="133" r="2.5" fill="#926e6b" />

                {/* Smartphone service icons mock grid */}
                <path d="M142,68 L145,67 M150,75 L153,74 M145,88 L148,87" stroke="#a30012" strokeWidth="2" strokeLinecap="round" />
                <path d="M158,68 L161,67 M166,75 L169,74 M161,88 M160,98" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />

                {/* Rider Character mockup */}
                {/* Head / Cap */}
                <path d="M110,95 C110,88 122,88 122,95 Z" fill="#1a1a1a" />
                <path d="M103,92 L112,88 L114,94 Z" fill="#a30012" /> {/* Cap brim */}
                
                {/* Face */}
                <circle cx="116" cy="99" r="6" fill="#FFE0BD" />
                
                {/* Body / Coat */}
                <path d="M102,115 C102,108 130,108 130,115 L126,145 L106,145 Z" fill="#FFFFFF" stroke="#1a1a1a" strokeWidth="1.5" />
                {/* Cape / Orange collar */}
                <path d="M100,112 C100,108 116,108 116,112 L118,125 L98,125 Z" fill="#F59E0B" />
                <path d="M116,112 C116,108 132,108 132,112 L134,125 L114,125 Z" fill="#F59E0B" />

                {/* Tire / Wheel held by Rider */}
                <circle cx="116" cy="140" r="18" fill="#1a1a1a" stroke="#efeded" strokeWidth="2" />
                <circle cx="116" cy="140" r="12" fill="none" stroke="#efeded" strokeWidth="1" strokeDasharray="3 2" />
                <circle cx="116" cy="140" r="6" fill="#efeded" />

                {/* Gradients definitions */}
                <defs>
                  <linearGradient id="circleGradient" x1="60" y1="20" x2="220" y2="180" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#fbf9f8" />
                    <stop offset="100%" stopColor="#d0021b" stopOpacity="0.15" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {modalStep === 1 ? (
              <form onSubmit={handlePhoneSubmit} className="w-full space-y-5 text-center">
                <div className="space-y-1.5">
                  <h2 className="text-2xl font-bold font-display text-text-primary">Welcome!</h2>
                  <p className="text-sm text-text-secondary">Help Us with your mobile number</p>
                </div>

                <div className="w-full relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    placeholder="10 digit mobile number"
                    maxLength={10}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-white text-text-primary placeholder:text-text-muted/65 border border-borders-outline/25 rounded-input py-3.5 pl-11 pr-4 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all text-sm font-mono"
                    required
                  />
                </div>

                {phoneError && (
                  <p className="text-xs text-brand-primary font-mono font-semibold">{phoneError}</p>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full py-3.5 bg-brand-primary-container text-white hover:bg-brand-primary"
                >
                  Proceed
                </Button>
              </form>
            ) : (
              <form onSubmit={handleOtpVerify} className="w-full space-y-5 text-center">
                <div className="space-y-1.5">
                  <h2 className="text-2xl font-bold font-display text-text-primary">Verify OTP</h2>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    We sent a mock 4-digit authentication code to <strong className="font-mono text-brand-dark">{phoneNumber}</strong>
                  </p>
                </div>

                <div className="w-full relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="Enter mock OTP (e.g. 1234)"
                    maxLength={4}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-white text-text-primary placeholder:text-text-muted/65 border border-borders-outline/25 rounded-input py-3.5 pl-11 pr-4 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all text-sm font-mono text-center tracking-widest font-bold"
                    required
                  />
                </div>

                {otpError && (
                  <p className="text-xs text-brand-primary font-mono font-semibold">{otpError}</p>
                )}

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setModalStep(1)}
                    className="w-1/3 py-3"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-2/3 py-3 bg-brand-primary-container text-white hover:bg-brand-primary"
                  >
                    Verify & Proceed
                  </Button>
                </div>

                <p className="text-[10px] text-text-secondary font-mono">
                  Mock environment: Enter any 4-digit code to proceed.
                </p>
              </form>
            )}

          </div>
        </div>
      )}

      {/* Landing Header Navbar */}
      <header className="sticky top-0 z-40 glassmorphic border-b border-borders-outline/10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="p-2 bg-brand-primary rounded-btn text-white">
              <Fuel className="w-5 h-5" />
            </div>
            <div>
              <span className="font-display font-bold text-lg tracking-tight text-brand-dark">NEXFUEL</span>
              <span className="font-mono text-[9px] block text-text-secondary uppercase tracking-widest -mt-1 font-bold">LOGISTICS</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm font-mono font-bold text-text-secondary">
            <a href="#services" className="hover:text-brand-primary transition-colors">Services</a>
            <a href="#how-it-works" className="hover:text-brand-primary transition-colors">How It Works</a>
            <a href="#pricing" className="hover:text-brand-primary transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-brand-primary transition-colors">FAQ</a>
            <button onClick={() => navigate('/provider-portal')} className="hover:text-brand-primary transition-colors cursor-pointer">Partner Portal</button>
          </div>

          <div>
            <Button
              variant="primary"
              size="sm"
              onClick={handleBookingTrigger}
            >
              {isAuthenticated ? 'Go to Dashboard' : 'Book a Service'} <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20">
            <LivePulse status="primary" />
            <span className="font-mono text-[10px] font-bold text-brand-primary uppercase tracking-widest">24/7 On-Spot Dispatch</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-text-primary leading-tight">
            Stranded Without Gas?<br />
            <span className="text-brand-primary">We Deliver Fuel on the Spot.</span>
          </h1>
          
          <p className="text-base text-text-secondary max-w-lg leading-relaxed">
            Professional 24/7 on-spot petrol and diesel delivery for cars & bikes. Out of fuel? Click below, enter your phone number, and a nearby mobile refueler will be dispatched immediately.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Button
              variant="primary"
              size="lg"
              onClick={handleBookingTrigger}
              className="font-mono font-bold tracking-wider uppercase text-sm"
            >
              Request Urgent Refuel
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => {
                const el = document.getElementById('services');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="font-mono font-bold tracking-wider uppercase text-sm"
            >
              Explore Services
            </Button>
          </div>

          {/* Trust points */}
          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-borders-outline/10 font-mono">
            <div>
              <p className="text-2xl font-bold text-brand-dark">15 min</p>
              <p className="text-[10px] text-text-secondary uppercase mt-0.5">Average ETA</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-brand-dark">12k+</p>
              <p className="text-[10px] text-text-secondary uppercase mt-0.5">Refuels Delivered</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-brand-dark">24/7</p>
              <p className="text-[10px] text-text-secondary uppercase mt-0.5">Overwatch Coverage</p>
            </div>
          </div>
        </div>

        {/* Graphics Mockup */}
        <div className="relative">
          <div className="absolute inset-0 bg-brand-primary/5 rounded-full filter blur-3xl -z-10" />
          <div className="bg-brand-dark rounded-card p-6 border border-white/10 shadow-floating text-white relative overflow-hidden">
            <div className="absolute right-0 bottom-0 top-0 w-1/2 opacity-[0.03] bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-white to-transparent" />
            
            {/* Command HUD mockup */}
            <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-brand-primary" />
                <span className="font-mono text-[10px] font-bold tracking-widest uppercase">NEXFUEL ACTIVE DISPATCH HUD</span>
              </div>
              <Badge variant="primary">LIVE GPS LINK</Badge>
            </div>

            <div className="space-y-4">
              <div className="bg-white/5 border border-white/10 p-4 rounded-input flex items-center justify-between gap-4">
                <div>
                  <p className="text-[9px] text-text-secondary font-mono uppercase">DISPATCH STATE</p>
                  <p className="text-sm font-bold mt-0.5">Refueler Pairing Complete</p>
                </div>
                <LivePulse status="success" />
              </div>

              <div className="bg-white/5 border border-white/10 p-4 rounded-input space-y-3">
                <div className="flex justify-between text-xs font-mono">
                  <span>ETA TIMER</span>
                  <span className="text-brand-primary font-bold">12 MINUTES</span>
                </div>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                  <div className="bg-brand-primary h-full rounded-full" style={{ width: '42%' }} />
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-4 rounded-input">
                <img
                  src="https://api.dicebear.com/7.x/adventurer/svg?seed=Marcus"
                  alt="refueler"
                  className="w-10 h-10 rounded-full border border-white/20 bg-slate-800"
                />
                <div>
                  <p className="text-xs font-bold">Marcus Vance (ID: RF-928)</p>
                  <p className="text-[10px] text-text-secondary font-mono">Driving Custom Tanker F-250</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="bg-white border-y border-borders-outline/10 py-20">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <Badge variant="primary">EMERGENCY PORTFOLIO</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-brand-dark font-display">On-Demand Roadside Assistance Services</h2>
            <p className="text-sm text-text-secondary">
              Professional on-spot support, equipped with flame-retardant safety tanks, EV chargers, and tow hitches.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((svc, idx) => {
              const Icon = svc.icon;
              return (
                <div
                  key={idx}
                  onClick={handleBookingTrigger}
                  className="bg-white border border-borders-outline/10 p-6 rounded-card hover:border-brand-primary/25 hover:shadow-industrial transition-all duration-300 flex flex-col justify-between cursor-pointer"
                >
                  <div className="space-y-4">
                    <div className="p-3 bg-brand-primary/10 text-brand-primary rounded-btn inline-flex">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-base font-bold text-text-primary">{svc.title}</h3>
                      <p className="text-xs text-text-secondary leading-relaxed">{svc.description}</p>
                    </div>
                  </div>
                  <div className="pt-5 mt-5 border-t border-borders-outline/5 flex justify-between items-center text-xs font-mono">
                    <span className="text-text-secondary">{svc.time}</span>
                    <span className="font-bold text-brand-primary">{svc.price}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 max-w-7xl mx-auto px-6 space-y-16">
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <Badge variant="primary">DISPATCH TIMELINE</Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-brand-dark font-display">How Refueling Works</h2>
          <p className="text-sm text-text-secondary">
            Get emergency fuel delivered in 4 simple steps without waiting hours for standard highway services.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((st, idx) => (
            <div key={idx} className="space-y-4 relative group">
              <span className="font-display text-5xl font-extrabold text-brand-primary/10 group-hover:text-brand-primary/20 transition-colors block">
                {st.step}
              </span>
              <h3 className="text-base font-bold text-text-primary">{st.title}</h3>
              <p className="text-xs text-text-secondary leading-relaxed">{st.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-brand-dark text-white py-20 border-t border-borders-outline/10">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <Badge variant="primary">CLIENT VERIFICATION</Badge>
            <h2 className="text-3xl font-bold font-display">What Stranded Commuters Say</h2>
            <p className="text-xs text-text-secondary">Read actual testimonials from drivers saved by our emergency dispatchers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((t, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 p-6 rounded-card space-y-4">
                <div className="flex gap-1">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-white/80 leading-relaxed font-sans">"{t.text}"</p>
                <div className="pt-2 border-t border-white/5 flex items-center justify-between font-mono text-xs">
                  <span className="font-bold">{t.name}</span>
                  <span className="text-text-secondary">{t.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview Banner */}
      <section id="pricing" className="py-20 max-w-7xl mx-auto px-6 text-center space-y-8">
        <div className="space-y-3 max-w-xl mx-auto">
          <Badge variant="primary">TIER SUBSCRIPTIONS</Badge>
          <h2 className="text-3xl font-display font-bold">Simple, Transparent Pricing</h2>
          <p className="text-sm text-text-secondary">Get premium roadside coverage. Free dispatches. Zero hidden fees.</p>
        </div>

        <div className="bg-white border border-borders-outline/10 rounded-card p-8 max-w-2xl mx-auto shadow-industrial flex flex-col md:flex-row items-center justify-between gap-6 text-left">
          <div>
            <h3 className="text-lg font-bold text-text-primary">Premium Route SOS</h3>
            <p className="text-xs text-text-secondary mt-1">Get priority matching, free dispatches, and access to safety hubs.</p>
            <p className="text-2xl font-mono font-bold text-brand-primary mt-3">$19.99/month</p>
          </div>
          <Button
            variant="primary"
            onClick={handleBookingTrigger}
            className="w-full md:w-auto shrink-0 font-mono tracking-wider uppercase text-xs"
          >
            Activate Subscription Account
          </Button>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="bg-white border-t border-borders-outline/10 py-20">
        <div className="max-w-4xl mx-auto px-6 space-y-12">
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <Badge variant="primary">HELP DESK FAQ</Badge>
            <h2 className="text-3xl font-bold font-display text-brand-dark">Frequently Answered Questions</h2>
            <p className="text-sm text-text-secondary">All your inquiries regarding fuel transport and dispatch times.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="border border-borders-outline/10 rounded-card overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left font-bold text-sm text-text-primary hover:bg-surface-low transition-colors"
                >
                  <span className="flex items-start gap-2.5">
                    <HelpCircle className="w-4.5 h-4.5 text-brand-primary shrink-0 mt-0.5" />
                    {faq.q}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-text-secondary transition-transform duration-200 ${activeFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {activeFaq === idx && (
                  <div className="px-6 pb-6 pt-2 text-xs text-text-secondary leading-relaxed bg-surface-low/30 border-t border-borders-outline/5 ml-7">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sticky Bottom Callout for Stranded Users */}
      <div className="sticky bottom-6 inset-x-6 z-40 max-w-lg mx-auto">
        <div className="glassmorphic-dark border border-brand-primary/30 p-4 rounded-card shadow-floating flex items-center justify-between gap-4 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-primary rounded-btn">
              <ShieldAlert className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <p className="text-xs font-bold">Stranded right now?</p>
              <p className="text-[10px] text-text-secondary font-mono">Refuel units are patroling coordinates nearby.</p>
            </div>
          </div>
          <Button
            variant="emergency"
            size="sm"
            onClick={handleBookingTrigger}
            className="font-mono text-[9px] uppercase tracking-wider font-bold"
          >
            Refuel Me Now
          </Button>
        </div>
      </div>

      {/* Global Footer */}
      <footer className="border-t border-borders-outline/10 py-12 bg-white text-center space-y-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-brand-dark rounded-btn text-white">
              <Fuel className="w-4 h-4" />
            </div>
            <span className="font-display font-bold text-sm text-brand-dark">NEXFUEL LOGISTICS</span>
          </div>

          <div className="flex gap-6 font-mono text-[10px] text-text-secondary font-bold">
            <a href="#services" className="hover:underline">SERVICES</a>
            <a href="#pricing" className="hover:underline">PRICING</a>
            <a href="#faq" className="hover:underline">FAQs</a>
            <button onClick={() => navigate('/provider-portal')} className="hover:underline cursor-pointer">PARTNER PORTAL</button>
          </div>
        </div>

        <div className="h-px bg-borders-outline/5 max-w-7xl mx-auto" />

        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4 font-mono text-[10px] text-text-secondary">
          <span>© 2026 NEXFUEL LOGISTICS INC. ALL RIGHTS RESERVED.</span>
          <div className="flex gap-4">
            <span className="cursor-pointer hover:underline" onClick={() => navigate('/help')}>SECURE DISPATCH NODE</span>
            <span>•</span>
            <span className="text-success">SYSTEM ONLINE</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
