import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { createOrder, subscribeToUserOrders } from '../services/orders';
import GlowButton from '../components/ui/GlowButton';

const INITIAL_FORM = { siteType: 'institucional', description: '', budget: '', deadline: '' };

export default function ClientDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL_FORM);
  const [orders, setOrders] = useState([]);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = subscribeToUserOrders(user.uid, setOrders);
    return unsubscribe;
  }, [user]);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await createOrder(user.uid, form);
      setForm(INITIAL_FORM);
      setSent(true);
      setTimeout(() => setSent(false), 3000);
    } finally {
      setSending(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <main className="min-h-screen bg-void px-6 py-12 text-ink">
      <div className="mx-auto flex max-w-4xl items-center justify-between pb-10">
        <Link to="/" className="font-display text-xl font-bold text-gradient">
          IA.Agency
        </Link>
        <button onClick={handleLogout} className="text-sm text-white/50 transition-colors hover:text-white">
          Sair
        </button>
      </div>

      <div className="mx-auto grid max-w-4xl gap-10 md:grid-cols-2">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8"
        >
          <h1 className="mb-1 font-display text-2xl font-bold">Novo pedido</h1>
          <p className="mb-6 text-sm text-white/50">Descreva o site que você precisa.</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <select name="siteType" value={form.siteType} onChange={handleChange} className="field">
              <option value="institucional">Site institucional</option>
              <option value="loja">Loja virtual</option>
              <option value="landing">Landing page</option>
              <option value="outro">Outro</option>
            </select>
            <textarea
              name="description"
              required
              rows={4}
              placeholder="Descreva seu projeto"
              value={form.description}
              onChange={handleChange}
              className="field resize-none"
            />
            <input
              name="budget"
              placeholder="Orçamento estimado (opcional)"
              value={form.budget}
              onChange={handleChange}
              className="field"
            />
            <input type="date" name="deadline" value={form.deadline} onChange={handleChange} className="field" />

            <GlowButton type="submit" disabled={sending} className="mt-2 w-full">
              {sending ? 'Enviando...' : 'Enviar pedido'}
            </GlowButton>
            {sent && <p className="text-sm text-emerald-400">Pedido enviado com sucesso!</p>}
          </form>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-8"
        >
          <h2 className="mb-6 font-display text-2xl font-bold">Meus pedidos</h2>
          {orders.length === 0 ? (
            <p className="text-sm text-white/40">Você ainda não fez nenhum pedido.</p>
          ) : (
            <ul className="flex flex-col gap-4">
              {orders.map((order) => (
                <li key={order.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="font-mono text-xs uppercase tracking-wider text-neon-blue">{order.status}</span>
                    <span className="text-xs text-white/30">
                      {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString('pt-BR') : '...'}
                    </span>
                  </div>
                  <p className="text-sm text-white/70">{order.description}</p>
                </li>
              ))}
            </ul>
          )}
        </motion.section>
      </div>
    </main>
  );
}
