"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";

export default function LoginModal() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const endpoint = isRegistering ? "/api/register" : "/api/login";
      const payload = isRegistering ? { name, email, password } : { email, password };
      const res = await axios.post(`http://localhost:8000${endpoint}`, payload);
      login(res.data.token, res.data.user);
    } catch (err: any) {
      setError(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-lg w-full max-w-md p-8"
      >
        <h2 className="text-2xl font-bold mb-4">
          {isRegistering ? "Register" : "Login"}
        </h2>
        {error && <p className="text-red-600 mb-2">{error}</p>}

        {isRegistering && (
          <input
            className="w-full border px-3 py-2 mb-3 rounded"
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}
        <input
          className="w-full border px-3 py-2 mb-3 rounded"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="w-full border px-3 py-2 mb-3 rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
        >
          {isRegistering ? "Register" : "Login"}
        </button>
        <button
          type="button"
          className="text-sm mt-4 underline text-gray-600"
          onClick={() => {
            setError("");
            setIsRegistering(!isRegistering);
          }}
        >
          {isRegistering
            ? "Already have an account? Login"
            : "Don't have an account? Register"}
        </button>
      </form>
    </div>
  );
}
