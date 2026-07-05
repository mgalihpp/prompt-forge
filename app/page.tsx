"use client";

import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { UserButton } from "@/components/auth/user-button";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { isSignedIn } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <header className="border-b border-slate-700">
        <nav className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Prompt Forge</h1>
          <div className="flex items-center gap-4">
            {isSignedIn ? (
              <>
                <Link href="/dashboard">
                  <Button
                    variant="ghost"
                    className="text-white hover:bg-slate-700"
                  >
                    Dashboard
                  </Button>
                </Link>
                <UserButton />
              </>
            ) : (
              <>
                <Link href="/sign-in">
                  <Button variant="outline">Sign In</Button>
                </Link>
                <Link href="/sign-up">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Build Powerful AI Prompts
          </h2>
          <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
            Create, manage, and organize your AI prompts with Prompt Forge.
            Collaborate with your team and scale your AI applications.
          </p>

          {isSignedIn ? (
            <Link href="/dashboard">
              <Button size="lg">Go to Dashboard</Button>
            </Link>
          ) : (
            <div className="flex gap-4 justify-center">
              <Link href="/sign-up">
                <Button size="lg">Get Started</Button>
              </Link>
              <Link href="/sign-in">
                <Button size="lg" variant="outline">
                  Sign In
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
