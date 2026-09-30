import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, ShoppingCart, ArrowLeftRight, UserCheck, History, ShieldAlert } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const { user } = useContext(AuthContext);

  const navItems = [
    { id: 'dashboard', label: 'Command Dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'BASE_COMMANDER', 'LOGISTICS_OFFICER'] },
    { id: 'purchases', label: 'Asset Purchases', icon: ShoppingCart, roles: ['ADMIN', 'BASE_COMMANDER', 'LOGISTICS_OFFICER'] },
    { id: 'transfers', label: 'Asset Transfers', icon: ArrowLeftRight, roles: ['ADMIN', 'BASE_COMMANDER', 'LOGISTICS_OFFICER'] },
    { id: 'assignments', label: 'Assignments & Usage', icon: UserCheck, roles: ['ADMIN', 'BASE_COMMANDER', 'LOGISTICS_OFFICER'] },
    { id: 'audit-logs', label: 'System Audit Logs', icon: History, roles: ['ADMIN', 'BASE_COMMANDER'] },
  ];

  return (
    <aside className="w-64 bg-slate-900/80 border-r border-slate-800 p-4 flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        <div className="px-3 py-2">
          <p className="text-[10px] uppercase font-mono tracking-widest text-slate-400">Tactical Modules</p>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isAllowed = item.roles.includes(user?.role || 'ADMIN');
            if (!isAllowed) return null;

            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40 shadow-sm shadow-blue-900/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer System Status Card */}
      <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 space-y-2">
        <div className="flex items-center space-x-2 text-xs text-emerald-400 font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>SYSTEM ONLINE</span>
        </div>
        <div className="text-[11px] text-slate-400">
          Enforcing Scope: <span className="font-mono text-slate-300">{user?.role}</span>
        </div>
      </div>
    </aside>
  );
}
