import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Badge from '../../components/common/Badge';
import { HelpCircle, MessageSquare, Phone, Send, FileText } from 'lucide-react';

export default function HelpCenter() {
  const navigate = useNavigate();
  const [subject, setSubject] = useState('');
  const [msg, setMsg] = useState('');
  const [ticketCreated, setTicketCreated] = useState(false);

  const faqs = [
    { q: 'How fast will my fuel request be paired?', a: 'NexFuel averages less than 15 minutes for urban dispatches and under 30 minutes for highway locations.' },
    { q: 'Is there a limit to how many gallons I can order?', a: 'Clients can order between 2 and 15 gallons of regular, premium, or diesel fuel per dispatch.' },
    { q: 'Can I cancel my subscription any time?', a: 'Yes. Navigate to Wallet & Subscriptions from your dashboard to stop renewal instantly.' },
    { q: 'How do I verify the responder is legitimate?', a: 'Always match the unit ID shown on your tracking dashboard with the physical label printed on the side of the responder vehicle.' },
  ];

  const handleTicket = (e) => {
    e.preventDefault();
    if (!subject || !msg) return;
    setTicketCreated(true);
    setSubject('');
    setMsg('');
    setTimeout(() => setTicketCreated(false), 4000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
          ← Back to Dashboard
        </Button>
        <div className="h-4 w-px bg-borders-outline/20" />
        <h1 className="text-xl font-bold flex items-center gap-2">
          Help & Support Center
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* FAQs */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="font-mono text-xs font-bold text-text-secondary uppercase tracking-widest px-2">Frequently Asked Questions</h2>
          {faqs.map((faq, idx) => (
            <Card key={idx} elevated={false} className="border border-borders-outline/10 bg-white">
              <h3 className="text-sm font-bold text-brand-dark flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
                {faq.q}
              </h3>
              <p className="text-xs text-text-secondary mt-2 leading-relaxed ml-6">{faq.a}</p>
            </Card>
          ))}
        </div>

        {/* Contact Dispatch / Support */}
        <div className="space-y-6">
          <Card title="Quick Hotline" subtitle="Direct emergency voice channel">
            <div className="space-y-3">
              <a
                href="tel:18005553835"
                className="w-full flex items-center justify-center gap-2 bg-brand-dark hover:bg-black text-white py-3 rounded-btn font-mono text-xs font-bold transition-all shadow-sm"
              >
                <Phone className="w-4 h-4 text-brand-primary" /> +1 (800) 555-FUEL
              </a>
              <p className="text-[10px] text-text-secondary text-center leading-relaxed">
                Hotline is reserved for active dispatches experiencing tracking delays or safety overrides.
              </p>
            </div>
          </Card>

          <Card title="Open Support Ticket" subtitle="File support queries with administrators">
            {ticketCreated ? (
              <div className="text-center py-4 space-y-2">
                <Badge variant="success">Ticket Created</Badge>
                <p className="text-xs text-text-secondary font-mono leading-relaxed">
                  Ticket filed successfully. Our dispatch managers will reply via secure account email.
                </p>
              </div>
            ) : (
              <form onSubmit={handleTicket} className="space-y-4">
                <Input
                  label="Subject"
                  placeholder="Billing issue, fleet upgrade..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
                <div className="flex flex-col gap-1">
                  <label className="font-mono text-[11px] font-semibold text-text-secondary uppercase tracking-wider block">
                    Message Details
                  </label>
                  <textarea
                    className="w-full bg-surface-lowest text-text-primary border border-borders-outline/30 rounded-input py-2.5 px-3 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/10 focus:outline-none transition-all text-xs h-24 resize-none"
                    placeholder="Describe your issue..."
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" variant="primary" size="sm" className="w-full flex justify-center gap-1.5">
                  <Send className="w-3.5 h-3.5" /> Submit Ticket
                </Button>
              </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
