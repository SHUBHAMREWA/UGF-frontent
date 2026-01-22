import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

/**
 * 🌍 CINEMATIC 3D EARTH
 * Hyper-realistic, minimal, high-end Apple/NASA style
 */
const Earth3DCinematic = () => {
  const canvasRef = useRef(null);
  const mousePos = useRef({ x: 0.5, y: 0.5 });
  const rotationRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    const centerX = canvas.width / (2 * dpr);
    const centerY = canvas.height / (2 * dpr);
    const radius = Math.min(centerX, centerY) * 0.75; // Larger Earth
    let rotation = 0;

    // Generate realistic Earth points
    const continents = [];
    const clouds = [];
    const cityLights = []; // City lights on night side
    const impactPoints = []; // Green impact markers

    // Continent points (simplified world map)
    for (let i = 0; i < 200; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      continents.push({ theta, phi, brightness: Math.random() * 0.3 + 0.4 });
    }

    // Cloud layer
    for (let i = 0; i < 80; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      clouds.push({ theta, phi, opacity: Math.random() * 0.3 + 0.1 });
    }

    // City lights (night side - Americas visible on left)
    for (let i = 0; i < 300; i++) {
      // Concentrate on Americas region (left side)
      const theta = Math.random() * Math.PI * 0.8 + Math.PI * 0.1; // Left hemisphere
      const phi = Math.acos(2 * Math.random() - 1);
      cityLights.push({ 
        theta, 
        phi, 
        brightness: Math.random() * 0.8 + 0.2,
        size: Math.random() * 1.5 + 0.5
      });
    }

    // Impact points (green markers for NGO locations)
    const impactLocations = [
      { theta: 0.5, phi: 0.8 }, // Africa
      { theta: 2.0, phi: 1.2 }, // Asia
      { theta: 3.5, phi: 0.9 }, // Americas
      { theta: 5.0, phi: 1.0 }, // Europe
    ];
    impactLocations.forEach(loc => {
      impactPoints.push({ ...loc, pulse: Math.random() * Math.PI * 2 });
    });

    // Global connecting lines (subtle)
    const connections = [
      { from: impactLocations[0], to: impactLocations[1] },
      { from: impactLocations[1], to: impactLocations[2] },
      { from: impactLocations[2], to: impactLocations[3] },
    ];

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);

      // Parallax offset
      const offsetX = (mousePos.current.x - 0.5) * 15;
      const offsetY = (mousePos.current.y - 0.5) * 15;

      rotation += 0.003; // Slow rotation

      // Draw orbit rings (1-2 elegant rings)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 2; i++) {
        ctx.beginPath();
        ctx.ellipse(
          centerX + offsetX,
          centerY + offsetY,
          radius * (1 + i * 0.12),
          radius * (1 + i * 0.12) * 0.25,
          Math.PI / 6,
          0,
          Math.PI * 2
        );
        ctx.stroke();
      }

      // Draw global connecting lines (faint)
      ctx.strokeStyle = 'rgba(123, 255, 179, 0.15)';
      ctx.lineWidth = 0.5;
      connections.forEach(conn => {
        const fromX = radius * Math.sin(conn.from.phi) * Math.cos(conn.from.theta + rotation);
        const fromY = radius * Math.sin(conn.from.phi) * Math.sin(conn.from.theta + rotation);
        const fromZ = radius * Math.cos(conn.from.phi);
        const toX = radius * Math.sin(conn.to.phi) * Math.cos(conn.to.theta + rotation);
        const toY = radius * Math.sin(conn.to.phi) * Math.sin(conn.to.theta + rotation);
        const toZ = radius * Math.cos(conn.to.phi);

        if (fromZ > -radius * 0.5 && toZ > -radius * 0.5) {
          ctx.beginPath();
          ctx.moveTo(centerX + fromX + offsetX, centerY + fromY * 0.8 + offsetY);
          ctx.lineTo(centerX + toX + offsetX, centerY + toY * 0.8 + offsetY);
          ctx.stroke();
        }
      });

      // Draw continents (land masses)
      continents.forEach(point => {
        const x = radius * Math.sin(point.phi) * Math.cos(point.theta + rotation);
        const y = radius * Math.sin(point.phi) * Math.sin(point.theta + rotation);
        const z = radius * Math.cos(point.phi);

        if (z > -radius * 0.2) {
          const scale = (z + radius) / (2 * radius);
          const size = scale * 2.5;
          const alpha = scale * 0.6 * point.brightness;

          const screenX = centerX + x + offsetX;
          const screenY = centerY + y * 0.8 + offsetY;

          // Land color (subtle green-brown)
          ctx.fillStyle = `rgba(14, 122, 79, ${alpha})`;
          ctx.beginPath();
          ctx.arc(screenX, screenY, size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Draw oceans (glossy blue)
      ctx.fillStyle = 'rgba(10, 42, 67, 0.4)';
      ctx.beginPath();
      ctx.arc(centerX + offsetX, centerY + offsetY, radius * 0.95, 0, Math.PI * 2);
      ctx.fill();

      // Draw clouds (soft white) - only on day side
      clouds.forEach(cloud => {
        const x = radius * Math.sin(cloud.phi) * Math.cos(cloud.theta + rotation * 0.7);
        const y = radius * Math.sin(cloud.phi) * Math.sin(cloud.theta + rotation * 0.7);
        const z = radius * Math.cos(cloud.phi);

        // Only show clouds on day side (right side)
        if (z > -radius * 0.2 && x > 0) {
          const scale = (z + radius) / (2 * radius);
          const size = scale * 4;
          const alpha = scale * cloud.opacity;

          const screenX = centerX + x + offsetX;
          const screenY = centerY + y * 0.8 + offsetY;

          // Soft cloud
          const gradient = ctx.createRadialGradient(screenX, screenY, 0, screenX, screenY, size);
          gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
          gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(screenX, screenY, size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Draw city lights (night side - left/Americas)
      cityLights.forEach(light => {
        const x = radius * Math.sin(light.phi) * Math.cos(light.theta + rotation);
        const y = radius * Math.sin(light.phi) * Math.sin(light.theta + rotation);
        const z = radius * Math.cos(light.phi);

        // Only show on night side (left side)
        if (z > -radius * 0.2 && x < 0) {
          const scale = (z + radius) / (2 * radius);
          const size = scale * light.size;
          const alpha = scale * light.brightness * 0.8;

          const screenX = centerX + x + offsetX;
          const screenY = centerY + y * 0.8 + offsetY;

          // City light glow (warm white/yellow)
          const gradient = ctx.createRadialGradient(screenX, screenY, 0, screenX, screenY, size * 3);
          gradient.addColorStop(0, `rgba(255, 242, 200, ${alpha})`);
          gradient.addColorStop(0.5, `rgba(255, 220, 150, ${alpha * 0.5})`);
          gradient.addColorStop(1, 'rgba(255, 200, 100, 0)');
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(screenX, screenY, size * 3, 0, Math.PI * 2);
          ctx.fill();

          // City light core
          ctx.fillStyle = `rgba(255, 242, 200, ${alpha})`;
          ctx.beginPath();
          ctx.arc(screenX, screenY, size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Draw impact points (green markers)
      impactPoints.forEach(point => {
        point.pulse += 0.02;
        const x = radius * Math.sin(point.phi) * Math.cos(point.theta + rotation);
        const y = radius * Math.sin(point.phi) * Math.sin(point.theta + rotation);
        const z = radius * Math.cos(point.phi);

        if (z > -radius * 0.3) {
          const scale = (z + radius) / (2 * radius);
          const pulseScale = 1 + Math.sin(point.pulse) * 0.2;
          const size = scale * 3 * pulseScale;
          const alpha = scale * 0.8;

          const screenX = centerX + x + offsetX;
          const screenY = centerY + y * 0.8 + offsetY;

          // Glow
          const gradient = ctx.createRadialGradient(screenX, screenY, 0, screenX, screenY, size * 2);
          gradient.addColorStop(0, `rgba(123, 255, 179, ${alpha * 0.4})`);
          gradient.addColorStop(1, 'rgba(123, 255, 179, 0)');
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(screenX, screenY, size * 2, 0, Math.PI * 2);
          ctx.fill();

          // Point
          ctx.fillStyle = `rgba(123, 255, 179, ${alpha})`;
          ctx.beginPath();
          ctx.arc(screenX, screenY, size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Atmospheric rim glow
      const rimGradient = ctx.createRadialGradient(
        centerX + offsetX, centerY + offsetY, radius * 0.9,
        centerX + offsetX, centerY + offsetY, radius * 1.1
      );
      rimGradient.addColorStop(0, 'rgba(88, 195, 255, 0)');
      rimGradient.addColorStop(0.5, 'rgba(88, 195, 255, 0.1)');
      rimGradient.addColorStop(1, 'rgba(88, 195, 255, 0)');
      ctx.fillStyle = rimGradient;
      ctx.beginPath();
      ctx.arc(centerX + offsetX, centerY + offsetY, radius * 1.1, 0, Math.PI * 2);
      ctx.fill();

      requestAnimationFrame(animate);
    };

    animate();

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
    <div className="relative w-full h-full flex items-center justify-center">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{
          filter: 'drop-shadow(0 0 60px rgba(88, 195, 255, 0.15))',
        }}
      />
    </div>
  );
};

export default Earth3DCinematic;

