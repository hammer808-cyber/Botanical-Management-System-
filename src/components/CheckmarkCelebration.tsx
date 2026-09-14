import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check } from 'lucide-react';

interface CheckmarkCelebrationProps {
  isVisible: boolean;
  onComplete: () => void;
}

export default function CheckmarkCelebration({ isVisible, onComplete }: CheckmarkCelebrationProps) {
  return (
    <AnimatePresence onExitComplete={onComplete}>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-none"
        >
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: [0, 1.2, 1], rotate: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ 
              duration: 0.5, 
              type: "spring", 
              stiffness: 260, 
              damping: 20 
            }}
            className="w-32 h-32 bg-primary rounded-full flex items-center justify-center shadow-2xl shadow-primary/40"
          >
            <Check size={64} className="text-white" strokeWidth={4} />
          </motion.div>
          
          {/* Particles */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ x: 0, y: 0, scale: 0 }}
              animate={{ 
                x: Math.cos(i * 30 * (Math.PI / 180)) * 150, 
                y: Math.sin(i * 30 * (Math.PI / 180)) * 150,
                scale: [0, 1, 0]
              }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="absolute w-4 h-4 rounded-full bg-primary/60"
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
