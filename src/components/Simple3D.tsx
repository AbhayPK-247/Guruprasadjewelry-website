import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

function Model({ scrollY }: { scrollY: number }) {
  const groupRef = useRef<THREE.Group>(null!)
  const { scene } = useGLTF('/ring.glb')
  
  useFrame(() => {
    // Rotate based on scroll position
    if (groupRef.current) {
      groupRef.current.rotation.y = scrollY * 0.005
    }
  })

  return (
    <group ref={groupRef}>
      <primitive 
        object={scene} 
        scale={3}
        position={[0.2, 1.5, -0.2]}//[0.2, 1.5, -0.2]} //[0.1, 1.1, -2]
        rotation={[Math.PI / 4, -Math.PI/4, -Math.PI / 16]} 
        //rotation={[//Math.PI / 4, -Math.PI/4, -Math.PI / 16]}//[0, -Math.PI/10, 0]
      />
    </group>
  )
}

export default function Simple3D() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="w-full h-full pointer-events-none">
      <Canvas 
        camera={{ position: [-1, 3, 9], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
      >
        <color attach="background" args={['transparent']} />
        
        {/* Emerald & Gold Jewelry Lighting */}
        <ambientLight intensity={2} color="#f5e6d3" />
        
        <spotLight 
          position={[0, 5, 0]}
          intensity={1.5}
          color="#FFD700"
          angle={0.6}
          penumbra={0.8}
        />
        <pointLight 
          position={[-5, 3, 4]} 
          intensity={1} 
          color="#FFA500"
        />
        <directionalLight
  position={[0, 2, 5]}
  intensity={4}
  color="#fff"
/>
<pointLight
  position={[0, 1.2, 6]}
  intensity={2.5}
  color="#fff"
/>
        <directionalLight 
          position={[-4, 4, 3]} 
          intensity={2} 
          color="#E0F8E0"
        />
        
        <pointLight 
          position={[-2, 2, 5]} 
          intensity={5} 
          color="#ffffffff"
        />
        
        <pointLight 
          position={[6, 0, 0]}
          intensity={0.5}
          color="#1a1a1a"
        />
        <pointLight 
          position={[0, 1.5, 0]}
          intensity={12}
          color="#ffffff"
        />
        <Model scrollY={scrollY} />
      </Canvas>
    </div>
  )
}
