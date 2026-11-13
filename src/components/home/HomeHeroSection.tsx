import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Globe2, Building2, ShoppingBag, Newspaper } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { ASSETS } from '../../data/assets';
import { ImageWithFallback } from '../ImageWithFallback';
import { SearchBar } from '../SearchBar';

export const HomeHeroSection: React.FC = () => {
    const { t } = useLanguage();
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const heroKickerText = t('heroKicker')
    .replace(/\s*[&·]\s*Halal(\s+Certified)?/gi, (_, cert) => (cert ? ' Certified' : ''))
    .replace(/\s*与清真认证/g, ' 与国际质量认证');

    const roleCards = [
        {
            to: '/catalog',
            icon: ShoppingBag,
            title: t('roleConsumerTitle'),
            desc: t('roleConsumerDesc'),
        },
        {
            to: '/partners',
            icon: Building2,
            title: t('roleB2BTitle'),
            desc: t('roleB2BDesc'),
        },
        {
            to: '/export',
            icon: Globe2,
            title: t('roleExportTitle'),
            desc: t('roleExportDesc'),
        },
        {
            to: '/news',
            icon: Newspaper,
            title: t('roleMediaTitle'),
            desc: t('roleMediaDesc'),
        },
    ];

    return (
        <section className="space-y-6">
        {/* Full-bleed Hero with neutral scrim behind the blurred Header */}
        <div className="relative min-h-[560px] lg:min-h-[620px] flex items-center justify-center bg-neutral-900">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <ImageWithFallback
        src={ASSETS.heroDairyShowcase}
        alt={t('brandName')}
        className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/45 to-neutral-950/65" />
        </div>

        <div className="relative z-20 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-14 sm:pt-32 sm:pb-16 lg:pt-36 lg:pb-20 text-center space-y-6">
        <div className="space-y-4">
        <p className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-medium text-neutral-100 bg-white/10 border border-white/20 backdrop-blur-xs">
        {heroKickerText}
        </p>
        <h1 className="font-display text-3xl sm:text-5xl font-bold text-white tracking-tight leading-[1.15]">
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

        <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
        <Link
        to="/catalog"
        className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#0057B8] rounded-lg hover:bg-[#004494] transition-colors whitespace-nowrap shrink-0"
        >
        <span>{t('heroPrimaryCta')}</span>
        <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
        to="/export"
        className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-slate-900 bg-white rounded-lg hover:bg-slate-100 transition-colors whitespace-nowrap shrink-0"
        >
        <span>{t('heroSecondaryCta')}</span>
        </Link>
        </div>
        </div>
        </div>

        {/* 4-column Audience Routing Strip */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {roleCards.map((card) => {
            const Icon = card.icon;
            return (
                <Link
                key={card.to}
                to={card.to}
                className="group p-4 sm:min-h-[92px] bg-white border border-slate-200 rounded-xl hover:border-[#0057B8]/50 hover:bg-slate-50/60 transition-colors flex items-start gap-3.5 min-w-0"
                >
                <div className="w-9 h-9 rounded-lg bg-slate-100 text-[#0057B8] flex items-center justify-center shrink-0 group-hover:bg-[#0057B8] group-hover:text-white transition-colors">
                <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                <div className="text-sm font-semibold text-slate-900 group-hover:text-[#0057B8] transition-colors">
                {card.title}
                </div>
                <div className="text-xs text-slate-500 mt-0.5 leading-snug">
                {card.desc}
                </div>
                </div>
                </Link>
            );
        })}
        </div>
        </div>
        </section>
    );
};
