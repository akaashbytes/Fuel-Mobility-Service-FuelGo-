import React from 'react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import {
  TrendingUp,
  ShoppingBag,
  Clock,
  Compass,
  DollarSign,
  Users,
  Activity,
  Download,
  Fuel,
  Zap,
  MapPin
} from 'lucide-react';

export default function AdminAnalytics() {
  const metrics = [
    { label: 'Total Orders', value: '4,892', sub: '+12% this week', icon: ShoppingBag, color: 'text-brand-primary' },
    { label: 'Completed Orders', value: '4,750', sub: '97% success rate', icon: CheckCircleIcon, color: 'text-success' },
    { label: 'Cancelled Orders', value: '142', sub: '3% failure rate', icon: AlertCircleIcon, color: 'text-emergency' },
    { label: 'Active Orders', value: '4', sub: 'Currently matching', icon: Activity, color: 'text-blue-500' },
    { label: 'Online Providers', value: '12', sub: 'On operations grid', icon: Users, color: 'text-success' },
    { label: 'Total Customers', value: '1,242', sub: '+45 new signups today', icon: Users, color: 'text-blue-500' },
    { label: 'Monthly Revenue', value: '$24,850', sub: 'MRR subscription split', icon: DollarSign, color: 'text-success' },
    { label: 'Pending Payments', value: '$223.40', icon: Clock, sub: 'Razorpay Escrow held', color: 'text-amber-500' },
  ];

  const recentTransactions = [
    { id: 'TXN-902', client: 'Alex Mercer', type: '91 Premium', area: 'Koramangala', amount: '$49.25', status: 'PAID' },
    { id: 'TXN-901', client: 'Sarah Connor', type: 'Diesel', area: 'MG Road', amount: '$74.10', status: 'PAID' },
    { id: 'TXN-900', client: 'Bruce Wayne', type: '87 Regular', area: 'HSR Layout', amount: '$42.50', status: 'PAID' },
  ];

  const topProviders = [
    { id: 'RF-928', name: 'Marcus Vance', deliveries: 124, rating: '4.95 ★', status: 'ACTIVE' },
    { id: 'RF-312', name: 'Diana Prince', deliveries: 98, rating: '4.88 ★', status: 'ACTIVE' },
    { id: 'RF-774', name: 'Peter Parker', deliveries: 82, rating: '4.90 ★', status: 'ACTIVE' }
  ];

  const fuelDistribution = [
    { type: '91 Premium', count: 2450, percentage: '50%' },
    { type: '87 Regular', count: 1842, percentage: '38%' },
    { type: 'Diesel', count: 600, percentage: '12%' }
  ];

  return (
    <div className="space-y-6 font-sans text-body">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-brand-dark">Admin System Analytics</h1>
          <p className="text-xs text-text-secondary mt-0.5 text-desc">Real-time demand forecasting, fuel consumption distributions, and provider statistics logs.</p>
        </div>
        <Button
          variant="primary"
          size="sm"
          className="font-mono text-[10px] uppercase font-bold flex items-center gap-1.5 text-btn"
          onClick={() => alert('Exporting system analytics summary PDF/CSV...')}
        >
          <Download className="w-4 h-4" /> Export Report Sheet
        </Button>
      </div>

      {/* Overview Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m, i) => {
          const Icon = m.icon || ShoppingBag;
          return (
            <Card key={i} elevated={true}>
              <div className="flex justify-between items-start">
                <p className="text-[10px] text-text-secondary font-mono uppercase tracking-wider text-desc">{m.label}</p>
                <div className={`p-2 rounded-btn bg-surface-low ${m.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <p className="text-xl font-mono font-bold text-text-primary">{m.value}</p>
                <p className="text-[10px] text-text-secondary mt-1 font-mono text-desc">{m.sub}</p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Core analytics charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Orders per day chart */}
        <Card title="Orders per Day" subtitle="Calculated weekly summary checks" className="lg:col-span-2">
          <div className="h-64 flex items-end gap-3 pt-6 border-b border-borders-outline/10">
            {[34, 45, 62, 55, 78, 90, 85].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                <div className="w-full bg-surface-high rounded-t group-hover:bg-brand-primary/20 transition-colors h-48 flex items-end">
                  <div
                    style={{ height: `${h}%` }}
                    className="w-full bg-brand-primary/80 group-hover:bg-brand-primary rounded-t transition-all duration-500"
                  />
                </div>
                <span className="font-mono text-[9px] text-text-secondary text-desc">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                </span>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center text-xs font-mono font-medium text-text-secondary mt-4 text-desc">
            <span>PEAK HOUR PEAK: 8:00 AM - 10:00 AM</span>
            <span className="text-success font-bold font-mono">AVG: 64 orders/day</span>
          </div>
        </Card>

        {/* Fuel split ratio */}
        <Card title="Fuel Type Split" subtitle="Volume proportion by class octane">
          <div className="space-y-4 pt-2">
            {fuelDistribution.map((f, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono font-bold text-text-primary text-table">
                  <span>{f.type}</span>
                  <span>{f.count} gal ({f.percentage})</span>
                </div>
                <div className="w-full bg-surface-high h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-brand-primary h-full rounded-full"
                    style={{ width: f.percentage }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

      </div>

      {/* Dark Regional Analytics Card for high contrast checking */}
      <div className="bg-brand-dark border border-white/10 rounded-card p-6 text-white relative overflow-hidden shadow-floating">
        <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-[0.03] bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-white to-transparent" />
        
        <h3 className="text-base font-bold font-display text-white mb-4">Regional Analytics Summary (WCAG Contrast Audit)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 font-mono text-xs">
          <div className="space-y-1 bg-white/5 border border-white/10 p-4 rounded-input">
            <span className="text-[10px] text-gray-300 font-sans uppercase block font-bold text-desc">Most Active Sector</span>
            <span className="text-white font-bold block mt-1 text-body">Koramangala (KRM-02)</span>
            <p className="text-[10px] text-gray-400 mt-1 leading-normal text-desc">Accounting for 34% of local priority dispatches.</p>
          </div>
          <div className="space-y-1 bg-white/5 border border-white/10 p-4 rounded-input">
            <span className="text-[10px] text-gray-300 font-sans uppercase block font-bold text-desc">Peak Request Time</span>
            <span className="text-white font-bold block mt-1 text-body">17:00 - 19:30 Daily</span>
            <p className="text-[10px] text-gray-400 mt-1 leading-normal text-desc">Stranded commuter SOS alerts increase during rush hours.</p>
          </div>
          <div className="space-y-1 bg-white/5 border border-white/10 p-4 rounded-input">
            <span className="text-[10px] text-gray-300 font-sans uppercase block font-bold text-desc">Average Matching ETA</span>
            <span className="text-success font-bold block mt-1 text-body">11.4 Minutes</span>
            <p className="text-[10px] text-gray-400 mt-1 leading-normal text-desc">Average dispatch allocation match cycle completion time.</p>
          </div>
        </div>
      </div>

      {/* Ledger Data Tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Top Providers */}
        <Card title="Top Performing Refuelers">
          <div className="overflow-x-auto">
            <table className="w-full font-mono text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-borders-outline/10 text-text-secondary text-desc">
                  <th className="py-2.5 font-semibold">DRIVER</th>
                  <th className="py-2.5 font-semibold text-center">DELIVERIES</th>
                  <th className="py-2.5 font-semibold text-right">RATING</th>
                </tr>
              </thead>
              <tbody>
                {topProviders.map((p, i) => (
                  <tr key={i} className="border-b border-borders-outline/5 text-text-muted hover:bg-surface-low/30 text-table">
                    <td className="py-3 font-bold text-text-primary">{p.name} ({p.id})</td>
                    <td className="py-3 text-center">{p.deliveries} jobs</td>
                    <td className="py-3 text-right text-brand-primary font-bold">{p.rating}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Recent Transactions */}
        <Card title="Recent Ledger Clearings">
          <div className="overflow-x-auto">
            <table className="w-full font-mono text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-borders-outline/10 text-text-secondary text-desc">
                  <th className="py-2.5 font-semibold">TRANSACTION ID</th>
                  <th className="py-2.5 font-semibold">CLIENT</th>
                  <th className="py-2.5 font-semibold text-right">FARE</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((t, i) => (
                  <tr key={i} className="border-b border-borders-outline/5 text-text-muted hover:bg-surface-low/30 text-table">
                    <td className="py-3 font-bold text-text-primary">{t.id}</td>
                    <td className="py-3 font-sans font-semibold text-text-primary">{t.client}</td>
                    <td className="py-3 text-right text-success font-bold">{t.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

      </div>

    </div>
  );
}

// Simple internal icon helper stubs
function CheckCircleIcon(props) {
  return (
    <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function AlertCircleIcon(props) {
  return (
    <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  );
}
