import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import GlowButton from '../ui/GlowButton';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? 'border-b border-white/10 bg-black/40 py-3 backdrop-blur-xl' : 'py-6'
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6">
        <Link to="/" className="font-display text-xl font-bold tracking-tight text-gradient">
          IA.Agency
        </Link>

        <div className="hidden items-center gap-8 text-sm text-white/70 md:flex">
          <button onClick={() => scrollTo('como-funciona')} className="transition-colors hover:text-white">
            Como funciona
          </button>
          <button onClick={() => scrollTo('contato')} className="transition-colors hover:text-white">
            Contato
          </button>
          {user && (
            <Link to={role === 'admin' ? '/admin/dashboard' : '/dashboard'} className="transition-colors hover:text-white">
              Meus pedidos
            </Link>
          )}
        </div>

        {user ? (
          <button onClick={handleLogout} className="text-sm text-white/50 transition-colors hover:text-white">
            Sair
          </button>
        ) : (
          <GlowButton className="!px-5 !py-2 text-sm" onClick={() => navigate('/login')}>
            Entrar
          </GlowButton>
        )}
      </nav>
    </motion.header>
  );
}
