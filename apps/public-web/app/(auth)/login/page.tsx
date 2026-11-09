import { authDestination, authQuery, destinationPath } from "../../../src/lib/auth-destination";
import { AuthShell } from "@tcg/ui-web";
import { LoginForm } from "../../../src/components/LoginForm";
export default async function LoginPage({ searchParams }: { searchParams: Promise<{ returnTo?: string; destination?: string; social_error?: string; facebook_error?: string; google_error?: string }> }) {
  const params = await searchParams;
  const destination = authDestination(params.destination);
  const returnTo = destinationPath(destination, params.returnTo);
  return (
    <AuthShell
      quiet
      eyebrow="Welcome back"
      title={
        <>
          Open your <em>vault.</em>
        </>
      }
      description="Pick up where you left off. Your saved cards, swaps, and collector circles are waiting."
      asideTitle="Built for the next pull."
      asideDescription="The place for serious collectors who still enjoy the thrill of finding one more card."
      asideItems={[
        "Track every card in one place",
        "Trade with collectors you can trust",
        "Keep your collection close",
      ]}
      footer={
        <>
          New to Next Pull?{" "}
          <a
            href={`/signup?${authQuery(destination, returnTo)}`}
            className="font-mono text-utility uppercase text-wax-red hover:underline focus-ring"
          >
            Create an account
          </a>
        </>
      }
    >
      <LoginForm destination={destination} returnTo={returnTo} socialError={Boolean(params.social_error || params.facebook_error || params.google_error)} />
    </AuthShell>
  );
}
