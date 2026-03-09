/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { Shield, Activity, Stethoscope, History as HistoryIcon, Info as InfoIcon, Home as HomeIcon, Calendar, BookOpen, ScanLine, Settings as SettingsIcon } from 'lucide-react';
import { motion } from 'motion/react';
import Home from '@/pages/Home';
import Analyze from '@/pages/Analyze';
import History from '@/pages/History';
import About from '@/pages/About';
import DailyTracking from '@/pages/DailyTracking';
import Resources from '@/pages/Resources';
import Settings from '@/pages/Settings';
import Login from '@/pages/Login';
import { LevelBadge } from '@/components/LevelBadge';
import { AuthProvider, useAuth } from '@/context/AuthContext';

function NavLink({ to, icon: Icon, label }: { to: string, icon: any, label: string }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
        isActive 
          ? 'bg-teal-500/10 text-teal-400 font-medium' 
          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
      }`}
    >
      <Icon size={18} />
      <span className="hidden md:inline">{label}</span>
    </Link>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" />;
  return <>{children}</>;
}

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [hasAcceptedDisclaimer, setHasAcceptedDisclaimer] = useState(false);

  if (!hasAcceptedDisclaimer) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-slate-900 rounded-2xl shadow-2xl p-8 border border-slate-800"
        >
          <div className="w-16 h-16 bg-teal-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-teal-500">
            <Shield size={32} />
          </div>
          <h1 className="text-2xl font-bold text-center text-slate-100 mb-4">Medical Disclaimer</h1>
          <p className="text-slate-400 text-center mb-6 leading-relaxed">
            DermaDetect AI uses artificial intelligence to analyze images but <strong>cannot provide a medical diagnosis</strong>.
          </p>
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 mb-6">
            <p className="text-sm text-amber-400 font-medium flex gap-2">
              <Activity size={16} className="shrink-0 mt-0.5" />
              Always consult a certified dermatologist for any skin concerns.
            </p>
          </div>
          <button
            onClick={() => setHasAcceptedDisclaimer(true)}
            className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold transition-colors shadow-lg shadow-teal-900/20"
          >
            I Understand & Accept
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 selection:bg-teal-500/30 flex flex-col">
      {isAuthenticated && (
        <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-2 text-teal-500 hover:opacity-90 transition-opacity shrink-0">
              <Stethoscope size={24} />
              <span className="font-bold text-xl tracking-tight text-slate-100 hidden sm:inline">DermaDetect</span>
            </Link>
            
            <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar py-2 flex-1 justify-center">
              <NavLink to="/" icon={HomeIcon} label="Home" />
              <NavLink to="/analyze" icon={ScanLine} label="Scan" />
              <NavLink to="/daily-tracking" icon={Calendar} label="Track" />
              <NavLink to="/resources" icon={BookOpen} label="Learn" />
            </nav>

            <div className="hidden sm:flex items-center gap-4 shrink-0">
              <LevelBadge />
              <Link to="/settings" className="text-slate-400 hover:text-white transition-colors">
                <SettingsIcon size={20} />
              </Link>
            </div>
          </div>
        </header>
      )}

      <main className="flex-1 w-full">
        <div className={isAuthenticated ? "max-w-6xl mx-auto px-4" : ""}>
          <Routes>
            <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
            
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/analyze" element={<ProtectedRoute><Analyze /></ProtectedRoute>} />
            <Route path="/daily-tracking" element={<ProtectedRoute><DailyTracking /></ProtectedRoute>} />
            <Route path="/resources" element={<ProtectedRoute><Resources /></ProtectedRoute>} />
            <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
          </Routes>
        </div>
      </main>

      {isAuthenticated && (
        <footer className="py-8 text-center text-slate-600 text-sm border-t border-slate-900 mt-12 bg-slate-950">
          <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <p>© {new Date().getFullYear()} DermaDetect AI. Educational Purpose Only.</p>
            <div className="flex gap-6">
              <Link to="/about" className="hover:text-slate-400 transition-colors">About</Link>
              <Link to="/resources" className="hover:text-slate-400 transition-colors">Resources</Link>
              <Link to="/settings" className="hover:text-slate-400 transition-colors">Settings</Link>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}
