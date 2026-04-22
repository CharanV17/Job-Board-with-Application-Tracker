import { BrowserRouter } from "react-router-dom";
import { useEffect } from "react";
import AppRouter from "./router";
import Navbar from "./components/layout/Navbar";
import { useAuthStore } from "./store/auth";

export default function App() {
  const loadUser = useAuthStore((s) => s.loadUser);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <BrowserRouter>
      {/* Navbar spans full width and sits at the top */}
      <Navbar /> 
      
      {/* Main Content Container: max-width, center-aligned, and top/side padding */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AppRouter />
      </div>
    </BrowserRouter>
  );
}