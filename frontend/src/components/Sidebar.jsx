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
    <aside className="w-56 bg-white border-r border-slate-200 p-4 flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)] shadow-sm">
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
                    ? 'bg-blue-600 text-white shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
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
      <div className="text-[11px] text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-200 font-sans">
        Role: <span className="font-semibold text-slate-800">{user?.role?.replace('_', ' ')}</span>
      </div>
    </aside>
  );
}
