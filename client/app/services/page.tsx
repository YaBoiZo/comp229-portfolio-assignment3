import { Bot, LayoutTemplate, Workflow } from "lucide-react";
import { PageIntro } from "@/components/page-intro";

export const metadata = { title: "Services" };

const services = [
  {
    icon: LayoutTemplate,
    title: "Web Development",
    copy: "Responsive, accessible portfolio, business, and landing-page experiences built around clear visitor goals.",
  },
  {
    icon: Bot,
    title: "Custom AI Chatbots",
    copy: "Website assistants shaped around a business's own knowledge, common customer questions, and support needs.",
  },
  {
    icon: Workflow,
    title: "AI & Workflow Automation",
    copy: "Practical content, lead-generation, and operational workflows that reduce repetitive work and keep processes organized.",
  },
];

export default function ServicesPage() {
  return (
    <main>
      <PageIntro
        eyebrow="Services"
        title="Practical technology for real business workflows."
        description="I combine web development, AI implementation, and process thinking to help turn repetitive work and customer needs into useful digital systems."
      />
      <section className="card-grid">
        {services.map(({ icon: Icon, title, copy }) => (
          <article className="service-card" key={title}>
            <Icon aria-hidden="true" />
            <h2>{title}</h2>
            <p>{copy}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
