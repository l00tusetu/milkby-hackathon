import { Language, LocalizedText } from '../types';

export const LANGUAGES: { code: Language; label: string; nativeName: string }[] = [
  { code: 'ru', label: 'RU', nativeName: 'Русский' },
  { code: 'be', label: 'BE', nativeName: 'Беларуская' },
  { code: 'en', label: 'EN', nativeName: 'English' },
  { code: 'zh', label: 'ZH', nativeName: '中文' },
];

export const defaultTranslations: Record<string, LocalizedText> = {
  "brandName": {
    "ru": "Молочный Мир",
    "be": "Малочны Мір",
    "en": "Molochny Mir",
    "zh": "Molochny Mir"
  },
  "navCatalog": {
    "ru": "Продукция",
    "be": "Прадукцыя",
    "en": "Products",
    "zh": "产品目录"
  },
  "navBusiness": {
    "ru": "B2B и Экспорт",
    "be": "B2B і Экспарт",
    "en": "B2B & Export",
    "zh": "商业与出口"
  },
  "navExport": {
    "ru": "Экспорт",
    "be": "Экспарт",
    "en": "Export",
    "zh": "国际出口"
  },
  "navPartners": {
    "ru": "Партнёрам",
    "be": "Партнёрам",
    "en": "B2B Partners",
    "zh": "商业合作"
  },
  "navNews": {
    "ru": "Новости",
    "be": "Навіны",
    "en": "News",
    "zh": "新闻动态"
  },
  "navAbout": {
    "ru": "О компании",
    "be": "Пра кампанію",
    "en": "About",
    "zh": "关于我们"
  },
  "navContacts": {
    "ru": "Контакты",
    "be": "Кантакты",
    "en": "Contacts",
    "zh": "联系我们"
  },
  "ctaContact": {
    "ru": "Связаться",
    "be": "Звязацца",
    "en": "Contact Sales",
    "zh": "联系销售"
  },
  "heroTitle": {
    "ru": "Не просто молоко. Главный ингредиент вашего вкуса.",
    "be": "Не проста малако. Галоўны інгрэдыент вашага смаку.",
    "en": "Beyond ordinary dairy. Bold flavor in every drop.",
    "zh": "不止于纯鲜牛奶，更定义每一口醇正风味"
  },
  "heroSubtitle": {
    "ru": "Тягучая моцарелла для идеальной пиццы, выдержанные сыры с характером, нежный пломбир и свежайшее молоко с гродненских ферм — для вашего дома, кухни шеф-повара и поставок в 25+ стран.",
    "be": "Цягучая мацарэла для ідэальнай піцы, вытрыманыя сыры з характарам, далікатны пламбір і свежае малако з гродзенскіх ферм — для вашага дома, кухні шэфа і паставак у 25+ краін.",
    "en": "Stretchy pizzeria mozzarella, 90-day reserve cheeses, creamy plombir, and farm-fresh milk from Grodno — crafted for home tables, top chefs, and partners in 25+ countries.",
    "zh": "高温拉丝的披萨马苏里拉奶酪、90天窖藏陈年干酪、丝滑冰淇淋与牧场直采鲜乳——为您家庭餐桌、专业星厨与全球25+国家供应链注入纯粹美味。"
  },
  "heroPrimaryCta": {
    "ru": "Выбрать продукцию",
    "be": "Абраць прадукцыю",
    "en": "Explore Products",
    "zh": "探索全部产品"
  },
  "heroSecondaryCta": {
    "ru": "Бизнесу и экспорту",
    "be": "Бізнэсу і экспарту",
    "en": "B2B & Global Export",
    "zh": "B2B 与国际出口"
  },
  "roleConsumerTitle": {
    "ru": "Потребителю",
    "be": "Спажыўцу",
    "en": "For Consumers",
    "zh": "终端消费者"
  },
  "roleConsumerDesc": {
    "ru": "Свежие сыры, молоко, йогурты и мороженое",
    "be": "Свежыя сыры, малако, ёгурты і марозіва",
    "en": "Fresh cheeses, milk, yogurts, and ice cream",
    "zh": "新鲜奶酪、纯牛奶、酸奶与冰淇淋"
  },
  "roleB2BTitle": {
    "ru": "Оптовому покупателю",
    "be": "Аптоваму пакупніку",
    "en": "Wholesale & HoReCa",
    "zh": "批发与餐饮客户"
  },
  "roleB2BDesc": {
    "ru": "Фасовки HoReCa, логистика и отдел продаж",
    "be": "Фасоўкі HoReCa, лагістыка і аддзел продажаў",
    "en": "HoReCa packs, cold-chain terms, direct sales",
    "zh": "餐饮大包装、冷链物流与销售对接"
  },
  "roleExportTitle": {
    "ru": "Зарубежному партнёру",
    "be": "Замежнаму партнёру",
    "en": "Global Export",
    "zh": "海外进口商"
  },
  "roleExportDesc": {
    "ru": "СОМ, масло, сыры, сертификаты и спецификации",
    "be": "САМ, масла, сыры, сертыфікаты і спецыфікацыі",
    "en": "SMP, butter, aged cheese, export specs",
    "zh": "脱脂奶粉、黄油、奶酪与出口认证"
  },
  "roleMediaTitle": {
    "ru": "СМИ и партнёрам",
    "be": "СМІ і партнёрам",
    "en": "Press & Corporate",
    "zh": "媒体与企业动态"
  },
  "roleMediaDesc": {
    "ru": "Новости производства, награды и история",
    "be": "Навіны вытворчасці, узнагароды і гісторыя",
    "en": "Production news, awards, and company facts",
    "zh": "工厂新闻、行业奖项与企业简介"
  },
  "featuredHeading": {
    "ru": "Вкусы, которые выбирают каждый день",
    "be": "Смакі, якія выбіраюць кожны дзень",
    "en": "Signature Dairy Selection",
    "zh": "核心精选乳品矩阵"
  },
  "allProductsLink": {
    "ru": "Весь каталог",
    "be": "Увесь каталог",
    "en": "Full catalog",
    "zh": "查看全部产品"
  },
  "searchPlaceholder": {
    "ru": "Умный поиск: «молоко», «сыр для пиццы», «без лактозы», «масло 82.5»…",
    "be": "Разумны пошук: «малако», «сыр для піцы», «без лактозы», «масла 82.5»…",
    "en": "Smart search: \"milk\", \"pizza cheese\", \"lactose-free\", \"butter 82.5\"…",
    "zh": "智能搜索：“鲜牛奶”、“披萨奶酪”、“无乳糖”、“黄油 82.5”…"
  },
  "smartFinderTitle": {
    "ru": "Умный подбор продукции",
    "be": "Разумны падбор прадукцыі",
    "en": "Smart Product Matcher",
    "zh": "智能选品助手"
  },
  "smartFinderSubtitle": {
    "ru": "Опишите задачу своими словами — например, для пиццы, высокой белковой диеты, выпечки, экспорта или без лактозы",
    "be": "Апішыце задачу сваімі словамі — для піцы, высокабялковага рацыёну, выпечкі, экспарту ці без лактозы",
    "en": "Describe your culinary, dietary, or B2B goal in plain language to match real products and pack sizes",
    "zh": "用自然语言描述您的烹饪、营养或出口需求，系统将精准匹配目录产品与推荐规格"
  },
  "smartFinderPlaceholder": {
    "ru": "Например: «сыр для пиццы 1 кг», «без лактозы», «много белка до 5% жира»…",
    "be": "Напрыклад: «сыр для піцы 1 кг», «без лактозы», «шмат бялку да 5% тлушчу»…",
    "en": "Try: \"pizza cheese 1kg\", \"lactose-free\", \"high protein under 5% fat\"…",
    "zh": "例如：“1公斤披萨奶酪”、“无乳糖”、“高蛋白低脂”…"
  },
  "requestSalesBtn": {
    "ru": "Запросить информацию / Связаться с отделом продаж",
    "be": "Запытаць інфармацыю / Звязацца з аддзелам продажаў",
    "en": "Request Info / Contact Sales Department",
    "zh": "咨询产品信息 / 联系销售部门"
  },
  "downloadSpecBtn": {
    "ru": "Скачать B2B-спецификацию (PDF)",
    "be": "Спампаваць B2B-спецыфікацыю (PDF)",
    "en": "Download B2B Spec Sheet (PDF)",
    "zh": "下载 B2B 产品规格书 (PDF)"
  },
  "adminTitle": {
    "ru": "CMS-панель управления контентом",
    "be": "CMS-панэль кіравання кантэнтам",
    "en": "Content & Catalog CMS",
    "zh": "内容与目录管理后台 (CMS)"
  },
  "footerLegal": {
    "ru": "ОАО «Молочный Мир» · УНП 500040357 · 230005, г. Гродно, ул. Гаспадарчая, 28",
    "be": "ААТ «Малочны Мір» · УНП 500040357 · 230005, г. Гродна, вул. Гаспадарчая, 28",
    "en": "Molochny Mir JSC · 28 Gaspadarchaya St, Grodno 230005, Belarus",
    "zh": "Molochny Mir 股份公司 · 白俄罗斯格罗德诺市 Gaspadarchaya 街28号"
  }
};
