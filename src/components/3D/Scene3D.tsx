
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Simple orbit controls component
const OrbitControls = () => {
  const { camera, gl } = useThree();
  
  React.useEffect(() => {
    // Simple manual orbit controls
    let mouseDown = false;
    let mouseX = 0;
    let mouseY = 0;
    
    const handleMouseDown = (event: MouseEvent) => {
      mouseDown = true;
      mouseX = event.clientX;
      mouseY = event.clientY;
    };
    
    const handleMouseUp = () => {
      mouseDown = false;
    };
    
    const handleMouseMove = (event: MouseEvent) => {
      if (!mouseDown) return;
      
      const deltaX = event.clientX - mouseX;
      const deltaY = event.clientY - mouseY;
      
      camera.position.x = camera.position.x * Math.cos(deltaX * 0.01) - camera.position.z * Math.sin(deltaX * 0.01);
      camera.position.z = camera.position.x * Math.sin(deltaX * 0.01) + camera.position.z * Math.cos(deltaX * 0.01);
      camera.position.y += deltaY * 0.05;
      
      camera.lookAt(0, 0, 0);
      
      mouseX = event.clientX;
      mouseY = event.clientY;
    };
    
    gl.domElement.addEventListener('mousedown', handleMouseDown);
    gl.domElement.addEventListener('mouseup', handleMouseUp);
    gl.domElement.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      gl.domElement.removeEventListener('mousedown', handleMouseDown);
      gl.domElement.removeEventListener('mouseup', handleMouseUp);
      gl.domElement.removeEventListener('mousemove', handleMouseMove);
    };
  }, [camera, gl]);

  return null;
};

// Enhanced Medical Ambulance with more detail
const MedicalAmbulance = ({ position, rotation }: { position: [number, number, number], rotation: [number, number, number] }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const lightRef1 = useRef<THREE.Mesh>(null);
  const lightRef2 = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.5) * 0.05;
    }
    
    // Emergency lights
    if (lightRef1.current && lightRef2.current) {
      const blink = Math.sin(state.clock.elapsedTime * 6) > 0;
      lightRef1.current.visible = blink;
      lightRef2.current.visible = !blink;
    }
  });

  const whiteMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: "#ffffff", 
    metalness: 0.1, 
    roughness: 0.3 
  }), []);

  const cabinMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: "#f8f9fa", 
    metalness: 0.2, 
    roughness: 0.4 
  }), []);

  const crossMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: "#dc2626", 
    emissive: "#dc2626", 
    emissiveIntensity: 0.3 
  }), []);

  const redLightMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: "#ef4444", 
    emissive: "#ef4444", 
    emissiveIntensity: 1.2 
  }), []);

  const blueLightMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: "#3b82f6", 
    emissive: "#3b82f6", 
    emissiveIntensity: 1.2 
  }), []);

  const wheelMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: "#1f2937", 
    metalness: 0.8, 
    roughness: 0.2 
  }), []);

  const rimMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: "#6b7280", 
    metalness: 0.9, 
    roughness: 0.1 
  }), []);

  const equipmentMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: "#f3f4f6", 
    metalness: 0.3, 
    roughness: 0.6 
  }), []);

  return (
    <group position={position} rotation={rotation}>
      {/* Main ambulance body */}
      <mesh ref={meshRef}>
        <boxGeometry args={[2.2, 1.2, 4.5]} />
        <primitive object={whiteMaterial} attach="material" />
      </mesh>
      
      {/* Ambulance cabin */}
      <mesh position={[0, 0.3, 1.8]}>
        <boxGeometry args={[2, 1, 1.5]} />
        <primitive object={cabinMaterial} attach="material" />
      </mesh>
      
      {/* Medical cross */}
      <group position={[0, 0.7, 0]}>
        <mesh>
          <boxGeometry args={[0.4, 0.15, 1.2]} />
          <primitive object={crossMaterial} attach="material" />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <boxGeometry args={[0.4, 0.15, 1.2]} />
          <primitive object={crossMaterial} attach="material" />
        </mesh>
      </group>
      
      {/* Emergency lights */}
      <mesh ref={lightRef1} position={[-0.9, 1, 1.8]}>
        <sphereGeometry args={[0.15]} />
        <primitive object={redLightMaterial} attach="material" />
      </mesh>
      <mesh ref={lightRef2} position={[0.9, 1, 1.8]}>
        <sphereGeometry args={[0.15]} />
        <primitive object={blueLightMaterial} attach="material" />
      </mesh>
      
      {/* Wheels */}
      {[
        [-0.9, -0.4, 1.8],
        [0.9, -0.4, 1.8],
        [-0.9, -0.4, -1.8],
        [0.9, -0.4, -1.8]
      ].map((pos, i) => (
        <group key={i} position={pos as [number, number, number]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.35, 0.35, 0.25]} />
            <primitive object={wheelMaterial} attach="material" />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.13]}>
            <cylinderGeometry args={[0.25, 0.25, 0.05]} />
            <primitive object={rimMaterial} attach="material" />
          </mesh>
        </group>
      ))}
      
      {/* Medical equipment on back */}
      <mesh position={[0, 0, -2.4]}>
        <boxGeometry args={[1.8, 0.8, 0.3]} />
        <primitive object={equipmentMaterial} attach="material" />
      </mesh>
    </group>
  );
};

