import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

/**
 * 🌍 3D Globe Component with Parallax
 * Pure CSS/Canvas implementation (no Three.js dependency needed)
 */
const Globe3D = () => {
  const canvasRef = useRef(null);
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    
    // Set canvas size
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    // Globe properties
    const centerX = canvas.width / (2 * dpr);
    const centerY = canvas.height / (2 * dpr);
    const radius = Math.min(centerX, centerY) * 0.7;
    let rotation = 0;

    // Generate globe points
    const points = [];
    const numPoints = 800;
    for (let i = 0; i < numPoints; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      points.push({
        theta,
        phi,
        isGreen: Math.random() > 0.5,
        brightness: Math.random() * 0.5 + 0.5
      });
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
      
      // Parallax offset based on mouse
      const offsetX = (mousePos.current.x - 0.5) * 20;
      const offsetY = (mousePos.current.y - 0.5) * 20;

      rotation += 0.002;

      // Draw orbit rings
      ctx.strokeStyle = 'rgba(88, 195, 255, 0.15)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.ellipse(
          centerX + offsetX,
          centerY + offsetY,
          radius * (1 + i * 0.15),
          radius * (1 + i * 0.15) * 0.3,
          Math.PI / 6,
          0,
          Math.PI * 2
        );
        ctx.stroke();
      }

      // Draw globe points
      points.forEach(point => {
        const x = radius * Math.sin(point.phi) * Math.cos(point.theta + rotation);
        const y = radius * Math.sin(point.phi) * Math.sin(point.theta + rotation);
        const z = radius * Math.cos(point.phi);

        // Depth sorting
        if (z > -radius * 0.3) {
          const scale = (z + radius) / (2 * radius);
          const size = scale * 3 * point.brightness;
          const alpha = scale * 0.8;

          const screenX = centerX + x + offsetX;
          const screenY = centerY + y * 0.8 + offsetY;

          // Draw glow
          const gradient = ctx.createRadialGradient(screenX, screenY, 0, screenX, screenY, size * 3);
          gradient.addColorStop(0, point.isGreen 
            ? `rgba(123, 255, 179, ${alpha * 0.6})` 
            : `rgba(88, 195, 255, ${alpha * 0.6})`
          );
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(screenX, screenY, size * 3, 0, Math.PI * 2);
          ctx.fill();

          // Draw point
          ctx.fillStyle = point.isGreen 
            ? `rgba(123, 255, 179, ${alpha})` 
            : `rgba(88, 195, 255, ${alpha})`;
          ctx.beginPath();
          ctx.arc(screenX, screenY, size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      requestAnimationFrame(animate);
    };

    animate();

    // Mouse tracking
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mousePos.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height
      };
    };
    canvas.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <motion.div
      className="relative w-full h-full"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
    >
      {/* Golden radial glow behind globe */}
      <div 
        className="absolute inset-0 opacity-30 blur-3xl"
        style={{
          background: 'radial-gradient(circle at center, #FFCF4D 0%, transparent 70%)',
        }}
      />
      
      {/* Canvas for 3D globe */}
      <canvas
        ref={canvasRef}
        className="w-full h-full relative z-10"
        style={{ 
          filter: 'drop-shadow(0 0 40px rgba(88, 195, 255, 0.4))'
        }}
      />
      
      {/* Rotating glow ring */}
      <motion.div
        className="absolute inset-0 opacity-20"
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        style={{
          background: 'conic-gradient(from 0deg, transparent 0%, #58C3FF 50%, transparent 100%)',
          borderRadius: '50%',
          filter: 'blur(30px)'
        }}
      />
    </motion.div>
  );
};

export default Globe3D;

