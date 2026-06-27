import { useState } from "react";
import { NavLink, Link } from "react-router-dom";

const navLinks = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/alerts", label: "Alerts" },
  { to: "/about", label: "About" },
];

const linkClass = ({ isActive }) =>
  `transition-colors font-medium ${isActive
    ? "text-blue-400"
    : "text-[#9CA3AF] hover:text-[#F9FAFB]"
  }`;

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="relative z-50 bg-transparent border-none">
      {/* bg-transparent ensures it perfectly matches your space background image */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* justify-between will now elegantly push the logo left and the links right */}
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link
            to="/"
            className="text-[#F9FAFB] text-xl font-bold tracking-tight flex items-center shrink-0"
          >
            <span>AstroSentinel</span>
          </Link>

          {/* Center/Right nav – desktop */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to} className={linkClass}>
                {link.label}
              </NavLink>
            ))}
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
        <div className="md:hidden bg-[#0B0F1A]/90 backdrop-blur-md px-4 pb-4 pt-2 space-y-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `block py-2 px-3 rounded-lg transition-colors font-medium ${isActive
                  ? "text-blue-400 bg-blue-500/10"
                  : "text-[#9CA3AF] hover:text-[#F9FAFB] hover:bg-[#1F2937]"
                }`
              }
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
}