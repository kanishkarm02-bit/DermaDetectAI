import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ScanLine, Calendar, BookOpen, ArrowRight, Activity, Sun, Trophy, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { useGamification } from '@/hooks/useGamification';
import { useAuth } from '@/context/AuthContext';
import { WeatherWidget } from '@/components/WeatherWidget';

export default function Home() {
  const { progress } = useGamification();
  const { user } = useAuth();
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('derma_history') || '[]');
    // Get last 2 items, reversed to show newest first
    setRecentActivity(history.reverse().slice(0, 2));
  }, []);

  const dailyTip = {
    title: "Did you know?",
    content: "UV rays can penetrate clouds and glass. Wearing sunscreen daily, even when indoors or on cloudy days, is your best defense against premature aging.",
    icon: Sun
  };

  return (
    <div className="space-y-12 py-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 space-y-6 text-center md:text-left">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-sm font-medium"
            >
              <Activity size={14} />
              <span>AI-Powered Skin Analysis</span>
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              Welcome, <span className="text-teal-400">{user?.name}</span>
            </h1>
            <p className="text-lg text-slate-400 max-w-xl">
              Monitor your skin health with advanced AI technology. Track changes, learn about conditions, and maintain a healthy routine.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <Link 
                to="/analyze" 
                className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3.5 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg shadow-teal-900/20 hover:scale-105"
              >
                <ScanLine size={20} />
                Start New Scan
              </Link>
              <Link 
                to="/daily-tracking" 
                className="bg-slate-700 hover:bg-slate-600 text-white px-8 py-3.5 rounded-xl font-semibold flex items-center gap-2 transition-all border border-slate-600 hover:border-slate-500"
              >
                <Calendar size={20} />
                Log Daily
              </Link>
            </div>
          </div>

          {/* Stats Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-full md:w-80 bg-slate-950/50 backdrop-blur-md border border-slate-700 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-slate-200 font-semibold">Your Progress</h3>
              <Trophy className="text-amber-400" size={20} />
            </div>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">Current Level</span>
                  <span className="text-white font-bold">{progress.level}</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-1000" 
                    style={{ width: `${(progress.xp % 100)}%` }} // Simplified progress calc for demo
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800/50 rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-white">{progress.streak}</div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider">Day Streak</div>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-white">{progress.xp}</div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider">Total XP</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Actions Grid */}
      <section className="grid md:grid-cols-3 gap-6">
        <Link to="/analyze" className="group bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-teal-500/50 transition-all hover:shadow-lg hover:shadow-teal-900/10">
          <div className="w-12 h-12 bg-teal-500/10 rounded-xl flex items-center justify-center text-teal-500 mb-4 group-hover:scale-110 transition-transform">
            <ScanLine size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-100 mb-2">Analyze Skin</h3>
          <p className="text-slate-400 text-sm mb-4">Upload a photo to detect potential skin conditions instantly.</p>
          <div className="flex items-center text-teal-500 text-sm font-medium">
            Scan Now <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link to="/daily-tracking" className="group bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-indigo-500/50 transition-all hover:shadow-lg hover:shadow-indigo-900/10">
          <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-500 mb-4 group-hover:scale-110 transition-transform">
            <Calendar size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-100 mb-2">Daily Tracker</h3>
          <p className="text-slate-400 text-sm mb-4">Log your daily skin condition and build healthy habits.</p>
          <div className="flex items-center text-indigo-500 text-sm font-medium">
            Track Today <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link to="/resources" className="group bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-amber-500/50 transition-all hover:shadow-lg hover:shadow-amber-900/10">
          <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500 mb-4 group-hover:scale-110 transition-transform">
            <BookOpen size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-100 mb-2">Learn</h3>
          <p className="text-slate-400 text-sm mb-4">Explore educational resources about skin health.</p>
          <div className="flex items-center text-amber-500 text-sm font-medium">
            Read More <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </section>

      {/* Daily Tip & Recent Activity */}
      <section className={`grid gap-8 ${recentActivity.length > 0 ? 'md:grid-cols-2' : 'max-w-2xl mx-auto'}`}>
        <div className="space-y-6">
          {/* Weather Widget */}
          {user?.city && <WeatherWidget city={user.city} />}

          <div className="bg-gradient-to-br from-orange-500/10 to-rose-500/10 border border-orange-500/20 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-orange-500/20 rounded-lg text-orange-400">
                <dailyTip.icon size={20} />
              </div>
              <h3 className="text-lg font-bold text-orange-100">Daily Tip</h3>
            </div>
            <p className="text-orange-200/80 leading-relaxed">
              {dailyTip.content}
            </p>
          </div>
        </div>

        {recentActivity.length > 0 && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <Clock size={18} className="text-slate-500" />
                Recent Activity
              </h3>
              <Link to="/history" className="text-xs text-teal-400 hover:text-teal-300">View All</Link>
            </div>
            
            <div className="space-y-4">
              {recentActivity.map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-3 bg-slate-950/50 rounded-xl border border-slate-800/50">
                  <div className="w-10 h-10 bg-teal-500/10 rounded-lg flex items-center justify-center text-teal-500">
                    <ScanLine size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-200 truncate">{item.condition}</div>
                    <div className="text-xs text-slate-500">{new Date(item.date).toLocaleDateString()}</div>
                  </div>
                  <div className={`text-xs font-medium px-2 py-1 rounded ${
                    item.riskLevel === 'High' ? 'text-rose-400 bg-rose-500/10' :
                    item.riskLevel === 'Medium' ? 'text-amber-400 bg-amber-500/10' :
                    'text-emerald-400 bg-emerald-500/10'
                  }`}>
                    {item.riskLevel}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
