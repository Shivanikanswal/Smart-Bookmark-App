"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabse";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        router.push("/dashboard");
      }
    };

    checkSession();
  }, [router]);

  const signIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/dashboard`,
      },
    });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-6">
      {/* Background Glow Effects */}
      <div className="absolute w-72 h-72 bg-blue-500/30 rounded-full blur-3xl top-20 left-20"></div>
      <div className="absolute w-72 h-72 bg-purple-500/30 rounded-full blur-3xl bottom-20 right-20"></div>

      {/* Card */}
      <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-10 max-w-md w-full text-white">
        {/* Logo / Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            🔖 Bookmark Manager
          </h1>
          <p className="text-gray-400 text-sm">
            Save and manage your favorite links securely
          </p>
        </div>

        {/* Google Button */}
        <button
          onClick={signIn}
          className="w-full flex items-center justify-center gap-3 bg-white text-black py-3 rounded-xl font-medium hover:bg-gray-200 transition duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            className="w-5 h-5"
          >
            <path
              fill="#FFC107"
              d="M43.6 20.5H42V20H24v8h11.3C33.6 32.1 29.2 35 24 35c-6.1 0-11-4.9-11-11S17.9 13 24 13c2.7 0 5.1 1 7 2.6l5.7-5.7C33.2 6.7 28.8 5 24 5 12.4 5 3 14.4 3 26s9.4 21 21 21 21-9.4 21-21c0-1.5-.2-3-.4-4.5z"
            />
            <path
              fill="#FF3D00"
              d="M6.3 14.7l6.6 4.8C14.6 16 18.9 13 24 13c2.7 0 5.1 1 7 2.6l5.7-5.7C33.2 6.7 28.8 5 24 5c-7.6 0-14.1 4.3-17.7 9.7z"
            />
            <path
              fill="#4CAF50"
              d="M24 47c5.2 0 9.6-1.7 12.8-4.6l-5.9-4.8C29.1 39.1 26.7 40 24 40c-5.1 0-9.5-2.9-11.3-7.1l-6.6 5.1C9.9 42.7 16.4 47 24 47z"
            />
            <path
              fill="#1976D2"
              d="M43.6 20.5H42V20H24v8h11.3c-1 2.9-3 5.3-5.6 6.8l5.9 4.8C39.9 35.9 43 31.3 43 26c0-1.5-.2-3-.4-4.5z"
            />
          </svg>
          Continue with Google
        </button>

        {/* Footer */}
        <p className="text-xs text-gray-500 text-center mt-6">
          Secure login powered by Supabase
        </p>
      </div>
    </div>
  );
}
