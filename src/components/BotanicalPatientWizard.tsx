import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, ArrowRight, Activity, Droplets, Shield, Zap, Info } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { toast } from 'sonner';

interface BotanicalPatientWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  plotId?: string;
  plotName?: string;
}

const STEPS = [
  { id: 'diagnosis', title: 'Diagnosis', icon: <Activity size={20} /> },
  { id: 'prescription', title: 'Prescription', icon: <Droplets size={20} /> },
  { id: 'application', title: 'Application', icon: <Zap size={20} /> },
  { id: 'recovery', title: 'Recovery Plan', icon: <Check size={20} /> },
];

const TREATMENTS = [
  { id: 'Organic Neem', label: 'Neem Oil', icon: '🧴', type: 'Pesticide' },
  { id: 'Copper Fungicide', label: 'Copper', icon: '🧪', type: 'Fungicide' },
  { id: 'Compost Tea', label: 'Compost Tea', icon: '☕', type: 'Nutrient' },
  { id: 'BT Spray', label: 'BT Spray', icon: '🦠', type: 'Biological' },
];

export default function BotanicalPatientWizard({ isOpen, onClose, onSave, plotId, plotName }: BotanicalPatientWizardProps) {
  const [step, setStep] = useState(0);
  const [diagnosis, setDiagnosis] = useState('');
  const [selectedTreatment, setSelectedTreatment] = useState<string | null>(null);
  const [dosage, setDosage] = useState(1);
  const [notes, setNotes] = useState('');

  const currentStepId = STEPS[step].id;

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      handleFinalize();
    }
  };

  const handleFinalize = () => {
    if (!diagnosis || !selectedTreatment) return;

    const xp = 25; // Base XP for treatment

    onSave({
      diagnosis,
      treatment: selectedTreatment,
      dosage,
      notes,
      xp,
      plotId,
      plotName,
      timestamp: new Date().toISOString()
    });
    onClose();
    toast.success(`Treatment logged! Earned ${xp} XP.`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-8 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary">
              <Activity size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black font-headline tracking-tight">Botanical Patient</h2>
              <p className="text-xs font-bold text-on-surface-variant opacity-50 uppercase tracking-widest">Medical Log: {plotName || 'General'}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-stone-200 rounded-full transition-colors"><X /></button>
        </div>

        {/* Progress Bar */}
        <div className="flex px-8 pt-6 gap-2">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex-1 space-y-2">
              <div className={cn(
                "h-1.5 rounded-full transition-all",
                i <= step ? "bg-secondary" : "bg-stone-200"
              )} />
              <p className={cn(
                "text-[8px] font-black uppercase tracking-widest text-center",
                i === step ? "text-secondary" : "text-stone-400"
              )}>{s.title}</p>
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="space-y-8"
            >
              {currentStepId === 'diagnosis' && (
                <div className="space-y-6">
                  <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant">What are the symptoms?</label>
                  <textarea 
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    placeholder="e.g. Yellowing leaves, powdery mildew on stems..."
                    className="w-full bg-stone-100 border-none rounded-2xl px-6 py-4 font-bold min-h-[150px]"
                  />
                  <div className="flex gap-2 flex-wrap">
                    {['Pests', 'Fungus', 'Nutrient Deficiency', 'Heat Stress'].map(tag => (
                      <button 
                        key={tag}
                        onClick={() => setDiagnosis(prev => prev ? `${prev}, ${tag}` : tag)}
                        className="px-4 py-2 bg-stone-100 hover:bg-stone-200 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                      >
                        + {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {currentStepId === 'prescription' && (
                <div className="grid grid-cols-2 gap-4">
                  {TREATMENTS.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTreatment(t.id)}
                      className={cn(
                        "p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 group",
                        selectedTreatment === t.id 
                          ? "bg-secondary border-secondary text-white shadow-lg shadow-secondary/20 scale-105" 
                          : "bg-stone-50 border-transparent hover:border-secondary/30"
                      )}
                    >
                      <span className="text-4xl group-hover:scale-110 transition-transform">{t.icon}</span>
                      <div className="text-center">
                        <p className="font-black text-sm">{t.label}</p>
                        <p className={cn(
                          "text-[10px] font-bold uppercase tracking-widest opacity-60",
                          selectedTreatment === t.id ? "text-white" : "text-on-surface-variant"
                        )}>{t.type}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {currentStepId === 'application' && (
                <div className="space-y-8">
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant">Application Dosage</label>
                      <span className="text-4xl font-black text-secondary">{dosage}x</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="5" 
                      step="0.5"
                      value={dosage} 
                      onChange={(e) => setDosage(parseFloat(e.target.value))}
                      className="w-full h-3 bg-stone-100 rounded-full appearance-none cursor-pointer accent-secondary"
                    />
                    <div className="flex justify-between text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                      <span>Light</span>
                      <span>Standard</span>
                      <span>Heavy</span>
                    </div>
                  </div>
                </div>
              )}

              {currentStepId === 'recovery' && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Recovery Notes</label>
                    <textarea 
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Next inspection date, expected results..."
                      className="w-full bg-stone-100 border-none rounded-2xl px-6 py-4 font-bold min-h-[100px]"
                    />
                  </div>

                  <div className="bg-secondary/5 p-8 rounded-[2.5rem] border border-secondary/10 flex flex-col items-center text-center space-y-4">
                    <div className="w-20 h-20 bg-secondary text-white rounded-full flex items-center justify-center shadow-xl shadow-secondary/20">
                      <Droplets size={40} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black font-headline">Prescription Logged</h3>
                      <p className="text-sm font-medium text-on-surface-variant">Treatment protocol for {selectedTreatment} has been recorded.</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-stone-100 bg-stone-50/50 flex gap-4">
          {step > 0 && (
            <button 
              onClick={() => setStep(step - 1)}
              className="px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-on-surface-variant hover:bg-stone-200 transition-all"
            >
              Back
            </button>
          )}
          <button 
            onClick={handleNext}
            disabled={
              (step === 1 && !selectedTreatment) ||
              (step === 0 && !diagnosis)
            }
            className="flex-1 bg-secondary text-white font-black py-4 rounded-2xl hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {step === STEPS.length - 1 ? 'Log Treatment' : 'Continue'}
            <ArrowRight size={18} />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
