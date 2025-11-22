'use client';

import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Instagram, Youtube, Linkedin, Twitter, Facebook, MessageCircle } from 'lucide-react';

interface IconData {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
  glowColor: string;
  initialX: number;
  initialY: number;
  rotationSpeed: number;
  floatSpeed: number;
  size: number;
}

export default function FloatingSocialIcons() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const iconSize = isMobile ? 48 : 72;

  // Generate keyframe positions that cover the entire area
  const generateKeyframes = (index: number, total: number) => {
    const baseOffset = (index / total) * Math.PI * 2;
    const keyframeCount = 8;
    const keyframes: { x: number; y: number }[] = [];
    
    // Create a pattern that covers corners and center
    const positions = [
      { x: 10, y: 10 },   // Top-left
      { x: 50, y: 15 },   // Top-center
      { x: 90, y: 10 },   // Top-right
      { x: 85, y: 50 },   // Right-center
      { x: 90, y: 90 },   // Bottom-right
      { x: 50, y: 85 },   // Bottom-center
      { x: 10, y: 90 },   // Bottom-left
      { x: 15, y: 50 },   // Left-center
    ];
    
    // Rotate through positions with offset for each icon
    for (let i = 0; i < keyframeCount; i++) {
      const posIndex = (i + Math.floor(index * 1.5)) % positions.length;
      const pos = positions[posIndex];
      
      // Add slight variation based on index
      const variation = 8;
      const x = pos.x + Math.sin(baseOffset + i) * variation;
      const y = pos.y + Math.cos(baseOffset + i) * variation;
      
      keyframes.push({
        x: Math.max(5, Math.min(95, x)),
        y: Math.max(5, Math.min(95, y)),
      });
    }
    
    // Return to start for smooth loop
    keyframes.push(keyframes[0]);
    
    return keyframes;
  };

  const icons: IconData[] = [
    {
      icon: Instagram,
      color: '#E4405F',
      glowColor: 'rgba(228, 64, 95, 0.5)',
      initialX: 20,
      initialY: 20,
      rotationSpeed: 0.8,
      floatSpeed: 1.5,
      size: iconSize,
    },
    {
      icon: Youtube,
      color: '#FF0000',
      glowColor: 'rgba(255, 0, 0, 0.5)',
      initialX: 80,
      initialY: 25,
      rotationSpeed: -0.6,
      floatSpeed: 2,
      size: iconSize,
    },
    {
      icon: Linkedin,
      color: '#0077B5',
      glowColor: 'rgba(0, 119, 181, 0.5)',
      initialX: 15,
      initialY: 70,
      rotationSpeed: 0.7,
      floatSpeed: 1.8,
      size: iconSize,
    },
    {
      icon: Twitter,
      color: '#1DA1F2',
      glowColor: 'rgba(29, 161, 242, 0.5)',
      initialX: 75,
      initialY: 75,
      rotationSpeed: -0.9,
      floatSpeed: 2.2,
      size: iconSize,
    },
    {
      icon: Facebook,
      color: '#1877F2',
      glowColor: 'rgba(24, 119, 242, 0.5)',
      initialX: 50,
      initialY: 15,
      rotationSpeed: 0.65,
      floatSpeed: 1.7,
      size: iconSize,
    },
    {
      icon: MessageCircle,
      color: '#25D366',
      glowColor: 'rgba(37, 211, 102, 0.5)',
      initialX: 45,
      initialY: 50,
      rotationSpeed: -0.75,
      floatSpeed: 1.9,
      size: iconSize,
    },
  ];

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden" style={{ perspective: '1000px' }}>
      {icons.map((iconData, index) => {
        const Icon = iconData.icon;
        
        // Generate keyframes that cover the entire area
        const keyframes = generateKeyframes(index, icons.length);
        
        // Create arrays for Framer Motion
        const xValues = keyframes.map(k => `${k.x}%`);
        const yValues = keyframes.map(k => `${k.y}%`);
        const times = keyframes.map((_, i) => i / (keyframes.length - 1));
        
        // Different durations for variety (slower = more coverage)
        const duration = 20 + index * 3;
        
        return (
          <motion.div
            key={index}
            className="absolute"
            style={{
              left: keyframes[0].x + '%',
              top: keyframes[0].y + '%',
              transformStyle: 'preserve-3d',
              x: '-50%',
              y: '-50%',
            }}
            animate={{
              left: xValues,
              top: yValues,
            }}
            transition={{
              duration: duration,
              repeat: Infinity,
              ease: 'easeInOut',
              times: times,
            }}
          >
            <motion.div
              className="relative"
              style={{
                filter: `drop-shadow(0 0 15px ${iconData.glowColor}) drop-shadow(0 0 30px ${iconData.glowColor}) drop-shadow(0 0 50px ${iconData.glowColor})`,
                transformStyle: 'preserve-3d',
              }}
              animate={{
                rotateY: [0, 360],
                rotateX: [0, 20, 0, -20, 0],
                rotateZ: [0, 15, 0, -15, 0],
                scale: [1, 1.15, 1],
              }}
              transition={{
                rotateY: {
                  duration: 8 + index * 2,
                  repeat: Infinity,
                  ease: 'linear',
                },
                rotateX: {
                  duration: 6 + index,
                  repeat: Infinity,
                  ease: 'easeInOut',
                },
                rotateZ: {
                  duration: 7 + index * 1.2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                },
                scale: {
                  duration: 4 + index * 0.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                },
              }}
            >
              <div
                style={{
                  background: `radial-gradient(circle, ${iconData.color}40, transparent)`,
                  borderRadius: '50%',
                  padding: '12px',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <Icon
                  size={iconData.size}
                  style={{
                    color: iconData.color,
                    filter: 'brightness(1.3) drop-shadow(0 0 8px currentColor)',
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}

