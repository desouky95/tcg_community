import { PublicShell } from "@tcg/ui-web";
import MarketplaceBrowser from "../../../src/components/MarketplaceBrowser";

export default function MarketplacePage() {
  return (
    <PublicShell currentPath="/marketplace">
      <MarketplaceBrowser />
    </PublicShell>
  );
}
