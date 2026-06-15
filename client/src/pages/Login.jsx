import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Alert, Spinner } from '../components/ui';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid lg:grid-cols-[1fr_0.82fr] bg-stone-100 rounded-lg overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,0.35)]">
        <div className="hidden lg:flex min-h-[640px] p-10 flex-col justify-between bg-slate-950 text-white">
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
            <p className="text-xs uppercase tracking-[0.24em] text-lime-300 font-black mb-4">welcome back</p>
            <h2 className="text-5xl font-black leading-none">Pick up every application where you left it.</h2>
            <div className="grid grid-cols-2 gap-3 mt-8">
              <div className="rounded-lg bg-white/10 border border-white/10 p-4">
                <p className="text-3xl font-black">24</p>
                <p className="text-sm text-slate-300">new role matches</p>
              </div>
              <div className="rounded-lg bg-cyan-300 text-slate-950 p-4">
                <p className="text-3xl font-black">7</p>
                <p className="text-sm font-semibold">tasks in review</p>
              </div>
            </div>
          </div>
          <p className="text-sm text-slate-400 max-w-sm">A focused dashboard for internships, tasks, chats, and candidate decisions.</p>
        </div>

        <div className="p-6 sm:p-10 flex items-center">
          <div className="w-full">
            <div className="flex lg:hidden items-center justify-center gap-2.5 mb-8">
              <div className="w-10 h-10 rounded-lg bg-slate-950 flex items-center justify-center">
                <Zap className="w-5 h-5 text-cyan-300" fill="currentColor" />
              </div>
              <span className="font-black text-2xl text-slate-950">Vintern</span>
            </div>

            <h1 className="font-black text-3xl text-slate-950 mb-1">Welcome back</h1>
            <p className="text-slate-500 text-sm mb-6">Sign in to continue to your workspace.</p>

            {error && <div className="mb-4"><Alert type="error" message={error} onClose={() => setError('')} /></div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Email</label>
                <input
                  type="email"
                  className="input"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="label">Password</label>
                <div className="relative">
                  <input
                    type={show ? 'text' : 'password'}
                    className="input pr-10"
                    placeholder="Password"
                    value={form.password}
                    onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                    required
                  />
                  <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
                {loading ? <><Spinner size="sm" /> Signing in...</> : 'Sign in'}
              </button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-6">
              Don't have an account?{' '}
              <Link to="/register" className="text-cyan-700 font-black hover:text-cyan-800">Create one</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
