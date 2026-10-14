"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function Navbar() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  async function handleLogout() {
    const result = await authClient.signOut();

    if (!result.error) {
      router.push("/login");
      router.refresh();
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
        <Link
          href="/"
          className="shrink-0 text-2xl font-bold text-green-700"
        >
          BazarDor
        </Link>

        <div className="flex items-center gap-3 sm:gap-5">
          <Link
            href="/"
            className="text-sm font-medium text-gray-700 transition hover:text-green-700"
          >
            Home
          </Link>

          {isPending ? (
            <span className="text-sm text-gray-500">Loading...</span>
          ) : session ? (
            <>
              <Link
                href="/account"
                className="max-w-32 truncate text-sm font-medium text-gray-700 transition hover:text-green-700 sm:max-w-none"
                title={session.user.name || session.user.email}
              >
                {session.user.name || "My Account"}
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 sm:px-4"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-gray-700 transition hover:text-green-700"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="rounded-lg bg-green-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-green-700 sm:px-4"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}