import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children, requireRole }) {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-void font-mono text-sm text-white/40">
        Carregando...
      </div>
    );
  }

  if (!user) {
    return <Navigate to={requireRole === 'admin' ? '/admin' : '/login'} replace />;
  }

  if (requireRole && role !== requireRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}
