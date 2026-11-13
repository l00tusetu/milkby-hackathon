import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Mail, Phone, Building2, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

interface HomeTeamSliderProps {
  onRequestContact?: (channel: 'export' | 'wholesale' | 'general') => void;
}

interface TeamProfile {
  id: string;
  initials: string;
  accentClass: string;
  channel: 'export' | 'wholesale' | 'general';
  email: string;
  phone: string;
  name: Record<'ru' | 'be' | 'en' | 'zh', string>;
  role: Record<'ru' | 'be' | 'en' | 'zh', string>;
  bio: Record<'ru' | 'be' | 'en' | 'zh', string>;
}

const TEAM_PROFILES: TeamProfile[] = [
  {
    id: 'export-director',
    initials: 'ЕК',
    accentClass: 'bg-blue-50 text-[#0057B8] border-blue-200',
    channel: 'export',
    email: 'export@milk.by',
    phone: '+375 (152) 44-55-12',
    name: {
      ru: 'Елена Ковалёва',
      be: 'Алена Кавалёва',
      en: 'Elena Kovaleva',
      zh: 'Elena Kovaleva',
    },
    role: {
      ru: 'Начальник отдела внешнеэкономической деятельности',
      be: 'Начальнік аддзела знешнеэканамічнай дзейнасці',
      en: 'Head of Export & Foreign Trade',
      zh: '国际贸易与出口部负责人',
    },
    bio: {
      ru: 'Сопровождает экспортные контракты со странами СНГ, Ближнего Востока и Китая (GACC), таможенное оформление и логистику.',
      be: 'Суправаджае экспартныя кантракты з краінамі СНД, Блізкага Усходу і Кітая (GACC), мытнае афармленне і лагістыку.',
      en: 'Leads export contracts across CIS, Middle East, and China (GACC), overseeing veterinary certificates and cold-chain shipping.',
      zh: '负责独联体、中东及中国 (GACC) 出口合同、检疫认证及冷链国际物流协调。',
    },
  },
{
  id: 'b2b-sales',
  initials: 'АМ',
  accentClass: 'bg-slate-100 text-slate-800 border-slate-200',
  channel: 'wholesale',
  email: 'sales@milk.by',
  phone: '+375 (152) 44-55-18',
  name: {
    ru: 'Алексей Морозов',
    be: 'Аляксей Марозаў',
    en: 'Alexey Morozov',
    zh: 'Alexey Morozov',
  },
  role: {
    ru: 'Руководитель направления B2B и HoReCa',
    be: 'Кіраўнік напрамку B2B і HoReCa',
    en: 'Head of B2B & HoReCa Sales',
    zh: 'B2B 大客户与餐饮渠道总监',
  },
  bio: {
    ru: 'Курирует прямые оптовые поставки для торговых сетей, пиццерий и пищевых производств, подбор фасовок от 125 г до 5 кг.',
    be: 'Курыруе прамыя аптовыя пастаўкі для гандлёвых сетак, піцэрый і харчовых вытворчасцяў, падбор фасовак ад 125 г да 5 кг.',
    en: 'Manages direct wholesale supply to retail chains, pizzerias, and food processors with flexible packs from 125g to 5kg.',
    zh: '负责商超连锁、披萨餐饮及食品加工企业的直供合作，提供 125克至 5公斤多规格方案。',
  },
},
{
  id: 'quality-lab',
  initials: 'ИС',
  accentClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  channel: 'general',
  email: 'quality@milk.by',
  phone: '+375 (152) 44-55-24',
  name: {
    ru: 'Ирина Савицкая',
    be: 'Ірына Савіцкая',
    en: 'Irina Savitskaya',
    zh: 'Irina Savitskaya',
  },
  role: {
    ru: 'Главный специалист по качеству и FSSC 22000',
    be: 'Галоўны спецыяліст па якасці і FSSC 22000',
    en: 'Chief Quality & FSSC 22000 Lead',
    zh: '首席质量控制与 FSSC 22000 负责人',
  },
  bio: {
    ru: 'Контролирует входное сырьё, аккредитованную лабораторию, соответствие стандартам ISO 9001, HACCP и безлактозных линеек.',
    be: 'Кантралюе ўваходную сыравіну, акрэдытаваную лабараторыю, адпаведнаць стандартам ISO 9001, HACCP і безлактозных лінеек.',
    en: 'Oversees raw milk testing, accredited lab compliance, ISO 9001 / HACCP audits, and lactose-free production lines.',
    zh: '主管生牛乳入厂检测、认证实验室合规、ISO 9001/HACCP 体系及无乳糖产线品控。',
  },
},
{
  id: 'cheese-tech',
  initials: 'ДН',
  accentClass: 'bg-amber-50 text-amber-800 border-amber-200',
  channel: 'wholesale',
  email: 'rnd@milk.by',
  phone: '+375 (152) 44-55-31',
  name: {
    ru: 'Дмитрий Новик',
    be: 'Дзмітрый Новік',
    en: 'Dmitry Novik',
    zh: 'Dmitry Novik',
  },
  role: {
    ru: 'Ведущий технолог сыродельного производства',
    be: 'Вядучы тэхнолаг сыраробнай вытворчасці',
    en: 'Lead Cheese Production Technologist',
    zh: '首席奶酪工艺研发工程师',
  },
  bio: {
    ru: 'Отвечает за линейки полутвёрдых и выдержанных сыров, а также специализированную термостабильную моцареллу для пиццы.',
    be: 'Адказвае за лінейкі паўцвёрдых і вытрыманых сыроў, а таксама спецыялізаваную тэрмастабільную мацарэлу для піцы.',
    en: 'Leads R&D for semi-hard and aged cheeses as well as high-melt mozzarella engineered for commercial pizza ovens.',
    zh: '负责半硬质、陈年成熟奶酪及商用高温拉丝披萨马苏里拉奶酪的配方研发。',
  },
},
{
  id: 'cold-logistics',
  initials: 'ОБ',
  accentClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  channel: 'export',
  email: 'logistics@milk.by',
  phone: '+375 (152) 44-55-40',
  name: {
    ru: 'Ольга Бельская',
    be: 'Вольга Бельская',
    en: 'Olga Belskaya',
    zh: 'Olga Belskaya',
  },
  role: {
    ru: 'Руководитель складской и экспортной логистики',
    be: 'Кіраўнік складской і экспартнай лагістыкі',
    en: 'Head of Cold-Chain Logistics',
    zh: '冷链仓储与发运物流经理',
  },
  bio: {
    ru: 'Обеспечивает бесперебойную комплектацию паллет, температурный мониторинг от +2°C до -18°C и график отгрузок.',
    be: 'Забяспечвае бесперабойную камплектацыю палет, тэмпературны маніторынг ад +2°C да -18°C і графік адгрузак.',
    en: 'Coordinates automated pallet assembly, continuous +2°C to -18°C telemetry, and international dispatch schedules.',
    zh: '统筹自动化托盘分拣、+2°C 至 -18°C 全程温控监测与国际班列发运排期。',
  },
},
];

