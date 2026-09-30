import React, { useContext } from 'react';
import { AuthContext, DEMO_USERS } from '../context/AuthContext';
import { Shield, UserCheck, Building2, LogOut, Radio, KeyRound } from 'lucide-react';

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
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-900 flex items-center justify-center shadow-lg shadow-blue-900/20 border border-blue-400/30">
          <Shield className="w-6 h-6 text-blue-200" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-base font-bold text-slate-100 tracking-wider font-mono uppercase">MIL-ASSET COMMAND</h1>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/80 font-mono">LIVE DEFENSE OS</span>
          </div>
          <p className="text-xs text-slate-400">Tactical Asset Management & Audit Platform</p>
        </div>
      </div>

      {/* Center - Demo Account Switcher Bar */}
      <div className="hidden lg:flex items-center space-x-2 bg-slate-950/80 p-1.5 rounded-lg border border-slate-800">
        <span className="text-xs text-slate-400 font-mono px-2 flex items-center gap-1">
          <KeyRound className="w-3.5 h-3.5 text-amber-400" /> Switch Role:
        </span>
        {DEMO_USERS.map((demo) => (
          <button
            key={demo.username}
            onClick={() => demoLogin(demo.username)}
            className={`text-xs px-2.5 py-1 rounded transition-all flex items-center space-x-1 font-mono ${
              user?.username === demo.username
                ? 'bg-blue-600 text-white font-semibold shadow'
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
        <div className="hidden md:flex items-center space-x-2 text-xs bg-slate-950/60 px-3 py-1.5 rounded-md border border-slate-800">
          <Building2 className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-slate-400">Scope:</span>
          <span className="text-slate-200 font-medium font-mono">{user?.baseName || 'Global Defense Network'}</span>
        </div>

        {/* User Role Badge */}
        <div className="flex items-center space-x-3">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-semibold text-slate-200">{user?.fullName || 'General Vance'}</div>
            <div className="text-[11px] text-slate-400 font-mono">{user?.rankTitle || 'Commander'}</div>
          </div>
          <span className={`text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full border shadow-sm ${getRoleBadgeStyle(user?.role)}`}>
            {user?.role?.replace('_', ' ') || 'ADMIN'}
          </span>
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          title="Sign Out"
          className="p-2 rounded-lg bg-slate-800/80 hover:bg-red-950/50 hover:text-red-400 hover:border-red-800/60 text-slate-400 border border-slate-700 transition"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
