import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Leaf, ShieldAlert, ChevronLeft, ChevronRight, Search, ListChecks, ClipboardList, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';
import type { Inhabitant } from '../types';
import {
  SYMPTOM_OPTIONS,
  identifyThreats,
  getThreatsForPlant,
  type SymptomTag,
  type PlantThreat,
  type ThreatMatch,
} from '../constants/threats';
import ThreatCard, { ThreatPhoto } from './ThreatCard';

type Step = 'start' | 'symptoms' | 'matches' | 'solution';

const severityStyles: Record<PlantThreat['severity'], string> = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-amber-100 text-amber-800',
  low: 'bg-stone-100 text-stone-600',
};

function DrawerHeader({ plant, onClose, onBack }: { plant: Inhabitant; onClose: () => void; onBack?: () => void }) {
  return (
    <div className="flex items-center gap-3 px-5 pb-4 shrink-0">
      {onBack && (
        <button onClick={onBack} className="p-2 -ml-2 hover:bg-stone-200/60 rounded-full transition-colors">
          <ChevronLeft size={20} className="text-stone-600" />
        </button>
      )}
      {plant.image ? (
        <img src={plant.image} className="w-12 h-12 rounded-2xl object-cover border-2 border-white shadow" referrerPolicy="no-referrer" />
      ) : (
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Leaf size={22} className="text-primary" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-black text-stone-900 truncate">{plant.name}</h3>
        <p className="text-xs font-semibold text-stone-500">Plant health check</p>
      </div>
      <button onClick={onClose} className="p-2 bg-stone-200/70 rounded-full hover:bg-stone-300 transition-colors">
        <X size={18} className="text-stone-600" />
      </button>
    </div>
  );
}

export default function PlantHealthDrawer({
  plant,
  onClose,
  onLogTreatment,
  onLogUnknown,
}: {
  plant: Inhabitant | null;
  onClose: () => void;
  onLogTreatment: (threat: PlantThreat) => void;
  onLogUnknown: (symptomLabels: string[]) => void;
}) {
  const [step, setStep] = useState<Step>('start');
  const [picked, setPicked] = useState<Set<SymptomTag>>(new Set());
  const [match, setMatch] = useState<ThreatMatch | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  // Reset the flow whenever a different plant is opened
  useEffect(() => {
    setStep('start');
    setPicked(new Set());
    setMatch(null);
    setConfirmed(false);
    setDismissed(new Set());
  }, [plant?.id]);

  const toggleOption = (tags: SymptomTag[]) => {
    const allOn = tags.every((t) => picked.has(t));
    setPicked((prev) => {
      const next = new Set(prev);
      tags.forEach((t) => (allOn ? next.delete(t) : next.add(t)));
      return next;
    });
  };

  const matches = plant
    ? identifyThreats(plant.name, [...picked]).filter((m) => !dismissed.has(m.threat.id))
    : [];
  const allThreats = plant ? getThreatsForPlant(plant.name) : [];

  const openMatch = (m: ThreatMatch) => {
    setMatch(m);
    setConfirmed(false);
    setStep('solution');
  };

  const rejectMatch = () => {
    if (match) {
      setDismissed((prev) => new Set(prev).add(match.threat.id));
    }
    setMatch(null);
    setConfirmed(false);
    setStep('matches');
  };

  const symptomLabels = [...new Set(
    [...picked].map((t) => SYMPTOM_OPTIONS.find((o) => o.tags.includes(t))?.label).filter(Boolean) as string[]
  )];

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
            className="fixed bottom-0 left-0 right-0 z-[71] bg-stone-50 rounded-t-[2rem] max-h-[88vh] flex flex-col shadow-2xl"
          >
            <div className="pt-3 pb-2 flex justify-center shrink-0">
              <div className="w-12 h-1.5 bg-stone-300 rounded-full" />
            </div>

            {/* ---------- START ---------- */}
            {step === 'start' && (
              <>
                <DrawerHeader plant={plant} onClose={onClose} />
                <div className="overflow-y-auto px-5 pb-5 space-y-3 grow">
                  <button
                    onClick={() => setStep('symptoms')}
                    className="w-full flex items-center gap-4 bg-white rounded-2xl border-2 border-primary/30 p-5 text-left hover:border-primary hover:shadow-md active:scale-[0.99] transition-all"
                  >
                    <span className="text-3xl">🔍</span>
                    <div className="flex-1">
                      <p className="text-base font-black text-stone-900">Identify a problem</p>
                      <p className="text-xs font-medium text-stone-500">Tell me what you see — I'll narrow down the culprit</p>
                    </div>
                    <ChevronRight size={20} className="text-primary" />
                  </button>
                  <button
                    onClick={() => setStep('matches') /* browse-all mode */}
                    className="w-full flex items-center gap-4 bg-white rounded-2xl border border-stone-200 p-5 text-left hover:shadow-md active:scale-[0.99] transition-all"
                  >
                    <span className="text-3xl">📋</span>
                    <div className="flex-1">
                      <p className="text-base font-black text-stone-900">Browse all threats</p>
                      <p className="text-xs font-medium text-stone-500">
                        {allThreats.length > 0
                          ? `${allThreats.length} known threats for ${plant.name}`
                          : `No recorded threats for ${plant.name}`}
                      </p>
                    </div>
                    <ChevronRight size={20} className="text-stone-400" />
                  </button>
                </div>
              </>
            )}

            {/* ---------- SYMPTOMS ---------- */}
            {step === 'symptoms' && (
              <>
                <DrawerHeader plant={plant} onClose={onClose} onBack={() => setStep('start')} />
                <div className="overflow-y-auto px-5 pb-4 grow">
                  <p className="text-sm font-bold text-stone-800 mb-3">What do you see on your {plant.name}? <span className="font-medium text-stone-500">Pick all that apply.</span></p>
                  <div className="grid grid-cols-2 gap-2.5">
                    {SYMPTOM_OPTIONS.map((opt) => {
                      const active = opt.tags.every((t) => picked.has(t));
                      return (
                        <button
                          key={opt.label}
                          onClick={() => toggleOption(opt.tags)}
                          className={cn(
                            'flex items-center gap-2.5 rounded-2xl border-2 p-3.5 text-left transition-all active:scale-[0.97]',
                            active
                              ? 'border-primary bg-primary/10 shadow-sm'
                              : 'border-stone-200 bg-white hover:border-stone-300'
                          )}
                        >
                          <span className="text-2xl shrink-0">{opt.emoji}</span>
                          <span className={cn('text-xs font-bold leading-tight', active ? 'text-primary' : 'text-stone-700')}>{opt.label}</span>
                          {active && <CheckCircle2 size={16} className="text-primary ml-auto shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="p-4 border-t border-stone-200 bg-white/80 backdrop-blur shrink-0">
                  <button
                    onClick={() => setStep('matches')}
                    disabled={picked.size === 0}
                    className="w-full flex items-center justify-center gap-2 bg-primary text-white font-bold text-sm py-3.5 rounded-2xl shadow-lg active:scale-[0.98] transition-all disabled:opacity-40 disabled:shadow-none"
                  >
                    <Search size={16} />
                    Find culprits{picked.size > 0 && matches.length > 0 ? ` (${matches.length})` : ''}
                  </button>
                </div>
              </>
            )}

            {/* ---------- MATCHES / BROWSE ---------- */}
            {step === 'matches' && (
              <>
                <DrawerHeader plant={plant} onClose={onClose} onBack={() => setStep(picked.size > 0 ? 'symptoms' : 'start')} />
                <div className="overflow-y-auto px-5 pb-5 space-y-3 grow">
                  {picked.size > 0 ? (
                    <>
                      <p className="text-sm font-bold text-stone-800">
                        {matches.length > 0 ? (
                          <>Likely culprits <span className="font-medium text-stone-500">— tap one for the fix</span></>
                        ) : (
                          <>No matches <span className="font-medium text-stone-500">— try fewer symptoms, or browse everything below</span></>
                        )}
                      </p>
                      {matches.length === 0 && (
                        <div className="bg-amber-50 rounded-2xl border-2 border-dashed border-amber-300 p-5 text-center space-y-2.5">
                          <p className="text-2xl">🔍</p>
                          <p className="text-sm font-black text-stone-900">
                            {dismissed.size > 0 ? 'Ran out of suspects' : "Can't find it?"}
                          </p>
                          <p className="text-xs font-medium text-stone-600">
                            {dismissed.size > 0
                              ? 'You ruled out every match — it may not be in the library yet.'
                              : 'Nothing in the library fits those symptoms yet — log what you see so it\'s on record.'}
                          </p>
                          <button
                            onClick={() => onLogUnknown(symptomLabels)}
                            className="w-full bg-stone-900 hover:bg-stone-800 active:scale-[0.98] transition-all text-white text-sm font-black py-3 rounded-2xl"
                          >
                            Log as unknown issue
                          </button>
                        </div>
                      )}
                      {matches.map((m) => (
                        <button
                          key={m.threat.id}
                          onClick={() => openMatch(m)}
                          className="w-full flex items-center gap-3 bg-white rounded-2xl border border-stone-200 p-3.5 text-left hover:shadow-md hover:border-primary/40 active:scale-[0.99] transition-all"
                        >
                          <ThreatPhoto threat={m.threat} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <p className="text-sm font-black text-stone-900">{m.threat.name}</p>
                              <span className={cn('text-[9px] font-black uppercase tracking-wide px-1.5 py-0.5 rounded-full', severityStyles[m.threat.severity])}>
                                {m.threat.severity}
                              </span>
                            </div>
                            <p className="text-[11px] font-medium text-stone-500 mt-0.5">
                              Matches: {m.matchedTags.map((t) => SYMPTOM_OPTIONS.find((o) => o.tags.includes(t))?.label.toLowerCase()).filter(Boolean).join(', ')}
                            </p>
                          </div>
                          <ChevronRight size={18} className="text-stone-400 shrink-0" />
                        </button>
                      ))}
                      <div className="pt-2">
                        <p className="text-[10px] font-black uppercase tracking-wider text-stone-500 mb-2">Or browse everything for {plant.name}</p>
                        <div className="space-y-2.5">
                          {allThreats.filter((t) => !matches.some((m) => m.threat.id === t.id)).map((t) => (
                            <ThreatCard key={t.id} threat={t} compact />
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-bold text-stone-800 flex items-center gap-1.5">
                        <ListChecks size={16} className="text-stone-500" />
                        All known threats for {plant.name}
                      </p>
                      {allThreats.length === 0 && (
                        <div className="bg-white rounded-2xl border border-stone-200/80 p-5 text-center">
                          <p className="text-sm font-medium text-stone-500">
                            Nothing in the threat library targets {plant.name} yet. General vigilance still applies — check leaf undersides weekly.
                          </p>
                        </div>
                      )}
                      {allThreats.map((t) => (
                        <ThreatCard key={t.id} threat={t} compact />
                      ))}
                    </>
                  )}
                </div>
              </>
            )}

            {/* ---------- SOLUTION ---------- */}
            {step === 'solution' && match && (
              <>
                <DrawerHeader plant={plant} onClose={onClose} onBack={() => setStep('matches')} />
                <div className="overflow-y-auto px-5 pb-4 grow space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{match.threat.icon}</span>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="text-lg font-black text-stone-900">{match.threat.name}</h4>
                        <span className={cn('text-[9px] font-black uppercase tracking-wide px-1.5 py-0.5 rounded-full', severityStyles[match.threat.severity])}>
                          {match.threat.severity}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide flex items-center gap-1">
                        <ShieldAlert size={11} />
                        {match.threat.type === 'pest' ? 'Pest' : 'Disease'} on your {plant.name}
                      </p>
                    </div>
                  </div>

                  <ThreatPhoto threat={match.threat} size="large" />

                  {!confirmed ? (
                    <div className="bg-white rounded-2xl border-2 border-stone-200 p-4 text-center space-y-3">
                      <p className="text-sm font-black text-stone-900">Does this look like your plant's problem?</p>
                      <p className="text-xs font-medium text-stone-500">Compare the photo with what you see out there.</p>
                      <div className="grid grid-cols-2 gap-2.5">
                        <button
                          onClick={() => setConfirmed(true)}
                          className="bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] transition-all text-white text-sm font-black py-3 rounded-2xl"
                        >
                          Yes, that's it
                        </button>
                        <button
                          onClick={rejectMatch}
                          className="bg-stone-100 hover:bg-stone-200 active:scale-[0.98] transition-all text-stone-700 text-sm font-black py-3 rounded-2xl"
                        >
                          No, not quite
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-4">
                        <p className="text-xs font-black uppercase tracking-wider text-emerald-800 mb-3">Do this now</p>
                        <ol className="space-y-3">
                          {match.threat.quickFix.map((fix, i) => (
                            <li key={i} className="flex gap-3 items-start">
                              <span className="shrink-0 w-7 h-7 rounded-full bg-emerald-600 text-white text-sm font-black flex items-center justify-center">
                                {i + 1}
                              </span>
                              <p className="text-sm font-bold text-emerald-950 leading-snug pt-0.5">{fix}</p>
                            </li>
                          ))}
                        </ol>
                      </div>
                      <button
                        onClick={rejectMatch}
                        className="w-full text-center text-xs font-bold text-stone-500 underline underline-offset-2 py-1"
                      >
                        Actually, this isn't it — try the other suspects
                      </button>
                    </>
                  )}

                  <div>
                    <p className="text-[10px] font-black uppercase tracking-wider text-stone-500 mb-2">Full details</p>
                    <ThreatCard threat={match.threat} compact />
                  </div>
                </div>
                {confirmed && (
                  <div className="p-4 border-t border-stone-200 bg-white/80 backdrop-blur shrink-0">
                    <button
                      onClick={() => onLogTreatment(match.threat)}
                      className="w-full flex items-center justify-center gap-2 bg-primary text-white font-bold text-sm py-3.5 rounded-2xl shadow-lg active:scale-[0.98] transition-transform"
                    >
                      <ClipboardList size={16} />
                      Log this treatment
                    </button>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
