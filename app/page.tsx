"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import {HugeiconsIcon} from "@hugeicons/react";
import { Github } from "@hugeicons/core-free-icons";
import { Shield, Lock } from "lucide-react";

function LoginContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const errorMessages: Record<string, string> = {
    no_code: "Authorization code missing from GitHub.",
    no_verifier: "PKCE verification failed. Please try again.",
    callback_failed: "Failed to exchange tokens with the backend.",
    internal_error: "An unexpected error occurred during login.",
    session_expired: "Your session has expired. Please sign in again.",
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
      <div className="w-full max-w-sm space-y-12">
        <div className="text-center space-y-3">
          <div className="mx-auto h-12 w-12 rounded-xl bg-accent flex items-center justify-center text-white font-bold text-2xl shadow-lg">
            I
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
              Insighta Labs+
            </h1>
            <p className="text-sm text-text-secondary">
              Professional Intelligence Platform
            </p>
          </div>
        </div>

        <div className="card space-y-6 p-8!">
          {error && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4 text-center">
              <p className="text-xs text-red-400 font-medium leading-relaxed">
                {errorMessages[error] || "Authentication failed. Please try again."}
              </p>
            </div>
          )}

          <a
            href="/api/auth/login"
            className="flex w-full items-center justify-center gap-3 rounded-lg bg-text-primary px-4 py-3 text-sm font-bold text-background transition-all hover:bg-accent active:scale-[0.98] shadow-sm"
          >
            <HugeiconsIcon icon={Github} size={20} />
            Continue with GitHub
          </a>

          <div className="pt-2 space-y-3">
            <p className="text-[10px] text-center text-text-muted uppercase tracking-widest font-bold flex items-center justify-center gap-1.5">
              <Lock size={10} />
              Secured by GitHub OAuth with PKCE
            </p>
            <div className="flex items-center justify-center gap-4 text-[9px] text-text-muted uppercase tracking-widest">
              <span className="flex items-center gap-1"><Shield size={8} /> RBAC Enforced</span>
              <span>HttpOnly Cookies</span>
              <span>CSRF Protected</span>
            </div>
          </div>
        </div>

        <footer className="text-center space-y-4">
          <p className="text-xs text-text-muted max-w-xs mx-auto leading-relaxed">
            By signing in, you agree to our Terms of Service and Privacy Policy. Access is restricted to authorized personnel.
          </p>
        </footer>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
