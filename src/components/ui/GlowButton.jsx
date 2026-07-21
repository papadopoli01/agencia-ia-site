import { motion } from 'framer-motion';

export default function GlowButton({ children, className = '', ...props }) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={`group relative overflow-hidden rounded-full bg-gradient-to-r from-neon-purple to-neon-blue px-8 py-3.5 font-semibold text-white shadow-[0_0_0_rgba(138,5,190,0)] transition-shadow duration-300 hover:shadow-[0_0_40px_rgba(138,5,190,0.55)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:shadow-none ${className}`}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      {/* crossfade de cor no hover, reforçando o brilho */}
      <span className="absolute inset-0 bg-gradient-to-r from-neon-blue to-neon-purple opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </motion.button>
  );
}
