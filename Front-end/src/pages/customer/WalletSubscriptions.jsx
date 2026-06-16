import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Input from '../../components/common/Input';
import { CreditCard, DollarSign, Plus, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';

export default function WalletSubscriptions() {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(140.50);
  const [amountToAdd, setAmountToAdd] = useState('');
  const [showAddMoney, setShowAddMoney] = useState(false);

  const transactions = [
    { id: 'TXN-902', date: 'June 02, 2026', type: 'Emergency Fuel', amount: -49.25, status: 'Success' },
    { id: 'TXN-721', date: 'May 28, 2026', type: 'Auto Wallet Load', amount: 100.00, status: 'Success' },
    { id: 'TXN-553', date: 'May 15, 2026', type: 'Monthly Plan Subscription', amount: -19.99, status: 'Success' },
    { id: 'TXN-129', date: 'April 20, 2026', type: 'Roadside Towing', amount: -85.00, status: 'Success' },
  ];

  const handleAddMoney = (e) => {
    e.preventDefault();
    if (!amountToAdd || isNaN(amountToAdd)) return;
    setBalance((prev) => prev + parseFloat(amountToAdd));
    setAmountToAdd('');
    setShowAddMoney(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
          ← Back to Dashboard
        </Button>
        <div className="h-4 w-px bg-borders-outline/20" />
        <h1 className="text-xl font-bold flex items-center gap-2">
          Secure Wallet & Subscriptions
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Wallet Balance widget */}
        <Card title="Available Funds" className="md:col-span-1 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <p className="text-3xl font-mono font-bold text-brand-dark">${balance.toFixed(2)}</p>
              <p className="text-xs text-text-secondary mt-1 flex items-center gap-1 font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-success" /> SECURED BY STRIPE
              </p>
            </div>
            
            {showAddMoney ? (
              <form onSubmit={handleAddMoney} className="space-y-2">
                <Input
                  label="Amount ($)"
                  type="number"
                  placeholder="50"
                  value={amountToAdd}
                  onChange={(e) => setAmountToAdd(e.target.value)}
                  icon={DollarSign}
                  required
                />
                <div className="flex gap-2">
                  <Button type="submit" variant="primary" size="sm" className="w-full">
                    Confirm
                  </Button>
                  <Button type="button" variant="ghost" size="sm" onClick={() => setShowAddMoney(false)} className="w-full">
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="w-full flex justify-center gap-2"
                onClick={() => setShowAddMoney(true)}
              >
                <Plus className="w-4 h-4" /> Add Balance
              </Button>
            )}
          </div>
        </Card>

        {/* Subscription Plan details */}
        <Card title="Active Subscription" className="md:col-span-2">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-text-primary">Premium Route SOS</h3>
                <Badge variant="success">Active</Badge>
              </div>
              <p className="text-xs text-text-secondary mt-1">Includes unlimited free fuel dispatches (fuel volume charged separately) and 1 free towing service per month.</p>
              <ul className="text-xs font-mono space-y-2 text-text-secondary mt-4">
                <li>• BILLING FREQUENCY: Monthly ($19.99/mo)</li>
                <li>• NEXT RENEWAL DATE: July 03, 2026</li>
                <li>• REGISTERED CARD: Visa ending in 4921</li>
              </ul>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/pricing')} className="shrink-0 font-mono text-[11px] uppercase tracking-wider text-brand-primary">
              Change Plan <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      </div>

      {/* Transaction History */}
      <Card title="Transaction History" subtitle="Verified ledger log coordinates and service fares">
        <div className="overflow-x-auto">
          <table className="w-full font-mono text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-borders-outline/10 text-text-secondary">
                <th className="py-3 font-semibold">TRANSACTION ID</th>
                <th className="py-3 font-semibold">DATE</th>
                <th className="py-3 font-semibold">SERVICE TYPE</th>
                <th className="py-3 font-semibold">STATUS</th>
                <th className="py-3 font-semibold text-right font-sans">FARE AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn) => (
                <tr key={txn.id} className="border-b border-borders-outline/5 text-text-muted hover:bg-surface-low/30">
                  <td className="py-3.5 font-bold text-text-primary">{txn.id}</td>
                  <td className="py-3.5">{txn.date}</td>
                  <td className="py-3.5">{txn.type}</td>
                  <td className="py-3.5">
                    <Badge variant={txn.status === 'Success' ? 'success' : 'danger'}>
                      {txn.status}
                    </Badge>
                  </td>
                  <td className={`py-3.5 text-right font-bold font-sans ${txn.amount > 0 ? 'text-success' : 'text-text-primary'}`}>
                    {txn.amount > 0 ? `+$${txn.amount.toFixed(2)}` : `-$${Math.abs(txn.amount).toFixed(2)}`}
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
