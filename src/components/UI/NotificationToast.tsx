import React from 'react';
import { useStore } from '../../context/StoreContext';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const NotificationToast: React.FC = () => {
  const { toasts, removeToast } = useStore();

  return (
    <div id="toast-container" className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4 sm:px-0">
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-xl border backdrop-blur-md transition-all ${
              toast.type === 'success'
                ? 'bg-emerald-900/95 text-white border-emerald-700/60 shadow-emerald-950/30'
                : toast.type === 'warning'
                ? 'bg-amber-900/95 text-white border-amber-700/60 shadow-amber-950/30'
                : toast.type === 'error'
                ? 'bg-rose-900/95 text-white border-rose-700/60 shadow-rose-950/30'
                : 'bg-slate-900/95 text-white border-slate-700/60 shadow-slate-950/30'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-300" />}
              {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-300" />}
              {toast.type === 'error' && <XCircle className="w-5 h-5 text-rose-300" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-sky-300" />}
            </div>

            <p className="text-sm font-medium leading-snug flex-1">
              {toast.message}
            </p>

            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 text-white/70 hover:text-white transition-colors p-0.5 rounded-lg hover:bg-white/10"
              aria-label="Cerrar notificación"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
