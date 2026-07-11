"use client";

import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { UserButton } from "@/components/auth/user-button";
import { Brand } from "@/components/brand";
import { Button } from "@/components/ui/button";

const NAV_LINKS = ["Product", "Templates", "Docs", "Resources", "Pricing"];

export function SiteHeader() {
  const { isSignedIn } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5">
        <Brand showVersion />

        {/* Center links — hidden below tablet */}
        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link}>
              <a
                href={`#${link.toLowerCase()}`}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link}
              </a>
            </li>
          ))}
        </ul>

        {/* Auth-aware CTA */}
        <div className="flex items-center gap-2">
          {isSignedIn ? (
            <>
              <Link href="/chat" className="hidden sm:block">
                <Button variant="ghost">Chat</Button>
              </Link>
              <UserButton />
            </>
          ) : (
            <>
              <Link href="/sign-in" className="hidden sm:block">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/sign-up">
                <Button variant="glossy">Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
