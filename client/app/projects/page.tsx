import { PageIntro } from "@/components/page-intro";
import { PortfolioList } from "@/components/portfolio-list";
export const metadata = { title: "Projects" };
export default function Page() {
  return (
    <main>
      <PageIntro
        eyebrow="Projects"
        title="Automation built around real business needs."
        description="Projects exploring how AI, structured workflows, and thoughtful implementation can save time and improve digital experiences."
      />
      <PortfolioList resource="projects" />
    </main>
  );
}
