import { forwardRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { MeshDistortMaterial } from '@react-three/drei';

/**
 * O "núcleo" que representa a IA projetando o site.
 * A rotação NÃO é controlada por useFrame/autoplay — ela é
 * definida de fora (via ref.current.rotation) pelo ScrollTrigger,
 * exatamente como pedido: gira conforme o usuário rola a página.
 */
const AICore = forwardRef(function AICore(_, ref) {
  return (
    <group ref={ref}>
      {/* Núcleo sólido com distorção orgânica */}
      <mesh>
        <icosahedronGeometry args={[1.6, 2]} />
        <MeshDistortMaterial
          color="#8A05BE"
          emissive="#4C0F82"
          emissiveIntensity={0.6}
          distort={0.35}
          speed={1.6}
          roughness={0.15}
          metalness={0.85}
        />
      </mesh>

      {/* Casca wireframe neon, ligeiramente maior — dá o contorno "circuito" */}
      <mesh scale={1.04}>
        <icosahedronGeometry args={[1.6, 1]} />
        <meshBasicMaterial color="#00D2FF" wireframe transparent opacity={0.35} />
      </mesh>
    </group>
  );
});

export default function Scene3D({ objectRef }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.5], fov: 45 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.6} />
      <pointLight position={[5, 5, 5]} intensity={3} color="#8A05BE" />
      <pointLight position={[-5, -3, -5]} intensity={2.5} color="#00D2FF" />
      <AICore ref={objectRef} />
    </Canvas>
  );
}
