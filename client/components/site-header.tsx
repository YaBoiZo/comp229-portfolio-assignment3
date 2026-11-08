/* eslint-disable @next/next/no-html-link-for-pages -- Full-page links are required for reliable navigation on the course deployment target. */
import { AuthLinks } from "./auth-links";
import Image from "next/image";
import { navigationItems, portfolioOwner } from "@/lib/portfolio-data";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <a className="brand" href="/" aria-label="Portfolio home">
          <Image
            className="brand__mark"
            src="/logo-mark.svg"
            alt=""
            width="52"
            height="52"
            aria-hidden="true"
          />
          <span className="brand__text">
            <strong>{portfolioOwner.name}</strong>
            <small>
              Web Development <span aria-hidden="true">·</span> AI
            </small>
          </span>
        </a>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {navigationItems.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
          <AuthLinks />
        </nav>

        <details className="mobile-nav">
          <summary aria-label="Open navigation">Menu</summary>
          <nav aria-label="Mobile navigation">
            {navigationItems.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
            <AuthLinks />
          </nav>
        </details>
      </div>
    </header>
  );
}
