import React, { useState, useContext } from 'react';
import { AuthContext, DEMO_USERS } from '../context/AuthContext';
import { Shield, KeyRound, CheckCircle2 } from 'lucide-react';

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
    rankTitle: 'Lieutenant',
    role: 'LOGISTICS_OFFICER',
    baseId: 1
  });

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(loginUsername, loginPassword);
    if (!result.success) {
      setError(result.message || 'Invalid credentials');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!regForm.username || !regForm.password || !regForm.fullName) {
      setError('Please fill in all required fields');
      return;
    }

    const result = await register({
      ...regForm,
      baseId: parseInt(regForm.baseId)
    });

    if (result.success) {
      setLoginUsername(regForm.username);
      setLoginPassword(regForm.password);
      setSuccessMessage(`Account for "${regForm.username}" registered successfully! Please sign in with your password.`);
      setIsRegister(false);
    } else {
      setError(result.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-xl bg-blue-600 text-white">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold">Military Asset Management</h1>
          <p className="text-xs text-slate-400 font-sans">Sign in to manage inventory and asset transfers</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-800 rounded-lg p-1 text-xs font-medium">
          <button
            type="button"
            onClick={() => { setIsRegister(false); setError(''); }}
            className={`flex-1 py-2 rounded-md transition ${!isRegister ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsRegister(true); setError(''); setSuccessMessage(''); }}
            className={`flex-1 py-2 rounded-md transition ${isRegister ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
          >
            Register
          </button>
        </div>

        {/* Success Notification */}
        {successMessage && (
          <div className="p-3 rounded-lg bg-emerald-950/90 border border-emerald-700 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Error Notification */}
        {error && (
          <div className="p-3 rounded-lg bg-red-900/50 border border-red-700 text-red-200 text-xs">
            {error}
          </div>
        )}

        {/* Forms */}
        {!isRegister ? (
          /* Sign In */
          <form onSubmit={handleLoginSubmit} className="bg-slate-800/80 border border-slate-700 p-6 rounded-xl space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 mb-1 font-medium">Username</label>
              <input
                type="text"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-blue-500"
                placeholder="Username"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-medium">Password</label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-blue-500"
                placeholder="Password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition cursor-pointer"
            >
              Sign In
            </button>
          </form>
        ) : (
          /* Register */
          <form onSubmit={handleRegisterSubmit} className="bg-slate-800/80 border border-slate-700 p-6 rounded-xl space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 mb-1 font-medium">Username *</label>
              <input
                type="text"
                value={regForm.username}
                onChange={(e) => setRegForm({ ...regForm, username: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-blue-500"
                placeholder="Choose username"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-medium">Full Name *</label>
              <input
                type="text"
                value={regForm.fullName}
                onChange={(e) => setRegForm({ ...regForm, fullName: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-blue-500"
                placeholder="Full name"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Rank / Title</label>
                <input
                  type="text"
                  value={regForm.rankTitle}
                  onChange={(e) => setRegForm({ ...regForm, rankTitle: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Role</label>
                <select
                  value={regForm.role}
                  onChange={(e) => setRegForm({ ...regForm, role: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-blue-500"
                >
                  <option value="LOGISTICS_OFFICER">Logistics Officer</option>
                  <option value="BASE_COMMANDER">Base Commander</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-medium">Assigned Base</label>
              <select
                value={regForm.baseId}
                onChange={(e) => setRegForm({ ...regForm, baseId: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-blue-500"
              >
                <option value={1}>Fort Alpha Central Command</option>
                <option value={2}>Forward Operating Base Bravo</option>
                <option value={3}>Naval Logistics Outpost Charlie</option>
                <option value={4}>Air Defense Garrison Delta</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-medium">Password *</label>
              <input
                type="password"
                value={regForm.password}
                onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-blue-500"
                placeholder="Set password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition cursor-pointer"
            >
              Create Account
            </button>
          </form>
        )}

        {/* Demo Accounts Panel */}
        <div className="bg-slate-800/50 border border-slate-700/60 p-4 rounded-xl space-y-3 text-xs">
          <div className="flex items-center space-x-2 font-medium text-slate-300">
            <KeyRound className="w-4 h-4 text-amber-400" />
            <span>Demo Accounts (Click to Test)</span>
          </div>

          <div className="space-y-2">
            {DEMO_USERS.map((demo) => (
              <button
                key={demo.username}
                onClick={() => demoLogin(demo.username)}
                className="w-full p-2.5 rounded-lg bg-slate-900 hover:bg-slate-700/60 border border-slate-700 text-left transition flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <div className="text-xs font-semibold text-slate-200 group-hover:text-blue-400 flex items-center gap-1.5">
                    <span>{demo.roleName}</span>
                    <span className="text-slate-400 font-normal">({demo.username})</span>
                  </div>
                  <div className="text-[11px] text-slate-400">{demo.fullName} &bull; {demo.baseName}</div>
                </div>
                <CheckCircle2 className="w-4 h-4 text-slate-500 group-hover:text-blue-400" />
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
