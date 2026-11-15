import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { useCatalogStore } from '../../hooks/useCatalogStore';
import { ImageWithFallback } from '../ImageWithFallback';
import { SearchBar } from '../SearchBar';

export const HomeHeroSection: React.FC = () => {
    const { t, localize } = useLanguage();
    const { siteSettings } = useCatalogStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [blurImgFailed, setBlurImgFailed] = useState(false);
    const navigate = useNavigate();

    const { homeHero } = siteSettings;
    const heroTitle = localize(homeHero.title) || t('heroTitle');
    const heroSubtitle = localize(homeHero.subtitle) || t('heroSubtitle');
    const primaryCta = localize(homeHero.primaryCta) || t('heroPrimaryCta');
    const secondaryCta = localize(homeHero.secondaryCta) || t('heroSecondaryCta');

    useEffect(() => {
        setBlurImgFailed(false);
    }, [homeHero.image]);

    return (
        <section className="relative z-20">
        <div className="relative min-h-[470px] sm:min-h-[540px] lg:min-h-[600px] flex items-center justify-center bg-neutral-900">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <ImageWithFallback
        src={homeHero.image}
        alt={t('brandName')}
        className="w-full h-full object-cover"
        />

        {/* Радиально замаскированный слой с обычным blur() вместо backdrop-filter */}
        {homeHero.image && !blurImgFailed && (
            <div
            aria-hidden="true"
            className="absolute inset-0 [--blur-rx:220px] [--blur-ry:175px] sm:[--blur-rx:40%] sm:[--blur-ry:44%] lg:[--blur-rx:500px] lg:[--blur-ry:245px]"
            style={{
                maskImage:
                'radial-gradient(ellipse var(--blur-rx) var(--blur-ry) at 50% 45%, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.78) 50%, rgba(0, 0, 0, 0) 100%)',
                                              WebkitMaskImage:
                                              'radial-gradient(ellipse var(--blur-rx) var(--blur-ry) at 50% 45%, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.78) 50%, rgba(0, 0, 0, 0) 100%)',
            }}
            >
            <img
            src={homeHero.image}
            alt=""
            referrerPolicy="no-referrer"
            onError={() => setBlurImgFailed(true)}
            className="w-full h-full object-cover blur-[12px] scale-[1.03]"
            />
            </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-neutral-950/65" />

        <div
        aria-hidden="true"
        className="absolute inset-0 [--scrim-rx:210px] [--scrim-ry:165px] sm:[--scrim-rx:38%] sm:[--scrim-ry:42%] lg:[--scrim-rx:480px] lg:[--scrim-ry:235px]"
        style={{
            background:
            'radial-gradient(ellipse var(--scrim-rx) var(--scrim-ry) at 50% 45%, rgba(10, 15, 28, 0.38) 0%, rgba(10, 15, 28, 0.18) 50%, rgba(10, 15, 28, 0) 100%)',
        }}
        />
        </div>

        <div className="relative z-20 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 sm:pt-32 sm:pb-20 lg:pt-36 lg:pb-24 text-center space-y-6 sm:space-y-7">
        <div className="space-y-3 sm:space-y-4">
        <h1 className="font-display text-3xl sm:text-5xl lg:text-[3.25rem] font-bold text-white tracking-tight leading-[1.12] drop-shadow-[0_2px_14px_rgba(0,0,0,0.35)]">
        {heroTitle}
        </h1>
        <p className="text-sm sm:text-lg text-white/95 max-w-2xl mx-auto leading-relaxed drop-shadow-[0_1px_10px_rgba(0,0,0,0.45)]">
        {heroSubtitle}
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

        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-3.5 pt-1">
        <Link
        to="/catalog"
        className="group inline-flex items-center gap-2 px-5 sm:px-6 py-3 text-sm font-semibold text-white bg-[#0057B8] rounded-xl hover:bg-[#004494] hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 whitespace-nowrap shrink-0"
        >
        <span>{primaryCta}</span>
        <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
        <Link
        to="/export"
        className="inline-flex items-center gap-2 px-5 sm:px-6 py-3 text-sm font-semibold text-slate-900 bg-white/95 rounded-xl hover:bg-white hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 whitespace-nowrap shrink-0"
        >
        <span>{secondaryCta}</span>
        </Link>
        </div>
        </div>
        </div>
        </section>
    );
};
