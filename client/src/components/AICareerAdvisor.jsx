import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Trash2, Lightbulb } from 'lucide-react';
import { Spinner } from './ui';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';

const suggestions = [
  'What skills should I learn to become a frontend developer?',
  'How can I improve my chances of getting hired?',
  'What should I put in my portfolio?',
  'How do I prepare for a technical interview?',
  'How do I write a strong cover letter?',
  'What salary should I expect as a junior developer?',
];

function Message({ msg }) {
  const isAI = msg.role === 'ai';
  return (
    <div className={`flex gap-3 ${isAI ? 'flex-row' : 'flex-row-reverse'}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${isAI ? 'bg-gradient-to-br from-emerald-500 to-teal-600' : 'bg-gradient-to-br from-brand-500 to-brand-600'}`}>
        {isAI ? <Bot size={15} className="text-white" /> : <User size={15} className="text-white" />}
      </div>
      <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${isAI ? 'bg-white border border-slate-100 text-slate-700 rounded-tl-sm shadow-sm' : 'bg-brand-600 text-white rounded-tr-sm'}`}>
        {msg.text}
      </div>
    </div>
  );
}

export default function AICareerAdvisor() {
  const { user } = useAuth();
  const STORAGE_KEY = `vintern_career_chat_${user?._id || 'guest'}`;
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(`vintern_career_chat_${user?._id || 'guest'}`);
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Persist chat history
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {}
  }, [messages]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const ask = async (q) => {
    const text = (q || question).trim();
    if (!text) return;
    setQuestion('');
    const userMsg = { role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    try {
      const { data } = await api.post('/ai/career-advice', { question: text });
      setMessages(prev => [...prev, { role: 'ai', text: data.advice }]);
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: 'Sorry, I could not get advice right now. Please try again.' }]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const clearHistory = () => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div className="flex flex-col h-full min-h-[600px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
            <Bot size={17} className="text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">AI Career Advisor</h3>
            <p className="text-xs text-slate-500">Powered by Claude AI · History saved</p>
          </div>
        </div>
        {messages.length > 0 && (
          <button onClick={clearHistory} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-500 transition-colors px-2 py-1.5 rounded-lg hover:bg-red-50">
            <Trash2 size={13} /> Clear chat
          </button>
        )}
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1" style={{ minHeight: 300, maxHeight: 500 }}>
        {messages.length === 0 ? (
          <div className="py-6">
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center mx-auto mb-3">
                <Lightbulb size={24} className="text-emerald-600" />
              </div>
              <p className="font-semibold text-slate-800">Ask me anything about your career</p>
              <p className="text-sm text-slate-500 mt-1">I'll remember our conversation during this session</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-2">
              {suggestions.map(s => (
                <button key={s} onClick={() => ask(s)}
                  className="text-left text-sm px-4 py-3 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 rounded-xl text-slate-600 hover:text-slate-900 transition-all leading-snug">
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, i) => <Message key={i} msg={msg} />)}
            {loading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Bot size={15} className="text-white" />
                </div>
                <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                  <div className="flex gap-1.5 items-center">
                    {[0, 150, 300].map(d => (
                      <div key={d} className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div className="flex gap-2 pt-4 border-t border-slate-100">
        <input
          ref={inputRef}
          className="input flex-1"
          placeholder="Ask about your career, skills, interviews..."
          value={question}
          onChange={e => setQuestion(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && !loading && ask()}
          disabled={loading}
        />
        <button
          onClick={() => ask()}
          disabled={!question.trim() || loading}
          className="btn-primary px-4 flex-shrink-0 flex items-center gap-2"
        >
          {loading ? <Spinner size="sm" /> : <Send size={16} />}
        </button>
      </div>
    </div>
  );
}
