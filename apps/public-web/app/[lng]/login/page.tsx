import { Suspense } from "react";
import { AuthShell } from "@tcg/ui-web";
import { LoginForm } from "../../../src/components/LoginForm";

export default function LoginPage() {
  return (
    <AuthShell
      eyebrow="Welcome back"
      title={
        <>
          Open your <em>vault.</em>
        </>
      }
      description="Pick up where you left off. Your saved cards, swaps, and collector circles are waiting."
      asideTitle="A calmer way to collect."
      asideDescription="The place for serious collectors who still enjoy the thrill of the pull."
      asideItems={[
        "Track every card in one place",
        "Trade with collectors you can trust",
        "Keep your collection close",
      ]}
      footer={
        <>
          New to the club?{" "}
          <a href="/signup" className="font-mono text-utility uppercase text-wax-red hover:underline focus-ring">
            Create an account
          </a>
        </>
      }
    >
      <Suspense fallback={<div role="status" className="min-h-48 text-wax-muted">Loading sign in...</div>}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
