
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

// Ambulance 3D Component
const Ambulance = ({ position, rotation }: { position: [number, number, number], rotation: [number, number, number] }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Main ambulance body */}
      <mesh ref={meshRef}>
        <boxGeometry args={[2, 1, 4]} />
        <meshStandardMaterial args={[{ color: "#ffffff" }]} />
      </mesh>
      {/* Red cross - horizontal */}
      <mesh position={[0, 0.6, 0]}>
        <boxGeometry args={[0.3, 0.1, 0.8]} />
        <meshStandardMaterial args={[{ color: "#ff0000" }]} />
      </mesh>
      {/* Red cross - vertical */}
      <mesh position={[0, 0.6, 0]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.3, 0.1, 0.8]} />
        <meshStandardMaterial args={[{ color: "#ff0000" }]} />
      </mesh>
      {/* Emergency lights */}
      <mesh position={[-0.8, 0.8, 1.5]}>
        <sphereGeometry args={[0.2]} />
        <meshStandardMaterial args={[{ color: "#ff4444", emissive: "#ff0000", emissiveIntensity: 0.5 }]} />
      </mesh>
      <mesh position={[0.8, 0.8, 1.5]}>
        <sphereGeometry args={[0.2]} />
        <meshStandardMaterial args={[{ color: "#4444ff", emissive: "#0000ff", emissiveIntensity: 0.5 }]} />
      </mesh>
    </group>
  );
};

// Hospital marker
const HospitalMarker = ({ position }: { position: [number, number, number] }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 3) * 0.1);
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <cylinderGeometry args={[0.5, 0.5, 2]} />
      <meshStandardMaterial args={[{ color: "#00ff88", emissive: "#00aa44", emissiveIntensity: 0.3 }]} />
    </mesh>
  );
};

// Route path line
const RoutePath = ({ start, end }: { start: [number, number, number], end: [number, number, number] }) => {
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

  return (
    <primitive object={new THREE.Line(lineGeometry, new THREE.LineBasicMaterial({ color: "#00aaff" }))} />
  );
};

// Simple text component using basic mesh
const EmergencyText = ({ position }: { position: [number, number, number] }) => {
  return (
    <mesh position={position}>
      <boxGeometry args={[2, 0.5, 0.1]} />
      <meshStandardMaterial args={[{ color: "#ff0000", emissive: "#ff0000", emissiveIntensity: 0.3 }]} />
    </mesh>
  );
};

// Main 3D Scene
const Scene3D = () => {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 8, 12], fov: 60 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[0, 10, 0]} intensity={0.5} color="#00aaff" />
        
        {/* Emergency scene */}
        <Ambulance position={[-4, 0, 0]} rotation={[0, Math.PI / 4, 0]} />
        <HospitalMarker position={[4, 0, 0]} />
        <HospitalMarker position={[2, 0, 4]} />
        <HospitalMarker position={[6, 0, -2]} />
        
        {/* Route paths */}
        <RoutePath start={[-4, 0, 0]} end={[4, 0, 0]} />
        <RoutePath start={[-4, 0, 0]} end={[2, 0, 4]} />
        <RoutePath start={[-4, 0, 0]} end={[6, 0, -2]} />
        
        {/* Emergency indicator */}
        <EmergencyText position={[-4, 3, 0]} />
        
        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default Scene3D;
