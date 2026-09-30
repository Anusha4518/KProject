import React, { useState } from 'react';
import { X, ShoppingBag, ArrowDownLeft, ArrowUpRight, Calculator, CheckCircle2 } from 'lucide-react';

export default function NetMovementModal({ isOpen, onClose, breakdownData }) {
  const [activeTab, setActiveTab] = useState('purchases');

  if (!isOpen || !breakdownData) return null;

  const {
    totalNetMovement = 0,
    totalPurchases = 0,
    totalTransfersIn = 0,
    totalTransfersOut = 0,
    purchaseLogs = [],
    transfersInLogs = [],
    transfersOutLogs = []
  } = breakdownData;

  const renderTable = (logs, emptyMessage) => {
    if (!logs || logs.length === 0) {
      return (
        <div className="py-12 text-center text-slate-500 font-mono text-xs">
          {emptyMessage}
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-mono bg-slate-900/60">
              <th className="py-2.5 px-3">Ref Code</th>
              <th className="py-2.5 px-3">Equipment Item</th>
              <th className="py-2.5 px-3 text-right">Qty</th>
              <th className="py-2.5 px-3">Source / Supplier</th>
              <th className="py-2.5 px-3">Destination Base</th>
              <th className="py-2.5 px-3">Timestamp</th>
              <th className="py-2.5 px-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {logs.map((log, idx) => (
              <tr key={idx} className="hover:bg-slate-800/40 text-slate-300">
                <td className="py-2.5 px-3 font-bold text-blue-400">{log.code || log.id}</td>
                <td className="py-2.5 px-3 font-semibold text-slate-200">{log.equipmentName}</td>
                <td className="py-2.5 px-3 text-right font-bold text-emerald-400">+{log.quantity}</td>
                <td className="py-2.5 px-3 text-slate-400">{log.sourceOrSupplier || 'N/A'}</td>
                <td className="py-2.5 px-3 text-slate-400">{log.destinationOrBase || 'N/A'}</td>
                <td className="py-2.5 px-3 text-slate-400">{new Date(log.timestamp).toLocaleString()}</td>
                <td className="py-2.5 px-3 text-center">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-emerald-950/80 text-emerald-300 border border-emerald-800">
                    <CheckCircle2 className="w-3 h-3" /> {log.status || 'COMPLETED'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-lg bg-blue-950 text-blue-400 border border-blue-800/60">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 font-mono tracking-wide">NET MOVEMENT BREAKDOWN AUDIT</h2>
              <p className="text-xs text-slate-400">Formula: Net Movement = Purchases + Transfers In - Transfers Out</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Math Calculation Banner */}
        <div className="grid grid-cols-4 gap-3 p-4 bg-slate-950/40 border-b border-slate-800/80 text-xs font-mono">
          <div className="bg-emerald-950/40 border border-emerald-800/60 p-3 rounded-xl">
            <div className="text-slate-400 text-[10px]">PURCHASES (+)</div>
            <div className="text-lg font-bold text-emerald-400">+{totalPurchases}</div>
          </div>
          <div className="bg-blue-950/40 border border-blue-800/60 p-3 rounded-xl">
            <div className="text-slate-400 text-[10px]">TRANSFERS IN (+)</div>
            <div className="text-lg font-bold text-blue-400">+{totalTransfersIn}</div>
          </div>
          <div className="bg-amber-950/40 border border-amber-800/60 p-3 rounded-xl">
            <div className="text-slate-400 text-[10px]">TRANSFERS OUT (-)</div>
            <div className="text-lg font-bold text-amber-400">-{totalTransfersOut}</div>
          </div>
          <div className="bg-indigo-950/60 border border-indigo-700 p-3 rounded-xl shadow-lg">
            <div className="text-indigo-300 text-[10px]">NET MOVEMENT SUMMARY</div>
            <div className="text-lg font-extrabold text-indigo-200">
              {totalNetMovement >= 0 ? `+${totalNetMovement}` : totalNetMovement}
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-800 px-5 bg-slate-900/50">
          <button
            onClick={() => setActiveTab('purchases')}
            className={`py-3 px-4 text-xs font-mono font-semibold flex items-center space-x-2 border-b-2 transition ${
              activeTab === 'purchases'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Purchases ({purchaseLogs.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('transfersIn')}
            className={`py-3 px-4 text-xs font-mono font-semibold flex items-center space-x-2 border-b-2 transition ${
              activeTab === 'transfersIn'
                ? 'border-blue-500 text-blue-400 bg-blue-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ArrowDownLeft className="w-4 h-4" />
            <span>Transfers In ({transfersInLogs.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('transfersOut')}
            className={`py-3 px-4 text-xs font-mono font-semibold flex items-center space-x-2 border-b-2 transition ${
              activeTab === 'transfersOut'
                ? 'border-amber-500 text-amber-400 bg-amber-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>Transfers Out ({transfersOutLogs.length})</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-5 overflow-y-auto flex-1">
          {activeTab === 'purchases' && renderTable(purchaseLogs, 'No purchase records found for selected filters.')}
          {activeTab === 'transfersIn' && renderTable(transfersInLogs, 'No incoming transfer records found for selected base.')}
          {activeTab === 'transfersOut' && renderTable(transfersOutLogs, 'No outgoing transfer records found for selected base.')}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/90 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-semibold transition"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
}
