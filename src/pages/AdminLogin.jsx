import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import GlowButton from '../components/ui/GlowButton';

export default function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      // Quem decide se o usuário realmente é admin é o ProtectedRoute da
      // rota /admin/dashboard, que verifica o campo "role" no Firestore.
      navigate('/admin/dashboard');
    } catch {
      setError('E-mail ou senha inválidos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-void px-6 text-ink">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="glass-card w-full max-w-md p-8 md:p-10"
      >
        <span className="mb-8 inline-block font-mono text-xs uppercase tracking-[0.3em] text-white/40">
          Área administrativa
        </span>
        <h1 className="mb-8 font-display text-2xl font-bold">Login do administrador</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            name="email"
            placeholder="E-mail"
            required
            value={form.email}
            onChange={handleChange}
            className="field"
          />
          <input
            type="password"
            name="password"
            placeholder="Senha"
            required
            value={form.password}
            onChange={handleChange}
            className="field"
          />

          {error && <p className="text-sm text-red-400">{error}</p>}

          <GlowButton type="submit" disabled={loading} className="mt-2 w-full">
            {loading ? 'Aguarde...' : 'Entrar'}
          </GlowButton>
        </form>

        <Link to="/login" className="mt-6 block text-center text-xs text-white/30 hover:text-white/50">
          Sou cliente
        </Link>
      </motion.div>
    </main>
  );
}
