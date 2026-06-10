import { useEffect, useState } from 'react';
import { Users, ClipboardList, CheckCircle2, Clock, Upload, ExternalLink, MessageSquare, ChevronDown, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Spinner, EmptyState, StatusBadge, SkillTag, Alert } from '../components/ui';
import { formatDistanceToNow, format } from 'date-fns';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client';

function TaskStatusIcon({ status }) {
  if (status === 'done') return <CheckCircle2 size={14} className="text-teal-500" />;
  if (status === 'submitted') return <Upload size={14} className="text-blue-500" />;
  return <Clock size={14} className="text-slate-400" />;
}

function InternCard({ intern }) {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const { candidate, job, tasks, _id: appId } = intern;

  const taskStats = {
    total: tasks.length,
    done: tasks.filter(t => t.status === 'done').length,
    submitted: tasks.filter(t => t.status === 'submitted').length,
    assigned: tasks.filter(t => t.status === 'assigned').length,
  };

  const startChat = async () => {
    try {
      await api.post(`/chat/conversations/with/${candidate._id}`);
      navigate('/chat');
    } catch {}
  };

  return (
    <div className="card overflow-hidden animate-slide-up">
      {/* Intern Header */}
      <div className="p-5">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
            {candidate?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-900 text-lg">{candidate?.name}</h3>
            <p className="text-sm text-slate-500">{candidate?.email}</p>
            <p className="text-xs text-brand-600 font-medium mt-0.5">{job?.title}</p>
          </div>
          <div className="flex flex-col gap-2 items-end">
            <Link to={`/applications/${appId}`} className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5">
              <ExternalLink size={12} /> Application
            </Link>
            <button onClick={startChat} className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5">
              <MessageSquare size={12} /> Chat
            </button>
          </div>
        </div>

        {/* Profile info */}
        {candidate?.bio && (
          <p className="text-sm text-slate-600 mb-3 leading-relaxed line-clamp-2">{candidate.bio}</p>
        )}
        {candidate?.education && (
          <p className="text-xs text-slate-500 mb-3">🎓 {candidate.education}</p>
        )}
        {candidate?.skills?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {candidate.skills.map(s => <SkillTag key={s} skill={s} />)}
          </div>
        )}

        {/* Task stats */}
        <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl mb-4">
          <div className="text-center">
            <p className="text-xl font-bold text-teal-600">{taskStats.done}</p>
            <p className="text-xs text-slate-500">Done</p>
          </div>
          <div className="text-center border-x border-slate-200">
            <p className="text-xl font-bold text-blue-600">{taskStats.submitted}</p>
            <p className="text-xs text-slate-500">Submitted</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-slate-600">{taskStats.assigned}</p>
            <p className="text-xs text-slate-500">Pending</p>
          </div>
        </div>

        {/* Task expand toggle */}
        {tasks.length > 0 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-between text-sm font-medium text-slate-700 hover:text-brand-600 transition-colors py-1"
          >
            <span className="flex items-center gap-2">
              <ClipboardList size={15} />
              {tasks.length} task{tasks.length !== 1 ? 's' : ''}
            </span>
            {expanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
          </button>
        )}
      </div>

      {/* Task list */}
      {expanded && tasks.length > 0 && (
        <div className="border-t border-slate-100">
          {tasks.map((task, idx) => (
            <div key={task._id} className={`px-5 py-4 ${idx < tasks.length - 1 ? 'border-b border-slate-50' : ''}`}>
              <div className="flex items-start justify-between gap-3 mb-1">
                <div className="flex items-center gap-2 min-w-0">
                  <TaskStatusIcon status={task.status} />
                  <span className="font-medium text-slate-800 text-sm truncate">{task.title}</span>
                </div>
                <StatusBadge status={task.status} />
              </div>
              <p className="text-xs text-slate-500 ml-5 mb-2 leading-relaxed">{task.description}</p>
              <div className="flex items-center gap-4 ml-5 text-xs text-slate-400">
                {task.dueDate && (
                  <span className="text-amber-600 font-medium">Due {format(new Date(task.dueDate), 'MMM d, yyyy')}</span>
                )}
                <span>{formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}</span>
                {task.submissionFile && (
                  <a href={task.submissionFile} target="_blank" rel="noreferrer"
                    className="text-brand-600 hover:text-brand-700 flex items-center gap-1">
                    <ExternalLink size={10} /> File
                  </a>
                )}
              </div>
              {task.submissionNote && (
                <div className="ml-5 mt-2 p-2 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-700"><span className="font-medium">Note:</span> {task.submissionNote}</p>
                </div>
              )}
              {task.reviewNote && (
                <div className="ml-5 mt-2 p-2 bg-teal-50 rounded-lg">
                  <p className="text-xs text-teal-700"><span className="font-medium">Feedback:</span> {task.reviewNote}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Interns() {
  const { user } = useAuth();
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/applications/interns')
      .then(({ data }) => setInterns(data))
      .catch(() => setError('Failed to load interns.'))
      .finally(() => setLoading(false));
  }, []);

  if (user?.role !== 'employer') return null;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-header">My Interns & Employees</h1>
        <p className="text-slate-500 text-sm">View accepted interns, their profiles, and task progress</p>
      </div>

      {error && <Alert type="error" message={error} />}

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : interns.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No interns yet"
          description="Accept candidate applications to see your interns here."
          action={<Link to="/applications" className="btn-primary">Go to Applications</Link>}
        />
      ) : (
        <>
          <div className="grid grid-cols-3 gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="text-center">
              <p className="text-2xl font-bold text-brand-600">{interns.length}</p>
              <p className="text-sm text-slate-500">Total Interns</p>
            </div>
            <div className="text-center border-x border-slate-100">
              <p className="text-2xl font-bold text-teal-600">
                {interns.reduce((sum, i) => sum + i.tasks.filter(t => t.status === 'done').length, 0)}
              </p>
              <p className="text-sm text-slate-500">Tasks Done</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {interns.reduce((sum, i) => sum + i.tasks.filter(t => t.status === 'submitted').length, 0)}
              </p>
              <p className="text-sm text-slate-500">Awaiting Review</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {interns.map(intern => (
              <InternCard key={intern._id} intern={intern} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
