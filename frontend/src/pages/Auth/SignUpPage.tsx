import React, { useState } from "react";
import LandingHeader from "../Landing/components/LandingHeader";
import LandingFooter from "../Landing/components/LandingFooter";
import SignupBrandPanel from "./components/SignupBrandPanel";
import SignupFormPanel from "./components/SignupFormPanel";
import type { SignUpFormData, SignUpSubmitPayload } from "./signUpTypes";
import "./LoginPage.css";
import "./SignUpPage.css";

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
<<<<<<< HEAD

    if (submitError) {
      setSubmitError("");
    }
=======
    if (submitError) setSubmitError("");
>>>>>>> upstream/main
  };

  const getSubmitErrorMessage = (error: unknown): string => {
    const message =
<<<<<<< HEAD
      error instanceof Error
        ? error.message
        : "Sign up failed. Please try again.";
=======
      error instanceof Error ? error.message : "Sign up failed. Please try again.";
>>>>>>> upstream/main

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
<<<<<<< HEAD
<div className="min-h-screen flex flex-col bg-white text-slate-900">
        <LandingHeader />

<main className="flex flex-1 flex-col lg:flex-row items-center justify-center gap-8 px-6 py-10 text-slate-900 [&_*]:text-slate-900">
          <SignupBrandPanel />

        <SignupFormPanel
          formData={formData}
          onFormChange={handleFormChange}
          onSubmit={handleFormSubmit}
          onBackToLogin={onBackToLogin}
          submitError={submitError}
        />
=======
    <div className="flex flex-col min-h-screen bg-[rgb(8_27_46)]">
      <LandingHeader />

      <main className="flex flex-1 justify-center items-center py-12 px-6">
        <div className="grid gap-10 w-full max-w-6xl lg:grid-cols-2">

          {/* Left side (branding) */}
          <div className="hidden justify-center items-center lg:flex">
            <SignupBrandPanel />
          </div>

          {/* Right side (form) */}
          <div className="flex justify-center items-center">
            <SignupFormPanel
              formData={formData}
              onFormChange={handleFormChange}
              onSubmit={handleFormSubmit}
              onBackToLogin={onBackToLogin}
              submitError={submitError}
            />
          </div>

        </div>
>>>>>>> upstream/main
      </main>

      <LandingFooter />
    </div>
  );
}