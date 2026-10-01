import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useStore } from "../store/useStore";
import { useConversations } from "../hooks/useConversations";
import MobileNav from "./MobileNav";
import Header from "./Header";
import { PublicFooter } from "@tcg/ui-web";

export default function Layout({
  children,
  hideNav = false,
}: {
  children: React.ReactNode;
  transparent?: boolean;
  hideNav?: boolean;
}) {
  const user = useStore((state) => state.user);
  const { i18n } = useTranslation();
  const { data: conversations } = useConversations();
  const unreadCount =
    conversations?.reduce(
      (total, conversation) => total + conversation.unreadCount,
      0,
    ) ?? 0;

  useEffect(() => {
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <div className="wax-workspace">
      <Header variant="workspace" hideNav={hideNav} unreadCount={unreadCount} />

      <main className="mx-auto w-full max-w-[1440px] px-4 pt-6 pb-[calc(6.5rem+env(safe-area-inset-bottom))] md:px-gutter md:pt-12 md:pb-24">{children}</main>
      {user && !hideNav && <MobileNav />}

      <PublicFooter />
    </div>
  );
}
