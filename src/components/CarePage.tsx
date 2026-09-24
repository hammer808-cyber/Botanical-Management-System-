import React, { useState } from 'react';
import Treatment from './Treatment';
import Weeding from './Weeding';
import GardenCalendar from './Calendar';
import { Stethoscope, Leaf, CalendarDays } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export type CareTab = 'treatments' | 'weeding' | 'schedule';

const TABS: { id: CareTab; label: string; icon: any }[] = [
  { id: 'treatments', label: 'Treatments', icon: Stethoscope },
  { id: 'weeding', label: 'Weeding', icon: Leaf },
  { id: 'schedule', label: 'Schedule', icon: CalendarDays },
];

export default function CarePage({ initialTab = 'treatments' }: { initialTab?: CareTab }) {
  const [tab, setTab] = useState<CareTab>(initialTab);

  return (
    <div>
      <div className="sticky top-16 z-30 bg-background/90 backdrop-blur-md border-b border-outline-variant/40">
        <div className="flex gap-1 px-4 max-w-5xl mx-auto" role="tablist" aria-label="Care sections">
          {TABS.map(t => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                role="tab"
                aria-selected={active}
                onClick={() => setTab(t.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-[3px] -mb-px transition-colors",
                  active
                    ? "border-primary text-primary"
                    : "border-transparent text-on-surface-variant hover:text-primary"
                )}
              >
                <Icon size={16} />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>
      {tab === 'treatments' && <Treatment />}
      {tab === 'weeding' && <Weeding />}
      {tab === 'schedule' && <GardenCalendar />}
    </div>
  );
}
