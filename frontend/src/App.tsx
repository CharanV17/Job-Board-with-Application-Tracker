import { BrowserRouter } from "react-router-dom";
import AppRouter from "./router";
import Navbar from "./components/layout/Navbar";

export default function App() {
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