
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Simple orbit controls component
const OrbitControls = () => {
  const { camera, gl } = useThree();
  const controlsRef = useRef<any>();
  
  useFrame(() => {
    if (controlsRef.current) {
      controlsRef.current.update();
    }
  });

  React.useEffect(() => {
    // @ts-ignore - OrbitControls might not be available in this setup
    if (THREE.OrbitControls) {
      // @ts-ignore
      const controls = new THREE.OrbitControls(camera, gl.domElement);
      controls.enableZoom = false;
      controls.enablePan = false;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.5;
      controlsRef.current = controls;

      return () => {
        controls.dispose();
      };
    }
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

  return (
    <group position={position} rotation={rotation}>
      {/* Main ambulance body - more rounded */}
      <mesh ref={meshRef}>
        <boxGeometry args={[2.2, 1.2, 4.5]} />
        <meshStandardMaterial color="#ffffff" metalness={0.1} roughness={0.3} />
      </mesh>
      
      {/* Ambulance cabin */}
      <mesh position={[0, 0.3, 1.8]}>
        <boxGeometry args={[2, 1, 1.5]} />
        <meshStandardMaterial color="#f8f9fa" metalness={0.2} roughness={0.4} />
      </mesh>
      
      {/* Medical cross - larger and more prominent */}
      <group position={[0, 0.7, 0]}>
        <mesh>
          <boxGeometry args={[0.4, 0.15, 1.2]} />
          <meshStandardMaterial color="#dc2626" emissive="#dc2626" emissiveIntensity={0.3} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <boxGeometry args={[0.4, 0.15, 1.2]} />
          <meshStandardMaterial color="#dc2626" emissive="#dc2626" emissiveIntensity={0.3} />
        </mesh>
      </group>
      
      {/* Emergency lights with better positioning */}
      <mesh ref={lightRef1} position={[-0.9, 1, 1.8]}>
        <sphereGeometry args={[0.15]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1.2} />
      </mesh>
      <mesh ref={lightRef2} position={[0.9, 1, 1.8]}>
        <sphereGeometry args={[0.15]} />
        <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={1.2} />
      </mesh>
      
      {/* Wheels with better detail */}
      {[
        [-0.9, -0.4, 1.8],
        [0.9, -0.4, 1.8],
        [-0.9, -0.4, -1.8],
        [0.9, -0.4, -1.8]
      ].map((pos, i) => (
        <group key={i} position={pos as [number, number, number]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.35, 0.35, 0.25]} />
            <meshStandardMaterial color="#1f2937" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.13]}>
            <cylinderGeometry args={[0.25, 0.25, 0.05]} />
            <meshStandardMaterial color="#6b7280" metalness={0.9} roughness={0.1} />
          </mesh>
        </group>
      ))}
      
      {/* Medical equipment on back */}
      <mesh position={[0, 0, -2.4]}>
        <boxGeometry args={[1.8, 0.8, 0.3]} />
        <meshStandardMaterial color="#f3f4f6" metalness={0.3} roughness={0.6} />
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

  return (
    <group position={position}>
      {/* Main hospital building */}
      <mesh ref={meshRef} position={[0, 1, 0]}>
        <boxGeometry args={[2, 3, 2]} />
        <meshStandardMaterial 
          color="#f8fafc" 
          metalness={0.1} 
          roughness={0.4}
          emissive="#f1f5f9"
          emissiveIntensity={0.1}
        />
      </mesh>
      
      {/* Hospital roof */}
      <mesh position={[0, 2.7, 0]}>
        <boxGeometry args={[2.2, 0.4, 2.2]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.2} roughness={0.3} />
      </mesh>
      
      {/* Medical cross on building */}
      <group ref={crossRef} position={[0, 2, 1.1]}>
        <mesh>
          <boxGeometry args={[0.6, 0.15, 0.1]} />
          <meshStandardMaterial 
            color="#10b981" 
            emissive="#10b981" 
            emissiveIntensity={0.5}
            metalness={0.3}
            roughness={0.2}
          />
        </mesh>
        <mesh>
          <boxGeometry args={[0.15, 0.6, 0.1]} />
          <meshStandardMaterial 
            color="#10b981" 
            emissive="#10b981" 
            emissiveIntensity={0.5}
            metalness={0.3}
            roughness={0.2}
          />
        </mesh>
      </group>
      
      {/* Windows */}
      {[
        [-0.6, 1.5, 1.01], [0.6, 1.5, 1.01],
        [-0.6, 0.5, 1.01], [0.6, 0.5, 1.01]
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <boxGeometry args={[0.4, 0.4, 0.02]} />
          <meshStandardMaterial 
            color="#0ea5e9" 
            transparent={true} 
            opacity={0.7}
            emissive="#0ea5e9"
            emissiveIntensity={0.2}
          />
        </mesh>
      ))}
      
      {/* Emergency entrance */}
      <mesh position={[0, 0.5, 1.01]}>
        <boxGeometry args={[0.8, 1, 0.02]} />
        <meshStandardMaterial color="#dc2626" emissive="#dc2626" emissiveIntensity={0.3} />
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

  return (
    <group ref={meshRef} position={position}>
      {/* Helicopter body */}
      <mesh>
        <sphereGeometry args={[0.8, 16, 8]} />
        <meshStandardMaterial color="#ffffff" metalness={0.4} roughness={0.3} />
      </mesh>
      
      {/* Cockpit */}
      <mesh position={[0, 0.2, 0.6]}>
        <sphereGeometry args={[0.5, 8, 6]} />
        <meshStandardMaterial 
          color="#0ea5e9" 
          transparent={true} 
          opacity={0.8}
          metalness={0.6}
          roughness={0.1}
        />
      </mesh>
      
      {/* Main rotor */}
      <group position={[0, 1.2, 0]}>
        <mesh ref={rotorRef}>
          <boxGeometry args={[3, 0.05, 0.1]} />
          <meshStandardMaterial color="#374151" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh ref={rotorRef} rotation={[0, Math.PI/2, 0]}>
          <boxGeometry args={[3, 0.05, 0.1]} />
          <meshStandardMaterial color="#374151" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>
      
      {/* Medical cross */}
      <group position={[0, 0, -0.81]}>
        <mesh>
          <boxGeometry args={[0.4, 0.1, 0.02]} />
          <meshStandardMaterial color="#dc2626" emissive="#dc2626" emissiveIntensity={0.4} />
        </mesh>
        <mesh>
          <boxGeometry args={[0.1, 0.4, 0.02]} />
          <meshStandardMaterial color="#dc2626" emissive="#dc2626" emissiveIntensity={0.4} />
        </mesh>
      </group>
      
      {/* Landing skids */}
      <mesh position={[-0.6, -0.6, 0]}>
        <boxGeometry args={[0.1, 0.1, 1.2]} />
        <meshStandardMaterial color="#374151" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0.6, -0.6, 0]}>
        <boxGeometry args={[0.1, 0.1, 1.2]} />
        <meshStandardMaterial color="#374151" metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
};

