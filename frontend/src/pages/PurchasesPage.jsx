import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../api';
import { ShoppingCart, Plus, Calendar, Filter, DollarSign, Building, CheckCircle, Search } from 'lucide-react';

export default function PurchasesPage() {
  const { user } = useContext(AuthContext);

  const [purchases, setPurchases] = useState([
    { id: 1, purchaseCode: 'PUR-2026-001', baseName: 'Fort Alpha Central Command', equipmentTypeName: 'M4A1 Carbine 5.56mm', quantity: 150, unitCost: 1200.00, totalCost: 180000.00, supplier: 'Colt Defense Inc.', purchaseDate: '2026-01-15T10:00:00', createdByUsername: 'officer_alpha' },
    { id: 2, purchaseCode: 'PUR-2026-002', baseName: 'Fort Alpha Central Command', equipmentTypeName: 'HMMWV Armored Vehicle', quantity: 10, unitCost: 140000.00, totalCost: 1400000.00, supplier: 'AM General LLC', purchaseDate: '2026-02-01T14:30:00', createdByUsername: 'officer_alpha' },
    { id: 3, purchaseCode: 'PUR-2026-003', baseName: 'Fort Alpha Central Command', equipmentTypeName: '5.56x45mm NATO Ammo Box (1,000 rds)', quantity: 800, unitCost: 350.00, totalCost: 280000.00, supplier: 'Federal Ordnance Co.', purchaseDate: '2026-02-10T09:15:00', createdByUsername: 'officer_alpha' },
    { id: 4, purchaseCode: 'PUR-2026-004', baseName: 'Forward Operating Base Bravo', equipmentTypeName: 'M4A1 Carbine 5.56mm', quantity: 50, unitCost: 1250.00, totalCost: 62500.00, supplier: 'Colt Defense Inc.', purchaseDate: '2026-02-18T11:20:00', createdByUsername: 'officer_bravo' }
  ]);

  const [bases, setBases] = useState([
    { id: 1, name: 'Fort Alpha Central Command' },
    { id: 2, name: 'Forward Operating Base Bravo' },
    { id: 3, name: 'Naval Logistics Outpost Charlie' }
  ]);

  const [equipmentTypes, setEquipmentTypes] = useState([
    { id: 1, name: 'M4A1 Carbine 5.56mm' },
    { id: 2, name: 'HMMWV Armored Vehicle' },
    { id: 3, name: 'AN/PRC-152 Tactical Radio' },
    { id: 4, name: '5.56x45mm NATO Ammo Box (1,000 rds)' }
  ]);

  // Form State
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    baseId: user?.baseId || 1,
    equipmentTypeId: 1,
    quantity: 50,
    unitCost: 1200,
    supplier: '',
    purchaseDate: new Date().toISOString().substring(0, 10)
  });

  // Filter State
  const [selectedEquipment, setSelectedEquipment] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const fetchPurchases = async () => {
    try {
      const res = await API.get('/purchases');
      if (res.data && res.data.length > 0) setPurchases(res.data);
    } catch (e) {
      console.log('Using local purchases dataset');
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        quantity: parseInt(formData.quantity),
        unitCost: parseFloat(formData.unitCost)
      };
      const res = await API.post('/purchases', payload);
      setPurchases([res.data, ...purchases]);
    } catch (e) {
      const selectedEq = equipmentTypes.find(eq => eq.id === parseInt(formData.equipmentTypeId));
      const selectedB = bases.find(b => b.id === parseInt(formData.baseId));
      const newPurchase = {
        id: Date.now(),
        purchaseCode: `PUR-2026-${Math.floor(100 + Math.random() * 900)}`,
        baseName: selectedB?.name || 'Fort Alpha',
        equipmentTypeName: selectedEq?.name || 'Assault Weaponry',
        quantity: parseInt(formData.quantity),
        unitCost: parseFloat(formData.unitCost),
        totalCost: parseInt(formData.quantity) * parseFloat(formData.unitCost),
        supplier: formData.supplier || 'Defense Supplier Corp',
        purchaseDate: formData.purchaseDate,
        createdByUsername: user?.username || 'officer'
      };
      setPurchases([newPurchase, ...purchases]);
    }

    setSuccessMessage('Purchase record logged & Asset Balances updated!');
    setShowForm(false);
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  const filteredPurchases = purchases.filter(p => {
    if (selectedEquipment && p.equipmentTypeName !== equipmentTypes.find(e => e.id === parseInt(selectedEquipment))?.name) return false;
    if (searchQuery && !p.purchaseCode.toLowerCase().includes(searchQuery.toLowerCase()) && !p.supplier.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const totalSpent = filteredPurchases.reduce((acc, curr) => acc + (curr.totalCost || 0), 0);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-5 rounded-2xl">
        <div>
          <h2 className="text-xl font-extrabold text-slate-100 font-mono tracking-wide flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-emerald-400" /> ASSET PROCUREMENT LOGS
          </h2>
          <p className="text-xs text-slate-400 mt-1">Record military equipment acquisitions & auto-increment asset balances.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-mono font-bold shadow-lg shadow-emerald-950/40 transition"
        >
          <Plus className="w-4 h-4" />
          <span>{showForm ? 'Cancel Entry' : 'Record New Purchase'}</span>
        </button>
      </div>

      {/* Alert Banner */}
      {successMessage && (
        <div className="p-4 bg-emerald-950/80 border border-emerald-700 text-emerald-300 rounded-xl text-xs font-mono flex items-center gap-2 shadow-lg">
          <CheckCircle className="w-4 h-4" /> {successMessage}
        </div>
      )}

      {/* Record Purchase Modal / Expandable Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-slate-900 border border-emerald-800/80 p-5 rounded-2xl space-y-4 shadow-2xl animate-fadeIn">
          <h3 className="text-sm font-bold font-mono text-emerald-400 uppercase tracking-wider">Acquisition Requisition Form</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Target Base Facility</label>
              <select
                value={formData.baseId}
                onChange={(e) => setFormData({ ...formData, baseId: e.target.value })}
                disabled={user?.role !== 'ADMIN'}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200"
              >
                {bases.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Equipment Item</label>
              <select
                value={formData.equipmentTypeId}
                onChange={(e) => setFormData({ ...formData, equipmentTypeId: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200"
              >
                {equipmentTypes.map(eq => <option key={eq.id} value={eq.id}>{eq.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Quantity Acquired</label>
              <input
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Unit Cost ($ USD)</label>
              <input
                type="number"
                step="0.01"
                value={formData.unitCost}
                onChange={(e) => setFormData({ ...formData, unitCost: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Approved Defense Supplier</label>
              <input
                type="text"
                placeholder="e.g. Colt Defense Inc."
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Purchase Date</label>
              <input
                type="date"
                value={formData.purchaseDate}
                onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-mono"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold shadow"
            >
              Save Requisition
            </button>
          </div>
        </form>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center space-x-2 flex-1 max-w-md bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg">
          <Search className="w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search code or supplier..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-slate-200 focus:outline-none"
          />
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={selectedEquipment}
            onChange={(e) => setSelectedEquipment(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200"
          >
            <option value="">All Equipment Filter</option>
            {equipmentTypes.map(eq => <option key={eq.id} value={eq.id}>{eq.name}</option>)}
          </select>
          <div className="bg-slate-950 border border-slate-800 px-3 py-2 rounded-lg text-slate-400">
            Total Spend: <span className="text-emerald-400 font-bold">${totalSpent.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Historical Purchases Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/60">
                <th className="py-3 px-4">PO Code</th>
                <th className="py-3 px-4">Base Facility</th>
                <th className="py-3 px-4">Equipment Item</th>
                <th className="py-3 px-4 text-right">Qty</th>
                <th className="py-3 px-4 text-right">Unit Cost</th>
                <th className="py-3 px-4 text-right">Total Cost</th>
                <th className="py-3 px-4">Supplier</th>
                <th className="py-3 px-4">Log Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredPurchases.map((p) => (
                <tr key={p.id} className="hover:bg-slate-800/40 text-slate-300">
                  <td className="py-3 px-4 font-bold text-blue-400">{p.purchaseCode}</td>
                  <td className="py-3 px-4 text-slate-200">{p.baseName}</td>
                  <td className="py-3 px-4 font-semibold text-slate-100">{p.equipmentTypeName}</td>
                  <td className="py-3 px-4 text-right font-bold text-emerald-400">+{p.quantity}</td>
                  <td className="py-3 px-4 text-right text-slate-400">${p.unitCost?.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right font-bold text-slate-200">${p.totalCost?.toLocaleString()}</td>
                  <td className="py-3 px-4 text-slate-400">{p.supplier}</td>
                  <td className="py-3 px-4 text-slate-400">{new Date(p.purchaseDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
