import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: {
    default: "Zohaib Syed | Web Developer & AI Consultant",
    template: "%s | Zohaib Syed",
  },
  description:
    "Zohaib Syed's software engineering portfolio featuring web development, AI consulting, projects, education, and services.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers><SiteHeader />
        <div className="page-shell">{children}</div>
        <SiteFooter /></Providers>
      </body>
    </html>
  );
}
