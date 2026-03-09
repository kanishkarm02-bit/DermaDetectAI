import React from 'react';
import { Task } from '@/types/Task';
import { CheckCircle, Circle, Calendar, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete }) => {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${
        task.completed 
          ? 'bg-slate-900/50 border-slate-800 opacity-60' 
          : 'bg-slate-900 border-slate-700 hover:border-teal-500/30'
      }`}
    >
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={() => onToggle(task.id)}
          className={`shrink-0 transition-colors ${
            task.completed ? 'text-teal-500' : 'text-slate-500 hover:text-teal-400'
          }`}
        >
          {task.completed ? <CheckCircle size={24} /> : <Circle size={24} />}
        </button>
        
        <div className="flex-1 min-w-0">
          <h3 className={`font-medium truncate ${
            task.completed ? 'text-slate-500 line-through' : 'text-slate-200'
          }`}>
            {task.title}
          </h3>
          
          {task.dueDate && (
            <div className={`flex items-center gap-1.5 text-xs mt-1 ${
              isOverdue ? 'text-rose-400' : 'text-slate-400'
            }`}>
              <Calendar size={12} />
              <span>
                {new Date(task.dueDate).toLocaleDateString(undefined, { 
                  month: 'short', 
                  day: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric'
                })}
              </span>
              {isOverdue && <span className="font-semibold ml-1">(Overdue)</span>}
            </div>
          )}
        </div>
      </div>

      <button
        onClick={() => onDelete(task.id)}
        className="ml-4 p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
        aria-label="Delete task"
      >
        <Trash2 size={18} />
      </button>
    </motion.div>
  );
}
