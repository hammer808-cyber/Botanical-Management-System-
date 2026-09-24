import React, { useState } from 'react';
import { ChevronDown, Bug, Sprout } from 'lucide-react';
import { cn } from '../lib/utils';
import type { PlantThreat } from '../constants/threats';

const severityStyles: Record<PlantThreat['severity'], string> = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-amber-100 text-amber-800',
  low: 'bg-stone-100 text-stone-600',
};

function ThreatBody({ threat }: { threat: PlantThreat }) {
  return (
    <div className="space-y-3 pt-1">
      <div>
        <p className="text-[10px] font-black uppercase tracking-wider text-stone-500 mb-1">Watch for</p>
        <ul className="space-y-1">
          {threat.signs.map((s, i) => (
            <li key={i} className="text-xs font-medium text-stone-700 leading-snug flex gap-1.5">
              <span className="text-stone-400 shrink-0">•</span>{s}
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100">
        <p className="text-[10px] font-black uppercase tracking-wider text-emerald-700 mb-1">Organic treatment</p>
        <ul className="space-y-1">
          {threat.organicTreatment.map((t, i) => (
            <li key={i} className="text-xs font-medium text-emerald-900 leading-snug flex gap-1.5">
              <span className="text-emerald-400 shrink-0">•</span>{t}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-wider text-stone-500 mb-1">Prevention</p>
        <ul className="space-y-1">
          {threat.prevention.map((p, i) => (
            <li key={i} className="text-xs font-medium text-stone-700 leading-snug flex gap-1.5">
              <span className="text-stone-400 shrink-0">•</span>{p}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function ThreatPhoto({ threat, size = 'thumb' }: { threat: PlantThreat; size?: 'thumb' | 'large' }) {
  const [failed, setFailed] = useState(false);
  if (!threat.image || failed) return null;

  if (size === 'large') {
    return (
      <figure className="overflow-hidden rounded-2xl border border-stone-200 bg-stone-100">
        <img
          src={threat.image}
          alt={`${threat.name} reference photo`}
          loading="lazy"
          onError={() => setFailed(true)}
          className="w-full aspect-[4/3] object-cover"
        />
        {threat.credit && (
          <figcaption className="px-3 py-1.5 text-[10px] font-medium text-stone-500 bg-white">
            Photo: {threat.credit}
          </figcaption>
        )}
      </figure>
    );
  }

  return (
    <img
      src={threat.image}
      alt=""
      loading="lazy"
      onError={() => setFailed(true)}
      className="w-14 h-14 rounded-xl object-cover shrink-0 border border-stone-200 bg-stone-100"
    />
  );
}

export default function ThreatCard({
  threat,
  affectedPlants,
  compact = false,
}: {
  threat: PlantThreat;
  affectedPlants?: string[];
  compact?: boolean;
}) {
  const [open, setOpen] = useState(!compact);
  const TypeIcon = threat.type === 'pest' ? Bug : Sprout;

  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-3 p-3 text-left hover:bg-stone-50 transition-colors"
      >
        <ThreatPhoto threat={threat} />
        {!threat.image && <span className="text-2xl shrink-0">{threat.icon}</span>}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <p className="text-sm font-bold text-stone-800">{threat.name}</p>
            <span className={cn('text-[9px] font-black uppercase tracking-wide px-1.5 py-0.5 rounded-full', severityStyles[threat.severity])}>
              {threat.severity}
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <TypeIcon size={11} className="text-stone-400" />
            <p className="text-[10px] font-semibold text-stone-500 uppercase tracking-wide">
              {threat.type === 'pest' ? 'Pest' : 'Disease'}
              {affectedPlants && affectedPlants.length > 0 && ` • threatens ${affectedPlants.join(', ')}`}
            </p>
          </div>
        </div>
        <ChevronDown size={16} className={cn('text-stone-400 shrink-0 transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="px-3 pb-3">
          <ThreatBody threat={threat} />
        </div>
      )}
    </div>
  );
}
