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
    "id": "cheese-export-china-2026",
    "slug": "cheese-export-china-2026",
    "date": "2026-10-18",
    "year": 2026,
    "categoryId": "export",
    "title": {
      "ru": "ОАО «Молочный Мир» расширило поставки выдержанных сыров и сухого молока в страны Азии",
      "be": "ААТ «Малочны Мір» пашырыла пастаўкі вытрыманых сыроў і сухога малака ў краіны Азіі",
      "en": "Molochny Mir Expands Aged Cheese and Dry Dairy Shipments to Asia",
      "zh": "Molochny Mir 进一步扩大陈年奶酪与干乳制品对亚洲市场出口"
    },
    "excerpt": {
      "ru": "Подтверждена аккредитация новой линии распылительной сушки и отгружены первые контейнерные партии сыра «ГороденЪ» и СОМ в Китай и Вьетнам.",
      "be": "Пацверджана акрэдытацыя новай лініі і адгружаны першыя кантэйнерныя партыі сыру і САМ у Кітай і В’етнам.",
      "en": "Following renewed GACC accreditation, the enterprise dispatched container shipments of Goroden aged cheese and SMP to China and Vietnam.",
      "zh": "随着GACC资质更新完成，公司已向中国及越南发运首批Goroden陈年奶酪与脱脂奶粉集装箱货柜。"
    },
    "content": {
      "ru": "По итогам международного аудита систем безопасности пищевых продуктов FSSC 22000 и подтверждения экспортных сертификатов ISO 9001 и GACC ОАО «Молочный Мир» увеличило экспортные отгрузки в страны Юго-Восточной Азии и Китай на 28% по сравнению с аналогичным периодом прошлого года. Основной драйвер роста — сухое обезжиренное молоко (СОМ) в крафт-мешках по 25 кг, масло сливочное 82,5% в монолитах и выдержанные полутвёрдые сыры с длительным сроком хранения.",
      "be": "Па выніках міжнароднага аўдыту FSSC 22000 і пацвярджэння сертыфікатаў ISO 9001 і GACC ААТ «Малочны Мір» павялічыла экспартныя адгрузкі ў краіны Паўднёва-Усходняй Азіі і Кітай на 28%.",
      "en": "Following a successful international FSSC 22000 food safety audit alongside ISO 9001 and China GACC confirmations, Molochny Mir increased export volume to Southeast Asia and China by 28% year-over-year. Growth was led by 25kg Skimmed Milk Powder bags, 20kg 82.5% butter blocks, and long-shelf-life aged cheeses.",
      "zh": "在顺利通过FSSC 22000食品安全体系国际审核并更新ISO 9001与GACC出口认证后，Molochny Mir 对东南亚及中国市场的出口量同比增长28%。"
    },
    "image": ASSETS.newsDairyFacility,
    "published": true,
    "relatedIds": [
      "new-mozzarella-horeca-line",
      "gacc-smp-renewal-2026"
    ],
    "seo": {
      "title": {
        "ru": "ОАО «Молочный Мир» расширило поставки выдержанных сыров и сухого молока в страны Азии | Новости Молочный Мир",
        "be": "ААТ «Малочны Мір» пашырыла пастаўкі вытрыманых сыроў і сухога малака ў краіны Азіі | Навіны Малочны Мір",
        "en": "Molochny Mir Expands Aged Cheese and Dry Dairy Shipments to Asia | Molochny Mir News",
        "zh": "Molochny Mir 进一步扩大陈年奶酪与干乳制品对亚洲市场出口 | Molochny Mir 新闻"
      },
      "description": {
        "ru": "Подтверждена аккредитация новой линии распылительной сушки и отгружены первые контейнерные партии сыра «ГороденЪ» и СОМ в Китай и Вьетнам.",
        "be": "Пацверджана акрэдытацыя новай лініі і адгружаны першыя кантэйнерныя партыі сыру і САМ у Кітай і В’етнам.",
        "en": "Following renewed GACC accreditation, the enterprise dispatched container shipments of Goroden aged cheese and SMP to China and Vietnam.",
        "zh": "随着GACC资质更新完成，公司已向中国及越南发运首批Goroden陈年奶酪与脱脂奶粉集装箱货柜。"
      }
    }
  },
  {
    "id": "new-mozzarella-horeca-line",
    "slug": "new-mozzarella-horeca-line",
    "date": "2026-08-05",
    "year": 2026,
    "categoryId": "products",
    "title": {
      "ru": "Запущена новая автоматизированная линия сыров Паста Филата для сегмента HoReCa",
      "be": "Запушчана новая аўтаматызаваная лінія сыроў Паста Філата для сегмента HoReCa",
      "en": "New Automated Pasta Filata Mozzarella Line Launched for HoReCa",
      "zh": "全新全自动 HoReCa 餐饮专用马苏里拉奶酪生产线正式投产"
    },
    "excerpt": {
      "ru": "Производственная мощность увеличена на 15 тонн в сутки; в ассортименте появились форматы 1 кг и 2,5 кг для сетей пиццерий.",
      "be": "Вытворчая магутнасць павялічана на 15 тон у суткі; з’явіліся фарматы 1 кг і 2,5 кг для піцэрый.",
      "en": "Daily capacity rises by 15 metric tons with dedicated 1kg and 2.5kg vacuum blocks tailored for pizzeria chains.",
      "zh": "日产能提升15吨，并新增专为连锁披萨店研发的1公斤与2.5公斤真空包装规格。"
    },
    "content": {
      "ru": "Модернизация сыродельного цеха в Гродно позволила внедрить закрытую европейскую линию вытяжения сырного теста с точным контролем влажности и pH. Это гарантирует стабильное плавление и отсутствие подгорания Моцареллы для пиццы в печах с температурой до 400 °C.",
      "be": "Мадэрнізацыя сыраробнага цэха ў Гродне дазволіла ўкараніць закрытую еўрапейскую лінію выцяжэння сырнага цеста з дакладным кантролем вільготнасці.",
      "en": "The modernization of the Grodno cheese plant introduced a closed European pasta filata stretching line with precision moisture and pH control, guaranteeing consistent melt at 400°C oven temperatures.",
      "zh": "格罗德诺奶酪车间的现代化改造引入了全封闭欧洲拉伸凝乳生产线，确保披萨奶酪在400°C高温烤炉中稳定拉丝不焦糊。"
    },
    "image": ASSETS.productMozzarella,
    "published": true,
    "relatedIds": [
      "cheese-export-china-2026",
      "grodno-cold-chain-2025"
    ],
    "seo": {
      "title": {
        "ru": "Запущена новая автоматизированная линия сыров Паста Филата для сегмента HoReCa | Новости Молочный Мир",
        "be": "Запушчана новая аўтаматызаваная лінія сыроў Паста Філата для сегмента HoReCa | Навіны Малочны Мір",
        "en": "New Automated Pasta Filata Mozzarella Line Launched for HoReCa | Molochny Mir News",
        "zh": "全新全自动 HoReCa 餐饮专用马苏里拉奶酪生产线正式投产 | Molochny Mir 新闻"
      },
      "description": {
        "ru": "Производственная мощность увеличена на 15 тонн в сутки; в ассортименте появились форматы 1 кг и 2,5 кг для сетей пиццерий.",
        "be": "Вытворчая магутнасць павялічана на 15 тон у суткі; з’явіліся фарматы 1 кг і 2,5 кг для піцэрый.",
        "en": "Daily capacity rises by 15 metric tons with dedicated 1kg and 2.5kg vacuum blocks tailored for pizzeria chains.",
        "zh": "日产能提升15吨，并新增专为连锁披萨店研发的1公斤与2.5公斤真空包装规格。"
      }
    }
  },
  {
    "id": "gacc-smp-renewal-2026",
    "slug": "gacc-smp-renewal-2026",
    "date": "2026-06-12",
    "year": 2026,
    "categoryId": "export",
    "title": {
      "ru": "Продлена регистрация GACC для экспорта СОМ, СЦМ и сливочного масла в Китай",
      "be": "Працягнута рэгістрацыя GACC для экспарту САМ, СЦМ і масла ў Кітай",
      "en": "China GACC Export Registration Renewed for Milk Powders & Butter",
      "zh": "输华乳制品 GACC 注册资质顺利续期（涵盖奶粉与黄油）"
    },
    "excerpt": {
      "ru": "Таможенная администрация КНР подтвердила соответствие производственных площадок в Гродно и Щучине требованиям экспортного контроля.",
      "be": "Мытная адміністрацыя КНР пацвердзіла адпаведнасць пляцовак у Гродне і Шчучыне патрабаванням экспартнага кантролю.",
      "en": "General Administration of Customs of China confirmed compliance across Grodno and Shchuchin dairy plants.",
      "zh": "中国海关总署顺利确认格罗德诺与休钦两座生产基地的输华乳制品生产合规资质。"
    },
    "content": {
      "ru": "Подтверждение регистрации GACC позволяет бесперебойно отгружать сухое обезжиренное молоко (СОМ), цельное сухое молоко (СЦМ) и сладкосливочное масло 82,5% в адрес китайских пищевых концернов и торговых дистрибьюторов.",
      "be": "Пацвярджэнне рэгістрацыі GACC дазваляе бесперабойна адгружаць САМ, СЦМ і масла 82,5% кітайскім партнёрам.",
      "en": "The renewed GACC registration secures uninterrupted container dispatches of 25kg Skimmed Milk Powder, 26% Whole Milk Powder, and 20kg 82.5% butter blocks into China.",
      "zh": "GACC资质续期保障了25公斤脱脂奶粉、全脂奶粉及20公斤装82.5%黄油向中国食品企业的常态化供应。"
    },
    "image": ASSETS.newsDairyFacility,
    "published": true,
    "relatedIds": [
      "cheese-export-china-2026",
      "gcc-butter-export-contracts-2025"
    ],
    "seo": {
      "title": {
        "ru": "Продлена регистрация GACC для экспорта СОМ, СЦМ и сливочного масла в Китай | Новости Молочный Мир",
        "be": "Працягнута рэгістрацыя GACC для экспарту САМ, СЦМ і масла ў Кітай | Навіны Малочны Мір",
        "en": "China GACC Export Registration Renewed for Milk Powders & Butter | Molochny Mir News",
        "zh": "输华乳制品 GACC 注册资质顺利续期（涵盖奶粉与黄油） | Molochny Mir 新闻"
      },
      "description": {
        "ru": "Таможенная администрация КНР подтвердила соответствие производственных площадок в Гродно и Щучине требованиям экспортного контроля.",
        "be": "Мытная адміністрацыя КНР пацвердзіла адпаведнасць пляцовак у Гродне і Шчучыне патрабаванням экспартнага кантролю.",
        "en": "General Administration of Customs of China confirmed compliance across Grodno and Shchuchin dairy plants.",
        "zh": "中国海关总署顺利确认格罗德诺与休钦两座生产基地的输华乳制品生产合规资质。"
      }
    }
  },
  {
    "id": "lactose-free-greek-yogurt-launch",
    "slug": "lactose-free-greek-yogurt-launch",
    "date": "2026-04-20",
    "year": 2026,
    "categoryId": "products",
    "title": {
      "ru": "Новинка Active Life: запущен греческий безлактозный йогурт с 8,2 г белка",
      "be": "Навінка Active Life: запушчаны грэчаскі безлактозны ёгурт з 8,2 г бялку",
      "en": "Active Life Launches Lactose-Free High-Protein Greek Yogurt (8.2g Protein)",
      "zh": "Active Life 新品发布：零乳糖高蛋白希腊酸奶上市"
    },
    "excerpt": {
      "ru": "Функциональная линейка без лактозы дополнена густым греческим йогуртом без добавленного сахара в стакане 140 г.",
      "be": "Функцыянальная лінейка без лактозы дапоўнена густым грэчаскім ёгуртам без цукру ў шклянцы 140 г.",
      "en": "The functional nutrition line adds a strained zero-sugar, zero-lactose Greek yogurt delivering 8.2g protein per 100g.",
      "zh": "功能营养系列新增零蔗糖、零乳糖希腊酸奶，每100克提供8.2克天然乳蛋白。"
    },
    "content": {
      "ru": "Новая рецептура объединяет технологию ультрафильтрации и ферментативное расщепление лактозы до уровня менее 0,01%, сохраняя плотную кремовую текстуру.",
      "be": "Новая рэцэптура аб’ядноўвае ультрафільтрацыю і ферментатыўнае расшчапленне лактозы да ўзроўню менш за 0,01%.",
      "en": "The recipe combines membrane ultrafiltration with gentle lactase hydrolysis below 0.01% residual lactose while maintaining rich spoonable thickness.",
      "zh": "新配方结合超滤浓缩与酶解去乳糖技术，乳糖含量低于0.01%，同时保留顺滑醇厚的希腊酸奶质地。"
    },
    "image": ASSETS.productGreekYogurt,
    "published": true,
    "relatedIds": [
      "active-life-protein-award",
      "barista-cream-uht-series-2025"
    ],
    "seo": {
      "title": {
        "ru": "Новинка Active Life: запущен греческий безлактозный йогурт с 8,2 г белка | Новости Молочный Мир",
        "be": "Навінка Active Life: запушчаны грэчаскі безлактозны ёгурт з 8,2 г бялку | Навіны Малочны Мір",
        "en": "Active Life Launches Lactose-Free High-Protein Greek Yogurt (8.2g Protein) | Molochny Mir News",
        "zh": "Active Life 新品发布：零乳糖高蛋白希腊酸奶上市 | Molochny Mir 新闻"
      },
      "description": {
        "ru": "Функциональная линейка без лактозы дополнена густым греческим йогуртом без добавленного сахара в стакане 140 г.",
        "be": "Функцыянальная лінейка без лактозы дапоўнена густым грэчаскім ёгуртам без цукру ў шклянцы 140 г.",
        "en": "The functional nutrition line adds a strained zero-sugar, zero-lactose Greek yogurt delivering 8.2g protein per 100g.",
        "zh": "功能营养系列新增零蔗糖、零乳糖希腊酸奶，每100克提供8.2克天然乳蛋白。"
      }
    }
  },
  {
    "id": "prodexpo-gold-medal-2026",
    "slug": "prodexpo-gold-medal-2026",
    "date": "2026-02-19",
    "year": 2026,
    "categoryId": "awards",
    "title": {
      "ru": "Сыр «ГороденЪ» и масло 82,5% завоевали золотые медали на международной выставке «Продэкспо-2026»",
      "be": "Сыр «ГорадзенЪ» і масла 82,5% заваявалі залатыя медалі на «Прадэкспа-2026»",
      "en": "Goroden Aged Cheese & 82.5% Butter Win Gold Medals at Prodexpo 2026",
      "zh": "Goroden 陈年奶酪与 82.5% 黄油斩获 2026 国际食品展金奖"
    },
    "excerpt": {
      "ru": "Экспертная дегустационная комиссия отметила выдержанный сыр со сроком созревания 90+ суток и сладкосливочное масло высшего сорта.",
      "be": "Дэгустацыйная камісія адзначыла вытрыманы сыр 90+ сутак і масла вышэйшага гатунку.",
      "en": "Blind sensory panels awarded top gold honors to the 90-day aged Goroden cheese and 82.5% unsalted sweet cream butter.",
      "zh": "专业盲测评委团向90天窖藏奶酪及82.5%天然甜奶油黄油颁发最高质量金奖。"
    },
    "content": {
      "ru": "В конкурсе «Лучший продукт — 2026» обе позиции получили максимальные оценки за стабильность органолептических свойств, чистый состав и удобную экспортную упаковку.",
      "be": "У конкурсе «Лепшы прадукт — 2026» абедзве пазіцыі атрымалі максімальныя ацэнкі за чысты склад і якасць.",
      "en": "Both flagship SKUs earned top scores for clean-label formulation, sensory consistency, and export-grade barrier packaging.",
      "zh": "在年度最佳产品评选中，两款旗舰产品凭借纯净配方与出色的出口包装设计获得了评委满分认可。"
    },
    "image": ASSETS.productAgedCheese,
    "published": true,
    "relatedIds": [
      "active-life-protein-award",
      "belagro-grand-prix-goroden-2024"
    ],
    "seo": {
      "title": {
        "ru": "Сыр «ГороденЪ» и масло 82,5% завоевали золотые медали на международной выставке «Продэкспо-2026» | Новости Молочный Мир",
        "be": "Сыр «ГорадзенЪ» і масла 82,5% заваявалі залатыя медалі на «Прадэкспа-2026» | Навіны Малочны Мір",
        "en": "Goroden Aged Cheese & 82.5% Butter Win Gold Medals at Prodexpo 2026 | Molochny Mir News",
        "zh": "Goroden 陈年奶酪与 82.5% 黄油斩获 2026 国际食品展金奖 | Molochny Mir 新闻"
      },
      "description": {
        "ru": "Экспертная дегустационная комиссия отметила выдержанный сыр со сроком созревания 90+ суток и сладкосливочное масло высшего сорта.",
        "be": "Дэгустацыйная камісія адзначыла вытрыманы сыр 90+ сутак і масла вышэйшага гатунку.",
        "en": "Blind sensory panels awarded top gold honors to the 90-day aged Goroden cheese and 82.5% unsalted sweet cream butter.",
        "zh": "专业盲测评委团向90天窖藏奶酪及82.5%天然甜奶油黄油颁发最高质量金奖。"
      }
    }
  },
  {
    "id": "active-life-protein-award",
    "slug": "active-life-protein-award",
    "date": "2025-11-22",
    "year": 2025,
    "categoryId": "awards",
    "title": {
      "ru": "Линейка Active Life удостоена Гран-при международного дегустационного конкурса",
      "be": "Лінейка Active Life атрымала Гран-пры міжнароднага дэгустацыйнага конкурсу",
      "en": "Active Life High-Protein & Lactose-Free Range Wins International Grand Prix",
      "zh": "Active Life 高蛋白及无乳糖系列荣获国际乳品品鉴大奖"
    },
    "excerpt": {
      "ru": "Экспертное жюри отметило греческий йогурт High Protein и безлактозное молоко 2,5% за чистый состав и сбалансированный вкус.",
      "be": "Экспертнае журы адзначыла грэчаскі ёгурт High Protein і безлактознае малако 2,5%.",
      "en": "International sensory judges awarded gold medals to Active Life High-Protein Greek Yogurt and 2.5% Lactose-Free Milk.",
      "zh": "国际评委团授予 Active Life 高蛋白希腊酸奶及2.5%无乳糖牛奶纯正配方金奖。"
    },
    "content": {
      "ru": "На ежегодном международном конкурсе качества молочной продукции линейка функционального питания Active Life получила высшие баллы по органолептическим и микробиологическим показателям.",
      "be": "На штогадовым міжнародным конкурсе якасці малочнай прадукцыі лінейка Active Life атрымала вышэйшыя балы.",
      "en": "At the annual international dairy quality competition, the Active Life functional nutrition range achieved top scores in sensory and microbiological benchmarks.",
      "zh": "在年度国际乳制品质量大赛中，Active Life 功能营养系列凭借洁净配方与卓越口感获评最高分。"
    },
    "image": ASSETS.productGreekYogurt,
    "published": true,
    "relatedIds": [
      "lactose-free-greek-yogurt-launch",
      "prodexpo-gold-medal-2026"
    ],
    "seo": {
      "title": {
        "ru": "Линейка Active Life удостоена Гран-при международного дегустационного конкурса | Новости Молочный Мир",
        "be": "Лінейка Active Life атрымала Гран-пры міжнароднага дэгустацыйнага конкурсу | Навіны Малочны Мір",
        "en": "Active Life High-Protein & Lactose-Free Range Wins International Grand Prix | Molochny Mir News",
        "zh": "Active Life 高蛋白及无乳糖系列荣获国际乳品品鉴大奖 | Molochny Mir 新闻"
      },
      "description": {
        "ru": "Экспертное жюри отметило греческий йогурт High Protein и безлактозное молоко 2,5% за чистый состав и сбалансированный вкус.",
        "be": "Экспертнае журы адзначыла грэчаскі ёгурт High Protein і безлактознае малако 2,5%.",
        "en": "International sensory judges awarded gold medals to Active Life High-Protein Greek Yogurt and 2.5% Lactose-Free Milk.",
        "zh": "国际评委团授予 Active Life 高蛋白希腊酸奶及2.5%无乳糖牛奶纯正配方金奖。"
      }
    }
  },
  {
    "id": "gcc-butter-export-contracts-2025",
    "slug": "gcc-butter-export-contracts-2025",
    "date": "2025-09-10",
    "year": 2025,
    "categoryId": "export",
    "title": {
      "ru": "Подписаны долгосрочные контракты на поставку сливочного масла 82,5% в страны Персидского залива",
      "be": "Падпісаны доўгатэрміновыя кантракты на пастаўку масла 82,5% у краіны Персідскага заліва",
      "en": "Long-Term 82.5% Butter Export Contracts Signed for GCC Markets",
      "zh": "签署面向海湾合作委员会 (GCC) 市场的 82.5% 黄油长期出口协议"
    },
    "excerpt": {
      "ru": "Ежемесячные рефрижераторные отправки монолитов 20 кг стартовали со склада в Скиделе с полным ветеринарным досье.",
      "be": "Штомесячныя рэфрыжэратарныя адпраўкі маналітаў 20 кг стартавалі са склада ў Скідзелі.",
      "en": "Monthly reefer shipments of 20kg sweet cream butter blocks launched from the Skidel hub with full veterinary dossiers.",
      "zh": "20公斤出口规格天然黄油冷链专柜已从斯基德尔物流中心启动常态化按月发运。"
    },
    "content": {
      "ru": "Поставки осуществляются на условиях CIF в 40-футовых рефрижераторных контейнерах при постоянном температурном контроле -18 °C для пекарен и кондитерских фабрик региона.",
      "be": "Пастаўкі ажыццяўляюцца ў 40-футавых рэфрыжэратарных кантэйнерах пры тэмпературы -18 °C.",
      "en": "Shipments move under CIF terms in 40ft reefers at -18 °C serving industrial bakeries and pastry manufacturers across the Gulf region.",
      "zh": "货物采用40英尺-18°C恒温冷藏集装箱按CIF条款直供海湾地区大型烘焙及食品企业。"
    },
    "image": ASSETS.productButterCream,
    "published": true,
    "relatedIds": [
      "gacc-smp-renewal-2026",
      "middle-east-food-expo-2023"
    ],
    "seo": {
      "title": {
        "ru": "Подписаны долгосрочные контракты на поставку сливочного масла 82,5% в страны Персидского залива | Новости Молочный Мир",
        "be": "Падпісаны доўгатэрміновыя кантракты на пастаўку масла 82,5% у краіны Персідскага заліва | Навіны Малочны Мір",
        "en": "Long-Term 82.5% Butter Export Contracts Signed for GCC Markets | Molochny Mir News",
        "zh": "签署面向海湾合作委员会 (GCC) 市场的 82.5% 黄油长期出口协议 | Molochny Mir 新闻"
      },
      "description": {
        "ru": "Ежемесячные рефрижераторные отправки монолитов 20 кг стартовали со склада в Скиделе с полным ветеринарным досье.",
        "be": "Штомесячныя рэфрыжэратарныя адпраўкі маналітаў 20 кг стартавалі са склада ў Скідзелі.",
        "en": "Monthly reefer shipments of 20kg sweet cream butter blocks launched from the Skidel hub with full veterinary dossiers.",
        "zh": "20公斤出口规格天然黄油冷链专柜已从斯基德尔物流中心启动常态化按月发运。"
      }
    }
  },
  {
    "id": "berestovitsa-aging-cellar-2025",
    "slug": "berestovitsa-aging-cellar-2025",
    "date": "2025-07-03",
    "year": 2025,
    "categoryId": "company",
    "title": {
      "ru": "В Берестовицком цехе введена новая камера созревания выдержанных сыров на 350 тонн",
      "be": "У Бераставіцкім цэху ўведзена новая камера паспявання сыроў на 350 тон",
      "en": "350-Ton Automated Cheese Aging Cellar Opened in Berestovitsa",
      "zh": "别列斯托维察奶酪分厂 350 吨级全自动陈年熟化库正式投用"
    },
    "excerpt": {
      "ru": "Автоматизированный микроклимат позволяет одновременно выдерживать сыры элитной серии сроком от 90 до 180 суток.",
      "be": "Аўтаматызаваны мікраклімат дазваляе вытрымліваць сыры тэрмінам ад 90 да 180 сутак.",
      "en": "Precision humidity and climate control expands capacity for 90-to-180-day reserve cheeses.",
      "zh": "精准温湿度自控发酵库显著提升90至180天高端陈年奶酪的年产能。"
    },
    "content": {
      "ru": "Камера оборудована роботами-переворачивателями головок и системой санитарной очистки воздуха, что обеспечивает ровную корку и глубокий ореховый вкус сыра «ГороденЪ».",
      "be": "Камера абсталявана робатамі для догляду за галоўкамі сыру і сістэмай ачысткі паветра.",
      "en": "Equipped with robotic wheel-turning racks and laminar air filtration, the cellar delivers consistent rind development for Goroden reserve cheese.",
      "zh": "熟化库配备自动翻面机器人与洁净空气过滤系统，确保Goroden陈年奶酪风味均匀醇正。"
    },
    "image": ASSETS.productAgedCheese,
    "published": true,
    "relatedIds": [
      "prodexpo-gold-medal-2026",
      "belagro-grand-prix-goroden-2024"
    ],
    "seo": {
      "title": {
        "ru": "В Берестовицком цехе введена новая камера созревания выдержанных сыров на 350 тонн | Новости Молочный Мир",
        "be": "У Бераставіцкім цэху ўведзена новая камера паспявання сыроў на 350 тон | Навіны Малочны Мір",
        "en": "350-Ton Automated Cheese Aging Cellar Opened in Berestovitsa | Molochny Mir News",
        "zh": "别列斯托维察奶酪分厂 350 吨级全自动陈年熟化库正式投用 | Molochny Mir 新闻"
      },
      "description": {
        "ru": "Автоматизированный микроклимат позволяет одновременно выдерживать сыры элитной серии сроком от 90 до 180 суток.",
        "be": "Аўтаматызаваны мікраклімат дазваляе вытрымліваць сыры тэрмінам ад 90 да 180 сутак.",
        "en": "Precision humidity and climate control expands capacity for 90-to-180-day reserve cheeses.",
        "zh": "精准温湿度自控发酵库显著提升90至180天高端陈年奶酪的年产能。"
      }
    }
  },
  {
    "id": "barista-cream-uht-series-2025",
    "slug": "barista-cream-uht-series-2025",
    "date": "2025-05-14",
    "year": 2025,
    "categoryId": "products",
    "title": {
      "ru": "Обновлённая линейка сливок UHT 10% и 33% для кофеен и профессиональных кондитеров",
      "be": "Абноўленая лінейка вяршкоў UHT 10% і 33% для кавярняў і кандытараў",
      "en": "Refreshed UHT Barista 10% & Whipping Cream 33% Series Released",
      "zh": "升级版咖啡专用 10% 奶油与 33% 烘焙淡奶油 UHT 系列上市"
    },
    "excerpt": {
      "ru": "Асептическая упаковка с крышкой Tetra Brik обеспечивает 120–150 суток хранения и стабильную работу на кофейной станции.",
      "be": "Асептычная ўпакоўка з вечкам забяспечвае 120–150 сутак захоўвання і зручнасць на кухні.",
      "en": "Reclosable Tetra Brik cartons deliver 120–150 day ambient shelf life and clean whipping stability.",
      "zh": "带盖利乐砖无菌包装提供120至150天常温保质期，兼具优异打发稳定性与咖啡融合度。"
    },
    "content": {
      "ru": "Сливки для взбивания 33% протестированы шеф-кондитерами: время взбивания не превышает 3 минут, а крем сохраняет чёткий рельеф декора в течение 48 часов.",
      "be": "Вяршкі 33% пратэставаны кандытарамі: крэм захоўвае форму на працягу 48 гадзін.",
      "en": "Tested by commercial pastry chefs, the 33% cream reaches firm peaks in under 3 minutes and holds piped definition for 48 hours.",
      "zh": "经专业西点师测试，33%动物淡奶油3分钟内即可快速打发，裱花造型可稳定保持48小时以上。"
    },
    "image": ASSETS.productButterCream,
    "published": true,
    "relatedIds": [
      "new-mozzarella-horeca-line",
      "lactose-free-greek-yogurt-launch"
    ],
    "seo": {
      "title": {
        "ru": "Обновлённая линейка сливок UHT 10% и 33% для кофеен и профессиональных кондитеров | Новости Молочный Мир",
        "be": "Абноўленая лінейка вяршкоў UHT 10% і 33% для кавярняў і кандытараў | Навіны Малочны Мір",
        "en": "Refreshed UHT Barista 10% & Whipping Cream 33% Series Released | Molochny Mir News",
        "zh": "升级版咖啡专用 10% 奶油与 33% 烘焙淡奶油 UHT 系列上市 | Molochny Mir 新闻"
      },
      "description": {
        "ru": "Асептическая упаковка с крышкой Tetra Brik обеспечивает 120–150 суток хранения и стабильную работу на кофейной станции.",
        "be": "Асептычная ўпакоўка з вечкам забяспечвае 120–150 сутак захоўвання і зручнасць на кухні.",
        "en": "Reclosable Tetra Brik cartons deliver 120–150 day ambient shelf life and clean whipping stability.",
        "zh": "带盖利乐砖无菌包装提供120至150天常温保质期，兼具优异打发稳定性与咖啡融合度。"
      }
    }
  },
  {
    "id": "iso-fssc-surveillance-audit-2025",
    "slug": "iso-fssc-surveillance-audit-2025",
    "date": "2025-03-08",
    "year": 2025,
    "categoryId": "company",
    "title": {
      "ru": "Предприятие успешно прошло международный инспекционный аудит FSSC 22000 и ISO 9001",
      "be": "Прадпрыемства паспяхова прайшло міжнародны аўдыт FSSC 22000 і ISO 9001",
      "en": "Successful Surveillance Audit of FSSC 22000 & ISO 9001 Quality Systems",
      "zh": "顺利通过 FSSC 22000 与 ISO 9001 国际食品安全质量体系年度监督审核"
    },
    "excerpt": {
      "ru": "Независимые аудиторы подтвердили 100% прослеживаемость сырья и соответствие стандартам HACCP на всех четырёх площадках.",
      "be": "Незалежныя аўдытары пацвердзілі 100% прасочвальнасць сыравіны на ўсіх чатырох пляцоўках.",
      "en": "Independent auditors confirmed full raw-milk traceability and HACCP compliance across all four dairy facilities.",
      "zh": "独立评审专家组确认四座加工基地全面符合生牛乳全程可追溯与HACCP最高规范。"
    },
    "content": {
      "ru": "Проверка охватила входную приёмку молока сорта «Экстра», цеха пастеризации, сыроделия, распылительной сушки и отгрузочный контроль холодовой цепи.",
      "be": "Праверка ахапіла прыёмку малака гатунку «Экстра», цэхі сыраробства і халадовы ланцуг.",
      "en": "The audit covered Extra-grade raw milk intake, pasteurization, cheesemaking, spray drying, and automated cold-chain dispatch.",
      "zh": "本次审核覆盖特级生牛乳入厂检测、巴氏杀菌、奶酪发酵、喷雾干燥及冷链发运全流程。"
    },
    "image": ASSETS.newsDairyFacility,
    "published": true,
    "relatedIds": [
      "gacc-smp-renewal-2026",
      "grodno-cold-chain-2025"
    ],
    "seo": {
      "title": {
        "ru": "Предприятие успешно прошло международный инспекционный аудит FSSC 22000 и ISO 9001 | Новости Молочный Мир",
        "be": "Прадпрыемства паспяхова прайшло міжнародны аўдыт FSSC 22000 і ISO 9001 | Навіны Малочны Мір",
        "en": "Successful Surveillance Audit of FSSC 22000 & ISO 9001 Quality Systems | Molochny Mir News",
        "zh": "顺利通过 FSSC 22000 与 ISO 9001 国际食品安全质量体系年度监督审核 | Molochny Mir 新闻"
      },
      "description": {
        "ru": "Независимые аудиторы подтвердили 100% прослеживаемость сырья и соответствие стандартам HACCP на всех четырёх площадках.",
        "be": "Незалежныя аўдытары пацвердзілі 100% прасочвальнасць сыравіны на ўсіх чатырох пляцоўках.",
        "en": "Independent auditors confirmed full raw-milk traceability and HACCP compliance across all four dairy facilities.",
        "zh": "独立评审专家组确认四座加工基地全面符合生牛乳全程可追溯与HACCP最高规范。"
      }
    }
  },
  {
    "id": "grodno-cold-chain-2025",
    "slug": "grodno-cold-chain-2025",
    "date": "2024-09-14",
    "year": 2024,
    "categoryId": "company",
    "title": {
      "ru": "Введён в эксплуатацию роботизированный распределительный центр с контролем холодовой цепи",
      "be": "Уведзены ў эксплуатацыю рабатызаваны размеркавальны цэнтр з кантролем халадовага ланцуга",
      "en": "Automated Cold-Chain Distribution Hub Commissioned in Grodno",
      "zh": "格罗德诺全自动冷链物流分拨中心正式启用"
    },
    "excerpt": {
      "ru": "Новый логистический терминал вмещает 4 200 паллетомест и сокращает время комплектации экспортных и оптовых отгрузок на 40%.",
      "be": "Новы лагістычны тэрмінал змяшчае 4 200 палетамесцаў і паскарае адгрузку на 40%.",
      "en": "The 4,200-pallet automated cold warehouse cuts wholesale and export dispatch lead times by 40%.",
      "zh": "拥有4,200个托盘位的智能冷链中心将大宗批发及出口备货周期缩短了40%。"
    },
    "content": {
      "ru": "Новый логистический хаб оснащён многозональными камерами (+2…+6 °C и -18 °C) с круглосуточным телеметрическим мониторингом температуры и автоматизированной системой WMS.",
      "be": "Новы лагістычны хаб аснашчаны шматзанальнымі камерамі (+2…+6 °C і -18 °C) і сістэмай WMS.",
      "en": "Equipped with dual-zone climate chambers (+2…+6 °C and -18 °C) and automated WMS tracking, the hub ensures uninterrupted cold-chain integrity.",
      "zh": "该中心配备+2至+6°C冷藏库与-18°C冷冻库及全自动WMS仓储系统，保障乳制品从工厂到全球客户端的全程新鲜。"
    },
    "image": ASSETS.heroDairyShowcase,
    "published": true,
    "relatedIds": [
      "new-mozzarella-horeca-line",
      "iso-fssc-surveillance-audit-2025"
    ],
    "seo": {
      "title": {
        "ru": "Введён в эксплуатацию роботизированный распределительный центр с контролем холодовой цепи | Новости Молочный Мир",
        "be": "Уведзены ў эксплуатацыю рабатызаваны размеркавальны цэнтр з кантролем халадовага ланцуга | Навіны Малочны Мір",
        "en": "Automated Cold-Chain Distribution Hub Commissioned in Grodno | Molochny Mir News",
        "zh": "格罗德诺全自动冷链物流分拨中心正式启用 | Molochny Mir 新闻"
      },
      "description": {
        "ru": "Новый логистический терминал вмещает 4 200 паллетомест и сокращает время комплектации экспортных и оптовых отгрузок на 40%.",
        "be": "Новы лагістычны тэрмінал змяшчае 4 200 палетамесцаў і паскарае адгрузку на 40%.",
        "en": "The 4,200-pallet automated cold warehouse cuts wholesale and export dispatch lead times by 40%.",
        "zh": "拥有4,200个托盘位的智能冷链中心将大宗批发及出口备货周期缩短了40%。"
      }
    }
  },
  {
    "id": "belagro-grand-prix-goroden-2024",
    "slug": "belagro-grand-prix-goroden-2024",
    "date": "2024-06-07",
    "year": 2024,
    "categoryId": "awards",
    "title": {
      "ru": "Сыры «ГороденЪ» и Моцарелла получили диплом Гран-при на выставке «Белагро-2024»",
      "be": "Сыры «ГорадзенЪ» і Мацарэла атрымалі дыплом Гран-пры на выставе «Белагра-2024»",
      "en": "Goroden Cheese & Classic Mozzarella Win Grand Prix at Belagro 2024",
      "zh": "Goroden 奶酪与经典马苏里拉奶酪荣获 2024 白俄罗斯农业展特等奖"
    },
    "excerpt": {
      "ru": "Высокую оценку профессионального сообщества получила широкая линейка сыров и форматов фасовки от 125 г до 4 кг.",
      "be": "Высокую ацэнку прафесійнай супольнасці атрымала лінейка сыроў у фасоўках ад 125 г да 4 кг.",
      "en": "Industry experts recognized the full cheese portfolio spanning 125g retail pouches to 4kg wheels.",
      "zh": "从125克零售装到4公斤整轮的专业奶酪包装矩阵获得行业专家高度评价。"
    },
    "content": {
      "ru": "На главной аграрной выставке страны стенд ОАО «Молочный Мир» посетили более 40 зарубежных делегаций и представителей торговых сетей.",
      "be": "Стэнд ААТ «Малочны Мір» наведалі больш за 40 замежных дэлегацый і гандлёвых сетак.",
      "en": "Over 40 international buyer delegations and retail procurement teams visited the Molochny Mir pavilion during the exhibition.",
      "zh": "展会期间共有来自40余个国际采购代表团与商超买手莅临公司展位洽谈合作。"
    },
    "image": ASSETS.productAgedCheese,
    "published": true,
    "relatedIds": [
      "prodexpo-gold-medal-2026",
      "berestovitsa-aging-cellar-2025"
    ],
    "seo": {
      "title": {
        "ru": "Сыры «ГороденЪ» и Моцарелла получили диплом Гран-при на выставке «Белагро-2024» | Новости Молочный Мир",
        "be": "Сыры «ГорадзенЪ» і Мацарэла атрымалі дыплом Гран-пры на выставе «Белагра-2024» | Навіны Малочны Мір",
        "en": "Goroden Cheese & Classic Mozzarella Win Grand Prix at Belagro 2024 | Molochny Mir News",
        "zh": "Goroden 奶酪与经典马苏里拉奶酪荣获 2024 白俄罗斯农业展特等奖 | Molochny Mir 新闻"
      },
      "description": {
        "ru": "Высокую оценку профессионального сообщества получила широкая линейка сыров и форматов фасовки от 125 г до 4 кг.",
        "be": "Высокую ацэнку прафесійнай супольнасці атрымала лінейка сыроў у фасоўках ад 125 г да 4 кг.",
        "en": "Industry experts recognized the full cheese portfolio spanning 125g retail pouches to 4kg wheels.",
        "zh": "从125克零售装到4公斤整轮的专业奶酪包装矩阵获得行业专家高度评价。"
      }
    }
  },
  {
    "id": "shchuchin-spray-dryer-upgrade-2024",
    "slug": "shchuchin-spray-dryer-upgrade-2024",
    "date": "2024-04-02",
    "year": 2024,
    "categoryId": "company",
    "title": {
      "ru": "Модернизация сушильного комплекса в Щучине увеличила выпуск экспортного СОМ на 30%",
      "be": "Мадэрнізацыя сушыльнага комплексу ў Шчучыне павялічыла выпуск САМ на 30%",
      "en": "Shchuchin Spray-Drying Upgrade Increases Export SMP Capacity by 30%",
      "zh": "休钦奶粉干燥中心升级改造使出口级脱脂奶粉产能提升 30%"
    },
    "excerpt": {
      "ru": "Новая башня распылительной сушки снижает влажность порошка ниже 3,8% и повышает индекс растворимости.",
      "be": "Новая вежа распыляльнай сушкі зніжае вільготнасць парашку ніжэй за 3,8%.",
      "en": "Upgraded spray-drying tower brings moisture below 3.8% and improves instant solubility for industrial B2B buyers.",
      "zh": "全新升级的喷雾干燥塔将奶粉水分控制在3.8%以下，大幅提升工业冲调溶解度。"
    },
    "content": {
      "ru": "Модернизация позволяет выпускать сухое обезжиренное молоко (СОМ) классов Low Heat и Medium Heat в соответствии со стандартами ADPI Extra Grade.",
      "be": "Мадэрнізацыя дазваляе выпускаць САМ класаў Low Heat і Medium Heat па стандартах ADPI Extra Grade.",
      "en": "The upgraded line produces Low Heat and Medium Heat Skimmed Milk Powder conforming to ADPI Extra Grade specifications.",
      "zh": "改造后的产线可稳定供应符合ADPI特级标准的低热与中热型脱脂奶粉。"
    },
    "image": ASSETS.newsDairyFacility,
    "published": true,
    "relatedIds": [
      "gacc-smp-renewal-2026",
      "cheese-export-china-2026"
    ],
    "seo": {
      "title": {
        "ru": "Модернизация сушильного комплекса в Щучине увеличила выпуск экспортного СОМ на 30% | Новости Молочный Мир",
        "be": "Мадэрнізацыя сушыльнага комплексу ў Шчучыне павялічыла выпуск САМ на 30% | Навіны Малочны Мір",
        "en": "Shchuchin Spray-Drying Upgrade Increases Export SMP Capacity by 30% | Molochny Mir News",
        "zh": "休钦奶粉干燥中心升级改造使出口级脱脂奶粉产能提升 30% | Molochny Mir 新闻"
      },
      "description": {
        "ru": "Новая башня распылительной сушки снижает влажность порошка ниже 3,8% и повышает индекс растворимости.",
        "be": "Новая вежа распыляльнай сушкі зніжае вільготнасць парашку ніжэй за 3,8%.",
        "en": "Upgraded spray-drying tower brings moisture below 3.8% and improves instant solubility for industrial B2B buyers.",
        "zh": "全新升级的喷雾干燥塔将奶粉水分控制在3.8%以下，大幅提升工业冲调溶解度。"
      }
    }
  },
  {
    "id": "plombir-export-packaging-2024",
    "slug": "plombir-export-packaging-2024",
    "date": "2024-02-15",
    "year": 2024,
    "categoryId": "products",
    "title": {
      "ru": "Мороженое «Пломбир ГороденЪ» вышло на экспортные рынки в обновлённой барьерной упаковке",
      "be": "Марозіва «Пламбір ГорадзенЪ» выйшла на экспарт у абноўленай упакоўцы",
      "en": "Goroden Plombir Ice Cream Enters New Export Markets in Barrier Packaging",
      "zh": "Goroden 冰淇淋采用升级阻隔锁鲜包装全面拓展国际出口"
    },
    "excerpt": {
      "ru": "Многоязычная маркировка (RU / EN / ZH) и усиленный термокороб обеспечивают сохранность пломбира при контейнерных перевозках.",
      "be": "Шматмоўная маркіроўка (RU / EN / ZH) забяспечвае захаванасць пламбіру пры экспарце.",
      "en": "Multilingual packaging (RU / EN / ZH) and reinforced master cartons preserve plombir structure across long-haul reefer transit.",
      "zh": "多语言包装标识（俄/英/中）与加强型冷链外箱确保冰淇淋在跨国冷链运输中保持完美质地。"
    },
    "content": {
      "ru": "Экспортная линейка включает классический ванильный и шоколадный пломбир 15% жирности на натуральных сливках без заменителей молочного жира.",
      "be": "Экспартная лінейка ўключае ванільны і шакаладны пламбір 15% на натуральных вяршках.",
      "en": "The export range features 15% dairy-fat vanilla and chocolate plombir formulated strictly without vegetable oils.",
      "zh": "出口系列涵盖15%纯乳脂香草与巧克力冰淇淋，100%不含植物油脂替代成分。"
    },
    "image": ASSETS.productIceCream,
    "published": true,
    "relatedIds": [
      "ice-cream-plombir",
      "grodno-cold-chain-2025"
    ],
    "seo": {
      "title": {
        "ru": "Мороженое «Пломбир ГороденЪ» вышло на экспортные рынки в обновлённой барьерной упаковке | Новости Молочный Мир",
        "be": "Марозіва «Пламбір ГорадзенЪ» выйшла на экспарт у абноўленай упакоўцы | Навіны Малочны Мір",
        "en": "Goroden Plombir Ice Cream Enters New Export Markets in Barrier Packaging | Molochny Mir News",
        "zh": "Goroden 冰淇淋采用升级阻隔锁鲜包装全面拓展国际出口 | Molochny Mir 新闻"
      },
      "description": {
        "ru": "Многоязычная маркировка (RU / EN / ZH) и усиленный термокороб обеспечивают сохранность пломбира при контейнерных перевозках.",
        "be": "Шматмоўная маркіроўка (RU / EN / ZH) забяспечвае захаванасць пламбіру пры экспарце.",
        "en": "Multilingual packaging (RU / EN / ZH) and reinforced master cartons preserve plombir structure across long-haul reefer transit.",
        "zh": "多语言包装标识（俄/英/中）与加强型冷链外箱确保冰淇淋在跨国冷链运输中保持完美质地。"
      }
    }
  },
  {
    "id": "digital-edi-traceability-2023",
    "slug": "digital-edi-traceability-2023",
    "date": "2023-11-18",
    "year": 2023,
    "categoryId": "company",
    "title": {
      "ru": "Внедрён цифровой электронный документооборот (EDI / ЭТТН) и сквозная маркировка GTIN",
      "be": "Укаранёны электронны дакументаабарот (EDI / ЭТТН) і маркіроўка GTIN",
      "en": "Full EDI Invoicing & GS1 GTIN Traceability Rolled Out for B2B Partners",
      "zh": "全面上线 B2B 电子单据 (EDI) 与 GS1 GTIN 国际溯源条码体系"
    },
    "excerpt": {
      "ru": "Оптовые покупатели и розничные сети переведены на автоматический обмен электронными накладными и паспортами качества.",
      "be": "Аптовыя пакупнікі і сеткі пераведзены на аўтаматычны абмен электроннымі накладнымі.",
      "en": "Wholesale partners and retail chains now receive automated electronic invoices, batch COAs, and GTIN pallet tracking.",
      "zh": "所有批发商与商超合作伙伴均可直接对接电子发票、批次质检报告及托盘GTIN追踪信息。"
    },
    "content": {
      "ru": "Интеграция с системами прослеживаемости ускорила приёмку грузов на распределительных центрах торговых сетей в 2,5 раза.",
      "be": "Інтэграцыя з сістэмамі прасочвальнасці паскорыла прыёмку грузаў на РЦ у 2,5 разы.",
      "en": "Integration with automated warehouse traceability cut retail distribution center receiving times by 2.5x.",
      "zh": "数字化溯源体系上线后，商超分拨中心的收货验收效率提升了2.5倍。"
    },
    "image": ASSETS.heroDairyShowcase,
    "published": true,
    "relatedIds": [
      "grodno-cold-chain-2025",
      "iso-fssc-surveillance-audit-2025"
    ],
    "seo": {
      "title": {
        "ru": "Внедрён цифровой электронный документооборот (EDI / ЭТТН) и сквозная маркировка GTIN | Новости Молочный Мир",
        "be": "Укаранёны электронны дакументаабарот (EDI / ЭТТН) і маркіроўка GTIN | Навіны Малочны Мір",
        "en": "Full EDI Invoicing & GS1 GTIN Traceability Rolled Out for B2B Partners | Molochny Mir News",
        "zh": "全面上线 B2B 电子单据 (EDI) 与 GS1 GTIN 国际溯源条码体系 | Molochny Mir 新闻"
      },
      "description": {
        "ru": "Оптовые покупатели и розничные сети переведены на автоматический обмен электронными накладными и паспортами качества.",
        "be": "Аптовыя пакупнікі і сеткі пераведзены на аўтаматычны абмен электроннымі накладнымі.",
        "en": "Wholesale partners and retail chains now receive automated electronic invoices, batch COAs, and GTIN pallet tracking.",
        "zh": "所有批发商与商超合作伙伴均可直接对接电子发票、批次质检报告及托盘GTIN追踪信息。"
      }
    }
  },
  {
    "id": "middle-east-food-expo-2023",
    "slug": "middle-east-food-expo-2023",
    "date": "2023-09-25",
    "year": 2023,
    "categoryId": "export",
    "title": {
      "ru": "Итоги деловой миссии на Ближнем Востоке: презентация экспортной матрицы молочных ингредиентов",
      "be": "Вынікі дзелавой місіі на Блізкім Усходзе: прэзентацыя экспартнай матрыцы",
      "en": "Middle East Trade Mission: Presenting Dairy Ingredients & Butter Matrix",
      "zh": "中东国际食品展圆满收官：全面展示出口级乳脂与奶粉原料矩阵"
    },
    "excerpt": {
      "ru": "Проведены переговоры с 25 импортёрами из ОАЭ, Саудовской Аравии и Катара о поставках масла 82,5%, СОМ и сыров.",
      "be": "Праведзены перамовы з 25 імпарцёрамі з ААЭ, Саудаўскай Аравіі і Катара.",
      "en": "Meetings held with 25 regional importers from UAE, Saudi Arabia, and Qatar covering butter, SMP, and aged cheese.",
      "zh": "与阿联酋、沙特及卡塔尔25家进口商就82.5%黄油、脱脂奶粉及陈年奶酪供应链展开深度洽谈。"
    },
    "content": {
      "ru": "Наибольший интерес зарубежных байеров вызвали промышленные блоки сливочного масла по 20 кг и сухое молоко в 25-килограммовой экспортной таре.",
      "be": "Найбольшую цікавасць выклікалі прамысловыя блокі масла па 20 кг і сухое малако 25 кг.",
      "en": "Regional buyers focused primarily on 20kg industrial unsalted butter blocks and 25kg multi-wall kraft bags of SMP.",
      "zh": "中东采购商重点关注20公斤出口块状无盐黄油及25公斤装喷雾干燥脱脂奶粉。"
    },
    "image": ASSETS.newsDairyFacility,
    "published": true,
    "relatedIds": [
      "gcc-butter-export-contracts-2025",
      "cheese-export-china-2026"
    ],
    "seo": {
      "title": {
        "ru": "Итоги деловой миссии на Ближнем Востоке: презентация экспортной матрицы молочных ингредиентов | Новости Молочный Мир",
        "be": "Вынікі дзелавой місіі на Блізкім Усходзе: прэзентацыя экспартнай матрыцы | Навіны Малочны Мір",
        "en": "Middle East Trade Mission: Presenting Dairy Ingredients & Butter Matrix | Molochny Mir News",
        "zh": "中东国际食品展圆满收官：全面展示出口级乳脂与奶粉原料矩阵 | Molochny Mir 新闻"
      },
      "description": {
        "ru": "Проведены переговоры с 25 импортёрами из ОАЭ, Саудовской Аравии и Катара о поставках масла 82,5%, СОМ и сыров.",
        "be": "Праведзены перамовы з 25 імпарцёрамі з ААЭ, Саудаўскай Аравіі і Катара.",
        "en": "Meetings held with 25 regional importers from UAE, Saudi Arabia, and Qatar covering butter, SMP, and aged cheese.",
        "zh": "与阿联酋、沙特及卡塔尔25家进口商就82.5%黄油、脱脂奶粉及陈年奶酪供应链展开深度洽谈。"
      }
    }
  }
];
