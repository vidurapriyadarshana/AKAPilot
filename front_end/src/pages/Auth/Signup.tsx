import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { RegisterDTO } from "../../types/auth";
import { signup } from "../../api/authApi";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState<RegisterDTO>({
    username: "",
    password: "",
    email: "",
    role: "USER", // Default role set to USER
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!form.username || !form.email || !form.password || !confirmPassword) {
      setError("All fields are required");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (form.password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const res = await signup(form);
      if (res.status === 200) {
        alert("Account created successfully! Please log in.");
        navigate("/login");
      } else {
        setError(res.message || "Signup failed");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
        {/* StudyQuest Logo Header */}
        <div className="flex items-center justify-center mb-8">
          <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center mr-3">
            <div className="w-7 h-7 bg-white rounded-sm flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-slate-700 rounded-sm"></div>
            </div>
          </div>
          <div className="text-left">
            <h1 className="text-2xl font-semibold text-gray-900">StudyQuest</h1>
            <p className="text-sm text-gray-500">Learning Management</p>
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-gray-900 text-center mb-6">
          Create Account
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
              placeholder="Choose a username"
              value={form.username}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-700 focus:border-transparent transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
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
              placeholder="Create a secure password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-700 focus:border-transparent transition-colors"
            />
            <p className="text-xs text-gray-500 mt-1">
              Password must be at least 8 characters long
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-700 focus:border-transparent transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-slate-700 text-white font-medium rounded-lg hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-700 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-slate-700 hover:text-slate-800 font-medium cursor-pointer hover:underline transition-colors"
            >
              Sign in
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}