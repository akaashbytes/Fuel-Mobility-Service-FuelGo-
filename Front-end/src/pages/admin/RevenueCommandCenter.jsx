import React from 'react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import { DollarSign, TrendingUp, CreditCard, PieChart, Users, ArrowUpRight } from 'lucide-react';

export default function RevenueCommandCenter() {
  const stats = [
    { label: 'Monthly Recurring Revenue (MRR)', value: '$24,850.00', icon: DollarSign, trend: '+8.2% vs last month', color: 'text-success' },
    { label: 'Total Transaction Volume', value: '$112,490.50', icon: TrendingUp, trend: '4,892 charges processed', color: 'text-brand-primary' },
    { label: 'Active Subscriptions', value: '1,242 Clients', icon: Users, trend: '+45 new signups today', color: 'text-blue-500' },
    { label: 'Average Ticket Size', value: '$45.20', icon: CreditCard, trend: 'Fuel + dispatch base average', color: 'text-amber-500' },
  ];

  const recentTransactions = [
    { id: 'TXN-902', client: 'Alex Mercer', type: '91 Premium Fuel', plan: 'Premium Route SOS', amount: '$49.25', payout: 'Success' },
    { id: 'TXN-901', client: 'Sarah Connor', type: 'Flatbed Towing', plan: 'Pay-As-You-Go', amount: '$110.00', payout: 'Success' },
    { id: 'TXN-900', client: 'Bruce Wayne', type: 'Battery Jump Start', plan: 'Premium Route SOS', amount: '$0.00', payout: 'Success' },
    { id: 'TXN-899', client: 'Clark Kent', type: 'Diesel Fuel', plan: 'Fleet Enterprise', amount: '$74.10', payout: 'Success' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Revenue Command Center</h1>
        <p className="text-xs text-text-secondary mt-0.5">Audit transaction ledgers, monthly subscription pools, and system earnings distribution.</p>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx} elevated={true}>
              <div className="flex justify-between items-start">
                <p className="text-[10px] text-text-secondary font-mono uppercase tracking-wider">{stat.label}</p>
                <div className={`p-2 rounded-btn bg-surface-low ${stat.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-mono font-bold text-text-primary">{stat.value}</p>
                <p className="text-[10px] text-text-secondary mt-1 font-mono">{stat.trend}</p>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mock Chart Area */}
        <Card title="Monthly Revenue Projection" className="lg:col-span-2" subtitle="Calculated from active client protection packages">
          <div className="h-64 flex items-end gap-3 pt-6 border-b border-borders-outline/10">
            {/* Chart bars */}
            {[45, 60, 55, 70, 85, 95, 110, 105, 125, 140, 130, 160].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                <div className="w-full bg-surface-high rounded-t group-hover:bg-brand-primary/20 transition-colors h-48 flex items-end">
                  <div
                    style={{ height: `${h}%` }}
                    className="w-full bg-brand-primary/80 group-hover:bg-brand-primary rounded-t transition-all duration-500"
                  />
                </div>
                <span className="font-mono text-[9px] text-text-secondary">
                  {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i]}
                </span>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center text-xs font-mono font-medium text-text-secondary mt-4">
            <span>PREVIOUS FY TOTAL: $142,400</span>
            <span className="text-success flex items-center gap-1">FY TREND: +28.5% <ArrowUpRight className="w-3.5 h-3.5" /></span>
          </div>
        </Card>

        {/* Plan Breakdown */}
        <Card title="Subscriptions Pool" subtitle="Ratio of active client membership plans">
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono font-bold text-text-primary">
                <span>Premium Route SOS</span>
                <span>65% (810 Clients)</span>
              </div>
              <div className="w-full bg-surface-high h-2 rounded-full overflow-hidden">
                <div className="bg-brand-primary h-full rounded-full" style={{ width: '65%' }} />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono font-bold text-text-primary">
                <span>Pay-As-You-Go (Basic)</span>
                <span>25% (312 Clients)</span>
              </div>
              <div className="w-full bg-surface-high h-2 rounded-full overflow-hidden">
                <div className="bg-text-secondary h-full rounded-full" style={{ width: '25%' }} />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono font-bold text-text-primary">
                <span>Fleet & Business Tiers</span>
                <span>10% (120 Clients)</span>
              </div>
              <div className="w-full bg-surface-high h-2 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full" style={{ width: '10%' }} />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Transaction Logs */}
      <Card title="Recent Revenue Ledger" subtitle="Verified real-time payout invoices audit logs">
        <div className="overflow-x-auto">
          <table className="w-full font-mono text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-borders-outline/10 text-text-secondary">
                <th className="py-3 font-semibold">TRANSACTION ID</th>
                <th className="py-3 font-semibold">CLIENT NAME</th>
                <th className="py-3 font-semibold">DISPATCHED SERVICE</th>
                <th className="py-3 font-semibold">PROTECTION PLAN</th>
                <th className="py-3 font-semibold">LEDGER FARE</th>
                <th className="py-3 font-semibold text-right">GATEWAY STATUS</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((txn) => (
                <tr key={txn.id} className="border-b border-borders-outline/5 text-text-muted hover:bg-surface-low/30">
                  <td className="py-3.5 font-bold text-text-primary">{txn.id}</td>
                  <td className="py-3.5 font-sans font-semibold">{txn.client}</td>
                  <td className="py-3.5">{txn.type}</td>
                  <td className="py-3.5">{txn.plan}</td>
                  <td className="py-3.5 font-bold text-brand-dark">{txn.amount}</td>
                  <td className="py-3.5 text-right">
                    <Badge variant="success">{txn.payout}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
