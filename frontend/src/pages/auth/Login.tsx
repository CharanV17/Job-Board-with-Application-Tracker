import { useState } from "react";
import { authService } from "../../services/auth.service";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../../store/auth";

export default function Login() {
  const navigate = useNavigate();
  const loginFn = useAuthStore((s: any) => s.login);


  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!form.email || !form.password)
      return setError("All fields are required");

    try {
      const data = await authService.login(form.email, form.password);
      loginFn(data.user, data.token);

      if (data.user.role === "candidate") {
  navigate("/candidate/dashboard");
} else if (data.user.role === "employer") {
  navigate("/employer/dashboard");
}

    } catch (err: any) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        {error && <p className="text-red-500 mb-3">{error}</p>}

        <label className="block mb-3">
          <span>Email</span>
          <input
            type="email"
            className="mt-1 w-full border p-2 rounded"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </label>

        <label className="block mb-3">
          <span>Password</span>
          <input
            type="password"
            className="mt-1 w-full border p-2 rounded"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </label>

        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Login
        </button>

        <p className="mt-4 text-center text-sm">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
