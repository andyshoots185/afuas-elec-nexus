import React from "react";
import { NavLink } from "react-router-dom";

/*
  Compact BottomNavMobile:
  - Smaller overall height (~52px) with slightly reduced icon size
  - Each item keeps a minimum touch target (~44px)
  - Icons scale proportionally (em-based sizing)
  - Visible only on mobile (hidden md+)
  - Accessible roles/labels and focus styles
*/

const items = [
  { to: "/", label: "Home", svg: (size = "1em") => (
      <svg viewBox="0 0 24 24" fill="none" width={size} height={size} aria-hidden>
        <path d="M3 11.5 12 4l9 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M5 12v7a1 1 0 0 0 1 1h3v-5h6v5h3a1 1 0 0 0 1-1v-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  { to: "/shop", label: "Shop", svg: (size = "1em") => (
      <svg viewBox="0 0 24 24" fill="none" width={size} height={size} aria-hidden>
        <path d="M3 7h18v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16 3a2 2 0 0 0-4 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  { to: "/cart", label: "Cart", svg: (size = "1em") => (
      <svg viewBox="0 0 24 24" fill="none" width={size} height={size} aria-hidden>
        <path d="M3 3h2l.4 2M7 13h10l3-8H6.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="10" cy="20" r="1" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="18" cy="20" r="1" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    )
  },
  { to: "/wishlist", label: "Wishlist", svg: (size = "1em") => (
      <svg viewBox="0 0 24 24" fill="none" width={size} height={size} aria-hidden>
        <path d="M20.8 7.2a4.8 4.8 0 0 0-6.8 0L12 9.2l-2-2a4.8 4.8 0 1 0-6.8 6.8L12 22l9-8.1a4.8 4.8 0 0 0-.2-6.7z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  { to: "/profile", label: "Profile", svg: (size = "1em") => (
      <svg viewBox="0 0 24 24" fill="none" width={size} height={size} aria-hidden>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
];

export default function BottomNavMobile(): JSX.Element {
  return (
    <nav
      role="navigation"
      aria-label="Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50"
    >
      <div
        // Compact container: slightly reduced height but roomy enough for touch.
        className="mx-auto max-w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur border-t border-slate-200/60 dark:border-slate-700/60 shadow-[0_-6px_18px_rgba(2,6,23,0.08)]"
        style={{ padding: "6px 8px" }}
      >
        <ul className="flex justify-between items-center gap-1">
          {items.map((item) => (
            <li key={item.to} className="flex-1">
              <NavLink
                to={item.to}
                aria-label={item.label}
                className={({ isActive }) =>
                  [
                    "group flex flex-col items-center justify-center rounded-lg",
                    // Ensures minimum tap target of ~44px while keeping compact feel
                    "min-h-[44px] px-2 py-1",
                    "text-slate-600 dark:text-slate-300",
                    "active:translate-y-[0.5px]",
                    isActive ? "text-primary-600 dark:text-primary-400" : "hover:text-slate-800 dark:hover:text-slate-100"
                  ].join(" ")
                }
              >
                <span
                  // Icon sizing: em-based for proportional scaling; default ~20px
                  className="inline-flex items-center justify-center"
                  style={{ fontSize: "1.05rem", lineHeight: 0 }}
                >
                  {item.svg("1.2em")}
                </span>

                <span
                  // Compact label - readable but small
                  className="mt-0.5 text-[11px] leading-tight"
                >
                  {item.label}
                </span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
