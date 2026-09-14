import React, { useState } from 'react';
import { Plus, X, Target, Stethoscope, Sprout, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MasterWizard from './MasterWizard';

const GlobalActionHub: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeWizard, setActiveWizard] = useState<string | null>(null);

  const actions = [
    { id: 'weeding', label: 'Weeding', icon: Target, color: 'bg-amber-500' },
    { id: 'treatment', label: 'Treatment', icon: Stethoscope, color: 'bg-red-500' },
    { id: 'planting', label: 'Planting', icon: Sprout, color: 'bg-green-500' },
    { id: 'observation', label: 'Observation', icon: Eye, color: 'bg-blue-500' },
  ];

  return (
    <>
      <div className="fixed bottom-24 right-6 z-50">
        <AnimatePresence>
          {isOpen && (
            <div className="flex flex-col gap-3 mb-4 items-end">
              {actions.map((action, index) => (
                <motion.button
                  key={action.id}
                  initial={{ opacity: 0, scale: 0.5, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.5, y: 20 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => {
                    setActiveWizard(action.id);
                    setIsOpen(false);
                  }}
                  className={`${action.color} text-white p-4 rounded-full shadow-xl flex items-center gap-3 hover:scale-105 transition-transform`}
                >
                  <span className="font-bold text-sm px-2">{action.label}</span>
                  <action.icon size={24} />
                </motion.button>
              ))}
            </div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`p-5 rounded-full shadow-2xl transition-all duration-300 ${
            isOpen ? 'bg-stone-800 rotate-45' : 'bg-primary'
          } text-white`}
        >
          <Plus size={32} />
        </button>
      </div>

      {activeWizard && (
        <MasterWizard 
          type={activeWizard} 
          onClose={() => setActiveWizard(null)} 
        />
      )}
    </>
  );
};

export default GlobalActionHub;
