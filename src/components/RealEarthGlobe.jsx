import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';

// Helper functions for texture generation
const createProceduralEarthTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  
  // Ocean base (deep blue gradient)
  const oceanGradient = ctx.createLinearGradient(0, 0, 0, 1024);
  oceanGradient.addColorStop(0, '#1a5a8a');
  oceanGradient.addColorStop(0.5, '#0e4a6a');
  oceanGradient.addColorStop(1, '#0a2a43');
  ctx.fillStyle = oceanGradient;
  ctx.fillRect(0, 0, 2048, 1024);
  
  // Add ocean depth variation
  for (let i = 0; i < 1000; i++) {
    const x = Math.random() * 2048;
    const y = Math.random() * 1024;
    const radius = Math.random() * 50 + 20;
    const alpha = Math.random() * 0.1 + 0.05;
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, `rgba(10, 42, 67, ${alpha})`);
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
  }
  
  // Draw continents with realistic shapes
  ctx.fillStyle = '#0E7A4F';
  
  // Africa
  ctx.beginPath();
  ctx.moveTo(1000, 400);
  ctx.bezierCurveTo(1050, 350, 1100, 450, 1100, 600);
  ctx.bezierCurveTo(1080, 750, 1020, 800, 980, 780);
  ctx.bezierCurveTo(950, 750, 960, 600, 980, 500);
  ctx.closePath();
  ctx.fill();
  
  // Americas (North and South)
  ctx.beginPath();
  ctx.moveTo(400, 200);
  ctx.bezierCurveTo(500, 150, 600, 180, 650, 250);
  ctx.bezierCurveTo(680, 350, 650, 450, 600, 500);
  ctx.bezierCurveTo(550, 480, 500, 400, 450, 350);
  ctx.closePath();
  ctx.fill();
  
  // South America
  ctx.beginPath();
  ctx.moveTo(550, 550);
  ctx.bezierCurveTo(600, 520, 650, 540, 680, 600);
  ctx.bezierCurveTo(700, 750, 680, 850, 650, 900);
  ctx.bezierCurveTo(600, 880, 580, 750, 570, 650);
  ctx.closePath();
  ctx.fill();
  
  // Asia
  ctx.beginPath();
  ctx.moveTo(1400, 300);
  ctx.bezierCurveTo(1600, 250, 1800, 300, 1900, 400);
  ctx.bezierCurveTo(1850, 600, 1700, 700, 1500, 650);
  ctx.bezierCurveTo(1450, 550, 1420, 450, 1400, 350);
  ctx.closePath();
  ctx.fill();
  
  // Europe
  ctx.beginPath();
  ctx.moveTo(950, 250);
  ctx.bezierCurveTo(1050, 200, 1150, 220, 1200, 300);
  ctx.bezierCurveTo(1180, 400, 1100, 450, 1000, 420);
  ctx.closePath();
  ctx.fill();
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
};

const createNightLightsTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  
  ctx.fillStyle = 'rgba(0, 0, 0, 0)';
  ctx.fillRect(0, 0, 2048, 1024);
  
  const cityRegions = [
    { x: 400, y: 200, count: 150 },
    { x: 500, y: 400, count: 100 },
    { x: 600, y: 600, count: 120 },
    { x: 1400, y: 400, count: 80 },
    { x: 1000, y: 300, count: 60 },
  ];
  
  cityRegions.forEach(region => {
    for (let i = 0; i < region.count; i++) {
      const x = region.x + (Math.random() - 0.5) * 200;
      const y = region.y + (Math.random() - 0.5) * 200;
      const size = Math.random() * 2 + 1;
      const brightness = Math.random() * 0.8 + 0.2;
      
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 3);
      gradient.addColorStop(0, `rgba(255, 242, 200, ${brightness})`);
      gradient.addColorStop(0.5, `rgba(255, 220, 150, ${brightness * 0.5})`);
      gradient.addColorStop(1, 'rgba(255, 200, 100, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(x - size * 3, y - size * 3, size * 6, size * 6);
      
      ctx.fillStyle = `rgba(255, 242, 200, ${brightness})`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  });
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
};

const createCloudTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  
  ctx.fillStyle = 'rgba(255, 255, 255, 0)';
  ctx.fillRect(0, 0, 2048, 1024);
  
  for (let i = 0; i < 200; i++) {
    const x = Math.random() * 2048;
    const y = Math.random() * 1024;
    const radius = Math.random() * 80 + 40;
    const alpha = Math.random() * 0.3 + 0.1;
    
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
    gradient.addColorStop(0.7, `rgba(255, 255, 255, ${alpha * 0.5})`);
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
};

