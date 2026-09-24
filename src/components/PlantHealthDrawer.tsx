import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Leaf, ShieldAlert, ClipboardList } from 'lucide-react';
import type { Inhabitant } from '../types';
import { getThreatsForPlant } from '../constants/threats';
import ThreatCard from './ThreatCard';

export default function PlantHealthDrawer({
  plant,
  onClose,
  onLogTreatment,
}: {
  plant: Inhabitant | null;
  onClose: () => void;
  onLogTreatment: () => void;
}) {
  const threats = plant ? getThreatsForPlant(plant.name) : [];

  return (
    <AnimatePresence>
      {plant && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-stone-900/50 z-[70]"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[71] bg-stone-50 rounded-t-[2rem] max-h-[85vh] flex flex-col shadow-2xl"
          >
            <div className="pt-3 pb-2 flex justify-center shrink-0">
              <div className="w-12 h-1.5 bg-stone-300 rounded-full" />
            </div>
            <div className="flex items-center gap-3 px-5 pb-4 shrink-0">
              {plant.image ? (
                <img src={plant.image} className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Leaf size={24} className="text-primary" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-black text-stone-900 truncate">{plant.name}</h3>
                <p className="text-xs font-semibold text-stone-500 flex items-center gap-1">
                  <ShieldAlert size={12} />
                  {threats.length > 0
                    ? `${threats.length} known threat${threats.length > 1 ? 's' : ''} to watch for`
                    : 'No common threats recorded for this plant'}
                </p>
              </div>
              <button onClick={onClose} className="p-2 bg-stone-200/70 rounded-full hover:bg-stone-300 transition-colors">
                <X size={18} className="text-stone-600" />
              </button>
            </div>

            <div className="overflow-y-auto px-5 pb-5 space-y-3 grow">
              {threats.map((t) => (
                <ThreatCard key={t.id} threat={t} />
              ))}
              {threats.length === 0 && (
                <div className="bg-white rounded-2xl border border-stone-200/80 p-5 text-center">
                  <p className="text-sm font-medium text-stone-500">
                    Nothing in the threat library targets {plant.name} yet. General vigilance still applies — check leaf undersides weekly.
                  </p>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-stone-200 bg-white/80 backdrop-blur shrink-0">
              <button
                onClick={onLogTreatment}
                className="w-full flex items-center justify-center gap-2 bg-primary text-white font-bold text-sm py-3.5 rounded-2xl shadow-lg active:scale-[0.98] transition-transform"
              >
                <ClipboardList size={16} />
                Log a treatment or sighting
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
