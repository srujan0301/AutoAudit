import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, Loader2 } from "lucide-react";

import "../Landing/LandingPage.css";

import LoginHeader from "./components/LoginHeader";
import BrandPanel from "./components/BrandPanel";
import LandingFooter from "../Landing/components/LandingFooter";
import { useAuth } from "../../context/AuthContext";

const CALLBACK_CACHE_KEY = "autoaudit.oauth.google.callback.params";

type OAuthCallbackPayload = {
  access_token?: string | null;
  token_type?: string | null;
  error?: string | null;
  error_description?: string | null;
};

function safeJsonParse(value: string | null): unknown {
  if (!value) return null;
  try {
    return JSON.parse(value) as unknown;
  } catch {
    return null;
  }
}

function readCachedCallbackParams(): OAuthCallbackPayload | null {
  if (typeof window === "undefined") return null;
  try {
    const parsed = safeJsonParse(window.sessionStorage.getItem(CALLBACK_CACHE_KEY));
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as OAuthCallbackPayload;
    }
    return null;
  } catch {
    return null;
  }
}

function writeCachedCallbackParams(payload: OAuthCallbackPayload): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(CALLBACK_CACHE_KEY, JSON.stringify(payload));
  } catch {
    // best-effort
  }
}

function clearCachedCallbackParams(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(CALLBACK_CACHE_KEY);
  } catch {
    // best-effort
  }
}

function getOAuthParams(): URLSearchParams {
  const rawHash = typeof window !== "undefined" ? window.location.hash : "";
  const hash = rawHash.startsWith("#") ? rawHash.slice(1) : rawHash;
  const merged = new URLSearchParams(hash);

  const rawSearch = typeof window !== "undefined" ? window.location.search : "";
  const search = rawSearch.startsWith("?") ? rawSearch.slice(1) : rawSearch;
  const searchParams = new URLSearchParams(search);

  for (const [key, value] of searchParams.entries()) {
    if (!merged.has(key)) merged.set(key, value);
  }

  return merged;
}

const GoogleCallbackPage = () => {
  const navigate = useNavigate();
  const auth = useAuth();

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function finish() {
      const params = getOAuthParams();

      const urlPayload: OAuthCallbackPayload = {
        access_token:
          params.get("access_token") ||
          params.get("token") ||
          params.get("accessToken"),
        token_type: params.get("token_type") || params.get("tokenType"),
        error: params.get("error"),
        error_description:
          params.get("error_description") || params.get("errorDescription"),
      };

      if (urlPayload.access_token || urlPayload.error) {
        writeCachedCallbackParams(urlPayload);
      }

      const cachedPayload = readCachedCallbackParams();
      const accessToken = urlPayload.access_token || cachedPayload?.access_token;
      const oauthError = urlPayload.error || cachedPayload?.error;
      const oauthErrorDescription =
        urlPayload.error_description || cachedPayload?.error_description;

      if (oauthError) {
        if (!cancelled) {
          setError(oauthErrorDescription || oauthError);
        }
        clearCachedCallbackParams();
        return;
      }

      if (!accessToken) {
        if (!cancelled) {
          setError("Missing access token. Please try signing in again.");
        }
        clearCachedCallbackParams();
        return;
      }

      try {
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch {
        // best-effort
      }

      try {
        await auth.loginWithAccessToken(accessToken, false);
        clearCachedCallbackParams();

        if (!cancelled) {
          window.location.replace("/dashboard");
        }
      } catch (err) {
        if (!cancelled) {
          const msg =
            err instanceof Error
              ? err.message
              : "Google sign-in failed. Please try again.";
          setError(msg);
        }
        clearCachedCallbackParams();
      }
    }

    void finish();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
   <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <LoginHeader />

<main className="flex flex-1 flex-col lg:flex-row items-center justify-center gap-8 px-6 py-10 text-slate-900 [&_*]:text-slate-900">        <BrandPanel />

        <section className="w-full max-w-md">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
            {error ? (
              <>
                <div className="mb-6 text-center">
                  <h2 className="text-2xl font-semibold text-slate-900">
                    Sign-in failed
                  </h2>
                  <p className="mt-2 text-sm text-slate-600">
                    We couldn’t complete Google sign-in. Please try again.
                  </p>
                </div>

                <div className="mb-4 mt-6 flex items-center gap-2 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-600">
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </div>

                <button
                  type="button"
                  className="w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400"
                  onClick={() => navigate("/login")}
                >
                  Back to sign in
                </button>
              </>
            ) : (
              <div className="mt-2 flex min-h-36 flex-col items-center justify-center gap-3 text-slate-500">
                <Loader2 size={28} className="animate-spin" />
                <p className="text-sm">Please wait while we sign you in.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
};

export default GoogleCallbackPage;