// Modern Hospital Building
const HospitalBuilding = ({ position }: { position: [number, number, number] }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const crossRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * 0.03);
    }
    if (crossRef.current) {
      crossRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  const buildingMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: "#f8fafc", 
    metalness: 0.1, 
    roughness: 0.4, 
    emissive: "#f1f5f9", 
    emissiveIntensity: 0.1 
  }), []);

  const roofMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: "#e2e8f0", 
    metalness: 0.2, 
    roughness: 0.3 
  }), []);

  const greenCrossMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: "#10b981", 
    emissive: "#10b981", 
    emissiveIntensity: 0.5, 
    metalness: 0.3, 
    roughness: 0.2 
  }), []);

  const windowMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: "#0ea5e9", 
    transparent: true, 
    opacity: 0.7, 
    emissive: "#0ea5e9", 
    emissiveIntensity: 0.2 
  }), []);

  const entranceMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: "#dc2626", 
    emissive: "#dc2626", 
    emissiveIntensity: 0.3 
  }), []);

  return (
    <group position={position}>
      {/* Main hospital building */}
      <mesh ref={meshRef} position={[0, 1, 0]}>
        <boxGeometry args={[2, 3, 2]} />
        <primitive object={buildingMaterial} attach="material" />
      </mesh>
      
      {/* Hospital roof */}
      <mesh position={[0, 2.7, 0]}>
        <boxGeometry args={[2.2, 0.4, 2.2]} />
        <primitive object={roofMaterial} attach="material" />
      </mesh>
      
      {/* Medical cross on building */}
      <group ref={crossRef} position={[0, 2, 1.1]}>
        <mesh>
          <boxGeometry args={[0.6, 0.15, 0.1]} />
          <primitive object={greenCrossMaterial} attach="material" />
        </mesh>
        <mesh>
          <boxGeometry args={[0.15, 0.6, 0.1]} />
          <primitive object={greenCrossMaterial} attach="material" />
        </mesh>
      </group>
      
      {/* Windows */}
      {[
        [-0.6, 1.5, 1.01], [0.6, 1.5, 1.01],
        [-0.6, 0.5, 1.01], [0.6, 0.5, 1.01]
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <boxGeometry args={[0.4, 0.4, 0.02]} />
          <primitive object={windowMaterial} attach="material" />
        </mesh>
      ))}
      
      {/* Emergency entrance */}
      <mesh position={[0, 0.5, 1.01]}>
        <boxGeometry args={[0.8, 1, 0.02]} />
        <primitive object={entranceMaterial} attach="material" />
      </mesh>
    </group>
  );
};

