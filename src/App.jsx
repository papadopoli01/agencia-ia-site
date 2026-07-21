import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';

// Cole as suas chaves reais do Firebase aqui em baixo:
const firebaseConfig = {
  apiKey: "AIzaSyD5RfIf2MVkJiQc8z2kaA_kSjj64Wb07jQ",
  authDomain: "agencia-ia-db.firebaseapp.com",
  projectId: "agencia-ia-db",
  storageBucket: "agencia-ia-db.firebasestorage.app",
  messagingSenderId: "219764639000",
  appId: "1:219764639000:web:4b1032162dda0eb7a74a6d"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export default function AgenciaIAPerfeita() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [leads, setLeads] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [leadForm, setLeadForm] = useState({ name: '', email: '', projectIdea: '', status: 'Em Análise pela IA' });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser && currentUser.email === 'admin@agencia.com') {
        setIsAdmin(true);
        fetchAdminData();
      } else {
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchAdminData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "leads"));
      const items = querySnapshot.docs.map(docItem => ({ id: docItem.id, ...docItem.data() }));
      setLeads(items);
    } catch (e) {
      console.error("Erro ao buscar leads", e);
    }
  };

  useEffect(() => {
    async function fetchPortfolio() {
      try {
        const querySnapshot = await getDocs(collection(db, "portfolio"));
        const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPortfolio(items);
      } catch (e) {
        setPortfolio([
          { id: 1, title: 'Landing Page Neon 3D', description: 'Criada inteiramente com IA e alta fluidez visual.' },
          { id: 2, title: 'E-commerce Futurista', description: 'Design minimalista estilo Apple e conversão extrema.' }
        ]);
      }
    }
    fetchPortfolio();
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
        setFeedback('Conta criada com sucesso!');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        setFeedback('Login efetuado com sucesso!');
      }
    } catch (error) {
      setFeedback('Erro: ' + error.message);
    }
  };

  const handleLogout = () => {
    signOut(auth);
    setFeedback('Você saiu da conta.');
  };

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "leads"), {
        ...leadForm,
        createdAt: new Date()
      });
      setFeedback('Pedido enviado com sucesso para a IA!');
      setLeadForm({ name: '', email: '', projectIdea: '', status: 'Em Análise pela IA' });
      if (isAdmin) fetchAdminData();
    } catch (error) {
      setFeedback('Erro ao enviar pedido.');
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const leadDocRef = doc(db, "leads", id);
      await updateDoc(leadDocRef, { status: newStatus });
      fetchAdminData();
      setFeedback('Status atualizado com sucesso!');
    } catch (error) {
      setFeedback('Erro ao atualizar status.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-purple-500 selection:text-white relative overflow-hidden">
      <div className="absolute w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[140px] -top-32 -left-32 pointer-events-none animate-pulse"></div>
      <div className="absolute w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[140px] top-1/3 -right-32 pointer-events-none"></div>

      <nav className="flex justify-between items-center px-8 py-6 border-b border-slate-800/60 backdrop-blur-xl sticky top-0 z-50 bg-slate-950/70">
        <h1 className="text-2xl font-black tracking-wider bg-gradient-to-r from-purple-400 via-indigo-300 to-blue-500 bg-clip-text text-transparent">
          AGÊNCIA.AI
        </h1>
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-xs text-purple-300 bg-purple-950/60 px-3 py-1.5 rounded-full border border-purple-500/30">
                {user.email} {isAdmin ? "(Admin)" : "(Cliente)"}
              </span>
              <button onClick={handleLogout} className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-400 rounded-xl text-xs transition">
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

      <header className="relative flex flex-col items-center justify-center text-center px-6 py-24">
        <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold tracking-wider uppercase backdrop-blur-md">
          ✨ O Futuro do Web Design Chegou
        </div>
        
        <h2 className="text-5xl md:text-7xl font-extrabold max-w-4xl tracking-tight leading-tight mb-6">
          Websites gerados por <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-blue-500 bg-clip-text text-transparent">Inteligência Artificial</span>
        </h2>
        
        <p className="text-base md:text-xl text-slate-400 max-w-2xl mb-12 leading-relaxed">
          Experiências visuais imersivas, design fora da caixa e performance extrema na velocidade que o seu negócio exige.
        </p>

        <div className="w-full max-w-4xl h-72 md:h-96 bg-slate-900/40 border border-slate-800/80 rounded-3xl backdrop-blur-2xl flex items-center justify-center relative shadow-2xl shadow-purple-950/50 mb-16 group hover:border-purple-500/50 transition duration-700">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-blue-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition duration-700"></div>
          <div className="text-center z-10">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/30 animate-bounce">
              <span className="text-2xl">⚡</span>
            </div>
            <p className="text-purple-300 font-mono tracking-widest text-sm mb-1">
              [ ELEMENTO 3D & INTERAÇÃO DINÂMICA ]
            </p>
            <p className="text-xs text-slate-500">Renderização em tempo real via React Three Fiber / Spline</p>
          </div>
        </div>
      </header>

      <section className="px-6 py-12 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
        <div className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl shadow-2xl hover:border-purple-500/30 transition">
          <h3 className="text-2xl font-bold mb-2 text-purple-300">Solicitar Projeto com IA</h3>
          <p className="text-xs text-slate-400 mb-6">Conte-nos a sua ideia e deixe a inteligência artificial projetar.</p>
          
          <form onSubmit={handleLeadSubmit} className="flex flex-col gap-4">
            <input 
              type="text" 
              placeholder="Seu Nome" 
              value={leadForm.name}
              onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
              className="px-4 py-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl focus:outline-none focus:border-purple-500 text-slate-100 transition"
              required
            />
            <input 
              type="email" 
              placeholder="Seu E-mail" 
              value={leadForm.email}
              onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
              className="px-4 py-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl focus:outline-none focus:border-purple-500 text-slate-100 transition"
              required
            />
            <textarea 
              placeholder="Descreva a ideia do seu site..." 
              value={leadForm.projectIdea}
              onChange={(e) => setLeadForm({ ...leadForm, projectIdea: e.target.value })}
              className="px-4 py-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl focus:outline-none focus:border-purple-500 text-slate-100 h-32 transition resize-none"
              required
            ></textarea>
            <button type="submit" className="py-4 bg-gradient-to-r from-purple-600 to-blue-600 font-bold rounded-2xl hover:opacity-90 transition shadow-lg shadow-purple-600/30 text-white">
              Enviar Pedido para a IA
            </button>
          </form>

          {feedback && <p className="text-sm text-purple-400 mt-4 text-center font-medium">{feedback}</p>}
        </div>

        <div className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl shadow-2xl flex flex-col justify-between hover:border-blue-500/30 transition">
          <div>
            <h3 className="text-2xl font-bold mb-2 text-blue-300">Acesso à Plataforma</h3>
            <p className="text-xs text-slate-400 mb-6">Área restrita para clientes e gestores da agência.</p>

            {!user ? (
              <form onSubmit={handleAuth} className="flex flex-col gap-4">
                <input 
                  type="email" 
                  placeholder="E-mail de acesso" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-4 py-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl focus:outline-none focus:border-blue-500 text-slate-100 transition"
                  required
                />
                <input 
                  type="password" 
                  placeholder="Sua senha" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="px-4 py-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl focus:outline-none focus:border-blue-500 text-slate-100 transition"
                  required
                />
                <button type="submit" className="py-3.5 bg-blue-600 hover:bg-blue-500 font-bold rounded-2xl transition shadow-lg shadow-blue-950/50 text-white">
                  {isRegistering ? 'Cadastrar Nova Conta' : 'Entrar na Conta'}
                </button>
                <button 
                  type="button" 
                  onClick={() => setIsRegistering(!isRegistering)}
                  className="text-xs text-slate-400 hover:text-slate-300 underline text-center mt-2"
                >
                  {isRegistering ? 'Já tem conta? Faça login' : 'Não tem conta? Cadastre-se'}
                </button>
              </form>
            ) : isAdmin ? (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-base font-semibold text-purple-300">Painel de Controle (Admin)</h4>
                  <span className="text-xs bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full border border-purple-500/30 font-medium">Gestor</span>
                </div>
                <div className="flex flex-col gap-3 max-h-64 overflow-y-auto pr-1">
                  {leads.length === 0 ? (
                    <p className="text-sm text-slate-500 text-center py-6">Nenhum pedido registado no Firebase.</p>
                  ) : (
                    leads.map((lead) => (
                      <div key={lead.id} className="p-4 bg-slate-950/90 border border-slate-800 rounded-2xl text-sm">
                        <p className="font-bold text-slate-200">{lead.name} <span className="text-xs text-slate-400 font-normal">({lead.email})</span></p>
                        <p className="text-slate-400 text-xs my-1">{lead.projectIdea}</p>
                        <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-900">
                          <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded font-medium">{lead.status}</span>
                          <button 
                            onClick={() => updateStatus(lead.id, 'Em Produção com IA')}
                            className="text-xs bg-blue-600/30 text-blue-300 px-2.5 py-1 rounded-lg hover:bg-blue-600/50 transition font-medium"
                          >
                            Avançar Status
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-10">
                <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-3 text-lg font-bold border border-emerald-500/30">✓</div>
                <h4 className="text-lg font-semibold text-slate-200 mb-1">Área do Cliente Conectada</h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">Seu acesso está ativo. O andamento do seu projeto aparecerá aqui em tempo real.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="px-6 py-16 max-w-6xl mx-auto mb-20">
        <h3 className="text-3xl font-bold mb-10 text-center bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">
          Nossos Trabalhos em Destaque
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {portfolio.map((item) => (
            <div key={item.id} className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md hover:border-purple-500/50 transition duration-500 group">
              <h4 className="text-xl font-bold text-purple-300 mb-2 group-hover:text-purple-200 transition">{item.title}</h4>
              <p className="text-slate-400 text-sm leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
