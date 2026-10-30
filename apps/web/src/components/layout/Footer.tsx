import React from 'react';
import { useTranslation } from 'react-i18next';

export const Footer: React.FC = () => {
    const { t } = useTranslation();
    return (
        <footer className="border-t border-border/40 py-8 bg-card/10">
            <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
                <img src="/brand/next-pull-logo-navy.svg" alt="Next Pull" className="h-auto w-40" />
                <p className="text-xs opacity-40 font-bold uppercase tracking-widest">
                    {t('landing.footer.rights')} © 2026 NEXT PULL COLLECTOR STUDIO.
                </p>
            </div>
        </footer>
    );
};
