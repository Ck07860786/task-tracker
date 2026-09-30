import { useState } from 'react';
import { Sparkles } from 'lucide-react';

export default function TaskInput({ onAddTask }) {
  const [inputVal, setInputVal] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleEnhance = () => {
    if (!inputVal.trim()) return;
    const cleanText = inputVal.trim();
    const capitalized = cleanText.charAt(0).toUpperCase() + cleanText.slice(1);
    setInputVal(capitalized);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputVal.trim() || submitting) return;

    const raw = inputVal.trim();
    const title = raw.charAt(0).toUpperCase() + raw.slice(1);
    const description = `Complete: ${raw}. Review the requirements and execute the necessary steps.`;

    setSubmitting(true);
    try {
      await onAddTask({
        title,
        description,
        status: 'Pending',
      });
      setInputVal('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex items-center gap-2 bg-white rounded-2xl border border-gray-200/90 p-2 shadow-xs">
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder='Type a task naturally — e.g., "follow up with designer"'
          className="flex-1 px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 bg-transparent outline-none"
        />

        <button
          type="button"
          onClick={handleEnhance}
          disabled={!inputVal.trim()}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50 bg-white transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Enhance</span>
        </button>

        <button
          type="submit"
          disabled={!inputVal.trim() || submitting}
          className="px-5 py-2.5 rounded-xl bg-[#475569] hover:bg-[#334155] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Adding...' : 'Add Task'}
        </button>
      </div>
    </form>
  );
}
