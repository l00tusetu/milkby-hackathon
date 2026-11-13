import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowUpRight, Phone, Clock } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

interface PlantLocation {
  id: string;
  xPercent: number;
  yPercent: number;
  coords: string;
  phone: string;
  city: Record<'ru' | 'be' | 'en' | 'zh', string>;
  address: Record<'ru' | 'be' | 'en' | 'zh', string>;
  focus: Record<'ru' | 'be' | 'en' | 'zh', string>;
  hours: Record<'ru' | 'be' | 'en' | 'zh', string>;
}

const LOCATIONS: PlantLocation[] = [
  {
    id: 'grodno',
    xPercent: 24,
    yPercent: 44,
    coords: '53.7024° N, 23.8292° E',
    phone: '+375 (152) 44-55-12',
    city: {
      ru: 'Гродно — Головное предприятие',
      be: 'Гродна — Галаўное прадпрыемства',
      en: 'Grodno — Headquarters & Main Plant',
      zh: '格罗德诺 — 总部及主生产基地',
    },
    address: {
      ru: 'ул. Гаспадарчая, 28, г. Гродно, 230005, Беларусь',
      be: 'вул. Гаспадарчая, 28, г. Гродна, 230005, Беларусь',
      en: '28 Gaspadarchaya St, Grodno 230005, Belarus',
      zh: '白俄罗斯格罗德诺市 Gaspadarchaya 街 28 号 (230005)',
    },
    focus: {
      ru: 'Цельномолочная продукция, сыры, мороженое, аккредитованная лаборатория, отдел экспорта',
      be: 'Цэльнамалочная прадукцыя, сыры, марожанае, акрэдытаваная лабараторыя, аддзел экспарту',
      en: 'Fresh dairy, cheeses, ice cream, accredited quality lab, and export sales office',
      zh: '鲜乳制品、奶酪、冰淇淋主产线，认证质检实验室及国际出口总部',
    },
    hours: {
      ru: 'Пн–Пт: 08:00 – 17:00',
      be: 'Пн–Пт: 08:00 – 17:00',
      en: 'Mon–Fri: 08:00 – 17:00',
      zh: '周一至周五: 08:00 – 17:00',
    },
  },
  {
    id: 'berestovitsa',
    xPercent: 30,
    yPercent: 74,
    coords: '53.1920° N, 24.0205° E',
    phone: '+375 (151) 12-14-30',
    city: {
      ru: 'Берестовица — Сыродельный цех',
      be: 'Бераставіца — Сыраробны цэх',
      en: 'Berestovitsa — Cheese Production Site',
      zh: '别列斯托维察 — 奶酪专业生产分厂',
    },
    address: {
      ru: 'ул. Дзержинского, 11, г.п. Большая Берестовица, 231778',
      be: 'вул. Дзяржынскага, 11, г.п. Вялікая Бераставіца, 231778',
      en: '11 Dzerzhinskogo St, Bolshaya Berestovitsa 231778',
      zh: '格罗德诺州大别列斯托维察 Dzerzhinskogo 街 11 号 (231778)',
    },
    focus: {
      ru: 'Полутвёрдые и выдержанные сыры в потребительской и промышленной фасовке',
      be: 'Паўцвёрдыя і вытрыманыя сыры ў спажывецкай і прамысловай фасоўцы',
      en: 'Semi-hard and aged cheeses in retail and industrial HoReCa blocks',
      zh: '半硬质与陈年成熟奶酪（零售小包装及餐饮工业大块装）',
    },
    hours: {
      ru: 'Пн–Пт: 08:00 – 17:00',
      be: 'Пн–Пт: 08:00 – 17:00',
      en: 'Mon–Fri: 08:00 – 17:00',
      zh: '周一至周五: 08:00 – 17:00',
    },
  },
  {
    id: 'shchuchin',
    xPercent: 68,
    yPercent: 46,
    coords: '53.6038° N, 24.7429° E',
    phone: '+375 (151) 42-21-08',
    city: {
      ru: 'Щучин — Производственный участок',
      be: 'Шчучын — Вытворчы ўчастак',
      en: 'Shchuchin — Butter & Dry Dairy Site',
      zh: '休钦 — 黄油与干乳制品基地',
    },
    address: {
      ru: 'ул. Заводская, 6, г. Щучин, 231513',
      be: 'вул. Заводская, 6, г. Шчучын, 231513',
      en: '6 Zavodskaya St, Shchuchin 231513',
      zh: '格罗德诺州休钦市 Zavodskaya 街 6 号 (231513)',
    },
    focus: {
      ru: 'Сливочное масло высокой жирности, сухие молочные продукты и B2B-ингредиенты',
      be: 'Сметанковае масла высокай тлустасці, сухія малочныя прадукты і B2B-інгрэдыенты',
      en: 'High-fat butter, milk powders, and industrial B2B dairy ingredients',
      zh: '高乳脂黄油、脱脂/全脂乳粉及工业 B2B 乳品原料',
    },
    hours: {
      ru: 'Пн–Пт: 08:00 – 17:00',
      be: 'Пн–Пт: 08:00 – 17:00',
      en: 'Mon–Fri: 08:00 – 17:00',
      zh: '周一至周五: 08:00 – 17:00',
    },
  },
  {
    id: 'skidel',
    xPercent: 42,
    yPercent: 47,
    coords: '53.5882° N, 24.2517° E',
    phone: '+375 (152) 97-81-45',
    city: {
      ru: 'Скидель — Экспортный логистический хаб',
      be: 'Скідзель — Экспартны лагістычны хаб',
      en: 'Skidel — Cold-Chain Logistics Hub',
      zh: '斯基德尔 — 智能冷链出口物流中心',
    },
    address: {
      ru: 'ул. Промышленная, 14, г. Скидель, 231761',
      be: 'вул. Прамысловая, 14, г. Скідзель, 231761',
      en: '14 Promyshlennaya St, Skidel 231761',
      zh: '格罗德诺州斯基德尔市 Promyshlennaya 街 14 号 (231761)',
    },
    focus: {
      ru: '4 200 паллетомест, отгрузка рефрижераторным авто- и контейнерным транспортом (трасса М6)',
      be: '4 200 палетамесцаў, адгрузка рэфрыжэратарным аўта- і кантэйнерным транспартам (траса М6)',
      en: '4,200 cold-chain pallet slots with direct M6 highway reefers & container loading',
      zh: '4,200 个温控托盘库位，紧邻 M6 高速干线，支持冷藏车及国际集装箱装运',
    },
    hours: {
      ru: 'Круглосуточная отгрузка B2B',
      be: 'Кругласутачная адгрузка B2B',
      en: '24/7 B2B Dispatch Operations',
      zh: '24/7 全天候 B2B 冷链装运',
    },
  },
];

