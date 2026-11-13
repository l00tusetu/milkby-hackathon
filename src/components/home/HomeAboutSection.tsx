import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { ImageWithFallback } from '../ImageWithFallback';

interface HomeAboutSectionProps {
  imageSrc: string;
}

export const HomeAboutSection: React.FC<HomeAboutSectionProps> = ({ imageSrc }) => {
  const { language, t } = useLanguage();

  const copy = {
    ru: {
      eyebrow: 'О предприятии',
      title: 'ОАО «Молочный Мир» — эталон белорусского молочного качества',
      p1: 'С 1938 года предприятие объединяет традиции сыроделия, строгий лабораторный контроль сырого молока и автоматизированные линии переработки. Ежедневно на производственных площадках выпускаются цельномолочная продукция, сыры, масло, йогурты, творог и мороженое для розницы и сегмента HoReCa.',
      p2: 'Собственный логистический комплекс на 4 200 паллетомест с непрерывным контролем холодовой цепи и международная сертификация FSSC 22000 / ISO 9001 позволяют гарантировать стабильные экспортные отгрузки более чем в 25 стран мира.',
      ctaAbout: 'Подробнее о компании',
      ctaExport: 'Экспортные возможности',
      badge: 'FSSC 22000 · ISO 9001 · HACCP',
      stats: [
        { value: '142+', label: 'Позиций в каталоге' },
        { value: '25+', label: 'Стран экспорта' },
        { value: '4 200', label: 'Паллетомест холодовой цепи' },
      ],
    },
    be: {
      eyebrow: 'Пра прадпрыемства',
      title: 'ААТ «Малочны Мір» — эталон беларускай малочнай якасці',
      p1: 'З 1938 года прадпрыемства аб’ядноўвае традыцыі сыраробства, строгі лабараторны кантроль сыравіны і аўтаматызаваныя лініі перапрацоўкі. Штодня выпускаецца прадукцыя для розніцы, гандлёвых сетак і сегмента HoReCa.',
      p2: 'Уласны лагістычны комплекс на 4 200 палетамесцаў з кантролем халадовага ланцуга і міжнародная сертыфікацыя FSSC 22000 / ISO 9001 забяспечваюць стабільныя экспартныя пастаўкі больш чым у 25 краін свету.',
      ctaAbout: 'Падрабязней пра кампанію',
      ctaExport: 'Экспартныя магчымасці',
      badge: 'FSSC 22000 · ISO 9001 · HACCP',
      stats: [
        { value: '142+', label: 'Пазіцый у каталогу' },
        { value: '25+', label: 'Краін экспарту' },
        { value: '4 200', label: 'Палетамесцаў халадовага ланцуга' },
      ],
    },
    en: {
      eyebrow: 'Enterprise Profile',
      title: 'OJSC "Molochny Mir" — Benchmark of Belarusian Dairy Craft',
      p1: 'Operating since 1938, the enterprise combines artisan cheesemaking heritage with accredited in-house laboratories and automated processing lines. Our daily output serves national retail chains, foodservice operators, and industrial B2B buyers.',
      p2: 'An automated 4,200-pallet cold-chain hub together with FSSC 22000 and ISO 9001 certifications ensures traceable raw milk quality and reliable export deliveries across more than 25 countries.',
      ctaAbout: 'About the Company',
      ctaExport: 'Export Capabilities',
      badge: 'FSSC 22000 · ISO 9001 · HACCP',
      stats: [
        { value: '142+', label: 'Catalog SKUs' },
        { value: '25+', label: 'Export countries' },
        { value: '4 200', label: 'Cold-chain pallet slots' },
      ],
    },
    zh: {
      eyebrow: '企业概况',
      title: 'Molochny Mir 股份公司 — 白俄罗斯乳制品品质标杆',
      p1: '企业始建于 1938 年，将传统奶酪制作工艺与现代化全自动加工生产线及实验室质控体系相结合，每日为零售商超、餐饮渠道 (HoReCa) 及工业客户提供多元化乳制品。',
      p2: '配备 4,200 个温控托盘位的自动化冷链物流中心，以及 FSSC 22000 与 ISO 9001 国际认证体系，确保产品稳定出口至全球 25 个以上国家和地区。',
      ctaAbout: '了解企业详情',
      ctaExport: '国际出口业务',
      badge: 'FSSC 22000 · ISO 9001 · HACCP',
      stats: [
        { value: '142+', label: '目录产品规格' },
        { value: '25+', label: '出口合作国家' },
        { value: '4 200', label: '冷链托盘库位' },
      ],
    },
  }[language];

  return (
    <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        <div className="lg:col-span-6 space-y-6 min-w-0">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#0057B8]">
              {copy.eyebrow}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
              {copy.title}
            </h2>
          </div>

          <div className="space-y-4 text-base text-slate-600 leading-relaxed">
            <p>{copy.p1}</p>
            <p>{copy.p2}</p>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-2 border-t border-slate-200">
            {copy.stats.map((stat) => (
              <div key={stat.value} className="space-y-1">
                <div className="font-display text-xl sm:text-2xl font-bold text-slate-900 tabular-nums">
                  {stat.value}
                </div>
                <div className="text-xs text-slate-500 leading-snug">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to="/about"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#0057B8] rounded-lg hover:bg-[#004494] transition-colors"
            >
              <span>{copy.ctaAbout}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/export"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-slate-800 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <span>{copy.ctaExport}</span>
            </Link>
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="relative h-[340px] sm:h-[460px] lg:h-[560px] rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
            <ImageWithFallback
              src={imageSrc}
              alt={t('brandName')}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 right-4 sm:right-auto inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white/95 backdrop-blur-xs border border-slate-200 text-xs font-semibold text-slate-800 shadow-xs">
              <ShieldCheck className="w-4 h-4 text-[#0057B8] shrink-0" />
              <span>{copy.badge}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};