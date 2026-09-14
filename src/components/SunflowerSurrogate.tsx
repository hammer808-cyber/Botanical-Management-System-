import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';

interface SunflowerProps {
  health: number; // 0 to 1
  xp: number;
  height?: number; // in mm
  className?: string;
  onClick?: () => void;
}

export default function SunflowerSurrogate({ health, xp, height, className, onClick }: SunflowerProps) {
  // Height scales with XP (total entries) or provided height
  const heightScale = height ? (height / 50) : Math.min(1.5, 0.5 + (xp / 1000));
  
  // Color scales with health
  const petalColor = health > 0.8 ? '#FBBF24' : health > 0.5 ? '#D97706' : '#92400E';
  const stemColor = health > 0.5 ? '#166534' : '#3F6212';
  const saturation = Math.max(0.2, health);

  // Nyctinasty: Sleep mode at night
  const isNight = new Date().getHours() >= 20 || new Date().getHours() <= 5;

  return (
    <motion.div 
      className={cn("relative cursor-pointer", className)}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <svg 
        viewBox="0 0 100 150" 
        className="w-full h-full drop-shadow-xl"
        style={{ filter: `saturate(${saturation})` }}
      >
        {/* Stem */}
        <motion.path
          d="M50 150 Q50 100 50 50"
          stroke={stemColor}
          strokeWidth="4"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ 
            pathLength: 1,
            d: health < 0.3 ? "M50 150 Q60 120 70 100" : "M50 150 Q50 100 50 50",
            scaleY: heightScale
          }}
          transition={{ type: 'spring', stiffness: 50 }}
        />

        {/* Leaves */}
        <motion.path
          d="M50 120 Q30 110 20 120"
          stroke={stemColor}
          strokeWidth="2"
          fill={stemColor}
          animate={{ rotate: health < 0.3 ? 20 : 0 }}
        />
        <motion.path
          d="M50 100 Q70 90 80 100"
          stroke={stemColor}
          strokeWidth="2"
          fill={stemColor}
          animate={{ rotate: health < 0.3 ? -20 : 0 }}
        />

        {/* Flower Head */}
        <motion.g
          animate={{ 
            y: health < 0.3 ? 50 : 0,
            rotate: isNight ? 180 : (health < 0.3 ? 45 : 0)
          }}
          transition={{ type: 'spring', damping: 10 }}
        >
          {/* Petals */}
          {[...Array(12)].map((_, i) => (
            <motion.ellipse
              key={i}
              cx="50"
              cy="50"
              rx="5"
              ry="15"
              fill={petalColor}
              transform={`rotate(${i * 30} 50 50)`}
              animate={{ 
                ry: isNight ? 5 : 15,
                scale: health < 0.5 ? 0.8 : 1
              }}
            />
          ))}
          
          {/* Center */}
          <circle cx="50" cy="50" r="10" fill="#451A03" />
          
          {/* Face (Anthropomorphic signal) */}
          <motion.g animate={{ opacity: isNight ? 0 : 1 }}>
            <circle cx="47" cy="48" r="1.5" fill="white" />
            <circle cx="53" cy="48" r="1.5" fill="white" />
            <motion.path 
              d={health > 0.7 ? "M46 53 Q50 56 54 53" : "M46 55 Q50 53 54 55"} 
              stroke="white" 
              strokeWidth="1" 
              fill="none" 
            />
          </motion.g>
        </motion.g>

        {/* Storm Cloud for Critical State */}
        {health < 0.2 && (
          <motion.g
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-stone-400"
          >
            <path d="M20 20 Q25 10 35 15 Q45 10 50 20 Q60 20 55 30 L25 30 Q15 30 20 20" fill="currentColor" />
          </motion.g>
        )}
      </svg>

      {/* XP Label */}
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
        <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-50">
          XP: {xp}
        </span>
      </div>
    </motion.div>
  );
}