export const HomeLocationsSection: React.FC = () => {
  const { language } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);

  const activeLocation = LOCATIONS[activeIndex];

  const copy = {
    ru: {
      eyebrow: 'Производство и логистика',
      title: 'Площадки ОАО «Молочный Мир»',
      subtitle: 'Четыре специализированных производственных и логистических комплекса в Гродненском регионе с единым контролем качества.',
      viewMap: 'Показать на схеме',
      allContacts: 'Все контакты и реквизиты',
      regionLabel: 'Гродненская область · Трасса М6 / Е28',
    },
    be: {
      eyebrow: 'Вытворчасць і лагістыка',
      title: 'Пляцоўкі ААТ «Малочны Мір»',
      subtitle: 'Чатыры спецыялізаваныя вытворчыя і лагістычныя комплексы ў Гродзенскім рэгіёне з адзіным кантролем якасці.',
      viewMap: 'Паказаць на схеме',
      allContacts: 'Усе кантакты і рэквізіты',
      regionLabel: 'Гродзенская вобласць · Траса М6 / Е28',
    },
    en: {
      eyebrow: 'Manufacturing & Logistics',
      title: 'Our Production & Cold-Chain Sites',
      subtitle: 'Four specialized dairy plants and automated cold-storage facilities across the Grodno region under unified QA.',
      viewMap: 'Focus on map',
      allContacts: 'Full Contacts & Details',
      regionLabel: 'Grodno Region · M6 / E28 Corridor',
    },
    zh: {
      eyebrow: '生产基地与冷链物流',
      title: 'Molochny Mir 生产与物流网络',
      subtitle: '格罗德诺州四大专业化乳品加工基地与自动化冷链枢纽，执行统一 FSSC 22000 质控标准。',
      viewMap: '地图定位',
      allContacts: '查看完整联系方式',
      regionLabel: '格罗德诺州 · M6 / E28 国际物流走廊',
    },
  }[language];

  return (
    <section id="locations" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <div className="max-w-2xl space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#0057B8]">
          {copy.eyebrow}
        </p>
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
          {copy.title}
        </h2>
        <p className="text-base text-slate-600 leading-relaxed">{copy.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Vertical interactive location tabs */}
        <div
          className="lg:col-span-5 flex flex-col gap-5"
          role="tablist"
          aria-label={copy.title}
        >
          {LOCATIONS.map((location, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={location.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveIndex(index)}
                className={`relative pl-6 py-1 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0057B8] ${
                  isActive ? 'text-slate-900' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`absolute left-0 top-0 bottom-0 rounded-full transition-all ${
                    isActive ? 'w-[3px] bg-[#0057B8]' : 'w-[2px] bg-slate-200'
                  }`}
                />
                <div className="space-y-1.5">
                  <div className="font-display text-lg font-bold leading-snug text-slate-900">
                    {location.city[language]}
                  </div>
                  <div className="text-sm text-slate-600">{location.address[language]}</div>
                  {isActive && (
                    <div className="text-xs text-slate-500 leading-relaxed pt-0.5">
                      {location.focus[language]}
                    </div>
                  )}
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0057B8] pt-1">
                    <span>{copy.viewMap}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Interactive regional map panel (100% offline-safe SVG + interactive pins) */}
        <div
          className="lg:col-span-7 bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden flex flex-col"
          role="tabpanel"
          aria-label={activeLocation.city[language]}
        >
          <div className="relative h-[320px] sm:h-[400px] w-full bg-slate-100 select-none overflow-hidden">
            <svg
              viewBox="0 0 600 440"
              className="w-full h-full object-cover"
              aria-hidden="true"
            >
              <defs>
                <pattern id="map-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>
              <rect width="600" height="440" fill="#f8fafc" />
              <rect width="600" height="440" fill="url(#map-grid)" />

              {/* Neman river corridor */}
              <path
                d="M 20 155 Q 110 185 160 198 T 310 230 T 520 265"
                fill="none"
                stroke="#bfdbfe"
                strokeWidth="12"
                strokeLinecap="round"
              />

              {/* M6 / E28 Logistics Corridor */}
              <path
                d="M 75 190 L 144 194 L 252 207 L 408 202 L 560 192"
                fill="none"
                stroke="#cbd5e1"
                strokeWidth="5"
                strokeDasharray="8 6"
              />
              {/* Southern link to Berestovitsa */}
              <path
                d="M 144 194 L 180 326 L 252 207"
                fill="none"
                stroke="#cbd5e1"
                strokeWidth="3"
                strokeDasharray="6 6"
              />
            </svg>

            <div className="absolute top-4 left-4 px-3 py-1.5 rounded-lg bg-white/90 backdrop-blur-xs border border-slate-200 text-xs font-medium text-slate-600 font-mono">
              {copy.regionLabel}
            </div>

            {/* Interactive location pins */}
            {LOCATIONS.map((loc, idx) => {
              const isSelected = idx === activeIndex;
              return (
                <button
                  key={loc.id}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  aria-pressed={isSelected}
                  aria-label={loc.city[language]}
                  style={{
                    left: `${loc.xPercent}%`,
                    top: `${loc.yPercent}%`,
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057B8]"
                >
                  {isSelected && (
                    <span className="absolute inset-0 -m-2 rounded-full bg-[#0057B8]/20 animate-ping motion-reduce:animate-none" />
                  )}
                  <span
                    className={`relative flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold shadow-sm transition-all ${
                      isSelected
                        ? 'bg-[#0057B8] text-white border-[#004494] scale-105'
                        : 'bg-white text-slate-700 border-slate-300 hover:border-[#0057B8] hover:text-[#0057B8]'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span className="whitespace-nowrap">
                      {loc.city[language].split(' — ')[0]}
                    </span>
                  </span>
                </button>
              );
            })}

            {/* Bottom floating location badge */}
            <div className="absolute bottom-4 left-4 right-4 sm:right-auto bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-md flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs font-semibold">{activeLocation.city[language]}</div>
                <div className="text-[11px] text-slate-300 font-mono tabular-nums">
                  {activeLocation.coords}
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 bg-white border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 tabular-nums">
              <span className="inline-flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#0057B8]" />
                {activeLocation.phone}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#0057B8]" />
                {activeLocation.hours[language]}
              </span>
            </div>
            <Link
              to="/contacts"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#0057B8] hover:text-[#004494] whitespace-nowrap shrink-0"
            >
              <span>{copy.allContacts}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};