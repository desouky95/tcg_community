import { redirect } from "next/navigation";

export default async function LegacySocialPage({
  searchParams,
}: {
  searchParams: Promise<{ provider?: string }>;
}) {
  const { provider } = await searchParams;
  redirect(
    `/login/social?provider=${provider === "google" ? "google" : "facebook"}`,
  );
}
