import { formatDuration, getRelativeTime } from '../utils/time';
import { Clock } from 'lucide-react';

export default function TimeLogs({ tasks = [] }) {
  const loggedTasks = tasks.filter((t) => (t.timeSpent || 0) > 0);

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
        <h2 className="text-sm font-bold text-gray-900">Recorded Sessions</h2>
        <span className="text-xs text-gray-400 font-medium">
          {loggedTasks.length} task(s) tracked
        </span>
      </div>

      {loggedTasks.length === 0 ? (
        <div className="text-center py-10">
          <Clock className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-xs text-gray-400 font-medium">
            No time tracked yet. Click &quot;Start&quot; on any task to record focus time.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {loggedTasks.map((t) => (
            <div key={t._id} className="py-3.5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-800">{t.title}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Last updated {getRelativeTime(t.updatedAt || t.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-gray-100 text-gray-700">
                  {formatDuration(t.timeSpent)}
                </span>
                <span className="text-[11px] font-medium text-gray-400">
                  {t.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
