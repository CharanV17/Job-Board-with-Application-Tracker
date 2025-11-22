import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/auth";

interface Props {
  children: React.ReactNode;
  role?: "candidate" | "employer";
}

export default function ProtectedRoute({ children, role }: Props) {
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.loading);

  // Wait for auth initialization
  if (isLoading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Role-based restriction
  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
