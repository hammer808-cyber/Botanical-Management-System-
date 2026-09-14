import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Leaf, 
  Plus, 
  Calendar, 
  Map as MapIcon, 
  Trash2, 
  AlertTriangle, 
  TrendingUp, 
  History,
  CheckCircle2,
  XCircle,
  BarChart3,
  Filter,
  Info
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { format, subDays, isWithinInterval, startOfDay, endOfDay, subMonths } from 'date-fns';
import { useFirebase } from '../contexts/FirebaseContext';
import { logEvent } from '../services/eventService';
import { 
  db, 
  collection, 
  query, 
  where, 
  onSnapshot, 
  deleteDoc, 
  doc, 
  handleFirestoreError, 
  OperationType,
  serverTimestamp,
  writeBatch
} from '../firebase';
import { cn } from '@/src/lib/utils';

import { toast } from 'sonner';

const ZONES = ['Zone A', 'Zone B', 'Zone C', 'Zone D', 'Zone E', 'Zone F'];
const INTENSITIES = ['Low', 'Moderate', 'High', 'Extreme'];
const COMMON_WEEDS = [
  'Spotted Spurge',
  'Common Purslane',
  'Common Groundsel',
  'Common Chickweed',
  'Sowthistle',
  'Prickly Lettuce',
  'Common Mallow',
  'Bermuda Grass',
  'Nutsedge',
  'Crabgrass',
  'Oxalis',
  'Filaree',
  'Black Nightshade',
  'Lambsquarters'
];

const WEEDING_TIPS = [
  "Weed after rain when the soil is moist for easier root removal.",
  "Never let weeds go to seed; one Dandelion can produce 15,000 seeds.",
  "Use mulch in Zone A and B to suppress annual weed germination.",
  "Identify the weed before pulling; some have deep taproots that require tools.",
  "Keep your garden tools sharp to slice through weed roots easily.",
  "Solarization can kill weed seeds in large unplanted areas.",
  "Crowd out weeds by planting groundcovers or using dense spacing."
];

const WEED_FACTS = [
  "Some weeds, like Purslane, are actually edible and high in Omega-3s.",
  "Dandelion roots can grow up to 15 feet deep in some soils.",
  "Bermuda grass can grow from even a tiny fragment of its root system.",
  "The world's fastest-growing weed can grow nearly an inch per hour.",
  "Certain weeds can indicate soil deficiencies (e.g., Clover indicates low Nitrogen).",
  "Weeds compete with your plants for up to 50% of available nutrients.",
  "Some weed seeds can remain dormant in the soil for over 50 years."
];

