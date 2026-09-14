import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Zap, 
  Coffee, 
  Brain, 
  Target, 
  History, 
  CheckCircle2, 
  AlertCircle,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { format, addDays, subDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameDay, isToday, addMinutes, isAfter, isBefore, differenceInMinutes } from 'date-fns';
import { cn } from '@/src/lib/utils';
import { EventLog, EnergyLevel } from '../types';

interface NeuroCalendarProps {
  events: EventLog[];
  onCompleteTask: (taskId: string) => void;
  onAddTask: (date: Date) => void;
  userXP: number;
}

export default function NeuroCalendar({ events, onCompleteTask, onAddTask, userXP }: NeuroCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [focusMode, setFocusMode] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [dayProgress, setDayProgress] = useState(0);

  // Time Blindness Progress Bar logic
  useEffect(() => {
    const updateProgress = () => {
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
      const totalMinutes = 24 * 60;
      const elapsedMinutes = differenceInMinutes(now, startOfDay);
      setDayProgress((elapsedMinutes / totalMinutes) * 100);
    };

    updateProgress();
    const interval = setInterval(updateProgress, 60000);
    return () => clearInterval(interval);
  }, []);

  // Rolling Task Logic: Auto-migrate uncompleted tasks to today
  const processedEvents = useMemo(() => {
    const today = new Date();
    return events.map(event => {
      const eventDate = new Date(event.date);
      if (isBefore(eventDate, today) && !isSameDay(eventDate, today) && !event.data?.completed) {
        return { ...event, date: format(today, 'yyyy-MM-dd'), isPersistent: true };
      }
      return event;
    });
  }, [events]);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = [];
  let day = startDate;
  while (day <= endDate) {
    calendarDays.push(day);
    day = addDays(day, 1);
  }

  const getEventsForDay = (date: Date) => {
    return processedEvents.filter(e => isSameDay(new Date(e.date), date));
  };

  const getEnergyColor = (level?: EnergyLevel) => {
    switch (level) {
      case 'High': return 'bg-red-500 text-white';
      case 'Medium': return 'bg-amber-500 text-white';
      case 'Low': return 'bg-green-500 text-white';
      default: return 'bg-stone-200 text-stone-600';
    }
  };

  return (
    <div className={cn(
      "flex flex-col h-full transition-all duration-700 rounded-[3rem] overflow-hidden border border-outline-variant/10 bg-white shadow-2xl",
      focusMode && "fixed inset-0 z-[200] rounded-none bg-stone-950 text-stone-100 border-none"
    )}>
      {/* Time Blindness Bar */}
      <div className="h-2 bg-stone-100 relative overflow-hidden">
        <motion.div 
          className="absolute inset-y-0 left-0 bg-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]"
          initial={{ width: 0 }}
          animate={{ width: `${dayProgress}%` }}
          transition={{ duration: 1 }}
        />
        {/* Deadline Markers */}
        <div className="absolute inset-0 flex">
          {[...Array(24)].map((_, i) => (
            <div key={i} className="flex-1 border-r border-stone-200/50 h-full" />
          ))}
        </div>
      </div>

      {/* Header */}
      <div className={cn(
        "p-8 flex items-center justify-between",
        focusMode ? "bg-stone-900" : "bg-stone-50/50"
      )}>
        <div className="flex items-center gap-6">
          <div>
            <h2 className="text-3xl font-black font-headline tracking-tight">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <p className="text-xs font-bold text-on-surface-variant opacity-50 uppercase tracking-widest">
              Visual Momentum Calendar
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setCurrentDate(subDays(currentDate, 30))} className="p-3 hover:bg-stone-200 rounded-2xl transition-all"><ChevronLeft /></button>
            <button onClick={() => setCurrentDate(addDays(currentDate, 30))} className="p-3 hover:bg-stone-200 rounded-2xl transition-all"><ChevronRight /></button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Focus Mode Toggle */}
          <button 
            onClick={() => setFocusMode(!focusMode)}
            className={cn(
              "px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all",
              focusMode ? "bg-primary text-white" : "bg-stone-200 text-on-surface-variant"
            )}
          >
            {focusMode ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            {focusMode ? 'Exit Focus' : 'Focus Mode'}
          </button>
          
          {focusMode && (
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className="p-3 bg-stone-800 rounded-2xl text-stone-400 hover:text-white transition-all"
            >
              {isMuted ? <VolumeX /> : <Volume2 />}
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Calendar Grid */}
        {!focusMode && (
          <div className="flex-1 p-8 overflow-y-auto">
            <div className="grid grid-cols-7 gap-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="text-center text-[10px] font-black uppercase tracking-widest text-stone-400 mb-4">{d}</div>
              ))}
              {calendarDays.map((date, i) => {
                const dayEvents = getEventsForDay(date);
                const isCurrentMonth = date.getMonth() === currentDate.getMonth();
                const isSelected = isSameDay(date, selectedDate);

                return (
                  <motion.button
                    key={i}
                    onClick={() => setSelectedDate(date)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      "aspect-square p-4 rounded-3xl border-2 transition-all relative group flex flex-col items-center justify-between",
                      isSelected ? "bg-primary border-primary text-white shadow-xl shadow-primary/20" : "bg-stone-50 border-transparent hover:border-primary/20",
                      !isCurrentMonth && "opacity-30",
                      isToday(date) && !isSelected && "border-primary/50"
                    )}
                  >
                    <span className="text-lg font-black">{format(date, 'd')}</span>
                    
                    {/* Energy Dots */}
                    <div className="flex gap-1">
                      {dayEvents.slice(0, 3).map((e, ei) => (
                        <div key={ei} className={cn("w-1.5 h-1.5 rounded-full", getEnergyColor(e.energyLevel))} />
                      ))}
                      {dayEvents.length > 3 && <span className="text-[8px] font-black">+</span>}
                    </div>

                    {isToday(date) && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-white" />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}

        {/* Task Detail / Focus View */}
        <div className={cn(
          "w-full max-w-md flex flex-col border-l border-outline-variant/10",
          focusMode ? "max-w-none bg-stone-900/50 p-12" : "p-8 bg-stone-50/30"
        )}>
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-black font-headline">
                {focusMode ? 'Current Objectives' : format(selectedDate, 'EEEE, MMM do')}
              </h3>
              <p className="text-xs font-bold text-on-surface-variant opacity-50 uppercase tracking-widest">
                {getEventsForDay(selectedDate).length} Tasks Scheduled
              </p>
            </div>
            {!focusMode && (
              <button 
                onClick={() => onAddTask(selectedDate)}
                className="w-10 h-10 bg-primary text-white rounded-2xl flex items-center justify-center hover:scale-110 transition-all"
              >
                <Zap size={20} />
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto space-y-4">
            {getEventsForDay(selectedDate).map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  "p-6 rounded-[2rem] border transition-all group relative overflow-hidden",
                  focusMode ? "bg-stone-800 border-stone-700" : "bg-white border-stone-100 hover:shadow-md",
                  event.data?.completed && "opacity-50 grayscale"
                )}
              >
                {/* Buffer Time Visualization */}
                {event.energyLevel === 'High' && (
                  <div className="absolute top-0 left-0 w-1 h-full bg-red-500/20" />
                )}

                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
                      getEnergyColor(event.energyLevel)
                    )}>
                      {event.energyLevel === 'High' ? <Zap size={24} /> : event.energyLevel === 'Medium' ? <Coffee size={24} /> : <Brain size={24} />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-black text-lg">{event.calendarTitle || event.type}</h4>
                        {event.isPersistent && (
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[8px] font-black uppercase tracking-widest rounded-full">Persistent</span>
                        )}
                      </div>
                      <p className="text-xs font-medium text-on-surface-variant opacity-70">{event.calendarDescription || 'No details'}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => onCompleteTask(event.id)}
                    className={cn(
                      "w-10 h-10 rounded-2xl flex items-center justify-center transition-all",
                      event.data?.completed ? "bg-green-500 text-white" : "bg-stone-100 text-stone-400 hover:bg-green-100 hover:text-green-600"
                    )}
                  >
                    {event.data?.completed ? <CheckCircle2 size={20} /> : <div className="w-5 h-5 border-2 border-current rounded-full" />}
                  </button>
                </div>

                {/* Buffer Time Label */}
                {event.energyLevel === 'High' && !event.data?.completed && (
                  <div className="mt-4 pt-4 border-t border-stone-100 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-stone-400">
                    <Clock size={12} />
                    <span>30m Transition Buffer Active</span>
                  </div>
                )}
              </motion.div>
            ))}

            {getEventsForDay(selectedDate).length === 0 && (
              <div className="h-40 flex flex-col items-center justify-center text-stone-400 space-y-2">
                <Target size={40} className="opacity-20" />
                <p className="text-xs font-bold uppercase tracking-widest">Clear Skies Today</p>
              </div>
            )}
          </div>

          {/* Focus Mode Soundscape */}
          {focusMode && (
            <div className="mt-8 p-6 bg-stone-800/50 rounded-3xl border border-stone-700 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary/20 text-primary rounded-full flex items-center justify-center animate-pulse">
                  <Volume2 size={20} />
                </div>
                <div>
                  <p className="text-sm font-black">Botanical Soundscape</p>
                  <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Brown Noise + Forest Rain</p>
                </div>
              </div>
              <div className="flex gap-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-1 bg-primary rounded-full animate-bounce" style={{ height: `${Math.random() * 20 + 10}px`, animationDelay: `${i * 0.1}s` }} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Evening Prep Trigger */}
      {new Date().getHours() >= 18 && (
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="p-6 bg-primary text-white flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-2xl"><AlertCircle /></div>
            <div>
              <p className="text-sm font-black">Sunset Review Prompt</p>
              <p className="text-xs font-medium opacity-80">You have critical tasks pending. Shall we prioritize them for tonight's session?</p>
            </div>
          </div>
          <button className="px-6 py-3 bg-white text-primary rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all">Review Now</button>
        </motion.div>
      )}
    </div>
  );
}
