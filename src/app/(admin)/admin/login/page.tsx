"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import BASE_URL from "@/lib/utils/baseUrl";

const AdminLoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(`${BASE_URL}/api/v1/admin/login`, {
        email,
        password,
      });
const { token, user } = res.data;

    // Save admin token and user info
    localStorage.setItem("adminToken", token);
    localStorage.setItem("adminUser", JSON.stringify(user));

    // console.log("User saved:", user);
      // Redirect to admin dashboard
      router.push("/admin/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <form
      onSubmit={handleLogin}
      className="w-full max-w-sm bg-white rounded-xl shadow-md p-6"
    >
      <h2 className="text-xl font-semibold text-center mb-6">
        Admin Login
      </h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="mb-4 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="mb-4 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {error && (
        <p className="mb-4 text-sm text-red-600 text-center">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-blue-600 py-2 text-white text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  </div>
);

};

export default AdminLoginPage;
