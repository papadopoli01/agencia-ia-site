import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

/** Salva um lead vindo do formulário público de contato (visitante não autenticado). */
export function createLead({ name, email, message }) {
  return addDoc(collection(db, 'leads'), {
    name,
    email,
    message,
    status: 'novo',
    createdAt: serverTimestamp(),
  });
}

/** Assina a lista de leads em tempo real (uso exclusivo do painel admin). */
export function subscribeToLeads(callback) {
  const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })));
  });
}
