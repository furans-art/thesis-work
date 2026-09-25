import type { ReactNode } from "react";

interface PageShellProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function PageShell({ eyebrow, title, subtitle, children }: PageShellProps) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 md:py-14">
      <header className="max-w-3xl">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">{eyebrow}</p>
        ) : null}
        <h1 className="mt-2 text-3xl font-semibold md:text-4xl">{title}</h1>
        {subtitle ? <p className="mt-3 text-base text-muted-foreground">{subtitle}</p> : null}
      </header>
      <div className="mt-10">{children}</div>
    </div>
  );
}
