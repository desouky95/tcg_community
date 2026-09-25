import type { ReactNode } from "react";
import { ArrowLeft, ArrowRight, Check, MapPin } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

type AuthShellProps = {
  eyebrow: string;
  title: ReactNode;
  description: string;
  children: ReactNode;
  footer: ReactNode;
  asideTitle: string;
  asideDescription: string;
  asideItems: string[];
};

export default function AuthShell({ eyebrow, title, description, children, footer, asideTitle, asideDescription, asideItems }: AuthShellProps) {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const BackIcon = i18n.language === "ar" ? ArrowRight : ArrowLeft;
  return (
    <main className="wax-auth-shell">
      <div className="wax-auth-layout">
        <aside className="wax-auth-rail">
          <div className="wax-auth-rail-pattern" aria-hidden="true" />
          <div className="wax-auth-rail-content">
            <Link to="/" className="wax-brand wax-auth-brand focus-ring"><span className="wax-brand-mark">T</span><span><strong>TCG Nexus</strong><small>THE COLLECTOR'S CLUB</small></span></Link>
            <div className="wax-auth-rail-copy"><h2>Your binder,<br /><em>in motion.</em></h2><p>{asideDescription}</p></div>
          </div>
          <div className="wax-auth-rail-foot">
            <div className="wax-auth-callout"><strong>{asideTitle}</strong><span>Egypt-first collecting, trading, and discovery.</span></div>
            <ul>{asideItems.map((item) => <li key={item}><span className="wax-auth-check"><Check aria-hidden="true" /></span>{item}</li>)}</ul>
            <div className="wax-auth-location"><MapPin aria-hidden="true" /> Cairo / Alexandria / everywhere</div>
          </div>
        </aside>
        <section className="wax-auth-main">
          <div className="wax-auth-topbar">
            <button type="button" onClick={() => navigate(-1)} aria-label="Go back" className="wax-auth-back focus-ring"><BackIcon aria-hidden="true" /></button>
            <Link to="/" className="wax-brand wax-auth-mobile-brand focus-ring"><span className="wax-brand-mark">T</span><strong>TCG Nexus</strong></Link>
            <span className="wax-auth-edition">TCG / 2026</span>
          </div>
          <div className="wax-auth-form-wrap">
            <header className="wax-auth-heading"><p className="wax-kicker">{eyebrow}</p><h1>{title}</h1><p>{description}</p></header>
            {children}
            <div className="wax-auth-footer">{footer}</div>
          </div>
          <p className="wax-auth-legal">Private collection space · Secure session</p>
        </section>
      </div>
    </main>
  );
}