// Enhanced Route Path with medical theme
const MedicalRoutePath = ({ start, end }: { start: [number, number, number], end: [number, number, number] }) => {
  const lineRef = useRef<THREE.Line>(null);
  
  const { points, lineGeometry } = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(...start),
      new THREE.Vector3((start[0] + end[0]) / 2, start[1] + 3, (start[2] + end[2]) / 2),
      new THREE.Vector3(...end)
    ]);
    const pts = curve.getPoints(100);
    const geometry = new THREE.BufferGeometry().setFromPoints(pts);
    return { points: pts, lineGeometry: geometry };
  }, [start, end]);

  useFrame((state) => {
    if (lineRef.current) {
      const material = lineRef.current.material as THREE.LineBasicMaterial;
      material.opacity = 0.6 + Math.sin(state.clock.elapsedTime * 3) * 0.3;
    }
  });

  return (
    <line ref={lineRef}>
      <primitive object={lineGeometry} attach="geometry" />
      <lineBasicMaterial 
        attach="material" 
        color="#10b981" 
        transparent={true}
        opacity={0.8}
        linewidth={3}
      />
    </line>
  );
};

// Medical particles (like medical data flowing)
const MedicalParticles = () => {
  const particlesRef = useRef<THREE.Points>(null);
  
  const { particleGeometry } = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(200 * 3);
    const colors = new Float32Array(200 * 3);
    
    for (let i = 0; i < 200; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = Math.random() * 15;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
      
      // Medical-themed colors (green, blue, white)
      const colorChoice = Math.random();
      if (colorChoice < 0.33) {
        colors[i * 3] = 0.06; colors[i * 3 + 1] = 0.73; colors[i * 3 + 2] = 0.51; // Green
      } else if (colorChoice < 0.66) {
        colors[i * 3] = 0.06; colors[i * 3 + 1] = 0.65; colors[i * 3 + 2] = 0.91; // Blue
      } else {
        colors[i * 3] = 1; colors[i * 3 + 1] = 1; colors[i * 3 + 2] = 1; // White
      }
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    return { particleGeometry: geometry };
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      particlesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  return (
    <points ref={particlesRef}>
      <primitive object={particleGeometry} attach="geometry" />
      <pointsMaterial 
        attach="material" 
        size={0.15} 
        transparent={true} 
        opacity={0.8}
        vertexColors={true}
        sizeAttenuation={true}
      />
    </points>
  );
};

// Main enhanced medical 3D scene
const Scene3D = () => {
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
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[0, 15, 0]} intensity={0.6} color="#10b981" />
        <spotLight 
          position={[-15, 10, 5]} 
          angle={0.4} 
          intensity={0.8} 
          color="#0ea5e9"
          penumbra={0.5}
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
        
        {/* Medical route paths */}
        <MedicalRoutePath start={[-6, 2, 0]} end={[6, 2, 2]} />
        <MedicalRoutePath start={[-6, 2, 0]} end={[4, 2, -6]} />
        <MedicalRoutePath start={[0, 8, -5]} end={[6, 5, 2]} />
        
        {/* Medical data particles */}
        <MedicalParticles />
        
        {/* Professional ground plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
          <planeGeometry args={[50, 50]} />
          <meshStandardMaterial 
            color="#f1f5f9" 
            transparent={true} 
            opacity={0.2}
            metalness={0.1}
            roughness={0.9}
          />
        </mesh>
        
        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default Scene3D;
