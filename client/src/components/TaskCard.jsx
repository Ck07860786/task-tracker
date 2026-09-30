import { useState, useRef, useEffect } from 'react';
import { Play, Square, Trash2, Pencil, ChevronDown, Clock } from 'lucide-react';
import { getRelativeTime, formatDuration } from '../utils/time';

export default function TaskCard({
  task,
  isTimerRunning,
  elapsedSeconds,
  onToggleTimer,
  onStatusChange,
  onUpdateTask,
  onDelete,
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDesc, setEditDesc] = useState(task.description || '');
  const [saving, setSaving] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setEditTitle(task.title);
    setEditDesc(task.description || '');
  }, [task]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const totalTimeSpent = (task.timeSpent || 0) + (isTimerRunning ? elapsedSeconds : 0);

  const statusStyles = {
    Pending: {
      dot: 'bg-amber-500',
      pill: 'bg-amber-50/80 border-amber-200 text-amber-800',
    },
    'In Progress': {
      dot: 'bg-blue-500',
      pill: 'bg-blue-50/80 border-blue-200 text-blue-800',
    },
    Completed: {
      dot: 'bg-emerald-500',
      pill: 'bg-emerald-50/80 border-emerald-200 text-emerald-800',
    },
  };

  const currentStyle = statusStyles[task.status] || statusStyles.Pending;

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editTitle.trim() || saving) return;

    setSaving(true);
    try {
      await onUpdateTask(task._id, {
        title: editTitle.trim(),
        description: editDesc.trim(),
      });
      setIsEditing(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.04)] mb-4 transition-all hover:border-gray-200">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5 flex-1 mr-4">
          <span className={`w-2.5 h-2.5 rounded-full ${currentStyle.dot} shrink-0`} />
          {!isEditing && (
            <h2 className="text-sm font-bold text-gray-900">{task.title}</h2>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => setIsEditing((prev) => !prev)}
            title={isEditing ? 'Cancel editing' : 'Edit task'}
            className="text-gray-400 hover:text-gray-700 transition-colors cursor-pointer p-1 rounded-md hover:bg-gray-100"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(task._id)}
            title="Delete task"
            className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer p-1 rounded-md hover:bg-gray-100"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {isEditing ? (
        <form onSubmit={handleSaveEdit} className="mt-3 space-y-3">
          <div>
            <label className="text-[11px] font-semibold text-gray-600 block mb-1">
              Title
            </label>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full text-sm font-medium text-gray-900 border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-300"
              required
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-gray-600 block mb-1">
              Description
            </label>
            <textarea
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              rows={2}
              className="w-full text-xs text-gray-700 border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-300 resize-none"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="submit"
              disabled={!editTitle.trim() || saving}
              className="px-3.5 py-1.5 rounded-lg bg-[#0f172a] hover:bg-[#1e293b] text-white text-xs font-semibold shadow-xs cursor-pointer disabled:opacity-50 transition-colors"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditTitle(task.title);
                setEditDesc(task.description || '');
                setIsEditing(false);
              }}
              className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium cursor-pointer transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          {task.description && (
            <p className="text-xs text-gray-600 mt-2 leading-relaxed">
              {task.description}
            </p>
          )}

          <p className="text-[11px] text-gray-400 italic mt-0.5">
            &quot;{task.title.toLowerCase()}&quot;
          </p>

          <div className="flex items-center gap-3 mt-4">
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen((prev) => !prev)}
                className={`border px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors ${currentStyle.pill}`}
              >
                <span>{task.status}</span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {dropdownOpen && (
                <div className="absolute left-0 mt-1 w-32 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-20">
                  {['Pending', 'In Progress', 'Completed'].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        onStatusChange(task._id, s);
                        setDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs font-medium transition-colors hover:bg-gray-50 cursor-pointer ${
                        task.status === s ? 'text-gray-900 font-semibold' : 'text-gray-600'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-1 text-xs text-gray-400 font-medium">
              <Clock className="w-3.5 h-3.5" />
              <span>{formatDuration(totalTimeSpent)}</span>
            </div>

            <span className="text-xs text-gray-400">
              {getRelativeTime(task.createdAt)}
            </span>
          </div>

          <div className="mt-4">
            <button
              type="button"
              onClick={() => onToggleTimer(task._id)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer ${
                isTimerRunning
                  ? 'bg-[#dc2626] hover:bg-[#b91c1c] text-white animate-pulse'
                  : 'bg-[#059669] hover:bg-[#047857] text-white'
              }`}
            >
              {isTimerRunning ? (
                <>
                  <Square className="w-3 h-3 fill-current" />
                  <span>Stop</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 fill-current" />
                  <span>Start</span>
                </>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
