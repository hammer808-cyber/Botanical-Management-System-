import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, X } from 'lucide-react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  itemCount?: number;
  isDeleting?: boolean;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Deletion",
  message,
  itemCount,
  isDeleting = false
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3 text-destructive">
                <div className="p-2 bg-destructive/10 rounded-full">
                  <AlertTriangle size={24} />
                </div>
                <h3 className="text-xl font-bold text-stone-900">{title}</h3>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-stone-100 rounded-full transition-colors"
                disabled={isDeleting}
              >
                <X size={20} className="text-stone-500" />
              </button>
            </div>

            <div className="mb-8">
              <p className="text-stone-600 leading-relaxed">
                {message}
                {itemCount && itemCount > 0 && (
                  <span className="block mt-2 font-semibold text-stone-900">
                    You are about to delete {itemCount} {itemCount === 1 ? 'item' : 'items'}.
                  </span>
                )}
                <span className="block mt-2 text-sm font-medium text-destructive">
                  This action cannot be undone.
                </span>
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                disabled={isDeleting}
                className="flex-1 px-4 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-xl transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={isDeleting}
                className="flex-1 px-4 py-3 bg-destructive hover:bg-destructive/90 text-white font-semibold rounded-xl transition-all shadow-lg shadow-destructive/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Confirm Delete'
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
