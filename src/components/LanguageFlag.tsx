import React from 'react';
import { Language } from '../types';

interface LanguageFlagProps {
    code: Language;
    className?: string;
}

export const LanguageFlag: React.FC<LanguageFlagProps> = ({
    code,
    className = 'w-5 h-3.5',
}) => {
    const baseClass = `${className} rounded-[2px] overflow-hidden shrink-0 ring-1 ring-black/10 inline-block`;

    switch (code) {
        case 'ru':
            return (
                <svg viewBox="0 0 24 16" className={baseClass} aria-hidden="true">
                <rect width="24" height="5.34" y="0" fill="#FFFFFF" />
                <rect width="24" height="5.34" y="5.33" fill="#0039A6" />
                <rect width="24" height="5.34" y="10.66" fill="#D52B1E" />
                </svg>
            );

        case 'be':
            return (
                <svg viewBox="0 0 24 16" className={baseClass} aria-hidden="true">
                <rect width="24" height="10.67" y="0" fill="#D22730" />
                <rect width="24" height="5.33" y="10.67" fill="#007A33" />
                <rect width="4" height="16" x="0" y="0" fill="#FFFFFF" />
                <path
                d="M1 2h2v2H1V2zm0 4h2v2H1V6zm0 4h2v2H1v-2zm0 4h2v1.5H1V14z"
                fill="#D22730"
                />
                </svg>
            );

        case 'en':
            return (
                <svg viewBox="0 0 24 16" className={baseClass} aria-hidden="true">
                <rect width="24" height="16" fill="#012169" />
                <path d="M0 0L24 16M24 0L0 16" stroke="#FFFFFF" strokeWidth="3.2" />
                <path d="M0 0L24 16M24 0L0 16" stroke="#C8102E" strokeWidth="1.6" />
                <path d="M12 0V16M0 8H24" stroke="#FFFFFF" strokeWidth="5" />
                <path d="M12 0V16M0 8H24" stroke="#C8102E" strokeWidth="3" />
                </svg>
            );

        case 'zh':
            return (
                <svg viewBox="0 0 24 16" className={baseClass} aria-hidden="true">
                <rect width="24" height="16" fill="#DE2910" />
                <polygon
                points="4.8,2.2 5.4,4.0 7.3,4.0 5.8,5.1 6.3,6.9 4.8,5.8 3.3,6.9 3.8,5.1 2.3,4.0 4.2,4.0"
                fill="#FFDE00"
                />
                <circle cx="9.2" cy="2.3" r="0.65" fill="#FFDE00" />
                <circle cx="10.5" cy="3.8" r="0.65" fill="#FFDE00" />
                <circle cx="10.5" cy="5.8" r="0.65" fill="#FFDE00" />
                <circle cx="9.2" cy="7.3" r="0.65" fill="#FFDE00" />
                </svg>
            );
    }
};
