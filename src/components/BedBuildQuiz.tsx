import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight, ArrowLeft, Check, Search, Sun, Leaf, Sprout, Loader2 } from 'lucide-react';
import { PLANT_DATABASE, PlantInfo } from '../constants/plants';
import { useFirebase } from '../contexts/FirebaseContext';
import { db, collection, addDoc, serverTimestamp, handleFirestoreError, OperationType } from '../firebase';
import { toast } from 'sonner';
import { cn } from '@/src/lib/utils';

interface BedBuildQuizProps {
  onClose: () => void;
  onComplete: (plotId: string) => void;
}

const SUN_OPTIONS = ['Full Sun', 'Partial Shade', 'Full Shade'];
const SOIL_OPTIONS = ['Loam', 'Clay', 'Sandy', 'Raised Bed Mix'];
const TABS = ['Vegetable', 'Herb', 'Flower', 'All'] as const;

// Map the plant database type onto the Inhabitant type enum
function mapInhabitantType(t: string): string {
  if (t === 'Vegetable' || t === 'Herb' || t === 'Perennial') return t;
  if (t === 'Flower' || t === 'Wildflower') return 'Flower';
  return 'Annual';
}

export default function BedBuildQuiz({ onClose, onComplete }: BedBuildQuizProps) {
  const { user } = useFirebase();
  const [step, setStep] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  // Step 1 — bed basics
  const [bedName, setBedName] = useState('');
  const [widthFt, setWidthFt] = useState('4');
  const [depthFt, setDepthFt] = useState('8');
  const [sun, setSun] = useState('Full Sun');
  const [soil, setSoil] = useState('Loam');

  // Step 2 — plant picks (indices into PLANT_DATABASE)
  const [tab, setTab] = useState<(typeof TABS)[number]>('Vegetable');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return PLANT_DATABASE.map((p, i) => ({ p, i })).filter(({ p }) => {
      if (tab !== 'All' && p.type !== tab) return false;
      if (q && !p.name.toLowerCase().includes(q) && !p.scientific.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [tab, search]);

  const togglePlant = (i: number) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const canNextStep1 = bedName.trim().length > 0 && Number(widthFt) > 0 && Number(depthFt) > 0;
  const canFinish = selected.size > 0;

  const handleBuild = async () => {
    if (!user || isSaving || !canFinish) return;
    setIsSaving(true);
    try {
      const w = Math.max(1, Math.min(30, Math.round(Number(widthFt) || 4)));
      const h = Math.max(1, Math.min(20, Math.round(Number(depthFt) || 8)));

      // 1. Create the plot
      const plotRef = await addDoc(collection(db, 'spatial_plots'), {
        ownerUid: user.uid,
        name: bedName.trim(),
        status: 'Active',
        soilType: soil,
        sunExposure: sun,
        gridConfig: { cols: w, rows: h },
        healthStatus: 'Stable',
        createdAt: serverTimestamp(),
        mapLayout: []
      });

      // 2. Create the bed (planter) sized to the quiz dimensions
      await addDoc(collection(db, 'planters'), {
        ownerUid: user.uid,
        plotId: plotRef.id,
        name: `${bedName.trim()} bed`,
        type: 'Raised Bed',
        gridPosition: { x: 0, y: 0 },
        size: { w, h },
        color: '#4CAF50',
        createdAt: serverTimestamp()
      });

      // 3. Create one inhabitant per chosen plant — unmapped so they land in the rail
      const picks: PlantInfo[] = [...selected].map(i => PLANT_DATABASE[i]);
      for (const plant of picks) {
        await addDoc(collection(db, 'inhabitants'), {
          ownerUid: user.uid,
          name: plant.name,
          latinName: plant.scientific,
          type: mapInhabitantType(plant.type),
          image: plant.image,
          waterFreq: plant.water,
          sunExposure: plant.sun,
          status: 'Pending',
          plotId: plotRef.id,
          gridPosition: { x: 0, y: 0 },
          createdAt: serverTimestamp()
        });
      }

      toast.success(`${bedName.trim()} built with ${picks.length} plant${picks.length === 1 ? '' : 's'} — drag them onto the bed!`);
      onComplete(plotRef.id);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'spatial_plots');
      setIsSaving(false);
    }
  };

  const steps = ['Your bed', 'Pick plants', 'Review'];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 24 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 24 }}
        className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="p-6 pb-0 flex items-start justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Bed Build Quiz</p>
            <h3 className="text-2xl font-headline font-black tracking-tight mt-1">
              {step === 0 && 'Tell us about your bed'}
              {step === 1 && 'Choose what to grow'}
              {step === 2 && 'Ready to build?'}
            </h3>
            {/* Step dots */}
            <div className="flex gap-2 mt-3">
              {steps.map((label, i) => (
                <div key={label} className="flex items-center gap-2">
                  <div className={cn(
                    'w-2.5 h-2.5 rounded-full transition-colors',
                    i === step ? 'bg-primary scale-125' : i < step ? 'bg-primary/60' : 'bg-stone-200'
                  )} />
                  <span className={cn('text-[10px] font-bold', i === step ? 'text-primary' : 'text-stone-400')}>{label}</span>
                </div>
              ))}
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full text-on-surface-variant">
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="s0" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/60 ml-1">Bed name</label>
                  <input
                    type="text" autoFocus value={bedName} onChange={e => setBedName(e.target.value)}
                    placeholder="e.g. Sunny Corner Bed"
                    className="w-full bg-surface-container-low border-none rounded-2xl px-6 py-4 font-bold focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/60 ml-1">Width (ft)</label>
                    <input
                      type="number" min={1} max={30} value={widthFt} onChange={e => setWidthFt(e.target.value)}
                      className="w-full bg-surface-container-low border-none rounded-2xl px-6 py-4 font-bold focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/60 ml-1">Depth (ft)</label>
                    <input
                      type="number" min={1} max={20} value={depthFt} onChange={e => setDepthFt(e.target.value)}
                      className="w-full bg-surface-container-low border-none rounded-2xl px-6 py-4 font-bold focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/60 ml-1">Sun exposure</label>
                  <div className="flex gap-2">
                    {SUN_OPTIONS.map(o => (
                      <button key={o} onClick={() => setSun(o)}
                        className={cn('flex-1 py-3 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2',
                          sun === o ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high')}>
                        <Sun size={14} /> {o}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/60 ml-1">Soil type</label>
                  <div className="flex gap-2 flex-wrap">
                    {SOIL_OPTIONS.map(o => (
                      <button key={o} onClick={() => setSoil(o)}
                        className={cn('px-5 py-3 rounded-2xl text-xs font-black transition-all',
                          soil === o ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high')}>
                        {o}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} className="space-y-4">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50" />
                    <input
                      type="text" value={search} onChange={e => setSearch(e.target.value)}
                      placeholder="Search plants..."
                      className="w-full bg-surface-container-low border-none rounded-2xl pl-11 pr-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  {TABS.map(t => (
                    <button key={t} onClick={() => setTab(t)}
                      className={cn('px-4 py-2 rounded-full text-xs font-black transition-all',
                        tab === t ? 'bg-primary text-white shadow' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high')}>
                      {t === 'All' ? 'All' : `${t}s`}
                    </button>
                  ))}
                  <span className="ml-auto text-xs font-bold text-primary self-center">{selected.size} picked</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[38vh] overflow-y-auto pr-1 custom-scrollbar">
                  {filtered.map(({ p, i }) => {
                    const isSel = selected.has(i);
                    return (
                      <button key={i} onClick={() => togglePlant(i)}
                        className={cn('relative rounded-2xl overflow-hidden border-2 text-left transition-all group',
                          isSel ? 'border-primary shadow-lg shadow-primary/20' : 'border-transparent hover:border-primary/40')}>
                        <div className="aspect-square bg-stone-100 overflow-hidden">
                          <img src={p.image} alt={p.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform" referrerPolicy="no-referrer" />
                        </div>
                        <div className="p-2.5 bg-white">
                          <p className="text-xs font-black truncate">{p.name}</p>
                          <p className="text-[10px] text-on-surface-variant italic truncate">{p.scientific}</p>
                        </div>
                        <div className={cn('absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center transition-all',
                          isSel ? 'bg-primary text-white' : 'bg-white/80 text-transparent border border-stone-200')}>
                          <Check size={14} strokeWidth={3} />
                        </div>
                      </button>
                    );
                  })}
                </div>
                {filtered.length === 0 && (
                  <p className="text-center text-sm text-on-surface-variant italic py-8">No plants match — try another search.</p>
                )}
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} className="space-y-5">
                <div className="bg-surface-container-low rounded-3xl p-5 space-y-2">
                  <div className="flex items-center gap-2 text-primary"><Sprout size={16} /><span className="text-xs font-black uppercase tracking-widest">Your bed</span></div>
                  <p className="font-headline font-black text-xl">{bedName.trim()}</p>
                  <p className="text-sm text-on-surface-variant font-medium">
                    {widthFt} × {depthFt} ft · {sun} · {soil}
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-primary mb-3"><Leaf size={16} /><span className="text-xs font-black uppercase tracking-widest">Plants to place ({selected.size})</span></div>
                  <div className="flex gap-3 overflow-x-auto pb-2 snap-x custom-scrollbar">
                    {[...selected].map(i => {
                      const p = PLANT_DATABASE[i];
                      return (
                        <div key={i} className="shrink-0 snap-start w-20 flex flex-col items-center gap-1.5">
                          <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-primary/30 shadow-sm">
                            <img src={p.image} alt={p.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                          <span className="text-[10px] font-bold text-center leading-tight line-clamp-2">{p.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <p className="text-xs text-on-surface-variant italic">
                  After building, your plants appear in the sliding rail on the plot page — drag each one onto the bed.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-6 pt-2 flex gap-3">
          {step > 0 ? (
            <button onClick={() => setStep(s => s - 1)}
              className="px-6 py-4 rounded-2xl font-black text-on-surface-variant hover:bg-surface-container-high transition-colors flex items-center gap-2">
              <ArrowLeft size={18} /> Back
            </button>
          ) : (
            <button onClick={onClose}
              className="px-6 py-4 rounded-2xl font-black text-on-surface-variant hover:bg-surface-container-high transition-colors">
              Cancel
            </button>
          )}
          <div className="flex-1" />
          {step < 2 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              disabled={step === 0 ? !canNextStep1 : !canFinish}
              className="px-8 py-4 bg-primary text-white rounded-2xl font-black shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all flex items-center gap-2 disabled:opacity-40 disabled:hover:scale-100">
              {step === 0 ? 'Pick plants' : 'Review'} <ArrowRight size={18} />
            </button>
          ) : (
            <button
              onClick={handleBuild}
              disabled={!canFinish || isSaving}
              className="px-8 py-4 bg-primary text-white rounded-2xl font-black shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all flex items-center gap-2 disabled:opacity-40 disabled:hover:scale-100">
              {isSaving ? <><Loader2 size={18} className="animate-spin" /> Building...</> : <><Check size={18} /> Build my bed</>}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
