import { Dashboard } from "@/components/dashboard";
import { PageIntro } from "@/components/page-intro";
export const metadata = { title: "My account" };
export default function Page() {
  return (
    <main>
      <PageIntro
        eyebrow="Your workspace"
        title="Portfolio, connected."
        description="View your account and manage your portfolio content."
      />
      <Dashboard />
    </main>
  );
}
