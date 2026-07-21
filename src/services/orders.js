import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
} from 'firebase/firestore';
import { db } from '../lib/firebase';

/** Cria um pedido vinculado ao cliente autenticado (userId). */
export function createOrder(userId, { siteType, description, budget, deadline }) {
  return addDoc(collection(db, 'orders'), {
    userId,
    siteType,
    description,
    budget: budget || null,
    deadline: deadline || null,
    status: 'pendente',
    createdAt: serverTimestamp(),
  });
}

/** Assina, em tempo real, apenas os pedidos do cliente logado. */
export function subscribeToUserOrders(userId, callback) {
  const q = query(collection(db, 'orders'), where('userId', '==', userId), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })));
  });
}

/** Assina, em tempo real, todos os pedidos (uso exclusivo do painel admin). */
export function subscribeToAllOrders(callback) {
  const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })));
  });
}
