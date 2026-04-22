import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/auth";

interface Props {
  children: React.ReactNode;
  role?: "candidate" | "employer";
}

export default function ProtectedRoute({ children, role }: Props) {
  const user = useAuthStore((s: any) => s.user);
  const loading = useAuthStore((s: any) => s.loading);

  // Wait while auth initializes
  if (loading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  // User not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Role-based protection
  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
