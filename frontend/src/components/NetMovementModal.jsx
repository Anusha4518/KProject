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
            <tr className="border-b border-slate-200 text-slate-600 font-medium bg-slate-50">
              <th className="py-2.5 px-3">Ref Code</th>
              <th className="py-2.5 px-3">Equipment Item</th>
              <th className="py-2.5 px-3 text-right">Qty</th>
              <th className="py-2.5 px-3">Source / Supplier</th>
              <th className="py-2.5 px-3">Destination Base</th>
              <th className="py-2.5 px-3">Timestamp</th>
              <th className="py-2.5 px-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {logs.map((log, idx) => (
              <tr key={idx} className="hover:bg-slate-50 text-slate-700">
                <td className="py-2.5 px-3 font-bold text-blue-600">{log.code || log.id}</td>
                <td className="py-2.5 px-3 font-semibold text-slate-900">{log.equipmentName}</td>
                <td className="py-2.5 px-3 text-right font-bold text-emerald-600">+{log.quantity}</td>
                <td className="py-2.5 px-3 text-slate-500">{log.sourceOrSupplier || 'N/A'}</td>
                <td className="py-2.5 px-3 text-slate-500">{log.destinationOrBase || 'N/A'}</td>
                <td className="py-2.5 px-3 text-slate-500">{new Date(log.timestamp).toLocaleString()}</td>
                <td className="py-2.5 px-3 text-center">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {log.status || 'COMPLETED'}
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-4xl shadow-xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-lg bg-blue-100 text-blue-600 border border-blue-200">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">Net Movement Breakdown Audit</h2>
              <p className="text-xs text-slate-500">Formula: Net Movement = Purchases + Transfers In - Transfers Out</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Math Calculation Banner */}
        <div className="grid grid-cols-4 gap-3 p-4 bg-slate-50/70 border-b border-slate-200 text-xs">
          <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl">
            <div className="text-emerald-700 text-[10px] font-semibold">PURCHASES (+)</div>
            <div className="text-lg font-bold text-emerald-700">+{totalPurchases}</div>
          </div>
          <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl">
            <div className="text-blue-700 text-[10px] font-semibold">TRANSFERS IN (+)</div>
            <div className="text-lg font-bold text-blue-700">+{totalTransfersIn}</div>
          </div>
          <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl">
            <div className="text-amber-700 text-[10px] font-semibold">TRANSFERS OUT (-)</div>
            <div className="text-lg font-bold text-amber-700">-{totalTransfersOut}</div>
          </div>
          <div className="bg-indigo-50 border border-indigo-200 p-3 rounded-xl shadow-sm">
            <div className="text-indigo-700 text-[10px] font-semibold">NET MOVEMENT SUMMARY</div>
            <div className="text-lg font-extrabold text-indigo-700">
              {totalNetMovement >= 0 ? `+${totalNetMovement}` : totalNetMovement}
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 px-5 bg-slate-50">
          <button
            onClick={() => setActiveTab('purchases')}
            className={`py-3 px-4 text-xs font-semibold flex items-center space-x-2 border-b-2 transition ${
              activeTab === 'purchases'
                ? 'border-emerald-600 text-emerald-700 bg-emerald-50'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Purchases ({purchaseLogs.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('transfersIn')}
            className={`py-3 px-4 text-xs font-semibold flex items-center space-x-2 border-b-2 transition ${
              activeTab === 'transfersIn'
                ? 'border-blue-600 text-blue-700 bg-blue-50'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <ArrowDownLeft className="w-4 h-4" />
            <span>Transfers In ({transfersInLogs.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('transfersOut')}
            className={`py-3 px-4 text-xs font-semibold flex items-center space-x-2 border-b-2 transition ${
              activeTab === 'transfersOut'
                ? 'border-amber-600 text-amber-700 bg-amber-50'
                : 'border-transparent text-slate-600 hover:text-slate-900'
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
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold transition"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
}
