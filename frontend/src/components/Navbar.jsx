import React, { useContext } from 'react';
import { AuthContext, DEMO_USERS } from '../context/AuthContext';
import { Shield, Building2, LogOut, KeyRound } from 'lucide-react';

export default function Navbar() {
  const { user, demoLogin, logout } = useContext(AuthContext);

  const getRoleBadgeStyle = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-950/80 text-purple-300 border-purple-700/60';
      case 'BASE_COMMANDER':
        return 'bg-amber-950/80 text-amber-300 border-amber-700/60';
      case 'LOGISTICS_OFFICER':
        return 'bg-cyan-950/80 text-cyan-300 border-cyan-700/60';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/95 backdrop-blur px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Brand Header */}
      <div className="flex items-center space-x-3">
        <div className="w-9 h-9 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
          <Shield className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-sm font-bold text-slate-100 tracking-tight">Military Asset Management System</h1>
            <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 font-medium">v1.0</span>
          </div>
          <p className="text-[11px] text-slate-400">Defense Inventory & Asset Tracking Platform</p>
        </div>
      </div>

      {/* Center - Role Switcher */}
      <div className="hidden lg:flex items-center space-x-2 bg-slate-950 p-1.5 rounded-lg border border-slate-800">
        <span className="text-xs text-slate-400 px-2 flex items-center gap-1 font-medium">
          <KeyRound className="w-3.5 h-3.5 text-amber-400" /> Switch Role:
        </span>
        {DEMO_USERS.map((demo) => (
          <button
            key={demo.username}
            onClick={() => demoLogin(demo.username)}
            className={`text-xs px-2.5 py-1 rounded transition-all flex items-center space-x-1 font-medium cursor-pointer ${
              user?.username === demo.username
                ? 'bg-blue-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <span>{demo.roleName}</span>
          </button>
        ))}
      </div>

      {/* Right User Status */}
      <div className="flex items-center space-x-4">
        {/* Base Scope indicator */}
        <div className="hidden md:flex items-center space-x-2 text-xs bg-slate-950 px-3 py-1.5 rounded-md border border-slate-800">
          <Building2 className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-slate-400">Location:</span>
          <span className="text-slate-200 font-medium">{user?.baseName || 'All Base Locations'}</span>
        </div>

        {/* User Role Badge */}
        <div className="flex items-center space-x-3">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-semibold text-slate-200">{user?.fullName || 'General Vance'}</div>
            <div className="text-[11px] text-slate-400">{user?.rankTitle || 'Commander'}</div>
          </div>
          <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border shadow-sm ${getRoleBadgeStyle(user?.role)}`}>
            {user?.role?.replace('_', ' ') || 'ADMIN'}
          </span>
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          title="Sign Out"
          className="p-2 rounded-lg bg-slate-800/80 hover:bg-red-950/50 hover:text-red-400 hover:border-red-800/60 text-slate-400 border border-slate-700 transition cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
