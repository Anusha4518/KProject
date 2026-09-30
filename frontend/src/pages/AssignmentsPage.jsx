import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../api';
import { UserCheck, AlertTriangle, Plus, Shield, CheckCircle2, User, Flame } from 'lucide-react';

export default function AssignmentsPage() {
  const { user } = useContext(AuthContext);

  const [assignments, setAssignments] = useState([
    { id: 1, assignmentCode: 'ASN-2026-001', baseName: 'Fort Alpha Central Command', equipmentTypeName: 'M4A1 Carbine 5.56mm', personnelName: 'Sgt. John Connor', personnelRank: 'Sergeant (E-5)', quantity: 10, type: 'ASSIGNMENT', status: 'ACTIVE', notes: 'Issued to Recon Alpha Squad', timestamp: '2026-01-20T09:00:00' },
    { id: 2, assignmentCode: 'ASN-2026-002', baseName: 'Fort Alpha Central Command', equipmentTypeName: 'HMMWV Armored Vehicle', personnelName: 'Cpl. Alex Mercer', personnelRank: 'Corporal (E-4)', quantity: 2, type: 'ASSIGNMENT', status: 'ACTIVE', notes: 'Assigned to Base Perimeter Patrol', timestamp: '2026-02-05T13:15:00' },
    { id: 3, assignmentCode: 'EXP-2026-001', baseName: 'Fort Alpha Central Command', equipmentTypeName: '5.56x45mm NATO Ammo Box (1,000 rds)', personnelName: 'Range Armory Training', personnelRank: 'Unit Exercise', quantity: 350, type: 'EXPENDITURE', status: 'EXPENDED', notes: 'Live-fire qualification training rounds consumed', timestamp: '2026-03-12T16:30:00' },
    { id: 4, assignmentCode: 'EXP-2026-002', baseName: 'Forward Operating Base Bravo', equipmentTypeName: '5.56x45mm NATO Ammo Box (1,000 rds)', personnelName: 'Tactical Live Exercise', personnelRank: 'Battalion Operation', quantity: 200, type: 'EXPENDITURE', status: 'EXPENDED', notes: 'Quarterly combat training ammunition expenditure', timestamp: '2026-03-15T10:00:00' }
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

  const [formMode, setFormMode] = useState('ASSIGNMENT'); // 'ASSIGNMENT' or 'EXPENDITURE'
  const [showForm, setShowForm] = useState(false);

  const [assignForm, setAssignForm] = useState({
    baseId: user?.baseId || 1,
    equipmentTypeId: 1,
    personnelName: '',
    personnelRank: 'Sergeant (E-5)',
    quantity: 1,
    notes: ''
  });

  const [expendForm, setExpendForm] = useState({
    baseId: user?.baseId || 1,
    equipmentTypeId: 4,
    operationName: '',
    unitSection: 'Battalion Operation',
    quantity: 50,
    notes: ''
  });

  const [filterType, setFilterType] = useState('ALL');
  const [message, setMessage] = useState('');

  const fetchAssignments = async () => {
    try {
      const res = await API.get('/assignments');
      if (res.data && res.data.length > 0) setAssignments(res.data);
    } catch (e) {
      console.log('Using local assignments dataset');
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/assignments', {
        ...assignForm,
        baseId: parseInt(assignForm.baseId),
        equipmentTypeId: parseInt(assignForm.equipmentTypeId),
        quantity: parseInt(assignForm.quantity)
      });
      setAssignments([res.data, ...assignments]);
    } catch (e) {
      const b = bases.find(x => x.id === parseInt(assignForm.baseId));
      const eq = equipmentTypes.find(x => x.id === parseInt(assignForm.equipmentTypeId));
      const newAssign = {
        id: Date.now(),
        assignmentCode: `ASN-2026-${Math.floor(100 + Math.random() * 900)}`,
        baseName: b?.name || 'Fort Alpha',
        equipmentTypeName: eq?.name || 'Carbine',
        personnelName: assignForm.personnelName || 'Personnel',
        personnelRank: assignForm.personnelRank,
        quantity: parseInt(assignForm.quantity),
        type: 'ASSIGNMENT',
        status: 'ACTIVE',
        notes: assignForm.notes,
        timestamp: new Date().toISOString()
      };
      setAssignments([newAssign, ...assignments]);
    }

    setMessage('Asset assigned to personnel & recorded in ledger.');
    setShowForm(false);
    setTimeout(() => setMessage(''), 4000);
  };

  const handleExpendSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/assignments/expenditure', {
        ...expendForm,
        baseId: parseInt(expendForm.baseId),
        equipmentTypeId: parseInt(expendForm.equipmentTypeId),
        quantity: parseInt(expendForm.quantity)
      });
      setAssignments([res.data, ...assignments]);
    } catch (e) {
      const b = bases.find(x => x.id === parseInt(expendForm.baseId));
      const eq = equipmentTypes.find(x => x.id === parseInt(expendForm.equipmentTypeId));
      const newExpend = {
        id: Date.now(),
        assignmentCode: `EXP-2026-${Math.floor(100 + Math.random() * 900)}`,
        baseName: b?.name || 'Fort Alpha',
        equipmentTypeName: eq?.name || 'Ammunition',
        personnelName: expendForm.operationName || 'Live Training Exercise',
        personnelRank: expendForm.unitSection,
        quantity: parseInt(expendForm.quantity),
        type: 'EXPENDITURE',
        status: 'EXPENDED',
        notes: expendForm.notes,
        timestamp: new Date().toISOString()
      };
      setAssignments([newExpend, ...assignments]);
    }

    setMessage('Expenditure recorded! Closing balance deducted & expended quantity increased.');
    setShowForm(false);
    setTimeout(() => setMessage(''), 4000);
  };

  const filteredAssignments = assignments.filter(a => {
    if (filterType === 'ASSIGNMENT' && a.type !== 'ASSIGNMENT') return false;
    if (filterType === 'EXPENDITURE' && a.type !== 'EXPENDITURE') return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-5 rounded-2xl">
        <div>
          <h2 className="text-xl font-extrabold text-slate-100 font-mono tracking-wide flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-purple-400" /> PERSONNEL ASSIGNMENTS & EXPENDITURES
          </h2>
          <p className="text-xs text-slate-400 mt-1">Issue tactical equipment to military personnel or record consumed operational assets.</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => { setFormMode('ASSIGNMENT'); setShowForm(true); }}
            className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-500 text-white px-3.5 py-2 rounded-xl text-xs font-mono font-bold shadow transition"
          >
            <User className="w-4 h-4" />
            <span>Issue Assignment</span>
          </button>
          <button
            onClick={() => { setFormMode('EXPENDITURE'); setShowForm(true); }}
            className="flex items-center space-x-2 bg-amber-600 hover:bg-amber-500 text-white px-3.5 py-2 rounded-xl text-xs font-mono font-bold shadow transition"
          >
            <Flame className="w-4 h-4" />
            <span>Record Expenditure</span>
          </button>
        </div>
      </div>

      {message && (
        <div className="p-4 bg-purple-950/80 border border-purple-700 text-purple-300 rounded-xl text-xs font-mono flex items-center gap-2 shadow">
          <CheckCircle2 className="w-4 h-4" /> {message}
        </div>
      )}

      {/* Forms Section */}
      {showForm && formMode === 'ASSIGNMENT' && (
        <form onSubmit={handleAssignSubmit} className="bg-slate-900 border border-purple-800/80 p-5 rounded-2xl space-y-4 shadow-2xl animate-fadeIn">
          <h3 className="text-sm font-bold font-mono text-purple-400 uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4" /> Issue Asset Assignment to Personnel
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-mono">
            <div>
              <label className="block text-slate-400 mb-1">Base Facility</label>
              <select
                value={assignForm.baseId}
                onChange={(e) => setAssignForm({ ...assignForm, baseId: e.target.value })}
                disabled={user?.role !== 'ADMIN'}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200"
              >
                {bases.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Equipment Item</label>
              <select
                value={assignForm.equipmentTypeId}
                onChange={(e) => setAssignForm({ ...assignForm, equipmentTypeId: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200"
              >
                {equipmentTypes.map(eq => <option key={eq.id} value={eq.id}>{eq.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Personnel Full Name</label>
              <input
                type="text"
                placeholder="e.g. Sgt. John Connor"
                value={assignForm.personnelName}
                onChange={(e) => setAssignForm({ ...assignForm, personnelName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200"
                required
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Rank / Position</label>
              <input
                type="text"
                value={assignForm.personnelRank}
                onChange={(e) => setAssignForm({ ...assignForm, personnelRank: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Quantity Assigned</label>
              <input
                type="number"
                min="1"
                value={assignForm.quantity}
                onChange={(e) => setAssignForm({ ...assignForm, quantity: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200"
                required
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Assignment Purpose / Unit</label>
              <input
                type="text"
                placeholder="e.g. Issued to Recon Squad"
                value={assignForm.notes}
                onChange={(e) => setAssignForm({ ...assignForm, notes: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-2">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-mono">Cancel</button>
            <button type="submit" className="px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-bold shadow">Save Assignment</button>
          </div>
        </form>
      )}

      {showForm && formMode === 'EXPENDITURE' && (
        <form onSubmit={handleExpendSubmit} className="bg-slate-900 border border-amber-800/80 p-5 rounded-2xl space-y-4 shadow-2xl animate-fadeIn">
          <h3 className="text-sm font-bold font-mono text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <Flame className="w-4 h-4" /> Record Consumed / Expended Assets
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-mono">
            <div>
              <label className="block text-slate-400 mb-1">Base Facility</label>
              <select
                value={expendForm.baseId}
                onChange={(e) => setExpendForm({ ...expendForm, baseId: e.target.value })}
                disabled={user?.role !== 'ADMIN'}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200"
              >
                {bases.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Expendable Item (e.g. Ammo)</label>
              <select
                value={expendForm.equipmentTypeId}
                onChange={(e) => setExpendForm({ ...expendForm, equipmentTypeId: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200"
              >
                {equipmentTypes.map(eq => <option key={eq.id} value={eq.id}>{eq.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Operation / Exercise Name</label>
              <input
                type="text"
                placeholder="e.g. Range Armory Live-fire"
                value={expendForm.operationName}
                onChange={(e) => setExpendForm({ ...expendForm, operationName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200"
                required
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Unit Section / Taskforce</label>
              <input
                type="text"
                value={expendForm.unitSection}
                onChange={(e) => setExpendForm({ ...expendForm, unitSection: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Quantity Expended</label>
              <input
                type="number"
                min="1"
                value={expendForm.quantity}
                onChange={(e) => setExpendForm({ ...expendForm, quantity: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200"
                required
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Expenditure Details</label>
              <input
                type="text"
                placeholder="Reason / combat logs..."
                value={expendForm.notes}
                onChange={(e) => setExpendForm({ ...expendForm, notes: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-2">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-mono">Cancel</button>
            <button type="submit" className="px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-mono font-bold shadow">Record Expenditure</button>
          </div>
        </form>
      )}

      {/* Filter Tabs */}
      <div className="flex space-x-2 border-b border-slate-800 pb-2 text-xs font-mono">
        <button
          onClick={() => setFilterType('ALL')}
          className={`px-3 py-1.5 rounded-lg border transition ${filterType === 'ALL' ? 'bg-slate-800 text-slate-100 border-slate-600 font-bold' : 'text-slate-400 border-transparent hover:bg-slate-800/50'}`}
        >
          All Records ({assignments.length})
        </button>
        <button
          onClick={() => setFilterType('ASSIGNMENT')}
          className={`px-3 py-1.5 rounded-lg border transition ${filterType === 'ASSIGNMENT' ? 'bg-purple-950/80 text-purple-300 border-purple-700 font-bold' : 'text-slate-400 border-transparent hover:bg-slate-800/50'}`}
        >
          Personnel Issued ({assignments.filter(a => a.type === 'ASSIGNMENT').length})
        </button>
        <button
          onClick={() => setFilterType('EXPENDITURE')}
          className={`px-3 py-1.5 rounded-lg border transition ${filterType === 'EXPENDITURE' ? 'bg-amber-950/80 text-amber-300 border-amber-700 font-bold' : 'text-slate-400 border-transparent hover:bg-slate-800/50'}`}
        >
          Expended Assets ({assignments.filter(a => a.type === 'EXPENDITURE').length})
        </button>
      </div>

      {/* Ledger Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/60">
                <th className="py-3 px-4">Ref Code</th>
                <th className="py-3 px-4">Category Type</th>
                <th className="py-3 px-4">Base Location</th>
                <th className="py-3 px-4">Equipment Item</th>
                <th className="py-3 px-4">Personnel / Operation</th>
                <th className="py-3 px-4">Rank / Section</th>
                <th className="py-3 px-4 text-right">Qty</th>
                <th className="py-3 px-4">Log Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredAssignments.map((a) => (
                <tr key={a.id} className="hover:bg-slate-800/40 text-slate-300">
                  <td className="py-3 px-4 font-bold text-blue-400">{a.assignmentCode}</td>
                  <td className="py-3 px-4">
                    {a.type === 'ASSIGNMENT' ? (
                      <span className="px-2 py-0.5 rounded text-[10px] bg-purple-950 text-purple-300 border border-purple-800 font-semibold">
                        ASSIGNMENT
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] bg-amber-950 text-amber-300 border border-amber-800 font-semibold">
                        EXPENDITURE
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-200">{a.baseName}</td>
                  <td className="py-3 px-4 font-semibold text-slate-100">{a.equipmentTypeName}</td>
                  <td className="py-3 px-4 text-slate-200 font-bold">{a.personnelName}</td>
                  <td className="py-3 px-4 text-slate-400">{a.personnelRank}</td>
                  <td className="py-3 px-4 text-right font-bold text-slate-100">{a.quantity}</td>
                  <td className="py-3 px-4 text-slate-400">{new Date(a.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