// Medical Helicopter (Medevac)
const MedicalHelicopter = ({ position }: { position: [number, number, number] }) => {
  const meshRef = useRef<THREE.Group>(null);
  const rotorRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.15;
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
    if (rotorRef.current) {
      rotorRef.current.rotation.y = state.clock.elapsedTime * 20;
    }
  });

  const bodyMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: "#ffffff", 
    metalness: 0.4, 
    roughness: 0.3 
  }), []);

  const cockpitMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: "#0ea5e9", 
    transparent: true, 
    opacity: 0.8, 
    metalness: 0.6, 
    roughness: 0.1 
  }), []);

  const rotorMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: "#374151", 
    metalness: 0.8, 
    roughness: 0.2 
  }), []);

  const heliCrossMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: "#dc2626", 
    emissive: "#dc2626", 
    emissiveIntensity: 0.4 
  }), []);

  const skidMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: "#374151", 
    metalness: 0.7, 
    roughness: 0.3 
  }), []);

  return (
    <group ref={meshRef} position={position}>
      {/* Helicopter body */}
      <mesh>
        <sphereGeometry args={[0.8, 16, 8]} />
        <primitive object={bodyMaterial} attach="material" />
      </mesh>
      
      {/* Cockpit */}
      <mesh position={[0, 0.2, 0.6]}>
        <sphereGeometry args={[0.5, 8, 6]} />
        <primitive object={cockpitMaterial} attach="material" />
      </mesh>
      
      {/* Main rotor */}
      <group position={[0, 1.2, 0]}>
        <mesh ref={rotorRef}>
          <boxGeometry args={[3, 0.05, 0.1]} />
          <primitive object={rotorMaterial} attach="material" />
        </mesh>
        <mesh ref={rotorRef} rotation={[0, Math.PI/2, 0]}>
          <boxGeometry args={[3, 0.05, 0.1]} />
          <primitive object={rotorMaterial} attach="material" />
        </mesh>
      </group>
      
      {/* Medical cross */}
      <group position={[0, 0, -0.81]}>
        <mesh>
          <boxGeometry args={[0.4, 0.1, 0.02]} />
          <primitive object={heliCrossMaterial} attach="material" />
        </mesh>
        <mesh>
          <boxGeometry args={[0.1, 0.4, 0.02]} />
          <primitive object={heliCrossMaterial} attach="material" />
        </mesh>
      </group>
      
      {/* Landing skids */}
      <mesh position={[-0.6, -0.6, 0]}>
        <boxGeometry args={[0.1, 0.1, 1.2]} />
        <primitive object={skidMaterial} attach="material" />
      </mesh>
      <mesh position={[0.6, -0.6, 0]}>
        <boxGeometry args={[0.1, 0.1, 1.2]} />
        <primitive object={skidMaterial} attach="material" />
      </mesh>
    </group>
  );
};

// Main enhanced medical 3D scene
const Scene3D = () => {
  const groundMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: "#f1f5f9", 
    transparent: true, 
    opacity: 0.2, 
    metalness: 0.1, 
    roughness: 0.9 
  }), []);

  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 10, 15], fov: 50 }}
        style={{ background: 'transparent' }}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Professional medical lighting */}
        <ambientLight intensity={0.4} color="#f8fafc" />
        <directionalLight 
          position={[10, 15, 10]} 
          intensity={1.2} 
          color="#ffffff"
          castShadow 
        />
        <pointLight position={[0, 15, 0]} intensity={0.6} color="#10b981" />
        <spotLight 
          position={[-15, 10, 5]} 
          angle={0.4} 
          intensity={0.8} 
          color="#0ea5e9"
        />
        
        {/* Subtle medical atmosphere fog */}
        <fog attach="fog" args={['#f8fafc', 15, 60]} />
        
        {/* Medical vehicles and buildings */}
        <MedicalAmbulance position={[-6, 0, 0]} rotation={[0, Math.PI / 6, 0]} />
        <MedicalHelicopter position={[0, 8, -5]} />
        
        {/* Hospital buildings at different locations */}
        <HospitalBuilding position={[6, 0, 2]} />
        <HospitalBuilding position={[4, 0, -6]} />
        <HospitalBuilding position={[-2, 0, 8]} />
        
        {/* Professional ground plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]}>
          <planeGeometry args={[50, 50]} />
          <primitive object={groundMaterial} attach="material" />
        </mesh>
        
        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default Scene3D;
