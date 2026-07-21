import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import GlowButton from '../components/ui/GlowButton';

const ERROS = {
  'auth/invalid-credential': 'E-mail ou senha inválidos.',
  'auth/user-not-found': 'Usuário não encontrado.',
  'auth/wrong-password': 'Senha incorreta.',
  'auth/email-already-in-use': 'Este e-mail já está cadastrado.',
  'auth/weak-password': 'A senha precisa ter pelo menos 6 caracteres.',
};

export default function Login() {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(form.email, form.password);
      } else {
        await register(form.name, form.email, form.password);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(ERROS[err.code] || 'Ocorreu um erro. Tente novamente.');
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
        <Link to="/" className="mb-8 inline-block font-display text-lg font-bold text-gradient">
          IA.Agency
        </Link>

        <h1 className="mb-2 font-display text-2xl font-bold">
          {mode === 'login' ? 'Entrar na sua conta' : 'Criar conta de cliente'}
        </h1>
        <p className="mb-8 text-sm text-white/50">
          {mode === 'login'
            ? 'Acesse seus pedidos e acompanhe seu projeto.'
            : 'Crie sua conta para acompanhar seus pedidos.'}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {mode === 'register' && (
            <input
              name="name"
              placeholder="Seu nome"
              required
              value={form.name}
              onChange={handleChange}
              className="field"
            />
          )}
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
            minLength={6}
            value={form.password}
            onChange={handleChange}
            className="field"
          />

          {error && <p className="text-sm text-red-400">{error}</p>}

          <GlowButton type="submit" disabled={loading} className="mt-2 w-full">
            {loading ? 'Aguarde...' : mode === 'login' ? 'Entrar' : 'Criar conta'}
          </GlowButton>
        </form>

        <button
          onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
          className="mt-6 w-full text-center text-sm text-white/50 transition-colors hover:text-white"
        >
          {mode === 'login' ? 'Não tem conta? Criar agora' : 'Já tem conta? Entrar'}
        </button>

        <Link to="/admin" className="mt-4 block text-center text-xs text-white/30 hover:text-white/50">
          Sou administrador
        </Link>
      </motion.div>
    </main>
  );
}
