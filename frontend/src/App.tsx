import { BrowserRouter } from "react-router-dom";
import AppRouter from "./router";
import Navbar from "./components/layout/Navbar";
import { useAuthStore } from "./store/auth";
import { useEffect } from "react";

export default function App() {
  const initAuth = useAuthStore((s) => s.initAuth);
  const loading = useAuthStore((s) => s.loading);

  useEffect(() => {
    initAuth();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-lg">
        Loading authentication...
      </div>
    );

  return (
    <BrowserRouter>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AppRouter />
      </div>
    </BrowserRouter>
  );
}
