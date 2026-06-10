import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, FileText, ClipboardList, TrendingUp, Plus, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { Spinner, StatusBadge } from '../components/ui';
import { format, subDays } from 'date-fns';
import api from '../api/client';

const COLORS = ['#6366f1','#10b981','#f59e0b','#ef4444','#8b5cf6'];

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/jobs'), api.get('/applications'), api.get('/tasks')])
      .then(([j, a, t]) => setData({ jobs: j.data, applications: a.data, tasks: t.data }))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>;

  const isEmployer = user?.role === 'employer';
  const apps = data?.applications || [];
  const tasks = data?.tasks || [];
  const jobs = data?.jobs || [];

  const stats = isEmployer ? [
    { label: 'Jobs Posted', value: jobs.length, icon: Briefcase, color: 'from-blue-500 to-blue-600', link: '/jobs' },
    { label: 'Total Applications', value: apps.length, icon: FileText, color: 'from-violet-500 to-violet-600', link: '/applications' },
    { label: 'Active Tasks', value: tasks.filter(t => t.status !== 'reviewed').length, icon: ClipboardList, color: 'from-amber-500 to-amber-600', link: '/tasks' },
    { label: 'Accepted Interns', value: apps.filter(a => a.status === 'accepted').length, icon: CheckCircle2, color: 'from-emerald-500 to-emerald-600', link: '/applications' },
  ] : [
    { label: 'Jobs Available', value: jobs.length, icon: Briefcase, color: 'from-blue-500 to-blue-600', link: '/jobs' },
    { label: 'My Applications', value: apps.length, icon: FileText, color: 'from-violet-500 to-violet-600', link: '/applications' },
    { label: 'Assigned Tasks', value: tasks.filter(t => t.status === 'assigned').length, icon: ClipboardList, color: 'from-amber-500 to-amber-600', link: '/tasks' },
    { label: 'Accepted', value: apps.filter(a => a.status === 'accepted').length, icon: TrendingUp, color: 'from-emerald-500 to-emerald-600', link: '/applications' },
  ];

  const statusGroups = ['submitted','reviewing','interview','accepted','rejected']
    .map(s => ({ name: s.charAt(0).toUpperCase()+s.slice(1), value: apps.filter(a => a.status===s).length }))
    .filter(s => s.value > 0);

  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = subDays(new Date(), 6 - i);
    return {
      day: format(d, 'MMM d'),
      count: apps.filter(a => format(new Date(a.createdAt), 'yyyy-MM-dd') === format(d, 'yyyy-MM-dd')).length,
    };
  });

  const taskStats = [
    { name: 'Assigned', value: tasks.filter(t => t.status==='assigned').length },
    { name: 'Submitted', value: tasks.filter(t => t.status==='submitted').length },
    { name: 'Reviewed', value: tasks.filter(t => t.status==='reviewed').length },
  ].filter(t => t.value > 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl text-slate-900">
            Good {new Date().getHours()<12?'morning':new Date().getHours()<18?'afternoon':'evening'}, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-slate-500 mt-1">Here's your activity overview.</p>
        </div>
        <div className="hidden sm:flex gap-2">
          <Link to="/ai" className="btn-secondary flex items-center gap-2 text-sm">
            <Sparkles size={16} className="text-brand-500" />AI Assistant
          </Link>
          {isEmployer
            ? <Link to="/jobs" className="btn-primary flex items-center gap-2 text-sm"><Plus size={16} />Post Job</Link>
            : <Link to="/jobs" className="btn-primary flex items-center gap-2 text-sm"><Briefcase size={16} />Browse Jobs</Link>
          }
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, link }) => (
          <Link key={label} to={link} className="card p-5 hover:shadow-md transition-all group">
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3`}>
              <Icon size={20} className="text-white" />
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-0.5">{value}</div>
            <div className="text-sm text-slate-500 flex items-center gap-1 group-hover:text-brand-600 transition-colors">
              {label} <ArrowRight size={13} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-brand-500" />Applications — Last 7 Days
          </h2>
          {apps.length === 0
            ? <div className="flex items-center justify-center h-36 text-slate-400 text-sm">No data yet</div>
            : <ResponsiveContainer width="100%" height={160}>
                <BarChart data={last7}>
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: '12px' }} />
                  <Bar dataKey="count" fill="#6366f1" radius={[6,6,0,0]} name="Applications" />
                </BarChart>
              </ResponsiveContainer>
          }
        </div>

        <div className="card p-6">
          <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <FileText size={16} className="text-violet-500" />Application Status Breakdown
          </h2>
          {statusGroups.length === 0
            ? <div className="flex items-center justify-center h-36 text-slate-400 text-sm">No applications yet</div>
            : <div className="flex items-center gap-4">
                <ResponsiveContainer width="50%" height={160}>
                  <PieChart>
                    <Pie data={statusGroups} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3}>
                      {statusGroups.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2">
                  {statusGroups.map((s, i) => (
                    <div key={s.name} className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i%COLORS.length] }} />
                      <span className="text-xs text-slate-600">{s.name}</span>
                      <span className="text-xs font-bold text-slate-900 ml-auto">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
          }
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="card p-6">
          <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <ClipboardList size={16} className="text-amber-500" />Tasks Overview
          </h2>
          {taskStats.length === 0
            ? <div className="flex items-center justify-center h-32 text-slate-400 text-sm">No tasks yet</div>
            : <ResponsiveContainer width="100%" height={140}>
                <BarChart data={taskStats} layout="vertical">
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={65} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', fontSize: '12px' }} />
                  <Bar dataKey="value" fill="#f59e0b" radius={[0,6,6,0]} name="Tasks" />
                </BarChart>
              </ResponsiveContainer>
          }
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-900 text-sm flex items-center gap-2"><FileText size={15} className="text-slate-400" />Recent Applications</h2>
            <Link to="/applications" className="text-xs text-brand-600 font-medium">View all</Link>
          </div>
          {apps.length === 0
            ? <div className="text-center py-8 text-slate-400 text-sm">None yet</div>
            : <div className="space-y-3">
                {apps.slice(0,5).map(app => (
                  <div key={app._id} className="flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-800 truncate">{app.job?.title}</p>
                      <p className="text-xs text-slate-400">{isEmployer ? app.candidate?.name : app.job?.company}</p>
                    </div>
                    <StatusBadge status={app.status} />
                  </div>
                ))}
              </div>
          }
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-900 text-sm flex items-center gap-2"><ClipboardList size={15} className="text-slate-400" />Recent Tasks</h2>
            <Link to="/tasks" className="text-xs text-brand-600 font-medium">View all</Link>
          </div>
          {tasks.length === 0
            ? <div className="text-center py-8 text-slate-400 text-sm">None yet</div>
            : <div className="space-y-3">
                {tasks.slice(0,5).map(task => (
                  <div key={task._id} className="flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-800 truncate">{task.title}</p>
                      <p className="text-xs text-slate-400">{isEmployer ? task.candidate?.name : task.application?.job?.title}</p>
                    </div>
                    <StatusBadge status={task.status} />
                  </div>
                ))}
              </div>
          }
        </div>
      </div>

      <div className="bg-gradient-to-r from-brand-500 to-violet-600 rounded-2xl p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-white">Try Claude AI Assistant</p>
            <p className="text-brand-100 text-sm">
              {isEmployer ? 'Get AI career insights and hiring tips' : 'Generate resume, get career advice, auto-apply to jobs'}
            </p>
          </div>
        </div>
        <Link to="/ai" className="bg-white text-brand-700 font-semibold text-sm px-4 py-2 rounded-xl hover:bg-brand-50 transition-colors flex-shrink-0">
          Open AI →
        </Link>
      </div>
    </div>
  );
}
