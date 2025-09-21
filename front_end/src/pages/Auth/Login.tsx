import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import type { AuthDTO } from "../../types/auth";
import { signin } from "../../api/authApi";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const [form, setForm] = useState<AuthDTO>({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.username || !form.password) {
      setError("Username and password are required");
      return;
    }

    try {
      setLoading(true);
      const res = await signin(form);
      if (res.status === 200 && res.data?.accessToken) {
        login(res.data.accessToken);
        navigate("/dashboard");
      } else {
        setError(res.message || "Login failed");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
        {/* AKAPilot Logo Header */}
        <div className="flex items-center justify-center mb-8">
          <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center mr-3">
            <div className="w-7 h-7 bg-white rounded-sm flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-slate-700 rounded-sm"></div>
            </div>
          </div>
          <div className="text-left">
            <h1 className="text-2xl font-semibold text-gray-900">AKAPilot</h1>
            <p className="text-sm text-gray-500">Learning Management</p>
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-gray-900 text-center mb-6">
          Welcome Back
        </h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              value={form.username}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-700 focus:border-transparent transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-700 focus:border-transparent transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-slate-700 text-white font-medium rounded-lg hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-700 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-slate-700 hover:text-slate-800 font-medium cursor-pointer hover:underline transition-colors"
            >
              Create account
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}