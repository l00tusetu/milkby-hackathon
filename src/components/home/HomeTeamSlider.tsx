import React, { useEffect, useRef, useState } from 'react';
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
    id: 'general-director',
    initials: 'МА',
    accentClass: 'bg-blue-50 text-[#0057B8] border-blue-200',
    channel: 'general',
    email: 'director@milk.by',
    phone: '+375 (152) 43-01-72',
    name: {
      ru: 'Аникеева Марина Евгеньевна',
      be: 'Анікеева Марына Яўгенаўна',
      en: 'Marina Anikeeva',
      zh: 'Marina Anikeeva (玛丽娜·阿尼克娃)',
    },
    role: {
      ru: 'Генеральный директор',
      be: 'Генеральны дырэктар',
      en: 'General Director / CEO',
      zh: '总经理',
    },
    bio: {
      ru: 'Стратегическое управление холдингом, модернизация производственных мощностей, внедрение стандартов качества и развитие экспортного потенциала.',
      be: 'Стратэгічнае кіраванне холдынгам, мадэрнізацыя вытворчых магутнасцей, укараненне стандартаў якасці і развіццё экспартнага патэнцыялу.',
      en: 'Strategic management of the holding, processing modernization, quality standard governance, and global export expansion.',
      zh: '全面主持企业战略决策、生产线现代化技术升级及全球乳制品进出口业务布局。',
    },
  },
{
  id: 'ved-meleshko',
  initials: 'СМ',
  accentClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  channel: 'export',
  email: 'ved@milk.by',
  phone: '+375 (152) 60-07-52',
  name: {
    ru: 'Мелешко Светлана Ивановна',
    be: 'Мялешка Святлана Іванаўна',
    en: 'Svetlana Meleshko',
    zh: 'Svetlana Meleshko (斯维特兰娜·梅列什科)',
  },
  role: {
    ru: 'Начальник отдела внешнеэкономической деятельности',
    be: 'Начальнік аддзела знешнеэканамічнай дзейнасці',
    en: 'Head of Foreign Economic Relations & Export',
    zh: '对外经济活动与国际出口部部长',
  },
  bio: {
    ru: 'Организация прямых экспортных поставок сыров, сухого молока и масла в страны ЕАЭС, Ближнего Востока и КНР (GACC), таможенное сопровождение.',
    be: 'Арганізацыя прамых экспартных паставак сыроў, сухога малака і масла ў краіны ЕАЭС, Блізкага Усходу і КНР (GACC), мытнае суправаджэнне.',
    en: 'Direct export logistics for cheese, milk powder, and butter across CIS, Middle East, and China (GACC compliance & documentation).',
    zh: '负责奶酪、奶粉及黄油向欧亚经济联盟、中东及中国 (GACC) 的出口直运与清关物流协同。',
  },
},
{
  id: 'first-deputy-production',
  initials: 'ОМ',
  accentClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  channel: 'wholesale',
  email: 'production@milk.by',
  phone: '+375 (152) 45-39-35',
  name: {
    ru: 'Михновец Ольга Кузьминична',
    be: 'Міхнавец Вольга Кузьмінічна',
    en: 'Olga Mikhnovets',
    zh: 'Olga Mikhnovets (奥尔加·米赫诺韦茨)',
  },
  role: {
    ru: 'Первый заместитель генерального директора',
    be: 'Першы намеснік генеральнага дырэктара',
    en: 'First Deputy General Director',
    zh: '第一副总经理',
  },
  bio: {
    ru: 'Контроль производственного цикла, бесперебойного выпуска цельномолочной и сырной продукции, оперативное взаимодействие с партнёрами.',
    be: 'Кантроль вытворчага цыкла, бесперабойнага выпуску цэльнамалочнай і сырнай прадукцыі, аператыўнае ўзаемадзеянне з партнёрамі.',
    en: 'Oversees dairy processing operations, high-capacity cheese plants, manufacturing compliance, and partner coordination.',
    zh: '统筹全脂乳品与奶酪加工各生产单元的连续运行，保障大规模商用供货配额与交付履约。',
  },
},
{
  id: 'development-ageyko',
  initials: 'ВА',
  accentClass: 'bg-amber-50 text-amber-800 border-amber-200',
  channel: 'wholesale',
  email: 'tehotdel@milk.by',
  phone: '+375 (152) 45-39-46',
  name: {
    ru: 'Агейко Владимир Владимирович',
    be: 'Агейка Уладзімір Уладзіміравіч',
    en: 'Vladimir Ageyko',
    zh: 'Vladimir Ageyko (弗拉基米尔·阿盖科)',
  },
  role: {
    ru: 'Заместитель генерального директора по развитию',
    be: 'Намеснік генеральнага дырэктара па развіцці',
    en: 'Deputy General Director for Business Development',
    zh: '战略规划与商业拓展副总经理',
  },
  bio: {
    ru: 'Внедрение инновационных продуктов, расширение B2B-линеек (HoReCa, фасовки для переработки), развитие коммерческой инфраструктуры.',
    be: 'Укараненне інавацыйных прадуктаў, пашырэнне B2B-лінеек (HoReCa, фасоўкі для перапрацоўкі), развіццё камерцыйнай інфраструктуры.',
    en: 'Drives commercial innovation, expanding HoReCa / food-industry pack sizes, and scaling corporate sales channels.',
    zh: '主导研发新配方落地、推动餐饮餐饮定制大规格包装 (HoReCa) 与大宗供应链业务增长。',
  },
},
{
  id: 'chief-engineer-shapel',
  initials: 'ЮШ',
  accentClass: 'bg-slate-100 text-slate-800 border-slate-200',
  channel: 'general',
  email: 'engineer@milk.by',
  phone: '+375 (152) 43-21-81',
  name: {
    ru: 'Шапель Юрий Вацлавович',
    be: 'Шапель Юрый Вацлававіч',
    en: 'Yury Shapel',
    zh: 'Yury Shapel (尤里·沙佩尔)',
  },
  role: {
    ru: 'Заместитель генерального директора — главный инженер',
    be: 'Намеснік генеральнага дырэктара — галоўны інжынер',
    en: 'Deputy General Director — Chief Engineer',
    zh: '副总经理兼总工程师',
  },
  bio: {
    ru: 'Техническое переоснащение цехов, эксплуатация передовых европейских линий фасовки и энергоэффективные инженерные системы.',
    be: 'Тэхнічнае перааснашчэнне цэхаў, эксплуатацыя перадавых еўрапейскіх ліній фасоўкі і энергаэфектыўныя інжынерныя сістэмы.',
    en: 'Engineering automation, continuous operation of high-speed aseptic packaging lines, and cold-storage energy systems.',
    zh: '负责全厂自动化无菌包装流水线升级维护、智能化冷库温控及工厂能源高效管理。',
  },
},
{
  id: 'planning-bartash',
  initials: 'НБ',
  accentClass: 'bg-sky-50 text-sky-800 border-sky-200',
  channel: 'wholesale',
  email: 'econom@milk.by',
  phone: '+375 (152) 45-39-23',
  name: {
    ru: 'Барташ Наталия Александровна',
    be: 'Барташ Наталія Аляксандраўна',
    en: 'Nataliya Bartash',
    zh: 'Nataliya Bartash (娜塔莉亚·巴尔塔什)',
  },
  role: {
    ru: 'Начальник планово-экономического отдела',
    be: 'Начальнік планава-эканамічнага аддзела',
    en: 'Head of Planning & Economic Department',
    zh: '财务预算与经济计划部部长',
  },
  bio: {
    ru: 'Оптовое ценообразование, экономический расчёт контрактов на оптовые партии и гибкие коммерческие условия для дистрибьюторов.',
    be: 'Аптовае цанаўтварэнне, эканамічны разлік кантрактаў на аптовыя партыі і гнуткія камерцыйныя ўмовы для дыстрыб’ютараў.',
    en: 'Wholesale pricing, commercial contract feasibility analysis, and flexible contract models for authorized distributors.',
    zh: '负责大宗采购价格核算机制、经销渠道返利规划及跨国订单商务结算财务测算。',
  },
},
{
  id: 'reception-zharnikova',
  initials: 'ОЖ',
  accentClass: 'bg-rose-50 text-rose-700 border-rose-200',
  channel: 'general',
  email: 'info@milk.by',
  phone: '+375 (152) 43-01-72',
  name: {
    ru: 'Жарникова Олеся Александровна',
    be: 'Жарнікава Алеся Аляксандраўна',
    en: 'Olesya Zharnikova',
    zh: 'Olesya Zharnikova (奥列西亚·扎尔尼科娃)',
  },
  role: {
    ru: 'Приёмная / Помощник руководителя организации',
    be: 'Прыёмная / Памочнік кіраўніка арганізацыі',
    en: 'Executive Assistant / Central Reception',
    zh: '总经理助理兼总办接待处',
  },
  bio: {
    ru: 'Регистрация официальных запросов, запись на приём граждан, координация деловых делегаций и первичная маршрутизация обращений.',
    be: 'Рэгістрацыя афіцыйных запытаў, запіс на прыём грамадзян, каардынацыя дзелавых дэлегацый і першасная маршрутызацыя зваротаў.',
    en: 'Corporate reception, scheduling executive meetings, delegation support, and fast dispatch of incoming partner communications.',
    zh: '负责企业官方公函流转、外商代表团考察接待安排及各类综合业务咨询的一线分拨。',
  },
},
{
  id: 'legal-ivanov',
  initials: 'АИ',
  accentClass: 'bg-teal-50 text-teal-800 border-teal-200',
  channel: 'general',
  email: 'pravo@milk.by',
  phone: '+375 (152) 45-39-26',
  name: {
    ru: 'Иванов Александр Васильевич',
    be: 'Іваноў Аляксандр Васільевіч',
    en: 'Alexander Ivanov',
    zh: 'Alexander Ivanov (亚历山大·伊万诺夫)',
  },
  role: {
    ru: 'Начальник юридического отдела',
    be: 'Начальнік юрыдычнага аддзела',
    en: 'Head of Legal Department',
    zh: '法务部部长',
  },
  bio: {
    ru: 'Правовое сопровождение внешнеторговых и оптовых контрактов, таможенный комплаенс и защита интеллектуальной собственности брендов.',
    be: 'Прававое суправаджэнне знешнегандлёвых і аптовых кантрактаў, мытны камплаенс і абарона інтэлектуальнай уласнасці брэндаў.',
    en: 'Legal compliance for international trade, foreign currency regulations, B2B wholesale contracts, and trademark protection.',
    zh: '主管国际贸易与国内批发法律合规审查、外汇结算政策合规及品牌知识产权维护。',
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
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const viewportRef = useRef<HTMLDivElement>(null);
  const slideRef = useRef(0);
  const maxSlideRef = useRef(Math.max(0, TEAM_PROFILES.length - cardsPerView));
  const cardsPerViewRef = useRef(cardsPerView);

  const maxSlide = Math.max(0, TEAM_PROFILES.length - cardsPerView);

  useEffect(() => {
    slideRef.current = slide;
  }, [slide]);

  useEffect(() => {
    cardsPerViewRef.current = cardsPerView;
    maxSlideRef.current = Math.max(0, TEAM_PROFILES.length - cardsPerView);
  }, [cardsPerView]);

  useEffect(() => {
    const onResize = () => {
      const nextPerView = getCardsPerView();
      if (nextPerView === cardsPerViewRef.current) return;
      cardsPerViewRef.current = nextPerView;
      setCardsPerView(nextPerView);
      const nextMax = Math.max(0, TEAM_PROFILES.length - nextPerView);
      maxSlideRef.current = nextMax;
      setSlide((prev) => Math.min(prev, nextMax));
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    let startX = 0;
    let startY = 0;
    let startTime = 0;
    let lockAxis: 'x' | 'y' | null = null;
    let currentDx = 0;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      startTime = Date.now();
      lockAxis = null;
      currentDx = 0;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - startX;
      const dy = e.touches[0].clientY - startY;

      if (lockAxis === null) {
        if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
        if (Math.abs(dy) >= Math.abs(dx)) {
          lockAxis = 'y';
          return;
        }
        lockAxis = 'x';
        setIsDragging(true);
      }

      if (lockAxis === 'x') {
        if (e.cancelable) e.preventDefault();
        const atStart = slideRef.current === 0 && dx > 0;
        const atEnd = slideRef.current >= maxSlideRef.current && dx < 0;
        currentDx = atStart || atEnd ? dx * 0.25 : dx;
        setDragOffset(currentDx);
      }
    };

    const finishTouch = () => {
      if (lockAxis === 'x') {
        const elapsed = Date.now() - startTime;
        const threshold = elapsed < 220 ? 25 : 50;
        const cur = slideRef.current;
        const max = maxSlideRef.current;

        if (currentDx < -threshold && cur < max) {
          setSlide(cur + 1);
        } else if (currentDx > threshold && cur > 0) {
          setSlide(cur - 1);
        }
      }
      lockAxis = null;
      currentDx = 0;
      setIsDragging(false);
      setDragOffset(0);
    };

    viewport.addEventListener('touchstart', onTouchStart, { passive: true });
    viewport.addEventListener('touchmove', onTouchMove, { passive: false });
    viewport.addEventListener('touchend', finishTouch, { passive: true });
    viewport.addEventListener('touchcancel', finishTouch, { passive: true });

    return () => {
      viewport.removeEventListener('touchstart', onTouchStart);
      viewport.removeEventListener('touchmove', onTouchMove);
      viewport.removeEventListener('touchend', finishTouch);
      viewport.removeEventListener('touchcancel', finishTouch);
    };
  }, []);

  const goToSlide = (idx: number) => {
    setIsDragging(false);
    setDragOffset(0);
    setSlide(Math.max(0, Math.min(maxSlide, idx)));
  };

  const copy = {
    ru: {
      eyebrow: 'Руководство и ключевые специалисты',
      title: 'Контакты руководства и отделов',
      subtitle: 'Прямая связь с генеральным дирекцией, отделом ВЭД, производством и планово-экономической службой предприятия.',
      prev: 'Предыдущие контакты',
      next: 'Следующие контакты',
      slideDot: (i: number) => `Перейти к слайду ${i + 1}`,
      inquiryBtn: 'Связаться с отделом',
    },
    be: {
      eyebrow: 'Кіраўніцтва і ключавыя спецыялісты',
      title: 'Кантакты кіраўніцтва і аддзелаў',
      subtitle: 'Прамая сувязь з генеральнай дырэкцыяй, аддзелам ЗЭД, вытворчасцю і планава-эканамічнай службай прадпрыемства.',
      prev: 'Папярэднія кантакты',
      next: 'Наступныя кантакты',
      slideDot: (i: number) => `Перайсці да слайда ${i + 1}`,
      inquiryBtn: 'Звязацца з аддзелам',
    },
    en: {
      eyebrow: 'Management & Department Heads',
      title: 'Executive Contacts & Key Divisions',
      subtitle: 'Direct contact with Executive Management, Foreign Trade, Production, and Economic Planning departments.',
      prev: 'Previous specialists',
      next: 'Next specialists',
      slideDot: (i: number) => `Go to slide ${i + 1}`,
      inquiryBtn: 'Contact Department',
    },
    zh: {
      eyebrow: '企业管理层与核心部门',
      title: '管理层与业务部门联系名录',
      subtitle: '直接联络总经理总办、对外经济出口部、生产管理部及经济规划部负责人。',
      prev: '上一组人员',
      next: '下一组人员',
      slideDot: (i: number) => `切换到第 ${i + 1} 组`,
      inquiryBtn: '对接该部门',
    },
  }[language];

  const dotCount = maxSlide + 1;

  return (
    <section id="team" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 sm:gap-6">
    <div className="max-w-2xl space-y-3">
    <p className="text-xs font-semibold uppercase tracking-wider text-[#0057B8]">
    {copy.eyebrow}
    </p>
    <h2 className="font-display text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight">
    {copy.title}
    </h2>
    <p className="text-sm sm:text-base text-slate-600 leading-relaxed">{copy.subtitle}</p>
    </div>

    <Link
    to="/contacts"
    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#0057B8] rounded-lg hover:bg-[#004494] transition-colors whitespace-nowrap shrink-0 self-start md:self-auto"
    >
    <span>{t('ctaContact')}</span>
    <ArrowRight className="w-4 h-4" />
    </Link>
    </div>

    {/* Transform Carousel Viewport */}
    <div ref={viewportRef} className="overflow-hidden touch-pan-y select-none">
    <div
    className="flex gap-6 will-change-transform motion-reduce:transition-none"
    style={{
      transform: `translate3d(calc(-${slide} * ((100% + 24px) / ${cardsPerView}) + ${dragOffset}px), 0, 0)`,
          transition: isDragging ? 'none' : 'transform 320ms cubic-bezier(0.22, 1, 0.36, 1)',
    }}
    >
    {TEAM_PROFILES.map((member) => (
      <article
      key={member.id}
      className="w-full min-w-0 sm:w-[calc((100%-24px)/2)] lg:w-[calc((100%-48px)/3)] shrink-0 flex flex-col justify-between bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-5 shadow-sm hover:shadow-md transition-shadow"
      >
      <div className="space-y-4">
      <div
      className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full border flex items-center justify-center font-display text-lg font-bold ${member.accentClass}`}
      >
      {member.initials}
      </div>

      <div>
      <h3 className="font-display text-lg font-semibold text-slate-900">
      {member.name[language]}
      </h3>
      <p className="text-sm font-medium text-[#0057B8] mt-0.5 leading-snug">
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
    <div className="pt-2 flex items-center justify-between gap-4">
    <div className="flex items-center gap-2" role="tablist" aria-label="Team carousel slides">
    {Array.from({ length: dotCount }).map((_, idx) => {
      const active = slide === idx;
      return (
        <button
        key={idx}
        type="button"
        aria-label={copy.slideDot(idx)}
        aria-pressed={active}
        onClick={() => goToSlide(idx)}
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
    onClick={() => goToSlide(slide - 1)}
    disabled={slide === 0}
    className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-slate-300 bg-white text-slate-800 flex items-center justify-center hover:border-[#0057B8] hover:text-[#0057B8] disabled:opacity-35 disabled:pointer-events-none transition-colors"
    >
    <ChevronLeft className="w-5 h-5" />
    </button>
    <button
    type="button"
    aria-label={copy.next}
    onClick={() => goToSlide(slide + 1)}
    disabled={slide >= maxSlide}
    className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-slate-300 bg-white text-slate-800 flex items-center justify-center hover:border-[#0057B8] hover:text-[#0057B8] disabled:opacity-35 disabled:pointer-events-none transition-colors"
    >
    <ChevronRight className="w-5 h-5" />
    </button>
    </div>
    </div>
    </section>
  );
};
