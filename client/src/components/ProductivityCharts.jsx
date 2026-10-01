import { useMemo } from 'react';
import { formatDuration } from '../utils/time';
import { CheckSquare } from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

const STATUS_COLORS = {
  Completed: '#059669',
  'In Progress': '#3b82f6',
  Pending: '#f59e0b',
};

export default function ProductivityCharts({ tasks = [] }) {
  const pieData = useMemo(() => {
    const counts = { Completed: 0, 'In Progress': 0, Pending: 0 };
    tasks.forEach((t) => {
      if (counts[t.status] !== undefined) counts[t.status]++;
    });
    return [
      { name: 'Completed', value: counts.Completed },
      { name: 'In Progress', value: counts['In Progress'] },
      { name: 'Pending', value: counts.Pending },
    ];
  }, [tasks]);

  const validPieData = useMemo(() => {
    return pieData.filter((d) => d.value > 0);
  }, [pieData]);

  const { barData, timeUnit, isSecondsUnit } = useMemo(() => {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const days = [];

    for (let i = 6; i >= 0; i--) {
      const startOfDay = new Date();
      startOfDay.setDate(startOfDay.getDate() - i);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(startOfDay);
      endOfDay.setDate(endOfDay.getDate() + 1);

      const dayTasks = tasks.filter((t) => {
        const taskDate = new Date(t.updatedAt || t.createdAt);
        return taskDate >= startOfDay && taskDate < endOfDay;
      });

      const daySeconds = dayTasks.reduce((sum, t) => sum + (t.timeSpent || 0), 0);

      days.push({
        day: i === 0 ? 'Today' : dayNames[startOfDay.getDay()],
        fullDate: startOfDay.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        seconds: daySeconds,
        isToday: i === 0,
      });
    }

    const maxSeconds = Math.max(...days.map((d) => d.seconds), 0);
    const useSeconds = maxSeconds < 300;

    const formattedData = days.map((d) => ({
      ...d,
      value: useSeconds
        ? d.seconds
        : Number((d.seconds / 60).toFixed(1)),
    }));

    return {
      barData: formattedData,
      timeUnit: useSeconds ? 's' : 'm',
      isSecondsUnit: useSeconds,
    };
  }, [tasks]);

  const totalTimeTracked = tasks.reduce((sum, t) => sum + (t.timeSpent || 0), 0);
  const completedCount = tasks.filter((t) => t.status === 'Completed').length;
  const avgTimePerTask = tasks.length > 0 ? Math.round(totalTimeTracked / tasks.length) : 0;
  const completionRate = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.04)] min-w-0 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-1">Task Status Distribution</h3>
            <p className="text-[11px] text-gray-400 font-medium mb-2">
              Breakdown of current task progress
            </p>
          </div>

          {tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-300 mb-2">
                <CheckSquare className="w-5 h-5 text-gray-300" />
              </div>
              <p className="text-xs text-gray-400 font-medium">No tasks logged yet.</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="relative w-full h-[190px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height={190}>
                  <PieChart>
                    <Pie
                      data={validPieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={56}
                      outerRadius={78}
                      paddingAngle={validPieData.length > 1 ? 4 : 0}
                      stroke="none"
                    >
                      {validPieData.map((entry) => (
                        <Cell key={entry.name} fill={STATUS_COLORS[entry.name]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name) => {
                        const pct = tasks.length > 0 ? Math.round((value / tasks.length) * 100) : 0;
                        return [`${value} task${value > 1 ? 's' : ''} (${pct}%)`, name];
                      }}
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        color: '#f8fafc',
                        borderRadius: '8px',
                        border: 'none',
                        fontSize: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>

                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-extrabold text-gray-900 leading-none">
                    {tasks.length}
                  </span>
                  <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mt-1">
                    {tasks.length === 1 ? 'Task' : 'Tasks'}
                  </span>
                </div>
              </div>

              <div className="w-full flex items-center justify-center gap-4 flex-wrap pt-3 border-t border-gray-100 mt-1">
                {pieData.map((item) => {
                  const pct = tasks.length > 0 ? Math.round((item.value / tasks.length) * 100) : 0;
                  return (
                    <div key={item.name} className="flex items-center gap-1.5 text-xs">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: STATUS_COLORS[item.name] }}
                      />
                      <span className="text-gray-600 font-medium">{item.name}</span>
                      <span className="text-gray-900 font-bold ml-0.5">{item.value}</span>
                      <span className="text-gray-400 text-[10px]">({pct}%)</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.04)] min-w-0 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-1">Quick Stats</h3>
            <p className="text-[11px] text-gray-400 font-medium mb-3">
              Summary of key productivity metrics
            </p>
          </div>

          <div className="space-y-3.5">
            {[
              { label: 'Total Tasks', value: tasks.length },
              { label: 'Completed', value: completedCount, color: 'text-emerald-600' },
              { label: 'Total Time Tracked', value: formatDuration(totalTimeTracked) },
              { label: 'Avg Time / Task', value: formatDuration(avgTimePerTask) },
              { label: 'Completion Rate', value: `${completionRate}%` },
            ].map((stat, i) => (
              <div
                key={i}
                className="flex justify-between items-center py-1 border-b border-gray-50 last:border-0"
              >
                <span className="text-xs text-gray-500 font-medium">{stat.label}</span>
                <span className={`text-sm font-bold ${stat.color || 'text-gray-900'}`}>
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.04)] min-w-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-gray-900">Time Tracked — Last 7 Days</h3>
            <p className="text-[11px] text-gray-400 font-medium mt-0.5">
              Daily focus time {isSecondsUnit ? 'in seconds' : 'in minutes'}
            </p>
          </div>
          {totalTimeTracked > 0 && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700">
              Total: {formatDuration(totalTimeTracked)}
            </span>
          )}
        </div>

        {totalTimeTracked === 0 ? (
          <div className="text-center py-10">
            <p className="text-xs text-gray-400 font-medium">
              No time tracked yet. Start a timer on any task to see your daily chart.
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={barData} margin={{ top: 15, right: 15, left: -15, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11, fill: '#64748b', fontWeight: 500 }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                axisLine={false}
                tickLine={false}
                unit={timeUnit}
                allowDecimals={!isSecondsUnit}
              />
              <Tooltip
                formatter={(value, name, item) => [
                  formatDuration(item?.payload?.seconds || 0),
                  'Time Tracked',
                ]}
                labelFormatter={(label, items) => {
                  const item = items?.[0]?.payload;
                  return item ? `${item.day} • ${item.fullDate}` : label;
                }}
                contentStyle={{
                  backgroundColor: '#1e293b',
                  color: '#f8fafc',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                }}
                itemStyle={{ color: '#60a5fa' }}
              />
              <Bar
                dataKey="value"
                fill="#0f172a"
                radius={[6, 6, 0, 0]}
                barSize={36}
                minPointSize={6}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
