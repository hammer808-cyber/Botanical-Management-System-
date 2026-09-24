import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  Search,
  MessageSquare,
  X,
  LogOut,
  Leaf,
  Flower2,
  ChevronRight,
  ChevronDown,
  Sprout,
  Fence,
  DollarSign,
  Settings,
  HeartPulse,
  LayoutDashboard,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { useFirebase } from '../contexts/FirebaseContext';
import { useActivePlot } from '../contexts/ActivePlotContext';
import GlobalActionHub from './GlobalActionHub';

interface LayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  path: string;
  label: string;
  icon: any;
  matchPaths?: string[];
  exact?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { path: '/', label: 'Home', icon: LayoutDashboard, exact: true },
  { path: '/plots', label: 'My Plots', icon: Fence, matchPaths: ['/plots'] },
  { path: '/plants', label: 'Plants', icon: Sprout, matchPaths: ['/plants', '/inventory', '/library', '/companions', '/plant'] },
  { path: '/care', label: 'Care', icon: HeartPulse, matchPaths: ['/care', '/treatment', '/weeding', '/calendar'] },
  { path: '/financials', label: 'Financials', icon: DollarSign },
  { path: '/chat', label: 'Chat', icon: MessageSquare },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useFirebase();
  const { plots, activePlotId, setActivePlotId, activePlot } = useActivePlot();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [isPlotMenuOpen, setIsPlotMenuOpen] = React.useState(false);

  const switchPlot = (id: string) => {
    setActivePlotId(id);
    setIsPlotMenuOpen(false);
    // If we're on a plot-specific page, follow the switch there too.
    if (/^\/plots\/[^/]+(\/beds\/[^/]+)?$/.test(location.pathname)) {
      navigate(`/plots/${id}`);
    }
  };

  const isActive = (item: NavItem) => {
    if (item.exact) return location.pathname === item.path;
    if (item.matchPaths) return item.matchPaths.some(p => location.pathname.startsWith(p));
    return location.pathname === item.path;
  };

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

              <nav className="flex-1 flex flex-col gap-1 overflow-y-auto pr-2 custom-scrollbar" aria-label="Main navigation">
                {NAV_ITEMS.map((item) => {
                  const active = isActive(item);
                  const Icon = item.icon;
                  const isGarden = item.label === 'My Plots';

                  return (
                    <div key={item.path} className="space-y-1">
                      <Link
                        to={item.path}
                        onClick={() => setIsSidebarOpen(false)}
                        className={cn(
                          "flex items-center gap-4 px-6 py-3.5 rounded-2xl transition-all duration-200 group",
                          active
                            ? "bg-primary text-white shadow-xl shadow-primary/30"
                            : "text-on-surface hover:bg-primary/10 hover:text-primary"
                        )}
                      >
                        <Icon size={22} className="transition-transform group-hover:scale-110" />
                        <span className="text-base font-bold flex-1">{item.label}</span>
                        {isGarden && plots.length > 0 && <ChevronRight size={14} className={cn("transition-transform", active && "rotate-90")} />}
                      </Link>

                      {isGarden && plots.length > 0 && (
                        <div className="ml-12 space-y-1 overflow-hidden">
                          {plots.map(plot => (
                            <Link
                              key={plot.id}
                              to={`/plots/${plot.id}`}
                              onClick={() => { setActivePlotId(plot.id); setIsSidebarOpen(false); }}
                              className={cn(
                                "flex items-center gap-3 px-4 py-2 rounded-xl text-xs transition-all",
                                location.pathname === `/plots/${plot.id}`
                                  ? "bg-primary/10 text-primary font-bold"
                                  : "text-on-surface-variant/60 hover:text-primary hover:bg-primary/5"
                              )}
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                              <span className="truncate">{plot.name}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </nav>

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
            aria-label="Open navigation menu"
          >
            <Menu size={24} />
          </button>
          <h1 className="font-headline font-black text-xl text-primary tracking-tighter italic">The Farm</h1>
          {plots.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setIsPlotMenuOpen(v => !v)}
                className="flex items-center gap-1.5 max-w-[38vw] px-3 py-1.5 rounded-full bg-primary/10 hover:bg-primary/15 text-primary text-sm font-bold transition-colors"
                aria-label="Switch active plot"
              >
                <Fence size={15} className="shrink-0" />
                <span className="truncate">{activePlot?.name || 'Select plot'}</span>
                <ChevronDown size={14} className={cn("shrink-0 transition-transform", isPlotMenuOpen && "rotate-180")} />
              </button>
              <AnimatePresence>
                {isPlotMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsPlotMenuOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-outline-variant/30 overflow-hidden z-50"
                    >
                      <p className="px-4 pt-3 pb-1 text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60">Active plot</p>
                      {plots.map(plot => (
                        <button
                          key={plot.id}
                          onClick={() => switchPlot(plot.id)}
                          className={cn(
                            "w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors",
                            plot.id === activePlotId
                              ? "bg-primary/10 text-primary font-bold"
                              : "text-on-surface hover:bg-primary/5"
                          )}
                        >
                          <span className="flex-1 truncate">{plot.name}</span>
                          {plot.id === activePlotId && <Check size={16} className="shrink-0" />}
                        </button>
                      ))}
                      <Link
                        to="/plots"
                        onClick={() => setIsPlotMenuOpen(false)}
                        className="block px-4 py-2.5 text-sm font-bold text-primary hover:bg-primary/5 border-t border-outline-variant/30"
                      >
                        Manage plots…
                      </Link>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
        <div className="flex items-center gap-4">
          <button className="text-primary hover:bg-primary/5 p-2 rounded-full transition-colors" aria-label="Search">
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

      <main className="flex-1 pt-16 pb-8">
        {children}
      </main>

      <GlobalActionHub />
    </div>
  );
}
