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
      ru: 'Полутвёрдые, выдержанные и рассольные сыры, включая линейку для пиццы и HoReCa.',
      be: 'Паўцвёрдыя, вытрыманыя і расольныя сыры, уключаючы лінейку для піцы і HoReCa.',
      en: 'Semi-hard, aged, and pasta filata cheeses including professional pizza and HoReCa formats.',
      zh: '半硬质奶酪、陈年奶酪及新鲜马苏里拉奶酪，适用于餐饮与零售。',
    },
    subcategories: [
      { id: 'pasta-filata', name: { ru: 'Сыры группы Паста Филата', be: 'Сыры групы Паста Філата', en: 'Pasta Filata', zh: '拉伸凝乳奶酪' } },
      { id: 'aged-semi-hard', name: { ru: 'Полутвёрдые и выдержанные', be: 'Паўцвёрдыя і вытрыманыя', en: 'Semi-Hard & Aged', zh: '半硬质与陈年奶酪' } },
      { id: 'soft-mold', name: { ru: 'Мягкие и деликатесные', be: 'Мяккія і дэлікатэсныя', en: 'Soft & Gourmet', zh: '软质风味奶酪' } },
    ],
    filterKeys: ['fat', 'highProtein', 'exportReady'],
    characteristicSchema: [
      { key: 'cheeseType', label: { ru: 'Вид сыра', be: 'Від сыру', en: 'Cheese Type', zh: '奶酪类型' } },
      { key: 'aging', label: { ru: 'Выдержка', be: 'Вытрымка', en: 'Maturation', zh: '成熟期' } },
      { key: 'shape', label: { ru: 'Форма', be: 'Форма', en: 'Format / Shape', zh: '形状' } },
      { key: 'milkBase', label: { ru: 'Сырьё', be: 'Сыравіна', en: 'Milk Base', zh: '原料奶' } },
    ],
    seo: {
      title: {
        ru: 'Сыры ОАО «Молочный Мир» — Моцарелла, выдержанные и полутвёрдые сыры',
        be: 'Сыры ААТ «Малочны Мір» — Мацарэла, вытрыманыя і паўцвёрдыя сыры',
        en: 'Cheeses by Molochny Mir — Mozzarella, Aged & Semi-Hard Varieties',
        zh: 'Molochny Mir 奶酪系列 — 马苏里拉与陈年奶酪',
      },
      description: {
        ru: 'Каталог сыров ОАО «Молочный Мир»: фасовка для розницы и HoReCa, точные характеристики и экспортные спецификации.',
        be: 'Каталог сыроў ААТ «Малочны Мір»: фасоўка для розніцы і HoReCa, дакладныя характарыстыкі.',
        en: 'Full catalog of Molochny Mir cheeses with retail and HoReCa packaging variants and export specs.',
        zh: '白俄罗斯 Molochny Mir 奶酪完整目录，涵盖零售与餐饮大包装及出口规格。',
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
      ru: 'Пастеризованное, ультрапастеризованное и безлактозное молоко высших сортов.',
      be: 'Пастэрызаванае, ультрапастэрызаванае і безлактознае малако вышэйшых гатункаў.',
      en: 'Pasteurized, UHT, and lactose-free cow milk sourced from certified farms.',
      zh: '巴氏杀菌乳、超高温灭菌乳及无乳糖牛奶。',
    },
    subcategories: [
      { id: 'pasteurized', name: { ru: 'Пастеризованное', be: 'Пастэрызаванае', en: 'Pasteurized', zh: '巴氏杀菌' } },
      { id: 'uht', name: { ru: 'Ультрапастеризованное (UHT)', be: 'Ультрапастэрызаванае (UHT)', en: 'UHT Milk', zh: '超高温灭菌 (UHT)' } },
      { id: 'lactose-free', name: { ru: 'Безлактозное', be: 'Безлактознае', en: 'Lactose-Free', zh: '无乳糖' } },
    ],
    filterKeys: ['fat', 'lactoseFree', 'exportReady'],
    characteristicSchema: [
      { key: 'processing', label: { ru: 'Термообработка', be: 'Тэрмаапрацоўка', en: 'Heat Treatment', zh: '杀菌工艺' } },
      { key: 'milkBase', label: { ru: 'Сырьё', be: 'Сыравіна', en: 'Milk Source', zh: '奶源' } },
      { key: 'lactose', label: { ru: 'Лактоза', be: 'Лактоза', en: 'Lactose Content', zh: '乳糖含量' } },
    ],
    seo: {
      title: {
        ru: 'Молоко ОАО «Молочный Мир» — классическое и безлактозное',
        be: 'Малако ААТ «Малочны Мір» — класічнае і безлактознае',
        en: 'Milk Products — Pasteurized, UHT & Lactose-Free | Molochny Mir',
        zh: 'Molochny Mir 纯牛奶与无乳糖牛奶系列',
      },
      description: {
        ru: 'Ассортимент питьевого молока ОАО «Молочный Мир» в ПЭТ-бутылках и асептической упаковке Tetra Pak.',
        be: 'Асартымент пітнога малака ААТ «Малочны Мір» у ПЭТ-бутэльках і ўпакоўцы Tetra Pak.',
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
      ru: 'Кефир, ряженка и простокваша на живых заквасках собственного производства.',
      be: 'Кефір, ражанка і прастакваша на жывых заквасках уласнай вытворчасці.',
      en: 'Traditional kefir and fermented milk beverages brewed with live probiotic cultures.',
      zh: '采用活性益生菌发酵的传统开菲尔及发酵乳饮品。',
    },
    subcategories: [
      { id: 'kefir', name: { ru: 'Кефир', be: 'Кефір', en: 'Kefir', zh: '开菲尔' } },
      { id: 'ryazhenka', name: { ru: 'Ряженка и бифитат', be: 'Ражанка і біфітат', en: 'Baked Fermented Milk', zh: '发酵烤乳' } },
    ],
    filterKeys: ['fat', 'highProtein'],
    characteristicSchema: [
      { key: 'cultures', label: { ru: 'Закваска', be: 'Закваска', en: 'Cultures', zh: '发酵菌种' } },
      { key: 'probiotics', label: { ru: 'Пробиотики (КОЕ/г)', be: 'Прабіётыкі (КАЕ/г)', en: 'Probiotic Count', zh: '益生菌活菌数' } },
    ],
    seo: {
      title: {
        ru: 'Кисломолочная продукция — Кефир и пробиотические напитки | Молочный Мир',
        be: 'Кісламалочная прадукцыя — Кефір і прабіятычныя напоі | Малочны Мір',
        en: 'Fermented Dairy & Kefir | Molochny Mir',
        zh: '发酵乳与开菲尔系列 | Molochny Mir',
      },
      description: {
        ru: 'Традиционный кефир и кисломолочные напитки ОАО «Молочный Мир» с контролем живых культур.',
        be: 'Традыцыйны кефір і кісламалочныя напоі ААТ «Малочны Мір».',
        en: 'Traditional Belarusian kefir and fermented beverages.',
        zh: '白俄罗斯传统开菲尔及益生菌发酵乳饮品。',
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
      ru: 'Греческие высокобелковые и питьевые йогурты без искусственных стабилизаторов.',
      be: 'Грэчаскія высокабялковыя і пітныя ёгурты без штучных стабілізатараў.',
      en: 'Strained high-protein Greek yogurts and smooth drinkable yogurts.',
      zh: '高蛋白希腊酸奶与天然风味饮用型酸奶。',
    },
    subcategories: [
      { id: 'greek', name: { ru: 'Греческие и высокобелковые', be: 'Грэчаскія і высокабялковыя', en: 'Greek & High-Protein', zh: '希腊高蛋白酸奶' } },
      { id: 'drinkable', name: { ru: 'Питьевые йогурты', be: 'Пітныя ёгурты', en: 'Drinkable Yogurts', zh: '饮用型酸奶' } },
    ],
    filterKeys: ['fat', 'highProtein', 'lactoseFree'],
    characteristicSchema: [
      { key: 'flavor', label: { ru: 'Вкус', be: 'Смак', en: 'Flavor', zh: '口味' } },
      { key: 'proteinNote', label: { ru: 'Содержание белка', be: 'Утрыманне бялку', en: 'Protein Profile', zh: '蛋白质含量' } },
      { key: 'sugar', label: { ru: 'Добавленный сахар', be: 'Дададзены цукар', en: 'Added Sugar', zh: '添加糖' } },
    ],
    seo: {
      title: {
        ru: 'Йогурты ОАО «Молочный Мир» — греческие и высокобелковые',
        be: 'Ёгурты ААТ «Малочны Мір» — грэчаскія і высокабялковыя',
        en: 'Greek & High-Protein Yogurts | Molochny Mir',
        zh: '高蛋白希腊酸奶系列 | Molochny Mir',
      },
      description: {
        ru: 'Йогурты с повышенным содержанием белка и натуральными наполнителями.',
        be: 'Ёгурты з павышаным утрыманнем бялку і натуральнымі напаўняльнікамі.',
        en: 'High-protein strained yogurts and natural dairy snacks.',
        zh: '富含天然乳蛋白的希腊酸奶与饮用酸奶。',
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
      ru: 'Густая натуральная сметана из свежих сливок жирностью от 15% до 25%.',
      be: 'Густая натуральная смятана са свежых вяршкоў тлустасцю ад 15% да 25%.',
      en: 'Thick cultured sour cream crafted from pure pasteurized dairy cream.',
      zh: '纯鲜奶油发酵制成的浓稠天然酸奶油。',
    },
    subcategories: [
      { id: 'classic-sour-cream', name: { ru: 'Классическая 15%–25%', be: 'Класічная 15%–25%', en: 'Classic 15%–25%', zh: '经典 15%–25%' } },
    ],
    filterKeys: ['fat'],
    characteristicSchema: [
      { key: 'consistency', label: { ru: 'Консистенция', be: 'Кансістэнцыя', en: 'Texture', zh: '质地' } },
      { key: 'cultures', label: { ru: 'Закваска', be: 'Закваска', en: 'Culture', zh: '发酵菌' } },
    ],
    seo: {
      title: {
        ru: 'Сметана ОАО «Молочный Мир» — натуральные сливки и закваска',
        be: 'Смятана ААТ «Малочны Мір» — натуральныя вяршкі і закваска',
        en: 'Natural Cultured Sour Cream | Molochny Mir',
        zh: '天然发酵酸奶油 | Molochny Mir',
      },
      description: {
        ru: 'Густая сметана без растительных жиров в стаканах и ведрах для HoReCa.',
        be: 'Густая смятана без раслінных тлушчаў у шклянках і вёдрах для HoReCa.',
        en: 'Pure dairy sour cream in retail cups and foodservice tubs.',
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
      ru: 'Рассыпчатый и зернёный творог, богатый природным молочным белком и кальцием.',
      be: 'Рассыпісты і зярністы тварог, багаты прыродным малочным бялком і кальцыем.',
      en: 'Traditional crumbly and grained tvorog rich in natural dairy protein.',
      zh: '富含天然乳蛋白与钙质的传统颗粒凝乳干酪。',
    },
    subcategories: [
      { id: 'crumbly', name: { ru: 'Рассыпчатый', be: 'Рассыпісты', en: 'Crumbly Tvorog', zh: '松散型凝乳' } },
      { id: 'grained', name: { ru: 'Зернёный в сливках', be: 'Зярністы ў вяршках', en: 'Cottage Cheese in Cream', zh: '奶油颗粒干酪' } },
    ],
    filterKeys: ['fat', 'highProtein'],
    characteristicSchema: [
      { key: 'grain', label: { ru: 'Структура зерна', be: 'Структура зярна', en: 'Curd Structure', zh: '凝乳颗粒' } },
      { key: 'proteinNote', label: { ru: 'Белок на 100 г', be: 'Бялок на 100 г', en: 'Protein per 100g', zh: '每100克蛋白质' } },
    ],
    seo: {
      title: {
        ru: 'Творог ОАО «Молочный Мир» — рассыпчатый и зернёный',
        be: 'Тварог ААТ «Малочны Мір» — рассыпісты і зярністы',
        en: 'Traditional Tvorog & Cottage Cheese | Molochny Mir',
        zh: '传统凝乳干酪系列 | Molochny Mir',
      },
      description: {
        ru: 'Свежий творог с высоким содержанием белка в удобной герметичной упаковке.',
        be: 'Свежы тварог з высокім утрыманнем бялку ў зручнай герметычнай упакоўцы.',
        en: 'High-protein tvorog in sealed retail pouches and cups.',
        zh: '密封保鲜包装的高蛋白凝乳干酪。',
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
      ru: 'Сладкосливочное несолёное масло жирностью 72,5% и 82,5% по ГОСТ, в том числе для экспорта.',
      be: 'Салодкасметанковае несалёнае масла тлустасцю 72,5% і 82,5% па ДАСТ.',
      en: 'Sweet cream unsalted butter (72.5% and 82.5% fat) in retail foil and 20 kg export blocks.',
      zh: '72.5%与82.5%乳脂含量的天然甜奶油无盐黄油，支持20公斤出口大包装。',
    },
    subcategories: [
      { id: 'sweet-cream', name: { ru: 'Сладкосливочное', be: 'Салодкасметанковае', en: 'Sweet Cream Butter', zh: '甜奶油黄油' } },
    ],
    filterKeys: ['fat', 'exportReady'],
    characteristicSchema: [
      { key: 'standard', label: { ru: 'Стандарт', be: 'Стандарт', en: 'Standard', zh: '执行标准' } },
      { key: 'method', label: { ru: 'Способ сбивания', be: 'Спосаб збівання', en: 'Churning Method', zh: '制作工艺' } },
    ],
    seo: {
      title: {
        ru: 'Масло сливочное 82,5% и 72,5% — ОАО «Молочный Мир»',
        be: 'Масла сметанковае 82,5% і 72,5% — ААТ «Малочны Мір»',
        en: 'Sweet Cream Butter 82.5% & 72.5% | Molochny Mir',
        zh: '82.5% 天然黄油 | Molochny Mir',
      },
      description: {
        ru: 'Натуральное сливочное масло из пастеризованных сливок: розничная фасовка и монолит 20 кг для экспорта.',
        be: 'Натуральнае сметанковае масла з пастэрызаваных вяршкоў: розніца і маналіт 20 кг.',
        en: 'Natural sweet cream butter in retail foil packs and 20 kg industrial blocks.',
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
      ru: 'Натуральный пломбир на свежих сливках и цельном молоке без заменителей молочного жира.',
      be: 'Натуральны пламбір на свежых вяршках і цэльным малацэ без заменнікаў малочнага тлушчу.',
      en: 'Authentic Belarusian plombir ice cream made with fresh cream and whole milk.',
      zh: '采用鲜奶油与全脂牛奶制作的经典白俄罗斯冰淇淋。',
    },
    subcategories: [
      { id: 'plombir', name: { ru: 'Пломбир', be: 'Пламбір', en: 'Plombir', zh: '经典高脂冰淇淋' } },
    ],
    filterKeys: ['fat', 'exportReady'],
    characteristicSchema: [
      { key: 'iceType', label: { ru: 'Вид мороженого', be: 'Від марозіва', en: 'Type', zh: '品类' } },
      { key: 'flavor', label: { ru: 'Вкус', be: 'Смак', en: 'Flavor', zh: '口味' } },
    ],
    seo: {
      title: {
        ru: 'Мороженое пломбир ОАО «Молочный Мир»',
        be: 'Марозіва пламбір ААТ «Малочны Мір»',
        en: 'Plombir Ice Cream | Molochny Mir',
        zh: '经典白俄罗斯冰淇淋 | Molochny Mir',
      },
      description: {
        ru: 'Пломбир ванильный в стаканчиках, рожках и семейных контейнерах.',
        be: 'Пламбір ванільны ў шкляначках, ражках і сямейных кантэйнерах.',
        en: 'Vanilla plombir ice cream in cones, cups, and family tubs.',
        zh: '蛋筒、杯装及家庭装纯正香草冰淇淋。',
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
      ru: 'Питьевые и кондитерские сливки жирностью 10%, 20% и 33% для кофе и взбивания.',
      be: 'Пітныя і кандытарскія вяршкі тлустасцю 10%, 20% і 33% для кавы і ўзбівання.',
      en: 'Coffee cream and 33% whipping cream for pastry, HoReCa, and retail.',
      zh: '适用于咖啡调配与烘焙打发的10%–33%天然稀奶油。',
    },
    subcategories: [
      { id: 'whipping', name: { ru: 'Для взбивания 33%', be: 'Для ўзбівання 33%', en: 'Whipping Cream 33%', zh: '33%淡奶油' } },
    ],
    filterKeys: ['fat', 'exportReady'],
    characteristicSchema: [
      { key: 'purpose', label: { ru: 'Назначение', be: 'Прызначэнне', en: 'Application', zh: '用途' } },
      { key: 'processing', label: { ru: 'Термообработка', be: 'Тэрмаапрацоўка', en: 'Treatment', zh: '热处理' } },
    ],
    seo: {
      title: {
        ru: 'Сливки для взбивания 33% и питьевые | Молочный Мир',
        be: 'Вяршкі для ўзбівання 33% і пітныя | Малочны Мір',
        en: 'Whipping & Culinary Cream | Molochny Mir',
        zh: '烘焙淡奶油与饮用奶油 | Molochny Mir',
      },
      description: {
        ru: 'Ультрапастеризованные натуральные сливки для бариста, кондитеров и HoReCa.',
        be: 'Ультрапастэрызаваныя натуральныя вяршкі для барыста, кандытараў і HoReCa.',
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
      ru: 'Творожные сырки, муссы и сладкие молочные десерты с натуральным шоколадом.',
      be: 'Тварожныя сыркі, мусы і салодкія малочныя дэсерты з натуральным шакаладам.',
      en: 'Glazed curd bars, creamy mousses, and dairy desserts.',
      zh: '纯正巧克力涂层凝乳甜品棒与奶酪慕斯。',
    },
    subcategories: [
      { id: 'curd-bars', name: { ru: 'Глазированные сырки', be: 'Глазураваныя сыркі', en: 'Glazed Curd Bars', zh: '涂层凝乳棒' } },
    ],
    filterKeys: ['fat'],
    characteristicSchema: [
      { key: 'glaze', label: { ru: 'Глазурь / Основа', be: 'Глазура / Аснова', en: 'Coating / Base', zh: '涂层/基底' } },
      { key: 'flavor', label: { ru: 'Вкус', be: 'Смак', en: 'Flavor', zh: '口味' } },
    ],
    seo: {
      title: {
        ru: 'Десертная продукция — глазированные сырки и муссы | Молочный Мир',
        be: 'Дэсертная прадукцыя — глазураваныя сыркі і мусы | Малочны Мір',
        en: 'Dairy Desserts & Glazed Curd Bars | Molochny Mir',
        zh: '乳制甜品与凝乳棒 | Molochny Mir',
      },
      description: {
        ru: 'Нежные творожные десерты и глазированные сырки из натурального творога.',
        be: 'Далікатныя тварожныя дэсерты і глазураваныя сыркі з натуральнага тварагу.',
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
      ru: 'Сухое обезжиренное молоко (СОМ), цельное сухое молоко и сыворотка для пищевой промышленности и экспорта.',
      be: 'Сухое абястлушчанае малако (САМ), цэльнае сухое малако і сыроватка для экспарту.',
      en: 'Skimmed milk powder (SMP), whole milk powder (WMP), and demineralized whey for global B2B export.',
      zh: '脱脂奶粉 (SMP)、全脂奶粉及乳清粉，面向全球工业与出口合作伙伴。',
    },
    subcategories: [
      { id: 'smp', name: { ru: 'Сухое обезжиренное молоко (СОМ)', be: 'Сухое абястлушчанае малако (САМ)', en: 'Skimmed Milk Powder (SMP)', zh: '脱脂奶粉 (SMP)' } },
    ],
    filterKeys: ['fat', 'highProtein', 'exportReady'],
    characteristicSchema: [
      { key: 'grade', label: { ru: 'Категория / Сорт', be: 'Катэгорыя / Гатунак', en: 'Grade / Standard', zh: '等级标准' } },
      { key: 'moisture', label: { ru: 'Массовая доля влаги', be: 'Масавая доля вільгаці', en: 'Moisture Max', zh: '最大水分含量' } },
      { key: 'certifications', label: { ru: 'Сертификация', be: 'Сертыфікацыя', en: 'Certifications', zh: '认证体系' } },
    ],
    seo: {
      title: {
        ru: 'Сухие молочные продукты для экспорта и B2B — СОМ, СЦМ | Молочный Мир',
        be: 'Сухія малочныя прадукты для экспарту і B2B — САМ, СЦМ | Малочны Мір',
        en: 'Export Dry Dairy — Skimmed Milk Powder (SMP) | Molochny Mir',
        zh: '出口级干乳制品原料 — 脱脂奶粉 | Molochny Mir',
      },
      description: {
        ru: 'Экспортные поставки сухого обезжиренного молока в мешках по 25 кг с полным пакетом ветеринарных и ISO сертификатов.',
        be: 'Экспартныя пастаўкі сухога абястлушчанага малака ў мяшках па 25 кг.',
        en: 'Export-grade SMP in 25 kg multi-wall kraft bags with full veterinary and FSSC 22000/ISO documentation.',
        zh: '25公斤牛皮纸袋装出口级脱脂奶粉，提供完整FSSC 22000及ISO质量认证。',
      },
    },
  },
];
