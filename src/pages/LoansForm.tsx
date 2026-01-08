import React, { useEffect, useState } from 'react';
import { Card, Button } from '../components/shared';
import { supabase } from '../lib/supabase';

type LoanEntry = {
  id: string;
  name?: string;
  dateTaken?: string; // ISO date
  amount: number;
  termYears?: number;
  interestRate?: number; // percent
  originationFee?: number; // percent or absolute
};

const LoansForm: React.FC = () => {
  const [totalNeeded, setTotalNeeded] = useState<number | ''>('');
  const [loans, setLoans] = useState<LoanEntry[]>(() => [
    { id: String(Date.now()), name: '', dateTaken: '', amount: 0, termYears: 10, interestRate: 5.0, originationFee: 0 },
  ]);

  useEffect(() => {
    const load = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;
        const { data, error } = await supabase.from('loans_form').select('data').eq('user_id', user.id).single();
        if (error || !data) return;
        const parsed = data.data as { totalNeeded?: number; loans?: LoanEntry[] };
        if (parsed.totalNeeded !== undefined) setTotalNeeded(parsed.totalNeeded);
        if (parsed.loans) setLoans(parsed.loans.map(l => ({ ...l, id: l.id || String(Date.now() + Math.random()) })));
      } catch (e) {
        // ignore
      }
    };
    load();
  }, []);

  const updateLoan = (id: string, patch: Partial<LoanEntry>) => {
    setLoans(prev => prev.map(l => (l.id === id ? { ...l, ...patch } : l)));
  };

  const addLoan = () => {
    setLoans(prev => [...prev, { id: String(Date.now() + Math.random()), name: '', dateTaken: '', amount: 0, termYears: 10, interestRate: 5.0, originationFee: 0 }]);
  };

  const removeLoan = (id: string) => {
    setLoans(prev => prev.filter(l => l.id !== id));
  };

  const totalExisting = loans.reduce((s, l) => s + (Number(l.amount) || 0), 0);
  const remaining = typeof totalNeeded === 'number' ? Math.max(0, totalNeeded - totalExisting) : undefined;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    // simple validation
    if (totalNeeded === '' || Number(totalNeeded) <= 0) {
      alert('Please enter the total amount you need to borrow.');
      return;
    }
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        alert('Please sign in to save your loans.');
        return;
      }
      const payload = { user_id: user.id, data: { totalNeeded, loans } };
      const { error } = await supabase.from('loans_form').insert(payload, { returning: 'minimal' });
      if (error) {
        alert('Save failed: ' + error.message);
      } else {
        alert('Saved to Supabase.');
      }
    } catch (err) {
      alert('Save failed');
    }
  };

  const formatCurrency = (n: number) => n.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });

  return (
    <div className="animate-enter">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 mb-12">
        <h1 className="text-2xl font-bold mb-4">Loan Details</h1>
        <form onSubmit={submit}>
          <Card className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">How much total money do you need to borrow?</label>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                min={0}
                step="0.01"
                value={totalNeeded === '' ? '' : totalNeeded}
                onChange={e => setTotalNeeded(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full rounded-lg border border-cap-red/20 px-3 py-2 focus:outline-none"
                placeholder="Total amount needed (USD)"
              />
            </div>
          </Card>

          <Card className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold">Loans You've Already Taken</h2>
              <Button variant="secondary" type="button" onClick={addLoan}>Add Loan</Button>
            </div>

            <div className="space-y-4">
              {loans.map((loan, idx) => (
                <div key={loan.id} className="p-3 rounded-lg border border-cap-red/20 bg-white">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <label className="block text-xs text-gray-600">Lender / Loan Name</label>
                      <input value={loan.name || ''} onChange={e => updateLoan(loan.id, { name: e.target.value })} className="w-full rounded-md border px-2 py-1 mt-1" />
                    </div>
                    <div className="w-36">
                      <label className="block text-xs text-gray-600">Date Taken</label>
                      <input type="date" value={loan.dateTaken || ''} onChange={e => updateLoan(loan.id, { dateTaken: e.target.value })} className="w-full rounded-md border px-2 py-1 mt-1" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div>
                      <label className="block text-xs text-gray-600">Amount</label>
                      <input type="number" min={0} step="0.01" value={loan.amount || 0} onChange={e => updateLoan(loan.id, { amount: Number(e.target.value) })} className="w-full rounded-md border px-2 py-1 mt-1" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600">Term (years)</label>
                      <input type="number" min={0} step="1" value={loan.termYears || 0} onChange={e => updateLoan(loan.id, { termYears: Number(e.target.value) })} className="w-full rounded-md border px-2 py-1 mt-1" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600">Interest Rate (%)</label>
                      <input type="number" min={0} step="0.01" value={loan.interestRate || 0} onChange={e => updateLoan(loan.id, { interestRate: Number(e.target.value) })} className="w-full rounded-md border px-2 py-1 mt-1" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600">Origination Fee (%)</label>
                      <input type="number" min={0} step="0.01" value={loan.originationFee || 0} onChange={e => updateLoan(loan.id, { originationFee: Number(e.target.value) })} className="w-full rounded-md border px-2 py-1 mt-1" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="text-sm text-gray-700">Estimated balance: {formatCurrency(Number(loan.amount || 0))}</div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" type="button" onClick={() => removeLoan(loan.id)}>Remove</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="mb-6">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm text-gray-600">Total existing loans</div>
                <div className="text-xl font-bold">{formatCurrency(totalExisting)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Remaining need</div>
                <div className="text-xl font-bold">{remaining === undefined ? '—' : formatCurrency(remaining)}</div>
              </div>
            </div>
          </Card>

          <div className="flex gap-3">
            <Button type="submit" variant="primary">Save</Button>
            <Button
              type="button"
              variant="secondary"
              onClick={async () => {
                setTotalNeeded('');
                setLoans([{ id: String(Date.now()), name: '', dateTaken: '', amount: 0, termYears: 10, interestRate: 5.0, originationFee: 0 }]);
                try {
                  const {
                    data: { user },
                  } = await supabase.auth.getUser();
                  if (user) await supabase.from('loans_form').delete().eq('user_id', user.id);
                } catch (e) {}
              }}
            >
              Reset
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoansForm;
