import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, ShoppingCart, ArrowLeftRight, UserCheck, History } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const { user } = useContext(AuthContext);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard, roles: ['ADMIN', 'BASE_COMMANDER', 'LOGISTICS_OFFICER'] },
    { id: 'purchases', label: 'Asset Purchases', icon: ShoppingCart, roles: ['ADMIN', 'BASE_COMMANDER', 'LOGISTICS_OFFICER'] },
    { id: 'transfers', label: 'Inter-Base Transfers', icon: ArrowLeftRight, roles: ['ADMIN', 'BASE_COMMANDER', 'LOGISTICS_OFFICER'] },
    { id: 'assignments', label: 'Personnel Assignments', icon: UserCheck, roles: ['ADMIN', 'BASE_COMMANDER', 'LOGISTICS_OFFICER'] },
    { id: 'audit-logs', label: 'Audit Log Trail', icon: History, roles: ['ADMIN', 'BASE_COMMANDER'] },
  ];

  return (
    <aside className="w-64 bg-slate-900/80 border-r border-slate-800 p-4 flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        <div className="px-3 py-2">
          <p className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Navigation Modules</p>
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
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40 shadow-sm'
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

      {/* Footer Status Card */}
      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
        <div className="flex items-center space-x-2 text-xs text-emerald-400 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Database &amp; Server Connected</span>
        </div>
        <div className="text-[11px] text-slate-400">
          User Role: <span className="font-semibold text-slate-300">{user?.role}</span>
        </div>
      </div>
    </aside>
  );
}
