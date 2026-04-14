import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

interface BackButtonProps {
  to?: string;
  className?: string;
}

export function BackButton({ to, className = "" }: BackButtonProps) {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const buttonClasses = `p-3 bg-card border border-border rounded-2xl hover:bg-muted transition-all group shadow-sm flex items-center justify-center w-fit ${className}`;

  const ArrowComponent = i18n.language == "ar" ? ArrowRight : ArrowLeft;
  if (to) {
    return (
      <Link to={to} className={buttonClasses} aria-label={t("common.back")}>
        <ArrowComponent className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
      </Link>
    );
  }

  return (
    <button
      onClick={() => navigate(-1)}
      className={buttonClasses}
      aria-label={t("common.back")}
    >
      <ArrowComponent className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
    </button>
  );
}
