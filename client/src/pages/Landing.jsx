import { Link } from 'react-router-dom';
import { Zap, Briefcase, MessageSquare, ClipboardList, ArrowRight, Users, TrendingUp, CheckCircle2, MapPin } from 'lucide-react';

const features = [
  { icon: Briefcase, title: 'Curated roles', desc: 'A focused feed of internships, projects, and junior work matched to candidate skills.' },
  { icon: ClipboardList, title: 'Task-based hiring', desc: 'Employers can assign real project work and review progress inside one workspace.' },
  { icon: MessageSquare, title: 'Built-in communication', desc: 'Candidates and employers move from application to interview without leaving Vintern.' },
  { icon: TrendingUp, title: 'Progress visibility', desc: 'Applications, tasks, and outcomes are tracked as a clear operating system.' },
];

const stats = [
  { value: '2,400+', label: 'open roles' },
  { value: '18k+', label: 'candidate profiles' },
  { value: '94%', label: 'match accuracy' },
  { value: '350+', label: 'hiring teams' },
];

const jobs = [
  { title: 'Product Design Intern', company: 'Northstar Labs', location: 'Remote', match: '96%' },
  { title: 'Frontend Engineer Intern', company: 'Cloudline', location: 'Hybrid', match: '91%' },
  { title: 'Data Analyst Intern', company: 'Signal Works', location: 'Remote', match: '88%' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-stone-100 text-slate-950">
      <nav className="max-w-7xl mx-auto px-5 sm:px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-slate-950 flex items-center justify-center">
            <Zap className="w-4 h-4 text-cyan-300" fill="currentColor" />
          </div>
          <div>
            <span className="block font-black text-xl leading-none">Vintern</span>
            <span className="block text-[10px] uppercase tracking-[0.24em] text-slate-500 mt-1">career workspace</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/login" className="text-sm font-bold text-slate-700 hover:text-slate-950 px-3 py-2 rounded-lg hover:bg-white transition-all">
            Sign in
          </Link>
          <Link to="/register" className="btn-primary text-sm">
            Get started
          </Link>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-5 sm:px-6 pt-8 pb-16 lg:pb-20">
        <div className="grid lg:grid-cols-[1.02fr_0.98fr] gap-8 lg:gap-12 items-stretch">
          <div className="min-h-[72vh] flex flex-col justify-center py-8">
            <div className="inline-flex w-fit items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-[0.16em] text-slate-700 mb-6">
              <span className="w-2 h-2 rounded-full bg-lime-400" />
              internships without the clutter
            </div>
            <h1 className="font-black text-5xl sm:text-6xl lg:text-7xl leading-[0.94] tracking-normal max-w-3xl">
              Vintern
              <span className="block text-cyan-700">turns hiring into a workspace.</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mt-6 leading-relaxed">
              Discover internships, evaluate candidates with real tasks, chat in context, and keep every application moving from one sharp dashboard.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <Link to="/register?role=candidate" className="btn-primary text-base px-7 py-3 flex items-center justify-center gap-2">
                Find internships <ArrowRight size={18} />
              </Link>
              <Link to="/register?role=employer" className="btn-secondary text-base px-7 py-3 flex items-center justify-center gap-2">
                <Users size={18} />
                Hire interns
              </Link>
            </div>
          </div>

          <div className="min-h-[72vh] bg-slate-950 rounded-lg p-4 sm:p-5 text-white shadow-[0_30px_80px_rgba(15,23,42,0.28)] flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-cyan-200 font-bold">live board</p>
                <h2 className="font-black text-2xl mt-1">Candidate matches</h2>
              </div>
              <div className="px-3 py-1 rounded-md bg-lime-300 text-slate-950 text-xs font-black">ACTIVE</div>
            </div>

            <div className="grid sm:grid-cols-3 gap-3 py-5">
              {stats.slice(0, 3).map(({ value, label }) => (
                <div key={label} className="bg-white/[0.08] border border-white/10 rounded-lg p-4">
                  <div className="font-black text-2xl">{value}</div>
                  <div className="text-xs text-slate-300 mt-1">{label}</div>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              {jobs.map((job) => (
                <div key={job.title} className="bg-white rounded-lg p-4 text-slate-950 flex items-center gap-3">
                  <div className="w-11 h-11 rounded-lg bg-cyan-100 flex items-center justify-center font-black text-cyan-800">
                    {job.company.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-black truncate">{job.title}</p>
                    <p className="text-sm text-slate-500 truncate">{job.company}</p>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-1"><MapPin size={12} />{job.location}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-black text-emerald-600">{job.match}</div>
                    <div className="text-[10px] uppercase tracking-[0.16em] text-slate-400 font-bold">match</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 bg-cyan-300 text-slate-950 rounded-lg p-4 flex items-center gap-3">
              <CheckCircle2 size={22} />
              <p className="font-bold text-sm">3 interviews moved forward this week from task reviews.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 lg:py-20 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-5 sm:px-6">
          <div className="grid lg:grid-cols-[0.7fr_1.3fr] gap-8 items-start">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-700">platform</p>
              <h2 className="font-black text-4xl mt-3">A cleaner way to manage early-career hiring.</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {features.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="border border-slate-200 rounded-lg p-5 bg-stone-50">
                  <div className="w-10 h-10 rounded-lg bg-slate-950 flex items-center justify-center mb-4">
                    <Icon size={19} className="text-cyan-300" />
                  </div>
                  <h3 className="font-black text-slate-950 mb-2">{title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="max-w-7xl mx-auto px-5 sm:px-6 py-8 flex flex-col sm:flex-row gap-3 items-center justify-between text-sm text-slate-500">
        <span>© {new Date().getFullYear()} Vintern. All rights reserved.</span>
        <div className="flex gap-5 font-semibold">
          {stats.map(({ value, label }) => <span key={label}>{value} {label}</span>)}
        </div>
      </footer>
    </div>
  );
}
