import { PageIntro } from "@/components/page-intro";
import { PortfolioList } from "@/components/portfolio-list";
export const metadata = { title: "Education" };
export default function Page() {
  return (
    <main>
      <PageIntro
        eyebrow="Education"
        title="Business experience, strengthened by software and AI."
        description="My education combines a practical business foundation with current studies in software engineering and artificial intelligence."
      />
      <PortfolioList resource="qualifications" />
    </main>
  );
}
