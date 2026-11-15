import React, { useState } from 'react';
import { Eye, EyeOff, Sparkles, ArrowRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import { useCatalogStore } from '../../hooks/useCatalogStore';
import { Language, PromoBannerTheme } from '../../types';
import { ImagePickerField } from './ImagePickerField';

const LANGS: Language[] = ['ru', 'be', 'en', 'zh'];

export const AdminHomeTab: React.FC = () => {
    const { language, localize } = useLanguage();
    const { siteSettings, updateSiteSettings } = useCatalogStore();
    const [editLang, setEditLang] = useState<Language>(language);

    const { homeHero, promoBanner } = siteSettings;

    const copy = {
        ru: {
            heading: 'Контент главной страницы',
            openHome: 'Открыть главную',
            heroCardTitle: 'Hero-секция (Title, Subtitle и кнопки)',
            heroTitleLabel: 'Главный заголовок H1 (Title)',
            heroSubtitleLabel: 'Подзаголовок (Subtitle)',
            heroPrimaryBtn: 'Основная кнопка (Primary CTA)',
            heroSecondaryBtn: 'Вторая кнопка (Secondary CTA)',
            heroImage: 'Фоновое изображение Hero',
            seoTitle: 'SEO <title> главной страницы',
            seoDesc: 'SEO Meta Description главной страницы',
            promoCardTitle: 'Табличка «Вкусы, которые выбирают каждый день»',
            promoCardDesc:
            'Включение, отключение, редактирование текстов, ссылок и стиля промо-плашки над карточками товаров.',
            statusOn: 'Включена на главной',
            statusOff: 'Скрыта на главной',
            toggleTurnOff: 'Выключить табличку',
            toggleTurnOn: 'Включить табличку',
            themeLabel: 'Оформление плашки',
            themes: {
                brand: 'Синий градиент (бренд)',
                slate: 'Тёмный графит',
                light: 'Светлая карточка',
            },
            promoBadge: 'Верхний бейдж',
            promoExtra: 'Доп. тег (через точку)',
            promoTitle: 'Заголовок таблички',
            promoLead: 'Описание (Lead)',
            promoSecText: 'Текст левой кнопки',
            promoSecLink: 'Ссылка левой кнопки',
            promoPrimText: 'Текст правой кнопки (по умолчанию)',
            promoPrimLink: 'Ссылка правой кнопки',
            previewLabel: 'Предпросмотр плашки на языке',
        },
        be: {
            heading: 'Кантэнт галоўнай старонкі',
            openHome: 'Адкрыць галоўную',
            heroCardTitle: 'Hero-секцыя (Title, Subtitle і кнопкі)',
            heroTitleLabel: 'Галоўны загаловак H1 (Title)',
            heroSubtitleLabel: 'Падзагаловак (Subtitle)',
            heroPrimaryBtn: 'Асноўная кнопка (Primary CTA)',
            heroSecondaryBtn: 'Другая кнопка (Secondary CTA)',
            heroImage: 'Фонавая выява Hero',
            seoTitle: 'SEO <title> галоўнай старонкі',
            seoDesc: 'SEO Meta Description галоўнай старонкі',
            promoCardTitle: 'Таблічка «Смакі, якія выбіраюць кожны дзень»',
            promoCardDesc:
            'Уключэнне, адключэнне, рэдагаванне тэкстаў, спасылак і стылю прома-плашкі над карткамі тавараў.',
            statusOn: 'Уключана на галоўнай',
            statusOff: 'Схавана на галоўнай',
            toggleTurnOff: 'Выключыць таблічку',
            toggleTurnOn: 'Уключыць таблічку',
            themeLabel: 'Афармленне плашкі',
            themes: {
                brand: 'Сіні градыент (брэнд)',
                slate: 'Цёмны графіт',
                light: 'Светлая картка',
            },
            promoBadge: 'Верхні бэйдж',
            promoExtra: 'Дад. тэг',
            promoTitle: 'Загаловак таблічкі',
            promoLead: 'Апісанне (Lead)',
            promoSecText: 'Тэкст левай кнопкі',
            promoSecLink: 'Спасылка левай кнопкі',
            promoPrimText: 'Тэкст правай кнопкі',
            promoPrimLink: 'Спасылка правай кнопкі',
            previewLabel: 'Перадпрагляд плашкі на мове',
        },
        en: {
            heading: 'Homepage Content & Banners',
            openHome: 'Open Homepage',
            heroCardTitle: 'Hero Section (Title, Subtitle & CTAs)',
            heroTitleLabel: 'Main Hero Title (H1)',
            heroSubtitleLabel: 'Hero Subtitle',
            heroPrimaryBtn: 'Primary CTA Label',
            heroSecondaryBtn: 'Secondary CTA Label',
            heroImage: 'Hero Background Image',
            seoTitle: 'Homepage SEO <title>',
            seoDesc: 'Homepage SEO Meta Description',
            promoCardTitle: 'Featured Showcase Plaque ("Signature Dairy Selection")',
            promoCardDesc:
            'Toggle visibility on/off, customize copy, CTAs, links, and visual theme of the showcase banner.',
            statusOn: 'Visible on Homepage',
            statusOff: 'Hidden on Homepage',
            toggleTurnOff: 'Hide Plaque',
            toggleTurnOn: 'Show Plaque',
            themeLabel: 'Banner Style',
            themes: {
                brand: 'Brand Blue Gradient',
                slate: 'Dark Slate',
                light: 'Light Bordered Card',
            },
            promoBadge: 'Top Eyebrow Badge',
            promoExtra: 'Secondary Tag',
            promoTitle: 'Banner Heading',
            promoLead: 'Lead Description',
            promoSecText: 'Secondary Button Text',
            promoSecLink: 'Secondary Button Link',
            promoPrimText: 'Primary Button Text',
            promoPrimLink: 'Primary Button Link',
            previewLabel: 'Live preview in',
        },
        zh: {
            heading: '首页内容与横幅管理',
            openHome: '查看首页',
            heroCardTitle: '首屏 Hero 区域（主标题、副标题与按钮）',
            heroTitleLabel: '主标题 H1 (Title)',
            heroSubtitleLabel: '副标题 (Subtitle)',
            heroPrimaryBtn: '主按钮文案',
            heroSecondaryBtn: '次按钮文案',
            heroImage: '首屏背景图片',
            seoTitle: '首页 SEO 标题 (<title>)',
            seoDesc: '首页 SEO 描述 (Meta Description)',
            promoCardTitle: '“核心精选乳品”横幅牌匾控制',
            promoCardDesc: '开启/关闭横幅显示，编辑四语标题、标签、跳转链接与背景主题风格。',
            statusOn: '首页已开启显示',
            statusOff: '已在首页隐藏',
            toggleTurnOff: '关闭显示',
            toggleTurnOn: '开启显示',
            themeLabel: '视觉风格',
            themes: {
                brand: '品牌蓝渐变',
                slate: '深灰商务',
                light: '浅色卡片',
            },
            promoBadge: '顶部角标',
            promoExtra: '附加标签',
            promoTitle: '横幅标题',
            promoLead: '横幅描述',
            promoSecText: '左侧按钮文案',
            promoSecLink: '左侧按钮路径',
            promoPrimText: '右侧按钮文案',
            promoPrimLink: '右侧按钮路径',
            previewLabel: '当前语言实时预览',
        },
    }[language];

    const themePreviewClass: Record<PromoBannerTheme, string> = {
        brand: 'bg-gradient-to-r from-[#0057B8] via-[#0a65c2] to-[#0284c7] text-white',
        slate: 'bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 text-white',
        light: 'bg-blue-50/70 border border-blue-200 text-slate-900',
    };

    return (
        <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-lg font-semibold text-slate-900">{copy.heading}</h2>

        <div className="flex flex-wrap items-center gap-2">
        <div className="inline-flex bg-slate-100 border border-slate-200 rounded-lg p-0.5">
        {LANGS.map((l) => (
            <button
            key={l}
            type="button"
            onClick={() => setEditLang(l)}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                editLang === l ? 'bg-[#0057B8] text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
            >
            {l.toUpperCase()}
            </button>
        ))}
        </div>

        <Link
        to="/"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#0057B8] bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
        >
        <span>{copy.openHome}</span>
        <ExternalLink className="w-3.5 h-3.5" />
        </Link>
        </div>
        </div>

        {/* 1. Hero Title & Subtitle Editor */}
        <section className="border border-slate-200 rounded-2xl p-5 sm:p-6 bg-slate-50/70 space-y-5">
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <h3 className="font-display text-base font-bold text-slate-900">
        {copy.heroCardTitle}
        </h3>
        <span className="text-xs font-mono font-semibold text-[#0057B8]">
        {editLang.toUpperCase()}
        </span>
        </div>

        <div className="space-y-4">
        <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">
        {copy.heroTitleLabel} ({editLang.toUpperCase()})
        </label>
        <input
        type="text"
        value={homeHero.title[editLang] || ''}
        onChange={(e) =>
            updateSiteSettings((prev) => ({
                ...prev,
                homeHero: {
                    ...prev.homeHero,
                    title: { ...prev.homeHero.title, [editLang]: e.target.value },
                },
            }))
        }
        className="w-full h-10 px-3 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#0057B8]"
        />
        </div>

        <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">
        {copy.heroSubtitleLabel} ({editLang.toUpperCase()})
        </label>
        <textarea
        rows={3}
        value={homeHero.subtitle[editLang] || ''}
        onChange={(e) =>
            updateSiteSettings((prev) => ({
                ...prev,
                homeHero: {
                    ...prev.homeHero,
                    subtitle: { ...prev.homeHero.subtitle, [editLang]: e.target.value },
                },
            }))
        }
        className="w-full p-3 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#0057B8]"
        />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">
        {copy.heroPrimaryBtn} ({editLang.toUpperCase()})
        </label>
        <input
        type="text"
        value={homeHero.primaryCta[editLang] || ''}
        onChange={(e) =>
            updateSiteSettings((prev) => ({
                ...prev,
                homeHero: {
                    ...prev.homeHero,
                    primaryCta: { ...prev.homeHero.primaryCta, [editLang]: e.target.value },
                },
            }))
        }
        className="w-full h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#0057B8]"
        />
        </div>

        <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">
        {copy.heroSecondaryBtn} ({editLang.toUpperCase()})
        </label>
        <input
        type="text"
        value={homeHero.secondaryCta[editLang] || ''}
        onChange={(e) =>
            updateSiteSettings((prev) => ({
                ...prev,
                homeHero: {
                    ...prev.homeHero,
                    secondaryCta: {
                        ...prev.homeHero.secondaryCta,
                        [editLang]: e.target.value,
                    },
                },
            }))
        }
        className="w-full h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#0057B8]"
        />
        </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">
        {copy.seoTitle} ({editLang.toUpperCase()})
        </label>
        <input
        type="text"
        value={homeHero.seoTitle[editLang] || ''}
        onChange={(e) =>
            updateSiteSettings((prev) => ({
                ...prev,
                homeHero: {
                    ...prev.homeHero,
                    seoTitle: { ...prev.homeHero.seoTitle, [editLang]: e.target.value },
                },
            }))
        }
        className="w-full h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#0057B8]"
        />
        </div>
        <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">
        {copy.seoDesc} ({editLang.toUpperCase()})
        </label>
        <input
        type="text"
        value={homeHero.seoDescription[editLang] || ''}
        onChange={(e) =>
            updateSiteSettings((prev) => ({
                ...prev,
                homeHero: {
                    ...prev.homeHero,
                    seoDescription: {
                        ...prev.homeHero.seoDescription,
                        [editLang]: e.target.value,
                    },
                },
            }))
        }
        className="w-full h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#0057B8]"
        />
        </div>
        </div>

        <ImagePickerField
        label={copy.heroImage}
        value={homeHero.image}
        onChange={(url) =>
            updateSiteSettings((prev) => ({
                ...prev,
                homeHero: { ...prev.homeHero, image: url },
            }))
        }
        />
        </div>
        </section>

        {/* 2. Promo Banner Plaque Toggle & Editor */}
        <section className="border border-slate-200 rounded-2xl p-5 sm:p-6 bg-white space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
        <div className="flex items-center gap-2">
        <h3 className="font-display text-base font-bold text-slate-900">
        {copy.promoCardTitle}
        </h3>
        <span
        className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
            promoBanner.enabled
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            : 'bg-slate-100 text-slate-500 border border-slate-200'
        }`}
        >
        {promoBanner.enabled ? copy.statusOn : copy.statusOff}
        </span>
        </div>
        <p className="text-xs text-slate-500 mt-1">{copy.promoCardDesc}</p>
        </div>

        <button
        type="button"
        onClick={() =>
            updateSiteSettings((prev) => ({
                ...prev,
                promoBanner: { ...prev.promoBanner, enabled: !prev.promoBanner.enabled },
            }))
        }
        className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap shrink-0 ${
            promoBanner.enabled
            ? 'bg-slate-100 text-slate-800 hover:bg-slate-200'
            : 'bg-[#0057B8] text-white hover:bg-[#004494]'
        }`}
        >
        {promoBanner.enabled ? (
            <>
            <EyeOff className="w-4 h-4" />
            <span>{copy.toggleTurnOff}</span>
            </>
        ) : (
            <>
            <Eye className="w-4 h-4" />
            <span>{copy.toggleTurnOn}</span>
            </>
        )}
        </button>
        </div>

        {/* Live mini-preview */}
        <div className="space-y-1.5">
        <div className="text-[11px] font-medium text-slate-500">
        {copy.previewLabel} {editLang.toUpperCase()}:
        </div>
        <div
        className={`rounded-2xl p-4 sm:px-5 flex flex-col lg:flex-row lg:items-center justify-between gap-3 transition-opacity ${
            themePreviewClass[promoBanner.theme]
        } ${promoBanner.enabled ? 'opacity-100' : 'opacity-45 grayscale'}`}
        >
        <div className="space-y-1 min-w-0">
        <div
        className={`flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-wider ${
            promoBanner.theme === 'light' ? 'text-[#0057B8]' : 'text-blue-100'
        }`}
        >
        <span className="inline-flex items-center gap-1">
        <Sparkles className="w-3 h-3 shrink-0" />
        {promoBanner.badge[editLang] || localize(promoBanner.badge)}
        </span>
        {(promoBanner.extra[editLang] || localize(promoBanner.extra)) && (
            <>
            <span aria-hidden="true">·</span>
            <span>{promoBanner.extra[editLang] || localize(promoBanner.extra)}</span>
            </>
        )}
        </div>
        <div className="font-display text-lg font-bold">
        {promoBanner.title[editLang] || localize(promoBanner.title)}
        </div>
        <p
        className={`text-xs max-w-2xl ${
            promoBanner.theme === 'light' ? 'text-slate-600' : 'text-blue-50/95'
        }`}
        >
        {promoBanner.lead[editLang] || localize(promoBanner.lead)}
        </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0 text-xs font-semibold">
        {(promoBanner.secondaryCtaLabel[editLang] || localize(promoBanner.secondaryCtaLabel)) && (
            <span
            className={`px-3 py-1.5 rounded-lg border ${
                promoBanner.theme === 'light'
                ? 'bg-white border-blue-200 text-[#0057B8]'
                : 'bg-white/15 border-white/25 text-white'
            }`}
            >
            {promoBanner.secondaryCtaLabel[editLang] ||
                localize(promoBanner.secondaryCtaLabel)}
                </span>
        )}
        <span
        className={`inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg ${
            promoBanner.theme === 'light'
            ? 'bg-[#0057B8] text-white'
            : 'bg-white text-[#0057B8]'
        }`}
        >
        <span>
        {promoBanner.primaryCtaLabel[editLang] ||
            localize(promoBanner.primaryCtaLabel)}
            </span>
            <ArrowRight className="w-3 h-3" />
            </span>
            </div>
            </div>
            </div>

            {/* Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
            {copy.promoBadge} ({editLang.toUpperCase()})
            </label>
            <input
            type="text"
            value={promoBanner.badge[editLang] || ''}
            onChange={(e) =>
                updateSiteSettings((prev) => ({
                    ...prev,
                    promoBanner: {
                        ...prev.promoBanner,
                        badge: { ...prev.promoBanner.badge, [editLang]: e.target.value },
                    },
                }))
            }
            className="w-full h-9 px-3 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:border-[#0057B8]"
            />
            </div>

            <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
            {copy.promoExtra} ({editLang.toUpperCase()})
            </label>
            <input
            type="text"
            value={promoBanner.extra[editLang] || ''}
            onChange={(e) =>
                updateSiteSettings((prev) => ({
                    ...prev,
                    promoBanner: {
                        ...prev.promoBanner,
                        extra: { ...prev.promoBanner.extra, [editLang]: e.target.value },
                    },
                }))
            }
            className="w-full h-9 px-3 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:border-[#0057B8]"
            />
            </div>

            <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
            {copy.themeLabel}
            </label>
            <select
            value={promoBanner.theme}
            onChange={(e) =>
                updateSiteSettings((prev) => ({
                    ...prev,
                    promoBanner: {
                        ...prev.promoBanner,
                        theme: e.target.value as PromoBannerTheme,
                    },
                }))
            }
            className="w-full h-9 px-3 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:border-[#0057B8]"
            >
            <option value="brand">{copy.themes.brand}</option>
            <option value="slate">{copy.themes.slate}</option>
            <option value="light">{copy.themes.light}</option>
            </select>
            </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
            <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
            {copy.promoTitle} ({editLang.toUpperCase()})
            </label>
            <input
            type="text"
            value={promoBanner.title[editLang] || ''}
            onChange={(e) =>
                updateSiteSettings((prev) => ({
                    ...prev,
                    promoBanner: {
                        ...prev.promoBanner,
                        title: { ...prev.promoBanner.title, [editLang]: e.target.value },
                    },
                }))
            }
            className="w-full h-9 px-3 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:border-[#0057B8]"
            />
            </div>

            <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
            {copy.promoLead} ({editLang.toUpperCase()})
            </label>
            <textarea
            rows={2}
            value={promoBanner.lead[editLang] || ''}
            onChange={(e) =>
                updateSiteSettings((prev) => ({
                    ...prev,
                    promoBanner: {
                        ...prev.promoBanner,
                        lead: { ...prev.promoBanner.lead, [editLang]: e.target.value },
                    },
                }))
            }
            className="w-full p-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:border-[#0057B8]"
            />
            </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
            {copy.promoSecText} ({editLang.toUpperCase()})
            </label>
            <input
            type="text"
            value={promoBanner.secondaryCtaLabel[editLang] || ''}
            onChange={(e) =>
                updateSiteSettings((prev) => ({
                    ...prev,
                    promoBanner: {
                        ...prev.promoBanner,
                        secondaryCtaLabel: {
                            ...prev.promoBanner.secondaryCtaLabel,
                            [editLang]: e.target.value,
                        },
                    },
                }))
            }
            className="w-full h-9 px-3 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:border-[#0057B8]"
            />
            </div>

            <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
            {copy.promoSecLink}
            </label>
            <input
            type="text"
            value={promoBanner.secondaryCtaTo}
            onChange={(e) =>
                updateSiteSettings((prev) => ({
                    ...prev,
                    promoBanner: { ...prev.promoBanner, secondaryCtaTo: e.target.value },
                }))
            }
            className="w-full h-9 px-3 text-sm font-mono bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:border-[#0057B8]"
            />
            </div>

            <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
            {copy.promoPrimText} ({editLang.toUpperCase()})
            </label>
            <input
            type="text"
            value={promoBanner.primaryCtaLabel[editLang] || ''}
            onChange={(e) =>
                updateSiteSettings((prev) => ({
                    ...prev,
                    promoBanner: {
                        ...prev.promoBanner,
                        primaryCtaLabel: {
                            ...prev.promoBanner.primaryCtaLabel,
                            [editLang]: e.target.value,
                        },
                    },
                }))
            }
            className="w-full h-9 px-3 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:border-[#0057B8]"
            />
            </div>

            <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
            {copy.promoPrimLink}
            </label>
            <input
            type="text"
            value={promoBanner.primaryCtaTo}
            onChange={(e) =>
                updateSiteSettings((prev) => ({
                    ...prev,
                    promoBanner: { ...prev.promoBanner, primaryCtaTo: e.target.value },
                }))
            }
            className="w-full h-9 px-3 text-sm font-mono bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:border-[#0057B8]"
            />
            </div>
            </div>
            </section>
            </div>
    );
};