/**
 * 🌍 REAL 3D EARTH GLOBE
 * Using Three.js with actual Earth textures
 */
const RealEarthGlobe = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const mousePos = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      50,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 3;

    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true 
    });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // Earth sphere
    const earthGeometry = new THREE.SphereGeometry(1, 64, 64);
    
    // Earth material with real texture
    const earthMaterial = new THREE.MeshPhongMaterial({
      map: null, // We'll load texture
      bumpMap: null,
      bumpScale: 0.05,
      specular: new THREE.Color(0x333333),
      shininess: 5
    });

    // Load Earth texture
    const textureLoader = new THREE.TextureLoader();
    
    // Create procedural Earth texture (works offline, no external dependencies)
    const earthTexture = createProceduralEarthTexture();
    earthMaterial.map = earthTexture;
    earthMaterial.needsUpdate = true;

    // Create night lights texture (city lights)
    const nightTexture = createNightLightsTexture();
    const nightMaterial = new THREE.MeshBasicMaterial({
      map: nightTexture,
      blending: THREE.AdditiveBlending,
      transparent: true
    });
    const nightMesh = new THREE.Mesh(earthGeometry, nightMaterial);
    scene.add(nightMesh);

    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earthMesh);

    // Cloud layer (procedural)
    const cloudGeometry = new THREE.SphereGeometry(1.01, 64, 64);
    const cloudTexture = createCloudTexture();
    const cloudMaterial = new THREE.MeshPhongMaterial({
      map: cloudTexture,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending
    });
    const cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
    scene.add(cloudMesh);

    // Atmosphere glow
    const atmosphereGeometry = new THREE.SphereGeometry(1.05, 64, 64);
    const atmosphereMaterial = new THREE.ShaderMaterial({
      uniforms: {
        c: { value: 0.15 },
        p: { value: 2.0 },
        glowColor: { value: new THREE.Color(0x58C3FF) },
        viewVector: { value: camera.position }
      },
      vertexShader: `
        uniform vec3 viewVector;
        uniform float c;
        uniform float p;
        varying float intensity;
        void main() {
          vec3 vNormal = normalize(normalMatrix * normal);
          vec3 vNormel = normalize(normalMatrix * viewVector);
          intensity = pow(c - dot(vNormal, vNormel), p);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        varying float intensity;
        void main() {
          vec3 glow = glowColor * intensity;
          gl_FragColor = vec4(glow, 1.0);
        }
      `,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    scene.add(atmosphereMesh);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);

    // Orbit rings
    const ringGeometry = new THREE.RingGeometry(1.3, 1.35, 64);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.1
    });
    const ring1 = new THREE.Mesh(ringGeometry, ringMaterial);
    ring1.rotation.x = Math.PI / 6;
    scene.add(ring1);

    const ring2 = new THREE.Mesh(ringGeometry, ringMaterial);
    ring2.rotation.x = -Math.PI / 6;
    scene.add(ring2);

    // Animation
    let rotation = 0;
    const animate = () => {
      requestAnimationFrame(animate);

      rotation += 0.002;

      // Rotate Earth
      earthMesh.rotation.y = rotation;
      
      // Rotate clouds slower
      const cloudMesh = scene.children.find(child => 
        child.material && child.material.transparent && child.material.opacity === 0.4
      );
      if (cloudMesh) {
        cloudMesh.rotation.y = rotation * 0.7;
      }

      // Parallax on mouse
      const offsetX = (mousePos.current.x - 0.5) * 0.3;
      const offsetY = (mousePos.current.y - 0.5) * 0.3;
      camera.position.x = offsetX;
      camera.position.y = offsetY;
      camera.lookAt(0, 0, 0);

      // Update atmosphere shader
      atmosphereMaterial.uniforms.viewVector.value = camera.position;

      renderer.render(scene, camera);
    };

    animate();

    // Mouse tracking
    const handleMouseMove = (e) => {
      const rect = mountRef.current.getBoundingClientRect();
      mousePos.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height
      };
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Resize handler
    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Create realistic procedural Earth texture
  const createProceduralEarthTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    
    // Ocean base (deep blue gradient)
    const oceanGradient = ctx.createLinearGradient(0, 0, 0, 1024);
    oceanGradient.addColorStop(0, '#1a5a8a');
    oceanGradient.addColorStop(0.5, '#0e4a6a');
    oceanGradient.addColorStop(1, '#0a2a43');
    ctx.fillStyle = oceanGradient;
    ctx.fillRect(0, 0, 2048, 1024);
    
    // Add ocean depth variation
    for (let i = 0; i < 1000; i++) {
      const x = Math.random() * 2048;
      const y = Math.random() * 1024;
      const radius = Math.random() * 50 + 20;
      const alpha = Math.random() * 0.1 + 0.05;
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, `rgba(10, 42, 67, ${alpha})`);
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
    }
    
    // Draw continents with realistic shapes
    ctx.fillStyle = '#0E7A4F';
    
    // Africa (more detailed)
    ctx.beginPath();
    ctx.moveTo(1000, 400);
    ctx.bezierCurveTo(1050, 350, 1100, 450, 1100, 600);
    ctx.bezierCurveTo(1080, 750, 1020, 800, 980, 780);
    ctx.bezierCurveTo(950, 750, 960, 600, 980, 500);
    ctx.closePath();
    ctx.fill();
    
    // Americas (North and South)
    ctx.beginPath();
    // North America
    ctx.moveTo(400, 200);
    ctx.bezierCurveTo(500, 150, 600, 180, 650, 250);
    ctx.bezierCurveTo(680, 350, 650, 450, 600, 500);
    ctx.bezierCurveTo(550, 480, 500, 400, 450, 350);
    ctx.closePath();
    ctx.fill();
    
    // South America
    ctx.beginPath();
    ctx.moveTo(550, 550);
    ctx.bezierCurveTo(600, 520, 650, 540, 680, 600);
    ctx.bezierCurveTo(700, 750, 680, 850, 650, 900);
    ctx.bezierCurveTo(600, 880, 580, 750, 570, 650);
    ctx.closePath();
    ctx.fill();
    
    // Asia
    ctx.beginPath();
    ctx.moveTo(1400, 300);
    ctx.bezierCurveTo(1600, 250, 1800, 300, 1900, 400);
    ctx.bezierCurveTo(1850, 600, 1700, 700, 1500, 650);
    ctx.bezierCurveTo(1450, 550, 1420, 450, 1400, 350);
    ctx.closePath();
    ctx.fill();
    
    // Europe
    ctx.beginPath();
    ctx.moveTo(950, 250);
    ctx.bezierCurveTo(1050, 200, 1150, 220, 1200, 300);
    ctx.bezierCurveTo(1180, 400, 1100, 450, 1000, 420);
    ctx.closePath();
    ctx.fill();
    
    // Add terrain variation
    ctx.fillStyle = '#1B8A5F';
    for (let i = 0; i < 500; i++) {
      const x = Math.random() * 2048;
      const y = Math.random() * 1024;
      if (ctx.isPointInPath(x, y) || Math.random() > 0.7) {
        ctx.fillRect(x, y, 2, 2);
      }
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
  };

  // Create night lights texture (city lights)
  const createNightLightsTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    
    // Start with transparent
    ctx.fillStyle = 'rgba(0, 0, 0, 0)';
    ctx.fillRect(0, 0, 2048, 1024);
    
    // City lights on Americas (left side - night)
    const cityRegions = [
      { x: 400, y: 200, count: 150 }, // North America
      { x: 500, y: 400, count: 100 }, // Central America
      { x: 600, y: 600, count: 120 }, // South America
      { x: 1400, y: 400, count: 80 }, // Asia (some)
      { x: 1000, y: 300, count: 60 }, // Europe
    ];
    
    cityRegions.forEach(region => {
      for (let i = 0; i < region.count; i++) {
        const x = region.x + (Math.random() - 0.5) * 200;
        const y = region.y + (Math.random() - 0.5) * 200;
        const size = Math.random() * 2 + 1;
        const brightness = Math.random() * 0.8 + 0.2;
        
        // Glow
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 3);
        gradient.addColorStop(0, `rgba(255, 242, 200, ${brightness})`);
        gradient.addColorStop(0.5, `rgba(255, 220, 150, ${brightness * 0.5})`);
        gradient.addColorStop(1, 'rgba(255, 200, 100, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(x - size * 3, y - size * 3, size * 6, size * 6);
        
        // Core light
        ctx.fillStyle = `rgba(255, 242, 200, ${brightness})`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
    });
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
  };

  // Create cloud texture
  const createCloudTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    
    // Start with transparent
    ctx.fillStyle = 'rgba(255, 255, 255, 0)';
    ctx.fillRect(0, 0, 2048, 1024);
    
    // Draw clouds (white, semi-transparent)
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * 2048;
      const y = Math.random() * 1024;
      const radius = Math.random() * 80 + 40;
      const alpha = Math.random() * 0.3 + 0.1;
      
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
      gradient.addColorStop(0.7, `rgba(255, 255, 255, ${alpha * 0.5})`);
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
  };

  return (
    <motion.div
      ref={mountRef}
      className="relative w-full h-full flex items-center justify-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.5 }}
    />
  );
};

export default RealEarthGlobe;

