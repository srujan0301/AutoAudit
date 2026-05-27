import React, { useState } from "react";
import LandingHeader from "../Landing/components/LandingHeader";
import LandingFooter from "../Landing/components/LandingFooter";
import SignupBrandPanel from "./components/SignupBrandPanel";
import SignupFormPanel from "./components/SignupFormPanel";
import type { SignUpFormData, SignUpSubmitPayload } from "./signUpTypes";

export type { SignUpFormData, SignUpSubmitPayload } from "./signUpTypes";

const emptyForm: SignUpFormData = {
  firstName: "",
  lastName: "",
  email: "",
  organizationName: "",
  password: "",
  confirmPassword: "",
};

export type SignUpPageProps = {
  onSignUp: (payload: SignUpSubmitPayload) => Promise<void>;
  onBackToLogin: () => void;
};

export default function SignUpPage({
  onSignUp,
  onBackToLogin,
}: SignUpPageProps) {
  const [formData, setFormData] = useState<SignUpFormData>(emptyForm);
  const [submitError, setSubmitError] = useState("");

  const handleFormChange = (field: keyof SignUpFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (submitError) setSubmitError("");
  };

  const getSubmitErrorMessage = (error: unknown): string => {
    const message =
      error instanceof Error ? error.message : "Sign up failed. Please try again.";

    if (message === "REGISTER_USER_ALREADY_EXISTS") {
      return "An account with this email already exists.";
    }

    return message;
  };

  const handleFormSubmit = async (payload: SignUpSubmitPayload) => {
    setSubmitError("");

    try {
      await onSignUp(payload);
      setFormData(emptyForm);
    } catch (error) {
      setSubmitError(getSubmitErrorMessage(error));
    }
  };

  return (
    <div className="min-h-screen bg-[rgb(8_27_46)] text-white">
      <div className="flex min-h-screen flex-col">
        <LandingHeader />

        <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto grid w-full max-w-6xl items-center gap-8 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-md sm:p-8 lg:grid-cols-2 lg:gap-12 lg:p-10">
            
            {/* Left side branding section */}
            <section className="hidden items-center justify-center lg:flex">
              <div className="w-full max-w-lg">
                <SignupBrandPanel />
              </div>
            </section>

            {/* Right side signup form section */}
            <section className="flex items-center justify-center">
              <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-950/30 p-6 shadow-xl sm:p-8">
                <SignupFormPanel
                  formData={formData}
                  onFormChange={handleFormChange}
                  onSubmit={handleFormSubmit}
                  onBackToLogin={onBackToLogin}
                  submitError={submitError}
                />
              </div>
            </section>

          </div>
        </main>

        <LandingFooter />
      </div>
    </div>
  );
}