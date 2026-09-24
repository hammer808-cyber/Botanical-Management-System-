import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeftRight,
  CheckCircle2,
  XCircle,
  MinusCircle,
  Sprout,
  ChevronDown,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { PLANT_DATABASE } from '../constants/plants';
import {
  checkPairCompatibility,
  getFriendsOf,
  type PairVerdict,
} from '../services/botanyService';
import { cn } from '../lib/utils';

const PLANT_NAMES = [...new Set(PLANT_DATABASE.map((p) => p.name))].sort();

function plantImage(name: string): string | undefined {
  return PLANT_DATABASE.find((p) => p.name === name)?.image;
}

function PlantCard({ name, side }: { name: string; side: 'left' | 'right' }) {
  const [imgFailed, setImgFailed] = useState(false);
  const img = plantImage(name);
  const friends = getFriendsOf(name).slice(0, 4);

  return (
    <motion.div
      initial={{ x: side === 'left' ? -60 : 60, opacity: 0, scale: 0.92 }}
      animate={{ x: 0, opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      className="flex-1 bg-white rounded-3xl border-2 border-stone-200 overflow-hidden shadow-sm"
    >
      <div className="h-28 sm:h-36 bg-stone-100 relative">
        {img && !imgFailed ? (
          <img
            src={img}
            alt={name}
            loading="lazy"
            onError={() => setImgFailed(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Sprout size={40} className="text-stone-300" />
          </div>
        )}
      </div>
      <div className="p-3 sm:p-4">
        <p className="font-black text-stone-900 text-sm sm:text-base leading-tight">{name}</p>
        {friends.length > 0 && (
          <div className="mt-2">
            <p className="text-[10px] font-black uppercase tracking-wider text-stone-400 mb-1.5 flex items-center gap-1">
              <Sparkles size={10} /> Loves
            </p>
            <div className="flex flex-wrap gap-1">
              {friends.map((f) => (
                <span
                  key={f}
                  className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-100"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

const verdictStyles: Record<PairVerdict, { banner: string; icon: typeof CheckCircle2; iconColor: string; title: string }> = {
  compatible: {
    banner: 'bg-gradient-to-br from-emerald-500 to-green-600 border-emerald-700',
    icon: CheckCircle2,
    iconColor: 'text-white',
    title: 'Great pair!',
  },
  clash: {
    banner: 'bg-gradient-to-br from-rose-500 to-red-600 border-red-700',
    icon: XCircle,
    iconColor: 'text-white',
    title: 'Keep them apart',
  },
  neutral: {
    banner: 'bg-gradient-to-br from-amber-400 to-orange-500 border-amber-600',
    icon: MinusCircle,
    iconColor: 'text-white',
    title: 'No known issues',
  },
};

function SparkleBurst() {
  const dots = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        id: i,
        x: Math.cos((i / 10) * Math.PI * 2) * (60 + (i % 3) * 22),
        y: Math.sin((i / 10) * Math.PI * 2) * (60 + (i % 3) * 22),
        delay: (i % 4) * 0.08,
        size: 5 + (i % 3) * 3,
      })),
    []
  );
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
      {dots.map((d) => (
        <motion.span
          key={d.id}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{ x: d.x, y: d.y, opacity: 0, scale: 0.3 }}
          transition={{ duration: 0.9, delay: 0.25 + d.delay, ease: 'easeOut' }}
          className="absolute rounded-full bg-white"
          style={{ width: d.size, height: d.size }}
        />
      ))}
    </div>
  );
}

function PlantSelect({
  value,
  onChange,
  label,
  exclude,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
  exclude: string;
}) {
  return (
    <label className="block flex-1">
      <span className="text-[10px] font-black uppercase tracking-wider text-stone-500 mb-1.5 block">
        {label}
      </span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-white border-2 border-stone-200 rounded-2xl pl-4 pr-10 py-3.5 text-sm font-black text-stone-900 focus:border-primary focus:outline-none"
        >
          <option value="">Pick a plant…</option>
          {PLANT_NAMES.filter((n) => n !== exclude).map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        <ChevronDown
          size={18}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
        />
      </div>
    </label>
  );
}

export default function CompanionChecker() {
  const [plantA, setPlantA] = useState('');
  const [plantB, setPlantB] = useState('');

  const ready = plantA !== '' && plantB !== '';
  const check = useMemo(
    () => (ready ? checkPairCompatibility(plantA, plantB) : null),
    [plantA, plantB, ready]
  );
  const style = check ? verdictStyles[check.verdict] : null;
  const VerdictIcon = style?.icon ?? MinusCircle;

  const swap = () => {
    setPlantA(plantB);
    setPlantB(plantA);
  };

  const reset = () => {
    setPlantA('');
    setPlantB('');
  };

  return (
    <div className="px-5 sm:px-6 max-w-3xl mx-auto py-8 space-y-6">
      {/* Header */}
      <div>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-2 block">
          Shopping & planning tool
        </span>
        <h2 className="text-4xl sm:text-5xl font-black text-stone-900 tracking-tight leading-none mb-3">
          Companion <span className="text-primary italic">Check</span>
        </h2>
        <p className="text-stone-500 font-medium max-w-md">
          At the nursery holding a seedling? Pick your plant and its future neighbor — find out if
          they'll thrive together before they share a bed.
        </p>
      </div>

      {/* Pickers */}
      <div className="flex items-end gap-2.5">
        <PlantSelect value={plantA} onChange={setPlantA} label="Your plant" exclude="" />
        <button
          onClick={swap}
          disabled={!plantA && !plantB}
          aria-label="Swap plants"
          className="shrink-0 w-12 h-12 mb-0.5 rounded-2xl bg-stone-900 text-white flex items-center justify-center hover:bg-stone-700 active:scale-95 transition-all disabled:opacity-30"
        >
          <ArrowLeftRight size={18} />
        </button>
        <PlantSelect value={plantB} onChange={setPlantB} label="Future neighbor" exclude="" />
      </div>

      {/* Arena */}
      <div className="relative">
        <div className="flex items-stretch gap-3 sm:gap-4">
          <AnimatePresence mode="wait">
            {plantA ? (
              <PlantCard key={`a-${plantA}`} name={plantA} side="left" />
            ) : (
              <motion.div
                key="a-empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 rounded-3xl border-2 border-dashed border-stone-300 bg-stone-50 flex items-center justify-center min-h-[180px]"
              >
                <p className="text-xs font-bold text-stone-400 px-4 text-center">
                  Pick your plant above
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* VS badge */}
          <div className="flex items-center shrink-0">
            <motion.div
              animate={ready ? { scale: [1, 1.25, 1], rotate: [0, -8, 8, 0] } : { scale: 1 }}
              transition={{ duration: 0.5 }}
              key={ready ? `vs-${plantA}-${plantB}` : 'vs-idle'}
              className={cn(
                'w-12 h-12 rounded-full flex items-center justify-center font-black text-sm shadow-lg border-2',
                ready ? 'bg-stone-900 text-white border-stone-900' : 'bg-white text-stone-300 border-stone-200'
              )}
            >
              VS
            </motion.div>
          </div>

          <AnimatePresence mode="wait">
            {plantB ? (
              <PlantCard key={`b-${plantB}`} name={plantB} side="right" />
            ) : (
              <motion.div
                key="b-empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 rounded-3xl border-2 border-dashed border-stone-300 bg-stone-50 flex items-center justify-center min-h-[180px]"
              >
                <p className="text-xs font-bold text-stone-400 px-4 text-center">
                  Pick its neighbor above
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Verdict */}
        <AnimatePresence mode="wait">
          {check && style && (
            <motion.div
              key={`${plantA}-${plantB}-${check.verdict}`}
              initial={{ scale: 0.6, opacity: 0, y: 24 }}
              animate={
                check.verdict === 'clash'
                  ? { scale: 1, opacity: 1, y: 0, x: [0, -12, 12, -8, 8, 0] }
                  : { scale: 1, opacity: 1, y: 0, x: 0 }
              }
              exit={{ scale: 0.8, opacity: 0, y: 12 }}
              transition={
                check.verdict === 'clash'
                  ? { type: 'spring', stiffness: 300, damping: 18 }
                  : { type: 'spring', stiffness: 260, damping: 17, delay: 0.12 }
              }
              className={cn(
                'relative overflow-hidden mt-5 rounded-3xl border-2 p-5 text-center shadow-xl',
                style.banner
              )}
            >
              {check.verdict === 'compatible' && <SparkleBurst />}
              <div className="relative">
                <VerdictIcon size={44} className={cn('mx-auto mb-2', style.iconColor)} strokeWidth={2.25} />
                <p className="text-white text-xl font-black tracking-tight mb-1">{style.title}</p>
                <p className="text-white/90 text-sm font-medium leading-snug max-w-md mx-auto">
                  {check.reason}
                </p>
                <button
                  onClick={reset}
                  className="mt-4 inline-flex items-center gap-1.5 text-white/90 hover:text-white text-xs font-black uppercase tracking-wider underline underline-offset-4"
                >
                  <RotateCcw size={12} /> Check another pair
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="text-center text-[11px] font-medium text-stone-400 max-w-sm mx-auto">
        Based on the same companion data as the bed builder — enemies, friends, and known pairings
        across 45 plants.
      </p>
    </div>
  );
}
