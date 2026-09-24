import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, 
  Search, 
  Library, 
  Scan, 
  MessageSquare, 
  Heart, 
  LayoutGrid, 
  BookOpen, 
  Calendar, 
  Map as MapIcon, 
  User, 
  X, 
  LogOut, 
  Leaf, 
  Flower2, 
  ChevronRight,
  Sprout,
  Grid3X3,
  ScrollText,
  ShieldPlus,
  Book,
  Gavel,
  Settings,
  ClipboardList,
  Fence,
  Droplets,
  DollarSign,
  HeartHandshake
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { useFirebase } from '../contexts/FirebaseContext';
import GlobalActionHub from './GlobalActionHub';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../firebase';

interface LayoutProps {
  children: React.ReactNode;
  showBottomNav?: boolean;
}

export default function Layout({ children, showBottomNav = true }: LayoutProps) {
  const { user, logout } = useFirebase();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [plots, setPlots] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'plots'), where('ownerUid', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPlots(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [user]);

  const mainNavItem = { path: '/', label: 'Hub', icon: Sprout };
  
  const secondaryNavItems = [
    { path: '/inventory', label: 'Inventory', icon: ClipboardList },
    { path: '/plots', label: 'Plots', icon: Fence },
    { path: '/financials', label: 'Financials', icon: DollarSign },
    { path: '/weeding', label: 'Weeding', icon: Leaf },
    { path: '/treatment', label: 'Treatment', icon: Droplets },
    { path: '/calendar', label: 'Calendar', icon: Calendar },
    { path: '/companions', label: 'Companions', icon: HeartHandshake },
  ];

  const bottomNavItems = [
    { path: '/library', label: 'Library', icon: Book },
    { path: '/chat', label: 'Chat', icon: MessageSquare },
    { path: '/rules', label: 'Rules', icon: Gavel },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col leaf-pattern overflow-x-hidden">
      {/* Floating Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-10">
        <motion.div 
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 10, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 -left-10 text-primary"
        >
          <Leaf size={120} />
        </motion.div>
        <motion.div 
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, -15, 0]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-1/2 -right-16 text-secondary"
        >
          <Flower2 size={180} />
        </motion.div>
        <motion.div 
          animate={{ 
            y: [0, -30, 0],
            rotate: [0, 20, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-20 left-1/4 text-tertiary"
        >
          <Leaf size={80} />
        </motion.div>
      </div>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-white z-[70] shadow-2xl flex flex-col p-6"
            >
              <div className="flex justify-between items-center mb-10">
                <h2 className="font-headline font-black text-2xl text-primary tracking-tighter italic">The Farm</h2>
                <button 
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 hover:bg-primary/5 rounded-full transition-colors text-on-surface-variant"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
                {/* Main Hub Button */}
                <Link
                  to={mainNavItem.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-4 px-6 py-4 rounded-[2rem] transition-all duration-300 group",
                    location.pathname === mainNavItem.path 
                      ? "bg-primary text-white shadow-xl shadow-primary/30 scale-[1.02]" 
                      : "text-on-surface hover:bg-primary/10 hover:text-primary"
                  )}
                >
                  <mainNavItem.icon size={28} className={cn("transition-transform duration-300 group-hover:scale-110", location.pathname === mainNavItem.path && "fill-current")} />
                  <span className="text-xl font-black tracking-tight">{mainNavItem.label}</span>
                </Link>

                {/* Secondary Navigation */}
                <div className="space-y-1">
                  <p className="px-6 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/50 mb-2">Management</p>
                  {secondaryNavItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    const Icon = item.icon;
                    const isPlots = item.label === 'Plots';

                    return (
                      <div key={item.path} className="space-y-1">
                        <Link
                          to={item.path}
                          onClick={() => setIsSidebarOpen(false)}
                          className={cn(
                            "flex items-center gap-4 px-6 py-3 rounded-2xl transition-all duration-200 group",
                            isActive 
                              ? "bg-secondary/10 text-secondary font-black" 
                              : "text-on-surface-variant hover:bg-secondary/5 hover:text-secondary"
                          )}
                        >
                          <Icon size={20} className="transition-transform group-hover:scale-110" />
                          <span className="text-sm font-bold flex-1">{item.label}</span>
                          {isPlots && plots.length > 0 && <ChevronRight size={14} className={cn("transition-transform", isActive && "rotate-90")} />}
                        </Link>
                        
                        {isPlots && plots.length > 0 && (
                          <div className="ml-12 space-y-1 overflow-hidden">
                            {plots.map(plot => (
                              <Link
                                key={plot.id}
                                to={`/plots/${plot.id}`}
                                onClick={() => setIsSidebarOpen(false)}
                                className={cn(
                                  "flex items-center gap-3 px-4 py-2 rounded-xl text-xs transition-all",
                                  location.pathname === `/plots/${plot.id}`
                                    ? "bg-secondary/5 text-secondary font-bold"
                                    : "text-on-surface-variant/60 hover:text-secondary hover:bg-secondary/5"
                                )}
                              >
                                <div className="w-1.5 h-1.5 rounded-full bg-secondary/40" />
                                <span className="truncate">{plot.name}</span>
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Bottom Navigation */}
                <div className="mt-auto pt-6 border-t border-outline-variant/30 space-y-1">
                  <p className="px-6 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/50 mb-2">Resources</p>
                  {bottomNavItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsSidebarOpen(false)}
                        className={cn(
                          "flex items-center gap-4 px-6 py-2.5 rounded-xl transition-all duration-200 group",
                          isActive 
                            ? "bg-tertiary/10 text-tertiary font-black" 
                            : "text-on-surface-variant/70 hover:bg-tertiary/5 hover:text-tertiary"
                        )}
                      >
                        <Icon size={18} className="transition-transform group-hover:scale-110" />
                        <span className="text-xs font-bold">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="pt-6 border-t border-outline-variant/30 space-y-4">
                <div className="flex items-center gap-4 p-2">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary-fixed">
                    <img 
                      src={user?.photoURL || "https://lh3.googleusercontent.com/aida-public/AB6AXuCheIjkqG3XLd4sRZxssqDxD6FZ7SKOFmSD0HT01vq_aKwfGLPNkiR6rPThk0qXDgd-vmS0PZ5mF2as95gkKXZp3TiWc4kMJQ-g_i8QH0EJUGJ-CIRY2kweYvJ9kngZ9vufLXgP3nf09lbyb3HFJdVtls4CuX1nzAei-PYZ0Xvd1BMKz7HwULaLvZpy2S23Zc8yJYiujaHmjqQbyYPn_sgE6E0zneLvMihmXOdnb-ya9k_emIuam-SfQdlg8HDgdTKhk5wQilHVFEO_"} 
                      alt="User profile"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-on-surface truncate">{user?.displayName || "Botanist"}</p>
                    <p className="text-xs text-on-surface-variant truncate">{user?.email}</p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    logout();
                    setIsSidebarOpen(false);
                  }}
                  className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl font-bold text-destructive hover:bg-destructive/5 transition-all"
                >
                  <LogOut size={20} />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Top App Bar */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm h-16 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="text-primary hover:bg-primary/5 p-2 rounded-full transition-colors"
          >
            <Menu size={24} />
          </button>
          <h1 className="font-headline font-black text-xl text-primary tracking-tighter italic">The Farm</h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-primary hover:bg-primary/5 p-2 rounded-full transition-colors">
            <Search size={24} />
          </button>
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-fixed">
            <img 
              src={user?.photoURL || "https://lh3.googleusercontent.com/aida-public/AB6AXuCheIjkqG3XLd4sRZxssqDxD6FZ7SKOFmSD0HT01vq_aKwfGLPNkiR6rPThk0qXDgd-vmS0PZ5mF2as95gkKXZp3TiWc4kMJQ-g_i8QH0EJUGJ-CIRY2kweYvJ9kngZ9vufLXgP3nf09lbyb3HFJdVtls4CuX1nzAei-PYZ0Xvd1BMKz7HwULaLvZpy2S23Zc8yJYiujaHmjqQbyYPn_sgE6E0zneLvMihmXOdnb-ya9k_emIuam-SfQdlg8HDgdTKhk5wQilHVFEO_"} 
              alt="User profile"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </header>

      <main className="flex-1 pt-16 pb-24">
        {children}
      </main>

      <GlobalActionHub />

      {/* Bottom Navigation */}
      {showBottomNav && (
        <nav className="fixed bottom-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-[0_-4px_24px_rgba(21,66,18,0.06)] rounded-t-[2rem] flex justify-around items-center px-4 pb-6 pt-3 md:hidden">
          {[mainNavItem, ...secondaryNavItems].map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center justify-center px-4 py-1.5 transition-all duration-200",
                  isActive ? "bg-primary-fixed/30 text-primary rounded-full scale-110" : "text-on-surface-variant hover:text-primary"
                )}
              >
                <Icon size={22} className={cn(isActive && "fill-current")} />
                <span className="font-body text-[10px] font-black uppercase tracking-wider mt-1">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      )}
    </div>
  );
}
