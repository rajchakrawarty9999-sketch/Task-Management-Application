import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTasks } from '../../context/TaskContext';
import { X, Lock, Mail, User, Shield } from 'lucide-react';

export const AuthModal = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, addToast } = useTasks();
  const { login, register, demoLogin, teamMembers } = useAuth();

  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Frontend Developer'
  });
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isRegister) {
        await register(formData.name, formData.email, formData.password, formData.role);
        addToast(`Welcome aboard, ${formData.name}!`, 'success');
      } else {
        await login(formData.email, formData.password);
        addToast('Logged in successfully!', 'success');
      }
      setIsAuthModalOpen(false);
    } catch (err) {
      addToast(err.message || 'Authentication error', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-sm bg-[#0f1118] rounded-2xl border border-amber-500/20 shadow-2xl p-5 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="mb-5 text-center">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 mx-auto flex items-center justify-center text-black shadow-gold-sm mb-2.5">
            <Lock className="w-5 h-5 stroke-[2.5]" />
          </div>
          <h3 className="text-base font-bold text-slate-100 tracking-tight">
            {isRegister ? 'Create TaskEngine Account' : 'Welcome to TaskEngine'}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {isRegister ? 'Sign up to access workspace' : 'Sign in to access your dashboard'}
          </p>
        </div>

        {/* 1-Click Demo Sign-in */}
        <div className="mb-4 p-2.5 rounded-xl bg-[#090b10] border border-white/[0.06]">
          <p className="text-[10px] font-mono uppercase tracking-wider text-amber-400/80 mb-1.5 font-bold text-center">
            1-Click Demo Sign-in
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            {teamMembers.slice(0, 4).map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={async () => {
                  await demoLogin(m.id);
                  addToast(`Logged in as ${m.name}`, 'success');
                  setIsAuthModalOpen(false);
                }}
                className="flex items-center gap-2 p-1.5 rounded-lg bg-[#141620] hover:bg-[#181c2a] border border-white/[0.04] text-left transition-colors"
              >
                <img src={m.avatar} alt={m.name} className="w-5 h-5 rounded-md object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-slate-200 truncate">{m.name.split(' ')[0]}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="relative my-3.5 flex items-center justify-center">
          <div className="w-full border-t border-white/[0.06]" />
          <span className="bg-[#0f1118] px-2 text-[10px] uppercase font-mono text-slate-500 absolute">
            Or credentials
          </span>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {isRegister && (
            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Elena Rostova"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full h-9 gold-input rounded-xl pl-8 pr-3 text-xs"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">Email</label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="alex@taskengine.dev"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full h-9 gold-input rounded-xl pl-8 pr-3 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                className="w-full h-9 gold-input rounded-xl pl-8 pr-3 text-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-9 rounded-xl btn-gold text-xs font-bold mt-2 shadow-gold-sm"
          >
            {isRegister ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className="mt-3 text-center">
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="text-xs text-amber-400 hover:underline"
          >
            {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Create one"}
          </button>
        </div>
      </div>
    </div>
  );
};
