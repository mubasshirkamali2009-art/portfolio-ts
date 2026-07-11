// components/Navbar.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Avatar } from "@heroui/react";
import {
  ChevronDown,
  LogOut,
  PlusCircle,
  LayoutList,
  Menu,
  X,
} from "lucide-react";

type SessionUser = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role?: "admin" | "user";
};

function getInitials(name?: string | null, email?: string | null): string {
  const source = name?.trim() || email?.trim() || "U";
  return source
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const user = session?.user as SessionUser | undefined;
  const isAdmin = user?.role === "admin";
  const initials = getInitials(user?.name, user?.email);

  // Treat the session as "still pending" until the component has mounted on
  // the client, so the very first client render matches the server render.
  // This avoids hydration mismatches when the session resolves faster than
  // React can hydrate (e.g. from a cached cookie/localStorage read).
  const showLoading = !mounted || isPending;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileOpen((prev) => (prev ? false : prev));
    setDropdownOpen((prev) => (prev ? false : prev));
  }, [pathname]);

  async function handleLogout() {
    await authClient.signOut();
    setDropdownOpen(false);
    router.push("/");
    router.refresh();
  }

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/projects", label: "Projects" },
    { href: "/about", label: "About" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="text-base font-semibold text-neutral-100 transition-colors hover:text-indigo-300">
          Portfolio
        </Link>

        <div className="hidden items-center gap-6 text-sm text-neutral-400 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-colors hover:text-neutral-100 ${
                pathname === link.href ? "text-neutral-100" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* only admins see these in the top nav */}
          {!showLoading && isAdmin && (
            <>
              <Link
                href="/projects/add"
                className={`transition-colors hover:text-neutral-100 ${
                  pathname === "/projects/add" ? "text-neutral-100" : ""
                }`}
              >
                Add Project
              </Link>
              <Link
                href="/projects/manage"
                className={`transition-colors hover:text-neutral-100 ${
                  pathname === "/projects/manage" ? "text-neutral-100" : ""
                }`}
              >
                Manage Projects
              </Link>
            </>
          )}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {showLoading ? (
            <div className="h-8 w-8 animate-pulse rounded-full bg-neutral-800" />
          ) : user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((o) => !o)}
                className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-all duration-200 hover:bg-neutral-900"
              >
                <Avatar className="size-8 ring-2 ring-neutral-800">
                  {user.image && <Avatar.Image src={user.image} alt={user.name ?? "User"} />}
                  <Avatar.Fallback>{initials}</Avatar.Fallback>
                </Avatar>
                <span className="max-w-[100px] truncate text-sm text-neutral-200">
                  {user.name}
                </span>
                <ChevronDown
                  className={`h-3.5 w-3.5 text-neutral-500 transition-transform duration-200 ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 origin-top-right animate-dropdown rounded-xl border border-neutral-800 bg-neutral-900/95 p-1.5 shadow-2xl backdrop-blur-xl">
                  <div className="flex items-center gap-2 px-2.5 py-2">
                    <Avatar className="size-8">
                      {user.image && <Avatar.Image src={user.image} alt={user.name ?? "User"} />}
                      <Avatar.Fallback>{initials}</Avatar.Fallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-neutral-100">
                        {user.name}
                      </p>
                      <p className="truncate text-xs text-neutral-500">{user.email}</p>
                    </div>
                  </div>

                  {/* dropdown already correctly gated to admin only */}
                  {isAdmin && (
                    <>
                      <div className="my-1 h-px bg-neutral-800" />
                      <Link
                        href="/projects/add"
                        className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-neutral-300 transition-colors hover:bg-neutral-800 hover:text-indigo-300"
                      >
                        <PlusCircle className="h-4 w-4" />
                        Add Project
                      </Link>
                      <Link
                        href="/projects/manage"
                        className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-neutral-300 transition-colors hover:bg-neutral-800 hover:text-indigo-300"
                      >
                        <LayoutList className="h-4 w-4" />
                        Manage Projects
                      </Link>
                    </>
                  )}

                  <div className="my-1 h-px bg-neutral-800" />
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/10"
                  >
                    <LogOut className="h-4 w-4" />
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-lg px-3 py-1.5 text-sm text-neutral-300 transition-colors hover:text-neutral-100"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500 px-3.5 py-1.5 text-sm font-medium text-white transition-all duration-200 hover:from-indigo-500 hover:to-indigo-400 hover:shadow-lg hover:shadow-indigo-600/30"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        <button
          onClick={() => setMobileOpen((o) => !o)}
          className="rounded-lg p-2 text-neutral-300 transition-colors hover:bg-neutral-900 md:hidden"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-neutral-800 bg-neutral-950 px-4 py-4 md:hidden">
          <div className="flex flex-col gap-1 text-sm">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2.5 text-neutral-300 transition-colors hover:bg-neutral-900 hover:text-neutral-100"
              >
                {link.label}
              </Link>
            ))}

            {/* only admins see these in mobile menu */}
            {!showLoading && isAdmin && (
              <>
                <Link
                  href="/projects/add"
                  className="rounded-lg px-3 py-2.5 text-neutral-300 transition-colors hover:bg-neutral-900 hover:text-neutral-100"
                >
                  Add Project
                </Link>
                <Link
                  href="/projects/manage"
                  className="rounded-lg px-3 py-2.5 text-neutral-300 transition-colors hover:bg-neutral-900 hover:text-neutral-100"
                >
                  Manage Projects
                </Link>
              </>
            )}
          </div>

          <div className="mt-3 border-t border-neutral-800 pt-3">
            {showLoading ? (
              <div className="h-8 w-full animate-pulse rounded-lg bg-neutral-900" />
            ) : user ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 px-3 py-2">
                  <Avatar className="size-8">
                    {user.image && <Avatar.Image src={user.image} alt={user.name ?? "User"} />}
                    <Avatar.Fallback>{initials}</Avatar.Fallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-neutral-100">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-neutral-500">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-red-400 transition-colors hover:bg-red-500/10"
                >
                  <LogOut className="h-4 w-4" />
                  Log out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/login"
                  className="rounded-lg px-3 py-2.5 text-center text-sm text-neutral-300 transition-colors hover:bg-neutral-900 hover:text-neutral-100"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500 px-3.5 py-2.5 text-center text-sm font-medium text-white transition-all duration-200 hover:from-indigo-500 hover:to-indigo-400"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}