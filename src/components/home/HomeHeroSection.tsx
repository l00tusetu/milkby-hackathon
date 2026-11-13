import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { ASSETS } from '../../data/assets';
import { ImageWithFallback } from '../ImageWithFallback';
import { SearchBar } from '../SearchBar';

export const HomeHeroSection: React.FC = () => {
    const { t } = useLanguage();
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    return (
        <section className="relative z-20">
        <div className="relative min-h-[540px] lg:min-h-[600px] flex items-center justify-center bg-neutral-900">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <ImageWithFallback
        src={ASSETS.heroDairyShowcase}
        alt={t('brandName')}
        className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/45 to-neutral-950/70" />
        </div>

        <div className="relative z-20 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 sm:pt-32 sm:pb-20 lg:pt-36 lg:pb-24 text-center space-y-7">
        <div className="space-y-4">
        <h1 className="font-display text-3xl sm:text-5xl lg:text-[3.25rem] font-bold text-white tracking-tight leading-[1.12]">
        {t('heroTitle')}
        </h1>
        <p className="text-base sm:text-lg text-neutral-100/90 max-w-2xl mx-auto leading-relaxed">
        {t('heroSubtitle')}
        </p>
        </div>

        <div className="max-w-xl mx-auto text-left">
        <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        onSubmitSearch={(q) =>
            navigate(q ? `/catalog?q=${encodeURIComponent(q)}` : '/catalog')
        }
        />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3.5 pt-1">
        <Link
        to="/catalog"
        className="group inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-[#0057B8] rounded-xl hover:bg-[#004494] hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 whitespace-nowrap shrink-0"
        >
        <span>{t('heroPrimaryCta')}</span>
        <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
        <Link
        to="/export"
        className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-slate-900 bg-white/95 rounded-xl hover:bg-white hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 whitespace-nowrap shrink-0"
        >
        <span>{t('heroSecondaryCta')}</span>
        </Link>
        </div>
        </div>
        </div>
        </section>
    );
};
