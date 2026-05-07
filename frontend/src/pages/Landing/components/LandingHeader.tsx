import React, { useState } from "react";
import { Link } from "react-router-dom";

const navLinks = [
  { label: "Home", href: "/#main-content" },
  { label: "Features", href: "/#features" },
  { label: "Benefits", href: "/#benefits" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

type LandingHeaderProps = {
  onSignInClick?: () => void;
  hiddenLinks?: string[];
  showSignIn?: boolean;
};

const LandingHeader = ({
  onSignInClick,
  hiddenLinks = [],
  showSignIn = true,
}: LandingHeaderProps) => {
  const hiddenLinkSet = new Set(hiddenLinks.map((l) => l.toLowerCase()));
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* HEADER */}
      <header className="flex items-center justify-between px-6 py-4 relative z-50">

        {/* Hamburger (mobile only*/}
        <div className="flex items-center gap-3">

          <button
            className={`md:hidden text-white text-2xl ${isOpen ? "hidden" : "block"}`}
            onClick={() => setIsOpen(true)}
          >
            ☰
          </button>

          {/* Logo */}
          <Link to="/#main-content">
            <img src="/AutoAudit.png" alt="AutoAudit" className="h-8" />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6 text-white">
          {navLinks
            .filter((link) => !hiddenLinkSet.has(link.label.toLowerCase()))
            .map((link) => (
              <Link key={link.label} to={link.href}>
                {link.label}
              </Link>
            ))}

          {showSignIn && (
            <button className="btn-primary" onClick={onSignInClick}>
              Sign In
            </button>
          )}
        </div>
      </header>

      {/* MOBILE SIDEBAR */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex">

          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setIsOpen(false)}
          />

          {/* Sidebar */}
          <div className="relative w-64 bg-slate-900 h-full p-6 z-50 shadow-lg transform transition-transform duration-300">

            {/* Close button */}
            <button
              className="text-white text-2xl absolute top-4 right-4"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>

            {/* Links */}
            <nav className="flex flex-col gap-4 text-white mt-12">
              {navLinks.map((link) => (
                <Link key={link.label} to={link.href}>
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default LandingHeader;