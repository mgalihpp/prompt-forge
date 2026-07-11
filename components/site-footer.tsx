import { Brand } from "@/components/brand";

// Link columns — themed to Prompt Forge.
const COLUMNS = [
  {
    title: "Product",
    links: ["Overview", "Build", "Refine", "Library", "Pricing", "Security"],
  },
  {
    title: "Solutions",
    links: [
      "Startups",
      "Non-profits",
      "Enterprise",
      "Agency",
      "Teams",
      "Templates",
    ],
  },
  {
    title: "Company",
    links: ["About Us", "Careers", "Support", "Contact Us", "Blog", "Partners"],
  },
  {
    title: "Resources",
    links: [
      "Docs",
      "Case Studies",
      "Prompt Labs",
      "News",
      "Community",
      "Changelog",
    ],
  },
];

// Inline brand SVGs (lucide has no brand icons in this version, avoids a new dep).
const SOCIALS = [
  {
    label: "Slack",
    path: "M6 15a2 2 0 1 1-2-2h2v2Zm1 0a2 2 0 0 1 4 0v5a2 2 0 0 1-4 0v-5Zm2-8a2 2 0 1 1 2-2v2H9Zm0 1a2 2 0 0 1 0 4H4a2 2 0 0 1 0-4h5Zm8 2a2 2 0 1 1 2 2h-2V10Zm-1 0a2 2 0 0 1-4 0V5a2 2 0 0 1 4 0v5Zm-2 8a2 2 0 1 1-2 2v-2h2Zm0-1a2 2 0 0 1 0-4h5a2 2 0 0 1 0 4h-5Z",
  },
  {
    label: "X",
    path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z",
  },
  {
    label: "LinkedIn",
    path: "M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.44-2.13 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0Z",
  },
  {
    label: "GitHub",
    path: "M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.34-5.47-5.95 0-1.32.47-2.39 1.24-3.23-.12-.31-.54-1.53.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.87.12 3.18.77.84 1.24 1.91 1.24 3.23 0 4.62-2.81 5.64-5.49 5.94.43.37.82 1.1.82 2.22v3.29c0 .32.22.7.83.58A12 12 0 0 0 24 12.5C24 5.87 18.63.5 12 .5Z",
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      {/* Column grid — stacks on mobile, 2-up on tablet, 5-up on desktop */}
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-x-8 gap-y-10 px-4 py-14 md:grid-cols-3 lg:grid-cols-5">
        {/* Brand column spans full width on small screens */}
        <div className="col-span-2 md:col-span-3 lg:col-span-1 lg:pr-6">
          <Brand />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Build, refine, and ship reliable AI prompts with a complete
            workspace designed for modern product teams.
          </p>
          <ul className="mt-6 flex items-center gap-2.5">
            {SOCIALS.map(({ label, path }) => (
              <li key={label}>
                <a
                  href={`#${label.toLowerCase()}`}
                  className="grid size-9 place-items-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="size-4"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d={path} />
                  </svg>
                  <span className="sr-only">{label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Link columns */}
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h3 className="text-sm font-semibold text-foreground">
              {col.title}
            </h3>
            <ul className="mt-4 space-y-3">
              {col.links.map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border bg-muted/40">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-5 text-sm text-muted-foreground sm:flex-row">
          <nav className="flex items-center gap-6">
            <a
              href="#style-guide"
              className="transition-colors hover:text-foreground"
            >
              Style Guide
            </a>
            <a
              href="#changelog"
              className="transition-colors hover:text-foreground"
            >
              Changelog
            </a>
            <a
              href="#licensing"
              className="transition-colors hover:text-foreground"
            >
              Licensing
            </a>
          </nav>
          <p>© 2026 Prompt Forge. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
