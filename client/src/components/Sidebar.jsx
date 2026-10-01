import { Clock, CheckSquare, Calendar, History, LogOut, BarChart3, CalendarDays, X } from 'lucide-react';

export default function Sidebar({
  activeNav,
  setActiveNav,
  userEmail,
  onLogout,
  mobileOpen = false,
  setMobileOpen,
}) {
  const navItems = [
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'summary', label: 'Daily Summary', icon: Calendar },
    { id: 'charts', label: 'Charts', icon: BarChart3 },
    { id: 'weekly', label: 'Weekly Summary', icon: CalendarDays },
    { id: 'logs', label: 'Time Logs', icon: History },
  ];

  const handleNavClick = (id) => {
    setActiveNav(id);
    if (setMobileOpen) {
      setMobileOpen(false);
    }
  };

  const navContent = (
    <nav className="space-y-1.5">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeNav === item.id;
        return (
          <button
            key={item.id}
            onClick={() => handleNavClick(item.id)}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
              isActive
                ? 'bg-[#0f172a] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/70'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );

  const userFooter = (
    <div>
      <div className="bg-[#f1f5f9] rounded-2xl p-4">
        <p className="text-xs text-gray-400 font-normal">Signed in as</p>
        <p className="text-sm font-semibold text-gray-800 truncate mt-0.5" title={userEmail}>
          {userEmail}
        </p>
      </div>

      <button
        onClick={onLogout}
        className="w-full flex items-center gap-2.5 px-2 py-3 mt-2 text-sm font-medium text-gray-600 hover:text-gray-900 cursor-pointer transition-colors"
      >
        <LogOut className="w-4 h-4" />
        <span>Sign Out</span>
      </button>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex w-64 min-h-screen bg-[#f8fafc] border-r border-gray-200/80 flex-col justify-between p-6 shrink-0">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-[#0f172a] text-white rounded-xl flex items-center justify-center shadow-xs">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-900 leading-tight">TimeFlow</h1>
              <p className="text-[11px] text-gray-500 font-medium">Task & Time Tracker</p>
            </div>
          </div>
          {navContent}
        </div>
        {userFooter}
      </aside>

      <div
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-xs transition-opacity duration-300 lg:hidden ${
          mobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileOpen?.(false)}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#f8fafc] border-r border-gray-200/80 flex flex-col justify-between p-6 transition-transform duration-300 ease-in-out lg:hidden ${
          mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        <div>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#0f172a] text-white rounded-xl flex items-center justify-center shadow-xs">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-base font-bold text-gray-900 leading-tight">TimeFlow</h1>
                <p className="text-[11px] text-gray-500 font-medium">Task & Time Tracker</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setMobileOpen?.(false)}
              className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          {navContent}
        </div>
        {userFooter}
      </aside>
    </>
  );
}
