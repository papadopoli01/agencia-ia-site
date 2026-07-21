import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { subscribeToLeads } from '../services/leads';
import { subscribeToAllOrders } from '../services/orders';

export default function AdminDashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const unsubLeads = subscribeToLeads(setLeads);
    const unsubOrders = subscribeToAllOrders(setOrders);
    return () => {
      unsubLeads();
      unsubOrders();
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <main className="min-h-screen bg-void px-6 py-12 text-ink">
      <div className="mx-auto flex max-w-5xl items-center justify-between pb-10">
        <Link to="/" className="font-display text-xl font-bold text-gradient">
          IA.Agency — Admin
        </Link>
        <button onClick={handleLogout} className="text-sm text-white/50 transition-colors hover:text-white">
          Sair
        </button>
      </div>

      <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-2">
        <section className="glass-card p-8">
          <h2 className="mb-6 font-display text-2xl font-bold">Leads ({leads.length})</h2>
          <ul className="flex max-h-[60vh] flex-col gap-4 overflow-y-auto pr-2">
            {leads.map((lead) => (
              <li key={lead.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <p className="font-semibold">{lead.name}</p>
                <p className="text-sm text-white/50">{lead.email}</p>
                <p className="mt-2 text-sm text-white/70">{lead.message}</p>
              </li>
            ))}
            {leads.length === 0 && <p className="text-sm text-white/40">Nenhum lead ainda.</p>}
          </ul>
        </section>

        <section className="glass-card p-8">
          <h2 className="mb-6 font-display text-2xl font-bold">Pedidos ({orders.length})</h2>
          <ul className="flex max-h-[60vh] flex-col gap-4 overflow-y-auto pr-2">
            {orders.map((order) => (
              <li key={order.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <div className="mb-1 flex items-center justify-between">
                  <span className="font-mono text-xs uppercase tracking-wider text-neon-purple">
                    {order.siteType}
                  </span>
                  <span className="font-mono text-xs uppercase text-neon-blue">{order.status}</span>
                </div>
                <p className="text-sm text-white/70">{order.description}</p>
              </li>
            ))}
            {orders.length === 0 && <p className="text-sm text-white/40">Nenhum pedido ainda.</p>}
          </ul>
        </section>
      </div>
    </main>
  );
}
