import Link from "next/link";
import type { ReactNode } from "react";

type IconName = "home" | "file" | "users" | "settings" | "plus" | "chevron" | "back" | "search" | "calendar" | "more" | "check" | "trash";

export function Icon({ name }: { name: IconName }) {
  const paths: Record<IconName, ReactNode> = {
    home: <><path d="m3 10 9-7 9 7"/><path d="M5 9v11h14V9"/><path d="M9 20v-6h6v6"/></>,
    file: <><path d="M6 2h8l4 4v16H6z"/><path d="M14 2v5h5M9 12h6M9 16h6"/></>,
    users: <><circle cx="9" cy="8" r="3"/><path d="M3 20v-2a5 5 0 0 1 5-5h2a5 5 0 0 1 5 5v2"/><circle cx="17" cy="9" r="2.5"/><path d="M16 14h1a4 4 0 0 1 4 4v1"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3A1.7 1.7 0 0 0 10 3V2.8h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z"/></>,
    plus: <path d="M12 5v14M5 12h14"/>,
    chevron: <path d="m9 5 7 7-7 7"/>,
    back: <><path d="m15 18-6-6 6-6"/><path d="M9 12h11"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></>,
    more: <><circle cx="5" cy="12" r="1" fill="currentColor"/><circle cx="12" cy="12" r="1" fill="currentColor"/><circle cx="19" cy="12" r="1" fill="currentColor"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    trash: <><path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14M10 11v6M14 11v6"/></>,
  };
  return <svg className="icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

export function AppShell({ children, bottom, className = "" }: { children: ReactNode; bottom?: ReactNode; className?: string }) {
  return <main className={`app-shell ${className}`}><div className="app-content">{children}</div>{bottom}</main>;
}

const nav = [
  { href: "/", label: "Home", icon: "home" as const, key: "home" },
  { href: "/invoices", label: "Invoices", icon: "file" as const, key: "invoices" },
  { href: "/customers", label: "Customers", icon: "users" as const, key: "customers" },
  { href: "/settings", label: "Settings", icon: "settings" as const, key: "settings" },
];

export function BottomNav({ active }: { active: string }) {
  return <nav className="bottom-nav" aria-label="Main navigation">{nav.map((item) => <Link className={active === item.key ? "active" : ""} href={item.href} key={item.key}><Icon name={item.icon}/><span>{item.label}</span></Link>)}</nav>;
}

export function TopBar({ title, back = "/", action }: { title: string; back?: string; action?: ReactNode }) {
  return <header className="top-bar"><Link href={back} aria-label="Go back"><Icon name="back" /></Link><h1>{title}</h1><div className="top-action">{action}</div></header>;
}
