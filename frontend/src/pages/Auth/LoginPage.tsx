import React from "react";
import LandingHeader from "../Landing/components/LandingHeader";
import BrandPanel from "./components/BrandPanel";
import SignInPanel from "./components/SignInPanel";
import LandingFooter from "../Landing/components/LandingFooter";

export type LoginPageProps = {
  onLogin: (email: string, password: string, remember?: boolean) => Promise<void>;
  onSignUpClick: () => void;
};

const LoginPage = ({ onLogin, onSignUpClick }: LoginPageProps) => {
  return (
    <div className="min-h-screen bg-[rgb(8_27_46)] text-white">
      <div className="flex min-h-screen flex-col">
        <LandingHeader />

        <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto grid w-full max-w-6xl items-center gap-8 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-md sm:p-8 lg:grid-cols-2 lg:gap-12 lg:p-10">
            
            {/* Left side branding section */}
            <section className="hidden items-center justify-center lg:flex">
              <div className="w-full max-w-lg">
                <BrandPanel />
              </div>
            </section>

            {/* Right side login form section */}
            <section className="flex items-center justify-center">
              <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-950/30 p-6 shadow-xl sm:p-8">
                <SignInPanel
                  onLogin={onLogin}
                  onSignUpClick={onSignUpClick}
                />
              </div>
            </section>

          </div>
        </main>

        <LandingFooter />
      </div>
    </div>
  );
};

export default LoginPage;