import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Registra o plugin uma única vez para todo o app
gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };
