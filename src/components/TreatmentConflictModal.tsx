import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, X, Check, ArrowRight } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface TreatmentConflictModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  conflictMessage: string;
  actionName: string;
  conflictingAction: string;
  conflictingDate: string;
}

export default function TreatmentConflictModal({
  isOpen,
  onClose,
  onConfirm,
  conflictMessage,
  actionName,
  conflictingAction,
  conflictingDate
}: TreatmentConflictModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl border border-error/20"
        >
          <div className="p-8 bg-error/5 border-b border-error/10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-error/10 text-error rounded-2xl flex items-center justify-center">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black font-headline tracking-tight text-error">Treatment Conflict</h2>
                <p className="text-[10px] font-black text-error/60 uppercase tracking-widest">Phytotoxicity Warning</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-error/10 rounded-full transition-colors text-error">
              <X size={20} />
            </button>
          </div>

          <div className="p-8 space-y-6">
            <div className="space-y-4">
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100">
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">New Action</p>
                <p className="font-black text-lg text-primary">{actionName}</p>
              </div>

              <div className="flex items-center justify-center py-2">
                <div className="h-8 w-0.5 bg-error/20 relative">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-error rounded-full" />
                </div>
              </div>

              <div className="p-4 bg-error/5 rounded-2xl border border-error/10">
                <p className="text-xs font-bold text-error uppercase tracking-widest mb-2">Conflicting Log</p>
                <p className="font-black text-lg text-error">{conflictingAction}</p>
                <p className="text-xs font-medium text-error/60 mt-1">Performed on {conflictingDate}</p>
              </div>
            </div>

            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
              <p className="text-sm font-medium text-amber-900 leading-relaxed">
                {conflictMessage}
              </p>
            </div>

            <p className="text-xs font-medium text-on-surface-variant text-center px-4">
              Proceeding may cause severe chemical burn or plant death. Are you absolutely sure?
            </p>
          </div>

          <div className="p-8 bg-stone-50/50 border-t border-stone-100 flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-on-surface-variant hover:bg-stone-200 transition-all"
            >
              Abort Mission
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 bg-error text-white font-black py-4 rounded-2xl hover:shadow-lg hover:shadow-error/20 transition-all flex items-center justify-center gap-2"
            >
              Proceed Anyway <ArrowRight size={18} />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
