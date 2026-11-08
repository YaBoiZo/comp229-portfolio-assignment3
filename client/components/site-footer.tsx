import { portfolioOwner } from "@/lib/portfolio-data";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <p>Designed and developed by {portfolioOwner.name}.</p>
      <a href="/contact">Let&apos;s connect</a>
    </footer>
  );
}
