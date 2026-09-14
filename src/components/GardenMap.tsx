import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, PlusCircle, ZoomIn, ZoomOut, Layers, Droplets, Sun, Info, Edit2, Trash2, X, Check, Plus } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useFirebase } from '../contexts/FirebaseContext';
import { db, collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, handleFirestoreError, OperationType } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function GardenMap() {
  const { user } = useFirebase();
  const navigate = useNavigate();
  const [plots, setPlots] = useState<any[]>([]);
  const [activePlotId, setActivePlotId] = useState<string | null>(null);
  const [plants, setPlants] = useState<any[]>([]);
  const [zoom, setZoom] = useState(1);
  const [showLayers, setShowLayers] = useState(false);
  
  const [isAddingPlot, setIsAddingPlot] = useState(false);
  const [editingPlot, setEditingPlot] = useState<any>(null);
  const [newPlotName, setNewPlotName] = useState('');

  useEffect(() => {
    if (!user) return;

    const plotsQuery = query(collection(db, 'plots'), where('ownerUid', '==', user.uid));
    const unsubscribePlots = onSnapshot(plotsQuery, (snapshot) => {
      const plotList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPlots(plotList);
      if (plotList.length > 0 && !activePlotId) {
        setActivePlotId(plotList[0].id);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'plots');
    });

    return () => unsubscribePlots();
  }, [user]);

  useEffect(() => {
    if (!user || !activePlotId) {
      setPlants([]);
      return;
    }

    // Since plants are in planters, and planters are in plots, we need to filter plants by plot.
    // However, the current Plant schema doesn't have plotId, only planterId.
    // For now, let's just fetch all plants and filter them client-side if we can find their planter's plotId.
    // Or, more efficiently, we should probably add plotId to Plant too.
    // But let's start with fetching all plants for the user.
    const q = query(collection(db, 'plants'), where('ownerUid', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const plantList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPlants(plantList);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'plants');
    });

    return () => unsubscribe();
  }, [user, activePlotId]);

  const handleAddPlot = async () => {
    if (!user || !newPlotName.trim()) return;
    try {
      const docRef = await addDoc(collection(db, 'plots'), {
        ownerUid: user.uid,
        name: newPlotName,
        createdAt: serverTimestamp()
      });
      setActivePlotId(docRef.id);
      setIsAddingPlot(false);
      setNewPlotName('');
      toast.success('Garden plot created');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'plots');
    }
  };

  const handleUpdatePlot = async () => {
    if (!editingPlot) return;
    try {
      await updateDoc(doc(db, 'plots', editingPlot.id), {
        name: editingPlot.name
      });
      setEditingPlot(null);
      toast.success('Plot updated');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `plots/${editingPlot.id}`);
    }
  };

  const handleDeletePlot = async (id: string) => {
    if (!confirm('Are you sure you want to delete this plot? Planters and plants will remain but will be unassigned.')) return;
    try {
      await deleteDoc(doc(db, 'plots', id));
      if (activePlotId === id) {
        setActivePlotId(plots.find(p => p.id !== id)?.id || null);
      }
      toast.success('Plot removed');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `plots/${id}`);
    }
  };

  const activePlot = plots.find(p => p.id === activePlotId);

  return (
    <div className="px-4 max-w-5xl mx-auto space-y-6 py-8">
      {/* Plot Toggle & Legend Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-3 flex-1">
          <div className="flex items-center justify-between">
            <p className="font-label text-xs font-semibold uppercase tracking-wider text-on-surface-variant px-1">Active Plot</p>
            <div className="flex gap-2">
              {activePlot && (
                <>
                  <button 
                    onClick={() => setEditingPlot(activePlot)}
                    className="p-1.5 hover:bg-surface-container-high rounded-full text-on-surface-variant transition-colors"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button 
                    onClick={() => handleDeletePlot(activePlot.id)}
                    className="p-1.5 hover:bg-red-50 text-red-500 rounded-full transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </>
              )}
              <button 
                onClick={() => setIsAddingPlot(true)}
                className="p-1.5 bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>
          <div className="flex gap-2 p-1 bg-surface-container-high rounded-full w-fit overflow-x-auto max-w-full no-scrollbar">
            {plots.map((plot) => (
              <motion.button 
                key={plot.id}
                whileHover={{ y: -2, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActivePlotId(plot.id)}
                className={cn(
                  "px-6 py-2 rounded-full font-bold text-sm transition-all whitespace-nowrap",
                  activePlotId === plot.id ? "bg-primary text-on-primary shadow-lg shadow-primary/20" : "text-on-surface-variant font-semibold hover:bg-surface-container-highest"
                )}
              >
                {plot.name}
              </motion.button>
            ))}
            {plots.length === 0 && (
              <p className="px-6 py-2 text-xs text-on-surface-variant italic">No plots defined</p>
            )}
          </div>
        </div>
        <div className="bg-surface-container-low p-4 rounded-xl flex items-center gap-6 shrink-0">
          <LegendItem color="bg-primary" label="V - Vegetable" />
          <LegendItem color="bg-secondary" label="H - Herb" />
          <LegendItem color="bg-tertiary" label="F - Flower" />
        </div>
      </section>

      {/* Main Map Canvas */}
      <section className="relative aspect-[4/3] md:aspect-[16/9] w-full bg-surface-container-lowest rounded-[2.5rem] shadow-xl shadow-emerald-900/5 overflow-hidden border border-outline-variant/15 garden-grid">
        {/* Map Zones Overlay */}
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-2 pointer-events-none opacity-20">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="border border-dashed border-primary/30 flex items-center justify-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary/40">Zone {i + 1}</span>
            </div>
          ))}
        </div>

        {/* Map Interaction Overlay */}
        <div 
          className="absolute inset-0 p-8 transition-transform duration-500 ease-out"
          style={{ transform: `scale(${zoom})` }}
        >
          {plants.map((plant) => (
            <MapNode 
              key={plant.id}
              name={plant.name || 'Unnamed'} 
              plot={plant.type?.[0] || 'P'} 
              color={plant.type === 'Herb' ? 'bg-secondary-fixed' : plant.type === 'Vegetable' ? 'bg-primary-fixed' : 'bg-tertiary-fixed'} 
              icon={plant.type === 'Herb' ? 'eco' : plant.type === 'Vegetable' ? 'nutrition' : 'filter_vintage'} 
              status={(plant.needsWater ? 'warning' : 'healthy') as 'healthy' | 'growing' | 'warning'}
              position={plant.mapPosition as { x: number; y: number } | undefined}
              onClick={() => navigate(`/plant/${plant.id}`)}
            />
          ))}
          
          {plants.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-on-surface-variant/40 flex-col gap-4">
              <MapPin size={48} />
              <p className="font-headline font-bold">No plants mapped in this plot</p>
            </div>
          )}
        </div>

        <motion.button 
          whileHover={{ scale: 1.05, y: -4 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/', { state: { openQuickAdd: true } })}
          className="absolute bottom-8 right-8 bg-primary-container text-on-primary-container p-4 rounded-3xl shadow-2xl flex items-center gap-3 transition-all z-20"
        >
          <PlusCircle size={24} className="fill-current" />
          <span className="font-headline font-bold pr-2">Quick Add</span>
        </motion.button>

        {/* Map Context Controls */}
        <div className="absolute bottom-8 left-8 flex flex-col gap-2 z-20">
          <MapControl onClick={() => setZoom(prev => Math.min(prev + 0.2, 2))} icon={<ZoomIn size={20} />} />
          <MapControl onClick={() => setZoom(prev => Math.max(prev - 0.2, 0.5))} icon={<ZoomOut size={20} />} />
          <MapControl onClick={() => setShowLayers(!showLayers)} icon={<Layers size={20} />} active={showLayers} />
        </div>

        {showLayers && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute bottom-8 left-20 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl z-30 space-y-3 border border-outline-variant/20"
          >
            <p className="text-[10px] font-black uppercase tracking-widest text-primary">Map Layers</p>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-primary" />
                <span className="text-xs font-bold">Plant Health</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-primary" />
                <span className="text-xs font-bold">Moisture Grid</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded text-primary" />
                <span className="text-xs font-bold">Sun Exposure</span>
              </label>
            </div>
          </motion.div>
        )}
      </section>

      {/* Insights Bento Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 bg-surface-container-low p-6 rounded-[2rem] flex items-center justify-between border border-outline-variant/10">
          <div className="space-y-1">
            <h3 className="font-headline font-bold text-lg text-emerald-900">Soil Moisture Content</h3>
            <p className="text-sm text-on-surface-variant">Optimal conditions across 85% of {activePlot?.name || 'Garden'}.</p>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-8 rounded-full bg-primary-fixed"></div>
            <div className="w-2 h-12 rounded-full bg-primary-fixed"></div>
            <div className="w-2 h-16 rounded-full bg-primary"></div>
            <div className="w-2 h-10 rounded-full bg-primary"></div>
          </div>
        </div>
        <div className="bg-tertiary-fixed p-6 rounded-[2rem] border border-tertiary-container/10 flex flex-col justify-between">
          <Sun className="text-tertiary w-8 h-8" />
          <div className="mt-4">
            <h4 className="font-headline font-bold text-tertiary-container">UV Index: High</h4>
            <p className="text-xs text-on-tertiary-fixed-variant">8.4 - Protection needed for ferns.</p>
          </div>
        </div>
      </section>

      {/* Modals */}
      <AnimatePresence>
        {isAddingPlot && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl p-8 space-y-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black font-headline tracking-tight">New Garden Plot</h3>
                <button onClick={() => setIsAddingPlot(false)} className="p-2 hover:bg-stone-100 rounded-full transition-colors"><X /></button>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Plot Name</label>
                <input 
                  type="text" 
                  autoFocus
                  value={newPlotName}
                  onChange={(e) => setNewPlotName(e.target.value)}
                  className="w-full bg-stone-100 border-none rounded-2xl px-6 py-4 font-bold focus:ring-2 ring-primary/20"
                  placeholder="e.g. South Orchard"
                />
              </div>
              <button 
                onClick={handleAddPlot}
                className="w-full bg-primary text-white font-black py-5 rounded-2xl hover:shadow-lg transition-all flex items-center justify-center gap-3"
              >
                <Check size={20} /> Create Plot
              </button>
            </motion.div>
          </div>
        )}

        {editingPlot && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl p-8 space-y-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black font-headline tracking-tight">Edit Plot</h3>
                <button onClick={() => setEditingPlot(null)} className="p-2 hover:bg-stone-100 rounded-full transition-colors"><X /></button>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Plot Name</label>
                <input 
                  type="text" 
                  autoFocus
                  value={editingPlot.name}
                  onChange={(e) => setEditingPlot({...editingPlot, name: e.target.value})}
                  className="w-full bg-stone-100 border-none rounded-2xl px-6 py-4 font-bold focus:ring-2 ring-primary/20"
                />
              </div>
              <button 
                onClick={handleUpdatePlot}
                className="w-full bg-primary text-white font-black py-5 rounded-2xl hover:shadow-lg transition-all flex items-center justify-center gap-3"
              >
                <Check size={20} /> Save Changes
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LegendItem({ color, label }: { color: string, label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={cn("w-3 h-3 rounded-full shadow-sm", color)}></span>
      <span className="font-label text-xs font-bold text-on-surface-variant">{label}</span>
    </div>
  );
}

interface MapNodeProps {
  name: string;
  plot: string;
  color: string;
  icon: string;
  status: 'healthy' | 'growing' | 'warning';
  position?: { x: number; y: number };
  onClick?: () => void;
}

const MapNode: React.FC<MapNodeProps> = ({ name, plot, color, icon, status, position, onClick }) => {
  const pos = position || { x: Math.random() * 80 + 10, y: Math.random() * 80 + 10 };
  
  return (
    <div 
      className="absolute group botanical-tooltip"
      style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%, -50%)' }}
      data-tooltip={`${name} (Plot ${plot})`}
    >
      <motion.div 
        whileHover={{ scale: 1.15, zIndex: 10 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onClick?.()}
        className={cn("w-10 h-10 rounded-xl shadow-lg flex items-center justify-center cursor-pointer transition-transform border-2 border-white/50", color)}
      >
        <span className="material-symbols-outlined text-on-secondary-container text-xl">{icon}</span>
        {status === 'healthy' && <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-primary border-2 border-white rounded-full"></div>}
        {status === 'warning' && (
          <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-error border-2 border-white rounded-full flex items-center justify-center">
            <Droplets size={8} className="text-white fill-current" />
          </div>
        )}
      </motion.div>
    </div>
  );
};

function MapControl({ icon, onClick, active }: { icon: React.ReactNode, onClick: () => void, active?: boolean }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-10 h-10 rounded-xl shadow-md flex items-center justify-center active:scale-90 transition-all",
        active ? "bg-primary text-on-primary" : "bg-white/90 backdrop-blur-md text-primary"
      )}
    >
      {icon}
    </button>
  );
}
