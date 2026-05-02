import React, { useState } from "react";

const PASSWORD_MISMATCH_MESSAGE = "Passwords do not match.";
const TERMS_ERROR_MESSAGE = "Please accept Terms & Conditions.";

type Props = {
  formData: any;
  onFormChange: (field: string, value: string) => void;
  onSubmit: (data: any) => void;
  onBackToLogin: () => void;
  submitError: string;
};

const SignupFormPanel = ({
  formData,
  onFormChange,
  onSubmit,
  onBackToLogin,
  submitError,
}: Props) => {
  const [error, setError] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  // ✅ ONLY THIS FUNCTION UPDATED
  const validate = (): boolean => {
    if (!agreeTerms) {
      setError(TERMS_ERROR_MESSAGE);
      return false;
    }

    // ✅ NEW: password length check
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return false;
    }

    // ✅ EXISTING: password match check
    if (formData.password !== formData.confirmPassword) {
      setError(PASSWORD_MISMATCH_MESSAGE);
      return false;
    }

    if (error) setError("");
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
  };

  return (
    <section className="flex w-full items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#0d2746] p-8 rounded-3xl shadow-2xl">
        
        <h2 className="text-3xl text-white font-semibold mb-6">
          Create Account
        </h2>

        {/* ❗ ERROR MESSAGE */}
        {(error || submitError) && (
          <p className="text-sm text-red-400 mb-4" role="alert">
            {error || submitError}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            placeholder="First Name"
            value={formData.firstName}
            onChange={(e) => onFormChange("firstName", e.target.value)}
            className="w-full p-3 rounded-xl bg-[#173454] text-white"
          />

          <input
            placeholder="Last Name"
            value={formData.lastName}
            onChange={(e) => onFormChange("lastName", e.target.value)}
            className="w-full p-3 rounded-xl bg-[#173454] text-white"
          />

          <input
            placeholder="Email"
            value={formData.email}
            onChange={(e) => onFormChange("email", e.target.value)}
            className="w-full p-3 rounded-xl bg-[#173454] text-white"
          />

          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => onFormChange("password", e.target.value)}
            className="w-full p-3 rounded-xl bg-[#173454] text-white"
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={(e) => onFormChange("confirmPassword", e.target.value)}
            className="w-full p-3 rounded-xl bg-[#173454] text-white"
          />

          {/* TERMS */}
          <label className="flex items-center gap-2 text-sm text-blue-100">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
            />
            I agree to the Terms & Conditions
          </label>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-xl hover:bg-blue-600 transition"
          >
            Create Account
          </button>
        </form>

        <p className="text-center text-blue-100 mt-6 text-sm">
          Already have an account?{" "}
          <button
            onClick={onBackToLogin}
            className="text-white font-semibold hover:underline"
          >
            Sign In
          </button>
        </p>
      </div>
    </section>
  );
};

export default SignupFormPanel;