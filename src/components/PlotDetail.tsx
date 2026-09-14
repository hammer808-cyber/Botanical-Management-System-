import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { format, addDays } from 'date-fns';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { 
  DndContext, 
  useDraggable, 
  useDroppable, 
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent
} from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Leaf, 
  Box, 
  Plus, 
  Trash2, 
  Settings2, 
  Maximize2, 
  Minimize2, 
  X, 
  Palette, 
  Move, 
  Check, 
  ArrowLeft, 
  Edit3, 
  Save,
  Calendar,
  Activity,
  Info,
  Droplets,
  Bug,
  Sprout,
  Laugh,
  ClipboardList,
  Clock,
  AlertCircle,
  Wrench,
  Thermometer,
  Sun,
  ScrollText,
  CheckCircle2,
  Loader2,
  Eye,
  EyeOff,
  Filter,
  Map as MapIcon,
  Tag,
  Target
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { logEvent } from '../services/eventService';
import { db, collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc, getDoc, getDocs, handleFirestoreError, OperationType, setDoc, batchDelete, runTransaction, serverTimestamp } from '../firebase';
import { useFirebase } from '../contexts/FirebaseContext';
import { GoogleGenAI, Type } from "@google/genai";
import { toast } from 'sonner';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import WeedWarriorWizard from './WeedWarriorWizard';
import TreatmentConflictModal from './TreatmentConflictModal';

import { 
  Inhabitant, 
  SpatialPlot, 
  InhabitantStatus, 
  InhabitantType, 
  PlotStatus, 
  PlotHealth,
  EventLog,
  EventType
} from '../types';

import { 
  calculateSuitabilityScore, 
  calculateUrgencyIndex, 
  getSeasonalCohort, 
  checkMonoculture, 
  getRecommendedSuccessor,
  checkTreatmentConflict,
  BOTANICAL_RELATIONS
} from '../services/botanyService';

const GRID_SIZE = 30; // 30x20
const CELL_SIZE = 24; // pixels

const GARDEN_JOKES = [
  "Why did the tomato turn red? Because it saw the salad dressing!",
  "What do you call a sleeping blackcurrant? A berry-tired fruit.",
  "How do you fix a broken tomato? With tomato paste!",
  "What do you call a mushroom who goes to a party? A fun-gi!",
  "Why are gardens so great? Because they're always growing on you!",
  "What's a gardener's favorite music? Rock and roll-mow!",
  "Why did the gardener quit? Because his celery was too low!",
  "What do you call a bee that can't make up its mind? A maybe.",
  "What do you call a tree that fits in your hand? A palm tree!",
  "Why did the scarecrow win an award? Because he was outstanding in his field!"
];

interface GridPosition {
  x: number;
  y: number;
}

interface Planter {
  id: string;
  name: string;
  type: string;
  gridPosition: GridPosition;
  size: { w: number; h: number };
  color: string;
  plotId: string;
}

interface Plant {
  id: string;
  name: string;
  planterId?: string;
  plotId?: string;
  gridPosition: GridPosition;
  image?: string;
  scientific?: string;
}

interface MaintenanceLog {
  id: string;
  date: string;
  action: string;
  notes: string;
}

interface ChecklistItem {
  id: string;
  task: string;
  completed: boolean;
  ownerUid: string;
  plotId: string;
  plantId?: string;
  plantName?: string;
  category?: string;
  createdAt: any;
}

interface PlotLayoutItem {
  id: string;
  x: number;
  y: number;
  type: 'plant' | 'planter';
}

interface Plot {
  id: string;
  name: string;
  description?: string;
  status: 'Active' | 'Inactive';
  currentCrop?: string;
  plantingDate?: string;
  startDate?: string;
  endDate?: string;
  soilType?: string;
  healthStatus?: 'Excellent' | 'Stable' | 'Stressed' | 'Critical';
  wateringFreq?: string;
  maintenanceLog?: MaintenanceLog[];
  checklist?: ChecklistItem[];
  dailyJoke?: {
    text: string;
    lastUpdated: number;
  };
  mapLayout?: PlotLayoutItem[];
}

