import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Download,
  MessageSquare,
  ShieldCheck,
  Globe2,
  Ship,
  Award,
  Phone,
  Mail,
  ArrowUpRight,
  Snowflake,
} from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { useCatalogStore } from '../hooks/useCatalogStore';
import { SeoHead } from '../components/SeoHead';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { B2BInquiryModal } from '../components/B2BInquiryModal';
import { downloadProductB2BSpec } from '../utils/specExport';
import { Product } from '../types';

export const Export: React.FC = () => {
  const { language, localize, t } = useLanguage();
  const { products, categories } = useCatalogStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const exportProducts = useMemo(
    () => products.filter((p) => p.visible && p.exportReady),
                                 [products]
  );

  const exportCategories = useMemo(() => {
    const ids = new Set(exportProducts.map((p) => p.category));
    return categories.filter((c) => ids.has(c.id));
  }, [categories, exportProducts]);

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'all') return exportProducts;
    return exportProducts.filter((p) => p.category === activeCategory);
  }, [exportProducts, activeCategory]);

  const gramUnit = language === 'ru' || language === 'be' ? 'г' : language === 'zh' ? '克' : 'g';

  const copy = {
    ru: {
      badge: 'FSSC 22000 · ISO 9001 · HACCP · China GACC',
      title: 'Экспорт и международное партнёрство',
      subtitle:
      'Прямые контрактные отгрузки молочной продукции ОАО «Молочный Мир» более чем в 25 стран мира: сухие ингредиенты, сливочное масло, сыры и ультрапастеризованное молоко в промышленной и розничной фасовке.',
      metrics: [
        { value: '25+', label: 'Стран импортёров' },
        { value: '4 200', label: 'Паллетомест холодовой цепи' },
        { value: '24 мес.', label: 'Хранение СОМ и масла' },
      ],
      deptTitle: 'Отдел внешнеэкономической деятельности',
      deptSub: 'Прямые контракты без посредников · Полный пакет экспортных документов',
      incoterms: 'Условия: FCA · DAP · FOB · CIF',
      allCats: 'Все категории',
      regionsTitle: 'Ключевые экспортные направления и логистика',
      regions: [
        {
          title: 'Китай и Юго-Восточная Азия',
          tag: 'Аккредитация GACC',
          desc: 'Контейнерные отгрузки сухого обезжиренного молока (СОМ) в крафт-мешках 25 кг, выдержанных сыров и масла 82,5%.',
          mode: 'Морские рефрижераторные контейнеры и ж/д ускоренные поезда',
        },
        {
          title: 'Страны СНГ и ЕАЭС',
          tag: 'Ежедневные рейсы',
          desc: 'Регулярные прямые поставки свежих сыров, моцареллы HoReCa, греческих йогуртов, масла и UHT-молока для федеральных сетей.',
          mode: 'Собственный автопарк с телеметрией (+2…+6 °C / -18 °C)',
        },
        {
          title: 'Ближний Восток и страны Залива',
          tag: 'Международный аудит',
          desc: 'Сливочное масло высокой жирности 82,5% в монолитах по 20 кг, сухие молочные ингредиенты и сыры длительного созревания.',
          mode: 'Мультимодальная доставка FOB / CIF с ветеринарным досье',
        },
      ],
      matrixTitle: 'Экспортная матрица продукции и фасовок',
      readyCount: 'позиций готово к отгрузке',
      colProduct: 'Продукт',
      colFatProtein: 'Жир / Белок',
      colPack: 'Фасовки и логистика короба',
      colShelf: 'Срок и хранение',
      colAction: 'B2B-действие',
      boxUnit: 'шт/кор',
      specBtn: 'Спецификация',
      quoteBtn: 'Запрос КП',
      stepsTitle: 'Этапы оформления экспортного контракта',
      steps: [
        { num: '01', title: 'Подбор SKU и фасовки', desc: 'Согласование ассортимента, веса единицы и маркировки под требования рынка импортёра.' },
        { num: '02', title: 'Коммерческое предложение', desc: 'Расчёт стоимости партии на условиях FCA, DAP, FOB или CIF с графиком отгрузок.' },
        { num: '03', title: 'Ветеринарное и таможенное досье', desc: 'Подготовка сертификатов происхождения, качества, протоколов испытаний и GACC.' },
        { num: '04', title: 'Отгрузка и контроль температуры', desc: 'Паллетизация на логистическом хабе в Скиделе и передача груза перевозчику.' },
      ],
      compliance: [
        { title: 'FSSC 22000 & ISO 9001', desc: 'Международный менеджмент безопасности пищевой продукции на всех этапах приёмки и переработки молока.' },
        { title: 'Аккредитация GACC и международные допуски', desc: 'Подтверждённая регистрация для экспорта сухого молока, сливочного масла и сыров в Китай и страны Азии.' },
        { title: 'Непрерывная холодовая цепь', desc: 'Контейнерные рефрижераторы и авторефрижераторы с мониторингом температуры на всём маршруте.' },
      ],
    },
    be: {
      badge: 'FSSC 22000 · ISO 9001 · HACCP · China GACC',
      title: 'Экспарт і міжнароднае партнёрства',
      subtitle:
      'Прамыя кантрактныя адгрузкі малочнай прадукцыі ААТ «Малочны Мір» больш чым у 25 краін свету: сухія інгрэдыенты, сметанковае масла, сыры і UHT-малако.',
      metrics: [
        { value: '25+', label: 'Краін імпарцёраў' },
        { value: '4 200', label: 'Палетамесцаў халадовага ланцуга' },
        { value: '24 мес.', label: 'Захоўванне САМ і масла' },
      ],
      deptTitle: 'Аддзел знешнеэканамічнай дзейнасці',
      deptSub: 'Прамыя кантракты без пасрэднікаў · Поўны пакет экспартных дакументаў',
      incoterms: 'Умовы: FCA · DAP · FOB · CIF',
      allCats: 'Усе катэгорыі',
      regionsTitle: 'Ключавыя экспартныя напрамкі і лагістыка',
      regions: [
        {
          title: 'Кітай і Паўднёва-Усходняя Азія',
          tag: 'Акрэдытацыя GACC',
          desc: 'Кантэйнерныя адгрузкі сухога абястлушчанага малака (САМ) у мяшках 25 кг, вытрыманых сыроў і масла 82,5%.',
          mode: 'Марскія рэфрыжэратарныя кантэйнеры і паскораныя цягнікі',
        },
        {
          title: 'Краіны СНД і ЕАЭС',
          tag: 'Штодзённыя рэйсы',
          desc: 'Рэгулярныя пастаўкі свежых сыроў, мацарэлы HoReCa, грэчаскіх ёгуртаў, масла і малака для гандлёвых сетак.',
          mode: 'Уласны аўтапарк з тэлеметрыяй (+2…+6 °C / -18 °C)',
        },
        {
          title: 'Блізкі Усход і краіны Заліва',
          tag: 'Міжнародны аўдыт',
          desc: 'Сметанковае масла 82,5% у маналітах па 20 кг, сухія малочныя інгрэдыенты і вытрыманыя сыры.',
          mode: 'Мультымадальная дастаўка FOB / CIF з ветэрынарным дасье',
        },
      ],
      matrixTitle: 'Экспартная матрыца прадукцыі і фасовак',
      readyCount: 'пазіцый гатова да адгрузкі',
      colProduct: 'Прадукт',
      colFatProtein: 'Тлустасць / Бялок',
      colPack: 'Фасоўкі і лагістыка каробкі',
      colShelf: 'Тэрмін і захоўванне',
      colAction: 'B2B-дзеянне',
      boxUnit: 'шт/кар',
      specBtn: 'Спецыфікацыя',
      quoteBtn: 'Запыт КП',
      stepsTitle: 'Этапы афармлення экспартнага кантракта',
      steps: [
        { num: '01', title: 'Падбор SKU і фасоўкі', desc: 'Узгадненне асартыменту, вагі адзінкі і маркіроўкі пад патрабаванні рынку.' },
        { num: '02', title: 'Камерцыйная прапанова', desc: 'Разлік кошту партыі на ўмовах FCA, DAP, FOB або CIF з графікам адгрузак.' },
        { num: '03', title: 'Ветэрынарнае і мытнае дасье', desc: 'Падрыхтоўка сертыфікатаў паходжання, якасці, пратаколаў і GACC.' },
        { num: '04', title: 'Адгрузка і кантроль тэмпературы', desc: 'Палетызацыя на хабе ў Скідзелі і перадача грузу перавозчыку.' },
      ],
      compliance: [
        { title: 'FSSC 22000 & ISO 9001', desc: 'Міжнародны менеджмент бяспекі харчовай прадукцыі на ўсіх этапах вытворчасці.' },
        { title: 'Акрэдытацыя GACC і міжнародныя допускі', desc: 'Пацверджаная рэгістрацыя для экспарту САМ, масла і сыроў у Кітай і краіны Азіі.' },
        { title: 'Бесперапынны халадовы ланцуг', desc: 'Кантэйнерныя рэфрыжэратары і аўтарэфрыжэратары з маніторынгам тэмпературы.' },
      ],
    },
    en: {
      badge: 'FSSC 22000 · ISO 9001 · HACCP · China GACC',
      title: 'Global Export & International B2B',
      subtitle:
      'Direct manufacturer exports from Molochny Mir to over 25 countries: spray-dried dairy ingredients, 82.5% sweet cream butter, aged cheeses, and aseptic UHT dairy.',
      metrics: [
        { value: '25+', label: 'Export destinations' },
        { value: '4,200', label: 'Cold-chain pallet slots' },
        { value: '24 mo', label: 'SMP & butter shelf life' },
      ],
      deptTitle: 'Export Sales Department',
      deptSub: 'Direct manufacturer contracts · Full veterinary & customs dossier',
      incoterms: 'Terms: FCA · DAP · FOB · CIF',
      allCats: 'All categories',
      regionsTitle: 'Core Export Corridors & Cold Logistics',
      regions: [
        {
          title: 'China & Southeast Asia',
          tag: 'GACC Accredited',
          desc: 'Containerized shipments of 25kg Skimmed Milk Powder (SMP), aged cheeses, and 82.5% butter blocks.',
          mode: 'Ocean reefer containers & express container rail corridors',
        },
        {
          title: 'CIS & Eurasian Union',
          tag: 'Daily Dispatch',
          desc: 'Scheduled wholesale supply of pasta filata mozzarella, Greek yogurts, fresh cheeses, butter, and UHT milk.',
          mode: 'Dedicated chilled truck fleet (+2…+6 °C / -18 °C telemetry)',
        },
        {
          title: 'Middle East & GCC Markets',
          tag: 'ISO / FSSC Certified',
          desc: '20kg sweet cream butter blocks, milk powders, and long-matured specialty cheeses tailored for importers.',
          mode: 'Multimodal FOB / CIF shipping with complete export certification',
        },
      ],
      matrixTitle: 'Export Product & Packaging Matrix',
      readyCount: 'export-ready items',
      colProduct: 'Product',
      colFatProtein: 'Fat / Protein',
      colPack: 'Pack & Box Logistics',
      colShelf: 'Shelf Life & Storage',
      colAction: 'B2B Action',
      boxUnit: 'pcs/box',
      specBtn: 'Spec Sheet',
      quoteBtn: 'Request Quote',
      stepsTitle: 'How We Fulfill Export Orders',
      steps: [
        { num: '01', title: 'SKU & Format Selection', desc: 'Align product specs, retail/industrial pack sizes, and localized labeling.' },
        { num: '02', title: 'Commercial Offer', desc: 'Receive volume pricing under FCA, DAP, FOB, or CIF terms with lead times.' },
        { num: '03', title: 'Compliance & Clearance', desc: 'Complete veterinary certificates, lab assays, origin docs, and GACC records.' },
        { num: '04', title: 'Cold-Chain Dispatch', desc: 'Automated palletization at our Skidel logistics hub with temperature telemetry.' },
      ],
      compliance: [
        { title: 'FSSC 22000 & ISO 9001', desc: 'Certified food safety management across raw milk intake, processing, and aseptic packaging.' },
        { title: 'GACC China & International Standards', desc: 'Export registration for SMP, butter, and cheeses into China, GCC, and Southeast Asia.' },
        { title: 'Multimodal Cold Logistics', desc: 'Reefer container and cold-truck fulfillment with full veterinary and customs documentation.' },
      ],
    },
    zh: {
      badge: 'FSSC 22000 · ISO 9001 · HACCP · 中国海关 GACC',
      title: '国际出口与全球合作伙伴专区',
      subtitle:
      'Molochny Mir 乳品面向全球 25+ 国家和地区工厂直供出口：喷雾干燥脱脂奶粉、82.5% 天然黄油、陈年成熟奶酪及超高温灭菌常温乳制品。',
      metrics: [
        { value: '25+', label: '出口合作国家' },
        { value: '4,200', label: '冷链自动化托盘位' },
        { value: '24 个月', label: '奶粉与冷冻黄油保质期' },
      ],
      deptTitle: '国际外贸出口部门',
      deptSub: '工厂直签无中间商 · 提供全套检验检疫与清关单证',
      incoterms: '贸易术语: FCA · DAP · FOB · CIF',
      allCats: '全部分类',
      regionsTitle: '核心出口市场走廊与冷链物流',
      regions: [
        {
          title: '中国及东南亚市场',
          tag: 'GACC 注册认证',
          desc: '常规发运 25 公斤袋装脱脂奶粉 (SMP)、陈年奶酪及 20 公斤出口规格天然黄油。',
          mode: '海运冷藏集装箱及中欧/中亚国际冷链班列',
        },
        {
          title: '独联体及欧亚经济联盟',
          tag: '每日发车',
          desc: '面向商超及餐饮供应链直供披萨马苏里拉奶酪、高蛋白希腊酸奶、鲜奶及黄油。',
          mode: '自有全程温控冷藏车队 (+2…+6 °C / -18 °C)',
        },
        {
          title: '中东及海湾国家市场',
          tag: '国际体系认证',
          desc: '高乳脂 82.5% 无盐黄油、工业乳粉原料及长保质期特种硬质奶酪。',
          mode: 'FOB / CIF 多式联运海陆冷链及全套官方兽医卫生证书',
        },
      ],
      matrixTitle: '出口产品规格与包装矩阵',
      readyCount: '款产品可供出口',
      colProduct: '产品名称',
      colFatProtein: '乳脂 / 蛋白',
      colPack: '规格与装箱物流',
      colShelf: '保质期与储运',
      colAction: 'B2B 操作',
      boxUnit: '件/箱',
      specBtn: '技术规格书',
      quoteBtn: '获取报价',
      stepsTitle: '国际出口订单执行流程',
      steps: [
        { num: '01', title: '确认 SKU 与包装规格', desc: '根据进口国合规要求确认产品型号、大宗包装及多语言标签。' },
        { num: '02', title: '确认商业报价与条款', desc: '提供基于 FCA / DAP / FOB / CIF 的阶梯报价与排产交付周期。' },
        { num: '03', title: '单证审核与检疫申报', desc: '出具原产地证、实验室检测报告、兽医卫生证及 GACC 备案文件。' },
        { num: '04', title: '智能冷链装运交付', desc: '由斯基德尔物流中心完成标准化打托并全程温控发运。' },
      ],
      compliance: [
        { title: 'FSSC 22000 与 ISO 9001 认证', desc: '生牛乳收购、全自动加工与无菌灌装全链路执行国际食品安全管理体系。' },
        { title: '中国海关 GACC 及国际准入', desc: '持有脱脂奶粉、天然黄油及奶酪输华 GACC 注册资质，面向亚洲及中东市场常规出口。' },
        { title: '多式联运冷链物流', desc: '提供海运冷藏集装箱与国际冷链陆运方案，配备全套兽医检疫及原产地清关单证。' },
      ],
    },
  }[language];

  const complianceIcons = [ShieldCheck, Award, Ship];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-14">
    <SeoHead
    title={`${copy.title} — ${t('brandName')}`}
    description={copy.subtitle}
    canonicalHash="/export"
    />

    {/* 1. Architectural Blue Export Hero + Direct Export Desk */}
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#002f66] via-[#004694] to-[#0057B8] text-white p-6 sm:p-10 lg:p-12 shadow-lg">
    <div
    aria-hidden="true"
    className="pointer-events-none absolute -right-24 -top-24 w-80 h-80 rounded-full bg-white/10 blur-3xl"
    />
    <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
    <div className="lg:col-span-7 space-y-6">
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/12 border border-white/20 text-xs font-semibold tracking-wide">
    <Globe2 className="w-3.5 h-3.5 shrink-0" />
    <span>{copy.badge}</span>
    </div>

    <div className="space-y-3">
    <h1 className="font-display text-3xl sm:text-4xl lg:text-[2.65rem] font-bold tracking-tight leading-[1.15]">
    {copy.title}
    </h1>
    <p className="text-sm sm:text-base text-blue-100 leading-relaxed max-w-2xl">
    {copy.subtitle}
    </p>
    </div>

    <div className="grid grid-cols-3 gap-4 pt-2 border-t border-white/15 tabular-nums">
    {copy.metrics.map((m) => (
      <div key={m.value}>
      <div className="font-display text-2xl sm:text-3xl font-bold text-white">
      {m.value}
      </div>
      <div className="text-xs text-blue-100/85 mt-0.5 leading-snug">{m.label}</div>
      </div>
    ))}
    </div>
    </div>

    <div className="lg:col-span-5 bg-white text-slate-900 rounded-2xl p-6 shadow-xl space-y-4">
    <div className="space-y-1">
    <h2 className="font-display text-lg font-bold text-slate-900">{copy.deptTitle}</h2>
    <p className="text-xs text-slate-500 leading-relaxed">{copy.deptSub}</p>
    </div>

    <div className="space-y-2 pt-1 text-sm font-mono tabular-nums text-slate-700 bg-slate-50 border border-slate-200 rounded-xl p-4">
    <div className="flex items-center gap-2.5">
    <Mail className="w-4 h-4 text-[#0057B8] shrink-0" />
    <a href="mailto:export@milk.by" className="hover:text-[#0057B8] font-medium">
    export@milk.by
    </a>
    </div>
    <div className="flex items-center gap-2.5">
    <Phone className="w-4 h-4 text-[#0057B8] shrink-0" />
    <a href="tel:+375152445512" className="hover:text-[#0057B8] font-medium">
    +375 (152) 44-55-12
    </a>
    </div>
    <div className="pt-1.5 border-t border-slate-200 text-xs text-slate-500">
    {copy.incoterms}
    </div>
    </div>

    <button
    type="button"
    onClick={() => {
      setSelectedProduct(undefined);
      setModalOpen(true);
    }}
    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-[#0057B8] rounded-xl hover:bg-[#004494] transition-colors shadow-xs"
    >
    <MessageSquare className="w-4 h-4 shrink-0" />
    <span>{t('requestSalesBtn')}</span>
    </button>
    </div>
    </div>
    </section>

    {/* 2. Key Export Corridors */}
    <section className="space-y-5">
    <h2 className="font-display text-2xl font-bold text-slate-900">{copy.regionsTitle}</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {copy.regions.map((reg) => (
      <div
      key={reg.title}
      className="border border-slate-200 rounded-2xl p-6 bg-white flex flex-col justify-between space-y-4 hover:border-[#0057B8]/40 transition-colors"
      >
      <div className="space-y-3">
      <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-blue-50 text-[#0057B8] text-xs font-semibold">
      {reg.tag}
      </span>
      <h3 className="font-display text-lg font-bold text-slate-900">{reg.title}</h3>
      <p className="text-sm text-slate-600 leading-relaxed">{reg.desc}</p>
      </div>
      <div className="pt-3 border-t border-slate-100 flex items-start gap-2 text-xs text-slate-500">
      <Snowflake className="w-4 h-4 text-[#0057B8] shrink-0 mt-0.5" />
      <span>{reg.mode}</span>
      </div>
      </div>
    ))}
    </div>
    </section>

    {/* 3. Interactive Export Product & Packaging Matrix */}
    <section className="space-y-5">
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
    <div>
    <h2 className="font-display text-2xl font-bold text-slate-900">{copy.matrixTitle}</h2>
    <p className="text-xs text-slate-500 mt-1 tabular-nums">
    {filteredProducts.length} {copy.readyCount}
    </p>
    </div>

    <div className="flex flex-wrap gap-2">
    <button
    type="button"
    onClick={() => setActiveCategory('all')}
    className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
      activeCategory === 'all'
      ? 'bg-[#0057B8] text-white border-[#0057B8]'
      : 'bg-white text-slate-700 border-slate-200 hover:border-[#0057B8]/50'
    }`}
    >
    {copy.allCats}
    </button>
    {exportCategories.map((cat) => (
      <button
      key={cat.id}
      type="button"
      onClick={() => setActiveCategory(cat.id)}
      className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
        activeCategory === cat.id
        ? 'bg-[#0057B8] text-white border-[#0057B8]'
        : 'bg-white text-slate-700 border-slate-200 hover:border-[#0057B8]/50'
      }`}
      >
      {localize(cat.name)}
      </button>
    ))}
    </div>
    </div>

    <div className="border border-slate-200 rounded-2xl overflow-x-auto bg-white shadow-xs">
    <table className="w-full text-left border-collapse text-sm">
    <thead>
    <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600">
    <th className="py-3.5 px-4">{copy.colProduct}</th>
    <th className="py-3.5 px-4">{copy.colFatProtein}</th>
    <th className="py-3.5 px-4">{copy.colPack}</th>
    <th className="py-3.5 px-4">{copy.colShelf}</th>
    <th className="py-3.5 px-4 text-right">{copy.colAction}</th>
    </tr>
    </thead>
    <tbody className="divide-y divide-slate-200 tabular-nums">
    {filteredProducts.map((prod) => {
      const cat = categories.find((c) => c.id === prod.category);
      const mainPkg = prod.packages[prod.packages.length - 1] || prod.packages[0];
      return (
        <tr key={prod.id} className="hover:bg-slate-50/70 transition-colors">
        <td className="py-3.5 px-4">
        <div className="flex items-center gap-3 min-w-[220px]">
        <div className="w-11 h-11 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
        <ImageWithFallback
        src={prod.image}
        alt={localize(prod.name)}
        className="w-full h-full object-cover"
        />
        </div>
        <div className="min-w-0">
        <Link
        to={`/product/${prod.slug}`}
        className="inline-flex items-center gap-1 font-semibold text-slate-900 hover:text-[#0057B8]"
        >
        <span>{localize(prod.name)}</span>
        <ArrowUpRight className="w-3.5 h-3.5 opacity-60 shrink-0" />
        </Link>
        <div className="text-xs text-slate-500">
        {cat ? localize(cat.name) : prod.category}
        </div>
        </div>
        </div>
        </td>
        <td className="py-3.5 px-4 text-slate-700 whitespace-nowrap">
        <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-100 text-xs font-medium text-slate-800">
        {prod.fatContent ?? '—'}% · {prod.proteinContent ?? '—'} {gramUnit}
        </span>
        </td>
        <td className="py-3.5 px-4 text-slate-700 min-w-[200px]">
        <div className="font-medium">{prod.packages.map((p) => p.weight).join(' · ')}</div>
        {mainPkg && (
          <div className="text-xs text-slate-500 mt-0.5">
          {mainPkg.unitsPerBox} {copy.boxUnit} · {localize(mainPkg.packagingType)}
          </div>
        )}
        </td>
        <td className="py-3.5 px-4 text-slate-700 whitespace-nowrap">
        {mainPkg ? (
          <>
          <div className="font-medium">{localize(mainPkg.shelfLife)}</div>
          <div className="text-xs text-slate-500">{localize(mainPkg.storage)}</div>
          </>
        ) : (
          '—'
        )}
        </td>
        <td className="py-3.5 px-4 text-right">
        <div className="inline-flex items-center gap-2">
        <button
        type="button"
        onClick={() => downloadProductB2BSpec(prod, cat, language)}
        title={t('downloadSpecBtn')}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors whitespace-nowrap"
        >
        <Download className="w-3.5 h-3.5" />
        <span>{copy.specBtn}</span>
        </button>
        <button
        type="button"
        onClick={() => {
          setSelectedProduct(prod);
          setModalOpen(true);
        }}
        className="px-3 py-1.5 text-xs font-semibold text-white bg-[#0057B8] rounded-lg hover:bg-[#004494] transition-colors whitespace-nowrap"
        >
        {copy.quoteBtn}
        </button>
        </div>
        </td>
        </tr>
      );
    })}
    </tbody>
    </table>
    </div>
    </section>

    {/* 4. 4-Step Export Process */}
    <section className="space-y-5">
    <h2 className="font-display text-2xl font-bold text-slate-900">{copy.stepsTitle}</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
    {copy.steps.map((step) => (
      <div key={step.num} className="border border-slate-200 rounded-2xl p-5 bg-slate-50/70 space-y-2">
      <div className="font-mono text-xs font-bold text-[#0057B8]">{step.num}</div>
      <h3 className="font-display text-base font-semibold text-slate-900">{step.title}</h3>
      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{step.desc}</p>
      </div>
    ))}
    </div>
    </section>

    {/* 5. Quality & Compliance */}
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {copy.compliance.map((item, idx) => {
      const Icon = complianceIcons[idx];
      return (
        <div key={item.title} className="border border-slate-200 rounded-2xl p-6 space-y-2.5 bg-white">
        <Icon className="w-5 h-5 text-[#0057B8]" />
        <h3 className="font-display text-base font-semibold text-slate-900">{item.title}</h3>
        <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
        </div>
      );
    })}
    </section>

    <B2BInquiryModal
    open={modalOpen}
    onClose={() => setModalOpen(false)}
    product={selectedProduct}
    defaultChannel="export"
    />
    </div>
  );
};
