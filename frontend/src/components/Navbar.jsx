import React, { useContext } from 'react';
import { AuthContext, DEMO_USERS } from '../context/AuthContext';
import { Shield, Building2, LogOut, KeyRound } from 'lucide-react';

export default function Navbar() {
  const { user, demoLogin, logout } = useContext(AuthContext);

  return (
    <header className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between sticky top-0 z-40 shadow-sm">
      {/* Brand */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
          <Shield className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-slate-900">Military Asset Management</h1>
          <p className="text-[11px] text-slate-500 font-sans">Inventory &amp; Logistics Portal</p>
        </div>
      </div>

      {/* Demo Role Switcher */}
      <div className="hidden lg:flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
        <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
          <KeyRound className="w-3.5 h-3.5 text-amber-500" /> Role:
        </span>
        {DEMO_USERS.map((demo) => (
          <button
            key={demo.username}
            onClick={() => demoLogin(demo.username)}
            className={`text-xs px-2.5 py-1 rounded transition cursor-pointer font-medium ${
              user?.username === demo.username
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            {demo.roleName}
          </button>
        ))}
      </div>

      {/* User Info & Logout */}
      <div className="flex items-center space-x-4">
        <div className="hidden md:flex items-center space-x-2 text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-md border border-slate-200">
          <Building2 className="w-3.5 h-3.5 text-blue-600" />
          <span>{user?.baseName || 'All Base Locations'}</span>
        </div>

        <div className="text-right hidden sm:block text-xs">
          <div className="font-semibold text-slate-800">{user?.fullName || 'User'}</div>
          <div className="text-[11px] text-slate-500">{user?.role?.replace('_', ' ')}</div>
        </div>

        <button
          onClick={logout}
          title="Sign Out"
          className="p-2 rounded-lg bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-500 border border-slate-200 transition cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
