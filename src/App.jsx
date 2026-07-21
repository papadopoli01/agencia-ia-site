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
import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';

// Cole aqui as suas chaves reais do Firebase que você guardou no Bloco de Notas:
const firebaseConfig = {
  apiKey: "SUA_API_KEY_REAL",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456:web:abcd"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export default function AgenciaIAFase4() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [leads, setLeads] = useState([]);
  const [feedback, setFeedback] = useState('');
  
  const [leadForm, setLeadForm] = useState({ name: '', email: '', projectIdea: '', status: 'Aguardando Pagamento' });

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
      setFeedback('Pedido criado! Prossiga para o pagamento abaixo.');
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
      setFeedback('Status atualizado!');
    } catch (error) {
      setFeedback('Erro ao atualizar status.');
    }
  };

  // Simulação de Checkout / Pagamento (Pode substituir pelo seu link do Mercado Pago / Stripe)
  const handleCheckout = () => {
    alert("Redirecionando para o ambiente de pagamento seguro (Pix/Cartão)...");
    // Exemplo: window.location.href = "SEU_LINK_DE_PAGAMENTO_EXTERNO";
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6">
      <nav className="flex justify-between items-center max-w-6xl mx-auto py-4 border-b border-slate-800 mb-10">
        <h1 className="text-xl font-black bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
          AGÊNCIA.IA // CHECKOUT & PAINEL
        </h1>
        <div>
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-purple-300">{user.email} {isAdmin && "(Admin)"}</span>
              <button onClick={handleLogout} className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg text-sm">Sair</button>
            </div>
          ) : (
            <span className="text-xs text-slate-400">Fase 4: Pagamento Ativo</span>
          )}
        </div>
      </nav>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        
        {/* Coluna Esquerda: Pedido e Botão de Pagamento */}
        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl backdrop-blur-md">
          <h2 className="text-2xl font-bold mb-4 text-purple-300">Novo Projeto & Pagamento</h2>
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
              placeholder="Descreva o site que a IA vai criar..." 
              value={leadForm.projectIdea}
              onChange={(e) => setLeadForm({ ...leadForm, projectIdea: e.target.value })}
              className="p-3 bg-slate-950 border border-slate-800 rounded-xl h-24"
              required
            ></textarea>
            <button type="submit" className="py-3 bg-purple-600 font-bold rounded-xl hover:bg-purple-500 transition">
              1. Salvar Dados do Pedido
            </button>
          </form>

          {/* Botão de Checkout / Pagamento */}
          <div className="mt-6 pt-6 border-t border-slate-800">
            <p className="text-xs text-slate-400 mb-3">Finalize a contratação realizando o pagamento:</p>
            <button onClick={handleCheckout} className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 font-bold rounded-xl hover:opacity-90 transition shadow-lg shadow-green-900/30">
              💳 Pagar com Pix / Cartão (Checkout)
            </button>
          </div>

          {feedback && <p className="text-sm text-purple-400 mt-4 text-center">{feedback}</p>}
        </div>

        {/* Coluna Direita: Login e Painel Admin */}
        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl backdrop-blur-md flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-4 text-blue-300">Acesso & Gestão</h2>
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
                  {isRegistering ? 'Já tem conta? Faça login' : 'Não tem conta? Cadastre-se'}
                </button>
              </form>
            ) : isAdmin ? (
              <div>
                <h3 className="text-lg font-semibold text-purple-400 mb-2">Painel do Administrador</h3>
                <p className="text-xs text-slate-400 mb-4">Acompanhe os pedidos e pagamentos:</p>
                <div className="flex flex-col gap-3 max-h-60 overflow-y-auto">
                  {leads.length === 0 ? (
                    <p className="text-sm text-slate-500">Nenhum pedido registrado ainda.</p>
                  ) : (
                    leads.map((lead) => (
                      <div key={lead.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-sm">
                        <p className="font-bold text-slate-200">{lead.name} ({lead.email})</p>
                        <p className="text-slate-400 text-xs mb-2">{lead.projectIdea}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded">Status: {lead.status}</span>
                          <button 
                            onClick={() => updateStatus(lead.id, 'Pago / Em Produção com IA')}
                            className="text-xs bg-green-600/30 text-green-300 px-2 py-1 rounded hover:bg-green-600/50"
                          >
                            Marcar como Pago
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
                <p className="text-sm text-slate-300">Seus pagamentos e o andamento do site gerado por IA aparecerão aqui em breve.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
