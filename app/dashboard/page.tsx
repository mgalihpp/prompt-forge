"use client";

import { useQuery } from "@tanstack/react-query";
import { UserButton } from "@/components/auth/user-button";
import { ProjectManager } from "@/components/projects/project-manager";
import { orpc } from "@/lib/orpc/client";

export default function DashboardPage() {
  // Hydrated from the server prefetch in dashboard/layout.tsx — no loading flash
  const { data: user } = useQuery(orpc.user.me.queryOptions());

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="border-b bg-white dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <UserButton />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {user && (
          <div>
            <h2 className="text-lg font-semibold">
              Welcome, {user.name || user.email}
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Manage your prompts and collaborate with your team
            </p>
          </div>
        )}

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Your Projects</h3>
          <ProjectManager />
        </div>
      </main>
    </div>
  );
}
