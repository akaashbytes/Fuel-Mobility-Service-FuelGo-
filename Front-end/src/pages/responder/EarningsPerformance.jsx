import React from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { DollarSign, Clock, CheckSquare, Award, ArrowUpRight } from 'lucide-react';

export default function EarningsPerformance() {
  const stats = [
    { title: 'Weekly Revenue', value: '$840.50', icon: DollarSign, change: '+12.4% vs last week', color: 'text-success' },
    { title: 'Completed Dispatches', value: '18 Tasks', icon: CheckSquare, change: '100% completion rate', color: 'text-brand-primary' },
    { title: 'Active Transit Hours', value: '34.2 Hrs', icon: Clock, change: '8.4 hrs idle time', color: 'text-blue-500' },
    { title: 'Performance Rating', value: '4.92 / 5.0', icon: Award, change: 'Top 5% Responder Class', color: 'text-amber-500' },
  ];

  const payoutHistory = [
    { id: 'PAY-892', date: 'June 01, 2026', method: 'Direct Deposit (Chase)', amount: 620.00, status: 'Completed' },
    { id: 'PAY-762', date: 'May 25, 2026', method: 'Direct Deposit (Chase)', amount: 840.10, status: 'Completed' },
    { id: 'PAY-612', date: 'May 18, 2026', method: 'Direct Deposit (Chase)', amount: 710.40, status: 'Completed' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Earnings & Performance Dashboard</h1>
          <p className="text-xs text-text-secondary mt-0.5">Track dispatcher payouts, metrics, and efficiency ledgers.</p>
        </div>
        <Button variant="primary" size="sm" className="font-mono text-[10px] uppercase tracking-wider font-bold">
          Request Payout Now <ArrowUpRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx} elevated={true}>
              <div className="flex justify-between items-start">
                <p className="text-[10px] text-text-secondary font-mono uppercase tracking-wider">{stat.title}</p>
                <div className={`p-2 rounded-btn bg-surface-low ${stat.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-mono font-bold text-text-primary">{stat.value}</p>
                <p className="text-[10px] text-text-secondary mt-1 font-mono">{stat.change}</p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Payout Table */}
      <Card title="Payout Transaction Ledgers" subtitle="Automated weekly deposits verification log">
        <div className="overflow-x-auto">
          <table className="w-full font-mono text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-borders-outline/10 text-text-secondary">
                <th className="py-3 font-semibold">PAYOUT ID</th>
                <th className="py-3 font-semibold">DATE</th>
                <th className="py-3 font-semibold">DEPOSIT ACCOUNT</th>
                <th className="py-3 font-semibold">STATUS</th>
                <th className="py-3 font-semibold text-right font-sans">AMOUNT DEPOSITED</th>
              </tr>
            </thead>
            <tbody>
              {payoutHistory.map((pay) => (
                <tr key={pay.id} className="border-b border-borders-outline/5 text-text-muted hover:bg-surface-low/30">
                  <td className="py-3.5 font-bold text-text-primary">{pay.id}</td>
                  <td className="py-3.5">{pay.date}</td>
                  <td className="py-3.5">{pay.method}</td>
                  <td className="py-3.5">
                    <Badge variant="success">
                      {pay.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 text-right font-bold font-sans text-brand-dark">
                    ${pay.amount.toFixed(2)}
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
