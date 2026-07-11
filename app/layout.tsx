import "@/lib/orpc/server"; // sets globalThis.$client for SSR/pre-render
import { ClerkProvider } from "@clerk/nextjs";
import { Agentation } from "agentation";
import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const geistSans = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Prompt Forge",
  description: "Build and manage AI prompts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ClerkProvider afterSignOutUrl={"/"}>
          <Providers>{children}</Providers>
        </ClerkProvider>
        {process.env.NODE_ENV === "development" && <Agentation />}
      </body>
    </html>
  );
}
