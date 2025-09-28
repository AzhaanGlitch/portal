// BackgroundAnimation.tsx
"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

const BackgroundAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const animationRef = useRef<number>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Color schemes based on theme
    const colors =
      theme === "dark"
        ? {
            primary: "#3B82F6", // Blue-500
            secondary: "#8B5CF6", // Purple-500
            accent: "#06B6D4", // Cyan-500
            background: "rgba(15, 23, 42, 0.1)",
            glow: "rgba(59, 130, 246, 0.3)",
          }
        : {
            primary: "#2563EB", // Blue-600
            secondary: "#7C3AED", // Purple-600
            accent: "#0891B2", // Cyan-600
            background: "rgba(255, 255, 255, 0.1)",
            glow: "rgba(37, 99, 235, 0.2)",
          };

    // Particle class
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      opacity: number;
      pulseSpeed: number;

      constructor() {
        if (canvas) {
          this.x = Math.random() * canvas.width;
          this.y = Math.random() * canvas.height;
          this.size = Math.random() * 3 + 1;
          this.speedX = Math.random() * 1 - 0.5;
          this.speedY = Math.random() * 1 - 0.5;
          this.color = [colors.primary, colors.secondary, colors.accent][
            Math.floor(Math.random() * 3)
          ];
          this.opacity = Math.random() * 0.6 + 0.2;
          this.pulseSpeed = Math.random() * 0.02 + 0.01;
        } else {
          this.x = 0;
          this.y = 0;
          this.size = 0;
          this.speedX = 0;
          this.speedY = 0;
          this.color = "#000";
          this.opacity = 0;
          this.pulseSpeed = 0;
        }
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (canvas) {
          // Bounce off edges
          if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
          if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }

        // Pulsing effect
        this.opacity =
          0.2 + Math.abs(Math.sin(Date.now() * this.pulseSpeed)) * 0.4;
      }

      draw() {
        if (!ctx) return;

        ctx.save();
        ctx.globalAlpha = this.opacity;

        // Create gradient for particles
        const gradient = ctx.createRadialGradient(
          this.x,
          this.y,
          0,
          this.x,
          this.y,
          this.size * 2
        );
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, "transparent");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }
    }

    // Connection lines between particles
    class Connection {
      particle1: Particle;
      particle2: Particle;
      opacity: number;

      constructor(p1: Particle, p2: Particle) {
        this.particle1 = p1;
        this.particle2 = p2;
        this.opacity = 0;
      }

      update() {
        const dx = this.particle1.x - this.particle2.x;
        const dy = this.particle1.y - this.particle2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Only draw connections for nearby particles
        if (distance < 150) {
          this.opacity = Math.min(1, (150 - distance) / 150) * 0.3;
        } else {
          this.opacity = 0;
        }
      }

      draw() {
        if (!ctx || this.opacity === 0) return;

        ctx.save();
        ctx.globalAlpha = this.opacity;

        const gradient = ctx.createLinearGradient(
          this.particle1.x,
          this.particle1.y,
          this.particle2.x,
          this.particle2.y
        );
        gradient.addColorStop(0, this.particle1.color);
        gradient.addColorStop(1, this.particle2.color);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(this.particle1.x, this.particle1.y);
        ctx.lineTo(this.particle2.x, this.particle2.y);
        ctx.stroke();
        ctx.restore();
      }
    }

    // Create particles and connections
    const particles: Particle[] = [];
    const connections: Connection[] = [];
    const particleCount = Math.min(
      50,
      Math.floor((canvas.width * canvas.height) / 20000)
    );

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Create connections between particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        connections.push(new Connection(particles[i], particles[j]));
      }
    }

    // Animation loop
    const animate = () => {
      if (!ctx) return;

      // Clear canvas with theme-appropriate background
      ctx.fillStyle = colors.background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw connections first (so they appear behind particles)
      connections.forEach((connection) => {
        connection.update();
        connection.draw();
      });

      // Update and draw particles
      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      // Add some floating abstract shapes
      ctx.save();
      ctx.globalAlpha = 0.1;

      // Large background circles
      const time = Date.now() * 0.001;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Circle 1
      ctx.beginPath();
      const circle1Radius = 200 + Math.sin(time * 0.3) * 50;
      const gradient1 = ctx.createRadialGradient(
        centerX - 100,
        centerY - 50,
        0,
        centerX - 100,
        centerY - 50,
        circle1Radius
      );
      gradient1.addColorStop(0, colors.glow);
      gradient1.addColorStop(1, "transparent");
      ctx.fillStyle = gradient1;
      ctx.arc(centerX - 100, centerY - 50, circle1Radius, 0, Math.PI * 2);
      ctx.fill();

      // Circle 2
      ctx.beginPath();
      const circle2Radius = 150 + Math.cos(time * 0.4) * 40;
      const gradient2 = ctx.createRadialGradient(
        centerX + 150,
        centerY + 100,
        0,
        centerX + 150,
        centerY + 100,
        circle2Radius
      );
      gradient2.addColorStop(
        0,
        theme === "dark"
          ? "rgba(139, 92, 246, 0.2)"
          : "rgba(124, 58, 237, 0.15)"
      );
      gradient2.addColorStop(1, "transparent");
      ctx.fillStyle = gradient2;
      ctx.arc(centerX + 150, centerY + 100, circle2Radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none"
      style={{
        background:
          theme === "dark"
            ? "radial-gradient(ellipse at center, #0f172a 0%, #020617 100%)"
            : "radial-gradient(ellipse at center, #ffffff 0%, #f8fafc 100%)",
      }}
    />
  );
};

export default BackgroundAnimation;