function getCardsPerView(): number {
  if (typeof window === 'undefined') return 3;
  if (window.innerWidth >= 1024) return 3;
  if (window.innerWidth >= 640) return 2;
  return 1;
}

export const HomeTeamSlider: React.FC<HomeTeamSliderProps> = ({ onRequestContact }) => {
  const { language, t } = useLanguage();
  const [cardsPerView, setCardsPerView] = useState<number>(getCardsPerView);
  const [slide, setSlide] = useState(0);

  const maxSlide = Math.max(0, TEAM_PROFILES.length - cardsPerView);

  useEffect(() => {
    const onResize = () => {
      const nextPerView = getCardsPerView();
      setCardsPerView(nextPerView);
      const nextMax = Math.max(0, TEAM_PROFILES.length - nextPerView);
      setSlide((prev) => Math.min(prev, nextMax));
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const copy = {
    ru: {
      eyebrow: 'Экспертная команда',
      title: 'Ключевые специалисты B2B и экспорта',
      subtitle: 'Прямой контакт с руководителями направлений по вопросам оптовых поставок, сертификации и экспортной логистики.',
      prev: 'Предыдущие специалисты',
      next: 'Следующие специалисты',
      slideDot: (i: number) => `Перейти к слайду ${i + 1}`,
      inquiryBtn: 'Запросить КП',
    },
    be: {
      eyebrow: 'Экспертная каманда',
      title: 'Ключавыя спецыялісты B2B і экспарту',
      subtitle: 'Прамы кантакт з кіраўнікамі напрамкаў па пытаннях аптовых паставак, сертыфікацыі і экспартнай лагістыкі.',
      prev: 'Папярэднія спецыялісты',
      next: 'Наступныя спецыялісты',
      slideDot: (i: number) => `Перайсці да слайда ${i + 1}`,
      inquiryBtn: 'Запытаць КП',
    },
    en: {
      eyebrow: 'Our Specialists',
      title: 'Dedicated B2B, Quality & Export Team',
      subtitle: 'Connect directly with department leads for wholesale pricing, product specifications, and export documentation.',
      prev: 'Previous specialists',
      next: 'Next specialists',
      slideDot: (i: number) => `Go to slide ${i + 1}`,
      inquiryBtn: 'Send Inquiry',
    },
    zh: {
      eyebrow: '专家团队',
      title: 'B2B 销售、品控与出口核心团队',
      subtitle: '直接对接各业务部门负责人，快速获取大宗报价、产品技术规格书及国际出口物流方案。',
      prev: '上一组专家',
      next: '下一组专家',
      slideDot: (i: number) => `切换到第 ${i + 1} 组`,
      inquiryBtn: '发送询盘',
    },
  }[language];

  const dotCount = maxSlide + 1;

  return (
    <section id="team" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
    <div className="max-w-2xl space-y-3">
    <p className="text-xs font-semibold uppercase tracking-wider text-[#0057B8]">
    {copy.eyebrow}
    </p>
    <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
    {copy.title}
    </h2>
    <p className="text-base text-slate-600 leading-relaxed">{copy.subtitle}</p>
    </div>

    <Link
    to="/contacts"
    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#0057B8] rounded-lg hover:bg-[#004494] transition-colors whitespace-nowrap shrink-0 self-start md:self-auto"
    >
    <span>{t('ctaContact')}</span>
    <ArrowRight className="w-4 h-4" />
    </Link>
    </div>

    {/* Carousel Viewport */}
    <div className="overflow-hidden">
    <div
    className="flex gap-6 transition-transform duration-500 ease-out motion-reduce:transition-none"
    style={
      {
        '--cards-per-view': cardsPerView,
        transform: `translateX(calc(-${slide} * ((100% + 24px) / ${cardsPerView})))`,
      } as React.CSSProperties
    }
    >
    {TEAM_PROFILES.map((member) => (
      <article
      key={member.id}
      className="flex flex-col justify-between bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shrink-0"
      style={{
        flexBasis: `calc((100% - ${(cardsPerView - 1) * 24}px) / ${cardsPerView})`,
      }}
      >
      <div className="space-y-4">
      <div
      className={`w-16 h-16 rounded-full border flex items-center justify-center font-display text-lg font-bold ${member.accentClass}`}
      >
      {member.initials}
      </div>

      <div>
      <h3 className="font-display text-lg font-semibold text-slate-900">
      {member.name[language]}
      </h3>
      <p className="text-sm font-medium text-[#0057B8] mt-0.5">
      {member.role[language]}
      </p>
      </div>

      <p className="text-sm text-slate-600 leading-relaxed">
      {member.bio[language]}
      </p>
      </div>

      <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
      <a
      href={`mailto:${member.email}`}
      title={member.email}
      aria-label={`${member.name[language]} e-mail`}
      className="w-8 h-8 rounded-lg border border-slate-200 text-slate-600 hover:text-[#0057B8] hover:border-[#0057B8]/40 flex items-center justify-center transition-colors"
      >
      <Mail className="w-4 h-4" />
      </a>
      <a
      href={`tel:${member.phone.replace(/[^+\d]/g, '')}`}
      title={member.phone}
      aria-label={`${member.name[language]} phone`}
      className="w-8 h-8 rounded-lg border border-slate-200 text-slate-600 hover:text-[#0057B8] hover:border-[#0057B8]/40 flex items-center justify-center transition-colors"
      >
      <Phone className="w-4 h-4" />
      </a>
      <Link
      to="/contacts"
      aria-label="Contacts"
      className="w-8 h-8 rounded-lg border border-slate-200 text-slate-600 hover:text-[#0057B8] hover:border-[#0057B8]/40 flex items-center justify-center transition-colors"
      >
      <Building2 className="w-4 h-4" />
      </Link>
      </div>

      {onRequestContact && (
        <button
        type="button"
        onClick={() => onRequestContact(member.channel)}
        className="text-xs font-semibold text-[#0057B8] hover:text-[#004494] transition-colors whitespace-nowrap"
        >
        {copy.inquiryBtn}
        </button>
      )}
      </div>
      </article>
    ))}
    </div>
    </div>

    {/* Controls */}
    <div className="flex items-center justify-between gap-4">
    <div className="flex items-center gap-2" role="tablist" aria-label="Team carousel slides">
    {Array.from({ length: dotCount }).map((_, idx) => {
      const active = slide === idx;
      return (
        <button
        key={idx}
        type="button"
        aria-label={copy.slideDot(idx)}
        aria-pressed={active}
        onClick={() => setSlide(idx)}
        className={`h-2.5 rounded-full transition-all ${
          active ? 'w-7 bg-[#0057B8]' : 'w-2.5 bg-slate-300 hover:bg-slate-400'
        }`}
        />
      );
    })}
    </div>

    <div className="flex items-center gap-3">
    <button
    type="button"
    aria-label={copy.prev}
    onClick={() => setSlide((prev) => Math.max(0, prev - 1))}
    disabled={slide === 0}
    className="w-11 h-11 rounded-full border border-slate-300 bg-white text-slate-800 flex items-center justify-center hover:border-[#0057B8] hover:text-[#0057B8] disabled:opacity-35 disabled:pointer-events-none transition-colors"
    >
    <ChevronLeft className="w-5 h-5" />
    </button>
    <button
    type="button"
    aria-label={copy.next}
    onClick={() => setSlide((prev) => Math.min(maxSlide, prev + 1))}
    disabled={slide >= maxSlide}
    className="w-11 h-11 rounded-full border border-slate-300 bg-white text-slate-800 flex items-center justify-center hover:border-[#0057B8] hover:text-[#0057B8] disabled:opacity-35 disabled:pointer-events-none transition-colors"
    >
    <ChevronRight className="w-5 h-5" />
    </button>
    </div>
    </div>
    </section>
  );
};
