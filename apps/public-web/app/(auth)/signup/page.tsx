import { AuthShell } from "@tcg/ui-web";
import { SignupForm } from "../../../src/components/SignupForm";
import {
  authDestination,
  authQuery,
  destinationPath,
} from "../../../src/lib/auth-destination";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ returnTo?: string; destination?: string }>;
}) {
  const params = await searchParams;
  const destination = authDestination(params.destination);
  const returnTo = destinationPath(destination, params.returnTo);
  return (
    <AuthShell
      quiet
      eyebrow="Join the club"
      title={
        <>
          Make room for <em>more.</em>
        </>
      }
      description="Build your collector profile, find your people, and give every card a place in the story."
      asideTitle="Collection starts with a first pull."
      asideDescription="Bring your binder online and make every swap, want, and discovery count."
      asideItems={[
        "A profile made for collecting",
        "Local context, global community",
        "Mobile verification for trust",
      ]}
      footer={
        <>
          Already have a vault?{" "}
          <a
            href={`/login?${authQuery(destination, returnTo)}`}
            className="underline focus-ring"
          >
            Sign in
          </a>
        </>
      }
    >
      <SignupForm destination={destination} returnTo={returnTo} />
    </AuthShell>
  );
}
