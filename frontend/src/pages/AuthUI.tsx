import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import jwt_decode from 'jwt-decode';

// ✅ Define the user and context types
interface User {
  email: string;
}

interface AuthContextType {
  setUser: (user: User | null) => void;
}

const AuthUI = () => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot' | 'sent'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setUser } = useAuth() as AuthContextType;
  const navigate = useNavigate();

  useEffect(() => {
    if (mode === 'sent') {
      const timer = setTimeout(() => navigate('/app/admin/login'), 5000);
      return () => clearTimeout(timer);
    }
  }, [mode, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    try {
      if (mode === 'login') {
        const res = await api.post('/auth/login', new URLSearchParams({
          username: email,
          password: password
        }));

        const token = res.data.access_token;
        localStorage.setItem('token', token);

        const me = await api.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(me.data);
        navigate("/app");
      } else if (mode === 'signup') {
        await api.post('/auth/signup', { email, password });
        setMode('login');
        toast.success("📩 Account created. Please check your inbox or spam folder.");
      } else if (mode === 'forgot') {
        const res = await api.post('/auth/request-reset', { email });
        if (res.status === 200) {
          setMode('sent');
          toast.success("📩 Reset link sent. Check your inbox or spam folder.");
        }
      }
    } catch (err: unknown) {
      // ✅ Handle unknown error types safely
      if (typeof err === 'object' && err !== null && 'response' in err) {
        const axiosError = err as any;
        setError(axiosError.response?.data?.detail || 'Something went wrong');
      } else {
        setError('Something went wrong');
      }
    }
  };

  if (mode === 'sent') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50 px-4">
        <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-bold text-green-700">📩 Reset Link Sent</h2>
          <p className="text-sm mt-2">Please check your email (and spam folder).</p>
          <p className="text-sm text-gray-500 mt-2">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md space-y-4">
        <h2 className="text-xl font-bold text-center">
          {mode === 'login' ? 'Login to SmartStoxVest' : mode === 'signup' ? 'Sign Up for SmartStoxVest' : 'Forgot Password'}
        </h2>

        {error && <p className="text-red-600 text-sm text-center">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border px-3 py-2 rounded focus:outline-none focus:ring"
          required
        />

        {mode !== 'forgot' && (
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring"
            required
          />
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {mode === 'login' ? 'Login' : mode === 'signup' ? 'Sign Up' : 'Send Reset Link'}
        </button>

        <p className="text-sm text-center">
          {mode === 'login' && (
            <>
              <button
                type="button"
                onClick={() => setMode('forgot')}
                className="text-blue-600 hover:underline"
              >
                Forgot password?
              </button>
              {' '}·{' '}
              Don’t have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="text-blue-600 hover:underline"
              >
                Sign Up
              </button>
            </>
          )}

          {mode === 'signup' && (
            <>Already have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-blue-600 hover:underline"
              >
                Login
              </button>
            </>
          )}

          {mode === 'forgot' && (
            <>Back to{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-blue-600 hover:underline"
              >
                Login
              </button>
            </>
          )}
        </p>
		{/* Divider */}
<div className="relative my-2">
  <div className="absolute inset-0 flex items-center">
    <div className="w-full border-t border-gray-300" />
  </div>
  <div className="relative flex justify-center text-sm">
    <span className="bg-white px-2 text-gray-500">or</span>
  </div>
</div>

{/* Google Login */}
<div className="flex justify-center">
  <GoogleLogin
    onSuccess={async (credentialResponse: CredentialResponse) => {
  try {
    const res = await fetch("http://localhost:8000/auth/google/callback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        credential: credentialResponse.credential, // THIS is what your backend needs
      }),
    });

    const data = await res.json();
    if (data.token) {
      localStorage.setItem("token", data.token);
      setUser({ email: data.email });
      navigate("/app");
    } else {
      toast.error("Google login failed.");
    }
  } catch (err) {
    console.error("Google login error:", err);
    toast.error("Something went wrong with Google login.");
  }
}}

    onError={() => {
      toast.error("Google login failed.");
    }}
  />
</div>

      </form>
    </div>
  );
};

export default AuthUI;
