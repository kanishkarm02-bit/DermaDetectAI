import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, CheckCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TaskList } from '@/components/TaskList';
import { Task } from '@/types/Task';
import { useAuth } from '@/context/AuthContext';

interface DailyLog {
  date: string;
  completed: boolean;
  condition?: string;
  riskLevel?: string;
}

export default function DailyTracking() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [streak, setStreak] = useState(0);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    // Simulate loading logs from local storage or generating dummy data
    const history = JSON.parse(localStorage.getItem('derma_history') || '[]');
    
    // Process history into daily logs
    const processedLogs: DailyLog[] = history.map((item: any) => ({
      date: item.date.split('T')[0],
      completed: true,
      condition: item.condition,
      riskLevel: item.riskLevel
    }));

    setLogs(processedLogs);
    calculateStreak(processedLogs);

    // Load tasks from local storage
    const savedTasks = JSON.parse(localStorage.getItem('derma_tasks') || '[]');
    setTasks(savedTasks);
  }, []);

  const calculateStreak = (data: DailyLog[]) => {
    // Simple streak calculation logic
    // In a real app, this would check consecutive days
    setStreak(data.length > 0 ? Math.min(data.length, 5) : 0); 
  };

  const handleAddTask = (title: string, dueDate?: string) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      completed: false,
      dueDate,
      userId: user?.name || 'guest',
      createdAt: new Date().toISOString()
    };
    
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    localStorage.setItem('derma_tasks', JSON.stringify(updatedTasks));
  };

  const handleToggleTask = (id: string) => {
    const updatedTasks = tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    localStorage.setItem('derma_tasks', JSON.stringify(updatedTasks));
  };

  const handleDeleteTask = (id: string) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
    localStorage.setItem('derma_tasks', JSON.stringify(updatedTasks));
  };

  const today = new Date().toISOString().split('T')[0];
  const hasScannedToday = logs.some(log => log.date === today);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 mb-2">Daily Tracking</h1>
          <p className="text-slate-400">Consistency is key to healthy skin.</p>
        </div>
        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 text-center min-w-[120px]">
          <div className="text-3xl font-bold text-teal-400">{streak}</div>
          <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Day Streak</div>
        </div>
      </div>

      {/* Today's Status */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-6 rounded-2xl border ${
          hasScannedToday 
            ? 'bg-emerald-500/10 border-emerald-500/20' 
            : 'bg-slate-900 border-slate-800'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              hasScannedToday ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-500'
            }`}>
              {hasScannedToday ? <CheckCircle size={24} /> : <CalendarIcon size={24} />}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100">
                {hasScannedToday ? "You're all set for today!" : "You haven't scanned today"}
              </h3>
              <p className="text-slate-400 text-sm">
                {hasScannedToday 
                  ? "Great job keeping up with your routine." 
                  : "Take a quick scan to maintain your streak."}
              </p>
            </div>
          </div>
          {!hasScannedToday && (
            <Link 
              to="/analyze" 
              className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors"
            >
              Scan Now
            </Link>
          )}
        </div>
      </motion.div>

      {/* Task List */}
      <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-6">
        <TaskList 
          tasks={tasks} 
          onAddTask={handleAddTask} 
          onToggleTask={handleToggleTask} 
          onDeleteTask={handleDeleteTask} 
        />
      </div>

      {/* Calendar View (Simplified) */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-6">Recent Activity</h3>
        <div className="space-y-4">
          {logs.length === 0 ? (
            <p className="text-slate-500 text-center py-8">No activity recorded yet.</p>
          ) : (
            logs.slice(0, 5).map((log, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-slate-800">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-12 bg-teal-500 rounded-full"></div>
                  <div>
                    <p className="text-slate-200 font-medium">{new Date(log.date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</p>
                    <p className="text-sm text-slate-500">{log.condition || 'Routine Check'}</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium border ${
                  log.riskLevel === 'High' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                  log.riskLevel === 'Medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                  'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                }`}>
                  {log.riskLevel || 'Completed'}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
