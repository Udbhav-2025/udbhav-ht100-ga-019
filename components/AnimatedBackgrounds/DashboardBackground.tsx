'use client';

import { useEffect, useRef } from 'react';

export default function DashboardBackground() {
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

    // Wave particles with flowing motion
    class WaveParticle {
      x: number;
      y: number;
      radius: number;
      speed: number;
      angle: number;
      amplitude: number;
      frequency: number;
      color: string;

      constructor(canvasWidth: number, canvasHeight: number) {
        this.x = Math.random() * canvasWidth;
        this.y = canvasHeight / 2;
        this.radius = Math.random() * 4 + 2;
        this.speed = Math.random() * 0.02 + 0.01;
        this.angle = Math.random() * Math.PI * 2;
        this.amplitude = Math.random() * 100 + 50;
        this.frequency = Math.random() * 0.02 + 0.01;
        this.color = `rgba(${Math.random() > 0.5 ? '99, 102, 241' : '59, 130, 246'}, ${Math.random() * 0.3 + 0.1})`;
      }

      update(canvasWidth: number, canvasHeight: number, time: number) {
        this.angle += this.speed;
        this.x += Math.sin(this.angle) * 0.5;
        this.y = canvasHeight / 2 + Math.sin(this.angle * this.frequency + time) * this.amplitude;

        if (this.x > canvasWidth) this.x = 0;
        if (this.x < 0) this.x = canvasWidth;
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const particles: WaveParticle[] = [];
    const particleCount = 60;

    for (let i = 0; i < particleCount; i++) {
      particles.push(new WaveParticle(canvas.width, canvas.height));
    }

    let time = 0;
    let animationFrameId: number;

    const animate = () => {
      if (!ctx) return;
      time += 0.01;

      // Gradient background
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        Math.max(canvas.width, canvas.height)
      );
      gradient.addColorStop(0, '#1e293b');
      gradient.addColorStop(0.5, '#0f172a');
      gradient.addColorStop(1, '#1e293b');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach((particle) => {
        particle.update(canvas.width, canvas.height, time);
        particle.draw();
      });

      // Draw flowing connections
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.15)';
      ctx.lineWidth = 1;

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            ctx.globalAlpha = (120 - distance) / 120;
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
      style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)' }}
    />
  );
}

