import { PageIntro } from "@/components/page-intro";
import { AuthForm } from "@/components/auth-form";
export default function Page() {
  return (
    <main className="account-page">
      <PageIntro
        eyebrow="Your account"
        title="Welcome back."
        description="Sign in to your portfolio account."
      />
      <AuthForm />
    </main>
  );
}
