import React from "react";
import "../Landing/LandingPage.css";
import "./LoginPage.css";
import LandingHeader from "../Landing/components/LandingHeader";
import BrandPanel from "./components/BrandPanel";
import SignInPanel from "./components/SignInPanel";
import LandingFooter from "../Landing/components/LandingFooter";

export type LoginPageProps = {
  onLogin: (
    email: string,
    password: string,
    remember?: boolean
  ) => Promise<void>;
  onSignUpClick: () => void;
};

const LoginPage = ({
  onLogin,
  onSignUpClick,
}: LoginPageProps) => {
  return (
      <div className="min-h-screen flex flex-col bg-white text-slate-900">
        <LandingHeader />

<main className="flex flex-1 flex-col lg:flex-row items-center justify-center gap-8 px-6 py-10 text-slate-900 [&_*]:text-slate-900">
          <BrandPanel />

        <SignInPanel
          onLogin={onLogin}
          onSignUpClick={onSignUpClick}
        />
      </main>

      <LandingFooter />
    </div>
  );
};

export default LoginPage;