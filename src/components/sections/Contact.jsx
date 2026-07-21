import { useState } from 'react';
import { motion } from 'framer-motion';
import GlowButton from '../ui/GlowButton';
import { createLead } from '../../services/leads';

const INITIAL_FORM = { name: '', email: '', message: '' };

export default function Contact() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError('');
    try {
      await createLead(form);
      setForm(INITIAL_FORM);
      setSent(true);
    } catch {
      setError('Não foi possível enviar agora. Tente novamente em instantes.');
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contato" className="relative flex justify-center px-6 py-32">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-neon-purple/10 via-transparent to-transparent" />

      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.96 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="glass-card w-full max-w-lg p-8 md:p-12"
      >
        <h2 className="mb-2 font-display text-3xl font-bold text-gradient md:text-4xl">Vamos criar seu site</h2>
        <p className="mb-8 text-white/50">Conte um pouco sobre o seu projeto e nosso time entra em contato.</p>

        {sent ? (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-lg text-emerald-400"
          >
            Mensagem enviada! Em breve entramos em contato.
          </motion.p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <input
              type="text"
              name="name"
              required
              placeholder="Seu nome"
              value={form.name}
              onChange={handleChange}
              className="field"
            />
            <input
              type="email"
              name="email"
              required
              placeholder="Seu melhor e-mail"
              value={form.email}
              onChange={handleChange}
              className="field"
            />
            <textarea
              name="message"
              required
              rows={4}
              placeholder="Conte sobre o seu projeto"
              value={form.message}
              onChange={handleChange}
              className="field resize-none"
            />
            {error && <p className="text-sm text-red-400">{error}</p>}

            <GlowButton type="submit" disabled={sending} className="mt-2 w-full">
              {sending ? 'Enviando...' : 'Enviar mensagem'}
            </GlowButton>
          </form>
        )}
      </motion.div>
    </section>
  );
}
