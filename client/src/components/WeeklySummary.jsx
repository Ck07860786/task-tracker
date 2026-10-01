import { useMemo } from 'react';
import { formatDuration } from '../utils/time';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';


function getWeekRange(weeksAgo = 0) {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Sun
  const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  const monday = new Date(now);
  monday.setDate(now.getDate() - diffToMonday - weeksAgo * 7);
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 7);

  return { start: monday, end: sunday };
}


function shortDate(date) {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function WeeklySummary({ tasks = [] }) {
  const weekData = useMemo(() => {
    const thisWeek = getWeekRange(0);
    const lastWeek = getWeekRange(1);

    function getWeekStats(range) {
      const weekTasks = tasks.filter((t) => {
        const d = new Date(t.createdAt);
        return d >= range.start && d < range.end;
      });

      const completed = weekTasks.filter((t) => t.status === 'Completed').length;
      const total = weekTasks.length;
      const timeSpent = weekTasks.reduce((s, t) => s + (t.timeSpent || 0), 0);
      const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

      return { total, completed, timeSpent, rate };
    }

    const current = getWeekStats(thisWeek);
    const previous = getWeekStats(lastWeek);


    function trend(curr, prev) {
      if (prev === 0 && curr === 0) return { pct: 0, direction: 'flat' };
      if (prev === 0) return { pct: 100, direction: 'up' };
      const diff = ((curr - prev) / prev) * 100;
      return {
        pct: Math.abs(Math.round(diff)),
        direction: diff > 0 ? 'up' : diff < 0 ? 'down' : 'flat',
      };
    }

    return {
      range: `${shortDate(thisWeek.start)} – ${shortDate(new Date(thisWeek.end.getTime() - 1))}`,
      current,
      previous,
      trends: {
        tasks: trend(current.total, previous.total),
        completed: trend(current.completed, previous.completed),
        time: trend(current.timeSpent, previous.timeSpent),
        rate: trend(current.rate, previous.rate),
      },
    };
  }, [tasks]);

  const dailyBreakdown = useMemo(() => {
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const thisWeek = getWeekRange(0);
    const days = [];

    for (let i = 0; i < 7; i++) {
      const dayStart = new Date(thisWeek.start);
      dayStart.setDate(dayStart.getDate() + i);
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);

      const dayTasks = tasks.filter((t) => {
        const d = new Date(t.updatedAt || t.createdAt);
        return d >= dayStart && d < dayEnd;
      });

      days.push({
        name: dayNames[i],
        created: dayTasks.length,
        completed: dayTasks.filter((t) => t.status === 'Completed').length,
        time: dayTasks.reduce((s, t) => s + (t.timeSpent || 0), 0),
      });
    }

    return days;
  }, [tasks]);

  function TrendBadge({ trend }) {
    if (trend.direction === 'flat') {
      return (
        <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-gray-400">
          <Minus className="w-3 h-3" /> 0%
        </span>
      );
    }

    const isUp = trend.direction === 'up';
    return (
      <span
        className={`inline-flex items-center gap-0.5 text-[10px] font-semibold ${isUp ? 'text-emerald-600' : 'text-red-500'
          }`}
      >
        {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        {trend.pct}%
      </span>
    );
  }

  const cards = [
    {
      label: 'Tasks Created',
      value: weekData.current.total,
      prev: weekData.previous.total,
      trend: weekData.trends.tasks,
    },
    {
      label: 'Completed',
      value: weekData.current.completed,
      prev: weekData.previous.completed,
      trend: weekData.trends.completed,
    },
    {
      label: 'Time Tracked',
      value: formatDuration(weekData.current.timeSpent),
      prev: formatDuration(weekData.previous.timeSpent),
      trend: weekData.trends.time,
    },
    {
      label: 'Completion Rate',
      value: `${weekData.current.rate}%`,
      prev: `${weekData.previous.rate}%`,
      trend: weekData.trends.rate,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-gray-900">This Week</h3>
          <p className="text-[11px] text-gray-400 font-medium">{weekData.range}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.04)]"
          >
            <p className="text-xs text-gray-400 font-medium">{c.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{c.value}</p>
            <div className="flex items-center gap-2 mt-1">
              <TrendBadge trend={c.trend} />
              <span className="text-[10px] text-gray-400">vs last week ({c.prev})</span>
            </div>
          </div>
        ))}
      </div>


      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.04)]">
        <h3 className="text-sm font-bold text-gray-900 mb-4">Daily Breakdown</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2 pr-4 text-gray-400 font-semibold">Day</th>
                <th className="text-right py-2 px-4 text-gray-400 font-semibold">Tasks</th>
                <th className="text-right py-2 px-4 text-gray-400 font-semibold">Completed</th>
                <th className="text-right py-2 pl-4 text-gray-400 font-semibold">Time Tracked</th>
              </tr>
            </thead>
            <tbody>
              {dailyBreakdown.map((day, i) => (
                <tr key={i} className="border-b border-gray-50 last:border-0">
                  <td className="py-2.5 pr-4 font-semibold text-gray-700">{day.name}</td>
                  <td className="py-2.5 px-4 text-right text-gray-600">{day.created}</td>
                  <td className="py-2.5 px-4 text-right text-gray-600">{day.completed}</td>
                  <td className="py-2.5 pl-4 text-right text-gray-600 font-medium">
                    {day.time > 0 ? formatDuration(day.time) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
