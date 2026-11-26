import Link from "next/link";
import { AuthShell } from "@tcg/ui-web";
import {
  authDestination,
  authQuery,
  destinationPath,
} from "../../../../src/lib/auth/auth-destination";

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
      eyebrow="Your account"
      title="Use password sign-in"
      description="Mobile verification is temporarily disabled."
      asideTitle="Your account"
      asideDescription="Sign in with your password."
      asideItems={[]}
      footer={
        <Link href={`/login?${authQuery(destination, returnTo)}`} className="underline focus-ring">
          Continue to sign in
        </Link>
      }
    >
      {null}
    </AuthShell>
  );
}
