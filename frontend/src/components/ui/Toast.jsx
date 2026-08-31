import React from 'react';
import { useTasks } from '../../context/TaskContext';
import { CheckCircle2, AlertCircle, Info, X, Zap } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, removeToast } = useTasks();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-xs w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-2xl border shadow-2xl flex items-start gap-2.5 animate-slide-up bg-[#0f1118] ${
              isSuccess
                ? 'border-emerald-500/30 text-slate-200 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                : isError
                ? 'border-rose-500/30 text-slate-200 shadow-[0_0_15px_rgba(244,63,94,0.1)]'
                : 'border-amber-500/30 text-slate-200 shadow-[0_0_15px_rgba(245,158,11,0.1)]'
            }`}
          >
            <div className="mt-0.5 flex-shrink-0">
              {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              {isError && <AlertCircle className="w-4 h-4 text-rose-400" />}
              {!isSuccess && !isError && <Zap className="w-4 h-4 text-amber-400" />}
            </div>

            <div className="flex-1 min-w-0">
              {toast.title && (
                <h4 className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-300 mb-0.5">
                  {toast.title}
                </h4>
              )}
              <p className="text-xs text-slate-200 font-normal leading-snug">
                {toast.message}
              </p>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-500 hover:text-slate-200 p-0.5 rounded hover:bg-white/5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
