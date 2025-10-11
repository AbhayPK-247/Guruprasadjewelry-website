import { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

function Model({ rotationX, rotationY }: { rotationX: number; rotationY: number }) {
  const groupRef = useRef<THREE.Group>(null!);
  const { scene } = useGLTF('/log.glb');

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.x = rotationX;
      groupRef.current.rotation.y = rotationY;
    }
  });

  return (
    <group ref={groupRef}>
      <primitive 
        object={scene} 
        scale={13} 
        position={[-1, -2, -1.8]} 
        rotation={[Math.PI / 2, 0, Math.PI / 4]} 
      />
    </group>
  );
}

function Floor() {
  return (
    <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -6, 0]}>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial color="#000000" />
    </mesh>
  );
}

export default function Interactive3D() {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!hovered) return;

    let clientX, clientY;

    if (event.type === 'mousemove') {
      clientX = (event as React.MouseEvent<HTMLDivElement>).clientX;
      clientY = (event as React.MouseEvent<HTMLDivElement>).clientY;
    } else {
      clientX = (event as React.TouchEvent<HTMLDivElement>).touches[0].clientX;
      clientY = (event as React.TouchEvent<HTMLDivElement>).touches[0].clientY;
    }

    const { width, height, left, top } = (event.target as HTMLDivElement).getBoundingClientRect();
    const x = ((clientX - left) / width) * 2 - 1;
    const y = ((clientY - top) / height) * 2 - 1;

    setRotation({
      y: x * Math.PI,
      x: y * (Math.PI / 2),
    });
  };

  return (
    <div
      className="w-full h-full cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
      onTouchStart={() => setHovered(true)}
      onTouchEnd={() => setHovered(false)}
      onTouchMove={(event) => {
        handleMouseMove(event);
      }}
    >
      <Canvas
        camera={{ position: [-10, 0, 10], fov: 35 }}
        gl={{ alpha: true, antialias: true }}
        shadows
      >
        <color attach="background" args={['transparent']} />
        <ambientLight intensity={0.3} />
        <spotLight position={[5, 5, 5]} angle={0.3} penumbra={0.5} intensity={5} castShadow />
        <directionalLight position={[-5, 5, 5]} intensity={10} />
         <spotLight position={[5, 5, 3]} angle={0.3} penumbra={0.5} intensity={5} castShadow />
          <spotLight position={[4, 5, 5]} angle={0.3} penumbra={0.5} intensity={5} castShadow />
           <spotLight position={[5, 2, 5]} angle={0.3} penumbra={0.5} intensity={5} castShadow />
        <pointLight position={[0, 5, -5]} intensity={5} />
        <pointLight position={[0, 5, 5]} intensity={5} />
        <pointLight position={[5, 5, 0]} intensity={5} />
        <spotLight position={[-3, 2, 4]} intensity={5} angle={0.6} penumbra={0.3} />
        <pointLight position={[-1.2, -1, 0]} intensity={15} />

        <Suspense fallback={null}>
          <Floor />

          {/* Ceiling */}
          <mesh receiveShadow rotation={[Math.PI / 2, 0, 0]} position={[0, 6, 0]}>
            <planeGeometry args={[20, 20]} />
            <meshStandardMaterial color="#000000" />
          </mesh>


          {/* Back wall */}
          <mesh receiveShadow position={[0, 4, -10]}>
            <planeGeometry args={[20, 20]} />
            <meshStandardMaterial color="#000000" />
          </mesh>

          {/* Left wall */}
          <mesh receiveShadow rotation={[0, Math.PI / 2, 0]} position={[-10, 4, 0]}>
            <planeGeometry args={[20, 20]} />
            <meshStandardMaterial color="#000000" />
          </mesh>

          {/* Right wall */}
          <mesh receiveShadow rotation={[0, -Math.PI / 2, 0]} position={[10, 4, 0]}>
            <planeGeometry args={[20, 20]} />
            <meshStandardMaterial color="#000000" />
          </mesh>

          <Model rotationX={rotation.x} rotationY={rotation.y} />
        </Suspense>
      </Canvas>
    </div>
  );
}
