import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { Check, ShieldCheck, Zap } from 'lucide-react';

export default function PricingPlans() {
  const navigate = useNavigate();

  const plans = [
    {
      name: 'Pay-As-You-Go',
      price: '$0',
      period: 'lifetime',
      description: 'Standard emergency roadside service without commitments.',
      features: [
        'Pay standard dispatch fees ($25.00/request)',
        'Fuel charges at local market rates',
        'Standard responder matching queue',
        'Basic SMS support updates',
      ],
      current: false,
      cta: 'Choose Basic Access',
    },
    {
      name: 'Premium Route SOS',
      price: '$19.99',
      period: 'month',
      description: 'Optimized security for daily commuters and travelers.',
      features: [
        'Zero dispatch fees ($0 dispatch)',
        'Priority matching queue (under 15 mins)',
        '1 free specialized towing dispatch/mo',
        'Access to Emergency Safety & Women SOS Hub',
        'Stripe billing security protection',
      ],
      current: true,
      cta: 'Current Plan Active',
    },
    {
      name: 'Fleet & Enterprise',
      price: '$49.99',
      period: 'month',
      description: 'Precision command center support for small business fleets.',
      features: [
        'Everything in Premium Plan',
        'Support for up to 5 fleet vehicles',
        'Custom administrative tracking portal',
        'Consolidated monthly accounting ledgers',
        'Dedicated 24/7 dispatcher hotline',
      ],
      current: false,
      cta: 'Upgrade to Enterprise',
    },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="text-center space-y-3">
        <Badge variant="primary">TRANSPARENT TIER SYSTEM</Badge>
        <h1 className="text-3xl font-bold tracking-tight text-text-primary">NexFuel Mobility Protection Plans</h1>
        <p className="text-sm text-text-secondary max-w-xl mx-auto">
          Choose the protection tier that matches your transit frequency. Swap or cancel plans securely at any time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {plans.map((p, idx) => (
          <div
            key={idx}
            className={`flex flex-col h-full rounded-card overflow-hidden transition-all duration-300 relative ${
              p.current
                ? 'border-2 border-brand-primary bg-surface-lowest shadow-floating scale-105 z-10'
                : 'border border-borders-outline/10 bg-white shadow-industrial hover:border-borders-outline/35'
            }`}
          >
            {p.current && (
              <div className="absolute top-0 inset-x-0 bg-brand-primary text-white text-[10px] font-mono font-bold tracking-widest text-center py-1 flex items-center justify-center gap-1">
                <Zap className="w-3.5 h-3.5 fill-current" /> CURRENT PROTECTION ACTIVE
              </div>
            )}
            <div className={`p-6 space-y-4 flex-1 ${p.current ? 'pt-8' : ''}`}>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-brand-dark">{p.name}</h3>
                <p className="text-xs text-text-secondary">{p.description}</p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-mono font-bold text-text-primary">{p.price}</span>
                <span className="text-xs font-mono text-text-secondary">/{p.period}</span>
              </div>

              <div className="h-px bg-borders-outline/10" />

              <ul className="space-y-3 text-xs text-text-secondary">
                {p.features.map((f, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-success shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="p-6 bg-surface-low/50 border-t border-borders-outline/10">
              <Button
                variant={p.current ? 'secondary' : 'primary'}
                className="w-full justify-center"
                disabled={p.current}
                onClick={() => navigate('/')}
              >
                {p.cta}
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-surface-low border border-borders-outline/15 rounded-card p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-brand-primary" />
          <div>
            <p className="text-sm font-bold text-text-primary">Corporate Fleet / Custom Operations?</p>
            <p className="text-xs text-text-secondary">Customized pricing and API dispatch webhooks for transport corporations.</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate('/help')}>
          Inquire Operations
        </Button>
      </div>
    </div>
  );
}
