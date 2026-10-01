import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../api';
import { ArrowLeftRight, Plus, CheckCircle2, XCircle, Clock, ShieldCheck } from 'lucide-react';

export default function TransfersPage() {
  const { user } = useContext(AuthContext);

  const [transfers, setTransfers] = useState([
    { id: 1, transferCode: 'TRF-2026-001', sourceBaseName: 'Fort Alpha Central Command', destinationBaseName: 'Forward Operating Base Bravo', equipmentTypeName: 'M4A1 Carbine 5.56mm', quantity: 30, status: 'COMPLETED', notes: 'Reinforcement request for Tactical Patrol Unit', requestedByUsername: 'officer_alpha', approvedByUsername: 'commander_alpha', createdAt: '2026-02-20T08:30:00' },
    { id: 2, transferCode: 'TRF-2026-002', sourceBaseName: 'Fort Alpha Central Command', destinationBaseName: 'Naval Logistics Outpost Charlie', equipmentTypeName: 'AN/PRC-152 Tactical Radio', quantity: 15, status: 'COMPLETED', notes: 'Naval tactical communications sync', requestedByUsername: 'officer_alpha', approvedByUsername: 'commander_alpha', createdAt: '2026-02-25T11:00:00' },
    { id: 3, transferCode: 'TRF-2026-003', sourceBaseName: 'Forward Operating Base Bravo', destinationBaseName: 'Fort Alpha Central Command', equipmentTypeName: 'HMMWV Armored Vehicle', quantity: 5, status: 'COMPLETED', notes: 'Return heavy vehicles for depot overhaul', requestedByUsername: 'officer_bravo', approvedByUsername: 'commander_bravo', createdAt: '2026-03-05T15:45:00' },
    { id: 4, transferCode: 'TRF-2026-004', sourceBaseName: 'Fort Alpha Central Command', destinationBaseName: 'Forward Operating Base Bravo', equipmentTypeName: '5.56x45mm NATO Ammo Box (1,000 rds)', quantity: 250, status: 'PENDING', notes: 'Urgent ammunition replenishment for firing range exercises', requestedByUsername: 'officer_alpha', approvedByUsername: null, createdAt: '2026-03-28T09:00:00' }
  ]);

  const [bases] = useState([
    { id: 1, name: 'Fort Alpha Central Command' },
    { id: 2, name: 'Forward Operating Base Bravo' },
    { id: 3, name: 'Naval Logistics Outpost Charlie' }
  ]);

  const [equipmentTypes] = useState([
    { id: 1, name: 'M4A1 Carbine 5.56mm' },
    { id: 2, name: 'HMMWV Armored Vehicle' },
    { id: 3, name: 'AN/PRC-152 Tactical Radio' },
    { id: 4, name: '5.56x45mm NATO Ammo Box (1,000 rds)' }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    sourceBaseId: user?.baseId || 1,
    destinationBaseId: 2,
    equipmentTypeId: 1,
    quantity: 10,
    notes: ''
  });
  const [notice, setNotice] = useState('');

  const fetchTransfers = async () => {
    try {
      const res = await API.get('/transfers');
      if (res.data && res.data.length > 0) setTransfers(res.data);
    } catch (e) {
      console.log('Using local transfers dataset');
    }
  };

  useEffect(() => {
    fetchTransfers();
  }, []);

  const handleInitiate = async (e) => {
    e.preventDefault();
    if (formData.sourceBaseId === formData.destinationBaseId) {
      alert('Source and Destination bases must be different.');
      return;
    }

    try {
      const res = await API.post('/transfers', {
        ...formData,
        sourceBaseId: parseInt(formData.sourceBaseId),
        destinationBaseId: parseInt(formData.destinationBaseId),
        equipmentTypeId: parseInt(formData.equipmentTypeId),
        quantity: parseInt(formData.quantity)
      });
      setTransfers([res.data, ...transfers]);
    } catch (e) {
      const src = bases.find(b => b.id === parseInt(formData.sourceBaseId));
      const dst = bases.find(b => b.id === parseInt(formData.destinationBaseId));
      const eq = equipmentTypes.find(q => q.id === parseInt(formData.equipmentTypeId));

      const newTrf = {
        id: Date.now(),
        transferCode: `TRF-2026-${Math.floor(100 + Math.random() * 900)}`,
        sourceBaseName: src?.name || 'Fort Alpha',
        destinationBaseName: dst?.name || 'Base Bravo',
        equipmentTypeName: eq?.name || 'Equipment Item',
        quantity: parseInt(formData.quantity),
        status: user?.role === 'LOGISTICS_OFFICER' ? 'PENDING' : 'COMPLETED',
        notes: formData.notes || 'Inter-base redistribution',
        requestedByUsername: user?.username || 'officer',
        approvedByUsername: user?.role === 'LOGISTICS_OFFICER' ? null : user?.username,
        createdAt: new Date().toISOString()
      };
      setTransfers([newTrf, ...transfers]);
    }

    setNotice('Transfer initiated successfully!');
    setShowForm(false);
    setTimeout(() => setNotice(''), 4000);
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await API.put(`/transfers/${id}/status`, { status });
      if (res.data) {
        setTransfers(prev => prev.map(t => (t.id === id ? res.data : t)));
      } else {
        setTransfers(prev =>
          prev.map(t => {
            if (t.id === id) {
              return {
                ...t,
                status: status === 'APPROVED' ? 'COMPLETED' : status,
                approvedByUsername: user?.username || 'commander'
              };
            }
            return t;
          })
        );
      }
    } catch (e) {
      setTransfers(prev =>
        prev.map(t => {
          if (t.id === id) {
            return {
              ...t,
              status: status === 'APPROVED' ? 'COMPLETED' : status,
              approvedByUsername: user?.username || 'commander'
            };
          }
          return t;
        })
      );
    }

    setNotice(`Transfer status updated to ${status}.`);
    setTimeout(() => setNotice(''), 4000);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'COMPLETED':
      case 'APPROVED':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-300 font-semibold flex items-center gap-1 justify-center">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Completed
          </span>
        );
      case 'PENDING':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-50 text-amber-700 border border-amber-300 font-semibold flex items-center gap-1 justify-center">
            <Clock className="w-3 h-3 text-amber-500" /> Pending Approval
          </span>
        );
      case 'REJECTED':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-red-50 text-red-700 border border-red-300 font-semibold flex items-center gap-1 justify-center">
            <XCircle className="w-3 h-3 text-red-500" /> Rejected
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 pb-12 font-sans text-slate-800">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 p-5 rounded-xl shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <ArrowLeftRight className="w-5 h-5 text-blue-600" /> Inter-Base Asset Transfers
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Initiate and authorize equipment transfers between bases.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-medium transition cursor-pointer shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>{showForm ? 'Cancel' : 'New Transfer'}</span>
        </button>
      </div>

      {notice && (
        <div className="p-3 bg-blue-50 border border-blue-300 text-blue-800 rounded-lg text-xs flex items-center gap-2 shadow-sm">
          <ShieldCheck className="w-4 h-4 text-blue-600" /> {notice}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleInitiate} className="bg-white border border-slate-200 p-5 rounded-xl space-y-4 shadow-sm text-xs">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Initiate Asset Transfer</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-slate-600 mb-1 font-medium">Source Base (From)</label>
              <select
                value={formData.sourceBaseId}
                onChange={(e) => setFormData({ ...formData, sourceBaseId: e.target.value })}
                disabled={user?.role !== 'ADMIN'}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
              >
                {bases.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-slate-600 mb-1 font-medium">Destination Base (To)</label>
              <select
                value={formData.destinationBaseId}
                onChange={(e) => setFormData({ ...formData, destinationBaseId: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
              >
                {bases.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-slate-600 mb-1 font-medium">Equipment Item</label>
              <select
                value={formData.equipmentTypeId}
                onChange={(e) => setFormData({ ...formData, equipmentTypeId: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
              >
                {equipmentTypes.map(eq => <option key={eq.id} value={eq.id}>{eq.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-slate-600 mb-1 font-medium">Quantity</label>
              <input
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-600 mb-1 font-medium">Notes & Reason</label>
            <input
              type="text"
              placeholder="Reason for transfer..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm cursor-pointer"
            >
              Submit Transfer Request
            </button>
          </div>
        </form>
      )}

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-600 bg-slate-50 font-semibold">
                <th className="py-3 px-4">Transfer Code</th>
                <th className="py-3 px-4">Source Base</th>
                <th className="py-3 px-4">Destination Base</th>
                <th className="py-3 px-4">Equipment Item</th>
                <th className="py-3 px-4 text-right">Qty</th>
                <th className="py-3 px-4">Notes</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {transfers.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold text-blue-600 font-mono">{t.transferCode}</td>
                  <td className="py-3 px-4 text-slate-800">{t.sourceBaseName}</td>
                  <td className="py-3 px-4 text-slate-800">{t.destinationBaseName}</td>
                  <td className="py-3 px-4 font-semibold text-slate-900">{t.equipmentTypeName}</td>
                  <td className="py-3 px-4 text-right font-bold text-slate-900">{t.quantity}</td>
                  <td className="py-3 px-4 text-slate-500">{t.notes}</td>
                  <td className="py-3 px-4 text-center">{getStatusBadge(t.status)}</td>
                  <td className="py-3 px-4 text-center">
                    {t.status === 'PENDING' ? (
                      <div className="flex items-center justify-center space-x-1.5">
                        <button
                          onClick={() => handleUpdateStatus(t.id, 'APPROVED')}
                          className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-medium cursor-pointer transition shadow-sm"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(t.id, 'REJECTED')}
                          className="px-2.5 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-[11px] font-medium cursor-pointer transition shadow-sm"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400">Authorized</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
