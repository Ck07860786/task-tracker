import { formatDuration } from '../utils/time';

export default function DailySummary({ tasks = [] }) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'In Progress').length;
  const pendingTasks = tasks.filter((t) => t.status === 'Pending').length;
  const totalSeconds = tasks.reduce((sum, t) => sum + (t.timeSpent || 0), 0);
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const stats = [
    { label: 'Total Tasks', value: totalTasks, change: `${completedTasks} done` },
    { label: 'Time Tracked', value: formatDuration(totalSeconds), change: 'Total recorded' },
    { label: 'Completion Rate', value: `${completionRate}%`, change: `${pendingTasks} pending` },
    { label: 'In Progress', value: inProgressTasks, change: 'Currently active' },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.04)]"
          >
            <p className="text-xs text-gray-400 font-medium">{s.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{s.value}</p>
            <p className="text-[11px] text-gray-500 mt-1 font-medium">{s.change}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.04)]">
        <h2 className="text-sm font-bold text-gray-900 mb-4">Productivity Breakdown</h2>
        {tasks.length === 0 ? (
          <p className="text-xs text-gray-400">No tasks logged yet today.</p>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => {
              const pct = totalSeconds > 0 ? Math.round(((task.timeSpent || 0) / totalSeconds) * 100) : 0;
              return (
                <div key={task._id} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-gray-700">{task.title}</span>
                    <span className="text-gray-400 font-medium">
                      {formatDuration(task.timeSpent || 0)} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-[#0f172a] h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
