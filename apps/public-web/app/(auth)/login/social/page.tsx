import { AuthShell } from "@tcg/ui-web";
import { FacebookCompletion } from "../../../../src/components/FacebookCompletion";

export default function FacebookPage() {
  return (
    <AuthShell
      eyebrow="One more step"
      title={
        <>
          Connect your <em>account.</em>
        </>
      }
      description="Create a collector account or connect one you already have."
      asideTitle="Built for the next pull."
      asideDescription="Your collection, your community."
      asideItems={["Track your collection", "Connect with collectors"]}
      footer={
        <a href="/login" className="underline focus-ring">
          Back to sign in
        </a>
      }
    >
      <FacebookCompletion />
    </AuthShell>
  );
}
