import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { LayoutDashboard, Briefcase, FileText, ClipboardList, MessageSquare, User, LogOut, Bell, Menu, ChevronRight, Zap, Sparkles, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import NotificationPanel from './NotificationPanel';

const candidateNav = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/jobs', label: 'Jobs', icon: Briefcase },
  { to: '/applications', label: 'Applications', icon: FileText },
  { to: '/tasks', label: 'Tasks', icon: ClipboardList },
  { to: '/chat', label: 'Chat', icon: MessageSquare },
  { to: '/ai', label: 'AI Assistant', icon: Sparkles, highlight: true },
  { to: '/profile', label: 'Profile', icon: User },
];

const employerNav = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/jobs', label: 'Jobs', icon: Briefcase },
  { to: '/applications', label: 'Applications', icon: FileText },
  { to: '/interns', label: 'My Interns', icon: Users },
  { to: '/tasks', label: 'Tasks', icon: ClipboardList },
  { to: '/chat', label: 'Chat', icon: MessageSquare },
  { to: '/ai', label: 'AI Assistant', icon: Sparkles, highlight: true },
  { to: '/profile', label: 'Profile', icon: User },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const { notifications } = useSocket();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const navigate = useNavigate();
  const unread = notifications.filter(n => !n.read).length;
  const navItems = user?.role === 'employer' ? employerNav : candidateNav;

  return (
    <div className="flex h-screen bg-stone-100 overflow-hidden">
      {sidebarOpen && <div className="fixed inset-0 bg-slate-950/55 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <aside className={`fixed lg:static inset-y-0 left-0 z-30 w-72 bg-slate-950 text-slate-100 flex flex-col transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-cyan-400 flex items-center justify-center shadow-[0_0_30px_rgba(34,211,238,0.35)]">
              <Zap className="w-4 h-4 text-slate-950" fill="currentColor" />
            </div>
            <div>
              <span className="block font-black text-lg text-white tracking-normal">Vintern</span>
              <span className="block text-[11px] uppercase tracking-[0.22em] text-cyan-200">intern ops</span>
            </div>
          </div>
        </div>

        <div className="px-4 py-4 border-b border-white/10">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.07] border border-white/10">
            <div className="w-10 h-10 rounded-lg bg-lime-300 flex items-center justify-center text-slate-950 font-black text-sm flex-shrink-0">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
              <span className={`text-xs px-2 py-0.5 rounded-md font-semibold ${user?.role === 'employer' ? 'bg-fuchsia-300 text-slate-950' : 'bg-emerald-300 text-slate-950'}`}>
                {user?.role}
              </span>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ to, label, icon: Icon, highlight }) => (
            <NavLink key={to} to={to} onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg font-semibold text-sm transition-all duration-150 group
                ${isActive
                  ? highlight ? 'bg-cyan-300 text-slate-950 shadow-[0_0_24px_rgba(34,211,238,0.25)]' : 'bg-white text-slate-950'
                  : highlight ? 'text-cyan-200 hover:bg-white/10 hover:text-cyan-100' : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}>
              {({ isActive }) => (
                <>
                  <Icon size={18} className="flex-shrink-0" />
                  <span className="flex-1">{label}</span>
                  {highlight && !isActive && (
                    <span className="text-[10px] bg-cyan-300 text-slate-950 px-1.5 py-0.5 rounded font-black">AI</span>
                  )}
                  {isActive && !highlight && <ChevronRight size={14} className="text-slate-500" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-white/10">
          <button onClick={() => { logout(); navigate('/'); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-300 hover:bg-red-500/15 hover:text-red-200 transition-all">
            <LogOut size={18} />Sign out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-stone-100/90 border-b border-slate-200 flex items-center justify-between px-4 lg:px-7 flex-shrink-0 backdrop-blur">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-white border border-slate-200">
            <Menu size={20} />
          </button>
          <div className="hidden lg:block">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">workspace</p>
          </div>
          <div className="relative">
            <button onClick={() => setShowNotifs(!showNotifs)} className="relative p-2.5 rounded-lg bg-white border border-slate-200 hover:border-cyan-400 transition-colors">
              <Bell size={19} className="text-slate-700" />
              {unread > 0 && (
                <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-lime-300 text-slate-950 text-[10px] font-black rounded-full flex items-center justify-center">
                  {unread > 9 ? '9+' : unread}
                </span>
              )}
            </button>
            {showNotifs && <NotificationPanel onClose={() => setShowNotifs(false)} />}
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-8 max-w-7xl mx-auto"><Outlet /></div>
        </main>
      </div>
    </div>
  );
}
