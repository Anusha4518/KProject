import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, ShoppingCart, ArrowLeftRight, UserCheck, History } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const { user } = useContext(AuthContext);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'BASE_COMMANDER', 'LOGISTICS_OFFICER'] },
    { id: 'purchases', label: 'Purchases', icon: ShoppingCart, roles: ['ADMIN', 'BASE_COMMANDER', 'LOGISTICS_OFFICER'] },
    { id: 'transfers', label: 'Transfers', icon: ArrowLeftRight, roles: ['ADMIN', 'BASE_COMMANDER', 'LOGISTICS_OFFICER'] },
    { id: 'assignments', label: 'Assignments & Usage', icon: UserCheck, roles: ['ADMIN', 'BASE_COMMANDER', 'LOGISTICS_OFFICER'] },
    { id: 'audit-logs', label: 'Audit Logs', icon: History, roles: ['ADMIN', 'BASE_COMMANDER'] },
  ];

  return (
    <aside className="w-56 bg-slate-900 border-r border-slate-800 p-4 flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="space-y-4">
        <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold px-2">Navigation</p>

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
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-medium transition cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="text-[11px] text-slate-400 bg-slate-800/50 p-3 rounded-lg border border-slate-800">
        Role: <span className="font-semibold text-slate-200">{user?.role?.replace('_', ' ')}</span>
      </div>
    </aside>
  );
}
