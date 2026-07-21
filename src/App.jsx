import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addgetDocs, getDocs, addDoc } from 'firebase/firestore';

// Suas configurações do Firebase já salvas no ambiente (.env ou configuradas)
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "SUA_API_KEY",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "seu-projeto.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "seu-projeto",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "seu-projeto.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:123456:web:abcd"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export default function AgenciaIA() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [portfolio, setPortfolio] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [leadForm, setLeadForm] = useState({ name: '', email: '', projectIdea: '' });
  const [feedback, setFeedback] = useState('');

  // Monitorar autenticação
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser && currentUser.email === 'admin@agencia.com') {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Buscar Portfólio do Firestore
  useEffect(() => {
    async function fetchPortfolio() {
      try {
        const querySnapshot = await getDocs(collection(db, "portfolio"));
        const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPortfolio(items);
      } catch (e) {
        // Dados de exemplo caso o banco esteja vazio inicialmente
        setPortfolio([
          { id: 1, title: 'Landing Page Neon 3D', description: 'Criada inteiramente com IA em 2 horas.' },
          { id: 2, title: 'E-commerce Futurista', description: 'Alta conversão e fluidez extrema.' }
        ]);
      }
    }
    fetchPortfolio();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setFeedback('Login efetuado com sucesso!');
    } catch (error) {
      setFeedback('Erro ao fazer login: ' + error.message);
    }
  };

  const handleLogout = () => signOut(auth);

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "leads"), {
        ...leadForm,
        createdAt: new Date()
      });
      setFeedback('Solicitação enviada com sucesso! Entraremos em contato.');
      setLeadForm({ name: '', email: '', projectIdea: '' });
    } catch (error) {
      setFeedback('Erro ao enviar pedido.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-purple-500 selection:text-white">
      {/* Barra Superior / Navegação */}
      <nav className="flex justify-between items-center px-8 py-6 border-b border-slate-800/60 backdrop-blur-md sticky top-0 z-50 bg-slate-950/80">
        <h1 className="text-2xl font-black tracking-wider bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
          AGÊNCIA.IA
        </h1>
        <div>
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-purple-300">Olá, {user.email}</span>
              <button onClick={handleLogout} className="px-4 py-2 bg-red-600/20 border border-red-500/40 text-red-400 rounded-xl hover:bg-red-600/30 transition">
                Sair
              </button>
            </div>
          ) : (
            <span className="text-xs text-slate-400 uppercase tracking-widest border border-purple-500/30 px-3 py-1.5 rounded-full bg-purple-500/10">
              Modo Visitante
            </span>
          )}
        </div>
      </nav>

      {/* Hero Section com Espaço 3D */}
      <header className="relative flex flex-col items-center justify-center text-center px-6 py-24 overflow-hidden">
        <div className="absolute w-96 h-96 bg-purple-600/20 rounded-full blur-3xl -top-20 -left-20 pointer-events-none"></div>
        <div className="absolute w-96 h-96 bg-blue-600/20 rounded-full blur-3xl bottom-0 right-0 pointer-events-none"></div>

        <h2 className="text-5xl md:text-7xl font-extrabold max-w-4xl tracking-tight leading-tight mb-6">
          Websites gerados por <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-blue-500 bg-clip-text text-transparent">Inteligência Artificial</span>
        </h2>
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-10">
          Experiências imersivas, design fora da caixa e performance extrema na velocidade que o seu negócio exige.
        </p>

        {/* Espaço placeholder para Elemento 3D / Interativo */}
        <div className="w-full max-w-3xl h-64 md:h-80 bg-slate-900/50 border border-slate-800 rounded-3xl backdrop-blur-xl flex items-center justify-center relative shadow-2xl shadow-purple-900/20 mb-12 group hover:border-purple-500/50 transition duration-500">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition"></div>
          <p className="text-purple-400 font-mono tracking-widest text-sm animate-pulse">
            [ Área 3D Interativa / React Three Fiber / Spline ]
          </p>
        </div>

        <a href="#contato" className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 font-semibold rounded-2xl shadow-lg shadow-purple-600/30 hover:scale-105 transition transform">
          Quero meu site agora
        </a>
      </header>

      {/* Seção de Portfólio Dinâmico */}
      <section className="px-8 py-20 max-w-6xl mx-auto">
        <h3 className="text-3xl font-bold mb-10 text-center">Nossos Trabalhos em Destaque</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {portfolio.map((item) => (
            <div key={item.id} className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800 backdrop-blur-md hover:border-purple-500/40 transition">
              <h4 className="text-xl font-bold text-purple-300 mb-2">{item.title}</h4>
              <p className="text-slate-400">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Seção de Login / Cliente & Admin */}
      <section className="px-8 py-16 max-w-md mx-auto bg-slate-900/40 border border-slate-800 rounded-3xl my-10 backdrop-blur-md">
        <h3 className="text-2xl font-bold text-center mb-6">Acesso Restrito / Cliente</h3>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input 
            type="email" 
            placeholder="Seu e-mail" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-purple-500 text-slate-100"
          />
          <input 
            type="password" 
            placeholder="Sua senha" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-purple-500 text-slate-100"
          />
          <button type="submit" className="py-3 bg-purple-600 hover:bg-purple-500 font-bold rounded-xl transition">
            Entrar na Plataforma
          </button>
        </form>
        {feedback && <p className="text-center text-sm mt-4 text-purple-400">{feedback}</p>}
      </section>

      {/* Seção de Contato / Leads */}
      <section id="contato" className="px-8 py-20 max-w-xl mx-auto">
        <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl shadow-2xl">
          <h3 className="text-2xl font-bold mb-6 text-center">Peça seu Orçamento com IA</h3>
          <form onSubmit={handleLeadSubmit} className="flex flex-col gap-4">
            <input 
              type="text" 
              placeholder="Seu Nome" 
              value={leadForm.name}
              onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
              className="px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-purple-500"
              required
            />
            <input 
              type="email" 
              placeholder="Seu E-mail" 
              value={leadForm.email}
              onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
              className="px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-purple-500"
              required
            />
            <textarea 
              placeholder="Descreva a ideia do seu site..." 
              value={leadForm.projectIdea}
              onChange={(e) => setLeadForm({ ...leadForm, projectIdea: e.target.value })}
              className="px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-purple-500 h-32"
              required
            ></textarea>
            <button type="submit" className="py-4 bg-gradient-to-r from-purple-600 to-blue-600 font-bold rounded-xl hover:opacity-90 transition">
              Enviar Pedido para a IA
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
