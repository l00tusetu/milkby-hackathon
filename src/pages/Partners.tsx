import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  Truck,
  PackageCheck,
  FileSpreadsheet,
  Store,
  UtensilsCrossed,
  Factory,
  Phone,
  Mail,
  MessageSquare,
  Download,
  CheckCircle2,
  Snowflake,
} from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { useCatalogStore } from '../hooks/useCatalogStore';
import { SeoHead } from '../components/SeoHead';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { B2BInquiryModal } from '../components/B2BInquiryModal';
import { downloadProductB2BSpec } from '../utils/specExport';
import { Product } from '../types';

type PartnerSegmentId = 'retail' | 'horeca' | 'industrial';

const SEGMENT_PRODUCT_IDS: Record<PartnerSegmentId, string[]> = {
  retail: ['milk-classic', 'greek-yogurt-protein', 'mozzarella', 'goroden-aged'],
  horeca: ['mozzarella-pizza', 'cream-33', 'butter-825', 'sour-cream-20'],
  industrial: ['butter-825', 'skim-milk-powder-b2b', 'mozzarella-pizza', 'cream-33'],
};

export const Partners: React.FC = () => {
  const { language, localize, t } = useLanguage();
  const { products, categories } = useCatalogStore();
  const [activeSegment, setActiveSegment] = useState<PartnerSegmentId>('horeca');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);

  const copy = {
    ru: {
      seoDesc: 'Условия сотрудничества для оптовых покупателей, торговых сетей и сегмента HoReCa.',
      badge: 'Прямые поставки от производителя · Бизнесу (B2B)',
      h1: 'Для оптовых покупателей, ритейла и HoReCa',
      lead: 'Стабильные оптовые поставки молочной продукции ОАО «Молочный Мир» для федеральных и локальных торговых сетей, пиццерий, кофеен, пекарен и пищевых комбинатов.',
      metrics: [
        { value: '142+', label: 'SKU в прайс-листе' },
        { value: '4 200', label: 'Паллетомест (+2…+6 °C)' },
        { value: '24 ч', label: 'Сборка и отгрузка заказов' },
      ],
      deskTitle: 'Отдел оптовых продаж и HoReCa',
      deskSub: 'Индивидуальные условия отгрузки, ЭТТН / EDI и образцы продукции для дегустации.',
      deskTerms: 'Минимум: от 1 европаллета · Отсрочка платежа по договору',
      requestPrice: 'Запросить оптовый прайс-лист',
      browseCatalog: 'Весь каталог',
      segmentsTitle: 'Решения под задачи вашего бизнеса',
      segmentsSub: 'Выберите формат работы, чтобы увидеть подходящие позиции и фасовки.',
      segments: {
        retail: {
          title: 'Торговые сети и ритейл',
          tagline: 'Полка, СТМ и высокая оборачиваемость',
          desc: 'Продукция в современной потребительской упаковке (ПЭТ, Tetra Pak, МГС, флоу-пак) с длительной свежестью и едиными штрихкодами GS1 GTIN.',
          bullets: [
            'Сроки годности от 14 до 180 суток под разные форматы магазинов',
            'Выпуск продукции под собственной торговой маркой (СТМ) сетей',
            'Поддержка промо-активностей и гарантированное наличие на РЦ',
          ],
        },
        horeca: {
          title: 'HoReCa, пиццерии и кофейни',
          tagline: 'Профессиональные форматы для кухни шефа',
          desc: 'Термостабильная моцарелла для печей до 400 °C, сливки 33% без растительных жиров для взбивания и ганаша, сметана и безлактозное молоко для бариста.',
          bullets: [
            'Удобные форматы 500 г, 1 кг, 2,5 кг и 4 кг без лишних отходов на кухне',
            'Стабильная плавкость, эластичная нить и равномерное запекание без подгорания',
            'Отгрузка тестовых образцов технологам и бренд-шефам сети',
          ],
        },
        industrial: {
          title: 'Пищевые производства и пекарни',
          tagline: 'Индустриальное сырьё и крупный опт',
          desc: 'Сливочное масло 82,5% в монолитах по 20 кг для слоёного теста и кремов, распылительное сухое молоко (СОМ) в крафт-мешках по 25 кг и стабильный творог.',
          bullets: [
            'Каждая партия сопровождается паспортом качества и протоколом лаборатории',
            'Ритмичные контрактные отгрузки по фиксированному графику',
            'Сырьевая фасовка 20–25 кг с оптимальной паллетной загрузкой',
          ],
        },
      },
      recommendedLabel: 'Востребованные позиции сегмента',
      specBtn: 'Спецификация',
      quoteBtn: 'Запрос цены',
      stepsTitle: 'Как мы выстраиваем партнёрство',
      steps: [
        { num: '01', title: 'Подбор матрицы', desc: 'Формируем ассортимент и фасовки под вашу сеть, кухню или производство.' },
        { num: '02', title: 'Образцы и аудит', desc: 'Передаём тестовые образцы технологам и предоставляем сертификаты FSSC 22000.' },
        { num: '03', title: 'Договор и EDI / ЭТТН', desc: 'Подключаем электронный документооборот, согласовываем график и условия оплаты.' },
        { num: '04', title: 'Холодовая доставка', desc: 'Отгружаем с роботизированного хаба с непрерывным контролем температуры.' },
      ],
      features: [
        { title: 'Форматы HoReCa и B2B', desc: 'Моцарелла для пиццы 1 кг и 2,5 кг, сливки 33% 1 л, масло монолит 20 кг, СОМ 25 кг.' },
        { title: 'Собственный автопарк', desc: 'Ежедневная доставка рефрижераторным транспортом с соблюдением режима +2…+6 °C.' },
        { title: 'EDI и документооборот', desc: 'Электронные накладные, GTIN-маркировка и декларации соответствия ЕАЭС.' },
      ],
    },
    be: {
      seoDesc: 'Умовы супрацоўніцтва для аптовых пакупнікоў, гандлёвых сетак і сегмента HoReCa.',
      badge: 'Прамыя пастаўкі ад вытворцы · Бізнесу (B2B)',
      h1: 'Для аптовых пакупнікоў, рытэйла і HoReCa',
      lead: 'Стабільныя аптовыя пастаўкі малочнай прадукцыі ААТ «Малочны Мір» для гандлёвых сетак, піцэрый, кавярняў, пякарняў і харчовых прадпрыемстваў.',
      metrics: [
        { value: '142+', label: 'SKU у прайс-лісце' },
        { value: '4 200', label: 'Палетамесцаў (+2…+6 °C)' },
        { value: '24 гадз', label: 'Зборка і адгрузка заказаў' },
      ],
      deskTitle: 'Аддзел аптовых продажаў і HoReCa',
      deskSub: 'Індывідуальныя ўмовы адгрузкі, ЭТТН / EDI і ўзоры прадукцыі для дэгустацыі.',
      deskTerms: 'Мінімум: ад 1 еўрапалеты · Адтэрміноўка плацяжу па дагаворы',
      requestPrice: 'Запытаць аптовы прайс-ліст',
      browseCatalog: 'Увесь каталог',
      segmentsTitle: 'Рашэнні пад задачы вашага бізнесу',
      segmentsSub: 'Выберыце фармат працы, каб убачыць падыходзячыя пазіцыі і фасоўкі.',
      segments: {
        retail: {
          title: 'Гандлёвыя сеткі і рытэйл',
          tagline: 'Паліца, СТМ і высокая абарачальнасць',
          desc: 'Прадукцыя ў сучаснай спажывецкай упакоўцы (ПЭТ, Tetra Pak, МГС) з адзінымі штрыхкодамі GS1 GTIN.',
          bullets: [
            'Тэрміны прыдатнасці ад 14 да 180 сутак пад розныя фарматы магазінаў',
            'Выпуск прадукцыі пад уласнай гандлёвай маркай (СТМ) сетак',
            'Падтрымка прома-актыўнасцяў і гарантаваная наяўнасць на РЦ',
          ],
        },
        horeca: {
          title: 'HoReCa, піцэрыі і кавярні',
          tagline: 'Прафесійныя фарматы для кухні шэфа',
          desc: 'Тэрмастабільная мацарэла для печаў да 400 °C, вяршкі 33% без раслінных тлушчаў, смятана і безлактознае малако для барыста.',
          bullets: [
            'Зручныя фарматы 500 г, 1 кг, 2,5 кг і 4 кг без лішніх адходаў',
            'Стабільная плаўкасць і эластычная нітка без падгарання',
            'Адгрузка тэставых узораў тэхнолагам і брэнд-шэфам сеткі',
          ],
        },
        industrial: {
          title: 'Харчовыя вытворчасці і пякарні',
          tagline: 'Індустрыяльная сыравіна і буйны опт',
          desc: 'Сметанковае масла 82,5% у маналітах па 20 кг, сухое малако (САМ) у крафт-мяшках па 25 кг і стабільны тварог.',
          bullets: [
            'Кожная партыя суправаджаецца пашпартам якасці і пратаколам лабараторыі',
            'Рытмічныя кантрактныя адгрузкі па фіксаваным графіку',
            'Сыравінная фасоўка 20–25 кг з аптымальнай палетнай загрузкай',
          ],
        },
      },
      recommendedLabel: 'Запатрабаваныя пазіцыі сегмента',
      specBtn: 'Спецыфікацыя',
      quoteBtn: 'Запыт цаны',
      stepsTitle: 'Як мы будуем партнёрства',
      steps: [
        { num: '01', title: 'Падбор матрыцы', desc: 'Фарміруем асартымент і фасоўкі пад вашу сетку, кухню або вытворчасць.' },
        { num: '02', title: 'Узоры і аўдыт', desc: 'Перадаем тэставыя ўзоры тэхнолагам і прадастаўляем сертыфікаты FSSC 22000.' },
        { num: '03', title: 'Дагавор і EDI / ЭТТН', desc: 'Падключаем электронны дакументаабарот і ўзгадняем графік паставак.' },
        { num: '04', title: 'Халадовая дастаўка', desc: 'Адгружаем з рабатызаванага хаба з бесперапынным кантролем тэмпературы.' },
      ],
      features: [
        { title: 'Фарматы HoReCa і B2B', desc: 'Мацарэла для піцы 1 кг і 2,5 кг, вяршкі 33% 1 л, масла маналіт 20 кг, САМ 25 кг.' },
        { title: 'Уласны аўтапарк', desc: 'Штодзённая дастаўка рэфрыжэратарным транспартам з захаваннем рэжыму +2…+6 °C.' },
        { title: 'EDI і дакументаабарот', desc: 'Электронныя накладныя, GTIN-маркіроўка і дэкларацыі адпаведнасці ЕАЭС.' },
      ],
    },
    en: {
      seoDesc: 'Partnership terms for wholesale buyers, retail chains, and HoReCa foodservice operators.',
      badge: 'Direct Manufacturer Supply · B2B Portal',
      h1: 'For Wholesale Buyers, Retail & HoReCa',
      lead: 'Reliable direct dairy supply from Molochny Mir for retail chains, pizzerias, specialty coffee shops, bakeries, and food manufacturers.',
      metrics: [
        { value: '142+', label: 'Catalog SKUs' },
        { value: '4,200', label: 'Cold-chain pallet slots' },
        { value: '24 h', label: 'Order picking & dispatch' },
      ],
      deskTitle: 'Wholesale & HoReCa Sales Desk',
      deskSub: 'Volume pricing, EDI electronic invoicing, and sample kits for kitchen testing.',
      deskTerms: 'MOQ: from 1 Euro-pallet · Contract payment terms available',
      requestPrice: 'Request Wholesale Price List',
      browseCatalog: 'Full Catalog',
      segmentsTitle: 'Tailored Solutions for Your Business Segment',
      segmentsSub: 'Switch segments to preview best-fit dairy lines, packaging formats, and specs.',
      segments: {
        retail: {
          title: 'Retail Chains & Supermarkets',
          tagline: 'Shelf-ready packs, private label & turnover',
          desc: 'Consumer-ready PET, Tetra Pak, and MAP packaging featuring GS1 GTIN barcodes and reliable cold-chain freshness.',
          bullets: [
            'Shelf life from 14 to 180 days suited for regional and national retail hubs',
            'Private-label (OEM) manufacturing capabilities for partner retail brands',
            'Consistent promo stock allocation and automated distribution center delivery',
          ],
        },
        horeca: {
          title: 'HoReCa, Pizzerias & Cafés',
          tagline: 'Engineered performance for commercial kitchens',
          desc: 'High-heat pizza mozzarella rated up to 400 °C, pure 33% dairy whipping cream, thick sour cream, and lactose-free barista milk.',
          bullets: [
            'Practical 500g, 1kg, 2.5kg, and 4kg packs minimizing prep time and waste',
            'Uniform melting, clean stretch, and golden blistering without oil separation',
            'Trial sample boxes dispatched directly to culinary directors and chefs',
          ],
        },
        industrial: {
          title: 'Food Processing & Bakeries',
          tagline: 'Industrial dairy fats & milk ingredients',
          desc: '20kg blocks of 82.5% sweet cream butter for pastry lamination, 25kg spray-dried Skimmed Milk Powder (SMP), and bulk dairy bases.',
          bullets: [
            'Every shipment backed by accredited lab certificates and batch assays',
            'Scheduled contract deliveries aligned with your production calendar',
            'Industrial 20–25kg packaging optimized for pallet density',
          ],
        },
      },
      recommendedLabel: 'Top SKUs for this segment',
      specBtn: 'Spec Sheet',
      quoteBtn: 'Request Price',
      stepsTitle: '4-Step B2B Onboarding',
      steps: [
        { num: '01', title: 'Assortment Match', desc: 'Select retail or bulk HoReCa SKUs tailored to your format.' },
        { num: '02', title: 'Samples & QA Docs', desc: 'Receive kitchen test samples and FSSC 22000 / ISO certificates.' },
        { num: '03', title: 'Contract & EDI', desc: 'Set delivery schedule, volume pricing, and electronic EDI invoicing.' },
        { num: '04', title: 'Cold Fulfillment', desc: 'Dispatched from our automated cold hub with +2…+6 °C telemetry.' },
      ],
      features: [
        { title: 'HoReCa & Bulk Formats', desc: 'Pizza mozzarella 1kg/2.5kg, whipping cream 33% 1L, butter 20kg blocks, SMP 25kg bags.' },
        { title: 'Dedicated Fleet', desc: 'Daily chilled deliveries maintaining strict +2…+6 °C cold chain integrity.' },
        { title: 'Digital EDI & Docs', desc: 'Electronic invoices, GS1 GTIN barcodes, and full quality declarations.' },
      ],
    },
    zh: {
      seoDesc: '面向大宗批发商、连锁商超及 HoReCa 餐饮渠道的合作方案。',
      badge: '工厂直供 · B2B 商业合作专区',
      h1: '面向大宗批发、商超零售与餐饮渠道',
      lead: 'Molochny Mir 为国内外连锁商超、披萨餐饮、咖啡连锁、工业烘焙及食品加工企业提供稳定直供的高品质乳制品。',
      metrics: [
        { value: '142+', label: '可供应产品 SKU' },
        { value: '4,200', label: '冷链托盘库位' },
        { value: '24 小时', label: '快速分拣备货周期' },
      ],
      deskTitle: '大宗批发与餐饮销售中心',
      deskSub: '支持阶梯采购报价、EDI 电子单据及餐饮研发试样配送。',
      deskTerms: '起订量: 1 个标准欧式托盘起 · 支持合同账期结算',
      requestPrice: '获取批发报价单',
      browseCatalog: '浏览全部目录',
      segmentsTitle: '针对不同商业场景的定制方案',
      segmentsSub: '切换业务场景，即时查看匹配的核心乳品规格与技术参数。',
      segments: {
        retail: {
          title: '连锁商超与零售渠道',
          tagline: '货架即售包装与高周转表现',
          desc: 'PET 瓶、利乐无菌盒与气调锁鲜零售包装，全系标配 GS1 GTIN 国际条码。',
          bullets: [
            '14 至 180 天差异化保质期，全面适配冷藏与常温零售陈列',
            '支持零售商自有品牌 (OEM/ODM) 定制生产',
            '保障大促备货库存与区域分拨中心直配',
          ],
        },
        horeca: {
          title: 'HoReCa 餐饮、披萨与咖啡吧台',
          tagline: '专为商用厨房与星厨打造的稳定表现',
          desc: '耐 400 °C 高温拉丝马苏里拉奶酪、33% 纯动物淡奶油、浓稠酸奶油及咖啡专用零乳糖牛奶。',
          bullets: [
            '500克、1公斤、2.5公斤及4公斤商用规格，显著降低后厨损耗',
            '融化均匀、拉丝绵长且高温烘烤不易焦糊析油',
            '支持向餐饮研发中心与主厨团队寄送测试样品',
          ],
        },
        industrial: {
          title: '食品加工厂与工业烘焙',
          tagline: '工业级大包装乳脂与乳粉原料',
          desc: '20公斤出口规格 82.5% 天然无盐黄油、25公斤喷雾干燥脱脂奶粉 (SMP) 及高蛋白凝乳原料。',
          bullets: [
            '每批次均附带权威实验室质检报告与原厂质量合格证',
            '按工厂排产计划执行长期稳定的合约化发运',
            '20–25 公斤标准化工业包装，最大化托盘装载效率',
          ],
        },
      },
      recommendedLabel: '该渠道热销推荐产品',
      specBtn: '技术规格书',
      quoteBtn: '获取报价',
      stepsTitle: 'B2B 合作上线四步流程',
      steps: [
        { num: '01', title: '选品与规格匹配', desc: '按零售货架、餐饮后厨或工业产线需求匹配最佳包装规格。' },
        { num: '02', title: '寄送样品与资质审核', desc: '提供试制样品及 FSSC 22000 / ISO 9001 体系认证文件。' },
        { num: '03', title: '签署合同与 EDI 对接', desc: '确认阶梯价格、发运排期并启用电子对账单证。' },
        { num: '04', title: '全程温控冷链交付', desc: '由智能冷链物流中心完成标准化打托并全程温控发运。' },
      ],
      features: [
        { title: 'HoReCa 餐饮专供包装', desc: '1公斤/2.5公斤披萨马苏里拉奶酪、1升装33%淡奶油、20公斤块状黄油、25公斤脱脂奶粉。' },
        { title: '自有冷链车队', desc: '每日冷藏专车配送，严格保持 +2…+6 °C 恒温冷链。' },
        { title: '电子单据与合规溯源', desc: '支持 EDI 电子单证、GS1 GTIN 国际条码及完整质量合规声明。' },
      ],
    },
  }[language];

  const segmentTabs: {
    id: PartnerSegmentId;
    icon: React.FC<{ className?: string }>;
  }[] = [
    { id: 'horeca', icon: UtensilsCrossed },
    { id: 'retail', icon: Store },
    { id: 'industrial', icon: Factory },
  ];

  const currentSegment = copy.segments[activeSegment];

  const segmentProducts = useMemo(() => {
    const targetIds = SEGMENT_PRODUCT_IDS[activeSegment];
    const visibleMap = new Map(
      products.filter((p) => p.visible).map((p) => [p.id, p])
    );
    const matched = targetIds
    .map((id) => visibleMap.get(id))
    .filter((p): p is Product => Boolean(p));

    if (matched.length > 0) return matched;
    return products.filter((p) => p.visible).slice(0, 4);
  }, [products, activeSegment]);

  const featureIcons = [PackageCheck, Truck, FileSpreadsheet];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-14">
    <SeoHead
    title={`${t('navPartners')} — ${t('brandName')}`}
    description={copy.seoDesc}
    canonicalHash="/partners"
    />

    {/* 1. Architectural Hero + Direct Sales Desk */}
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-[#003b82] to-[#0057B8] text-white p-6 sm:p-10 lg:p-12 shadow-lg">
    <div
    aria-hidden="true"
    className="pointer-events-none absolute -right-20 -bottom-24 w-80 h-80 rounded-full bg-blue-400/15 blur-3xl"
    />

    <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
    <div className="lg:col-span-7 space-y-6">
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/12 border border-white/20 text-xs font-semibold tracking-wide">
    <Snowflake className="w-3.5 h-3.5 shrink-0" />
    <span>{copy.badge}</span>
    </div>

    <div className="space-y-3">
    <h1 className="font-display text-3xl sm:text-4xl lg:text-[2.65rem] font-bold tracking-tight leading-[1.15]">
    {copy.h1}
    </h1>
    <p className="text-sm sm:text-base text-blue-100 leading-relaxed max-w-2xl">
    {copy.lead}
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

    <div className="flex flex-wrap gap-3 pt-1">
    <Link
    to="/catalog"
    className="group inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-slate-900 bg-white rounded-xl hover:bg-blue-50 transition-colors"
    >
    <span>{copy.browseCatalog}</span>
    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
    </Link>
    <Link
    to="/export"
    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-white/12 border border-white/25 rounded-xl hover:bg-white/20 transition-colors"
    >
    <span>{t('navExport')}</span>
    </Link>
    </div>
    </div>

    <div className="lg:col-span-5 bg-white text-slate-900 rounded-2xl p-6 shadow-xl space-y-4">
    <div className="space-y-1">
    <h2 className="font-display text-lg font-bold text-slate-900">{copy.deskTitle}</h2>
    <p className="text-xs text-slate-500 leading-relaxed">{copy.deskSub}</p>
    </div>

    <div className="space-y-2 pt-1 text-sm font-mono tabular-nums text-slate-700 bg-slate-50 border border-slate-200 rounded-xl p-4">
    <div className="flex items-center gap-2.5">
    <Mail className="w-4 h-4 text-[#0057B8] shrink-0" />
    <a href="mailto:sales@milk.by" className="hover:text-[#0057B8] font-medium">
    sales@milk.by
    </a>
    </div>
    <div className="flex items-center gap-2.5">
    <Phone className="w-4 h-4 text-[#0057B8] shrink-0" />
    <a href="tel:+375152445501" className="hover:text-[#0057B8] font-medium">
    +375 (152) 44-55-01
    </a>
    </div>
    <div className="pt-1.5 border-t border-slate-200 text-xs text-slate-500 font-sans">
    {copy.deskTerms}
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
    <span>{copy.requestPrice}</span>
    </button>
    </div>
    </div>
    </section>

    {/* 2. Interactive Business Segment Selector + Real Segment SKUs */}
    <section className="space-y-6">
    <div className="space-y-1.5">
    <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
    {copy.segmentsTitle}
    </h2>
    <p className="text-sm sm:text-base text-slate-600">{copy.segmentsSub}</p>
    </div>

    {/* Segment Tabs */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4" role="tablist">
    {segmentTabs.map(({ id, icon: Icon }) => {
      const seg = copy.segments[id];
      const active = activeSegment === id;
      return (
        <button
        key={id}
        type="button"
        role="tab"
        aria-selected={active}
        onClick={() => setActiveSegment(id)}
        className={`text-left p-5 rounded-2xl border transition-all duration-200 flex items-start gap-3.5 ${
          active
          ? 'bg-blue-50/70 border-[#0057B8] shadow-sm ring-1 ring-[#0057B8]/20'
          : 'bg-white border-slate-200 hover:border-[#0057B8]/40 hover:bg-slate-50/60'
        }`}
        >
        <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
          active ? 'bg-[#0057B8] text-white' : 'bg-slate-100 text-slate-600'
        }`}
        >
        <Icon className="w-5 h-5" />
        </div>
        <div className="min-w-0">
        <div className="font-display text-base font-bold text-slate-900">
        {seg.title}
        </div>
        <div className="text-xs text-slate-500 mt-0.5">{seg.tagline}</div>
        </div>
        </button>
      );
    })}
    </div>

    {/* Segment Spotlight Panel */}
    <div
    role="tabpanel"
    className="border border-slate-200 rounded-2xl bg-slate-50/70 p-5 sm:p-8 space-y-6"
    >
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
    <div className="lg:col-span-5 space-y-4">
    <h3 className="font-display text-xl font-bold text-slate-900">
    {currentSegment.title}
    </h3>
    <p className="text-sm text-slate-600 leading-relaxed">{currentSegment.desc}</p>
    <ul className="space-y-2.5 pt-1">
    {currentSegment.bullets.map((bullet) => (
      <li key={bullet} className="flex items-start gap-2.5 text-sm text-slate-700">
      <CheckCircle2 className="w-4 h-4 text-[#0057B8] shrink-0 mt-0.5" />
      <span>{bullet}</span>
      </li>
    ))}
    </ul>
    </div>

    <div className="lg:col-span-7 space-y-3">
    <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
    {copy.recommendedLabel}
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    {segmentProducts.map((prod) => {
      const cat = categories.find((c) => c.id === prod.category);
      return (
        <div
        key={prod.id}
        className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between gap-3.5 hover:border-[#0057B8]/40 hover:shadow-md transition-all duration-200"
        >
        <div className="flex items-start gap-3">
        <Link
        to={`/product/${prod.slug}`}
        className="w-16 h-16 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0"
        >
        <ImageWithFallback
        src={prod.image}
        alt={localize(prod.name)}
        className="w-full h-full object-cover"
        />
        </Link>
        <div className="min-w-0 flex-1 space-y-1">
        <Link
        to={`/product/${prod.slug}`}
        className="inline-flex items-start gap-1 text-sm font-semibold text-slate-900 hover:text-[#0057B8] leading-snug"
        >
        <span>{localize(prod.name)}</span>
        <ArrowUpRight className="w-3.5 h-3.5 shrink-0 mt-0.5 opacity-60" />
        </Link>
        <div className="text-xs text-slate-500 tabular-nums">
        {prod.fatContent !== undefined ? `${prod.fatContent}% · ` : ''}
        {prod.packages.map((p) => p.weight).join(' / ')}
        </div>
        </div>
        </div>

        <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
        <button
        type="button"
        onClick={() => downloadProductB2BSpec(prod, cat, language)}
        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
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
        className="px-3 py-1.5 text-xs font-semibold text-white bg-[#0057B8] rounded-lg hover:bg-[#004494] transition-colors"
        >
        {copy.quoteBtn}
        </button>
        </div>
        </div>
      );
    })}
    </div>
    </div>
    </div>
    </div>
    </section>

    {/* 3. 4-Step B2B Onboarding */}
    <section className="space-y-5">
    <h2 className="font-display text-2xl font-bold text-slate-900">{copy.stepsTitle}</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
    {copy.steps.map((s) => (
      <div
      key={s.num}
      className="border border-slate-200 rounded-2xl p-6 space-y-2.5 bg-white hover:border-[#0057B8]/40 transition-colors"
      >
      <div className="font-mono text-xs font-bold text-[#0057B8]">{s.num}</div>
      <h3 className="font-display text-base font-semibold text-slate-900">{s.title}</h3>
      <p className="text-sm text-slate-600 leading-relaxed">{s.desc}</p>
      </div>
    ))}
    </div>
    </section>

    {/* 4. Operational Pillars */}
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {copy.features.map((feat, idx) => {
      const Icon = featureIcons[idx];
      return (
        <div
        key={feat.title}
        className="bg-slate-50/80 border border-slate-200 rounded-2xl p-6 space-y-2.5"
        >
        <Icon className="w-5 h-5 text-[#0057B8]" />
        <h3 className="font-display text-base font-semibold text-slate-900">{feat.title}</h3>
        <p className="text-sm text-slate-600 leading-relaxed">{feat.desc}</p>
        </div>
      );
    })}
    </section>

    <B2BInquiryModal
    open={modalOpen}
    onClose={() => setModalOpen(false)}
    product={selectedProduct}
    defaultChannel="wholesale"
    />
    </div>
  );
};
