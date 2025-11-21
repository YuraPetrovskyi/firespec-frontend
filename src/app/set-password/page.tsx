"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import axios from "@/lib/axios";
import { toast } from "react-hot-toast";
import LoadingButton from "@/components/LoadingButton";

function SetPasswordForm() {
  const router = useRouter();
  const { login } = useAuth();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    if (!token) {
      toast.error('Invalid invitation link');
      router.push('/');
    }
  }, [token, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== passwordConfirmation) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.post('/set-password', {
        token,
        password,
        password_confirmation: passwordConfirmation
      });

      const { user, token: authToken } = res.data;
      
      toast.success('Password set successfully! Welcome to FireSpec!');
      setUserEmail(user.email); // Зберігаємо email для автозбереження браузером
      login(authToken, user);
      router.push('/projects');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to set password';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">Welcome to FireSpec! 🔥</h1>
          <p className="text-gray-600">
            Set your password to activate your account
          </p>
        </div>

        <form onSubmit={handleSubmit} autoComplete="on">
          {userEmail && (
            <input
              type="email"
              value={userEmail}
              readOnly
              hidden
              autoComplete="username email"
            />
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Create Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              minLength={8}
              autoComplete="new-password"
            />
            <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              placeholder="Confirm your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              minLength={8}
              autoComplete="new-password"
            />
          </div>

          <LoadingButton
            type="submit"
            isLoading={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
            loadingText="Setting password..."
          >
            Set Password & Login
          </LoadingButton>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            By setting your password, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    }>
      <SetPasswordForm />
    </Suspense>
  );
}