export default function Weeding() {
  const { user } = useFirebase();
  const [events, setEvents] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [newEntry, setNewEntry] = useState({
    zone: 'Zone A',
    weedType: '',
    intensity: 'Moderate',
    date: format(new Date(), 'yyyy-MM-dd'),
    notes: ''
  });

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'global_events'), 
      where('ownerUid', '==', user.uid),
      where('eventType', '==', 'Weeding')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const eventList = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as any)).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setEvents(eventList);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'global_events');
    });

    return () => unsubscribe();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!newEntry.weedType.trim()) {
      toast.error('Please specify the weed type.');
      return;
    }
    
    if (!INTENSITIES.includes(newEntry.intensity)) {
      toast.error('Please select a valid intensity level.');
      return;
    }

    if (!user) return;

    setLoading(true);
    try {
      await logEvent({
        ownerUid: user.uid,
        category: 'weeding_events',
        eventType: 'Weeding',
        data: {
          ...newEntry,
          timestamp: new Date().toISOString()
        },
        calendarTitle: `Weeding: ${newEntry.weedType} in ${newEntry.zone}`,
        calendarDescription: newEntry.notes || `Weeding session completed. Intensity: ${newEntry.intensity}`
      });

      setIsAdding(false);
      toast.success('Weeding event recorded successfully!');
      setNewEntry({
        zone: 'Zone A',
        weedType: '',
        intensity: 'Moderate',
        date: format(new Date(), 'yyyy-MM-dd'),
        notes: ''
      });
    } catch (error) {
      console.error('Error logging weeding event:', error);
      toast.error('Failed to log weeding event.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this weeding record?')) return;
    try {
      await deleteDoc(doc(db, 'weeding_events', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `weeding_events/${id}`);
    }
  };

  const seedDemoData = async () => {
    if (!user || loading) return;
    if (!confirm('This will add 15 historical weeding events to your garden. Continue?')) return;
    
    setLoading(true);
    try {
      const batch = writeBatch(db);
      const now = new Date();
      
      for (let i = 0; i < 15; i++) {
        const randomDays = Math.floor(Math.random() * 30);
        const randomDate = subDays(now, randomDays);
        const randomZone = ZONES[Math.floor(Math.random() * ZONES.length)];
        const randomWeed = COMMON_WEEDS[Math.floor(Math.random() * COMMON_WEEDS.length)];
        const randomIntensity = INTENSITIES[Math.floor(Math.random() * INTENSITIES.length)];
        
        const eventRef = doc(collection(db, 'weeding_events'));
        batch.set(eventRef, {
          ownerUid: user.uid,
          zone: randomZone,
          weedType: randomWeed,
          intensity: randomIntensity,
          date: format(randomDate, 'yyyy-MM-dd'),
          notes: 'Automated historical record for trend analysis.',
          createdAt: serverTimestamp()
        });
      }
      
      await batch.commit();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'weeding_events');
    } finally {
      setLoading(false);
    }
  };

  // Data processing for charts
  const getChartData = () => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
      return { date, count: 0 };
    }).reverse();

    events.forEach(event => {
      const day = last30Days.find(d => d.date === event.date);
      if (day) day.count += 1;
    });

    return last30Days;
  };

  const getZoneData = () => {
    const zoneCounts = ZONES.map(zone => ({
      name: zone,
      value: events.filter(e => e.zone === zone).length
    }));
    return zoneCounts.filter(z => z.value > 0);
  };

  const getWeedPrevalence = () => {
    const weedCounts: Record<string, number> = {};
    events.forEach(e => {
      weedCounts[e.weedType] = (weedCounts[e.weedType] || 0) + 1;
    });
    return Object.entries(weedCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  };

  const dailyTip = WEEDING_TIPS[new Date().getDate() % WEEDING_TIPS.length];
  const dailyFact = WEED_FACTS[new Date().getDate() % WEED_FACTS.length];

  const COLORS = ['#154212', '#2E7D32', '#4CAF50', '#81C784', '#A5D6A7', '#C8E6C9'];

  return (
    <div className="px-6 max-w-6xl mx-auto py-8 space-y-12 pb-32">
      {/* Editorial Header */}
      <section className="flex flex-col md:flex-row justify-between items-start gap-6 relative">
        <div className="absolute -top-10 -left-10 opacity-5 pointer-events-none">
          <Leaf size={140} className="text-primary rotate-45" />
        </div>
        <div className="flex-1 relative z-10">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-label text-xs uppercase tracking-[0.2em] text-secondary font-bold mb-2 block"
          >
            Maintenance & Control
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-headline text-5xl md:text-6xl font-extrabold tracking-tighter text-primary leading-none mb-6"
          >
            Weeding Protocol
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-body text-on-surface-variant max-w-md text-lg leading-relaxed"
          >
            Systematic removal of invasive species. Track prevalence, categorize by zone, and visualize garden health over time.
          </motion.p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 relative z-10">
          <button 
            onClick={seedDemoData}
            disabled={loading}
            className="flex items-center gap-3 px-6 py-4 bg-surface-container-high text-primary rounded-2xl font-bold hover:bg-primary/5 transition-all active:scale-95 disabled:opacity-50"
          >
            <TrendingUp size={20} />
            <span>Seed Demo Data</span>
          </button>
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-2xl font-bold hover:shadow-xl hover:shadow-primary/20 transition-all active:scale-95"
          >
            <Plus size={20} />
            <span>Log Weeding Event</span>
          </button>
        </div>
      </section>

      {/* Zone Map Visual */}
      <section className="p-8 bg-surface-container-lowest rounded-[3rem] border border-outline-variant/10 shadow-inner">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                <MapIcon size={20} />
              </div>
              <h3 className="font-headline text-2xl font-black tracking-tight">Garden Plot Layout</h3>
            </div>
            <p className="text-on-surface-variant font-medium leading-relaxed">
              Your garden is divided into four strategic quadrants. Use this map to identify where invasive species are most active and coordinate your removal efforts.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {ZONES.map((zone, i) => (
                <div key={zone} className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-outline-variant/5">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-xs" style={{ backgroundColor: COLORS[i % COLORS.length] }}>
                    {zone.split(' ')[1]}
                  </div>
                  <div>
                    <span className="block font-bold text-sm">{zone}</span>
                    <span className="text-[10px] text-on-surface-variant uppercase font-black tracking-tighter">
                      {events.filter(e => e.zone === zone).length} Events
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="w-full md:w-96 aspect-square bg-surface-container-high rounded-[2rem] p-4 grid grid-cols-[1fr_1fr_0.5fr] grid-rows-[1fr_1fr_0.5fr] gap-3 relative overflow-hidden shadow-2xl">
            {/* Decorative Grid Lines */}
            <div className="absolute inset-0 border-2 border-dashed border-white/10 pointer-events-none z-0"></div>
            
            {ZONES.map((zone, i) => {
              const count = events.filter(e => e.zone === zone).length;
              const maxCount = Math.max(...ZONES.map(z => events.filter(e => e.zone === z).length), 1);
              const opacity = 0.3 + (count / maxCount) * 0.7;
              
              // Custom grid positioning
              let gridClass = "";
              if (zone === 'Zone A') gridClass = "col-start-1 row-start-1";
              if (zone === 'Zone B') gridClass = "col-start-2 row-start-1";
              if (zone === 'Zone C') gridClass = "col-start-1 row-start-2";
              if (zone === 'Zone D') gridClass = "col-start-2 row-start-2";
              if (zone === 'Zone E') gridClass = "col-start-1 col-span-2 row-start-3";
              if (zone === 'Zone F') gridClass = "col-start-3 row-start-1 row-span-3";

              return (
                <motion.div
                  key={zone}
                  whileHover={{ scale: 1.02 }}
                  className={cn(
                    "relative rounded-xl flex items-center justify-center cursor-help group transition-all",
                    gridClass
                  )}
                  style={{ backgroundColor: COLORS[i % COLORS.length], opacity }}
                >
                  <div className="flex flex-col items-center">
                    <span className="text-white font-headline text-2xl font-black opacity-40 group-hover:opacity-100 transition-opacity">
                      {zone.split(' ')[1]}
                    </span>
                    {zone === 'Zone E' && <span className="text-[8px] text-white/40 font-bold uppercase tracking-tighter">Bottom Pathway</span>}
                    {zone === 'Zone F' && <span className="text-[8px] text-white/40 font-bold uppercase tracking-tighter rotate-90 mt-4">Side Pathway</span>}
                  </div>
                  
                  {/* Hover Tooltip */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-xl">
                    <div className="bg-white text-primary px-3 py-1 rounded-full text-[10px] font-black shadow-lg whitespace-nowrap">
                      {count} Sessions
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Analytics Dashboard */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Chart */}
        <div className="lg:col-span-2 p-8 bg-white rounded-[2.5rem] border border-outline-variant/10 shadow-sm overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                <TrendingUp size={20} />
              </div>
              <h3 className="font-headline text-xl font-black tracking-tight">Activity (Last 30 Days)</h3>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getChartData()}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(str) => format(new Date(str), 'MMM d')}
                  tick={{ fontSize: 10, fill: '#888' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 10, fill: '#888' }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '20px', 
                    border: 'none', 
                    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                    padding: '16px',
                    backgroundColor: '#fff'
                  }}
                  cursor={{ fill: 'rgba(21, 66, 18, 0.05)' }}
                  labelFormatter={(str) => (
                    <div className="font-headline font-black text-primary mb-1">
                      {format(new Date(str), 'MMMM d, yyyy')}
                    </div>
                  )}
                  formatter={(value: number) => [
                    <span className="font-bold text-on-surface">{value} Sessions</span>,
                    <span className="text-on-surface-variant text-xs uppercase font-black tracking-widest">Activity</span>
                  ]}
                />
                <Bar dataKey="count" fill="#154212" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Zone Distribution */}
        <div className="p-8 bg-surface-container-low rounded-[2.5rem] border border-outline-variant/10 shadow-sm flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
              <MapIcon size={20} />
            </div>
            <h3 className="font-headline text-xl font-black tracking-tight">Zone Distribution</h3>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={getZoneData()}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {getZoneData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '20px', 
                    border: 'none', 
                    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                    padding: '16px',
                    backgroundColor: '#fff'
                  }}
                  formatter={(value: number, name: string) => [
                    <span className="font-bold text-primary">{value} Events</span>,
                    <span className="text-on-surface-variant text-xs uppercase font-black tracking-widest">{name}</span>
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {getZoneData().map((z, i) => (
              <div key={z.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                  <span className="font-bold">{z.name}</span>
                </div>
                <span className="text-on-surface-variant">{z.value} events</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Recent Events List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                <History size={20} />
              </div>
              <h3 className="font-headline text-2xl font-black tracking-tight">Recent Activity</h3>
            </div>
          </div>

          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {events.length === 0 ? (
                <div className="p-12 text-center bg-surface-container-lowest rounded-[2rem] border border-dashed border-outline-variant/30">
                  <p className="text-on-surface-variant italic">No weeding events recorded yet. Start by logging your first session.</p>
                </div>
              ) : (
                events.map((event) => (
                  <motion.div
                    key={event.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="p-6 bg-white rounded-[2rem] border border-outline-variant/10 shadow-sm hover:shadow-md transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-6">
                      <div className={cn(
                        "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0",
                        event.intensity === 'Extreme' ? "bg-error/10 text-error" : 
                        event.intensity === 'High' ? "bg-tertiary/10 text-tertiary" :
                        "bg-primary/10 text-primary"
                      )}>
                        <Leaf size={24} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-lg">{event.weedType}</span>
                          <span className="px-2 py-0.5 bg-surface-container-high text-[10px] font-black uppercase tracking-widest rounded-full text-on-surface-variant">
                            {event.zone}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-on-surface-variant">
                          <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            {format(new Date(event.date), 'MMM d, yyyy')}
                          </span>
                          <span className="flex items-center gap-1">
                            <AlertTriangle size={14} />
                            {event.intensity} Intensity
                          </span>
                        </div>
                        {event.notes && (
                          <p className="mt-2 text-sm italic text-on-surface-variant/80 line-clamp-1">"{event.notes}"</p>
                        )}
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDelete(event.id)}
                      className="p-3 text-on-surface-variant hover:text-error hover:bg-error/5 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={20} />
                    </button>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Prevalence Sidebar */}
        <div className="space-y-8">
          <div className="p-8 bg-primary text-white rounded-[2.5rem] shadow-xl shadow-primary/20 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="font-headline text-2xl font-black mb-4">Top Invaders</h3>
              <div className="space-y-4">
                {getWeedPrevalence().length === 0 ? (
                  <p className="text-white/60 italic text-sm">Data will appear as you log events.</p>
                ) : (
                  getWeedPrevalence().map((weed, i) => (
                    <div key={weed.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold">
                          {i + 1}
                        </span>
                        <span className="font-bold">{weed.name}</span>
                      </div>
                      <span className="text-white/60 text-sm font-black">{weed.value}x</span>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
              <AlertTriangle size={160} />
            </div>
          </div>

          <div className="p-8 bg-surface-container-low rounded-[2.5rem] border border-outline-variant/10">
            <h4 className="font-headline text-xl font-black mb-4 flex items-center gap-2">
              <Info size={20} className="text-primary" />
              Daily Weeding Tip
            </h4>
            <div className="p-4 bg-white rounded-2xl border border-primary/10 mb-6">
              <p className="text-sm text-on-surface-variant font-medium italic">"{dailyTip}"</p>
            </div>

            <h4 className="font-headline text-xl font-black mb-4 flex items-center gap-2">
              <TrendingUp size={20} className="text-secondary" />
              Did You Know?
            </h4>
            <div className="p-4 bg-secondary/5 rounded-2xl border border-secondary/10">
              <p className="text-sm text-on-surface-variant font-medium">{dailyFact}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdding(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl relative z-10 overflow-hidden"
            >
              <div className="p-10">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="font-headline text-3xl font-black tracking-tight">Log Session</h3>
                  <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-surface-container-high rounded-full transition-colors">
                    <XCircle size={24} className="text-outline" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant ml-1">Zone</label>
                      <select 
                        value={newEntry.zone}
                        onChange={(e) => setNewEntry({...newEntry, zone: e.target.value})}
                        className="w-full p-4 bg-surface-container-low rounded-2xl border-none focus:ring-2 focus:ring-primary/20 font-bold"
                      >
                        {ZONES.map(z => <option key={z} value={z}>{z}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant ml-1">Intensity</label>
                      <select 
                        value={newEntry.intensity}
                        onChange={(e) => setNewEntry({...newEntry, intensity: e.target.value})}
                        className="w-full p-4 bg-surface-container-low rounded-2xl border-none focus:ring-2 focus:ring-primary/20 font-bold"
                      >
                        {INTENSITIES.map(i => <option key={i} value={i}>{i}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant ml-1">Weed Type</label>
                    <div className="relative">
                      <input 
                        type="text"
                        list="common-weeds"
                        placeholder="e.g. Dandelion"
                        value={newEntry.weedType}
                        onChange={(e) => setNewEntry({...newEntry, weedType: e.target.value})}
                        className="w-full p-4 bg-surface-container-low rounded-2xl border-none focus:ring-2 focus:ring-primary/20 font-bold"
                        required
                      />
                      <datalist id="common-weeds">
                        {COMMON_WEEDS.map(w => <option key={w} value={w} />)}
                      </datalist>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant ml-1">Date</label>
                    <input 
                      type="date"
                      value={newEntry.date}
                      onChange={(e) => setNewEntry({...newEntry, date: e.target.value})}
                      className="w-full p-4 bg-surface-container-low rounded-2xl border-none focus:ring-2 focus:ring-primary/20 font-bold"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant ml-1">Notes (Optional)</label>
                    <textarea 
                      value={newEntry.notes}
                      onChange={(e) => setNewEntry({...newEntry, notes: e.target.value})}
                      placeholder="Observed root depth or soil conditions..."
                      className="w-full p-4 bg-surface-container-low rounded-2xl border-none focus:ring-2 focus:ring-primary/20 font-bold min-h-[100px]"
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full py-5 bg-primary text-white rounded-[2rem] font-black text-lg shadow-xl shadow-primary/20 hover:shadow-2xl transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
                  >
                    {loading ? (
                      <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <CheckCircle2 size={24} />
                        <span>Save Record</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
