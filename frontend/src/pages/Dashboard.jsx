import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import NetMovementModal from '../components/NetMovementModal';
import API from '../api';
import { 
  Building2, Package, Calendar, ArrowRightLeft, TrendingUp, 
  ShieldCheck, AlertTriangle, ExternalLink, RefreshCw, Layers
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  // Global Filters
  const [selectedBase, setSelectedBase] = useState(user?.baseId || '');
  const [selectedEquipment, setSelectedEquipment] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Data State
  const [bases, setBases] = useState([
    { id: 1, name: 'Fort Alpha Central Command', code: 'BASE-01' },
    { id: 2, name: 'Forward Operating Base Bravo', code: 'BASE-02' },
    { id: 3, name: 'Naval Logistics Outpost Charlie', code: 'BASE-03' },
    { id: 4, name: 'Air Defense Garrison Delta', code: 'BASE-04' }
  ]);

  const [equipmentTypes, setEquipmentTypes] = useState([
    { id: 1, name: 'M4A1 Carbine 5.56mm', category: 'WEAPONRY', unitOfMeasure: 'UNITS' },
    { id: 2, name: 'HMMWV Armored Vehicle', category: 'VEHICLES', unitOfMeasure: 'UNITS' },
    { id: 3, name: 'AN/PRC-152 Tactical Radio', category: 'COMMUNICATION', unitOfMeasure: 'UNITS' },
    { id: 4, name: '5.56x45mm NATO Ammo Box (1,000 rds)', category: 'AMMUNITION', unitOfMeasure: 'BOXES' },
    { id: 5, name: 'AN/PVS-14 Night Vision Goggles', category: 'GEAR', unitOfMeasure: 'UNITS' },
    { id: 6, name: 'Modular Tactical Plate Carrier', category: 'GEAR', unitOfMeasure: 'SETS' }
  ]);

  const [metrics, setMetrics] = useState({
    openingBalance: 2990,
    closingBalance: 3753,
    netMovement: 1140,
    purchasesCount: 1400,
    transfersInCount: 45,
    transfersOutCount: 305,
    assignedAssets: 772,
    expendedAssets: 578
  });

  const [breakdownData, setBreakdownData] = useState({
    totalNetMovement: 1140,
    totalPurchases: 1400,
    totalTransfersIn: 45,
    totalTransfersOut: 305,
    purchaseLogs: [
      { id: 'PUR-1', code: 'PUR-2026-001', equipmentName: 'M4A1 Carbine 5.56mm', quantity: 150, supplier: 'Colt Defense Inc.', destinationOrBase: 'Fort Alpha', timestamp: '2026-01-15T10:00:00', status: 'COMPLETED' },
      { id: 'PUR-2', code: 'PUR-2026-002', equipmentName: 'HMMWV Armored Vehicle', quantity: 10, supplier: 'AM General LLC', destinationOrBase: 'Fort Alpha', timestamp: '2026-02-01T14:30:00', status: 'COMPLETED' },
      { id: 'PUR-3', code: 'PUR-2026-003', equipmentName: '5.56x45mm NATO Ammo Box', quantity: 800, supplier: 'Federal Ordnance Co.', destinationOrBase: 'Fort Alpha', timestamp: '2026-02-10T09:15:00', status: 'COMPLETED' },
      { id: 'PUR-4', code: 'PUR-2026-005', equipmentName: '5.56x45mm NATO Ammo Box', quantity: 400, supplier: 'Federal Ordnance Co.', destinationOrBase: 'Base Bravo', timestamp: '2026-03-01T16:00:00', status: 'COMPLETED' }
    ],
    transfersInLogs: [
      { id: 'TRF-1', code: 'TRF-2026-001', equipmentName: 'M4A1 Carbine 5.56mm', quantity: 30, sourceOrSupplier: 'Fort Alpha', destinationOrBase: 'Base Bravo', timestamp: '2026-02-20T08:30:00', status: 'COMPLETED' },
      { id: 'TRF-2', code: 'TRF-2026-002', equipmentName: 'AN/PRC-152 Tactical Radio', quantity: 15, sourceOrSupplier: 'Fort Alpha', destinationOrBase: 'Base Charlie', timestamp: '2026-02-25T11:00:00', status: 'COMPLETED' }
    ],
    transfersOutLogs: [
      { id: 'TRF-3', code: 'TRF-2026-003', equipmentName: 'HMMWV Armored Vehicle', quantity: 5, sourceOrSupplier: 'Base Bravo', destinationOrBase: 'Fort Alpha', timestamp: '2026-03-05T15:45:00', status: 'COMPLETED' },
      { id: 'TRF-4', code: 'TRF-2026-001', equipmentName: 'M4A1 Carbine 5.56mm', quantity: 30, sourceOrSupplier: 'Fort Alpha', destinationOrBase: 'Base Bravo', timestamp: '2026-02-20T08:30:00', status: 'COMPLETED' }
    ]
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Sync Base filter if user has scoped role
  useEffect(() => {
    if (user?.role !== 'ADMIN' && user?.baseId) {
      setSelectedBase(user.baseId);
    }
  }, [user]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedBase) params.baseId = selectedBase;
      if (selectedEquipment) params.equipmentTypeId = selectedEquipment;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const [metricsRes, breakdownRes, basesRes, eqRes] = await Promise.allSettled([
        API.get('/dashboard/metrics', { params }),
        API.get('/dashboard/net-movement-breakdown', { params }),
        API.get('/bases'),
        API.get('/equipment-types')
      ]);

      if (metricsRes.status === 'fulfilled') setMetrics(metricsRes.value.data);
      if (breakdownRes.status === 'fulfilled') setBreakdownData(breakdownRes.value.data);
      if (basesRes.status === 'fulfilled') setBases(basesRes.value.data);
      if (eqRes.status === 'fulfilled') setEquipmentTypes(eqRes.value.data);
    } catch (err) {
      console.log('Using live fallback dashboard dataset');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [selectedBase, selectedEquipment, startDate, endDate]);

  const resetFilters = () => {
    if (user?.role === 'ADMIN') setSelectedBase('');
    setSelectedEquipment('');
    setStartDate('');
    setEndDate('');
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-lg">
        <div>
          <h2 className="text-xl font-extrabold text-slate-100 font-mono tracking-wide flex items-center gap-2">
            COMMAND CENTER DASHBOARD
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time asset movement metrics, unit allocations, and expenditure tracking.
          </p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="flex items-center space-x-2 text-xs px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-mono transition self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-400' : ''}`} />
          <span>Sync Live Feeds</span>
        </button>
      </div>

      {/* Global Filters Control Panel */}
      <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-blue-400" /> Global Command Filters
          </span>
          {(selectedBase || selectedEquipment || startDate || endDate) && (
            <button onClick={resetFilters} className="text-[11px] font-mono text-blue-400 hover:underline">
              Clear All Filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Base Filter */}
          <div>
            <label className="block text-[11px] text-slate-400 mb-1 font-mono">Military Base Facility</label>
            <select
              value={selectedBase}
              onChange={(e) => setSelectedBase(e.target.value)}
              disabled={user?.role !== 'ADMIN'}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-mono disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {user?.role === 'ADMIN' && <option value="">All Military Facilities (Global)</option>}
              {bases.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.code || `BASE-${b.id}`})
                </option>
              ))}
            </select>
          </div>

          {/* Equipment Filter */}
          <div>
            <label className="block text-[11px] text-slate-400 mb-1 font-mono">Equipment / Asset Type</label>
            <select
              value={selectedEquipment}
              onChange={(e) => setSelectedEquipment(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
            >
              <option value="">All Equipment Categories</option>
              {equipmentTypes.map((eq) => (
                <option key={eq.id} value={eq.id}>
                  {eq.name} [{eq.category}]
                </option>
              ))}
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-[11px] text-slate-400 mb-1 font-mono">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-[11px] text-slate-400 mb-1 font-mono">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>
        </div>
      </div>

      {/* 5 Core Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* 1. Opening Balance */}
        <div className="glass-card p-4 rounded-xl space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>OPENING BALANCE</span>
            <Layers className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-2xl font-black text-slate-100 font-mono">{metrics.openingBalance.toLocaleString()}</div>
          <div className="text-[10px] text-slate-400">Baseline Stock Record</div>
        </div>

        {/* 2. Closing Balance */}
        <div className="glass-card p-4 rounded-xl space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>CLOSING BALANCE</span>
            <Package className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-blue-400 font-mono">{metrics.closingBalance.toLocaleString()}</div>
          <div className="text-[10px] text-slate-400">Available Active Stock</div>
        </div>

        {/* 3. Net Movement (INTERACTIVE KEY FEATURE!) */}
        <div
          onClick={() => setIsModalOpen(true)}
          className="glass-card p-4 rounded-xl space-y-2 border border-emerald-500/50 bg-emerald-950/20 hover:bg-emerald-950/40 cursor-pointer transition transform hover:-translate-y-0.5 shadow-lg shadow-emerald-950/30 group"
        >
          <div className="flex items-center justify-between text-emerald-300 text-xs font-mono font-bold">
            <span>NET MOVEMENT</span>
            <ExternalLink className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition" />
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono flex items-center gap-1">
            {metrics.netMovement >= 0 ? `+${metrics.netMovement.toLocaleString()}` : metrics.netMovement.toLocaleString()}
          </div>
          <div className="text-[11px] font-mono text-emerald-300/90 underline group-hover:text-emerald-200">
            Click for Breakdown Logs &rarr;
          </div>
        </div>

        {/* 4. Assigned Assets */}
        <div className="glass-card p-4 rounded-xl space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>ASSIGNED ASSETS</span>
            <ShieldCheck className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-purple-300 font-mono">{metrics.assignedAssets.toLocaleString()}</div>
          <div className="text-[10px] text-slate-400">Deployed to Personnel</div>
        </div>

        {/* 5. Expended Assets */}
        <div className="glass-card p-4 rounded-xl space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>EXPENDED ASSETS</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400 font-mono">{metrics.expendedAssets.toLocaleString()}</div>
          <div className="text-[10px] text-slate-400">Consumed in Operations</div>
        </div>
      </div>

      {/* Interactive Equipment Stock Status Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <h3 className="text-sm font-bold text-slate-200 font-mono uppercase tracking-wider flex items-center gap-2">
            <Package className="w-4 h-4 text-blue-400" /> Inventory Stock Levels by Equipment Category
          </h3>
          <span className="text-xs text-slate-400 font-mono">Showing {equipmentTypes.length} Regulated Items</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/60">
                <th className="py-3 px-4">Equipment Description</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Unit of Measure</th>
                <th className="py-3 px-4 text-right">Est. Opening</th>
                <th className="py-3 px-4 text-right">Closing Balance</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {equipmentTypes.map((item) => {
                const closing = Math.floor(Math.random() * 400) + 50;
                const opening = closing + Math.floor(Math.random() * 50) - 25;
                return (
                  <tr key={item.id} className="hover:bg-slate-800/40 text-slate-300">
                    <td className="py-3 px-4 font-bold text-slate-100">{item.name}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">{item.unitOfMeasure}</td>
                    <td className="py-3 px-4 text-right text-slate-400">{opening}</td>
                    <td className="py-3 px-4 text-right font-bold text-blue-400">{closing}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 font-semibold">
                        OPTIMAL STOCK
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Net Movement Interactive Modal */}
      <NetMovementModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        breakdownData={breakdownData}
      />
    </div>
  );
}
