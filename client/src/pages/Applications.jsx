import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FileText, MessageSquare, MapPin, Calendar, ArrowLeft, User, Briefcase, Check, X, ExternalLink, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Spinner, EmptyState, StatusBadge, Alert, SkillTag } from '../components/ui';
import { formatDistanceToNow, format } from 'date-fns';
import api from '../api/client';

const STATUSES = ['submitted', 'accepted', 'rejected'];

// ── Individual Application Detail Page ──────────────────────────────────────
function ApplicationDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isEmployer = user?.role === 'employer';
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/applications/${id}`)
      .then(({ data }) => setApp(data))
      .catch(() => setError('Failed to load application.'))
      .finally(() => setLoading(false));
  }, [id]);

  const updateStatus = async (status) => {
    setUpdating(true);
    try {
      const { data } = await api.patch(`/applications/${id}/status`, { status });
      setApp(prev => ({ ...prev, status: data.status }));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const startChat = async () => {
    try {
      const otherId = isEmployer ? app.candidate._id : app.employer._id;
      await api.post(`/chat/conversations/with/${otherId}`);
      navigate('/chat');
    } catch (err) {
      setError(err.response?.data?.message || 'Cannot start chat');
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  if (error && !app) return <Alert type="error" message={error} />;
  if (!app) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <button onClick={() => navigate('/applications')} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 text-sm font-medium transition-colors">
        <ArrowLeft size={16} /> Back to Applications
      </button>

      {error && <Alert type="error" message={error} />}

      {/* Header Card */}
      <div className="card p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center flex-shrink-0">
              <span className="font-bold text-brand-700 text-lg">
                {isEmployer ? app.candidate?.name?.charAt(0) : app.job?.title?.charAt(0)}
              </span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">{app.job?.title}</h1>
              <p className="text-slate-500 mt-0.5">{app.job?.company}</p>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-slate-400">
                {app.job?.location && (
                  <span className="flex items-center gap-1"><MapPin size={13} />{app.job.location}</span>
                )}
                <span className="flex items-center gap-1">
                  <Clock size={13} />Applied {formatDistanceToNow(new Date(app.createdAt), { addSuffix: true })}
                </span>
              </div>
            </div>
          </div>
          <StatusBadge status={app.status} />
        </div>

        <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100">
          <Link to={`/jobs/${app.job?._id}`} className="btn-secondary text-sm flex items-center gap-1.5">
            <ExternalLink size={14} /> View Job
          </Link>
          <button onClick={startChat} className="btn-secondary text-sm flex items-center gap-1.5">
            <MessageSquare size={14} /> {isEmployer ? `Chat with ${app.candidate?.name}` : 'Chat with Employer'}
          </button>
        </div>
      </div>

      {/* Candidate info (employer view) */}
      {isEmployer && (
        <div className="card p-6">
          <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <User size={17} className="text-brand-500" /> Candidate Profile
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-slate-500">Name</p>
              <p className="font-semibold text-slate-900">{app.candidate?.name}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Email</p>
              <a href={`mailto:${app.candidate?.email}`} className="font-medium text-brand-600 hover:text-brand-700">{app.candidate?.email}</a>
            </div>
            {app.candidate?.education && (
              <div>
                <p className="text-sm text-slate-500">Education</p>
                <p className="font-medium text-slate-800">{app.candidate.education}</p>
              </div>
            )}
            {app.candidate?.bio && (
              <div>
                <p className="text-sm text-slate-500 mb-1">About</p>
                <p className="text-slate-700 leading-relaxed">{app.candidate.bio}</p>
              </div>
            )}
            {app.candidate?.skills?.length > 0 && (
              <div>
                <p className="text-sm text-slate-500 mb-2">Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {app.candidate.skills.map(s => <SkillTag key={s} skill={s} />)}
                </div>
              </div>
            )}
            {app.candidate?.portfolioLink && (
              <div>
                <p className="text-sm text-slate-500">Portfolio</p>
                <a href={app.candidate.portfolioLink} target="_blank" rel="noreferrer"
                  className="text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1">
                  <ExternalLink size={13} /> {app.candidate.portfolioLink}
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Cover Letter */}
      {app.coverLetter && (
        <div className="card p-6">
          <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <FileText size={17} className="text-brand-500" /> Cover Letter
          </h2>
          <div className="prose prose-sm max-w-none">
            <p className="text-slate-700 leading-relaxed whitespace-pre-wrap text-base">{app.coverLetter}</p>
          </div>
        </div>
      )}

      {/* Actions (employer only) */}
      {isEmployer && app.status === 'submitted' && (
        <div className="card p-6">
          <h2 className="font-bold text-slate-900 mb-4">Decision</h2>
          <p className="text-slate-500 text-sm mb-4">Accept or reject this candidate's application.</p>
          <div className="flex gap-3">
            <button
              onClick={() => updateStatus('accepted')}
              disabled={updating}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
            >
              {updating ? <Spinner size="sm" /> : <><Check size={17} /> Accept</>}
            </button>
            <button
              onClick={() => updateStatus('rejected')}
              disabled={updating}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
            >
              {updating ? <Spinner size="sm" /> : <><X size={17} /> Reject</>}
            </button>
          </div>
        </div>
      )}

      {isEmployer && app.status !== 'submitted' && (
        <div className="card p-4">
          <p className="text-sm text-slate-500 text-center">
            Status set to <strong className="text-slate-700">{app.status}</strong>.{' '}
            <button onClick={() => updateStatus('submitted')} disabled={updating} className="text-brand-600 hover:underline">
              Reset to submitted
            </button>
          </p>
        </div>
      )}
    </div>
  );
}

// ── Applications List ────────────────────────────────────────────────────────
export default function Applications({ detail }) {
  if (detail) return <ApplicationDetail />;

  const { user } = useAuth();
  const navigate = useNavigate();
  const isEmployer = user?.role === 'employer';
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/applications')
      .then(({ data }) => setApps(data))
      .catch(() => setError('Failed to load applications.'))
      .finally(() => setLoading(false));
  }, []);

  const displayed = filter === 'all' ? apps : apps.filter(a => a.status === filter);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-header">{isEmployer ? 'Received Applications' : 'My Applications'}</h1>
        <p className="text-slate-500 text-sm">{isEmployer ? 'Click any application to review details and make a decision' : 'Track the status of your job applications'}</p>
      </div>

      {error && <Alert type="error" message={error} />}

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {['all', ...STATUSES].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all capitalize ${filter === s ? 'bg-brand-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'}`}>
            {s === 'all' ? `All (${apps.length})` : `${s} (${apps.filter(a => a.status === s).length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : displayed.length === 0 ? (
        <EmptyState
          icon={FileText}
          title={filter === 'all' ? 'No applications yet' : `No ${filter} applications`}
          description={!isEmployer && filter === 'all' ? 'Start applying to jobs to see your applications here.' : ''}
          action={!isEmployer && filter === 'all' ? <Link to="/jobs" className="btn-primary">Browse Jobs</Link> : null}
        />
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {displayed.map(app => (
            <button
              key={app._id}
              onClick={() => navigate(`/applications/${app._id}`)}
              className="card p-5 text-left hover:shadow-lg transition-all hover:-translate-y-0.5 animate-slide-up cursor-pointer w-full"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-brand-700 text-sm">
                      {isEmployer ? app.candidate?.name?.charAt(0) : app.job?.title?.charAt(0)}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-slate-900 truncate">{app.job?.title}</h3>
                    <p className="text-sm text-slate-500">
                      {isEmployer ? `by ${app.candidate?.name}` : app.job?.company}
                    </p>
                  </div>
                </div>
                <StatusBadge status={app.status} />
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-400 mb-3">
                {app.job?.location && <span className="flex items-center gap-1"><MapPin size={11} />{app.job.location}</span>}
                <span className="flex items-center gap-1">
                  <Calendar size={11} />{formatDistanceToNow(new Date(app.createdAt), { addSuffix: true })}
                </span>
              </div>

              {isEmployer && app.candidate?.skills?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {app.candidate.skills.slice(0, 3).map(s => <SkillTag key={s} skill={s} />)}
                  {app.candidate.skills.length > 3 && (
                    <span className="text-xs text-slate-400">+{app.candidate.skills.length - 3} more</span>
                  )}
                </div>
              )}

              {app.coverLetter && (
                <p className="text-xs text-slate-500 line-clamp-2 mt-1 italic">
                  "{app.coverLetter.slice(0, 120)}{app.coverLetter.length > 120 ? '…' : ''}"
                </p>
              )}

              <div className="mt-3 pt-3 border-t border-slate-50 text-xs text-brand-600 font-medium flex items-center gap-1">
                View details →
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
