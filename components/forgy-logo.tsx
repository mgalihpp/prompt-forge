import { cn } from "@/lib/utils";

/** Forgy face mark — matches the site favicon exactly. */
export function ForgyLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
      role="img"
      aria-label="Forgy"
    >
      <rect x="2" y="2" width="44" height="44" rx="12" fill="#0e1016" stroke="#14b8a6" strokeWidth="2.5" />
      <circle cx="16" cy="20" r="9" fill="#5eead4" opacity="0.15" />
      <circle cx="32" cy="20" r="9" fill="#5eead4" opacity="0.15" />
      <circle cx="16" cy="20" r="6" fill="#5eead4" />
      <circle cx="32" cy="20" r="6" fill="#5eead4" />
      <path d="M14 35 q10 5 20 0" stroke="#4A5268" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}
