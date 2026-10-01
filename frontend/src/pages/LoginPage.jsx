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
    <div className="min-h-screen bg-white text-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-xl bg-blue-600 text-white shadow-sm">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">Military Asset Management</h1>
          <p className="text-xs text-slate-500 font-sans">Sign in to manage inventory and asset transfers</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-200 rounded-lg p-1 text-xs font-medium border border-slate-300">
          <button
            type="button"
            onClick={() => { setIsRegister(false); setError(''); }}
            className={`flex-1 py-2 rounded-md transition ${!isRegister ? 'bg-white text-blue-600 font-semibold shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsRegister(true); setError(''); setSuccessMessage(''); }}
            className={`flex-1 py-2 rounded-md transition ${isRegister ? 'bg-white text-blue-600 font-semibold shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Register
          </button>
        </div>

        {/* Success Notification */}
        {successMessage && (
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-center gap-2 shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Error Notification */}
        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-300 text-red-700 text-xs shadow-sm">
            {error}
          </div>
        )}

        {/* Forms */}
        {!isRegister ? (
          /* Sign In */
          <form onSubmit={handleLoginSubmit} className="bg-white border border-slate-200 p-6 rounded-xl space-y-4 text-xs shadow-sm">
            <div>
              <label className="block text-slate-700 mb-1 font-medium">Username</label>
              <input
                type="text"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                placeholder="Username"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 mb-1 font-medium">Password</label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                placeholder="Password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs transition cursor-pointer shadow-sm"
            >
              Sign In
            </button>
          </form>
        ) : (
          /* Register */
          <form onSubmit={handleRegisterSubmit} className="bg-white border border-slate-200 p-6 rounded-xl space-y-4 text-xs shadow-sm">
            <div>
              <label className="block text-slate-700 mb-1 font-medium">Username *</label>
              <input
                type="text"
                value={regForm.username}
                onChange={(e) => setRegForm({ ...regForm, username: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                placeholder="Choose username"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 mb-1 font-medium">Full Name *</label>
              <input
                type="text"
                value={regForm.fullName}
                onChange={(e) => setRegForm({ ...regForm, fullName: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                placeholder="Full name"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 mb-1 font-medium">Rank / Title</label>
                <input
                  type="text"
                  value={regForm.rankTitle}
                  onChange={(e) => setRegForm({ ...regForm, rankTitle: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-medium">Role</label>
                <select
                  value={regForm.role}
                  onChange={(e) => setRegForm({ ...regForm, role: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                >
                  <option value="LOGISTICS_OFFICER">Logistics Officer</option>
                  <option value="BASE_COMMANDER">Base Commander</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 mb-1 font-medium">Assigned Base</label>
              <select
                value={regForm.baseId}
                onChange={(e) => setRegForm({ ...regForm, baseId: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
              >
                <option value={1}>Fort Alpha Central Command</option>
                <option value={2}>Forward Operating Base Bravo</option>
                <option value={3}>Naval Logistics Outpost Charlie</option>
                <option value={4}>Air Defense Garrison Delta</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 mb-1 font-medium">Password *</label>
              <input
                type="password"
                value={regForm.password}
                onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                placeholder="Set password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs transition cursor-pointer shadow-sm"
            >
              Create Account
            </button>
          </form>
        )}

        {/* Demo Accounts Panel */}
        <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-3 text-xs shadow-sm">
          <div className="flex items-center space-x-2 font-medium text-slate-700">
            <KeyRound className="w-4 h-4 text-amber-500" />
            <span>Demo Accounts (Click to Test)</span>
          </div>

          <div className="space-y-2">
            {DEMO_USERS.map((demo) => (
              <button
                key={demo.username}
                onClick={() => demoLogin(demo.username)}
                className="w-full p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <div className="text-xs font-semibold text-slate-800 group-hover:text-blue-600 flex items-center gap-1.5">
                    <span>{demo.roleName}</span>
                    <span className="text-slate-500 font-normal">({demo.username})</span>
                  </div>
                  <div className="text-[11px] text-slate-500">{demo.fullName} &bull; {demo.baseName}</div>
                </div>
                <CheckCircle2 className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
