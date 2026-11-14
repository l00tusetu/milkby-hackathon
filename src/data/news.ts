import { LocalizedText, NewsArticle, NewsCategoryId } from '../types';
import { ASSETS } from './assets';

export const NEWS_CATEGORY_LABELS: Record<NewsCategoryId, LocalizedText> = {
  export: { ru: 'Экспорт', be: 'Экспарт', en: 'Export', zh: '国际出口' },
  products: { ru: 'Продукция', be: 'Прадукцыя', en: 'Products', zh: '新品发布' },
  company: { ru: 'Компания', be: 'Кампанія', en: 'Company', zh: '企业动态' },
  awards: { ru: 'Награды', be: 'Узнагароды', en: 'Awards', zh: '荣誉奖项' },
};

export const newsArticles: NewsArticle[] = [
  {
    id: 'cheese-export-china-2026',
    slug: 'cheese-export-china-2026',
    date: '2026-10-18',
    year: 2026,
    categoryId: 'export',
    title: {
      ru: 'ОАО «Молочный Мир» расширило поставки выдержанных сыров и сухого молока в страны Азии',
      be: 'ААТ «Малочны Мір» пашырыла пастаўкі вытрыманых сыроў і сухога малака ў краіны Азіі',
      en: 'Molochny Mir Expands Aged Cheese and Dry Dairy Shipments to Asia',
      zh: 'Molochny Mir 进一步扩大陈年奶酪与干乳制品对亚洲市场出口',
    },
    excerpt: {
      ru: 'Подтверждена аккредитация новой линии распылительной сушки и отгружены первые контейнерные партии сыра «ГороденЪ» и СОМ в Китай и Вьетнам.',
      be: 'Пацверджана акрэдытацыя новай лініі і адгружаны першыя кантэйнерныя партыі сыру і САМ у Кітай і В’етнам.',
      en: 'Following renewed GACC accreditation, the enterprise dispatched container shipments of Goroden aged cheese and SMP to China and Vietnam.',
      zh: '随着GACC资质更新完成，公司已向中国及越南发运首批Goroden陈年奶酪与脱脂奶粉集装箱货柜。',
    },
    content: {
      ru: 'По итогам международного аудита систем безопасности пищевых продуктов FSSC 22000 и подтверждения экспортных сертификатов ISO 9001 и GACC ОАО «Молочный Мир» увеличило экспортные отгрузки в страны Юго-Восточной Азии и Китай на 28% по сравнению с аналогичным периодом прошлого года. Основной драйвер роста — сухое обезжиренное молоко (СОМ) в крафт-мешках по 25 кг, масло сливочное 82,5% в монолитах и выдержанные полутвёрдые сыры с длительным сроком хранения.',
      be: 'Па выніках міжнароднага аўдыту FSSC 22000 і пацвярджэння сертыфікатаў ISO 9001 і GACC ААТ «Малочны Мір» павялічыла экспартныя адгрузкі ў краіны Паўднёва-Усходняй Азіі і Кітай на 28%. Асноўны драйвер росту — сухое абястлушчанае малако ў мяшках па 25 кг, масла 82,5% і вытрыманыя сыры.',
      en: 'Following a successful international FSSC 22000 food safety audit alongside ISO 9001 and China GACC confirmations, Molochny Mir increased export volume to Southeast Asia and China by 28% year-over-year. Growth was led by 25kg Skimmed Milk Powder bags, 20kg 82.5% butter blocks, and long-shelf-life aged cheeses.',
      zh: '在顺利通过FSSC 22000食品安全体系国际审核并更新ISO 9001与GACC出口认证后，Molochny Mir 对东南亚及中国市场的出口量同比增长28%。25公斤装脱脂奶粉、20公斤装82.5%天然黄油及长保质期陈年奶酪成为核心增长引擎。',
    },
    image: ASSETS.newsDairyFacility,
    published: true,
    relatedIds: ['new-mozzarella-horeca-line', 'active-life-protein-award'],
    seo: {
      title: {
        ru: 'Расширение экспортных поставок в Азию и Китай | Новости Молочный Мир',
        be: 'Пашырэнне экспартных паставак у Азію і Кітай | Навіны Малочны Мір',
        en: 'Asian & China Export Expansion 2026 | Molochny Mir News',
        zh: '亚洲及中国市场出口业务扩展 | Molochny Mir 新闻',
      },
      description: {
        ru: 'ОАО «Молочный Мир» увеличило экспорт сухого молока СОМ и выдержанных сыров в Китай и страны Азии на 28%.',
        be: 'ААТ «Малочны Мір» павялічыла экспарт САМ і вытрыманых сыроў у Кітай на 28%.',
        en: 'Molochny Mir increases exports of SMP and aged cheeses to China and Southeast Asia by 28%.',
        zh: 'Molochny Mir 对中国及东南亚脱脂奶粉和陈年奶酪出口量增长28%。',
      },
    },
  },
  {
    id: 'new-mozzarella-horeca-line',
    slug: 'new-mozzarella-horeca-line',
    date: '2026-08-05',
    year: 2026,
    categoryId: 'products',
    title: {
      ru: 'Запущена новая автоматизированная линия сыров Паста Филата для сегмента HoReCa',
      be: 'Запушчана новая аўтаматызаваная лінія сыроў Паста Філата для сегмента HoReCa',
      en: 'New Automated Pasta Filata Mozzarella Line Launched for HoReCa',
      zh: '全新全自动 HoReCa 餐饮专用马苏里拉奶酪生产线正式投产',
    },
    excerpt: {
      ru: 'Производственная мощность увеличена на 15 тонн в сутки; в ассортименте появились форматы 1 кг и 2,5 кг для сетей пиццерий.',
      be: 'Вытворчая магутнасць павялічана на 15 тон у суткі; з’явіліся фарматы 1 кг і 2,5 кг для піцэрый.',
      en: 'Daily capacity rises by 15 metric tons with dedicated 1kg and 2.5kg vacuum blocks tailored for pizzeria chains.',
      zh: '日产能提升15吨，并新增专为连锁披萨店研发的1公斤与2.5公斤真空包装规格。',
    },
    content: {
      ru: 'Модернизация сыродельного цеха в Гродно позволила внедрить закрытую европейскую линию вытяжения сырного теста с точным контролем влажности и pH. Это гарантирует стабильное плавление и отсутствие подгорания Моцареллы для пиццы в печах с температурой до 400 °C. Новые фасовки 500 г, 1 кг и 2,5 кг уже доступны для оптовых партнёров.',
      be: 'Мадэрнізацыя сыраробнага цэха ў Гродне дазволіла ўкараніць закрытую еўрапейскую лінію выцяжэння сырнага цеста з дакладным кантролем вільготнасці.',
      en: 'The modernization of the Grodno cheese plant introduced a closed European pasta filata stretching line with precision moisture and pH control, guaranteeing consistent melt at 400°C oven temperatures. 500g, 1kg, and 2.5kg formats are now open for B2B ordering.',
      zh: '格罗德诺奶酪车间的现代化改造引入了全封闭欧洲拉伸凝乳生产线，实现精准水分与pH值控制，确保披萨奶酪在400°C高温烤炉中稳定拉丝不焦糊。',
    },
    image: ASSETS.productMozzarella,
    published: true,
    relatedIds: ['cheese-export-china-2026', 'grodno-cold-chain-2025'],
    seo: {
      title: {
        ru: 'Запуск новой линии Моцареллы HoReCa — Новости ОАО «Молочный Мир»',
        be: 'Запуск новай лініі Мацарэлы HoReCa — Навіны ААТ «Малочны Мір»',
        en: 'New Automated Mozzarella HoReCa Production Line | Molochny Mir',
        zh: '全自动 HoReCa 马苏里拉奶酪生产线投产 | Molochny Mir',
      },
      description: {
        ru: 'Новая линия Паста Филата в Гродно увеличила выпуск Моцареллы для пиццы на 15 тонн в сутки.',
        be: 'Новая лінія Паста Філата ў Гродне павялічыла выпуск Мацарэлы на 15 тон у суткі.',
        en: 'Automated pasta filata line in Grodno adds 15 tons daily mozzarella output for pizzerias.',
        zh: '格罗德诺全新拉伸凝乳生产线投产，日新增15吨餐饮专用马苏里拉产能。',
      },
    },
  },
  {
    id: 'active-life-protein-award',
    slug: 'active-life-protein-award',
    date: '2025-11-22',
    year: 2025,
    categoryId: 'awards',
    title: {
      ru: 'Линейка Active Life удостоена Гран-при международного дегустационного конкурса',
      be: 'Лінейка Active Life атрымала Гран-пры міжнароднага дэгустацыйнага конкурсу',
      en: 'Active Life High-Protein & Lactose-Free Range Wins International Grand Prix',
      zh: 'Active Life 高蛋白及无乳糖系列荣获国际乳品品鉴大奖',
    },
    excerpt: {
      ru: 'Экспертное жюри отметило греческий йогурт High Protein и безлактозное молоко 2,5% за чистый состав и сбалансированный вкус.',
      be: 'Экспертнае журы адзначыла грэчаскі ёгурт High Protein і безлактознае малако 2,5%.',
      en: 'International sensory judges awarded gold medals to Active Life High-Protein Greek Yogurt and 2.5% Lactose-Free Milk.',
      zh: '国际评委团授予 Active Life 高蛋白希腊酸奶及2.5%无乳糖牛奶纯正配方金奖。',
    },
    content: {
      ru: 'На ежегодном международном конкурсе качества молочной продукции линейка функционального питания Active Life получила высшие баллы по органолептическим и микробиологическим показателям. Особое признание получил греческий йогурт с 8 г белка без добавления сахара и крахмала.',
      be: 'На штогадовым міжнародным конкурсе якасці малочнай прадукцыі лінейка Active Life атрымала вышэйшыя балы.',
      en: 'At the annual international dairy quality competition, the Active Life functional nutrition range achieved top scores in sensory and microbiological benchmarks, highlighted by the 8g-protein Greek yogurt.',
      zh: '在年度国际乳制品质量大赛中，Active Life 功能营养系列凭借洁净配方与卓越口感获评最高分。',
    },
    image: ASSETS.productGreekYogurt,
    published: true,
    relatedIds: ['grodno-cold-chain-2025', 'cheese-export-china-2026'],
    seo: {
      title: {
        ru: 'Награда Гран-при для линейки Active Life | Молочный Мир',
        be: 'Узнагарода Гран-пры для лінейкі Active Life | Малочны Мір',
        en: 'Active Life Range International Grand Prix Award | Molochny Mir',
        zh: 'Active Life 系列荣获国际乳品大奖 | Molochny Mir',
      },
      description: {
        ru: 'Греческий йогурт High Protein и безлактозное молоко Active Life признаны лучшими продуктами года.',
        be: 'Грэчаскі ёгурт і безлактознае малако Active Life прызнаны лепшымі прадуктамі года.',
        en: 'Active Life High-Protein Greek Yogurt and Lactose-Free Milk win international gold awards.',
        zh: 'Active Life 高蛋白酸奶与无乳糖牛奶荣获国际质量金奖。',
      },
    },
  },
  {
    id: 'grodno-cold-chain-2025',
    slug: 'grodno-cold-chain-2025',
    date: '2024-09-14',
    year: 2024,
    categoryId: 'company',
    title: {
      ru: 'Введён в эксплуатацию роботизированный распределительный центр с контролем холодовой цепи',
      be: 'Уведзены ў эксплуатацыю рабатызаваны размеркавальны цэнтр з кантролем халадовага ланцуга',
      en: 'Automated Cold-Chain Distribution Hub Commissioned in Grodno',
      zh: '格罗德诺全自动冷链物流分拨中心正式启用',
    },
    excerpt: {
      ru: 'Новый логистический терминал вмещает 4 200 паллетомест и сокращает время комплектации экспортных и оптовых отгрузок на 40%.',
      be: 'Новы лагістычны тэрмінал змяшчае 4 200 палетамесцаў і паскарае адгрузку на 40%.',
      en: 'The 4,200-pallet automated cold warehouse cuts wholesale and export dispatch lead times by 40%.',
      zh: '拥有4,200个托盘位的智能冷链中心将大宗批发及出口备货周期缩短了40%。',
    },
    content: {
      ru: 'Новый логистический хаб оснащён многозональными камерами (+2…+6 °C и -18 °C) с круглосуточным телеметрическим мониторингом температуры и автоматизированной системой WMS. Это позволяет гарантировать безупречную свежесть продукции при поставках как по всей Беларуси, так и на удалённые экспортные рынки.',
      be: 'Новы лагістычны хаб аснашчаны шматзанальнымі камерамі (+2…+6 °C і -18 °C) і аўтаматызаванай сістэмай WMS.',
      en: 'Equipped with dual-zone climate chambers (+2…+6 °C and -18 °C) and automated WMS tracking, the hub ensures uninterrupted cold-chain integrity for domestic retail and international export.',
      zh: '该中心配备+2至+6°C冷藏库与-18°C冷冻库及全自动WMS仓储系统，保障乳制品从工厂到全球客户端的全程新鲜。',
    },
    image: ASSETS.heroDairyShowcase,
    published: true,
    relatedIds: ['new-mozzarella-horeca-line', 'cheese-export-china-2026'],
    seo: {
      title: {
        ru: 'Новый роботизированный распределительный центр | Молочный Мир',
        be: 'Новы рабатызаваны размеркавальны цэнтр | Малочны Мір',
        en: 'Automated Cold-Chain Distribution Hub | Molochny Mir',
        zh: '全自动冷链物流分拨中心启用 | Molochny Mir',
      },
      description: {
        ru: 'Логистический терминал на 4 200 паллетомест ускоряет оптовые и экспортные отгрузки ОАО «Молочный Мир».',
        be: 'Лагістычны тэрмінал на 4 200 палетамесцаў паскарае адгрузкі ААТ «Малочны Мір».',
        en: '4,200-pallet automated cold-chain warehouse commissioned for faster B2B and export fulfillment.',
        zh: '4,200托盘位智能冷链物流中心全面提升批发与出口发货效率。',
      },
    },
  },
];
