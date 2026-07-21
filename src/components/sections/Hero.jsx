import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ScrollTrigger } from '../../lib/gsap';
import Scene3D from '../three/AICore';

const TITLE_WORDS = 'Websites gerados por IA'.split(' ');

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
};

const word = {
  hidden: { y: 60, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } },
};

export default function Hero() {
  const meshRef = useRef();

  useEffect(() => {
    // O núcleo 3D gira no eixo Y (e um pouco no X) proporcionalmente
    // ao progresso de scroll de TODA a página — não apenas da Hero.
    const trigger = ScrollTrigger.create({
      trigger: document.documentElement,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1,
      onUpdate: (self) => {
        if (meshRef.current) {
          meshRef.current.rotation.y = self.progress * Math.PI * 4;
          meshRef.current.rotation.x = self.progress * Math.PI * 0.3;
        }
      },
    });

    return () => trigger.kill();
  }, []);

  return (
    <section className="relative flex h-screen items-center justify-center overflow-hidden px-6">
      {/* blobs de gradiente neon ambiente */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-neon-purple/30 blur-[120px] animate-pulse-slow" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[32rem] w-[32rem] rounded-full bg-neon-blue/30 blur-[120px] animate-pulse-slow" />

      {/* núcleo 3D centralizado, atrás do texto */}
      <div className="pointer-events-none absolute inset-0 opacity-90">
        <Scene3D objectRef={meshRef} />
      </div>

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-6 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 font-mono text-xs uppercase tracking-[0.2em] text-white/60"
        >
          Agência de criação com IA
        </motion.span>

        <motion.h1
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-wrap justify-center gap-x-4 font-display text-[13vw] font-bold leading-[0.95] tracking-tight md:text-8xl"
        >
          {TITLE_WORDS.map((w, i) => (
            <motion.span key={w + i} variants={word} className={i === TITLE_WORDS.length - 1 ? 'text-gradient' : ''}>
              {w}
            </motion.span>
          ))}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="mt-8 max-w-xl text-lg text-white/50 md:text-xl"
        >
          Do briefing ao site publicado em minutos. Nossa IA projeta, nosso time refina, você só aprova.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce font-mono text-xs uppercase tracking-widest text-white/30"
      >
        scroll
      </motion.div>
    </section>
  );
}
