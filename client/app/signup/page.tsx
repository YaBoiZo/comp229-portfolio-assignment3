import { PageIntro } from "@/components/page-intro";
import { AuthForm } from "@/components/auth-form";
export default function Page() {
  return (
    <main className="account-page">
      <PageIntro
        eyebrow="Your account"
        title="Welcome aboard."
        description="Create an account to explore the portfolio. Portfolio editing is reserved for the administrator."
      />
      <AuthForm signup />
    </main>
  );
}
