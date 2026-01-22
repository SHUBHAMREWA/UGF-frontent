import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * 🌍 REAL EARTH COMPONENT
 * Uses Three.js with actual Earth map textures
 * Slow rotation (0.1 deg per second)
 */
const NatureEarth = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const earthMeshRef = useRef(null);
  const rotationRef = useRef(0);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const width = mountRef.current.clientWidth || 500;
    const height = mountRef.current.clientHeight || 500;

    const camera = new THREE.PerspectiveCamera(
      50,
      width / height,
      0.1,
      1000
    );
    camera.position.z = 2.5;
    
    // Center the camera view
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true 
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // Earth geometry
    const earthGeometry = new THREE.SphereGeometry(1, 64, 64);

    // Real Earth texture - using a public Earth texture
    const textureLoader = new THREE.TextureLoader();
    
    // Use NASA's Blue Marble or similar Earth texture
    // Fallback to a public CDN Earth texture
    const earthTexture = textureLoader.load(
      'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg',
      (texture) => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
      },
      undefined,
      (err) => {
        console.error('Error loading Earth texture, using fallback:', err);
        // Create a fallback procedural texture if image fails
        createFallbackTexture(textureLoader);
      }
    );

    // Earth material
    const earthMaterial = new THREE.MeshPhongMaterial({
      map: earthTexture,
      shininess: 10,
      specular: new THREE.Color(0x333333)
    });

    // Create Earth mesh - centered at origin
    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    earthMesh.position.set(0, 0, 0); // Center at origin
    earthMeshRef.current = earthMesh;
    scene.add(earthMesh);

    // Add clouds layer
    const cloudTexture = textureLoader.load(
      'https://unpkg.com/three-globe/example/img/earth-clouds.jpg',
      undefined,
      undefined,
      () => {
        // Cloud texture optional - if fails, just continue without clouds
      }
    );

    cloudTexture.wrapS = THREE.RepeatWrapping;
    cloudTexture.wrapT = THREE.ClampToEdgeWrapping;

    const cloudGeometry = new THREE.SphereGeometry(1.005, 64, 64);
    const cloudMaterial = new THREE.MeshPhongMaterial({
      map: cloudTexture,
      transparent: true,
      opacity: 0.4,
      depthWrite: false
    });
    const cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
    scene.add(cloudMesh);

    // Atmospheric glow
    const atmosphereGeometry = new THREE.SphereGeometry(1.02, 64, 64);
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color(0x79C5C2), // Soft teal matching hero
      transparent: true,
      opacity: 0.15,
      side: THREE.BackSide
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    scene.add(atmosphereMesh);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);

    // Animation loop - Keep Earth rotating continuously
    let animationFrameId = null;
    const clock = new THREE.Clock();
    
    const animate = () => {
      // Continue animation loop
      animationFrameId = requestAnimationFrame(animate);
      
      // Get elapsed time for smooth rotation
      const elapsedTime = clock.getElapsedTime();
      
      // Faster rotation: ~5 degrees per second = 0.08727 radians per second
      // This makes one full rotation in ~72 seconds (more noticeable)
      // Use elapsedTime for smooth, consistent rotation
      const rotation = elapsedTime * 0.08727;
      
      // Apply rotation to Earth (continuous rotation around Y axis)
      // Always rotate - this keeps Earth spinning continuously
      if (earthMeshRef.current) {
        earthMeshRef.current.rotation.y = rotation;
      }
      
      // Apply rotation to clouds (slightly faster for realism)
      if (cloudMesh && cloudMesh.rotation) {
        cloudMesh.rotation.y = rotation * 1.05;
      }

      // Render the scene
      renderer.render(scene, camera);
    };

    // Start the continuous rotation animation immediately
    animationFrameId = requestAnimationFrame(animate);

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current) return;
      const newWidth = mountRef.current.clientWidth || 500;
      const newHeight = mountRef.current.clientHeight || 500;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);
    
    // Wait a bit for container to size properly, then initialize renderer size again
    setTimeout(() => {
      if (mountRef.current) {
        const finalWidth = mountRef.current.clientWidth || 500;
        const finalHeight = mountRef.current.clientHeight || 500;
        camera.aspect = finalWidth / finalHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(finalWidth, finalHeight);
      }
    }, 100);

    // Fallback texture creation function
    function createFallbackTexture(loader) {
      const canvas = document.createElement('canvas');
      canvas.width = 2048;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d');

      // Ocean base
      const oceanGradient = ctx.createLinearGradient(0, 0, 0, 1024);
      oceanGradient.addColorStop(0, '#4A90E2');
      oceanGradient.addColorStop(0.5, '#357ABD');
      oceanGradient.addColorStop(1, '#1E5799');
      ctx.fillStyle = oceanGradient;
      ctx.fillRect(0, 0, 2048, 1024);

      // Add realistic continents with proper shapes
      // North America
      ctx.fillStyle = '#228B22';
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

      // Africa
      ctx.beginPath();
      ctx.moveTo(1000, 400);
      ctx.bezierCurveTo(1050, 350, 1100, 450, 1100, 600);
      ctx.bezierCurveTo(1080, 750, 1020, 800, 980, 780);
      ctx.bezierCurveTo(950, 750, 960, 600, 980, 500);
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

      const fallbackTexture = new THREE.CanvasTexture(canvas);
      fallbackTexture.wrapS = THREE.RepeatWrapping;
      fallbackTexture.wrapT = THREE.ClampToEdgeWrapping;
      earthMaterial.map = fallbackTexture;
      earthMaterial.needsUpdate = true;
    }

    // Cleanup
    return () => {
      // Cancel animation frame to stop rotation
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        try {
          mountRef.current.removeChild(renderer.domElement);
        } catch (e) {
          // Element might already be removed
        }
      }
      renderer.dispose();
      earthMaterial.dispose();
      if (earthTexture) earthTexture.dispose();
      if (cloudTexture) cloudTexture.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        filter: 'drop-shadow(0 20px 40px rgba(7, 94, 84, 0.15))',
      }}
    />
  );
};

export default NatureEarth;
