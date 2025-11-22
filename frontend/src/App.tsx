import AppRouter from "./router";
import Navbar from "./components/layout/Navbar";

export default function App() {
  return (
    <>
      <Navbar />
      <div className="pt-4">
        <AppRouter />
      </div>
    </>
  );
}
