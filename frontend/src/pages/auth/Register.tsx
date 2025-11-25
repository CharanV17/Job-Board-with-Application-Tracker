import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../../services/auth.service";
import { useAuthStore } from "../../store/auth";

export default function Register() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [name, setName] = useState("");
  const [role, setRole] = useState<"candidate" | "employer">("candidate");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await authService.register({ name, email, password, role });

      // ⬇ Save user + token to global state
      setAuth(res.user, res.token);

      // redirect based on role
      if (res.user.role === "employer") navigate("/employer/dashboard");
      else navigate("/candidate/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Registration failed");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 px-4">
      <div className="w-full max-w-md bg-white/95 rounded-2xl shadow-xl border border-slate-200 p-8">
        <h1 className="text-3xl font-semibold text-center text-slate-800 mb-6">
          Create an Account
        </h1>

        {error && (
          <p className="mb-4 bg-red-100 text-red-700 border border-red-300 px-3 py-2 rounded-md text-sm">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Role select buttons */}
          <div className="flex gap-2 text-sm">
            <button
              type="button"
              onClick={() => setRole("candidate")}
              className={`flex-1 rounded-lg border py-2 ${
                role === "candidate"
                  ? "border-blue-600 bg-blue-50 text-blue-700"
                  : "border-slate-300 text-slate-600"
              }`}
            >
              Candidate
            </button>
            <button
              type="button"
              onClick={() => setRole("employer")}
              className={`flex-1 rounded-lg border py-2 ${
                role === "employer"
                  ? "border-blue-600 bg-blue-50 text-blue-700"
                  : "border-slate-300 text-slate-600"
              }`}
            >
              Employer
            </button>
          </div>

          <button
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
