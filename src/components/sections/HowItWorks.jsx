import { useRef, useLayoutEffect } from 'react';
import { gsap, ScrollTrigger } from '../../lib/gsap';

const STEPS = [
  {
    number: '01',
    title: 'Você pede',
    description:
      'Conte pra gente o que você precisa: nicho, estilo, objetivo. Sem briefing complicado, só uma conversa.',
  },
  {
    number: '02',
    title: 'A IA projeta',
    description:
      'Nossa inteligência artificial gera um layout único — design, textos e estrutura pensados para o seu negócio.',
  },
  {
    number: '03',
    title: 'Nós entregamos',
    description: 'Nosso time refina cada detalhe e entrega um site pronto pra publicar, rápido e sem dor de cabeça.',
  },
];

export default function HowItWorks() {
  const wrapperRef = useRef(null);
  const stickyRef = useRef(null);
  const panelRefs = useRef([]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const panels = panelRefs.current;

      gsap.set(panels, { opacity: 0, y: 60 });
      gsap.set(panels[0], { opacity: 1, y: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
          pin: stickyRef.current,
        },
      });

      panels.forEach((panel, i) => {
        if (i === 0) return;
        // cada transição acontece "entre" um passo e o próximo
        tl.to(panels[i - 1], { opacity: 0, y: -60, duration: 0.5 }, i - 0.5).to(
          panel,
          { opacity: 1, y: 0, duration: 0.5 },
          i - 0.5
        );
      });
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="como-funciona" ref={wrapperRef} className="relative" style={{ height: `${STEPS.length * 100}vh` }}>
      <div ref={stickyRef} className="sticky top-0 flex h-screen items-center justify-center overflow-hidden px-6">
        <span className="absolute top-16 left-1/2 -translate-x-1/2 font-mono text-xs uppercase tracking-[0.3em] text-white/40">
          Como funciona
        </span>

        <div className="relative flex h-[50vh] w-full max-w-4xl items-center justify-center">
          {STEPS.map((step, i) => (
            <div
              key={step.number}
              ref={(el) => (panelRefs.current[i] = el)}
              className="absolute inset-0 flex flex-col items-center justify-center text-center"
            >
              <span className="mb-4 font-mono text-lg text-gradient">{step.number}</span>
              <h3 className="mb-6 font-display text-4xl font-bold tracking-tight md:text-7xl">{step.title}</h3>
              <p className="max-w-xl text-lg text-white/50 md:text-xl">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
