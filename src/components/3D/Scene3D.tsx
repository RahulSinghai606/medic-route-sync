
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Simple orbit controls component using useThree hook
const OrbitControls = () => {
  const { camera, gl } = useThree();
  const controlsRef = useRef<THREE.OrbitControls>();
  
  useFrame(() => {
    if (controlsRef.current) {
      controlsRef.current.update();
    }
  });

  React.useEffect(() => {
    const controls = new THREE.OrbitControls(camera, gl.domElement);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1;
    controlsRef.current = controls;

    return () => {
      controls.dispose();
    };
  }, [camera, gl]);

  return null;
};

// Ambulance 3D Component with enhanced animations
const Ambulance = ({ position, rotation }: { position: [number, number, number], rotation: [number, number, number] }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const lightRef1 = useRef<THREE.Mesh>(null);
  const lightRef2 = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      // Floating animation
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
    
    // Blinking emergency lights
    if (lightRef1.current && lightRef2.current) {
      const blink = Math.sin(state.clock.elapsedTime * 8) > 0;
      lightRef1.current.visible = blink;
      lightRef2.current.visible = !blink;
    }
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Main ambulance body */}
      <mesh ref={meshRef}>
        <boxGeometry args={[2, 1, 4]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      {/* Red cross - horizontal */}
      <mesh position={[0, 0.6, 0]}>
        <boxGeometry args={[0.3, 0.1, 0.8]} />
        <meshStandardMaterial color="#ff0000" />
      </mesh>
      {/* Red cross - vertical */}
      <mesh position={[0, 0.6, 0]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.3, 0.1, 0.8]} />
        <meshStandardMaterial color="#ff0000" />
      </mesh>
      {/* Emergency lights with blinking animation */}
      <mesh ref={lightRef1} position={[-0.8, 0.8, 1.5]}>
        <sphereGeometry args={[0.2]} />
        <meshStandardMaterial color="#ff4444" emissive="#ff0000" emissiveIntensity={0.8} />
      </mesh>
      <mesh ref={lightRef2} position={[0.8, 0.8, 1.5]}>
        <sphereGeometry args={[0.2]} />
        <meshStandardMaterial color="#4444ff" emissive="#0000ff" emissiveIntensity={0.8} />
      </mesh>
      {/* Wheels */}
      <mesh position={[-0.8, -0.3, 1.5]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      <mesh position={[0.8, -0.3, 1.5]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      <mesh position={[-0.8, -0.3, -1.5]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      <mesh position={[0.8, -0.3, -1.5]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
    </group>
  );
};

// Hospital marker with pulsing animation
const HospitalMarker = ({ position }: { position: [number, number, number] }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const crossRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      // Pulsing scale animation
      meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 3) * 0.2);
    }
    if (crossRef.current) {
      // Gentle rotation for the cross
      crossRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <cylinderGeometry args={[0.5, 0.5, 2]} />
        <meshStandardMaterial color="#00ff88" emissive="#00aa44" emissiveIntensity={0.4} />
      </mesh>
      {/* Hospital cross */}
      <group ref={crossRef} position={[0, 1.2, 0]}>
        <mesh>
          <boxGeometry args={[0.8, 0.2, 0.2]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.3} />
        </mesh>
        <mesh>
          <boxGeometry args={[0.2, 0.8, 0.2]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.3} />
        </mesh>
      </group>
    </group>
  );
};

// Route path line with animated flow
const RoutePath = ({ start, end }: { start: [number, number, number], end: [number, number, number] }) => {
  const lineRef = useRef<THREE.Line>(null);
  
  const points = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(...start),
      new THREE.Vector3((start[0] + end[0]) / 2, start[1] + 2, (start[2] + end[2]) / 2),
      new THREE.Vector3(...end)
    ]);
    return curve.getPoints(50);
  }, [start, end]);

  const lineGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    return geometry;
  }, [points]);

  useFrame((state) => {
    if (lineRef.current) {
      // Animated opacity for flowing effect
      const material = lineRef.current.material as THREE.LineBasicMaterial;
      material.opacity = 0.5 + Math.sin(state.clock.elapsedTime * 2) * 0.3;
    }
  });

  const line = useMemo(() => {
    const material = new THREE.LineBasicMaterial({ 
      color: "#00aaff", 
      transparent: true,
      opacity: 0.8 
    });
    return new THREE.Line(lineGeometry, material);
  }, [lineGeometry]);

  return <primitive ref={lineRef} object={line} />;
};

// Floating particles for atmosphere
const FloatingParticles = () => {
  const particlesRef = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(100 * 3);
    
    for (let i = 0; i < 100; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = Math.random() * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry attach="geometry" {...particles} />
      <pointsMaterial attach="material" color="#ffffff" size={0.1} transparent opacity={0.6} />
    </points>
  );
};

// Main 3D Scene with enhanced lighting and effects
const Scene3D = () => {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 8, 12], fov: 60 }}
        style={{ background: 'transparent' }}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Enhanced lighting setup */}
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        <pointLight position={[0, 10, 0]} intensity={0.5} color="#00aaff" />
        <spotLight position={[-10, 10, 10]} angle={0.3} intensity={0.8} color="#ff6666" />
        
        {/* Fog for atmosphere */}
        <fog attach="fog" args={['#000000', 10, 50]} />
        
        {/* Emergency scene with enhanced animations */}
        <Ambulance position={[-4, 0, 0]} rotation={[0, Math.PI / 4, 0]} />
        <HospitalMarker position={[4, 0, 0]} />
        <HospitalMarker position={[2, 0, 4]} />
        <HospitalMarker position={[6, 0, -2]} />
        
        {/* Route paths with flow animation */}
        <RoutePath start={[-4, 0, 0]} end={[4, 0, 0]} />
        <RoutePath start={[-4, 0, 0]} end={[2, 0, 4]} />
        <RoutePath start={[-4, 0, 0]} end={[6, 0, -2]} />
        
        {/* Floating particles for atmosphere */}
        <FloatingParticles />
        
        {/* Ground plane for better depth perception */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
          <planeGeometry args={[30, 30]} />
          <meshStandardMaterial color="#1a1a1a" transparent opacity={0.3} />
        </mesh>
        
        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default Scene3D;
