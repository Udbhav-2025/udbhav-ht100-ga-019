'use client';

import { useEffect, useRef } from 'react';

export default function CreateBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Orbiting particles
    class OrbitingParticle {
      centerX: number;
      centerY: number;
      angle: number;
      radius: number;
      speed: number;
      size: number;
      color: string;
      orbitRadius: number;

      constructor(canvasWidth: number, canvasHeight: number) {
        this.centerX = Math.random() * canvasWidth;
        this.centerY = Math.random() * canvasHeight;
        this.angle = Math.random() * Math.PI * 2;
        this.orbitRadius = Math.random() * 150 + 50;
        this.radius = this.orbitRadius;
        this.speed = Math.random() * 0.02 + 0.01;
        this.size = Math.random() * 3 + 2;
        const colors = [
          'rgba(59, 130, 246, 0.6)',
          'rgba(139, 92, 246, 0.6)',
          'rgba(236, 72, 153, 0.6)',
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.angle += this.speed;
        this.radius = this.orbitRadius + Math.sin(this.angle * 2) * 20;
      }

      get x() {
        return this.centerX + Math.cos(this.angle) * this.radius;
      }

      get y() {
        return this.centerY + Math.sin(this.angle) * this.radius;
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        // Glow effect
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    const particles: OrbitingParticle[] = [];
    const particleCount = 40;

    for (let i = 0; i < particleCount; i++) {
      particles.push(new OrbitingParticle(canvas.width, canvas.height));
    }

    let animationFrameId: number;

    const animate = () => {
      if (!ctx) return;

      // Dark gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#0f172a');
      gradient.addColorStop(0.3, '#1e293b');
      gradient.addColorStop(0.7, '#1e293b');
      gradient.addColorStop(1, '#0f172a');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      // Draw orbital connections
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.2)';
      ctx.lineWidth = 1;

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.globalAlpha = (100 - distance) / 100 * 0.3;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-10"
      style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}
    />
  );
}

