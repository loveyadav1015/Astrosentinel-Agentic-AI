import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import NeoAsteroidIcon from "./NeoAsteroidIcon";

const navLinks = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/alerts", label: "Alerts" },
  { to: "/about", label: "About" },
];

const linkClass = ({ isActive }) =>
  `transition-colors font-medium ${
    isActive
      ? "text-blue-400"
      : "text-[#9CA3AF] hover:text-[#F9FAFB]"
  }`;

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-[#0B0F1A] border-b border-[#1F2937]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="text-[#F9FAFB] text-xl font-bold tracking-tight flex items-center gap-2 shrink-0"
          >
            <NeoAsteroidIcon />
            <span>AstroSentinel</span>
          </Link>

          {/* Center nav – desktop */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to} className={linkClass}>
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Right side – status */}
          <div className="hidden md:flex items-center gap-2 text-sm text-[#9CA3AF]">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
            </span>
            <span>System:&nbsp;<span className="text-green-400 font-medium">Live</span></span>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-[#9CA3AF] hover:text-white hover:bg-[#1F2937] transition-colors"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#1F2937] bg-[#0B0F1A] px-4 pb-4 pt-2 space-y-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `block py-2 px-3 rounded-lg transition-colors font-medium ${
                  isActive
                    ? "text-blue-400 bg-blue-500/10"
                    : "text-[#9CA3AF] hover:text-[#F9FAFB] hover:bg-[#1F2937]"
                }`
              }
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}

          <div className="flex items-center gap-2 text-sm text-[#9CA3AF] pt-2 px-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
            </span>
            <span>System:&nbsp;<span className="text-green-400 font-medium">Live</span></span>
          </div>
        </div>
      )}
    </nav>
  );
}
