// components/Footer.tsx
import Link from "next/link";
import { Mail } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa6";

export default function Footer() {
  const year = new Date().getFullYear();

  const exploreLinks = [
    { href: "/", label: "Home" },
    { href: "/projects", label: "Projects" },
    { href: "/about", label: "About" },
  ];

  const legalLinks = [
    { href: "/contact", label: "Contact" },
    { href: "/privacy", label: "Privacy" },
  ];

  const socials = [
    {
      href: "https://github.com/mubasshirkamali2009-art",
      label: "GitHub",
      icon: <FaGithub className="h-4 w-4" />,
    },
    {
      href: "https://www.linkedin.com/in/mubasshir-rohman",
      label: "LinkedIn",
      icon: <FaLinkedin className="h-4 w-4" />,
    },
    
  ];

  return (
    <footer className="border-t border-neutral-800 bg-neutral-950">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              href="/"
              className="text-base font-semibold text-neutral-100 transition-colors hover:text-indigo-300"
            >
              Portfolio
            </Link>
            <p className="mt-2 max-w-xs text-sm text-neutral-500">
              Building clean, production-ready web applications with modern tools.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Explore
            </h3>
            <ul className="mt-3 space-y-2">
              {exploreLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-500 transition-colors hover:text-indigo-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal / Contact */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Support
            </h3>
            <ul className="mt-3 space-y-2">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-500 transition-colors hover:text-indigo-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Connect
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {socials.map(({ href, label, icon }) => (
                <Link
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-400 transition-all duration-200 hover:border-indigo-500/40 hover:text-indigo-300 hover:scale-105 active:scale-95"
                >
                  {icon}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col items-center gap-3 border-t border-neutral-800 pt-6 text-xs text-neutral-600 sm:mt-10 sm:flex-row sm:justify-between sm:pt-8">
          <p>© {year} Portfolio. All rights reserved.</p>
          <p className="text-neutral-700">
            Built with Next.js, TypeScript &amp; Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}