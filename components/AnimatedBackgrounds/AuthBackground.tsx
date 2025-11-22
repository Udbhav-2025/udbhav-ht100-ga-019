'use client';

import { useEffect, useRef } from 'react';

export default function AuthBackground() {
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

    // Floating gradient blobs
    class Blob {
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
      color: string;
      pulseSpeed: number;
      pulsePhase: number;

      constructor(canvasWidth: number, canvasHeight: number) {
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.radius = Math.random() * 200 + 100;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.pulseSpeed = Math.random() * 0.01 + 0.005;
        this.pulsePhase = Math.random() * Math.PI * 2;
        const colors = [
          'rgba(59, 130, 246, 0.15)',
          'rgba(139, 92, 246, 0.15)',
          'rgba(236, 72, 153, 0.15)',
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update(canvasWidth: number, canvasHeight: number, time: number) {
        this.x += this.vx;
        this.y += this.vy;
        this.pulsePhase += this.pulseSpeed;

        if (this.x < -this.radius) this.x = canvasWidth + this.radius;
        if (this.x > canvasWidth + this.radius) this.x = -this.radius;
        if (this.y < -this.radius) this.y = canvasHeight + this.radius;
        if (this.y > canvasHeight + this.radius) this.y = -this.radius;
      }

      get currentRadius() {
        return this.radius + Math.sin(this.pulsePhase) * 30;
      }

      draw() {
        if (!ctx) return;
        const gradient = ctx.createRadialGradient(
          this.x,
          this.y,
          0,
          this.x,
          this.y,
          this.currentRadius
        );
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.currentRadius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const blobs: Blob[] = [];
    const blobCount = 5;

    for (let i = 0; i < blobCount; i++) {
      blobs.push(new Blob(canvas.width, canvas.height));
    }

    let time = 0;
    let animationFrameId: number;

    const animate = () => {
      if (!ctx) return;
      time += 0.01;

      // Dark background
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw blobs
      blobs.forEach((blob) => {
        blob.update(canvas.width, canvas.height, time);
        blob.draw();
      });

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
      style={{ background: '#0f172a' }}
    />
  );
}

