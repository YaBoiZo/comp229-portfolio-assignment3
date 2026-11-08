import Image from "next/image";
import { PageIntro } from "@/components/page-intro";
import { portfolioOwner } from "@/lib/portfolio-data";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <main>
      <PageIntro
        eyebrow="About me"
        title="Building a new career through curiosity and code."
        description={`${portfolioOwner.role} based in ${portfolioOwner.location}.`}
      />
      <section className="split-panel">
        <div className="portrait-frame">
          <Image
            src="/assets/zohaib-syed-headshot.png"
            alt="Professional headshot of Zohaib Syed"
            fill
            priority
            sizes="(max-width: 820px) 100vw, 40vw"
          />
        </div>
        <div className="prose-card">
          {portfolioOwner.biography.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <div className="button-row">
            <a
              className="button button--primary"
              href="/assets/zohaib-syed-resume.pdf"
              download="Zohaib-Syed-Resume.pdf"
            >
              Download résumé (PDF)
            </a>
            <a className="button button--secondary" href="/contact">
              Contact me
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
