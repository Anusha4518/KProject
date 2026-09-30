import React, { useState, useContext } from 'react';
import { AuthContext, DEMO_USERS } from '../context/AuthContext';
import { Shield, KeyRound, Lock, User, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const { login, demoLogin } = useContext(AuthContext);
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(username, password);
    if (!result.success) {
      setError(result.message || 'Invalid military credentials');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glowing effects */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Logo header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-900 shadow-xl shadow-blue-950/50 border border-blue-400/30">
            <Shield className="w-8 h-8 text-blue-100" />
          </div>
          <h1 className="text-2xl font-black text-slate-100 font-mono tracking-wider uppercase">MIL-ASSET SYSTEM</h1>
          <p className="text-xs text-slate-400 font-mono">Restricted Access Defense Asset Logistics Platform</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-2xl space-y-4 font-mono">
          {error && (
            <div className="p-3 rounded-lg bg-red-950/80 border border-red-800 text-red-300 text-xs">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs text-slate-400 mb-1">Username / ID</label>
            <div className="flex items-center space-x-2 bg-slate-950 border border-slate-800 px-3 py-2 rounded-lg">
              <User className="w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-transparent text-xs text-slate-200 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Password</label>
            <div className="flex items-center space-x-2 bg-slate-950 border border-slate-800 px-3 py-2 rounded-lg">
              <Lock className="w-4 h-4 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent text-xs text-slate-200 focus:outline-none"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-950/50 transition"
          >
            AUTHENTICATE &amp; SIGN IN
          </button>
        </form>

        {/* Quick One-Click Demo Logins */}
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl space-y-3 font-mono">
          <div className="flex items-center space-x-1 text-xs font-semibold text-slate-400">
            <KeyRound className="w-3.5 h-3.5 text-amber-400" />
            <span>INSTANT DEMO EVALUATION LOGINS</span>
          </div>

          <div className="space-y-2">
            {DEMO_USERS.map((demo) => (
              <button
                key={demo.username}
                onClick={() => demoLogin(demo.username)}
                className="w-full p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-bold text-slate-200 group-hover:text-blue-400 flex items-center gap-1.5">
                    <span>{demo.roleName}</span>
                    <span className="text-[10px] text-slate-500 font-normal">({demo.username})</span>
                  </div>
                  <div className="text-[11px] text-slate-400">{demo.fullName} &bull; {demo.baseName}</div>
                </div>
                <CheckCircle2 className="w-4 h-4 text-slate-600 group-hover:text-blue-400" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
