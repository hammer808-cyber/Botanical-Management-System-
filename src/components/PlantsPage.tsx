import React, { useState } from 'react';
import Inventory from './Inventory';
import Library from './Library';
import CompanionChecker from './CompanionChecker';
import { Sprout, BookOpen, HeartHandshake } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export type PlantsTab = 'mine' | 'discover' | 'companions';

const TABS: { id: PlantsTab; label: string; icon: any }[] = [
  { id: 'mine', label: 'My Plants', icon: Sprout },
  { id: 'discover', label: 'Discover', icon: BookOpen },
  { id: 'companions', label: 'Companions', icon: HeartHandshake },
];

export default function PlantsPage({ initialTab = 'mine' }: { initialTab?: PlantsTab }) {
  const [tab, setTab] = useState<PlantsTab>(initialTab);

  return (
    <div>
      <div className="sticky top-16 z-30 bg-background/90 backdrop-blur-md border-b border-outline-variant/40">
        <div className="flex gap-1 px-4 max-w-5xl mx-auto" role="tablist" aria-label="Plants sections">
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
      {tab === 'mine' && <Inventory />}
      {tab === 'discover' && <Library />}
      {tab === 'companions' && <CompanionChecker />}
    </div>
  );
}
