import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';

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

export default function AgenciaIAFase3() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [leads, setLeads] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [feedback, setFeedback] = useState('');
  
  // Formulário de novo lead/pedido
  const [leadForm, setLeadForm] = useState({ name: '', email: '', projectIdea: '', status: 'Em Análise da IA' });

  // Monitorar estado de autenticação
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

  // Buscar dados do Admin (Leads e Pedidos)
  const fetchAdminData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "leads"));
      const items = querySnapshot.docs.map(docItem => ({ id: docItem.id, ...docItem.data() }));
      setLeads(items);
    } catch (e) {
      console.error("Erro ao buscar leads", e);
    }
  };

  // Autenticação (Login / Cadastro)
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

  // Enviar novo pedido (Lead)
  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "leads"), {
        ...leadForm,
        createdAt: new Date()
      });
      setFeedback('Pedido enviado com sucesso para a IA!');
      setLeadForm({ name: '', email: '', projectIdea: '', status: 'Em Análise da IA' });
      if (isAdmin) fetchAdminData();
    } catch (error) {
      setFeedback('Erro ao enviar pedido.');
    }
  };

  // Atualizar status do pedido (Apenas Admin)
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
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6">
      {/* Barra Superior */}
      <nav className="flex justify-between items-center max-w-6xl mx-auto py-4 border-b border-slate-800 mb-10">
        <h1 className="text-xl font-black bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
          AGÊNCIA.IA // PAINEL FASE 3
        </h1>
        <div>
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-purple-300">{user.email} {isAdmin && "(Admin)"}</span>
              <button onClick={handleLogout} className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg text-sm">Sair</button>
            </div>
          ) : (
            <span className="text-xs text-slate-400">Área de Acesso Restrito</span>
          )}
        </div>
      </nav>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        
        {/* Coluna Esquerda: Formulário de Orçamento / Acompanhamento */}
        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl backdrop-blur-md">
          <h2 className="text-2xl font-bold mb-4 text-purple-300">Solicitar Site com IA</h2>
          <form onSubmit={handleLeadSubmit} className="flex flex-col gap-4">
            <input 
              type="text" 
              placeholder="Seu Nome" 
              value={leadForm.name}
              onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
              className="p-3 bg-slate-950 border border-slate-800 rounded-xl"
              required
            />
            <input 
              type="email" 
              placeholder="Seu E-mail" 
              value={leadForm.email}
              onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
              className="p-3 bg-slate-950 border border-slate-800 rounded-xl"
              required
            />
            <textarea 
              placeholder="Ideia do site..." 
              value={leadForm.projectIdea}
              onChange={(e) => setLeadForm({ ...leadForm, projectIdea: e.target.value })}
              className="p-3 bg-slate-950 border border-slate-800 rounded-xl h-28"
              required
            ></textarea>
            <button type="submit" className="py-3 bg-purple-600 font-bold rounded-xl hover:bg-purple-500 transition">
              Enviar Pedido
            </button>
          </form>

          {feedback && <p className="text-sm text-purple-400 mt-4 text-center">{feedback}</p>}
        </div>

        {/* Coluna Direita: Sistema de Login e Painel Admin */}
        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl backdrop-blur-md flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-4 text-blue-300">Acesso & Painel Admin</h2>
            {!user ? (
              <form onSubmit={handleAuth} className="flex flex-col gap-4">
                <input 
                  type="email" 
                  placeholder="E-mail de acesso" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="p-3 bg-slate-950 border border-slate-800 rounded-xl"
                  required
                />
                <input 
                  type="password" 
                  placeholder="Senha" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="p-3 bg-slate-950 border border-slate-800 rounded-xl"
                  required
                />
                <button type="submit" className="py-3 bg-blue-600 font-bold rounded-xl hover:bg-blue-500 transition">
                  {isRegistering ? 'Cadastrar Conta' : 'Entrar na Conta'}
                </button>
                <button 
                  type="button" 
                  onClick={() => setIsRegistering(!isRegistering)}
                  className="text-xs text-slate-400 underline text-center mt-2"
                >
                  {isRegistering ? 'Já tem uma conta? Faça login' : 'Não tem conta? Cadastre-se'}
                </button>
              </form>
            ) : isAdmin ? (
              <div>
                <h3 className="text-lg font-semibold text-purple-400 mb-2">Painel de Controle (Admin)</h3>
                <p className="text-xs text-slate-400 mb-4">Gerencie abaixo os pedidos recebidos:</p>
                <div className="flex flex-col gap-3 max-h-60 overflow-y-auto">
                  {leads.length === 0 ? (
                    <p className="text-sm text-slate-500">Nenhum pedido encontrado no Firebase.</p>
                  ) : (
                    leads.map((lead) => (
                      <div key={lead.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-sm">
                        <p className="font-bold text-slate-200">{lead.name} ({lead.email})</p>
                        <p className="text-slate-400 text-xs mb-2">{lead.projectIdea}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded">Status: {lead.status}</span>
                          <button 
                            onClick={() => updateStatus(lead.id, 'Em Produção com IA')}
                            className="text-xs bg-blue-600/30 text-blue-300 px-2 py-1 rounded hover:bg-blue-600/50"
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
              <div>
                <h3 className="text-lg font-semibold text-green-400 mb-2">Área do Cliente</h3>
                <p className="text-sm text-slate-300">Bem-vindo! Seus pedidos feitos com o e-mail cadastrado aparecerão aqui em breve para acompanhamento em tempo real.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
