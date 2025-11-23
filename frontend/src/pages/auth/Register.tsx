import { useState } from "react";
import { authService } from "../../services/auth.service";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../../store/auth";

export default function Register() {
  const navigate = useNavigate();
  const loginFn = useAuthStore((s: any) => s.login);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "candidate",
  });

  const [error, setError] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password)
      return setError("All fields are required");

    try {
      console.log("FORM SENT TO API:", form);

      const data = await authService.register(form);

      loginFn(data.user, data.token);

      if (data.user.role === "candidate") {
  navigate("/candidate/dashboard");
} else if (data.user.role === "employer") {
  navigate("/employer/dashboard");
}

    } catch (err: any) {
  console.log("REGISTER ERROR:", err.response?.data);
  setError(err.response?.data?.message || "Registration failed");
}

  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

        {error && <p className="text-red-500 mb-3">{error}</p>}

        <label className="block mb-3">
          <span>Name</span>
          <input
            className="mt-1 w-full border p-2 rounded"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </label>

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

        <label className="block mb-3">
          <span>Role</span>
          <select
  className="mt-1 w-full border p-2 rounded"
  value={form.role}   // <--- This is the fix
  onChange={(e) => setForm({ ...form, role: e.target.value })}
>
  <option value="candidate">Candidate</option>
  <option value="employer">Employer</option>
</select>

        </label>

        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Register
        </button>

        <p className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
