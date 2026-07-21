import { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

const AuthContext = createContext(null);

/**
 * Um único fluxo de autenticação (Firebase Auth) serve tanto clientes
 * quanto administradores. O que diferencia os dois é o campo `role`
 * salvo no documento `users/{uid}` no Firestore:
 *   - clientes se cadastram sozinhos pelo formulário (role: 'client')
 *   - administradores devem ser promovidos manualmente no Firestore,
 *     trocando o campo `role` para 'admin' (veja o README)
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        const profileSnap = await getDoc(doc(db, 'users', firebaseUser.uid));
        setRole(profileSnap.exists() ? profileSnap.data().role ?? 'client' : 'client');
      } else {
        setRole(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);

  const register = async (name, email, password) => {
    const credential = await createUserWithEmailAndPassword(auth, email, password);

    await setDoc(doc(db, 'users', credential.user.uid), {
      name,
      email,
      role: 'client',
      createdAt: serverTimestamp(),
    });

    return credential;
  };

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, role, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth precisa ser usado dentro de <AuthProvider>');
  return context;
}
