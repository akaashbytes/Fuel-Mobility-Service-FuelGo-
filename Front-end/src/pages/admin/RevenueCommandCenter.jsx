import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { DollarSign, TrendingUp, CreditCard, Users, ArrowUpRight, ArrowDownRight, Briefcase } from 'lucide-react';

export default function RevenueCommandCenter() {
  const [salaries, setSalaries] = useState([
    { id: 'RF-928', name: 'Marcus Vance', jobs: 3, gross: 194.25, commission: 38.85, netSalary: 155.40, status: 'Awaiting Settlement' },
    { id: 'RF-312', name: 'Diana Prince', jobs: 5, gross: 420.00, commission: 84.00, netSalary: 336.00, status: 'Settled' },
    { id: 'RF-774', name: 'Peter Parker', jobs: 2, gross: 85.00, commission: 17.00, netSalary: 68.00, status: 'Awaiting Settlement' },
    { id: 'RF-819', name: 'Clark Kent', jobs: 1, gross: 75.00, commission: 15.00, netSalary: 60.00, status: 'Held' }
  ]);

  const stats = [
    { label: 'Pending Payouts', value: '$223.40', icon: Briefcase, trend: 'Escrow held for admin settlement', color: 'text-amber-500' },
    { label: 'Total Company Commission (20%)', value: '$22,498.10', icon: TrendingUp, trend: 'Processed revenue split logs', color: 'text-brand-primary' },
    { label: 'Settled Provider Salaries', value: '$89,992.40', icon: Users, trend: 'Paid directly to responder cards', color: 'text-blue-500' },
    { label: 'Gross Completed Fares', value: '$112,490.50', icon: DollarSign, trend: 'Customer paid transaction pool', color: 'text-success' },
  ];

  const handleSettleSalary = (id) => {
    setSalaries((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status: 'Settled' } : s
      )
    );
    alert(`Salary payment successfully settled and disbursed to driver account.`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Settled': return 'success';
      case 'Held': return 'danger';
      case 'Awaiting Settlement':
      default:
        return 'warning';
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold font-display text-brand-dark">Revenue & Settlement Command</h1>
        <p className="text-xs text-text-secondary mt-0.5">Disburse provider salaries, audit company commission splits, and manage Razorpay escrow pools.</p>
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

      {/* Company controlled billing card detail */}
      <div className="bg-brand-dark border border-white/10 rounded-card p-6 text-white relative overflow-hidden shadow-floating">
        <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-10 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-brand-primary via-transparent to-transparent pointer-events-none" />
        <div className="space-y-2 relative z-10">
          <h3 className="text-base font-bold font-display text-white">Company-Controlled Settlement Model</h3>
          <p className="text-xs text-gray-300 max-w-2xl leading-relaxed">
            NexFuel operates a centralized payment structure. All customer credit card/UPI fares are charged directly to the **NexFuel Corporate Account**. Administrators disburse provider salary shares (80%) on a weekly cycle once GPS delivery logs and flow meters coordinates match verification specs.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Project ledger charts */}
        <Card title="Monthly Revenue Projection" className="lg:col-span-2" subtitle="Calculated from gross completed fares">
          <div className="h-64 flex items-end gap-3 pt-6 border-b border-borders-outline/10">
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
            <span>PREVIOUS FY COMMISSION: $14,240</span>
            <span className="text-success flex items-center gap-1">FY TREND: +28.5% <ArrowUpRight className="w-3.5 h-3.5" /></span>
          </div>
        </Card>

        {/* Payment Splits ratio */}
        <Card title="Payment Splits (Escrow)" subtitle="centralized ledger breakdown">
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono font-bold text-text-primary">
                <span>Driver Salaries (80%)</span>
                <span>$89,992.40</span>
              </div>
              <div className="w-full bg-surface-high h-2 rounded-full overflow-hidden">
                <div className="bg-brand-primary h-full rounded-full" style={{ width: '80%' }} />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono font-bold text-text-primary">
                <span>NexFuel Commission (20%)</span>
                <span>$22,498.10</span>
              </div>
              <div className="w-full bg-surface-high h-2 rounded-full overflow-hidden">
                <div className="bg-text-secondary h-full rounded-full" style={{ width: '20%' }} />
              </div>
            </div>
          </div>
        </Card>

      </div>

      {/* Salary Settlement Ledger logs */}
      <Card title="Provider Salary Settlement Ledger" subtitle="Verify and disburse driver payout shares">
        <div className="overflow-x-auto">
          <table className="w-full font-mono text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-borders-outline/10 text-text-secondary">
                <th className="py-3 font-semibold">PROVIDER ID</th>
                <th className="py-3 font-semibold">NAME</th>
                <th className="py-3 font-semibold">COMPLETED JOBS</th>
                <th className="py-3 font-semibold">GROSS REVENUE</th>
                <th className="py-3 font-semibold">NEXFUEL CUT (20%)</th>
                <th className="py-3 font-semibold">DRIVER SALARY (80%)</th>
                <th className="py-3 font-semibold">STATUS</th>
                <th className="py-3 font-semibold text-right">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {salaries.map((s) => (
                <tr key={s.id} className="border-b border-borders-outline/5 text-text-muted hover:bg-surface-low/30">
                  <td className="py-3.5 font-bold text-text-primary">{s.id}</td>
                  <td className="py-3.5 font-sans font-semibold text-text-primary">{s.name}</td>
                  <td className="py-3.5">{s.jobs} deliveries</td>
                  <td className="py-3.5 font-bold text-text-primary">${s.gross.toFixed(2)}</td>
                  <td className="py-3.5 text-brand-primary">${s.commission.toFixed(2)}</td>
                  <td className="py-3.5 font-bold text-success">${s.netSalary.toFixed(2)}</td>
                  <td className="py-3.5">
                    <Badge variant={getStatusColor(s.status)}>{s.status.toUpperCase()}</Badge>
                  </td>
                  <td className="py-3.5 text-right font-sans">
                    {s.status === 'Awaiting Settlement' ? (
                      <button
                        onClick={() => handleSettleSalary(s.id)}
                        className="px-3 py-1 bg-brand-primary text-white rounded-btn hover:bg-brand-primary-container text-[10px] font-mono font-bold cursor-pointer transition-all"
                      >
                        Settle Payout
                      </button>
                    ) : (
                      <span className="text-[10px] text-text-muted font-mono">Ledger Closed</span>
                    )}
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
