import { Link, useLocation } from 'react-router-dom';
import { Clock } from 'lucide-react';

export default function AuthLayout({ children }) {
  const location = useLocation();
  const isSignIn = location.pathname === '/login';

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-[#0f172a] text-white rounded-2xl flex items-center justify-center shadow-xs">
          <Clock className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900 leading-tight">TimeFlow</h1>
          <p className="text-xs text-gray-500 font-medium">Task & Time Tracking</p>
        </div>
      </div>

 
      <div className="w-full max-w-[420px] bg-white rounded-2xl border border-gray-100 p-8 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.06)]">
    
        <div className="bg-[#f1f5f9] p-1 rounded-xl flex items-center mb-6 text-sm">
          <Link
            to="/login"
            className={`flex-1 py-2 text-center rounded-lg font-medium transition-all ${
              isSignIn
                ? 'bg-white text-gray-900 font-semibold shadow-xs'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className={`flex-1 py-2 text-center rounded-lg font-medium transition-all ${
              !isSignIn
                ? 'bg-white text-gray-900 font-semibold shadow-xs'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Sign Up
          </Link>
        </div>

        {children}
      </div>

    
      <p className="text-xs text-gray-400 text-center mt-6">
        Track tasks, run timers, and review your daily productivity.
      </p>
    </div>
  );
}
