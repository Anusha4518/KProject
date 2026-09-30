import React, { useState, useEffect } from 'react';
import API from '../api';
import { History, ShieldAlert, User, Terminal, Filter, RefreshCw } from 'lucide-react';

export default function AuditLogsPage() {
  const [logs, setLogs] = useState([
    { id: 5, timestamp: '2026-03-28T09:00:15', username: 'officer_alpha', userRole: 'LOGISTICS_OFFICER', actionType: 'TRANSFER_INITIATED', entityType: 'Transfer', entityId: 4, details: 'Initiated transfer of 250 5.56x45mm NATO Ammo Boxes from Fort Alpha to FOB Bravo', ipAddress: '192.168.1.45' },
    { id: 4, timestamp: '2026-03-12T16:30:22', username: 'officer_alpha', userRole: 'LOGISTICS_OFFICER', actionType: 'ASSET_EXPENDED', entityType: 'Assignment', entityId: 3, details: 'Recorded expenditure of 350 5.56x45mm NATO Ammo Box for Live-fire qualification training', ipAddress: '192.168.1.45' },
    { id: 3, timestamp: '2026-02-20T10:15:40', username: 'commander_alpha', userRole: 'BASE_COMMANDER', actionType: 'TRANSFER_APPROVED', entityType: 'Transfer', entityId: 1, details: 'Approved transfer TRF-2026-001 of 30 M4A1 Carbines to FOB Bravo', ipAddress: '192.168.1.10' },
    { id: 2, timestamp: '2026-02-20T08:30:12', username: 'officer_alpha', userRole: 'LOGISTICS_OFFICER', actionType: 'TRANSFER_INITIATED', entityType: 'Transfer', entityId: 1, details: 'Initiated transfer of 30 M4A1 Carbines from Fort Alpha Central Command to FOB Bravo', ipAddress: '192.168.1.45' },
    { id: 1, timestamp: '2026-01-15T10:00:05', username: 'officer_alpha', userRole: 'LOGISTICS_OFFICER', actionType: 'PURCHASE_RECORDED', entityType: 'Purchase', entityId: 1, details: 'Recorded purchase of 150 M4A1 Carbine from Colt Defense Inc. Total: $180,000.00', ipAddress: '192.168.1.45' }
  ]);

  const [filterAction, setFilterAction] = useState('');
  const [filterUser, setFilterUser] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchAuditLogs = async () => {
    setLoading(true);
    try {
      const res = await API.get('/audit-logs');
      if (res.data && res.data.length > 0) setLogs(res.data);
    } catch (e) {
      console.log('Using local audit_logs database feed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const getActionBadge = (actionType) => {
    if (actionType.includes('PURCHASE')) {
      return <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 font-semibold">{actionType}</span>;
    }
    if (actionType.includes('TRANSFER')) {
      return <span className="px-2 py-0.5 rounded text-[10px] bg-blue-950 text-blue-300 border border-blue-800 font-semibold">{actionType}</span>;
    }
    if (actionType.includes('EXPENDED')) {
      return <span className="px-2 py-0.5 rounded text-[10px] bg-amber-950 text-amber-300 border border-amber-800 font-semibold">{actionType}</span>;
    }
    return <span className="px-2 py-0.5 rounded text-[10px] bg-purple-950 text-purple-300 border border-purple-800 font-semibold">{actionType}</span>;
  };

  const filteredLogs = logs.filter(l => {
    if (filterAction && l.actionType !== filterAction) return false;
    if (filterUser && !l.username.toLowerCase().includes(filterUser.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-5 rounded-2xl">
        <div>
          <h2 className="text-xl font-extrabold text-slate-100 font-mono tracking-wide flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-400" /> SYSTEM AUDIT LOG LEDGER (`audit_logs`)
          </h2>
          <p className="text-xs text-slate-400 mt-1">Immutable security log storing user transactions, purchases, transfers, and security events.</p>
        </div>
        <button
          onClick={fetchAuditLogs}
          className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-2 rounded-xl text-xs font-mono border border-slate-700 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-indigo-400' : ''}`} />
          <span>Refresh Feed</span>
        </button>
      </div>

      {/* Filter controls */}
      <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center space-x-3">
          <input
            type="text"
            placeholder="Filter by Username..."
            value={filterUser}
            onChange={(e) => setFilterUser(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none"
          />
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200"
          >
            <option value="">All Action Types</option>
            <option value="PURCHASE_RECORDED">PURCHASE_RECORDED</option>
            <option value="TRANSFER_INITIATED">TRANSFER_INITIATED</option>
            <option value="TRANSFER_APPROVED">TRANSFER_APPROVED</option>
            <option value="ASSET_ASSIGNED">ASSET_ASSIGNED</option>
            <option value="ASSET_EXPENDED">ASSET_EXPENDED</option>
            <option value="LOGIN_SUCCESS">LOGIN_SUCCESS</option>
          </select>
        </div>
        <div className="text-slate-400">
          Total Recorded Events: <span className="text-slate-100 font-bold">{filteredLogs.length}</span>
        </div>
      </div>

      {/* Audit Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/60">
                <th className="py-3 px-4">Log ID</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Action Type</th>
                <th className="py-3 px-4">Entity</th>
                <th className="py-3 px-4">Details / Payload</th>
                <th className="py-3 px-4 text-right">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 text-slate-300">
                  <td className="py-3 px-4 font-bold text-slate-400">#{log.id}</td>
                  <td className="py-3 px-4 text-slate-400">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="py-3 px-4 font-bold text-slate-200 flex items-center gap-1">
                    <User className="w-3 h-3 text-indigo-400" /> {log.username}
                  </td>
                  <td className="py-3 px-4 text-slate-400">{log.userRole}</td>
                  <td className="py-3 px-4">{getActionBadge(log.actionType)}</td>
                  <td className="py-3 px-4 text-slate-300 font-semibold">{log.entityType} #{log.entityId || '-'}</td>
                  <td className="py-3 px-4 text-slate-300 font-sans max-w-md truncate" title={log.details}>
                    {log.details}
                  </td>
                  <td className="py-3 px-4 text-right text-slate-500">{log.ipAddress || '127.0.0.1'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
