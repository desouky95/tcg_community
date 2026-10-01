import { AuthShell as SharedAuthShell, type AuthShellProps, type LinkComponent } from "@tcg/ui-web";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const RouterLink: LinkComponent = ({ href, ...props }) => <Link to={href} {...props} />;

export default function AuthShell(props: Omit<AuthShellProps, "Link" | "onBack" | "backIcon">) {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const BackIcon = i18n.language === "ar" ? ArrowRight : ArrowLeft;

  return <SharedAuthShell {...props} Link={RouterLink} onBack={() => navigate(-1)} backIcon={<BackIcon aria-hidden="true" />} />;
}
