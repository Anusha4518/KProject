import React, { useState, useContext } from 'react';
import { AuthContext, AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import PurchasesPage from './pages/PurchasesPage';
import TransfersPage from './pages/TransfersPage';
import AssignmentsPage from './pages/AssignmentsPage';
import AuditLogsPage from './pages/AuditLogsPage';
import LoginPage from './pages/LoginPage';

function MainContent() {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 p-6 overflow-y-auto max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'purchases' && <PurchasesPage />}
          {activeTab === 'transfers' && <TransfersPage />}
          {activeTab === 'assignments' && <AssignmentsPage />}
          {activeTab === 'audit-logs' && <AuditLogsPage />}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}
