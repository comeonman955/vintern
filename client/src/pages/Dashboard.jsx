import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, FileText, ClipboardList, TrendingUp, Plus, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { Spinner, StatusBadge } from '../components/ui';
import { format, subDays } from 'date-fns';
import api from '../api/client';

const COLORS = ['#0891b2', '#10b981', '#84cc16', '#f43f5e', '#0f172a'];

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
    { label: 'Jobs Posted', value: jobs.length, icon: Briefcase, tone: 'bg-cyan-300 text-slate-950', link: '/jobs' },
    { label: 'Total Applications', value: apps.length, icon: FileText, tone: 'bg-lime-300 text-slate-950', link: '/applications' },
    { label: 'Active Tasks', value: tasks.filter(t => t.status !== 'reviewed').length, icon: ClipboardList, tone: 'bg-amber-300 text-slate-950', link: '/tasks' },
    { label: 'Accepted Interns', value: apps.filter(a => a.status === 'accepted').length, icon: CheckCircle2, tone: 'bg-emerald-300 text-slate-950', link: '/applications' },
  ] : [
    { label: 'Jobs Available', value: jobs.length, icon: Briefcase, tone: 'bg-cyan-300 text-slate-950', link: '/jobs' },
    { label: 'My Applications', value: apps.length, icon: FileText, tone: 'bg-lime-300 text-slate-950', link: '/applications' },
    { label: 'Assigned Tasks', value: tasks.filter(t => t.status === 'assigned').length, icon: ClipboardList, tone: 'bg-amber-300 text-slate-950', link: '/tasks' },
    { label: 'Accepted', value: apps.filter(a => a.status === 'accepted').length, icon: TrendingUp, tone: 'bg-emerald-300 text-slate-950', link: '/applications' },
  ];

  const statusGroups = ['submitted', 'reviewing', 'interview', 'accepted', 'rejected']
    .map(s => ({ name: s.charAt(0).toUpperCase() + s.slice(1), value: apps.filter(a => a.status === s).length }))
    .filter(s => s.value > 0);

  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = subDays(new Date(), 6 - i);
    return {
      day: format(d, 'MMM d'),
      count: apps.filter(a => format(new Date(a.createdAt), 'yyyy-MM-dd') === format(d, 'yyyy-MM-dd')).length,
    };
  });

  const taskStats = [
    { name: 'Assigned', value: tasks.filter(t => t.status === 'assigned').length },
    { name: 'Submitted', value: tasks.filter(t => t.status === 'submitted').length },
    { name: 'Reviewed', value: tasks.filter(t => t.status === 'reviewed').length },
  ].filter(t => t.value > 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-slate-950 text-white rounded-lg p-5 sm:p-6 lg:p-7 shadow-[0_22px_60px_rgba(15,23,42,0.22)]">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-200">today's command center</p>
            <h1 className="font-black text-4xl lg:text-5xl mt-3 leading-tight">
              Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, {user?.name?.split(' ')[0]}
            </h1>
            <p className="text-slate-300 mt-3 max-w-2xl">
              Track applications, tasks, conversations, and hiring progress from one focused workspace.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Link to="/ai" className="bg-white/10 hover:bg-white/15 border border-white/10 text-white font-semibold px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm">
              <Sparkles size={16} className="text-cyan-300" />AI Assistant
            </Link>
            {isEmployer
              ? <Link to="/jobs" className="bg-cyan-300 text-slate-950 font-black px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm"><Plus size={16} />Post Job</Link>
              : <Link to="/jobs" className="bg-cyan-300 text-slate-950 font-black px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm"><Briefcase size={16} />Browse Jobs</Link>
            }
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, tone, link }) => (
          <Link key={label} to={link} className="card p-5 hover:-translate-y-0.5 transition-all group block">
            <div className={`w-11 h-11 rounded-lg ${tone} flex items-center justify-center mb-4`}>
              <Icon size={20} />
            </div>
            <div className="text-4xl font-black text-slate-950 mb-1">{value}</div>
            <div className="text-sm font-semibold text-slate-500 flex items-center gap-1 group-hover:text-cyan-700 transition-colors">
              {label} <ArrowRight size={13} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="font-black text-slate-950 mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-cyan-700" />Applications - Last 7 Days
          </h2>
          {apps.length === 0
            ? <div className="flex items-center justify-center h-36 text-slate-400 text-sm">No data yet</div>
            : <ResponsiveContainer width="100%" height={180}>
                <BarChart data={last7}>
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 12px 30px rgba(15,23,42,0.12)', fontSize: '12px' }} />
                  <Bar dataKey="count" fill="#0891b2" radius={[6, 6, 0, 0]} name="Applications" />
                </BarChart>
              </ResponsiveContainer>
          }
        </div>

        <div className="card p-6">
          <h2 className="font-black text-slate-950 mb-4 flex items-center gap-2">
            <FileText size={16} className="text-lime-600" />Application Status
          </h2>
          {statusGroups.length === 0
            ? <div className="flex items-center justify-center h-36 text-slate-400 text-sm">No applications yet</div>
            : <div className="flex items-center gap-4">
                <ResponsiveContainer width="50%" height={170}>
                  <PieChart>
                    <Pie data={statusGroups} cx="50%" cy="50%" innerRadius={45} outerRadius={72} dataKey="value" paddingAngle={4}>
                      {statusGroups.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 flex-1">
                  {statusGroups.map((s, i) => (
                    <div key={s.name} className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                      <span className="text-xs font-semibold text-slate-600">{s.name}</span>
                      <span className="text-xs font-black text-slate-950 ml-auto">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
          }
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="card p-6">
          <h2 className="font-black text-slate-950 mb-4 flex items-center gap-2">
            <ClipboardList size={16} className="text-amber-600" />Tasks Overview
          </h2>
          {taskStats.length === 0
            ? <div className="flex items-center justify-center h-32 text-slate-400 text-sm">No tasks yet</div>
            : <ResponsiveContainer width="100%" height={150}>
                <BarChart data={taskStats} layout="vertical">
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={65} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                  <Bar dataKey="value" fill="#84cc16" radius={[0, 6, 6, 0]} name="Tasks" />
                </BarChart>
              </ResponsiveContainer>
          }
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-black text-slate-950 text-sm flex items-center gap-2"><FileText size={15} className="text-slate-400" />Recent Applications</h2>
            <Link to="/applications" className="text-xs text-cyan-700 font-black">View all</Link>
          </div>
          {apps.length === 0
            ? <div className="text-center py-8 text-slate-400 text-sm">None yet</div>
            : <div className="space-y-3">
                {apps.slice(0, 5).map(app => (
                  <div key={app._id} className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-black text-slate-900 truncate">{app.job?.title}</p>
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
            <h2 className="font-black text-slate-950 text-sm flex items-center gap-2"><ClipboardList size={15} className="text-slate-400" />Recent Tasks</h2>
            <Link to="/tasks" className="text-xs text-cyan-700 font-black">View all</Link>
          </div>
          {tasks.length === 0
            ? <div className="text-center py-8 text-slate-400 text-sm">None yet</div>
            : <div className="space-y-3">
                {tasks.slice(0, 5).map(task => (
                  <div key={task._id} className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-black text-slate-900 truncate">{task.title}</p>
                      <p className="text-xs text-slate-400">{isEmployer ? task.candidate?.name : task.application?.job?.title}</p>
                    </div>
                    <StatusBadge status={task.status} />
                  </div>
                ))}
              </div>
          }
        </div>
      </div>

      <div className="bg-cyan-300 rounded-lg p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-slate-950">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-950 flex items-center justify-center">
            <Sparkles size={20} className="text-cyan-300" />
          </div>
          <div>
            <p className="font-black">Open the AI Assistant</p>
            <p className="text-slate-700 text-sm">
              {isEmployer ? 'Get hiring insights and better role prompts.' : 'Generate resume content, career advice, and application support.'}
            </p>
          </div>
        </div>
        <Link to="/ai" className="bg-slate-950 text-white font-black text-sm px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors flex-shrink-0 text-center">
          Open AI
        </Link>
      </div>
    </div>
  );
}
