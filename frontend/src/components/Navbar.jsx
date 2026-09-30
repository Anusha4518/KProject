import React, { useContext } from 'react';
import { AuthContext, DEMO_USERS } from '../context/AuthContext';
import { Shield, Building2, LogOut, KeyRound } from 'lucide-react';

export default function Navbar() {
  const { user, demoLogin, logout } = useContext(AuthContext);

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900 px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Brand */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
          <Shield className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-slate-100">Military Asset Management</h1>
          <p className="text-[11px] text-slate-400">Inventory & Logistics Portal</p>
        </div>
      </div>

      {/* Demo Role Switcher */}
      <div className="hidden lg:flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
        <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
          <KeyRound className="w-3.5 h-3.5 text-amber-400" /> Role:
        </span>
        {DEMO_USERS.map((demo) => (
          <button
            key={demo.username}
            onClick={() => demoLogin(demo.username)}
            className={`text-xs px-2.5 py-1 rounded transition cursor-pointer font-medium ${
              user?.username === demo.username
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {demo.roleName}
          </button>
        ))}
      </div>

      {/* User Info & Logout */}
      <div className="flex items-center space-x-4">
        <div className="hidden md:flex items-center space-x-2 text-xs text-slate-400 bg-slate-800/60 px-3 py-1.5 rounded-md border border-slate-700">
          <Building2 className="w-3.5 h-3.5 text-blue-400" />
          <span>{user?.baseName || 'All Base Locations'}</span>
        </div>

        <div className="text-right hidden sm:block text-xs">
          <div className="font-semibold text-slate-200">{user?.fullName || 'User'}</div>
          <div className="text-[11px] text-slate-400">{user?.role?.replace('_', ' ')}</div>
        </div>

        <button
          onClick={logout}
          title="Sign Out"
          className="p-2 rounded-lg bg-slate-800 hover:bg-red-900/40 hover:text-red-300 text-slate-400 border border-slate-700 transition cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
