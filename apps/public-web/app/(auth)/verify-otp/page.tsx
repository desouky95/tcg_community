import { AuthShell } from "@tcg/ui-web";
import { VerifyOtpForm } from "../../../src/components/VerifyOtpForm";
import {
  authDestination,
  authQuery,
  destinationPath,
} from "../../../src/lib/auth-destination";

export default async function VerifyOtpPage({
  searchParams,
}: {
  searchParams: Promise<{
    mobile?: string;
    destination?: string;
    returnTo?: string;
  }>;
}) {
  const params = await searchParams;
  const destination = authDestination(params.destination);
  const returnTo = destinationPath(destination, params.returnTo);
  return (
    <AuthShell
      quiet
      eyebrow="Verification"
      title={
        <>
          Keep your <em>vault</em> close.
        </>
      }
      description="One quick check keeps every collection, swap, and conversation tied to you."
      asideTitle="Trust is part of the collection."
      asideDescription="A verified number helps the club stay useful, local, and made for real collectors."
      asideItems={[
        "One code for a secure session",
        "Mobile verification",
        "Your cards stay yours",
      ]}
      footer={
        <a
          href={`/login?${authQuery(destination, returnTo)}`}
          className="underline focus-ring"
        >
          Return to sign in
        </a>
      }
    >
      <VerifyOtpForm
        mobile={params.mobile ?? ""}
        destination={destination}
        returnTo={returnTo}
      />
    </AuthShell>
  );
}
