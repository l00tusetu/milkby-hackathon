import { Category } from '../types';

export const categories: Category[] = [
  {
    id: 'cheese',
    slug: 'cheese',
    name: {
      ru: 'Сыры',
      be: 'Сыры',
      en: 'Cheeses',
      zh: '奶酪系列',
    },
    description: {
      ru: 'Полутвёрдые, выдержанные, мягкие творожные, безлактозные и плавленые сыры ОАО «Молочный Мир».',
      be: 'Паўцвёрдыя, вытрыманыя, мяккія тварожныя, безлактозныя і плаўленыя сыры ААТ «Малочны Мір».',
      en: 'Semi-hard, aged, soft cream, lactose-free, and processed cheeses by OJSC Molochny Mir.',
      zh: '半硬质、陈年成熟、软质奶油涂抹奶酪、无乳糖及再制奶酪系列。',
    },
    subcategories: [
      { id: 'aged-semi-hard', name: { ru: 'Полутвёрдые и выдержанные', be: 'Паўцвёрдыя і вытрыманыя', en: 'Semi-Hard & Aged', zh: '半硬质与陈年奶酪' } },
      { id: 'soft-cream', name: { ru: 'Мягкие и творожные (Cream cheese)', be: 'Мяккія і тварожныя', en: 'Soft & Cream Cheese', zh: '软质与奶油奶酪' } },
      { id: 'processed', name: { ru: 'Плавленые и колбасные сыры', be: 'Плаўленыя і каўбасныя сыры', en: 'Processed & Smoked', zh: '再制与熏制奶酪' } },
    ],
    filterKeys: ['fat', 'lactoseFree', 'highProtein', 'exportReady'],
    characteristicSchema: [
      { key: 'cheeseType', label: { ru: 'Вид сыра', be: 'Від сыру', en: 'Cheese Type', zh: '奶酪类型' } },
      { key: 'aging', label: { ru: 'Выдержка', be: 'Вытрымка', en: 'Maturation', zh: '成熟期' } },
      { key: 'shape', label: { ru: 'Форма', be: 'Форма', en: 'Format / Shape', zh: '形状' } },
      { key: 'milkBase', label: { ru: 'Сырьё', be: 'Сыравіна', en: 'Milk Base', zh: '原料奶' } },
    ],
    seo: {
      title: {
        ru: 'Сыры ОАО «Молочный Мир» — выдержанные, полутвёрдые, мягкие и плавленые',
        be: 'Сыры ААТ «Малочны Мір» — вытрыманыя, паўцвёрдыя, мяккія і плаўленыя',
        en: 'Cheeses by Molochny Mir — Aged, Semi-Hard, Cream & Processed',
        zh: 'Molochny Mir 奶酪系列 — 陈年、半硬质、奶油及再制奶酪',
      },
      description: {
        ru: 'Полный каталог сыров ОАО «Молочный Мир»: линейка «ГороденЪ», «Кронес», Пармезан, ГуберТ, Cream cheese и плавленые сыры.',
        be: 'Поўны каталог сыроў ААТ «Малочны Мір»: лінейка «ГорадзенЪ», «Кронес», Пармезан, ГуберТ, Cream cheese.',
        en: 'Complete Molochny Mir cheese portfolio with retail and HoReCa packaging formats.',
        zh: 'Molochny Mir 全系列奶酪产品目录，涵盖零售及餐饮大包装规格。',
      },
    },
  },
{
  id: 'milk',
  slug: 'milk',
  name: {
    ru: 'Молоко',
    be: 'Малако',
    en: 'Milk',
    zh: '鲜奶与纯牛奶',
  },
  description: {
    ru: 'Пастеризованное, ультрапастеризованное, стерилизованное, топлёное и безлактозное молоко высших сортов.',
    be: 'Пастэрызаванае, ультрапастэрызаванае, стэрылізаванае, топленае і безлактознае малако.',
    en: 'Pasteurized, UHT, sterilized, baked, and lactose-free cow milk sourced from certified farms.',
    zh: '巴氏杀菌乳、超高温灭菌乳、烤奶及无乳糖纯牛奶。',
  },
  subcategories: [
    { id: 'pasteurized', name: { ru: 'Пастеризованное и топлёное', be: 'Пастэрызаванае і топленае', en: 'Pasteurized & Baked', zh: '巴氏杀菌与烤奶' } },
    { id: 'uht', name: { ru: 'Ультрапастеризованное и стерилизованное', be: 'Ультрапастэрызаванае і стэрылізаванае', en: 'UHT & Sterilized', zh: '超高温灭菌奶' } },
    { id: 'lactose-free', name: { ru: 'Безлактозное и Active Life', be: 'Безлактознае і Active Life', en: 'Lactose-Free & Functional', zh: '无乳糖与功能牛奶' } },
  ],
  filterKeys: ['fat', 'lactoseFree', 'exportReady'],
  characteristicSchema: [
    { key: 'processing', label: { ru: 'Термообработка', be: 'Тэрмаапрацоўка', en: 'Heat Treatment', zh: '杀菌工艺' } },
    { key: 'milkBase', label: { ru: 'Сырьё', be: 'Сыравіна', en: 'Milk Source', zh: '奶源' } },
    { key: 'lactose', label: { ru: 'Лактоза', be: 'Лактоза', en: 'Lactose Content', zh: '乳糖含量' } },
  ],
  seo: {
    title: {
      ru: 'Молоко ОАО «Молочный Мир» — стерилизованное, пастеризованное и безлактозное',
      be: 'Малако ААТ «Малочны Мір» — стэрылізаванае, пастэрызаванае і безлактознае',
      en: 'Milk Products — Pasteurized, UHT & Lactose-Free | Molochny Mir',
      zh: 'Molochny Mir 纯牛奶与无乳糖牛奶系列',
    },
    description: {
      ru: 'Питьевое молоко «ГороденЪ», Active Life, «Твоя кружка» и стерилизованное молоко в Tetra Pak и ПЭТ.',
      be: 'Пітное малако «ГорадзенЪ», Active Life, «Твая кружка» і стэрылізаванае малако.',
      en: 'Pasteurized and UHT milk in PET bottles and Tetra Pak aseptic cartons.',
      zh: 'PET瓶装与利乐无菌包装鲜牛奶及常温奶。',
    },
  },
},
{
  id: 'fermented',
  slug: 'fermented',
  name: {
    ru: 'Кисломолочная продукция',
    be: 'Кісламалочная прадукцыя',
    en: 'Fermented Dairy',
    zh: '发酵乳制品',
  },
  description: {
    ru: 'Кефир, ряженка, простокваша «Мечниковская», бифитат и «ДарАйран» на живых заквасках.',
    be: 'Кефір, ражанка, прастакваша «Мечнікаўская», біфітат і «ДарАйран» на жывых заквасках.',
    en: 'Traditional kefir, ryazhenka, prostokvasha, bifitat, and DarAyran brewed with live cultures.',
    zh: '采用活性益生菌发酵的开菲尔、烤发酵乳及艾兰酸奶饮品。',
  },
  subcategories: [
    { id: 'kefir', name: { ru: 'Кефир и бифитат', be: 'Кефір і біфітат', en: 'Kefir & Bifitat', zh: '开菲尔与双歧乳' } },
    { id: 'ryazhenka', name: { ru: 'Ряженка, простокваша и айран', be: 'Ражанка, прастакваша і айран', en: 'Ryazhenka, Prostokvasha & Ayran', zh: '烤发酵乳与艾兰' } },
  ],
  filterKeys: ['fat', 'highProtein'],
  characteristicSchema: [
    { key: 'cultures', label: { ru: 'Закваска', be: 'Закваска', en: 'Cultures', zh: '发酵菌种' } },
    { key: 'probiotics', label: { ru: 'Пробиотики / Особенность', be: 'Прабіётыкі', en: 'Probiotic Profile', zh: '益生菌特性' } },
  ],
  seo: {
    title: {
      ru: 'Кисломолочная продукция — Кефир, ряженка, бифитат и ДарАйран | Молочный Мир',
      be: 'Кісламалочная прадукцыя — Кефір, ражанка, біфітат | Малочны Мір',
      en: 'Fermented Dairy, Kefir & Ayran | Molochny Mir',
      zh: '发酵乳、开菲尔与艾兰饮品系列 | Molochny Mir',
    },
    description: {
      ru: 'Кефир «ГороденЪ», Active Life, бифитат, ряженка, простокваша и кисломолочный напиток «ДарАйран».',
      be: 'Кефір «ГорадзенЪ», Active Life, біфітат, ражанка, прастакваша і «ДарАйран».',
      en: 'Traditional Belarusian kefir, ryazhenka, and probiotic fermented beverages.',
      zh: '白俄罗斯传统开菲尔、烤发酵乳与益生菌乳饮品。',
    },
  },
},
{
  id: 'yogurt',
  slug: 'yogurt',
  name: {
    ru: 'Йогурты',
    be: 'Ёгурты',
    en: 'Yogurts',
    zh: '酸奶系列',
  },
  description: {
    ru: 'Греческие, функциональные (DiaVita, Active Life), с кусочками фруктов, шариками Yogo Bubble и питьевые йогурты.',
    be: 'Грэчаскія, функцыянальныя (DiaVita, Active Life), з кавалачкамі фруктаў і пітныя ёгурты.',
    en: 'Strained Greek, functional (DiaVita, Active Life), fruit-chunk, bubble, and drinkable yogurts.',
    zh: '希腊酸奶、功能性无糖酸奶、果粒酸奶、爆珠酸奶及饮用型酸奶。',
  },
  subcategories: [
    { id: 'greek', name: { ru: 'Греческие и функциональные', be: 'Грэчаскія і функцыянальныя', en: 'Greek & Functional', zh: '希腊与功能性酸奶' } },
    { id: 'fruit-spoon', name: { ru: 'Ложковые с фруктами и шариками', be: 'Ложкавыя з фруктамі', en: 'Spoonable & Fruit', zh: '勺吃果粒酸奶' } },
    { id: 'drinkable', name: { ru: 'Питьевые йогурты и злаковые миксы', be: 'Пітныя ёгурты', en: 'Drinkable Yogurts', zh: '饮用型酸奶' } },
  ],
  filterKeys: ['fat', 'highProtein', 'lactoseFree'],
  characteristicSchema: [
    { key: 'flavor', label: { ru: 'Вкус', be: 'Смак', en: 'Flavor', zh: '口味' } },
    { key: 'sugar', label: { ru: 'Добавленный сахар', be: 'Дададзены цукар', en: 'Added Sugar', zh: '添加糖' } },
  ],
  seo: {
    title: {
      ru: 'Йогурты ОАО «Молочный Мир» — Греческий, DiaVita, Yogo Fruit и Узнай Мир',
      be: 'Ёгурты ААТ «Малочны Мір» — Грэчаскі, DiaVita, Yogo Fruit і Пазнай Свет',
      en: 'Greek, Functional & Fruit Yogurts | Molochny Mir',
      zh: '希腊酸奶、功能性酸奶及果粒酸奶系列 | Molochny Mir',
    },
    description: {
      ru: 'Полная линейка йогуртов: Греческий без сахара, DiaVita с бетулином, низколактозный Active Life, Yogo Bubble и питьевые.',
      be: 'Поўная лінейка ёгуртаў ААТ «Малочны Мір».',
      en: 'High-protein Greek yogurts, low-lactose functional lines, and fruit-filled dairy snacks.',
      zh: '富含天然乳蛋白的希腊酸奶、无糖酸奶与水果饮用酸奶。',
    },
  },
},
{
  id: 'sour-cream',
  slug: 'sour-cream',
  name: {
    ru: 'Сметана',
    be: 'Смятана',
    en: 'Sour Cream',
    zh: '酸奶油',
  },
  description: {
    ru: 'Натуральная сметана из свежих сливок жирностью от 10% до 29%, включая линейки «ГороденЪ» и Active Life без лактозы.',
    be: 'Натуральная смятана са свежых вяршкоў тлустасцю ад 10% да 29%, уключаючы «ГорадзенЪ» і безлактозную.',
    en: 'Thick cultured sour cream (10% to 29% fat), including Goroden and lactose-free Active Life lines.',
    zh: '10% 至 29% 多种乳脂含量的纯鲜奶油发酵酸奶油（含零乳糖系列）。',
  },
  subcategories: [
    { id: 'classic-sour-cream', name: { ru: 'Классическая и «ГороденЪ»', be: 'Класічная і «ГорадзенЪ»', en: 'Classic & Goroden', zh: '经典系列' } },
    { id: 'functional-sour-cream', name: { ru: 'Active Life и безлактозная', be: 'Active Life і безлактозная', en: 'Active Life & Lactose-Free', zh: '功能与无乳糖系列' } },
  ],
  filterKeys: ['fat', 'lactoseFree'],
  characteristicSchema: [
    { key: 'consistency', label: { ru: 'Консистенция', be: 'Кансістэнцыя', en: 'Texture', zh: '质地' } },
    { key: 'cultures', label: { ru: 'Закваска', be: 'Закваска', en: 'Culture', zh: '发酵菌' } },
  ],
  seo: {
    title: {
      ru: 'Сметана ОАО «Молочный Мир» — в стаканах, пакетах и без лактозы',
      be: 'Смятана ААТ «Малочны Мір» — у шклянках, пакетах і без лактозы',
      en: 'Natural Cultured Sour Cream | Molochny Mir',
      zh: '天然发酵酸奶油 | Molochny Mir',
    },
    description: {
      ru: 'Густая сметана без растительных жиров жирностью от 10% до 29%, с пробиотиками и безлактозная.',
      be: 'Густая смятана без раслінных тлушчаў тлустасцю ад 10% да 29%.',
      en: 'Pure dairy sour cream in retail cups and pouches, including probiotic and lactose-free options.',
      zh: '无植物油脂添加的纯正酸奶油。',
    },
  },
},
{
  id: 'tvorog',
  slug: 'tvorog',
  name: {
    ru: 'Творог',
    be: 'Тварог',
    en: 'Cottage Cheese & Tvorog',
    zh: '农夫凝乳干酪 (Tvorog)',
  },
  description: {
    ru: 'Рассыпчатый, формованный («клинок»), брикетный и безлактозный творог, богатый природным молочным белком.',
    be: 'Рассыпісты, фармованны, брыкетны і безлактозны тварог, багаты прыродным бялком.',
    en: 'Crumbly, molded, brick, and lactose-free tvorog rich in natural dairy protein.',
    zh: '松散颗粒型、真空定型及无乳糖农夫凝乳干酪，富含优质酪蛋白。',
  },
  subcategories: [
    { id: 'crumbly', name: { ru: 'Рассыпчатый и весовой', be: 'Рассыпісты і вагавы', en: 'Crumbly & Bulk', zh: '松散型凝乳' } },
    { id: 'molded', name: { ru: 'Формованный и брикетный', be: 'Фармаваны і брыкетны', en: 'Molded & Brick', zh: '定型块状凝乳' } },
    { id: 'functional-tvorog', name: { ru: 'Безлактозный и Active Life', be: 'Безлактозны і Active Life', en: 'Lactose-Free & Probiotic', zh: '无乳糖与益生菌系列' } },
  ],
  filterKeys: ['fat', 'lactoseFree', 'highProtein'],
  characteristicSchema: [
    { key: 'grain', label: { ru: 'Структура', be: 'Структура', en: 'Curd Structure', zh: '凝乳质地' } },
    { key: 'proteinNote', label: { ru: 'Пищевой профиль', be: 'Харчовы профіль', en: 'Nutrition Profile', zh: '营养特点' } },
  ],
  seo: {
    title: {
      ru: 'Творог ОАО «Молочный Мир» — рассыпчатый, формованный и безлактозный',
      be: 'Тварог ААТ «Малочны Мір» — рассыпісты, фармаваны і безлактозны',
      en: 'Traditional, Molded & Lactose-Free Tvorog | Molochny Mir',
      zh: '传统、定型与无乳糖凝乳干酪系列 | Molochny Mir',
    },
    description: {
      ru: 'Свежий творог «ГороденЪ», формованный, Active Life с пробиотиками и первый в Беларуси безлактозный творог.',
      be: 'Свежы тварог «ГорадзенЪ», фармаваны, Active Life і безлактозны тварог.',
      en: 'High-protein tvorog in sealed pouches, double-wrap bricks, and vacuum packs.',
      zh: '密封保鲜包装的高蛋白与无乳糖凝乳干酪。',
    },
  },
},
{
  id: 'butter',
  slug: 'butter',
  name: {
    ru: 'Масло сливочное',
    be: 'Масла сметанковае',
    en: 'Butter',
    zh: '天然黄油',
  },
  description: {
    ru: 'Сладкосливочное, кислосливочное, безлактозное, масло с трюфелем и наполнителями, а также весовое 20 кг для B2B.',
    be: 'Салодкасметанковае, кісласметанковае, безлактознае, з труфелем і вагавое 20 кг для B2B.',
    en: 'Sweet cream, cultured salted, lactose-free, gourmet truffle butter, and 20 kg export monoliths.',
    zh: '甜奶油黄油、发酵微咸黄油、无乳糖黄油、松露风味黄油及20公斤出口大块装。',
  },
  subcategories: [
    { id: 'sweet-cream', name: { ru: 'Сладкосливочное фасованное', be: 'Салодкасметанковае фасованае', en: 'Sweet Cream Retail', zh: '甜奶油零售装' } },
    { id: 'gourmet-butter', name: { ru: 'С наполнителями, кислосливочное и безлактозное', be: 'З напаўняльнікамі і безлактознае', en: 'Gourmet, Cultured & Lactose-Free', zh: '风味及无乳糖黄油' } },
    { id: 'bulk-butter', name: { ru: 'Весовое 20 кг (B2B / Экспорт)', be: 'Вагавое 20 кг (B2B)', en: 'Bulk 20 kg (B2B / Export)', zh: '20公斤大包装出口黄油' } },
  ],
  filterKeys: ['fat', 'lactoseFree', 'exportReady'],
  characteristicSchema: [
    { key: 'standard', label: { ru: 'Линейка / Тип', be: 'Лінейка / Тып', en: 'Range / Type', zh: '系列类型' } },
    { key: 'method', label: { ru: 'Способ производства', be: 'Спосаб вытворчасці', en: 'Churning Method', zh: '制作工艺' } },
  ],
  seo: {
    title: {
      ru: 'Масло сливочное 82,5% и 72,5% — фасованное, с трюфелем и весовое 20 кг | Молочный Мир',
      be: 'Масла сметанковае 82,5% і 72,5% — фасованае і вагавое 20 кг | Малочны Мір',
      en: 'Sweet Cream, Gourmet & Bulk Butter | Molochny Mir',
      zh: '82.5% 天然黄油、松露黄油与20公斤出口装 | Molochny Mir',
    },
    description: {
      ru: 'Натуральное сливочное масло «ГороденЪ», безлактозное масло, масло со вкусами в стекле и весовые блоки по 20 кг.',
      be: 'Натуральнае сметанковае масла з пастэрызаваных вяршкоў у фользе і маналітах па 20 кг.',
      en: 'Natural dairy butter in retail foil, glass jars, and 20 kg industrial export blocks.',
      zh: '巴氏杀菌稀奶油制成的零售与工业大块出口黄油。',
    },
  },
},
{
  id: 'ice-cream',
  slug: 'ice-cream',
  name: {
    ru: 'Мороженое',
    be: 'Марозіва',
    en: 'Ice Cream',
    zh: '冰淇淋系列',
  },
  description: {
    ru: 'Натуральный пломбир «ГороденЪ», Ice time, Tropic, Узнай мир, Симфония вкуса, протеиновое и безлактозное мороженое.',
    be: 'Натуральны пламбір «ГорадзенЪ», Ice time, Tropic, Пазнай свет, пратэінавае і безлактознае марозіва.',
    en: 'Authentic Belarusian plombir in cups, cones, and sticks, plus protein and lactose-free lines.',
    zh: '经典高脂冰淇淋、蛋白代餐冰淇淋、零乳糖冰淇淋及餐饮大桶装。',
  },
  subcategories: [
    { id: 'cups', name: { ru: 'В стаканчиках и баночках', be: 'У шкляначках', en: 'Cups & Tubs', zh: '杯装冰淇淋' } },
    { id: 'cones', name: { ru: 'В вафельных рожках и конусах', be: 'У ражках', en: 'Sugar Cones', zh: '甜筒冰淇淋' } },
    { id: 'eskimo', name: { ru: 'Эскимо в глазури', be: 'Эскімо ў глазуры', en: 'Chocolate-Coated Sticks', zh: '脆皮雪糕' } },
    { id: 'protein-diet', name: { ru: 'Протеиновое, безлактозное и без сахара', be: 'Пратэінавае і безлактознае', en: 'Protein, Lactose-Free & Sorbitol', zh: '高蛋白与零乳糖系列' } },
    { id: 'family-horeca', name: { ru: 'Крупная фасовка, тубы и весовое HoReCa', be: 'Буйная фасоўка і HoReCa', en: 'Family Packs & HoReCa Bulk', zh: '家庭装与餐饮大桶' } },
  ],
  filterKeys: ['fat', 'lactoseFree', 'highProtein', 'exportReady'],
  characteristicSchema: [
    { key: 'iceType', label: { ru: 'Вид мороженого', be: 'Від марозіва', en: 'Type', zh: '品类' } },
    { key: 'flavor', label: { ru: 'Вкусы', be: 'Смакі', en: 'Flavors', zh: '口味' } },
  ],
  seo: {
    title: {
      ru: 'Мороженое пломбир ОАО «Молочный Мир» — стаканчики, рожки, эскимо и HoReCa',
      be: 'Марозіва пламбір ААТ «Малочны Мір» — шкляначкі, ражкі, эскімо',
      en: 'Plombir & Functional Ice Cream | Molochny Mir',
      zh: '经典白俄罗斯冰淇淋与高蛋白冰淇淋 | Molochny Mir',
    },
    description: {
      ru: 'Более 20 видов мороженого: пломбир 15%–20%, Active Protein, безлактозное, с сорбитом, тубы 1 кг и весовое 2,7 кг для HoReCa.',
      be: 'Больш за 20 відаў марозіва на натуральных вяршках.',
      en: 'Over 20 plombir, cone, stick, protein, and 2.7 kg HoReCa ice cream varieties.',
      zh: '涵盖杯装、甜筒、脆皮雪糕及餐饮大包装的20余款纯正乳脂冰淇淋。',
    },
  },
},
{
  id: 'cream',
  slug: 'cream',
  name: {
    ru: 'Сливки',
    be: 'Вяршкі',
    en: 'Dairy Cream',
    zh: '稀奶油',
  },
  description: {
    ru: 'Питьевые, стерилизованные и кондитерские сливки 10%, 12%, 20% и 33% (Сливочный крем) для кофе, соусов и взбивания.',
    be: 'Пітныя, стэрылізаваныя і кандытарскія вяршкі 10%, 12%, 20% і 33% для кавы і ўзбівання.',
    en: 'Drinking, sterilized, and 33% whipping cream for baristas, pastry kitchens, and retail.',
    zh: '适用于咖啡调配、料理及烘焙打发的 10%–33% 天然动物稀奶油。',
  },
  subcategories: [
    { id: 'whipping', name: { ru: 'Для взбивания 33%', be: 'Для ўзбівання 33%', en: 'Whipping Cream 33%', zh: '33% 打发淡奶油' } },
    { id: 'culinary', name: { ru: 'Питьевые и кулинарные 10%–20%', be: 'Пітныя 10%–20%', en: 'Drinking & Culinary 10%–20%', zh: '饮用与烹饪稀奶油' } },
  ],
  filterKeys: ['fat', 'exportReady'],
  characteristicSchema: [
    { key: 'purpose', label: { ru: 'Назначение', be: 'Прызначэнне', en: 'Application', zh: '用途' } },
    { key: 'processing', label: { ru: 'Термообработка', be: 'Тэрмаапрацоўка', en: 'Treatment', zh: '热处理' } },
  ],
  seo: {
    title: {
      ru: 'Сливки для взбивания 33%, стерилизованные и питьевые | Молочный Мир',
      be: 'Вяршкі для ўзбівання 33%, стэрылізаваныя і пітныя | Малочны Мір',
      en: 'Whipping & Sterilized Dairy Cream | Molochny Mir',
      zh: '烘焙淡奶油与饮用奶油 | Molochny Mir',
    },
    description: {
      ru: 'Натуральный сливочный крем 33% с усиленной стабильностью и стерилизованные сливки 10%–33% в Tetra Pak.',
      be: 'Натуральны сметанковы крэм 33% і стэрылізаваныя вяршкі ў Tetra Pak.',
      en: 'UHT natural cream for baristas, pastry chefs, and HoReCa.',
      zh: '超高温灭菌天然动物稀奶油，适合咖啡与烘焙。',
    },
  },
},
{
  id: 'desserts',
  slug: 'desserts',
  name: {
    ru: 'Десертная продукция',
    be: 'Дэсертная прадукцыя',
    en: 'Dairy Desserts',
    zh: '乳制甜品',
  },
  description: {
    ru: 'Глазированные и сладкие творожные сырки («ГороденЪ», Active Protein, Узнай Мир, Симфония вкуса) и воздушные творожные кремы.',
    be: 'Глазураваныя і салодкія тварожныя сыркі і паветраныя тварожныя крэмы.',
    en: 'Glazed and sweet curd bars (Goroden, Active Protein, Symphonia) and whipped tvorog creams.',
    zh: '巧克力涂层凝乳甜品棒、高蛋白凝乳棒及绵密打发凝乳慕斯。',
  },
  subcategories: [
    { id: 'curd-bars', name: { ru: 'Творожные и протеиновые сырки', be: 'Тварожныя і пратэінавыя сыркі', en: 'Glazed & Protein Curd Bars', zh: '涂层与高蛋白凝乳棒' } },
    { id: 'curd-creams', name: { ru: 'Творожные кремы и муссы', be: 'Тварожныя крэмы', en: 'Whipped Tvorog Creams', zh: '打发凝乳慕斯' } },
  ],
  filterKeys: ['fat', 'highProtein'],
  characteristicSchema: [
    { key: 'glaze', label: { ru: 'Основа / Глазурь', be: 'Аснова / Глазура', en: 'Base / Coating', zh: '基底/涂层' } },
    { key: 'flavor', label: { ru: 'Вкусы', be: 'Смакі', en: 'Flavors', zh: '口味' } },
  ],
  seo: {
    title: {
      ru: 'Десертная продукция — глазированные сырки и творожные кремы | Молочный Мир',
      be: 'Дэсертная прадукцыя — глазураваныя сыркі і крэмы | Малочны Мір',
      en: 'Dairy Desserts, Curd Bars & Whipped Creams | Molochny Mir',
      zh: '乳制甜品、凝乳棒与慕斯 | Molochny Mir',
    },
    description: {
      ru: 'Творожные сырки с дубайским шоколадом, фисташкой, картошкой, 20 г белка Active Protein и взбитые кремы.',
      be: 'Тварожныя сыркі і ўзбітыя тварожныя дэсерты з натуральнага тварагу.',
      en: 'Delicate dairy desserts crafted with real tvorog.',
      zh: '选用天然凝乳制作的精致乳制甜品。',
    },
  },
},
{
  id: 'dry-dairy',
  slug: 'dry-dairy',
  name: {
    ru: 'Сухие молочные продукты',
    be: 'Сухія малочныя прадукты',
    en: 'Dry Dairy Ingredients (B2B)',
    zh: '干乳制品与原料 (B2B)',
  },
  description: {
    ru: 'Сухое обезжиренное молоко (СОМ), продукт молочный сухой (ПМС), деминерализованная сыворотка СД-40 и ЗЦМ в мешках 25 кг.',
    be: 'Сухое абястлушчанае малако (САМ), прадукт малочны сухі (ПМС), сыроватка СД-40 і ЗЦМ.',
    en: 'Skimmed milk powder (SMP), dry milk product (PMS), demineralized whey SD-40, and calf milk replacer.',
    zh: '脱脂奶粉 (SMP)、干乳制品、脱盐乳清粉 SD-40 及犊牛代乳粉（25公斤出口袋装）。',
  },
  subcategories: [
    { id: 'smp', name: { ru: 'СОМ и ПМС', be: 'САМ і ПМС', en: 'SMP & Dry Milk', zh: '脱脂奶粉与乳粉' } },
    { id: 'whey-powder', name: { ru: 'Сыворотка СД-40 и ЗЦМ', be: 'Сыроватка СД-40 і ЗЦМ', en: 'Demineralized Whey & CMR', zh: '脱盐乳清粉与代乳粉' } },
  ],
  filterKeys: ['fat', 'highProtein', 'exportReady'],
  characteristicSchema: [
    { key: 'grade', label: { ru: 'Категория / Сорт', be: 'Катэгорыя / Гатунак', en: 'Grade / Standard', zh: '等级标准' } },
    { key: 'nutrition', label: { ru: 'Пищевая ценность (100 г)', be: 'Харчовая каштоўнасць', en: 'Nutrition (100g)', zh: '营养成分 (100克)' } },
    { key: 'certifications', label: { ru: 'Сертификация', be: 'Сертыфікацыя', en: 'Certifications', zh: '认证体系' } },
  ],
  seo: {
    title: {
      ru: 'Сухие молочные продукты для экспорта и B2B — СОМ, ПМС, СД-40, ЗЦМ | Молочный Мир',
      be: 'Сухія малочныя прадукты для экспарту — САМ, ПМС, СД-40 | Малочны Мір',
      en: 'Export Dry Dairy — SMP, Whey SD-40 & CMR | Molochny Mir',
      zh: '出口级干乳制品原料 — 脱脂奶粉与乳清粉 | Molochny Mir',
    },
    description: {
      ru: 'Экспортные поставки сухого обезжиренного молока, ПМС, деминерализованной сыворотки СД-40 и ЗЦМ в мешках по 25 кг.',
      be: 'Экспартныя пастаўкі САМ, ПМС і сыроваткі СД-40 у мяшках па 25 кг.',
      en: 'Export-grade SMP and demineralized whey in 25 kg multi-wall kraft bags.',
      zh: '25公斤牛皮纸袋装出口级脱脂奶粉与脱盐乳清粉。',
    },
  },
},
{
  id: 'water',
  slug: 'water',
  name: {
    ru: 'Вода',
    be: 'Вада',
    en: 'Natural Water',
    zh: '天然饮用水',
  },
  description: {
    ru: 'Артезианская питьевая вода AQUA 365, минеральная вода «Коложская-Премиум», вода «Родная» и доставка бутилированной воды 19 л.',
    be: 'Артэзіянская пітная вада AQUA 365, мінеральная вада «Каложская-Прэміум», вада «Родная» і дастаўка 19 л.',
    en: 'Artesian drinking water AQUA 365, Kolozhskaya-Premium mineral water, Rodnaya water, and 19L delivery.',
    zh: 'AQUA 365 深层自流井饮用水、Kolozhskaya-Premium 矿泉水及 19 升桶装水配送。',
  },
  subcategories: [
    { id: 'drinking-water', name: { ru: 'Питьевая и минеральная вода', be: 'Пітная і мінеральная вада', en: 'Bottled & Mineral Water', zh: '瓶装饮用水与矿泉水' } },
    { id: 'water-delivery', name: { ru: 'Доставка воды 5–19 л', be: 'Дастаўка вады 5–19 л', en: '19L Water Delivery', zh: '19升桶装水配送' } },
  ],
  filterKeys: ['exportReady'],
  characteristicSchema: [
    { key: 'source', label: { ru: 'Источник / Скважина', be: 'Крыніца / Свідравіна', en: 'Source / Well', zh: '水源地' } },
    { key: 'mineralization', label: { ru: 'Вид / Минерализация', be: 'Від / Мінералізацыя', en: 'Type / Mineralization', zh: '类型/矿化度' } },
  ],
  seo: {
    title: {
      ru: 'Питьевая и минеральная вода ОАО «Молочный Мир» — AQUA 365, Коложская, доставка 19 л',
      be: 'Пітная і мінеральная вада — AQUA 365, Каложская, дастаўка 19 л | Малочны Мір',
      en: 'Artesian & Mineral Water — AQUA 365, Kolozhskaya | Molochny Mir',
      zh: '天然自流井饮用水与矿泉水系列 | Molochny Mir',
    },
    description: {
      ru: 'Добыча и розлив артезианской и лечебно-столовой воды на участке «Поречье», доставка бутылей 19 л для дома и офиса.',
      be: 'Здабыча і разліў артэзіянскай і мінеральнай вады на ўчастку «Парэчча», дастаўка 19 л.',
      en: 'Pure artesian and mineral water from Porechye wells, plus 19L home & office delivery.',
      zh: '波列奇耶深层矿泉水灌装及家庭办公桶装水配送服务。',
    },
  },
},
{
  id: 'other',
  slug: 'other',
  name: {
    ru: 'Молочные и сывороточные напитки',
    be: 'Малочныя і сыроватачныя напоі',
    en: 'Milk & Whey Drinks',
    zh: '乳味与乳清饮品',
  },
  description: {
    ru: 'Освежающие сывороточные напитки «Био-Ритм», кофейные молочные напитки COFFEE BREAK и фруктовые коктейли MILK.',
    be: 'Асвяжальныя сыроватачныя напоі «Бія-Рытм», кававыя напоі COFFEE BREAK і кактэйлі MILK.',
    en: 'Refreshing Bio-Ritm whey drinks, COFFEE BREAK milk lattes, and MILK fruit beverages.',
    zh: '清爽乳清果汁饮品、COFFEE BREAK 咖啡牛奶及水果牛奶饮品。',
  },
  subcategories: [
    { id: 'whey-drinks', name: { ru: 'Сывороточные напитки', be: 'Сыроватачныя напоі', en: 'Whey Beverages', zh: '乳清饮品' } },
    { id: 'milk-cocktails', name: { ru: 'Кофейные и молочные напитки', be: 'Кававыя і малочныя напоі', en: 'Coffee & Milk Drinks', zh: '咖啡与风味乳饮' } },
  ],
  filterKeys: ['fat', 'lactoseFree'],
  characteristicSchema: [
    { key: 'base', label: { ru: 'Основа', be: 'Аснова', en: 'Base', zh: '基底原料' } },
    { key: 'flavor', label: { ru: 'Вкусы', be: 'Смакі', en: 'Flavors', zh: '口味' } },
  ],
  seo: {
    title: {
      ru: 'Молочные и сывороточные напитки — COFFEE BREAK, MILK, Био-Ритм | Молочный Мир',
      be: 'Малочныя і сыроватачныя напоі — COFFEE BREAK, MILK, Бія-Рытм | Малочны Мір',
      en: 'Coffee Milk & Whey Drinks | Molochny Mir',
      zh: '乳清果汁与咖啡风味牛奶饮品 | Molochny Mir',
    },
    description: {
      ru: 'Напитки COFFEE BREAK (капучино, латте, матча, безлактозный), MILK с ягодами и бананом и сывороточный напиток «Био-Ритм».',
      be: 'Напоі COFFEE BREAK, MILK і сыроватачны напой «Бія-Рытм».',
      en: 'Ready-to-drink coffee milk lattes, fruit milk shakes, and Bio-Ritm whey drinks.',
      zh: '即饮咖啡拿铁牛奶、水果风味乳及乳清果汁饮品。',
    },
  },
},
];
