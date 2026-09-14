import React from 'react';
import { motion } from 'motion/react';
import { useFirebase } from '../contexts/FirebaseContext';
import { Leaf, LogIn } from 'lucide-react';

export default function Login() {
  const { signIn, loading } = useFirebase();

  if (loading) return null;

  return (
    <div className="min-h-screen bg-surface-container-lowest flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-[3rem] p-12 shadow-2xl border border-outline-variant/10 text-center"
      >
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
          <Leaf className="text-primary" size={48} />
        </div>
        
        <h1 className="font-headline text-4xl font-black text-on-surface mb-4 tracking-tight">The Farm</h1>
        <p className="font-body text-on-surface-variant mb-12 text-lg">
          Connect your garden to the cloud. Track, analyze, and grow with precision.
        </p>

        <button 
          onClick={signIn}
          className="w-full botanical-gradient text-white font-headline font-black py-6 rounded-full shadow-xl shadow-emerald-900/20 active:scale-95 transition-all flex items-center justify-center gap-4 uppercase tracking-[0.2em] text-sm"
        >
          <LogIn size={24} />
          <span>Sign in with Google</span>
        </button>

        <p className="mt-8 text-[10px] font-black uppercase tracking-widest text-outline">
          Secure Cloud Integration Powered by Firebase
        </p>
      </motion.div>
    </div>
  );
}
