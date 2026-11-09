import { AuthShell } from "@tcg/ui-web";
import { OtpLoginForm } from "../../../../src/components/OtpLoginForm";
import {
  authDestination,
  authQuery,
  destinationPath,
} from "../../../../src/lib/auth-destination";

export default async function OtpLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ destination?: string; returnTo?: string }>;
}) {
  const params = await searchParams;
  const destination = authDestination(params.destination);
  const returnTo = destinationPath(destination, params.returnTo);
  return (
    <AuthShell
      quiet
      eyebrow="Sign in"
      title="Sign in with a code"
      description="Request a code for your verified mobile number."
      asideTitle="Your collector account"
      asideDescription="Use your registered mobile number."
      asideItems={[]}
      footer={
        <a
          href={`/login?${authQuery(destination, returnTo)}`}
          className="underline focus-ring"
        >
          Sign in with a password
        </a>
      }
    >
      <OtpLoginForm destination={destination} returnTo={returnTo} />
    </AuthShell>
  );
}
