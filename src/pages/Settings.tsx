import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'motion/react';
import { Bell, Moon, Shield, Database, Trash2, LogOut, Save, Smartphone, User, Mail, ChevronRight } from 'lucide-react';

export default function Settings() {
  const { user, updateSettings, logout } = useAuth();
  const [notificationTime, setNotificationTime] = useState(user?.settings.notificationTime || '09:00');
  const [notificationsEnabled, setNotificationsEnabled] = useState(user?.settings.notifications || false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  const handleSave = () => {
    updateSettings({
      notifications: notificationsEnabled,
      notificationTime,
    });
    
    // Request notification permission if enabled
    if (notificationsEnabled && 'Notification' in window) {
      Notification.requestPermission();
    }

    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 2000);
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all local data? This cannot be undone.')) {
      localStorage.removeItem('derma_history');
      localStorage.removeItem('derma_gamification');
      window.location.reload();
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <p className="text-slate-400">Manage your preferences and account</p>
        </div>
        <button 
          onClick={logout}
          className="flex items-center gap-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 px-4 py-2 rounded-lg transition-colors"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>

      {/* Profile Section */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <User className="text-teal-500" size={20} />
            Profile
          </h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-white font-medium text-lg">{user?.name}</h3>
              <p className="text-slate-500 text-sm">Standard Account</p>
            </div>
          </div>
        </div>
      </section>

      {/* Notifications Section */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Bell className="text-teal-500" size={20} />
            Notifications
          </h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-slate-200 font-medium block">Daily Reminders</label>
              <p className="text-slate-500 text-sm">Get reminded to scan your skin</p>
            </div>
            <button
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                notificationsEnabled ? 'bg-teal-600' : 'bg-slate-700'
              }`}
            >
              <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                notificationsEnabled ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </button>
          </div>

          {notificationsEnabled && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="pt-4 border-t border-slate-800"
            >
              <label className="text-slate-200 font-medium block mb-2">Reminder Time</label>
              <input
                type="time"
                value={notificationTime}
                onChange={(e) => setNotificationTime(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-teal-500 focus:outline-none"
              />
            </motion.div>
          )}
        </div>
      </section>

      {/* App Preferences */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Smartphone className="text-teal-500" size={20} />
            App Preferences
          </h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <Moon size={18} className="text-slate-400" />
              <span className="text-slate-200">Dark Mode</span>
            </div>
            <span className="text-slate-500 text-sm">Always On</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <Database size={18} className="text-slate-400" />
              <span className="text-slate-200">Data Saver</span>
            </div>
            <button className="w-12 h-6 bg-slate-700 rounded-full relative">
              <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full" />
            </button>
          </div>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="bg-slate-900 border border-rose-900/30 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-rose-900/30 bg-rose-950/10">
          <h2 className="text-lg font-semibold text-rose-400 flex items-center gap-2">
            <Shield className="text-rose-500" size={20} />
            Danger Zone
          </h2>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-slate-200 font-medium">Clear All Data</h3>
              <p className="text-slate-500 text-sm">Delete all history, progress, and settings</p>
            </div>
            <button 
              onClick={handleClearData}
              className="flex items-center gap-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 px-4 py-2 rounded-lg transition-colors border border-rose-500/20"
            >
              <Trash2 size={18} />
              Clear Data
            </button>
          </div>
        </div>
      </section>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg shadow-teal-900/20 flex items-center gap-2 transition-all active:scale-95"
        >
          <Save size={20} />
          {showSaveSuccess ? 'Saved!' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