export default function PlotDetail() {
  const { plotId } = useParams<{ plotId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useFirebase();
  
  const [plot, setPlot] = useState<SpatialPlot | null>(null);
  const [tasks, setTasks] = useState<ChecklistItem[]>([]);
  const [migratingTasks, setMigratingTasks] = useState<Set<string>>(new Set());
  const [planters, setPlanters] = useState<Planter[]>([]);
  const [inhabitants, setInhabitants] = useState<Inhabitant[]>([]);
  const [availableInhabitants, setAvailableInhabitants] = useState<Inhabitant[]>([]);
  const [eventLogs, setEventLogs] = useState<EventLog[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<'planter' | 'plant' | null>(null);
  const [zoom, setZoom] = useState(1);
  const [activeLayer, setActiveLayer] = useState<'none' | 'family' | 'irrigation'>('none');

  const [isAddingPlanter, setIsAddingPlanter] = useState(false);
  const [isEditingPlot, setIsEditingPlot] = useState(false);
  const [isAddingLog, setIsAddingLog] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isWeedWarriorOpen, setIsWeedWarriorOpen] = useState(false);
  const [conflictModalData, setConflictModalData] = useState<{ isOpen: boolean; message: string; action: string; conflictingAction: string; conflictingDate: string } | null>(null);
  const [editingPlanter, setEditingPlanter] = useState<any>(null);
  const [newPlanterData, setNewPlanterData] = useState({ name: 'New Bed', type: 'Raised Bed', w: 4, h: 2, color: '#4CAF50' });
  const [editPlotData, setEditPlotData] = useState({ 
    name: '', 
    description: '', 
    status: 'Active' as 'Active' | 'Inactive',
    currentCrop: '',
    plantingDate: '',
    startDate: '',
    endDate: '',
    soilType: '',
    healthStatus: 'Stable' as any,
    wateringFreq: ''
  });
  const [newLog, setNewLog] = useState({ action: '', notes: '' });
  const [newTask, setNewTask] = useState('');
  const [quickTips, setQuickTips] = useState<string>('');
  const [loadingTips, setLoadingTips] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string, type: 'plot' | 'planter' } | null>(null);

  const [showAdvanced, setShowAdvanced] = useState(false);

  const eliteInsights = React.useMemo(() => {
    if (!plot || inhabitants.length === 0) return null;
    
    const thirstyCount = inhabitants.filter(p => p.status === 'Thirsty').length;
    const avgVigor = inhabitants.length > 0 
      ? (inhabitants.reduce((acc, p) => acc + (p.vigorIndex || 0), 0) / inhabitants.length).toFixed(1)
      : "0";
      
    return {
      monoculture: checkMonoculture(inhabitants),
      nutrientDraw: inhabitants.reduce((acc, p) => {
        const draw = p.nutrientDraw || 'Medium';
        if (draw === 'Heavy') return 'High';
        if (draw === 'Medium' && acc !== 'High') return 'Medium';
        return acc;
      }, 'Low' as 'High' | 'Medium' | 'Low'),
      succession: getRecommendedSuccessor(inhabitants),
      avgVigor,
      thirstyCount
    };
  }, [plot, inhabitants]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    if (!user || !plotId) return;

    // Fetch Plot Details
    const unsubscribePlot = onSnapshot(doc(db, 'spatial_plots', plotId), (docSnap) => {
      setLoading(false);
      if (docSnap.exists()) {
        const data = docSnap.data() as SpatialPlot;
        setPlot({ id: docSnap.id, ...data });
        setEditPlotData({ 
          name: data.name, 
          description: data.description || '', 
          status: data.status as any,
          currentCrop: '', // No longer in SpatialPlot, but keeping for form compatibility
          plantingDate: '',
          startDate: '',
          endDate: '',
          soilType: data.soilType || '',
          healthStatus: data.healthStatus || 'Stable',
          wateringFreq: ''
        });
      } else {
        toast.error('Plot not found');
        navigate('/');
      }
    });

    // Fetch Planters for this Plot
    const pq = query(collection(db, 'planters'), where('plotId', '==', plotId), where('ownerUid', '==', user.uid));
    const unsubscribePlanters = onSnapshot(pq, (snapshot) => {
      setPlanters(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Planter)));
    });

    // Fetch Inhabitants for this Plot
    const inhabitantsQ = query(collection(db, 'inhabitants'), where('plotId', '==', plotId), where('ownerUid', '==', user.uid));
    const unsubscribeInhabitants = onSnapshot(inhabitantsQ, (snapshot) => {
      const allPlotInhabitants = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Inhabitant));
      // Mapped inhabitants have a non-zero grid position (or are in a planter)
      setInhabitants(allPlotInhabitants.filter(p => (p.gridPosition.x !== 0 || p.gridPosition.y !== 0)));
      // Assigned but not mapped
      const assignedNotMapped = allPlotInhabitants.filter(p => !(p.gridPosition.x !== 0 || p.gridPosition.y !== 0));
      
      setAvailableInhabitants(prev => {
        const unassigned = prev.filter(p => !p.plotId);
        return [...unassigned, ...assignedNotMapped];
      });
    });

    // Fetch Unassigned Inhabitants
    const unassignedQ = query(collection(db, 'inhabitants'), where('plotId', '==', null), where('ownerUid', '==', user.uid));
    const unsubscribeUnassigned = onSnapshot(unassignedQ, (snapshot) => {
      const unassigned = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Inhabitant));
      setAvailableInhabitants(prev => {
        const assignedToThisPlot = prev.filter(p => p.plotId === plotId);
        return [...unassigned, ...assignedToThisPlot];
      });
    });

    // Fetch Tasks for this Plot
    const tasksQ = query(collection(db, 'tasks'), where('plotId', '==', plotId), where('ownerUid', '==', user.uid));
    const unsubscribeTasks = onSnapshot(tasksQ, (snapshot) => {
      setTasks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ChecklistItem)));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'tasks');
    });

    // Fetch event logs for conflict checking
    const logsQ = query(collection(db, 'event_logs'), where('ownerUid', '==', user.uid));
    const unsubscribeLogs = onSnapshot(logsQ, (snapshot) => {
      setEventLogs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EventLog)));
    });

    return () => {
      unsubscribePlot();
      unsubscribePlanters();
      unsubscribeInhabitants();
      unsubscribeUnassigned();
      unsubscribeTasks();
      unsubscribeLogs();
    };
  }, [user, plotId, navigate]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    setActiveType(active.data.current?.type);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over, delta } = event;
    setActiveId(null);
    setActiveType(null);

    if (!active || !user || !plotId) return;

    const xDiff = Math.round(delta.x / (CELL_SIZE * zoom));
    const yDiff = Math.round(delta.y / (CELL_SIZE * zoom));

    if (active.data.current?.type === 'planter') {
      const planter = planters.find(p => p.id === active.id);
      if (planter) {
        const newX = Math.max(0, Math.min(GRID_SIZE - planter.size.w, planter.gridPosition.x + xDiff));
        const newY = Math.max(0, Math.min(20 - planter.size.h, planter.gridPosition.y + yDiff));
        
        try {
          await updateDoc(doc(db, 'planters', planter.id), {
            gridPosition: { x: newX, y: newY }
          });
        } catch (error) {
          handleFirestoreError(error, OperationType.UPDATE, `planters/${planter.id}`);
        }
      }
    } else if (active.data.current?.type === 'plant') {
      const inhabitant = [...inhabitants, ...availableInhabitants].find(p => p.id === active.id);
      if (inhabitant && plot) {
        // Check if dropped over a planter
        if (over && over.data.current?.type === 'planter') {
          const targetPlanter = planters.find(p => p.id === over.id);
          const newPos = targetPlanter ? targetPlanter.gridPosition : { x: 0, y: 0 };
          try {
            await updateDoc(doc(db, 'inhabitants', inhabitant.id), {
              plotId: plotId,
              gridPosition: newPos,
              updatedAt: serverTimestamp()
            });

            const currentLayout = plot.mapLayout || [];
            const updatedLayout = currentLayout.filter(item => item.id !== inhabitant.id);
            updatedLayout.push({ id: inhabitant.id, x: newPos.x, y: newPos.y, type: 'plant' });
            await updateDoc(doc(db, 'spatial_plots', plotId), { mapLayout: updatedLayout });

            toast.success(`${inhabitant.name} moved to planter`);
          } catch (error) {
            handleFirestoreError(error, OperationType.UPDATE, `inhabitants/${inhabitant.id}`);
          }
        } else {
          const newX = Math.max(0, Math.min(GRID_SIZE - 1, (inhabitant.gridPosition?.x || 0) + xDiff));
          const newY = Math.max(0, Math.min(20 - 1, (inhabitant.gridPosition?.y || 0) + yDiff));
          
          try {
            await updateDoc(doc(db, 'inhabitants', inhabitant.id), {
              plotId: plotId,
              gridPosition: { x: newX, y: newY },
              updatedAt: serverTimestamp()
            });

            const currentLayout = plot.mapLayout || [];
            const updatedLayout = currentLayout.filter(item => item.id !== inhabitant.id);
            updatedLayout.push({ id: inhabitant.id, x: newX, y: newY, type: 'plant' });
            await updateDoc(doc(db, 'spatial_plots', plotId), { mapLayout: updatedLayout });
          } catch (error) {
            handleFirestoreError(error, OperationType.UPDATE, `inhabitants/${inhabitant.id}`);
          }
        }
      }
    }
  };

  const updatePlanter = async (id: string, updates: Partial<Planter>) => {
    try {
      await updateDoc(doc(db, 'planters', id), updates);
      toast.success('Planter updated');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `planters/${id}`);
    }
  };

  const deletePlanter = async () => {
    if (!itemToDelete || itemToDelete.type !== 'planter') return;
    const id = itemToDelete.id;
    setIsDeletingConfirmed(true);
    try {
      const inhabitantsInPlanter = inhabitants.filter(p => p.gridPosition.x >= planters.find(pl => pl.id === id)!.gridPosition.x && p.gridPosition.x < planters.find(pl => pl.id === id)!.gridPosition.x + planters.find(pl => pl.id === id)!.size.w && p.gridPosition.y >= planters.find(pl => pl.id === id)!.gridPosition.y && p.gridPosition.y < planters.find(pl => pl.id === id)!.gridPosition.y + planters.find(pl => pl.id === id)!.size.h);
      for (const inhabitant of inhabitantsInPlanter) {
        await updateDoc(doc(db, 'inhabitants', inhabitant.id), { gridPosition: { x: 0, y: 0 } });
      }
      await deleteDoc(doc(db, 'planters', id));
      setEditingPlanter(null);
      toast.success('Planter removed');
      setShowDeleteModal(false);
      setItemToDelete(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `planters/${id}`);
    } finally {
      setIsDeletingConfirmed(false);
    }
  };

  const addPlanter = async () => {
    if (!user || !plotId || isSaving) return;
    setIsSaving(true);
    try {
      await addDoc(collection(db, 'planters'), {
        ownerUid: user.uid,
        plotId: plotId,
        name: newPlanterData.name,
        type: newPlanterData.type,
        gridPosition: { x: 0, y: 0 },
        size: { w: newPlanterData.w, h: newPlanterData.h },
        color: newPlanterData.color,
        createdAt: serverTimestamp()
      });
      
      toast.success('New bed added to plot');
      
      setTimeout(() => {
        setIsAddingPlanter(false);
        setIsSaving(false);
      }, 500);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'planters');
      setIsSaving(false);
    }
  };

  const handleUpdatePlot = async () => {
    if (!plotId || isSaving) return;

    // Basic date validation
    if (editPlotData.startDate && editPlotData.endDate) {
      if (new Date(editPlotData.startDate) > new Date(editPlotData.endDate)) {
        toast.error('Start date cannot be after end date');
        return;
      }
    }

    setIsSaving(true);
    try {
      await updateDoc(doc(db, 'plots', plotId), editPlotData);
      
      toast.success('Plot details updated');
      
      setTimeout(() => {
        setIsEditingPlot(false);
        setIsSaving(false);
      }, 500);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `plots/${plotId}`);
      setIsSaving(false);
    }
  };

  const [isDeletingConfirmed, setIsDeletingConfirmed] = useState(false);

  const handleDeletePlot = async () => {
    if (!plotId || !itemToDelete || itemToDelete.type !== 'plot') return;
    setIsDeletingConfirmed(true);
    
    try {
      // 1. Get planters
      const plantersQ = query(collection(db, 'planters'), where('plotId', '==', plotId));
      const plantersSnap = await getDocs(plantersQ);
      const planterIds = plantersSnap.docs.map(d => d.id);

      // 2. Unassign inhabitants
      const inhabitantsQ = query(collection(db, 'inhabitants'), where('plotId', '==', plotId));
      const inhabitantsSnap = await getDocs(inhabitantsQ);
      for (const d of inhabitantsSnap.docs) {
        await updateDoc(doc(db, 'inhabitants', d.id), {
          plotId: null,
          gridPosition: { x: 0, y: 0 }
        });
      }

      // 3. Delete planters in batch
      if (planterIds.length > 0) {
        await batchDelete('planters', planterIds);
      }

      // 4. Delete plot
      await deleteDoc(doc(db, 'spatial_plots', plotId));
      
      toast.success('Plot deleted and inhabitants unassigned');
      setShowDeleteModal(false);
      setItemToDelete(null);
      navigate('/');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `spatial_plots/${plotId}`);
    } finally {
      setIsDeletingConfirmed(false);
    }
  };

  const addMaintenanceLog = async (force = false) => {
    if (!plotId || !newLog.action || isSaving || !user) return;

    if (!force) {
      // Check for treatment conflicts
      const conflictResult = checkTreatmentConflict(newLog.action, eventLogs);
      if (conflictResult.conflict && conflictResult.conflictingLog) {
        setConflictModalData({
          isOpen: true,
          message: conflictResult.message || '',
          action: newLog.action,
          conflictingAction: conflictResult.conflictingLog.eventType || conflictResult.conflictingLog.type || 'Unknown',
          conflictingDate: new Date(conflictResult.conflictingLog.date).toLocaleDateString()
        });
        return;
      }
    }

    setIsSaving(true);
    
    try {
      await logEvent({
        ownerUid: user.uid,
        category: 'event_logs',
        eventType: 'Treatment',
        data: {
          targetId: plotId,
          targetType: 'SpatialPlot',
          type: 'Treatment',
          action: newLog.action,
          notes: newLog.notes,
          date: new Date().toISOString()
        },
        calendarTitle: `Maintenance: ${newLog.action} (${plot?.name || 'Plot'})`,
        calendarDescription: newLog.notes || `Maintenance performed on ${plot?.name || 'plot'}.`
      });

      await updateDoc(doc(db, 'spatial_plots', plotId), {
        healthStatus: 'Stable' // Update health status on maintenance
      });
      
      toast.success('Maintenance log added');
      
      setTimeout(() => {
        setNewLog({ action: '', notes: '' });
        setIsAddingLog(false);
        setIsSaving(false);
        setConflictModalData(null);
      }, 500);
    } catch (error) {
      console.error('Error adding maintenance log:', error);
      toast.error('Failed to add maintenance log');
      setIsSaving(false);
    }
  };

  const handleWeedingVictory = async (data: any) => {
    if (!user || !plotId) return;
    
    try {
      await logEvent({
        ownerUid: user.uid,
        category: 'event_logs',
        eventType: 'Weeding',
        data: {
          ...data,
          targetId: plotId,
          targetType: 'SpatialPlot',
          type: 'Weeding',
          date: new Date().toISOString()
        },
        calendarTitle: `Weeding Victory: ${data.weedType} (${plot?.name || 'Plot'})`,
        calendarDescription: `Cleared ${data.areaCleared} sq ft of ${data.weedType} using ${data.method}. Efficiency: ${data.weq.toFixed(1)} WEQ.`
      });

      toast.success(`Tactical weeding logged for ${plot?.name}`);
    } catch (error) {
      console.error('Error logging weeding victory:', error);
      toast.error('Failed to log weeding victory');
    }
  };

  const addChecklistItem = async () => {
    if (!plotId || !newTask || !user || isSaving) return;
    setIsSaving(true);
    try {
      await addDoc(collection(db, 'tasks'), {
        ownerUid: user.uid,
        plotId: plotId,
        task: newTask,
        completed: false,
        category: 'Maintenance',
        createdAt: serverTimestamp()
      });
      
      toast.success('Task added to plot checklist');
      
      setNewTask('');
      setIsAddingTask(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'tasks');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleChecklistItem = async (task: ChecklistItem) => {
    if (!user || migratingTasks.has(task.id)) return;

    setMigratingTasks(prev => new Set(prev).add(task.id));
    const toastId = toast.loading(`Migrating "${task.task}" to history...`);

    try {
      await logEvent({
        ownerUid: user.uid,
        category: 'task_history',
        eventType: 'Task',
        data: {
          taskId: task.id,
          task: task.task,
          plotId: plotId,
          plotName: plot?.name || 'Unknown',
          plantId: task.plantId || null,
          plantName: task.plantName || null,
          category: task.category || 'Maintenance',
          status: 'Completed',
          timestamp: new Date().toISOString()
        },
        calendarTitle: `Completed: ${task.task} (${plot?.name || 'Plot'})`,
        calendarDescription: `Task completed in plot: ${plot?.name || 'Unknown'}`
      });

      // Delete from active tasks
      await deleteDoc(doc(db, 'tasks', task.id));

      toast.success(`"${task.task}" migrated to history and calendar`, { id: toastId });
    } catch (error) {
      console.error('Migration error:', error);
      toast.error('Failed to complete task migration', { id: toastId });
    } finally {
      setMigratingTasks(prev => {
        const next = new Set(prev);
        next.delete(task.id);
        return next;
      });
    }
  };

  const deleteChecklistItem = async (taskId: string) => {
    try {
      await deleteDoc(doc(db, 'tasks', taskId));
      toast.success('Task removed');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `tasks/${taskId}`);
    }
  };

  useEffect(() => {
    if (location.state?.waterPlantId && inhabitants.length > 0) {
      handleWaterPlant(location.state.waterPlantId);
      // Clear state
      window.history.replaceState({}, document.title);
    }
  }, [location.state, inhabitants]);

  const handleWaterPlant = async (inhabitantId: string) => {
    if (!user || !plot) return;
    const inhabitant = inhabitants.find(p => p.id === inhabitantId);
    if (!inhabitant) return;

    try {
      const nextDate = addDays(new Date(), 2); // Default to 2 days
      await logEvent({
        ownerUid: user.uid,
        category: 'event_logs',
        eventType: 'Watering',
        data: {
          targetId: inhabitantId,
          targetType: 'Inhabitant',
          type: 'Watering',
          notes: `Hydrated ${inhabitant.name}`,
          date: new Date().toISOString()
        },
        calendarTitle: `Watered: ${inhabitant.name} (${plot.name})`,
        calendarDescription: `Hydration session for ${inhabitant.name} in ${plot.name}.`
      });

      // Update inhabitant document
      await updateDoc(doc(db, 'inhabitants', inhabitantId), {
        needsWater: false,
        nextWatering: format(nextDate, 'yyyy-MM-dd')
      });

      toast.success(`${inhabitant.name} hydrated and logged!`);
    } catch (error) {
      console.error('Error watering plant:', error);
      toast.error('Failed to log watering event');
    }
  };
  const generateQuickTips = async () => {
    if (!plot || inhabitants.length === 0) {
      toast.info('Add some inhabitants to get tailored tips!');
      return;
    }
    setLoadingTips(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const inhabitantNames = inhabitants.map(p => p.name).join(', ');
      const prompt = `As a master gardener, provide 3 quick, actionable "Pro-Tips" for a garden plot containing these plants: ${inhabitantNames}. The plot status is ${plot.status}. Keep each tip concise (under 20 words). Format as a simple list.`;
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });
      
      setQuickTips(response.text || 'No tips available at the moment.');
    } catch (error) {
      console.error('Error generating tips:', error);
      toast.error('Failed to generate tips');
    } finally {
      setLoadingTips(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 px-6 pb-20 animate-pulse">
        <div className="h-48 bg-surface-container-low rounded-[2.5rem]" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-surface-container-low rounded-[2.5rem]" />
          <div className="h-96 bg-surface-container-low rounded-[2.5rem]" />
        </div>
      </div>
    );
  }

  if (!plot) {
    return (
      <div className="p-20 text-center space-y-4">
        <h2 className="text-2xl font-bold">Plot Not Found</h2>
        <p className="text-on-surface-variant">The plot you're looking for doesn't exist or you don't have permission to view it.</p>
        <button 
          onClick={() => navigate('/')}
          className="bg-primary text-white px-6 py-2 rounded-full font-bold"
        >
          Back to Hub
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-6 pb-20">
      {/* Plot Header & Metadata */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-surface-container-low p-8 rounded-[2.5rem] border border-outline-variant/10 shadow-sm">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate('/plots')}
            className="p-4 hover:bg-surface-container-high rounded-2xl transition-colors text-on-surface-variant"
          >
            <ArrowLeft size={28} />
          </button>
          <div className="space-y-1">
            <div className="flex items-center gap-4">
              <h3 className="font-headline font-black text-3xl tracking-tight">{plot.name}</h3>
              <div className={cn(
                "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2",
                plot.status === 'Active' ? "bg-primary/10 text-primary" : "bg-on-surface-variant/10 text-on-surface-variant"
              )}>
                <Activity size={12} />
                {plot.status}
              </div>
              <div className={cn(
                "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2",
                plot.healthStatus === 'Excellent' ? "bg-green-100 text-green-700" :
                plot.healthStatus === 'Stable' ? "bg-blue-100 text-blue-700" :
                plot.healthStatus === 'Stressed' ? "bg-yellow-100 text-yellow-700" :
                "bg-red-100 text-red-700"
              )}>
                <Activity size={12} />
                {plot.healthStatus || 'Stable'}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-on-surface-variant font-medium">
              <div className="flex items-center gap-2">
                <Leaf size={16} className="text-primary" />
                <span>Inhabitants: <span className="font-black text-on-surface">{inhabitants.length}</span></span>
              </div>
              <div className="flex items-center gap-2">
                <Activity size={16} className="text-primary" />
                <span>Vigor: <span className="font-black text-on-surface">{eliteInsights?.avgVigor || '0'}%</span></span>
              </div>
              <div className="flex items-center gap-2">
                <Info size={16} className="text-primary" />
                <span>Family: <span className="font-black text-on-surface">{plot.plantFamily || 'Not set'}</span></span>
              </div>
              {plot.irrigationZone && (
                <div className="flex items-center gap-2">
                  <Droplets size={16} className="text-blue-500" />
                  <span>Irrigation: <span className="font-black text-on-surface">{plot.irrigationZone}</span></span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-primary" />
                <span>Started: <span className="font-black text-on-surface">{plot.startDate || plot.plantingDate || 'Not set'}</span></span>
              </div>
              {plot.endDate && (
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-primary" />
                  <span>Ends: <span className="font-black text-on-surface">{plot.endDate}</span></span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Info size={16} className="text-primary" />
                <span>Soil: <span className="font-black text-on-surface">{plot.soilType || 'Not set'}</span></span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={cn(
              "p-4 rounded-2xl transition-all touch-target",
              showAdvanced ? "bg-secondary text-white" : "hover:bg-surface-container-high text-on-surface-variant"
            )}
            title={showAdvanced ? "Hide Advanced Data" : "View Advanced Data"}
          >
            {showAdvanced ? <EyeOff size={24} /> : <Eye size={24} />}
          </button>
          <button 
            onClick={() => setIsEditingPlot(true)}
            className="p-4 hover:bg-surface-container-high rounded-2xl transition-colors text-on-surface-variant touch-target"
            title="Edit Plot Details"
          >
            <Edit3 size={24} />
          </button>
          <div className="w-px h-10 bg-outline-variant/20 mx-2" />
          <div className="flex items-center gap-1 bg-white/50 p-1 rounded-xl border border-outline-variant/10">
            <button onClick={() => setZoom(prev => Math.max(0.5, prev - 0.1))} className="p-2 hover:bg-surface-container-high rounded-lg transition-colors"><Minimize2 size={20} /></button>
            <span className="text-[10px] font-black w-12 text-center">{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom(prev => Math.min(2, prev + 0.1))} className="p-2 hover:bg-surface-container-high rounded-lg transition-colors"><Maximize2 size={20} /></button>
          </div>
          <button 
            onClick={() => setIsAddingPlanter(true)}
            className="flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-2xl font-black text-sm hover:shadow-lg transition-all"
          >
            <Plus size={20} /> Add Bed
          </button>
        </div>
      </div>

      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar: Available Inhabitants & Stats */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-[2rem] border border-outline-variant/10 shadow-sm">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-on-surface-variant mb-4">Unmapped Inhabitants</h4>
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {availableInhabitants.length === 0 ? (
                  <p className="text-xs text-on-surface-variant italic py-4 text-center">All inhabitants are mapped or none available.</p>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {availableInhabitants.map(inhabitant => (
                      <DraggablePlantIcon key={inhabitant.id} inhabitant={inhabitant} />
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-primary/5 p-6 rounded-[2rem] border border-primary/10">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-4">Plot Inventory</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-primary/10">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary"><Leaf size={16} /></div>
                    <span className="text-xs font-bold">Inhabitants</span>
                  </div>
                  <span className="font-black text-lg">{inhabitants.length}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-primary/10">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary"><Box size={16} /></div>
                    <span className="text-xs font-bold">Beds</span>
                  </div>
                  <span className="font-black text-lg">{planters.length}</span>
                </div>
              </div>
            </div>

            {/* Case Manager Alerts */}
            {plot && (
              <div className="space-y-3">
                {(() => {
                  const monoculture = checkMonoculture(inhabitants);
                  if (monoculture.isMonoculture) {
                    return (
                      <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex gap-3 items-start animate-pulse">
                        <Bug className="text-red-500 shrink-0" size={20} />
                        <div className="space-y-1">
                          <p className="text-xs font-black text-red-900 uppercase tracking-wider">Monoculture Alert</p>
                          <p className="text-[10px] font-medium text-red-700">
                            High concentration of {monoculture.dominantFamily} ({monoculture.percentage?.toFixed(0)}%). Diversify to reduce pest risk.
                          </p>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}
                
                {inhabitants.some(p => p.nutrientDraw === 'Heavy') && (
                  <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex gap-3 items-start">
                    <Thermometer className="text-amber-500 shrink-0" size={20} />
                    <div className="space-y-1">
                      <p className="text-xs font-black text-amber-900 uppercase tracking-wider">Nutrient Draw Analysis</p>
                      <p className="text-[10px] font-medium text-amber-700">Heavy feeders detected. Suggest nitrogen-fixing successors (Beans/Clover) for next rotation.</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Daily Garden Dad Joke */}
            <div className="bg-secondary/5 p-6 rounded-[2rem] border border-secondary/10 overflow-hidden relative group">
              <div className="absolute -right-4 -top-4 text-secondary/10 rotate-12 group-hover:rotate-0 transition-transform duration-500">
                <Laugh size={120} />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-secondary/10 rounded-lg text-secondary"><Laugh size={16} /></div>
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] text-secondary">Garden Humor</h4>
                </div>
                <p className="text-sm font-medium italic text-on-surface leading-relaxed">
                  "{plot.dailyJoke?.text || 'Loading joke...'}"
                </p>
                <p className="text-[10px] font-black text-secondary/60 mt-4 uppercase tracking-widest">Refreshes every 24h</p>
              </div>
            </div>
          </div>

          {/* Main Grid Editor */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between bg-white p-4 rounded-3xl border border-outline-variant/10 shadow-sm">
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Spatial Layers</span>
              </div>
              <div className="flex gap-2">
                {[
                  { id: 'none', label: 'Default', icon: MapIcon },
                  { id: 'family', label: 'Family', icon: Tag },
                  { id: 'irrigation', label: 'Irrigation', icon: Droplets }
                ].map(layer => (
                  <button
                    key={layer.id}
                    onClick={() => setActiveLayer(layer.id as any)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                      activeLayer === layer.id ? "bg-primary text-white shadow-lg" : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
                    )}
                  >
                    <layer.icon size={12} />
                    {layer.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative overflow-auto bg-stone-100 rounded-[2.5rem] border-4 border-stone-200 shadow-inner min-h-[600px] p-8 custom-scrollbar">
              <div 
                className="relative bg-white shadow-2xl mx-auto"
                style={{ 
                  width: GRID_SIZE * CELL_SIZE * zoom, 
                  height: 20 * CELL_SIZE * zoom,
                  backgroundImage: `linear-gradient(to right, #f0f0f0 1px, transparent 1px), linear-gradient(to bottom, #f0f0f0 1px, transparent 1px)`,
                  backgroundSize: `${CELL_SIZE * zoom}px ${CELL_SIZE * zoom}px`
                }}
              >
                {planters.map(planter => (
                  <PlanterItem 
                    key={planter.id} 
                    planter={planter}
                    zoom={zoom}
                    onEdit={() => setEditingPlanter(planter)}
                    inhabitants={inhabitants.filter(p => p.gridPosition.x >= planter.gridPosition.x && p.gridPosition.x < planter.gridPosition.x + planter.size.w && p.gridPosition.y >= planter.gridPosition.y && p.gridPosition.y < planter.gridPosition.y + planter.size.h)}
                    activeLayer={activeLayer}
                  />
                ))}

                {inhabitants.filter(p => !planters.some(pl => p.gridPosition.x >= pl.gridPosition.x && p.gridPosition.x < pl.gridPosition.x + pl.size.w && p.gridPosition.y >= pl.gridPosition.y && p.gridPosition.y < pl.gridPosition.y + pl.size.h)).map(inhabitant => (
                  <DraggableItem 
                    key={inhabitant.id} 
                    id={inhabitant.id} 
                    type="plant"
                    position={inhabitant.gridPosition}
                    size={{ w: 1, h: 1 }}
                    zoom={zoom}
                    image={inhabitant.image}
                    name={inhabitant.name}
                    activeLayer={activeLayer}
                    inhabitant={inhabitant}
                  />
                ))}

                {/* Suitability Heatmap Overlay during Drag */}
                {activeId && activeType === 'plant' && plot && (
                  <SuitabilityOverlay 
                    activePlant={[...inhabitants, ...availableInhabitants].find(p => p.id === activeId) || {}} 
                    plot={plot} 
                    inhabitants={inhabitants} 
                    zoom={zoom} 
                  />
                )}
              </div>

              <DragOverlay dropAnimation={null}>
                {activeId ? (
                  <div 
                    className={cn(
                      "rounded-lg shadow-2xl flex items-center justify-center border-2 border-primary ring-4 ring-primary/20",
                      activeType === 'planter' ? "bg-primary/20" : "bg-white"
                    )}
                    style={{
                      width: (activeType === 'planter' ? planters.find(p => p.id === activeId)?.size.w || 1 : 1) * CELL_SIZE * zoom,
                      height: (activeType === 'planter' ? planters.find(p => p.id === activeId)?.size.h || 1 : 1) * CELL_SIZE * zoom,
                    }}
                  >
                    {activeType === 'plant' ? <Leaf size={16 * zoom} className="text-primary" /> : <Box size={24 * zoom} className="text-primary" />}
                  </div>
                ) : null}
              </DragOverlay>
            </div>
          </div>
        </div>
      </DndContext>

      {/* Elite Botanical Insights Section */}
      <div className="px-6 mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "p-8 rounded-[2.5rem] border space-y-4 shadow-sm transition-all",
            eliteInsights?.monoculture?.isMonoculture 
              ? "bg-error/5 border-error/20 text-error" 
              : "bg-surface-container-low border-outline-variant/10"
          )}
        >
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-3 rounded-2xl",
              eliteInsights?.monoculture?.isMonoculture ? "bg-error/10" : "bg-primary/10 text-primary"
            )}>
              <AlertCircle size={24} />
            </div>
            <h3 className="font-headline text-xl font-black">Monoculture Alert</h3>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-black uppercase tracking-tight">
              {eliteInsights?.monoculture?.isMonoculture ? "Warning: High Risk" : "Diverse & Healthy"}
            </p>
            <p className="text-xs font-medium opacity-70">
              {eliteInsights?.monoculture?.isMonoculture 
                ? `Too many ${eliteInsights.monoculture.dominantFamily}s in one plot. Risk of pest outbreaks.`
                : "Your plant families are well-distributed. Natural pest resistance is high."}
            </p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-surface-container-low p-8 rounded-[2.5rem] border border-outline-variant/10 space-y-4 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-secondary/10 text-secondary rounded-2xl">
              <Activity size={24} />
            </div>
            <h3 className="font-headline text-xl font-black">Nutrient Draw</h3>
          </div>
          <div className="space-y-1">
            <p className={cn(
              "text-3xl font-black uppercase tracking-tight",
              eliteInsights?.nutrientDraw === 'High' ? "text-amber-600" : "text-on-surface"
            )}>
              {eliteInsights?.nutrientDraw || 'Low'}
            </p>
            <p className="text-xs text-on-surface-variant font-medium">
              {eliteInsights?.nutrientDraw === 'High' 
                ? "Heavy feeders detected. Consider adding compost or organic fertilizer soon."
                : "Nutrient consumption is sustainable for the current soil profile."}
            </p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-surface-container-low p-8 rounded-[2.5rem] border border-outline-variant/10 space-y-4 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-tertiary/10 text-tertiary rounded-2xl">
              <Sprout size={24} />
            </div>
            <h3 className="font-headline text-xl font-black">Succession Prompt</h3>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-black text-on-surface uppercase tracking-tight">
              {eliteInsights?.succession?.recommendedCrop || 'N/A'}
            </p>
            <p className="text-xs text-on-surface-variant font-medium">
              {eliteInsights?.succession?.reason || "No specific succession recommendation at this time."}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Bottom Sections: Documentation, Tips, Checklist */}
      <AnimatePresence>
        {showAdvanced && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden"
          >
            {/* Overview & Documentation */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-outline-variant/10 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-2xl text-primary"><ScrollText size={20} /></div>
              <h4 className="font-headline font-black text-xl tracking-tight">Documentation</h4>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/10">
              <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-2 block">Plot Notes</label>
              <p className="text-sm text-on-surface-variant font-medium leading-relaxed">
                {plot.description || 'No notes added yet. Click edit to add plot details.'}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/10">
                <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1 block">Soil Type</label>
                <span className="text-sm font-black">{plot.soilType || 'Unspecified'}</span>
              </div>
              <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/10">
                <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1 block">Planting Date</label>
                <span className="text-sm font-black">{plot.plantingDate || 'Not set'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Tips & AI Advice */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-outline-variant/10 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-secondary/10 rounded-2xl text-secondary"><Sprout size={20} /></div>
              <h4 className="font-headline font-black text-xl tracking-tight">Pro-Tips</h4>
            </div>
            <button 
              onClick={generateQuickTips}
              disabled={loadingTips}
              className="p-2 hover:bg-secondary/10 rounded-xl text-secondary transition-colors disabled:opacity-50"
            >
              <Plus size={20} />
            </button>
          </div>
          
          <div className="bg-secondary/5 p-6 rounded-2xl border border-secondary/10 min-h-[150px] flex flex-col justify-center">
            {loadingTips ? (
              <div className="flex flex-col items-center gap-3 text-secondary">
                <div className="w-6 h-6 border-2 border-secondary border-t-transparent rounded-full animate-spin"></div>
                <span className="text-[10px] font-black uppercase tracking-widest">Consulting Garden AI...</span>
              </div>
            ) : quickTips ? (
              <div className="space-y-3">
                {quickTips.split('\n').filter(t => t.trim()).map((tip, i) => (
                  <div key={i} className="flex gap-3 text-sm font-medium text-on-surface leading-relaxed">
                    <span className="text-secondary font-black">•</span>
                    <span>{tip.replace(/^\d+\.\s*/, '')}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center space-y-3">
                <p className="text-sm text-on-surface-variant italic">Need advice? Click the plus to get AI-powered tips for your specific plants.</p>
              </div>
            )}
          </div>
        </div>

        {/* Maintenance Checklist */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-outline-variant/10 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-2xl text-primary"><ClipboardList size={20} /></div>
              <h4 className="font-headline font-black text-xl tracking-tight">Checklist</h4>
            </div>
            <button 
              onClick={() => setIsAddingTask(true)}
              className="p-2 hover:bg-primary/10 rounded-xl text-primary transition-colors"
            >
              <Plus size={20} />
            </button>
          </div>

          <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
            {tasks.length === 0 ? (
              <p className="text-sm text-on-surface-variant italic text-center py-8">No tasks added yet.</p>
            ) : (
              tasks.map(item => (
                <motion.div 
                  key={item.id} 
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ 
                    opacity: migratingTasks.has(item.id) ? 0.5 : 1, 
                    x: 0,
                    scale: migratingTasks.has(item.id) ? 0.98 : 1
                  }}
                  className={cn(
                    "flex items-center justify-between p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/10 group transition-all",
                    migratingTasks.has(item.id) && "bg-primary/5 border-primary/20"
                  )}
                >
                  <button 
                    onClick={() => toggleChecklistItem(item)}
                    disabled={migratingTasks.has(item.id)}
                    className="flex items-center gap-3 text-left flex-1"
                  >
                    <div className={cn(
                      "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all",
                      item.completed || migratingTasks.has(item.id) ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" : "border-outline-variant hover:border-primary/50"
                    )}>
                      {migratingTasks.has(item.id) ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : item.completed ? (
                        <Check size={14} />
                      ) : (
                        <CheckCircle2 size={14} className="opacity-0 group-hover:opacity-100 text-primary transition-opacity" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className={cn(
                        "text-sm font-bold transition-all",
                        (item.completed || migratingTasks.has(item.id)) ? "text-on-surface-variant line-through" : "text-on-surface"
                      )}>
                        {item.task}
                      </span>
                      {migratingTasks.has(item.id) && (
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest animate-pulse">Migrating to history...</span>
                      )}
                    </div>
                  </button>
                  <button 
                    onClick={() => deleteChecklistItem(item.id)}
                    disabled={migratingTasks.has(item.id)}
                    className="p-2 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 rounded-lg disabled:hidden"
                  >
                    <Trash2 size={14} />
                  </button>
                </motion.div>
              ))
            )}
          </div>
          
          {tasks.length > 0 && (
            <div className="pt-4 border-t border-outline-variant/10">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-2">
                <span>Active Tasks</span>
                <span>{tasks.length} remaining</span>
              </div>
            </div>
          )}
        </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Maintenance Log */}
      <AnimatePresence>
        {showAdvanced && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white p-8 rounded-[2.5rem] border border-outline-variant/10 shadow-sm space-y-6 overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-2xl text-primary"><Clock size={20} /></div>
                <h4 className="font-headline font-black text-xl tracking-tight">Maintenance Log</h4>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setIsWeedWarriorOpen(true)}
                  className="flex items-center gap-2 px-6 py-2 bg-secondary/10 text-secondary rounded-xl font-black text-xs hover:bg-secondary/20 transition-all"
                >
                  <Target size={16} /> Weed Warrior
                </button>
                <button 
                  onClick={() => setIsAddingLog(true)}
                  className="flex items-center gap-2 px-6 py-2 bg-primary/10 text-primary rounded-xl font-black text-xs hover:bg-primary/20 transition-all"
                >
                  <Plus size={16} /> Log Intervention
                </button>
              </div>
            </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(!plot.maintenanceLog || plot.maintenanceLog.length === 0) ? (
            <div className="col-span-full py-12 text-center">
              <p className="text-sm text-on-surface-variant italic">No activity logged yet.</p>
            </div>
          ) : (
            <>
              {[...(plot.maintenanceLog || [])].reverse().map(log => (
                <div key={log.id} className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">{log.action}</span>
                    <span className="text-[10px] font-bold text-on-surface-variant">{new Date(log.date).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm font-medium text-on-surface leading-relaxed">{log.notes}</p>
                </div>
              ))}
            </>
          )}
        </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Plot Modal */}
      <AnimatePresence>
        {isEditingPlot && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="p-8 space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black font-headline tracking-tight">Customize Plot</h3>
                  <button onClick={() => setIsEditingPlot(false)} className="p-2 hover:bg-stone-100 rounded-full transition-colors"><X /></button>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Plot Name</label>
                      <input 
                        type="text" 
                        value={editPlotData.name}
                        onChange={(e) => setEditPlotData({...editPlotData, name: e.target.value})}
                        className="w-full bg-stone-100 border-none rounded-2xl px-6 py-4 font-bold focus:ring-2 ring-primary/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Status</label>
                      <select 
                        value={editPlotData.status}
                        onChange={(e) => setEditPlotData({...editPlotData, status: e.target.value as any})}
                        className="w-full bg-stone-100 border-none rounded-2xl px-6 py-4 font-bold focus:ring-2 ring-primary/20 appearance-none"
                      >
                        <option>Active</option>
                        <option>Inactive</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Current Crop</label>
                      <input 
                        type="text" 
                        value={editPlotData.currentCrop}
                        onChange={(e) => setEditPlotData({...editPlotData, currentCrop: e.target.value})}
                        className="w-full bg-stone-100 border-none rounded-2xl px-6 py-4 font-bold focus:ring-2 ring-primary/20"
                        placeholder="e.g. Tomatoes"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Planting Date</label>
                      <DatePicker
                        selected={editPlotData.plantingDate ? new Date(editPlotData.plantingDate) : null}
                        onChange={(date) => setEditPlotData({...editPlotData, plantingDate: date ? date.toISOString().split('T')[0] : ''})}
                        className="w-full bg-stone-100 border-none rounded-2xl px-6 py-4 font-bold focus:ring-2 ring-primary/20"
                        dateFormat="yyyy-MM-dd"
                        placeholderText="Select planting date"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Start Date</label>
                      <DatePicker
                        selected={editPlotData.startDate ? new Date(editPlotData.startDate) : null}
                        onChange={(date) => setEditPlotData({...editPlotData, startDate: date ? date.toISOString().split('T')[0] : ''})}
                        className="w-full bg-stone-100 border-none rounded-2xl px-6 py-4 font-bold focus:ring-2 ring-primary/20"
                        dateFormat="yyyy-MM-dd"
                        placeholderText="Select start date"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">End Date</label>
                      <DatePicker
                        selected={editPlotData.endDate ? new Date(editPlotData.endDate) : null}
                        onChange={(date) => setEditPlotData({...editPlotData, endDate: date ? date.toISOString().split('T')[0] : ''})}
                        className="w-full bg-stone-100 border-none rounded-2xl px-6 py-4 font-bold focus:ring-2 ring-primary/20"
                        dateFormat="yyyy-MM-dd"
                        placeholderText="Select end date"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Plot Health</label>
                      <select 
                        value={editPlotData.healthStatus}
                        onChange={(e) => setEditPlotData({...editPlotData, healthStatus: e.target.value as any})}
                        className="w-full bg-stone-100 border-none rounded-2xl px-6 py-4 font-bold focus:ring-2 ring-primary/20 appearance-none"
                      >
                        <option value="Excellent">Excellent</option>
                        <option value="Stable">Stable</option>
                        <option value="Stressed">Stressed</option>
                        <option value="Critical">Critical</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Watering Frequency</label>
                      <input 
                        type="text" 
                        value={editPlotData.wateringFreq}
                        onChange={(e) => setEditPlotData({...editPlotData, wateringFreq: e.target.value})}
                        className="w-full bg-stone-100 border-none rounded-2xl px-6 py-4 font-bold focus:ring-2 ring-primary/20"
                        placeholder="e.g. Every 3 days"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Description / Notes</label>
                    <textarea 
                      value={editPlotData.description}
                      onChange={(e) => setEditPlotData({...editPlotData, description: e.target.value})}
                      className="w-full bg-stone-100 border-none rounded-2xl px-6 py-4 font-bold focus:ring-2 ring-primary/20 min-h-[100px]"
                      placeholder="General documentation for this plot..."
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={handleUpdatePlot}
                    className="flex-1 bg-primary text-white font-black py-5 rounded-2xl hover:shadow-lg transition-all flex items-center justify-center gap-3"
                  >
                    <Save size={20} /> Save Plot Configuration
                  </button>
                  <button 
                    onClick={() => { setItemToDelete({ id: plotId, type: 'plot' }); setShowDeleteModal(true); }}
                    className="p-5 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                    title="Delete Plot"
                  >
                    <Trash2 size={24} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setItemToDelete(null);
        }}
        onConfirm={itemToDelete?.type === 'plot' ? handleDeletePlot : deletePlanter}
        message={itemToDelete?.type === 'plot' 
          ? `Are you sure you want to permanently delete "${plot?.name}"? This will unassign all plants and remove all planters. This action cannot be undone.`
          : "Are you sure you want to permanently delete this planter? Plants inside will be moved to the plot."
        }
        itemCount={1}
        isDeleting={isDeletingConfirmed}
      />
      <AnimatePresence>
        {isAddingPlanter && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="p-8 space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-black font-headline tracking-tight">Add Garden Bed</h3>
                    <p className="text-xs text-on-surface-variant font-medium uppercase tracking-widest">Define dimensions and type</p>
                  </div>
                  <button onClick={() => setIsAddingPlanter(false)} className="p-2 hover:bg-stone-100 rounded-full transition-colors"><X /></button>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Bed Name</label>
                    <input 
                      type="text" 
                      value={newPlanterData.name}
                      onChange={(e) => setNewPlanterData({...newPlanterData, name: e.target.value})}
                      className="w-full bg-stone-100 border-none rounded-2xl px-6 py-4 font-bold focus:ring-2 ring-primary/20"
                      placeholder="e.g. Tomato Bed"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Bed Type</label>
                    <select 
                      value={newPlanterData.type}
                      onChange={(e) => setNewPlanterData({...newPlanterData, type: e.target.value})}
                      className="w-full bg-stone-100 border-none rounded-2xl px-6 py-4 font-bold focus:ring-2 ring-primary/20 appearance-none"
                    >
                      <option>Raised Bed</option>
                      <option>In-Ground Row</option>
                      <option>Greenhouse Bench</option>
                      <option>Vertical Wall</option>
                      <option>Container Group</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Width (Cells)</label>
                      <input 
                        type="number" 
                        value={newPlanterData.w}
                        onChange={(e) => setNewPlanterData({...newPlanterData, w: parseInt(e.target.value)})}
                        className="w-full bg-stone-100 border-none rounded-2xl px-6 py-4 font-bold focus:ring-2 ring-primary/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Height (Cells)</label>
                      <input 
                        type="number" 
                        value={newPlanterData.h}
                        onChange={(e) => setNewPlanterData({...newPlanterData, h: parseInt(e.target.value)})}
                        className="w-full bg-stone-100 border-none rounded-2xl px-6 py-4 font-bold focus:ring-2 ring-primary/20"
                      />
                    </div>
                  </div>
                </div>

                <button 
                  onClick={addPlanter}
                  disabled={isSaving}
                  className="w-full bg-primary text-white font-black py-5 rounded-2xl hover:shadow-lg transition-all flex items-center justify-center gap-3"
                >
                  {isSaving ? (
                    <>
                      <Check size={20} className="animate-bounce" />
                      Added!
                    </>
                  ) : (
                    <>
                      <Check size={20} /> Add to Visual Map
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Planter Editor Modal */}
      <AnimatePresence>
        {editingPlanter && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="p-8 space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black font-headline tracking-tight">Bed Settings</h3>
                  <button onClick={() => setEditingPlanter(null)} className="p-2 hover:bg-stone-100 rounded-full transition-colors"><X /></button>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Bed Name</label>
                    <input 
                      type="text" 
                      value={editingPlanter.name}
                      onChange={(e) => setEditingPlanter({...editingPlanter, name: e.target.value})}
                      className="w-full bg-stone-100 border-none rounded-2xl px-6 py-4 font-bold focus:ring-2 ring-primary/20"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Width (Cells)</label>
                      <input 
                        type="number" 
                        min="1"
                        max={GRID_SIZE - editingPlanter.gridPosition.x}
                        value={editingPlanter.size.w}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 1;
                          const maxW = GRID_SIZE - editingPlanter.gridPosition.x;
                          setEditingPlanter({...editingPlanter, size: { ...editingPlanter.size, w: Math.min(Math.max(1, val), maxW) }});
                        }}
                        className="w-full bg-stone-100 border-none rounded-2xl px-6 py-4 font-bold focus:ring-2 ring-primary/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Height (Cells)</label>
                      <input 
                        type="number" 
                        min="1"
                        max={20 - editingPlanter.gridPosition.y}
                        value={editingPlanter.size.h}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 1;
                          const maxH = 20 - editingPlanter.gridPosition.y;
                          setEditingPlanter({...editingPlanter, size: { ...editingPlanter.size, h: Math.min(Math.max(1, val), maxH) }});
                        }}
                        className="w-full bg-stone-100 border-none rounded-2xl px-6 py-4 font-bold focus:ring-2 ring-primary/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Bed Color</label>
                    <div className="flex flex-wrap gap-2">
                      {['#4CAF50', '#8B4513', '#795548', '#607D8B', '#3F51B5', '#E91E63'].map(color => (
                        <button 
                          key={color}
                          onClick={() => setEditingPlanter({...editingPlanter, color})}
                          className={cn(
                            "w-10 h-10 rounded-full border-4 transition-all",
                            editingPlanter.color === color ? "border-primary scale-110" : "border-transparent"
                          )}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button 
                    onClick={() => updatePlanter(editingPlanter.id, editingPlanter)}
                    disabled={isSaving}
                    className="flex-1 bg-primary text-white font-black py-4 rounded-2xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <Check size={20} className="animate-bounce" />
                        Saved!
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                  <button 
                    onClick={() => { setItemToDelete({ id: editingPlanter.id, type: 'planter' }); setShowDeleteModal(true); }}
                    className="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-100 transition-colors"
                  >
                    <Trash2 size={24} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Maintenance Log Modal */}
      <AnimatePresence>
        {isAddingLog && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="p-8 space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black font-headline tracking-tight">Log Intervention</h3>
                  <button onClick={() => setIsAddingLog(false)} className="p-2 hover:bg-stone-100 rounded-full transition-colors"><X /></button>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Action Type</label>
                    <select 
                      value={newLog.action}
                      onChange={(e) => setNewLog({...newLog, action: e.target.value})}
                      className="w-full bg-stone-100 border-none rounded-2xl px-6 py-4 font-bold focus:ring-2 ring-primary/20 appearance-none"
                    >
                      <option value="">Select action...</option>
                      <option>Fertilizing</option>
                      <option>Weeding</option>
                      <option>Pest Control</option>
                      <option>Pruning</option>
                      <option>Harvesting</option>
                      <option>Soil Amendment</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Notes</label>
                    <textarea 
                      value={newLog.notes}
                      onChange={(e) => setNewLog({...newLog, notes: e.target.value})}
                      className="w-full bg-stone-100 border-none rounded-2xl px-6 py-4 font-bold focus:ring-2 ring-primary/20 min-h-[100px]"
                      placeholder="What exactly did you do?"
                    />
                  </div>
                </div>

                <button 
                  onClick={() => addMaintenanceLog()}
                  disabled={isSaving}
                  className="w-full bg-primary text-white font-black py-5 rounded-2xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <Check size={20} className="animate-bounce" />
                      Saved!
                    </>
                  ) : (
                    'Save to Log'
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Checklist Task Modal */}
      <AnimatePresence>
        {isAddingTask && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="p-8 space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black font-headline tracking-tight">New Task</h3>
                  <button onClick={() => setIsAddingTask(false)} className="p-2 hover:bg-stone-100 rounded-full transition-colors"><X /></button>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Task Description</label>
                    <input 
                      type="text" 
                      value={newTask}
                      onChange={(e) => setNewTask(e.target.value)}
                      className="w-full bg-stone-100 border-none rounded-2xl px-6 py-4 font-bold focus:ring-2 ring-primary/20"
                      placeholder="e.g. Water the tomatoes"
                      autoFocus
                    />
                  </div>
                </div>

                <button 
                  onClick={addChecklistItem}
                  disabled={isSaving}
                  className="w-full bg-primary text-white font-black py-5 rounded-2xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <Check size={20} className="animate-bounce" />
                      Added!
                    </>
                  ) : (
                    'Add to Checklist'
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Weed Warrior Wizard */}
      <WeedWarriorWizard 
        isOpen={isWeedWarriorOpen}
        onClose={() => setIsWeedWarriorOpen(false)}
        onSave={handleWeedingVictory}
        plotId={plotId}
        plotName={plot.name}
      />

      {/* Treatment Conflict Modal */}
      {conflictModalData && (
        <TreatmentConflictModal 
          isOpen={conflictModalData.isOpen}
          onClose={() => setConflictModalData(null)}
          onConfirm={() => addMaintenanceLog(true)}
          conflictMessage={conflictModalData.message}
          actionName={conflictModalData.action}
          conflictingAction={conflictModalData.conflictingAction}
          conflictingDate={conflictModalData.conflictingDate}
        />
      )}
    </div>
  );
}

function DraggablePlantIcon({ inhabitant }: { inhabitant: Inhabitant }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: inhabitant.id,
    data: { type: 'plant' }
  });

  const style = transform ? {
    transform: CSS.Translate.toString(transform),
  } : undefined;

  const urgency = inhabitant.pullDate ? calculateUrgencyIndex(inhabitant.pullDate) : null;
  const cohort = getSeasonalCohort(inhabitant);

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...listeners} 
      {...attributes}
      onPointerDown={(e) => {
        e.stopPropagation();
        listeners?.onPointerDown(e);
      }}
      className={cn(
        "bg-white p-3 rounded-2xl border border-outline-variant/20 flex flex-col items-center gap-2 cursor-grab active:cursor-grabbing hover:shadow-md hover:border-primary/50 hover:bg-primary/5 transition-all botanical-tooltip relative overflow-hidden",
        isDragging && "opacity-50"
      )}
      data-tooltip={`${inhabitant.name} (${cohort})`}
    >
      {urgency && (
        <div className={cn("absolute top-0 left-0 w-full h-1", urgency.color.replace('text-', 'bg-'))} />
      )}
      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center overflow-hidden">
        {inhabitant.image ? (
          <img src={inhabitant.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        ) : (
          <Leaf size={20} className="text-primary" />
        )}
      </div>
      <div className="flex flex-col items-center">
        <span className="text-[10px] font-black text-center truncate w-full">{inhabitant.name}</span>
        {urgency && (
          <span className={cn("text-[8px] font-bold", urgency.color)}>
            {urgency.daysRemaining < 0 ? 'Overdue' : `${urgency.daysRemaining}d left`}
          </span>
        )}
      </div>
    </div>
  );
}

function SuitabilityOverlay({ activePlant, plot, inhabitants, zoom }: { activePlant: Partial<Inhabitant>, plot: SpatialPlot, inhabitants: Inhabitant[], zoom: number }) {
  // We only render a subset of cells or a lower resolution for performance if needed, 
  // but 30x20 is small enough for a simple map.
  const cells = [];
  for (let y = 0; y < 20; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      const score = calculateSuitabilityScore(x, y, activePlant, plot, inhabitants);
      cells.push({ x, y, score });
    }
  }

  return (
    <div className="absolute inset-0 pointer-events-none z-40">
      {cells.map(cell => (
        <div
          key={`${cell.x}-${cell.y}`}
          className="absolute border border-white/5 transition-colors duration-300"
          style={{
            left: cell.x * CELL_SIZE * zoom,
            top: cell.y * CELL_SIZE * zoom,
            width: CELL_SIZE * zoom,
            height: CELL_SIZE * zoom,
            backgroundColor: cell.score > 70 ? 'rgba(34, 197, 94, 0.3)' : cell.score > 40 ? 'rgba(234, 179, 8, 0.2)' : 'rgba(239, 68, 68, 0.2)',
          }}
        >
          {cell.score > 80 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-1 h-1 bg-white rounded-full animate-ping" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function PlanterItem({ planter, zoom, onEdit, inhabitants, activeLayer }: { planter: Planter, zoom: number, onEdit: () => void, inhabitants: Inhabitant[], activeLayer: string }) {
  const { setNodeRef, isOver } = useDroppable({
    id: planter.id,
    data: { type: 'planter' }
  });

  const { attributes, listeners, setNodeRef: setDragRef, transform, isDragging } = useDraggable({
    id: planter.id,
    data: { type: 'planter' }
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    position: 'absolute' as const,
    left: planter.gridPosition.x * CELL_SIZE * zoom,
    top: planter.gridPosition.y * CELL_SIZE * zoom,
    width: planter.size.w * CELL_SIZE * zoom,
    height: planter.size.h * CELL_SIZE * zoom,
    zIndex: 10,
    opacity: isDragging ? 0.3 : 1,
  };

  const getLayerColor = () => {
    if (activeLayer === 'irrigation') return '#3b82f640'; // Blue for water
    if (activeLayer === 'family') return '#f59e0b40'; // Amber for family
    return planter.color + '40';
  };

  return (
    <div 
      ref={(node) => {
        setNodeRef(node);
        setDragRef(node);
      }}
      style={style} 
      className={cn(
        "group rounded-lg border-2 transition-all relative shadow-sm",
        isOver ? "border-primary ring-4 ring-primary/20 scale-[1.02]" : "border-stone-400",
        "cursor-grab active:cursor-grabbing"
      )}
    >
      <div 
        className="w-full h-full relative overflow-hidden rounded-md p-1" 
        style={{ backgroundColor: getLayerColor() }}
        {...attributes}
        {...listeners}
      >
        <div className="absolute inset-0 border-2 border-dashed border-stone-500/20"></div>
        <div className="absolute top-1 left-1 bg-stone-800/80 text-white text-[8px] px-1 rounded font-bold uppercase tracking-tighter z-20">
          {planter.name}
          {activeLayer === 'irrigation' && ' • Zone A'}
        </div>
        
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="absolute top-1 right-1 p-1 bg-white/80 rounded-md opacity-0 group-hover:opacity-100 transition-opacity z-20"
        >
          <Settings2 size={10} />
        </button>

        {/* Inhabitants inside planter */}
        <div className="grid grid-cols-4 gap-1 h-full p-2">
          {inhabitants.map(inhabitant => (
            <div key={inhabitant.id} className="w-full aspect-square bg-white rounded-full border border-primary/30 flex items-center justify-center overflow-hidden shadow-sm">
              {inhabitant.image ? (
                <img src={inhabitant.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <Leaf size={8 * zoom} className="text-primary" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DraggableItem({ id, type, position, size, zoom, image, name, activeLayer, inhabitant }: { id: string, type: string, position: { x: number, y: number }, size: { w: number, h: number }, zoom: number, image?: string, name: string, activeLayer: string, inhabitant?: Inhabitant }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: id,
    data: { type: type }
  });

  const style = {
    transform: transform ? CSS.Translate.toString(transform) : undefined,
    position: 'absolute' as const,
    left: position.x * CELL_SIZE * zoom,
    top: position.y * CELL_SIZE * zoom,
    width: size.w * CELL_SIZE * zoom,
    height: size.h * CELL_SIZE * zoom,
    zIndex: 30,
    opacity: isDragging ? 0.3 : 1,
  };

  const getHighlightColor = () => {
    if (activeLayer === 'family' && inhabitant?.family) {
      const families: Record<string, string> = {
        'Solanaceae': 'ring-red-500',
        'Brassicaceae': 'ring-green-500',
        'Cucurbitaceae': 'ring-yellow-500',
        'Lamiaceae': 'ring-purple-500'
      };
      return families[inhabitant.family] || 'ring-primary';
    }
    return 'ring-primary/20';
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...listeners} 
      {...attributes}
      onPointerDown={(e) => {
        e.stopPropagation();
        listeners?.onPointerDown(e);
      }}
      className={cn(
        "rounded-full border-2 border-primary bg-white shadow-lg flex items-center justify-center overflow-hidden cursor-move active:cursor-grabbing hover:scale-110 hover:ring-4 transition-transform group botanical-tooltip",
        getHighlightColor(),
        isDragging && "z-50"
      )}
      data-tooltip={name}
    >
      {image ? (
        <img src={image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
      ) : (
        <Leaf size={16 * zoom} className="text-primary" />
      )}
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-stone-800 text-white text-[8px] px-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
        {name}
        {activeLayer === 'family' && inhabitant?.family && ` (${inhabitant.family})`}
      </div>
    </div>
  );
}
