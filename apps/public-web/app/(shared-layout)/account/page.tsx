import type { Metadata } from "next";
import { AccountHub } from "./account-hub";

export const metadata: Metadata = {
  title: "Your account | Next Pull",
  robots: { index: false, follow: false },
};

export default function AccountPage() {
  return <AccountHub />;
}
