"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import Link from "next/link";
// import axios from "axios";
import axios from "@/lib/axios";
import toast from "react-hot-toast";

export default function LoginModal() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const endpoint = isRegistering ? "register" : "login";
      const payload = isRegistering ? { name, email, password } : { email, password };
      // console.log("payload", payload);
      // console.log("endpoint", endpoint);

      const res = await axios.post(`${endpoint}`, payload);
      // console.log("res.data", res.data);
      login(res.data.token, res.data.user);
      toast.success(`Welcome ${res.data.user.name}!`);
    } catch (err: any) {
      setError(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-red-100 rounded-lg shadow-lg w-96 max-w-md p-8 "
      >
        <p className="text-2xl text-red-500 text-center font-bold my-6">Welcome to FireSpec</p>
        <p className="text-xl text-center font-bold mb-4">
          {isRegistering ? "Register Your Account" : "Sign Into Your Account"}
        </p>
        {error && <p className="text-red-600 text-2xl mb-2">{error}</p>}
        {isRegistering && (
          <input
            className="w-full border px-3 py-2 mb-3 rounded-xl"
            type="text"
            placeholder="Enter Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}
        <input
          className="w-full border px-3 py-2 mb-3 rounded-xl"
          type="email"
          placeholder="Enter Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {/* <input
          className="w-full border px-3 py-2 mb-3 rounded-xl"
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        /> */}
        <div className="relative w-full">
          <input
            className="w-full border px-3 py-2 mb-3 rounded-xl"
            type={showPassword ? "text" : "password"} // Перемикання між "password" і "text"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="absolute right-3 top-2 text-gray-600"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword 
              ? <Image src="eye.svg" alt="Logo" width={20} height={20} className="cursor-pointer h-auto" priority/>
              : <Image src="eye-off.svg" alt="Logo" width={20} height={20} className="cursor-pointer h-auto" priority/>}
          </button>
        </div>
        <button
          type="submit"
          className="bg-slate-500 text-white w-full py-2 rounded-xl
            hover:bg-slate-700 hover:scale-105 active:scale-95 transition duration-200"
        >
          {isRegistering ? "Register" : "Login"}
        </button>

        {!isRegistering && (
          <div className="text-center mt-3">
            <Link 
              href="/forgot-password" 
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
        )}

        <button
          type="button"
          className="text-sm text-center w-full mt-8 text-cyan-600 my-4
            hover:scale-105 active:scale-95 transition duration-200"
          onClick={() => {
            setError("");
            setIsRegistering(!isRegistering);
          }}
        >
          {isRegistering
            ? "Already have an account? Login Here"
            : "Don't have an account? Register Here"}
        </button>
      </form>
    </div>
  );
}
