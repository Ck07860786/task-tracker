import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { getTasks, createTask, updateTask, deleteTask } from '../api/taskApi';
import Sidebar from '../components/Sidebar';
import TaskInput from '../components/TaskInput';
import TaskFilter from '../components/TaskFilter';
import TaskCard from '../components/TaskCard';
import DailySummary from '../components/DailySummary';
import TimeLogs from '../components/TimeLogs';
import ProductivityCharts from '../components/ProductivityCharts';
import WeeklySummary from '../components/WeeklySummary';
import LoadingSpinner from '../components/LoadingSpinner';
import { CheckSquare, Calendar, History, BarChart3, CalendarDays } from 'lucide-react';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeNav, setActiveNav] = useState('tasks');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  const [activeTimerTaskId, setActiveTimerTaskId] = useState(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerIntervalRef = useRef(null);

  const fetchTasks = useCallback(async () => {
    try {
      const { data } = await getTasks();
      setTasks(data.data.tasks || []);
    } catch {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    if (activeTimerTaskId) {
      timerIntervalRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [activeTimerTaskId]);

  const handleLogout = () => {
    if (activeTimerTaskId) {
      stopTimer(activeTimerTaskId, elapsedSeconds);
    }
    logout();
    navigate('/login', { replace: true });
  };

  const handleAddTask = async (taskData) => {
    try {
      const { data } = await createTask(taskData);
      setTasks((prev) => [data.data.task, ...prev]);
      toast.success('Task created');
    } catch {
      toast.error('Failed to create task');
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const { data } = await updateTask(taskId, { status: newStatus });
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? data.data.task : t))
      );
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleUpdateTask = async (taskId, updateData) => {
    try {
      const { data } = await updateTask(taskId, updateData);
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? data.data.task : t))
      );
      toast.success('Task updated');
    } catch {
      toast.error('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (activeTimerTaskId === taskId) {
      setActiveTimerTaskId(null);
      setElapsedSeconds(0);
    }
    try {
      await deleteTask(taskId);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      toast.success('Task deleted');
    } catch {
      toast.error('Failed to delete task');
    }
  };

  const stopTimer = async (taskId, elapsed) => {
    const task = tasks.find((t) => t._id === taskId);
    if (!task) return;
    const updatedTime = (task.timeSpent || 0) + elapsed;
    try {
      const { data } = await updateTask(taskId, { timeSpent: updatedTime });
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? data.data.task : t))
      );
    } catch {
      toast.error('Failed to save timer progress');
    }
    setActiveTimerTaskId(null);
    setElapsedSeconds(0);
  };

  const handleToggleTimer = async (taskId) => {
    if (activeTimerTaskId === taskId) {
      await stopTimer(taskId, elapsedSeconds);
    } else {
      if (activeTimerTaskId) {
        await stopTimer(activeTimerTaskId, elapsedSeconds);
      }
      const task = tasks.find((t) => t._id === taskId);
      if (task && task.status === 'Pending') {
        handleStatusChange(taskId, 'In Progress');
      }
      setActiveTimerTaskId(taskId);
      setElapsedSeconds(0);
    }
  };

  const counts = useMemo(() => {
    return {
      all: tasks.length,
      pending: tasks.filter((t) => t.status === 'Pending').length,
      inProgress: tasks.filter((t) => t.status === 'In Progress').length,
      completed: tasks.filter((t) => t.status === 'Completed').length,
    };
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    if (filter === 'All') return tasks;
    return tasks.filter((t) => t.status === filter);
  }, [tasks, filter]);

  const headerConfig = {
    tasks: {
      title: 'Tasks',
      subtitle: 'Create, manage, and track time on your tasks',
      icon: CheckSquare,
    },
    summary: {
      title: 'Daily Summary',
      subtitle: 'Review today\u2019s productivity and tracked hours',
      icon: Calendar,
    },
    charts: {
      title: 'Productivity Charts',
      subtitle: 'Visualize your task distribution and daily focus time',
      icon: BarChart3,
    },
    weekly: {
      title: 'Weekly Summary',
      subtitle: 'Track your week-over-week progress and trends',
      icon: CalendarDays,
    },
    logs: {
      title: 'Time Logs',
      subtitle: 'Inspect all recorded task timers and focus history',
      icon: History,
    },
  };

  const currentHeader = headerConfig[activeNav] || headerConfig.tasks;
  const HeaderIcon = currentHeader.icon;

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex text-gray-900">
      <Sidebar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        userEmail={user?.email || ''}
        onLogout={handleLogout}
      />

      <main className="flex-1 p-8 sm:p-10 max-w-4xl overflow-y-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-white border border-gray-200/90 shadow-2xs flex items-center justify-center text-gray-700">
            <HeaderIcon className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 leading-tight">
              {currentHeader.title}
            </h1>
            <p className="text-xs text-gray-500 font-medium">
              {currentHeader.subtitle}
            </p>
          </div>
        </div>

        {activeNav === 'tasks' && (
          <div>
            <TaskInput onAddTask={handleAddTask} />
            <TaskFilter
              currentFilter={filter}
              onFilterChange={setFilter}
              counts={counts}
            />

            {filteredTasks.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 border border-gray-100 text-center shadow-2xs">
                <CheckSquare className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-xs text-gray-400 font-medium">
                  {filter === 'All'
                    ? 'No tasks yet. Type a task above to get started!'
                    : `No tasks found with status "${filter}".`}
                </p>
              </div>
            ) : (
              <div>
                {filteredTasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    isTimerRunning={activeTimerTaskId === task._id}
                    elapsedSeconds={elapsedSeconds}
                    onToggleTimer={handleToggleTimer}
                    onStatusChange={handleStatusChange}
                    onUpdateTask={handleUpdateTask}
                    onDelete={handleDeleteTask}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeNav === 'summary' && <DailySummary tasks={tasks} />}
        {activeNav === 'charts' && <ProductivityCharts tasks={tasks} />}
        {activeNav === 'weekly' && <WeeklySummary tasks={tasks} />}
        {activeNav === 'logs' && <TimeLogs tasks={tasks} />}
      </main>
    </div>
  );
}
