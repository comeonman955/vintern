import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Zap, User, Briefcase, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Alert, Spinner } from '../components/ui';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [form, setForm] = useState({
    name: '', email: '', password: '', role: params.get('role') || 'candidate', company: '',
  });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) return setError('Password must be at least 6 characters.');
    setLoading(true);
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-[0.9fr_1fr] bg-stone-100 rounded-lg overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,0.35)]">
        <div className="hidden lg:flex p-10 flex-col justify-between bg-slate-950 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-300 flex items-center justify-center">
              <Zap className="w-5 h-5 text-slate-950" fill="currentColor" />
            </div>
            <div>
              <span className="block font-black text-2xl leading-none">Vintern</span>
              <span className="block text-[10px] uppercase tracking-[0.24em] text-cyan-200 mt-1">career workspace</span>
            </div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-lime-300 font-black mb-4">start here</p>
            <h2 className="text-5xl font-black leading-none">Build a sharper internship pipeline.</h2>
            <div className="space-y-3 mt-8">
              {['Matched opportunities', 'Task reviews', 'Candidate-employer chat'].map(item => (
                <div key={item} className="flex items-center gap-3 rounded-lg bg-white/10 border border-white/10 p-3">
                  <CheckCircle2 size={18} className="text-cyan-300" />
                  <span className="font-semibold">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-sm text-slate-400 max-w-sm">Create one account, then use Vintern as either a hiring desk or an internship search workspace.</p>
        </div>

        <div className="p-6 sm:p-10">
          <div className="flex lg:hidden items-center justify-center gap-2.5 mb-8">
            <div className="w-10 h-10 rounded-lg bg-slate-950 flex items-center justify-center">
              <Zap className="w-5 h-5 text-cyan-300" fill="currentColor" />
            </div>
            <span className="font-black text-2xl text-slate-950">Vintern</span>
          </div>

          <h1 className="font-black text-3xl text-slate-950 mb-1">Create your account</h1>
          <p className="text-slate-500 text-sm mb-6">Choose how you want to use Vintern.</p>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { value: 'candidate', label: 'Candidate', icon: User, desc: 'Find internships' },
              { value: 'employer', label: 'Employer', icon: Briefcase, desc: 'Hire interns' },
            ].map(({ value, label, icon: Icon, desc }) => (
              <button
                key={value}
                type="button"
                onClick={() => setForm(p => ({ ...p, role: value }))}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  form.role === value
                    ? 'border-slate-950 bg-white shadow-[0_12px_28px_rgba(15,23,42,0.12)]'
                    : 'border-slate-200 bg-stone-50 hover:border-cyan-400'
                }`}
              >
                <Icon size={20} className={form.role === value ? 'text-cyan-700 mb-2' : 'text-slate-400 mb-2'} />
                <div className="text-sm font-black text-slate-900">{label}</div>
                <div className="text-xs text-slate-500">{desc}</div>
              </button>
            ))}
          </div>

          {error && <div className="mb-4"><Alert type="error" message={error} onClose={() => setError('')} /></div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Full name</label>
              <input type="text" className="input" placeholder="John Doe" value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
            </div>
            {form.role === 'employer' && (
              <div>
                <label className="label">Company name</label>
                <input type="text" className="input" placeholder="Acme Corp" value={form.company}
                  onChange={e => setForm(p => ({ ...p, company: e.target.value }))} />
              </div>
            )}
            <div>
              <label className="label">Email</label>
              <input type="email" className="input" placeholder="you@example.com" value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input type={show ? 'text' : 'password'} className="input pr-10" placeholder="Min. 6 characters"
                  value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
              {loading ? <><Spinner size="sm" /> Creating account...</> : 'Create account'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-cyan-700 font-black hover:text-cyan-800">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
