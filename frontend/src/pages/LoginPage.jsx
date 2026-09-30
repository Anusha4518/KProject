import React, { useState, useContext } from 'react';
import { AuthContext, DEMO_USERS } from '../context/AuthContext';
import { Shield, KeyRound, Lock, User, CheckCircle2, UserPlus, LogIn, Building2, BadgeCheck } from 'lucide-react';

export default function LoginPage() {
  const { login, register, demoLogin } = useContext(AuthContext);
  const [isRegister, setIsRegister] = useState(false);

  // Login form state
  const [loginUsername, setLoginUsername] = useState('admin');
  const [loginPassword, setLoginPassword] = useState('admin123');

  // Register form state
  const [regForm, setRegForm] = useState({
    username: '',
    password: '',
    fullName: '',
    rankTitle: 'Lieutenant (O-2)',
    role: 'LOGISTICS_OFFICER',
    baseId: 1,
    email: ''
  });

  const [error, setError] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(loginUsername, loginPassword);
    if (!result.success) {
      setError(result.message || 'Invalid military credentials');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!regForm.username || !regForm.password || !regForm.fullName) {
      setError('Please fill in all required fields');
      return;
    }
    const result = await register({
      ...regForm,
      baseId: parseInt(regForm.baseId)
    });
    if (!result.success) {
      setError(result.message || 'Registration failed');
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

        {/* Auth Mode Toggle Tabs */}
        <div className="flex bg-slate-900/90 border border-slate-800 rounded-xl p-1 font-mono text-xs shadow-lg">
          <button
            type="button"
            onClick={() => { setIsRegister(false); setError(''); }}
            className={`flex-1 py-2 rounded-lg font-bold transition flex items-center justify-center space-x-2 ${
              !isRegister
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>AUTHENTICATE / SIGN IN</span>
          </button>
          <button
            type="button"
            onClick={() => { setIsRegister(true); setError(''); }}
            className={`flex-1 py-2 rounded-lg font-bold transition flex items-center justify-center space-x-2 ${
              isRegister
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>REGISTER PERSONNEL</span>
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3 rounded-lg bg-red-950/80 border border-red-800 text-red-300 text-xs font-mono">
            {error}
          </div>
        )}

        {/* Form Container */}
        {!isRegister ? (
          /* Sign In Form */
          <form onSubmit={handleLoginSubmit} className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-2xl space-y-4 font-mono">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Username / Military ID</label>
              <div className="flex items-center space-x-2 bg-slate-950 border border-slate-800 px-3 py-2 rounded-lg">
                <User className="w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  className="w-full bg-transparent text-xs text-slate-200 focus:outline-none"
                  placeholder="Enter username (e.g. admin)"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Passcode / Key</label>
              <div className="flex items-center space-x-2 bg-slate-950 border border-slate-800 px-3 py-2 rounded-lg">
                <Lock className="w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full bg-transparent text-xs text-slate-200 focus:outline-none"
                  placeholder="Enter password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-950/50 transition cursor-pointer"
            >
              AUTHENTICATE &amp; SIGN IN
            </button>
          </form>
        ) : (
          /* Registration Form */
          <form onSubmit={handleRegisterSubmit} className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-2xl space-y-4 font-mono">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Username / Security Handle *</label>
              <div className="flex items-center space-x-2 bg-slate-950 border border-slate-800 px-3 py-2 rounded-lg">
                <User className="w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={regForm.username}
                  onChange={(e) => setRegForm({ ...regForm, username: e.target.value })}
                  className="w-full bg-transparent text-xs text-slate-200 focus:outline-none"
                  placeholder="e.g. officer_delta"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Full Name &amp; Designation *</label>
              <div className="flex items-center space-x-2 bg-slate-950 border border-slate-800 px-3 py-2 rounded-lg">
                <BadgeCheck className="w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={regForm.fullName}
                  onChange={(e) => setRegForm({ ...regForm, fullName: e.target.value })}
                  className="w-full bg-transparent text-xs text-slate-200 focus:outline-none"
                  placeholder="e.g. Lt. Arthur Pendelton"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Rank Title</label>
                <input
                  type="text"
                  value={regForm.rankTitle}
                  onChange={(e) => setRegForm({ ...regForm, rankTitle: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 px-3 py-2 rounded-lg text-xs text-slate-200"
                  placeholder="e.g. Captain (O-3)"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Assigned Role</label>
                <select
                  value={regForm.role}
                  onChange={(e) => setRegForm({ ...regForm, role: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 px-3 py-2 rounded-lg text-xs text-slate-200"
                >
                  <option value="LOGISTICS_OFFICER">Logistics Officer</option>
                  <option value="BASE_COMMANDER">Base Commander</option>
                  <option value="ADMIN">System Admin</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Assigned Military Base</label>
              <div className="flex items-center space-x-2 bg-slate-950 border border-slate-800 px-3 py-2 rounded-lg">
                <Building2 className="w-4 h-4 text-slate-500" />
                <select
                  value={regForm.baseId}
                  onChange={(e) => setRegForm({ ...regForm, baseId: e.target.value })}
                  className="w-full bg-transparent text-xs text-slate-200 focus:outline-none"
                >
                  <option value={1} className="bg-slate-900">Fort Alpha Central Command</option>
                  <option value={2} className="bg-slate-900">Forward Operating Base Bravo</option>
                  <option value={3} className="bg-slate-900">Naval Logistics Outpost Charlie</option>
                  <option value={4} className="bg-slate-900">Air Defense Garrison Delta</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Password *</label>
              <div className="flex items-center space-x-2 bg-slate-950 border border-slate-800 px-3 py-2 rounded-lg">
                <Lock className="w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  value={regForm.password}
                  onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                  className="w-full bg-transparent text-xs text-slate-200 focus:outline-none"
                  placeholder="Set password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-950/50 transition cursor-pointer"
            >
              REGISTER PERSONNEL &amp; SIGN IN
            </button>
          </form>
        )}

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
                className="w-full p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition flex items-center justify-between group cursor-pointer"
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
