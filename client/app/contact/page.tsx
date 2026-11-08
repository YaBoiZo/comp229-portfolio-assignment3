import { ContactForm } from "@/components/contact-form";
import { PageIntro } from "@/components/page-intro";
import { portfolioOwner } from "@/lib/portfolio-data";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <main>
      <PageIntro
        eyebrow="Contact"
        title="Have a project or opportunity in mind?"
        description="Share a few details below and I’ll get back to you."
      />
      <section className="contact-layout">
        <aside className="contact-panel">
          <p className="eyebrow">Contact details</p>
          <h2>Let&apos;s make something useful.</h2>
          <a href={`mailto:${portfolioOwner.email}`}>{portfolioOwner.email}</a>
          <p>{portfolioOwner.location}</p>
        </aside>
        <ContactForm />
      </section>
    </main>
  );
}
