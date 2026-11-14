import { Product, RedirectRule } from '../types';
import { ASSETS } from './assets';

export const products: Product[] = [
  {
    "id": "mozzarella",
    "slug": "mozzarella",
    "category": "cheese",
    "subcategory": "pasta-filata",
    "name": {
      "ru": "Моцарелла классическая",
      "be": "Мацарэла класічная",
      "en": "Classic Mozzarella",
      "zh": "经典马苏里拉奶酪"
    },
    "description": {
      "ru": "Нежный рассольный сыр группы Паста Филата из свежего коровьего молока. Идеален для салатов капрезе, брускетт и повседневной кухни.",
      "be": "Далікатны расольны сыр групы Паста Філата са свежага каровінага малака. Ідэальны для салатаў капрызе і брускет.",
      "en": "Delicate pasta filata brine cheese made from fresh cow milk. Balanced milky flavor for caprese, bruschetta, and fresh dishes.",
      "zh": "采用鲜牛奶制成的柔嫩拉伸凝乳盐水奶酪，奶香醇正，适合制作卡普雷塞沙拉与意式轻食。"
    },
    "image": ASSETS.productMozzarella,
    "fatContent": 45.0,
    "proteinContent": 19.0,
    "lactoseFree": false,
    "exportReady": true,
    "featured": true,
    "visible": true,
    "packages": [
      {
        "id": "moz-125",
        "weight": "125 г",
        "weightGrams": 125,
        "shelfLife": {
          "ru": "30 суток",
          "be": "30 сутак",
          "en": "30 days",
          "zh": "30天"
        },
        "storage": {
          "ru": "+2…+6 °C",
          "be": "+2…+6 °C",
          "en": "+2…+6 °C",
          "zh": "+2…+6 °C"
        },
        "packagingType": {
          "ru": "Герметичный флоу-пак с рассолом",
          "be": "Герметычны флоў-пак з расолам",
          "en": "Sealed brine flow-pack",
          "zh": "充液密封保鲜袋"
        },
        "unitsPerBox": 16,
        "gtin": "4810268041011"
      },
      {
        "id": "moz-250",
        "weight": "250 г",
        "weightGrams": 250,
        "shelfLife": {
          "ru": "30 суток",
          "be": "30 сутак",
          "en": "30 days",
          "zh": "30天"
        },
        "storage": {
          "ru": "+2…+6 °C",
          "be": "+2…+6 °C",
          "en": "+2…+6 °C",
          "zh": "+2…+6 °C"
        },
        "packagingType": {
          "ru": "Вакуумный пакет / термоформовка",
          "be": "Вакуумны пакет / тэрмафармоўка",
          "en": "Vacuum thermoform pouch",
          "zh": "真空热塑膜包装"
        },
        "unitsPerBox": 12,
        "gtin": "4810268041028"
      },
      {
        "id": "moz-500",
        "weight": "500 г",
        "weightGrams": 500,
        "shelfLife": {
          "ru": "45 суток",
          "be": "45 сутак",
          "en": "45 days",
          "zh": "45天"
        },
        "storage": {
          "ru": "+2…+6 °C",
          "be": "+2…+6 °C",
          "en": "+2…+6 °C",
          "zh": "+2…+6 °C"
        },
        "packagingType": {
          "ru": "Многослойная барьерная плёнка",
          "be": "Шматслойная бар’ерная плёнка",
          "en": "Barrier film pack",
          "zh": "多层阻隔膜包装"
        },
        "unitsPerBox": 10,
        "gtin": "4810268041035"
      },
      {
        "id": "moz-1000",
        "weight": "1 кг",
        "weightGrams": 1000,
        "shelfLife": {
          "ru": "45 суток",
          "be": "45 сутак",
          "en": "45 days",
          "zh": "45天"
        },
        "storage": {
          "ru": "+2…+6 °C",
          "be": "+2…+6 °C",
          "en": "+2…+6 °C",
          "zh": "+2…+6 °C"
        },
        "packagingType": {
          "ru": "Блок HoReCa (вакуум)",
          "be": "Блок HoReCa (вакуум)",
          "en": "HoReCa vacuum block",
          "zh": "餐饮渠道真空大块装"
        },
        "unitsPerBox": 6,
        "gtin": "4810268041042"
      }
    ],
    "characteristics": {
      "cheeseType": {
        "ru": "Мягкий рассольный сыр",
        "be": "Мяккі расольны сыр",
        "en": "Soft pasta filata cheese",
        "zh": "软质拉伸凝乳奶酪"
      },
      "aging": {
        "ru": "Без созревания",
        "be": "Без паспявання",
        "en": "Fresh / unripened",
        "zh": "新鲜免成熟"
      },
      "shape": {
        "ru": "Шарики / батон",
        "be": "Шарыкі / батон",
        "en": "Bocconcini spheres / loaf",
        "zh": "球形 / 砖形"
      },
      "milkBase": {
        "ru": "Пастеризованное коровье молоко",
        "be": "Пастэрызаванае каровіна малако",
        "en": "Pasteurized cow milk",
        "zh": "巴氏杀菌牛奶"
      }
    },
    "useCases": [
      "caprese",
      "salad",
      "pizza",
      "daily",
      "high-protein"
    ],
    "relatedIds": [
      "mozzarella-pizza",
      "goroden-aged",
      "suluguni-grodno"
    ],
    "seo": {
      "title": {
        "ru": "Моцарелла классическая (45.0%) — характеристики и фасовка | Молочный Мир",
        "be": "Мацарэла класічная (45.0%) — характарыстыкі і фасоўка | Малочны Мір",
        "en": "Classic Mozzarella (45.0% Fat) — Specs & Packaging | Molochny Mir",
        "zh": "经典马苏里拉奶酪 (45.0% 乳脂) — 规格与包装 | Molochny Mir"
      },
      "description": {
        "ru": "Моцарелла классическая: Нежный рассольный сыр группы Паста Филата из свежего коровьего молока. Идеален для салатов капрезе, брускетт и повседнев Фасовки: 125 г, 250 г, 500 г, 1 кг.",
        "be": "Мацарэла класічная: Далікатны расольны сыр групы Паста Філата са свежага каровінага малака. Ідэальны для салатаў капрызе і брускет. Фасоўкі: 125 г, 250 г, 500 г, 1 кг.",
        "en": "Classic Mozzarella: Delicate pasta filata brine cheese made from fresh cow milk. Balanced milky flavor for caprese, bruschetta, and fresh di Formats: 125 г, 250 г, 500 г, 1 кг.",
        "zh": "经典马苏里拉奶酪：采用鲜牛奶制成的柔嫩拉伸凝乳盐水奶酪，奶香醇正，适合制作卡普雷塞沙拉与意式轻食。 规格：125 г, 250 г, 500 г, 1 кг。"
      },
      "h1": {
        "ru": "Моцарелла классическая",
        "be": "Мацарэла класічная",
        "en": "Classic Mozzarella",
        "zh": "经典马苏里拉奶酪"
      }
    }
  },
  {
    "id": "mozzarella-pizza",
    "slug": "mozzarella-pizza",
    "category": "cheese",
    "subcategory": "pasta-filata",
    "name": {
      "ru": "Моцарелла для пиццы HoReCa",
      "be": "Мацарэла для піцы HoReCa",
      "en": "Mozzarella for Pizza (HoReCa)",
      "zh": "披萨专用马苏里拉奶酪 (HoReCa)"
    },
    "description": {
      "ru": "Полутвёрдый термостабильный сыр с пониженной влажностью. Равномерно плавится, образует эластичную тягучую нить и золотистую корочку без пригорания.",
      "be": "Паўцвёрды тэрмастабільны сыр з паніжанай вільготнасцю. Раўнамерна плавіцца і ўтварае эластычную нітку.",
      "en": "Low-moisture pasta filata mozzarella engineered for high-temperature pizza ovens. Delivers uniform melt, clean stretch, and golden blistering without oil separation.",
      "zh": "低水分热稳定型马苏里拉奶酪，专为高温披萨烤炉研发，拉丝绵长、融化均匀且不析油。"
    },
    "image": ASSETS.productMozzarella,
    "fatContent": 45.0,
    "proteinContent": 24.0,
    "lactoseFree": false,
    "exportReady": true,
    "featured": true,
    "visible": true,
    "packages": [
      {
        "id": "mozp-500",
        "weight": "500 г",
        "weightGrams": 500,
        "shelfLife": {
          "ru": "60 суток",
          "be": "60 сутак",
          "en": "60 days",
          "zh": "60天"
        },
        "storage": {
          "ru": "0…+6 °C",
          "be": "0…+6 °C",
          "en": "0…+6 °C",
          "zh": "0…+6 °C"
        },
        "packagingType": {
          "ru": "Термоусадочная вакуум-плёнка",
          "be": "Тэрмаўсадачная вакуум-плёнка",
          "en": "Shrink vacuum film",
          "zh": "热收缩真空膜"
        },
        "unitsPerBox": 12,
        "gtin": "4810268041110"
      },
      {
        "id": "mozp-1000",
        "weight": "1 кг",
        "weightGrams": 1000,
        "shelfLife": {
          "ru": "90 суток",
          "be": "90 сутак",
          "en": "90 days",
          "zh": "90天"
        },
        "storage": {
          "ru": "0…+6 °C",
          "be": "0…+6 °C",
          "en": "0…+6 °C",
          "zh": "0…+6 °C"
        },
        "packagingType": {
          "ru": "Блок для пиццерий (вакуум)",
          "be": "Блок для піцэрый (вакуум)",
          "en": "Pizzeria vacuum block",
          "zh": "披萨店专用真空块"
        },
        "unitsPerBox": 8,
        "gtin": "4810268041127"
      },
      {
        "id": "mozp-2500",
        "weight": "2.5 кг",
        "weightGrams": 2500,
        "shelfLife": {
          "ru": "90 суток",
          "be": "90 сутак",
          "en": "90 days",
          "zh": "90天"
        },
        "storage": {
          "ru": "0…+6 °C",
          "be": "0…+6 °C",
          "en": "0…+6 °C",
          "zh": "0…+6 °C"
        },
        "packagingType": {
          "ru": "Евробатон HoReCa (вакуум)",
          "be": "Еўрабатон HoReCa (вакуум)",
          "en": "HoReCa Euro-loaf vacuum",
          "zh": "商用欧式大条装"
        },
        "unitsPerBox": 4,
        "gtin": "4810268041134"
      }
    ],
    "characteristics": {
      "cheeseType": {
        "ru": "Полутвёрдый для запекания",
        "be": "Паўцвёрды для запякання",
        "en": "Low-moisture pasta filata",
        "zh": "低水分半硬质马苏里拉"
      },
      "aging": {
        "ru": "14 суток",
        "be": "14 сутак",
        "en": "14 days stabilization",
        "zh": "14天稳态熟化"
      },
      "shape": {
        "ru": "Брус прямоугольный (удобен для тёрки)",
        "be": "Брус прамавугольны",
        "en": "Rectangular shredding loaf",
        "zh": "长方砖形（易擦丝）"
      },
      "milkBase": {
        "ru": "Нормализованное коровье молоко",
        "be": "Нармалізаванае каровіна малако",
        "en": "Standardized cow milk",
        "zh": "标准化鲜牛奶"
      }
    },
    "useCases": [
      "pizza",
      "baking",
      "horeca",
      "high-protein"
    ],
    "relatedIds": [
      "mozzarella",
      "goroden-aged",
      "butter-825"
    ],
    "seo": {
      "title": {
        "ru": "Моцарелла для пиццы HoReCa (45.0%) — характеристики и фасовка | Молочный Мир",
        "be": "Мацарэла для піцы HoReCa (45.0%) — характарыстыкі і фасоўка | Малочны Мір",
        "en": "Mozzarella for Pizza (HoReCa) (45.0% Fat) — Specs & Packaging | Molochny Mir",
        "zh": "披萨专用马苏里拉奶酪 (HoReCa) (45.0% 乳脂) — 规格与包装 | Molochny Mir"
      },
      "description": {
        "ru": "Моцарелла для пиццы HoReCa: Полутвёрдый термостабильный сыр с пониженной влажностью. Равномерно плавится, образует эластичную тягучую нить и золотис Фасовки: 500 г, 1 кг, 2.5 кг.",
        "be": "Мацарэла для піцы HoReCa: Паўцвёрды тэрмастабільны сыр з паніжанай вільготнасцю. Раўнамерна плавіцца і ўтварае эластычную нітку. Фасоўкі: 500 г, 1 кг, 2.5 кг.",
        "en": "Mozzarella for Pizza (HoReCa): Low-moisture pasta filata mozzarella engineered for high-temperature pizza ovens. Delivers uniform melt, clean stretch,  Formats: 500 г, 1 кг, 2.5 кг.",
        "zh": "披萨专用马苏里拉奶酪 (HoReCa)：低水分热稳定型马苏里拉奶酪，专为高温披萨烤炉研发，拉丝绵长、融化均匀且不析油。 规格：500 г, 1 кг, 2.5 кг。"
      },
      "h1": {
        "ru": "Моцарелла для пиццы HoReCa",
        "be": "Мацарэла для піцы HoReCa",
        "en": "Mozzarella for Pizza (HoReCa)",
        "zh": "披萨专用马苏里拉奶酪 (HoReCa)"
      }
    }
  },
  {
    "id": "goroden-aged",
    "slug": "goroden-aged",
    "category": "cheese",
    "subcategory": "aged-semi-hard",
    "name": {
      "ru": "Сыр «ГороденЪ» выдержанный",
      "be": "Сыр «ГорадзенЪ» вытрыманы",
      "en": "Goroden Aged Reserve Cheese",
      "zh": "Goroden 陈年窖藏奶酪"
    },
    "description": {
      "ru": "Флагманский выдержанный сыр с насыщенным орехово-сливочным букетом и пикантным послевкусием. Созревает не менее 90 суток. Создан для сырных тарелок и дегустации с вином.",
      "be": "Флагманскі вытрыманы сыр з насычаным арэхава-сметанковым букетам. Паспявае не менш за 90 сутак. Ідэальны для дэгустацыі з віном.",
      "en": "Flagship aged cheese matured for 90+ days, featuring complex nutty-butter aromas and subtle crystalline notes. Designed for cheese boards and wine pairing.",
      "zh": "旗舰级陈年奶酪，历经90天以上窖藏成熟，风味浓郁并带有坚果与奶油芳香，专为奶酪拼盘与葡萄酒品鉴打造。"
    },
    "image": ASSETS.productAgedCheese,
    "fatContent": 50.0,
    "proteinContent": 26.0,
    "lactoseFree": true,
    "exportReady": true,
    "featured": true,
    "visible": true,
    "packages": [
      {
        "id": "gor-200",
        "weight": "200 г",
        "weightGrams": 200,
        "shelfLife": {
          "ru": "120 суток",
          "be": "120 сутак",
          "en": "120 days",
          "zh": "120天"
        },
        "storage": {
          "ru": "0…+6 °C",
          "be": "0…+6 °C",
          "en": "0…+6 °C",
          "zh": "0…+6 °C"
        },
        "packagingType": {
          "ru": "Слайсерный сегмент (МГС)",
          "be": "Слайсерны сегмент (МГС)",
          "en": "MAP retail wedge",
          "zh": "气调零售三角切块"
        },
        "unitsPerBox": 14,
        "gtin": "4810268042018"
      },
      {
        "id": "gor-4000",
        "weight": "4 кг",
        "weightGrams": 4000,
        "shelfLife": {
          "ru": "180 суток",
          "be": "180 сутак",
          "en": "180 days",
          "zh": "180天"
        },
        "storage": {
          "ru": "0…+6 °C",
          "be": "0…+6 °C",
          "en": "0…+6 °C",
          "zh": "0…+6 °C"
        },
        "packagingType": {
          "ru": "Цельная головка в защитном покрытии",
          "be": "Цэльная галоўка ў ахоўным пакрыцці",
          "en": "Whole wheel in protective wax",
          "zh": "整轮护膜包装"
        },
        "unitsPerBox": 2,
        "gtin": "4810268042025"
      }
    ],
    "characteristics": {
      "cheeseType": {
        "ru": "Твёрдый / выдержанный сыр",
        "be": "Цвёрды / вытрыманы сыр",
        "en": "Hard aged cheese",
        "zh": "硬质陈年奶酪"
      },
      "aging": {
        "ru": "90–120 суток",
        "be": "90–120 сутак",
        "en": "90–120 days",
        "zh": "90–120天成熟期"
      },
      "shape": {
        "ru": "Цилиндрическая головка / сегмент",
        "be": "Цыліндрычная галоўка / сегмент",
        "en": "Cylindrical wheel / wedge",
        "zh": "圆柱整轮 / 三角切块"
      },
      "milkBase": {
        "ru": "Отборное коровье молоко (натурально без лактозы)",
        "be": "Адборнае каровіна малако (натуральна без лактозы)",
        "en": "Selected cow milk (naturally lactose-free)",
        "zh": "精选牛奶（天然无乳糖）"
      }
    },
    "useCases": [
      "wine",
      "tasting",
      "high-protein",
      "lactose-free",
      "export"
    ],
    "relatedIds": [
      "brie-bellavista",
      "mozzarella",
      "butter-825"
    ],
    "seo": {
      "title": {
        "ru": "Сыр «ГороденЪ» выдержанный (50.0%) — характеристики и фасовка | Молочный Мир",
        "be": "Сыр «ГорадзенЪ» вытрыманы (50.0%) — характарыстыкі і фасоўка | Малочны Мір",
        "en": "Goroden Aged Reserve Cheese (50.0% Fat) — Specs & Packaging | Molochny Mir",
        "zh": "Goroden 陈年窖藏奶酪 (50.0% 乳脂) — 规格与包装 | Molochny Mir"
      },
      "description": {
        "ru": "Сыр «ГороденЪ» выдержанный: Флагманский выдержанный сыр с насыщенным орехово-сливочным букетом и пикантным послевкусием. Созревает не менее 90 суток Фасовки: 200 г, 4 кг.",
        "be": "Сыр «ГорадзенЪ» вытрыманы: Флагманскі вытрыманы сыр з насычаным арэхава-сметанковым букетам. Паспявае не менш за 90 сутак. Ідэальны для дэгустацыі  Фасоўкі: 200 г, 4 кг.",
        "en": "Goroden Aged Reserve Cheese: Flagship aged cheese matured for 90+ days, featuring complex nutty-butter aromas and subtle crystalline notes. Designed  Formats: 200 г, 4 кг.",
        "zh": "Goroden 陈年窖藏奶酪：旗舰级陈年奶酪，历经90天以上窖藏成熟，风味浓郁并带有坚果与奶油芳香，专为奶酪拼盘与葡萄酒品鉴打造。 规格：200 г, 4 кг。"
      },
      "h1": {
        "ru": "Сыр «ГороденЪ» выдержанный",
        "be": "Сыр «ГорадзенЪ» вытрыманы",
        "en": "Goroden Aged Reserve Cheese",
        "zh": "Goroden 陈年窖藏奶酪"
      }
    }
  },
  {
    "id": "brie-bellavista",
    "slug": "brie-bellavista",
    "category": "cheese",
    "subcategory": "soft-mold",
    "name": {
      "ru": "Сыр мягкий «Беллависта» с белой плесенью",
      "be": "Сыр мяккі «Белавіста» з белай цвіллю",
      "en": "Bellavista Soft White-Mold Cheese",
      "zh": "Bellavista 白霉软质奶酪"
    },
    "description": {
      "ru": "Изысканный мягкий сыр с бархатистой корочкой благородной белой плесени и нежной сливочной сердцевиной. Превосходно сочетается с белым вином, фруктами и мёдом.",
      "be": "Вытанчаны мяккі сыр з аксамітнай скарыначкай белай цвілі і далікатнай сметанковай сярэдзінай.",
      "en": "Artisanal soft-ripened cheese with a bloomy white rind and velvety creamy core. Pairs effortlessly with sparkling wine, pears, and honey.",
      "zh": "精选白霉菌发酵而成的风味软质奶酪，表皮绒白、内芯绵密奶油感十足，搭配干白葡萄酒与水果风味绝佳。"
    },
    "image": ASSETS.productAgedCheese,
    "fatContent": 55.0,
    "proteinContent": 18.0,
    "lactoseFree": false,
    "exportReady": true,
    "featured": false,
    "visible": true,
    "packages": [
      {
        "id": "brie-125",
        "weight": "125 г",
        "weightGrams": 125,
        "shelfLife": {
          "ru": "40 суток",
          "be": "40 сутак",
          "en": "40 days",
          "zh": "40天"
        },
        "storage": {
          "ru": "+2…+6 °C",
          "be": "+2…+6 °C",
          "en": "+2…+6 °C",
          "zh": "+2…+6 °C"
        },
        "packagingType": {
          "ru": "Дышащая кашированная бумага + картон",
          "be": "Дыхаючая папера + кардон",
          "en": "Breathable wrap + carton box",
          "zh": "透气专纸与礼盒装"
        },
        "unitsPerBox": 10,
        "gtin": "4810268042513"
      }
    ],
    "characteristics": {
      "cheeseType": {
        "ru": "Мягкий с белой плесенью",
        "be": "Мяккі з белай цвіллю",
        "en": "Bloomy-rind soft cheese",
        "zh": "白霉软质奶酪"
      },
      "aging": {
        "ru": "21 день",
        "be": "21 дзень",
        "en": "21 days",
        "zh": "21天熟化"
      },
      "shape": {
        "ru": "Шайба 125 г",
        "be": "Шайба 125 г",
        "en": "125g round wheel",
        "zh": "125克圆饼"
      },
      "milkBase": {
        "ru": "Высший сорт коровьего молока",
        "be": "Вышэйшы гатунак каровінага малака",
        "en": "Grade-A cow milk",
        "zh": "特级鲜牛奶"
      }
    },
    "useCases": [
      "wine",
      "tasting"
    ],
    "relatedIds": [
      "goroden-aged",
      "mozzarella"
    ],
    "seo": {
      "title": {
        "ru": "Сыр мягкий «Беллависта» с белой плесенью (55.0%) — характеристики и фасовка | Молочный Мир",
        "be": "Сыр мяккі «Белавіста» з белай цвіллю (55.0%) — характарыстыкі і фасоўка | Малочны Мір",
        "en": "Bellavista Soft White-Mold Cheese (55.0% Fat) — Specs & Packaging | Molochny Mir",
        "zh": "Bellavista 白霉软质奶酪 (55.0% 乳脂) — 规格与包装 | Molochny Mir"
      },
      "description": {
        "ru": "Сыр мягкий «Беллависта» с белой плесенью: Изысканный мягкий сыр с бархатистой корочкой благородной белой плесени и нежной сливочной сердцевиной. Превосходно сочет Фасовки: 125 г.",
        "be": "Сыр мяккі «Белавіста» з белай цвіллю: Вытанчаны мяккі сыр з аксамітнай скарыначкай белай цвілі і далікатнай сметанковай сярэдзінай. Фасоўкі: 125 г.",
        "en": "Bellavista Soft White-Mold Cheese: Artisanal soft-ripened cheese with a bloomy white rind and velvety creamy core. Pairs effortlessly with sparkling wine,  Formats: 125 г.",
        "zh": "Bellavista 白霉软质奶酪：精选白霉菌发酵而成的风味软质奶酪，表皮绒白、内芯绵密奶油感十足，搭配干白葡萄酒与水果风味绝佳。 规格：125 г。"
      },
      "h1": {
        "ru": "Сыр мягкий «Беллависта» с белой плесенью",
        "be": "Сыр мяккі «Белавіста» з белай цвіллю",
        "en": "Bellavista Soft White-Mold Cheese",
        "zh": "Bellavista 白霉软质奶酪"
      }
    }
  },
  {
    "id": "suluguni-grodno",
    "slug": "suluguni-grodno",
    "category": "cheese",
    "subcategory": "pasta-filata",
    "name": {
      "ru": "Сыр «Сулугуни Гродненский»",
      "be": "Сыр «Сулугуні Гродзенскі»",
      "en": "Grodno Suluguni Brine Cheese",
      "zh": "格罗德诺风味苏鲁古尼奶酪"
    },
    "description": {
      "ru": "Слоистый рассольный сыр с чистым умеренно солёным вкусом. Идеален для хачапури, выпечки, блюд на гриле и сырных закусок.",
      "be": "Слаісты расольны сыр з чыстым умерана салёным густам. Ідэальны для хачапуры, выпечкі і грылю.",
      "en": "Layered pasta filata cheese with a clean mildly savory flavor. Ideal for khachapuri, baking, grilling, and savory snacks.",
      "zh": "分层质地盐水奶酪，咸香适口，非常适合制作格鲁吉亚芝士饼、热烤或餐饮佐餐。"
    },
    "image": ASSETS.productMozzarella,
    "fatContent": 45.0,
    "proteinContent": 20.5,
    "lactoseFree": false,
    "exportReady": true,
    "featured": false,
    "visible": true,
    "packages": [
      {
        "id": "sul-280",
        "weight": "280 г",
        "weightGrams": 280,
        "shelfLife": {
          "ru": "45 суток",
          "be": "45 сутак",
          "en": "45 days",
          "zh": "45天"
        },
        "storage": {
          "ru": "+2…+6 °C",
          "be": "+2…+6 °C",
          "en": "+2…+6 °C",
          "zh": "+2…+6 °C"
        },
        "packagingType": {
          "ru": "Вакуумная термоусадочная плёнка",
          "be": "Вакуумная тэрмаўсадачная плёнка",
          "en": "Shrink vacuum pack",
          "zh": "真空热缩包装"
        },
        "unitsPerBox": 12,
        "gtin": "4810268043015"
      },
      {
        "id": "sul-1000",
        "weight": "1 кг",
        "weightGrams": 1000,
        "shelfLife": {
          "ru": "60 суток",
          "be": "60 сутак",
          "en": "60 days",
          "zh": "60天"
        },
        "storage": {
          "ru": "+2…+6 °C",
          "be": "+2…+6 °C",
          "en": "+2…+6 °C",
          "zh": "+2…+6 °C"
        },
        "packagingType": {
          "ru": "Головка HoReCa (вакуум)",
          "be": "Галоўка HoReCa (вакуум)",
          "en": "HoReCa vacuum wheel",
          "zh": "餐饮渠道真空装"
        },
        "unitsPerBox": 6,
        "gtin": "4810268043022"
      }
    ],
    "characteristics": {
      "cheeseType": {
        "ru": "Рассольный слоистый сыр",
        "be": "Расольны слаісты сыр",
        "en": "Layered pasta filata cheese",
        "zh": "分层拉伸盐水奶酪"
      },
      "aging": {
        "ru": "7 суток",
        "be": "7 сутак",
        "en": "7 days",
        "zh": "7天"
      },
      "shape": {
        "ru": "Низкий цилиндр",
        "be": "Нізкі цыліндр",
        "en": "Flat cylinder",
        "zh": "扁圆柱形"
      },
      "milkBase": {
        "ru": "Пастеризованное коровье молоко",
        "be": "Пастэрызаванае каровіна малако",
        "en": "Pasteurized cow milk",
        "zh": "巴氏杀菌牛奶"
      }
    },
    "useCases": [
      "baking",
      "horeca",
      "high-protein"
    ],
    "relatedIds": [
      "mozzarella-pizza",
      "mozzarella"
    ],
    "seo": {
      "title": {
        "ru": "Сыр «Сулугуни Гродненский» (45.0%) — характеристики и фасовка | Молочный Мир",
        "be": "Сыр «Сулугуні Гродзенскі» (45.0%) — характарыстыкі і фасоўка | Малочны Мір",
        "en": "Grodno Suluguni Brine Cheese (45.0% Fat) — Specs & Packaging | Molochny Mir",
        "zh": "格罗德诺风味苏鲁古尼奶酪 (45.0% 乳脂) — 规格与包装 | Molochny Mir"
      },
      "description": {
        "ru": "Сыр «Сулугуни Гродненский»: Слоистый рассольный сыр с чистым умеренно солёным вкусом. Идеален для хачапури, выпечки, блюд на гриле и сырных закусок. Фасовки: 280 г, 1 кг.",
        "be": "Сыр «Сулугуні Гродзенскі»: Слаісты расольны сыр з чыстым умерана салёным густам. Ідэальны для хачапуры, выпечкі і грылю. Фасоўкі: 280 г, 1 кг.",
        "en": "Grodno Suluguni Brine Cheese: Layered pasta filata cheese with a clean mildly savory flavor. Ideal for khachapuri, baking, grilling, and savory snacks Formats: 280 г, 1 кг.",
        "zh": "格罗德诺风味苏鲁古尼奶酪：分层质地盐水奶酪，咸香适口，非常适合制作格鲁吉亚芝士饼、热烤或餐饮佐餐。 规格：280 г, 1 кг。"
      },
      "h1": {
        "ru": "Сыр «Сулугуни Гродненский»",
        "be": "Сыр «Сулугуні Гродзенскі»",
        "en": "Grodno Suluguni Brine Cheese",
        "zh": "格罗德诺风味苏鲁古尼奶酪"
      }
    }
  },
  {
    "id": "milk-classic",
    "slug": "milk-classic",
    "category": "milk",
    "subcategory": "pasteurized",
    "name": {
      "ru": "Молоко питьевое цельное 3,2%",
      "be": "Малако пітное цэльнае 3,2%",
      "en": "Fresh Whole Milk 3.2%",
      "zh": "经典全脂鲜牛奶 3.2%"
    },
    "description": {
      "ru": "Натуральное пастеризованное молоко из фермерских хозяйств Гродненской области. Сохраняет природный вкус и витаминный комплекс.",
      "be": "Натуральнае пастэрызаванае малако з фермерскіх гаспадарак Гродзенскай вобласці.",
      "en": "Pure pasteurized whole milk sourced daily from Grodno region dairy farms, preserving natural flavor and nutrients.",
      "zh": "每日直采格罗德诺州优质牧场奶源，温和巴氏杀菌工艺锁住鲜醇乳香与营养。"
    },
    "image": ASSETS.productMilkKefir,
    "fatContent": 3.2,
    "proteinContent": 3.0,
    "lactoseFree": false,
    "exportReady": true,
    "featured": true,
    "visible": true,
    "packages": [
      {
        "id": "milk-900",
        "weight": "900 мл",
        "weightGrams": 900,
        "shelfLife": {
          "ru": "12 суток",
          "be": "12 сутак",
          "en": "12 days",
          "zh": "12天"
        },
        "storage": {
          "ru": "+2…+6 °C",
          "be": "+2…+6 °C",
          "en": "+2…+6 °C",
          "zh": "+2…+6 °C"
        },
        "packagingType": {
          "ru": "ПЭТ-бутылка с широким горлом",
          "be": "ПЭТ-бутэлька",
          "en": "Recyclable PET bottle",
          "zh": "环保PET瓶装"
        },
        "unitsPerBox": 12,
        "gtin": "4810268011014"
      },
      {
        "id": "milk-1000-uht",
        "weight": "1 л (UHT)",
        "weightGrams": 1000,
        "shelfLife": {
          "ru": "180 суток",
          "be": "180 сутак",
          "en": "180 days",
          "zh": "180天"
        },
        "storage": {
          "ru": "+2…+25 °C",
          "be": "+2…+25 °C",
          "en": "+2…+25 °C",
          "zh": "+2…+25 °C"
        },
        "packagingType": {
          "ru": "Асептический пакет Tetra Pak (экспорт)",
          "be": "Асептычны пакет Tetra Pak",
          "en": "Tetra Pak aseptic carton (export)",
          "zh": "利乐无菌常温包装（出口装）"
        },
        "unitsPerBox": 12,
        "gtin": "4810268011021"
      }
    ],
    "characteristics": {
      "processing": {
        "ru": "Пастеризация / Ультрапастеризация",
        "be": "Пастэрызацыя / UHT",
        "en": "Pasteurized / UHT",
        "zh": "巴氏杀菌 / UHT超高温"
      },
      "milkBase": {
        "ru": "Коровье молоко сорта «Экстра»",
        "be": "Каровіна малако гатунку «Экстра»",
        "en": "Extra-grade cow milk",
        "zh": "特级生牛乳"
      },
      "lactose": {
        "ru": "Содержит природную лактозу",
        "be": "Змяшчае прыродную лактозу",
        "en": "Contains natural lactose",
        "zh": "含天然乳糖"
      }
    },
    "useCases": [
      "daily",
      "baking",
      "coffee",
      "export"
    ],
    "relatedIds": [
      "milk-lactose-free",
      "milk-uht-15",
      "kefir-classic"
    ],
    "seo": {
      "title": {
        "ru": "Молоко питьевое цельное 3,2% (3.2%) — характеристики и фасовка | Молочный Мир",
        "be": "Малако пітное цэльнае 3,2% (3.2%) — характарыстыкі і фасоўка | Малочны Мір",
        "en": "Fresh Whole Milk 3.2% (3.2% Fat) — Specs & Packaging | Molochny Mir",
        "zh": "经典全脂鲜牛奶 3.2% (3.2% 乳脂) — 规格与包装 | Molochny Mir"
      },
      "description": {
        "ru": "Молоко питьевое цельное 3,2%: Натуральное пастеризованное молоко из фермерских хозяйств Гродненской области. Сохраняет природный вкус и витаминный ком Фасовки: 900 мл, 1 л (UHT).",
        "be": "Малако пітное цэльнае 3,2%: Натуральнае пастэрызаванае малако з фермерскіх гаспадарак Гродзенскай вобласці. Фасоўкі: 900 мл, 1 л (UHT).",
        "en": "Fresh Whole Milk 3.2%: Pure pasteurized whole milk sourced daily from Grodno region dairy farms, preserving natural flavor and nutrients. Formats: 900 мл, 1 л (UHT).",
        "zh": "经典全脂鲜牛奶 3.2%：每日直采格罗德诺州优质牧场奶源，温和巴氏杀菌工艺锁住鲜醇乳香与营养。 规格：900 мл, 1 л (UHT)。"
      },
      "h1": {
        "ru": "Молоко питьевое цельное 3,2%",
        "be": "Малако пітное цэльнае 3,2%",
        "en": "Fresh Whole Milk 3.2%",
        "zh": "经典全脂鲜牛奶 3.2%"
      }
    }
  },
  {
    "id": "milk-lactose-free",
    "slug": "milk-lactose-free",
    "category": "milk",
    "subcategory": "lactose-free",
    "name": {
      "ru": "Молоко безлактозное 2,5% Active Life",
      "be": "Малако безлактознае 2,5% Active Life",
      "en": "Active Life Lactose-Free Milk 2.5%",
      "zh": "Active Life 零乳糖纯牛奶 2.5%"
    },
    "description": {
      "ru": "Натуральное коровье молоко, в котором лактоза бережно расщеплена ферментом лактазой. Лёгкое усвоение и приятный слегка сладковатый вкус без добавления сахара.",
      "be": "Натуральнае каровіна малако з расшчэпленай лактозай. Лёгкае засваенне без дадання цукру.",
      "en": "Real cow milk with lactose gently hydrolyzed into easily digestible simple sugars. Zero added sugar, full calcium and protein profile.",
      "zh": "采用乳糖酶精准分解乳糖的纯正牛奶，不额外添加蔗糖，呵护乳糖不耐受人群的肠胃吸收。"
    },
    "image": ASSETS.productMilkKefir,
    "fatContent": 2.5,
    "proteinContent": 3.1,
    "lactoseFree": true,
    "exportReady": true,
    "featured": true,
    "visible": true,
    "packages": [
      {
        "id": "mlf-950",
        "weight": "950 мл",
        "weightGrams": 950,
        "shelfLife": {
          "ru": "150 суток",
          "be": "150 сутак",
          "en": "150 days",
          "zh": "150天"
        },
        "storage": {
          "ru": "+2…+25 °C",
          "be": "+2…+25 °C",
          "en": "+2…+25 °C",
          "zh": "+2…+25 °C"
        },
        "packagingType": {
          "ru": "Tetra Brik Aseptic с крышкой",
          "be": "Tetra Brik Aseptic з вечкам",
          "en": "Tetra Brik Aseptic with cap",
          "zh": "带盖利乐砖无菌包装"
        },
        "unitsPerBox": 12,
        "gtin": "4810268011519"
      }
    ],
    "characteristics": {
      "processing": {
        "ru": "Ферментативное расщепление + UHT",
        "be": "Ферментатыўнае расшчапленне + UHT",
        "en": "Enzymatic hydrolysis + UHT",
        "zh": "酶解脱乳糖 + UHT灭菌"
      },
      "milkBase": {
        "ru": "Коровье молоко сорта «Экстра»",
        "be": "Каровіна малако гатунку «Экстра»",
        "en": "Extra-grade cow milk",
        "zh": "特级生牛乳"
      },
      "lactose": {
        "ru": "Менее 0,01% (без лактозы)",
        "be": "Менш за 0,01% (без лактозы)",
        "en": "< 0.01% (Lactose-Free)",
        "zh": "< 0.01%（无乳糖）"
      }
    },
    "useCases": [
      "lactose-free",
      "daily",
      "coffee",
      "export"
    ],
    "relatedIds": [
      "greek-yogurt-lactose-free",
      "milk-classic",
      "goroden-aged"
    ],
    "seo": {
      "title": {
        "ru": "Молоко безлактозное 2,5% Active Life (2.5%) — характеристики и фасовка | Молочный Мир",
        "be": "Малако безлактознае 2,5% Active Life (2.5%) — характарыстыкі і фасоўка | Малочны Мір",
        "en": "Active Life Lactose-Free Milk 2.5% (2.5% Fat) — Specs & Packaging | Molochny Mir",
        "zh": "Active Life 零乳糖纯牛奶 2.5% (2.5% 乳脂) — 规格与包装 | Molochny Mir"
      },
      "description": {
        "ru": "Молоко безлактозное 2,5% Active Life: Натуральное коровье молоко, в котором лактоза бережно расщеплена ферментом лактазой. Лёгкое усвоение и приятный слегка с Фасовки: 950 мл.",
        "be": "Малако безлактознае 2,5% Active Life: Натуральнае каровіна малако з расшчэпленай лактозай. Лёгкае засваенне без дадання цукру. Фасоўкі: 950 мл.",
        "en": "Active Life Lactose-Free Milk 2.5%: Real cow milk with lactose gently hydrolyzed into easily digestible simple sugars. Zero added sugar, full calcium and pr Formats: 950 мл.",
        "zh": "Active Life 零乳糖纯牛奶 2.5%：采用乳糖酶精准分解乳糖的纯正牛奶，不额外添加蔗糖，呵护乳糖不耐受人群的肠胃吸收。 规格：950 мл。"
      },
      "h1": {
        "ru": "Молоко безлактозное 2,5% Active Life",
        "be": "Малако безлактознае 2,5% Active Life",
        "en": "Active Life Lactose-Free Milk 2.5%",
        "zh": "Active Life 零乳糖纯牛奶 2.5%"
      }
    }
  },
  {
    "id": "milk-uht-15",
    "slug": "milk-uht-15",
    "category": "milk",
    "subcategory": "uht",
    "name": {
      "ru": "Молоко ультрапастеризованное 1,5% лёгкое",
      "be": "Малако ультрапастэрызаванае 1,5% лёгкае",
      "en": "Light UHT Skimmed Milk 1.5%",
      "zh": "1.5% 超高温灭菌轻脂牛奶"
    },
    "description": {
      "ru": "Лёгкое питьевое молоко в асептической упаковке со сроком хранения 6 месяцев при комнатной температуре. Оптимально для дальних экспортных маршрутов и кофеен.",
      "be": "Лёгкае пітное малако ў асептычнай упакоўцы з тэрмінам захоўвання 6 месяцаў.",
      "en": "Light 1.5% UHT milk with a 180-day ambient shelf life, ideal for long-haul export, institutional catering, and specialty coffee bars.",
      "zh": "1.5%轻脂常温牛奶，无菌包装保质期长达180天，专为长途海运出口及连锁餐饮供应打造。"
    },
    "image": ASSETS.productMilkKefir,
    "fatContent": 1.5,
    "proteinContent": 3.0,
    "lactoseFree": false,
    "exportReady": true,
    "featured": false,
    "visible": true,
    "packages": [
      {
        "id": "muht-1000",
        "weight": "1 л",
        "weightGrams": 1000,
        "shelfLife": {
          "ru": "180 суток",
          "be": "180 сутак",
          "en": "180 days",
          "zh": "180天"
        },
        "storage": {
          "ru": "+2…+25 °C",
          "be": "+2…+25 °C",
          "en": "+2…+25 °C",
          "zh": "+2…+25 °C"
        },
        "packagingType": {
          "ru": "Tetra Pak Aseptic 1 л",
          "be": "Tetra Pak Aseptic 1 л",
          "en": "Tetra Pak Aseptic 1L",
          "zh": "1升利乐无菌盒"
        },
        "unitsPerBox": 12,
        "gtin": "4810268011809"
      }
    ],
    "characteristics": {
      "processing": {
        "ru": "Ультрапастеризация (UHT 137 °C)",
        "be": "Ультрапастэрызацыя (UHT 137 °C)",
        "en": "UHT 137 °C",
        "zh": "UHT 137 °C 超高温瞬时灭菌"
      },
      "milkBase": {
        "ru": "Нормализованное молоко сорта «Экстра»",
        "be": "Нармалізаванае малако «Экстра»",
        "en": "Standardized Extra-grade milk",
        "zh": "特级标准化鲜牛乳"
      },
      "lactose": {
        "ru": "Содержит природную лактозу",
        "be": "Змяшчае прыродную лактозу",
        "en": "Natural lactose",
        "zh": "含天然乳糖"
      }
    },
    "useCases": [
      "export",
      "coffee",
      "daily"
    ],
    "relatedIds": [
      "milk-classic",
      "cream-10-barista"
    ],
    "seo": {
      "title": {
        "ru": "Молоко ультрапастеризованное 1,5% лёгкое (1.5%) — характеристики и фасовка | Молочный Мир",
        "be": "Малако ультрапастэрызаванае 1,5% лёгкае (1.5%) — характарыстыкі і фасоўка | Малочны Мір",
        "en": "Light UHT Skimmed Milk 1.5% (1.5% Fat) — Specs & Packaging | Molochny Mir",
        "zh": "1.5% 超高温灭菌轻脂牛奶 (1.5% 乳脂) — 规格与包装 | Molochny Mir"
      },
      "description": {
        "ru": "Молоко ультрапастеризованное 1,5% лёгкое: Лёгкое питьевое молоко в асептической упаковке со сроком хранения 6 месяцев при комнатной температуре. Оптимально для да Фасовки: 1 л.",
        "be": "Малако ультрапастэрызаванае 1,5% лёгкае: Лёгкае пітное малако ў асептычнай упакоўцы з тэрмінам захоўвання 6 месяцаў. Фасоўкі: 1 л.",
        "en": "Light UHT Skimmed Milk 1.5%: Light 1.5% UHT milk with a 180-day ambient shelf life, ideal for long-haul export, institutional catering, and specialty Formats: 1 л.",
        "zh": "1.5% 超高温灭菌轻脂牛奶：1.5%轻脂常温牛奶，无菌包装保质期长达180天，专为长途海运出口及连锁餐饮供应打造。 规格：1 л。"
      },
      "h1": {
        "ru": "Молоко ультрапастеризованное 1,5% лёгкое",
        "be": "Малако ультрапастэрызаванае 1,5% лёгкае",
        "en": "Light UHT Skimmed Milk 1.5%",
        "zh": "1.5% 超高温灭菌轻脂牛奶"
      }
    }
  },
  {
    "id": "kefir-classic",
    "slug": "kefir-classic",
    "category": "fermented",
    "subcategory": "kefir",
    "name": {
      "ru": "Кефир традиционный 2,5%",
      "be": "Кефір традыцыйны 2,5%",
      "en": "Traditional Kefir 2.5%",
      "zh": "经典发酵开菲尔 2.5%"
    },
    "description": {
      "ru": "Классический кисломолочный напиток на натуральной закваске из живых кефирных грибков. Поддерживает микрофлору и обладает мягким освежающим вкусом.",
      "be": "Класічны кісламалочны напой на натуральнай заквасцы з жывых кефірных грыбкоў.",
      "en": "Authentic fermented dairy beverage cultured with live kefir grains for smooth texture and digestive balance.",
      "zh": "选用天然活性开菲尔菌粒发酵而成的传统乳饮品，口感柔和清爽，有益肠道健康。"
    },
    "image": ASSETS.productMilkKefir,
    "fatContent": 2.5,
    "proteinContent": 3.0,
    "lactoseFree": false,
    "exportReady": false,
    "featured": false,
    "visible": true,
    "packages": [
      {
        "id": "kef-900",
        "weight": "900 г",
        "weightGrams": 900,
        "shelfLife": {
          "ru": "14 суток",
          "be": "14 сутак",
          "en": "14 days",
          "zh": "14天"
        },
        "storage": {
          "ru": "+2…+6 °C",
          "be": "+2…+6 °C",
          "en": "+2…+6 °C",
          "zh": "+2…+6 °C"
        },
        "packagingType": {
          "ru": "ПЭТ-бутылка",
          "be": "ПЭТ-бутэлька",
          "en": "PET bottle",
          "zh": "PET瓶装"
        },
        "unitsPerBox": 12,
        "gtin": "4810268021013"
      },
      {
        "id": "kef-500",
        "weight": "500 г",
        "weightGrams": 500,
        "shelfLife": {
          "ru": "14 суток",
          "be": "14 сутак",
          "en": "14 days",
          "zh": "14天"
        },
        "storage": {
          "ru": "+2…+6 °C",
          "be": "+2…+6 °C",
          "en": "+2…+6 °C",
          "zh": "+2…+6 °C"
        },
        "packagingType": {
          "ru": "Пакет Пюр-Пак",
          "be": "Пакет Пюр-Пак",
          "en": "Pure-Pak gable-top carton",
          "zh": "屋顶盒包装"
        },
        "unitsPerBox": 16,
        "gtin": "4810268021020"
      }
    ],
    "characteristics": {
      "cultures": {
        "ru": "Симбиотическая закваска на кефирных грибках",
        "be": "Закваска на кефірных грыбках",
        "en": "Live kefir grain starter",
        "zh": "天然活性开菲尔菌粒"
      },
      "probiotics": {
        "ru": "Не менее 1×10⁷ КОЕ/г",
        "be": "Не менш за 1×10⁷ КАЕ/г",
        "en": "Min 1×10⁷ CFU/g",
        "zh": "≥ 1×10⁷ CFU/g 活菌"
      }
    },
    "useCases": [
      "daily",
      "probiotic"
    ],
    "relatedIds": [
      "ryazhenka-4",
      "bifitat-probiotic",
      "tvorog-grain"
    ],
    "seo": {
      "title": {
        "ru": "Кефир традиционный 2,5% (2.5%) — характеристики и фасовка | Молочный Мир",
        "be": "Кефір традыцыйны 2,5% (2.5%) — характарыстыкі і фасоўка | Малочны Мір",
        "en": "Traditional Kefir 2.5% (2.5% Fat) — Specs & Packaging | Molochny Mir",
        "zh": "经典发酵开菲尔 2.5% (2.5% 乳脂) — 规格与包装 | Molochny Mir"
      },
      "description": {
        "ru": "Кефир традиционный 2,5%: Классический кисломолочный напиток на натуральной закваске из живых кефирных грибков. Поддерживает микрофлору и обладает Фасовки: 900 г, 500 г.",
        "be": "Кефір традыцыйны 2,5%: Класічны кісламалочны напой на натуральнай заквасцы з жывых кефірных грыбкоў. Фасоўкі: 900 г, 500 г.",
        "en": "Traditional Kefir 2.5%: Authentic fermented dairy beverage cultured with live kefir grains for smooth texture and digestive balance. Formats: 900 г, 500 г.",
        "zh": "经典发酵开菲尔 2.5%：选用天然活性开菲尔菌粒发酵而成的传统乳饮品，口感柔和清爽，有益肠道健康。 规格：900 г, 500 г。"
      },
      "h1": {
        "ru": "Кефир традиционный 2,5%",
        "be": "Кефір традыцыйны 2,5%",
        "en": "Traditional Kefir 2.5%",
        "zh": "经典发酵开菲尔 2.5%"
      }
    }
  },
  {
    "id": "ryazhenka-4",
    "slug": "ryazhenka-4",
    "category": "fermented",
    "subcategory": "ryazhenka",
    "name": {
      "ru": "Ряженка томлёная 4,0%",
      "be": "Ражанка томленая 4,0%",
      "en": "Traditional Baked Ryazhenka 4.0%",
      "zh": "传统低温慢熬发酵烤乳 (Ryazhenka) 4.0%"
    },
    "description": {
      "ru": "Нежный кисломолочный напиток кремового оттенка с карамельной ноткой, приготовленный из топлёного молока на термофильных заквасках.",
      "be": "Далікатны кісламалочны напой крэмавага адцення з карамельнай ноткай з топленага малака.",
      "en": "Velvety caramel-hued fermented milk cultured from slowly baked whole milk for rich roasted cream notes.",
      "zh": "采用低温长时间慢熬熟牛乳发酵而成的风味乳饮品，色泽呈暖焦糖色，带有醇厚烤奶香气。"
    },
    "image": ASSETS.productMilkKefir,
    "fatContent": 4.0,
    "proteinContent": 2.9,
    "lactoseFree": false,
    "exportReady": false,
    "featured": false,
    "visible": true,
    "packages": [
      {
        "id": "ryazh-450",
        "weight": "450 г",
        "weightGrams": 450,
        "shelfLife": {
          "ru": "14 суток",
          "be": "14 сутак",
          "en": "14 days",
          "zh": "14天"
        },
        "storage": {
          "ru": "+2…+6 °C",
          "be": "+2…+6 °C",
          "en": "+2…+6 °C",
          "zh": "+2…+6 °C"
        },
        "packagingType": {
          "ru": "ПЭТ-бутылка",
          "be": "ПЭТ-бутэлька",
          "en": "PET bottle",
          "zh": "PET瓶装"
        },
        "unitsPerBox": 12,
        "gtin": "4810268022010"
      },
      {
        "id": "ryazh-900",
        "weight": "900 г",
        "weightGrams": 900,
        "shelfLife": {
          "ru": "14 суток",
          "be": "14 сутак",
          "en": "14 days",
          "zh": "14天"
        },
        "storage": {
          "ru": "+2…+6 °C",
          "be": "+2…+6 °C",
          "en": "+2…+6 °C",
          "zh": "+2…+6 °C"
        },
        "packagingType": {
          "ru": "Семейная ПЭТ-бутылка",
          "be": "Сямейная ПЭТ-бутэлька",
          "en": "Family PET bottle",
          "zh": "家庭装PET瓶"
        },
        "unitsPerBox": 12,
        "gtin": "4810268022027"
      }
    ],
    "characteristics": {
      "cultures": {
        "ru": "Термофильный стрептококк",
        "be": "Тэрмафільны стрэптакок",
        "en": "Thermophilic lactic starter",
        "zh": "嗜热链球菌发酵剂"
      },
      "probiotics": {
        "ru": "Не менее 1×10⁷ КОЕ/г",
        "be": "Не менш за 1×10⁷ КАЕ/г",
        "en": "Min 1×10⁷ CFU/g",
        "zh": "≥ 1×10⁷ CFU/g 活菌"
      }
    },
    "useCases": [
      "daily",
      "probiotic"
    ],
    "relatedIds": [
      "kefir-classic",
      "bifitat-probiotic"
    ],
    "seo": {
      "title": {
        "ru": "Ряженка томлёная 4,0% (4.0%) — характеристики и фасовка | Молочный Мир",
        "be": "Ражанка томленая 4,0% (4.0%) — характарыстыкі і фасоўка | Малочны Мір",
        "en": "Traditional Baked Ryazhenka 4.0% (4.0% Fat) — Specs & Packaging | Molochny Mir",
        "zh": "传统低温慢熬发酵烤乳 (Ryazhenka) 4.0% (4.0% 乳脂) — 规格与包装 | Molochny Mir"
      },
      "description": {
        "ru": "Ряженка томлёная 4,0%: Нежный кисломолочный напиток кремового оттенка с карамельной ноткой, приготовленный из топлёного молока на термофильных  Фасовки: 450 г, 900 г.",
        "be": "Ражанка томленая 4,0%: Далікатны кісламалочны напой крэмавага адцення з карамельнай ноткай з топленага малака. Фасоўкі: 450 г, 900 г.",
        "en": "Traditional Baked Ryazhenka 4.0%: Velvety caramel-hued fermented milk cultured from slowly baked whole milk for rich roasted cream notes. Formats: 450 г, 900 г.",
        "zh": "传统低温慢熬发酵烤乳 (Ryazhenka) 4.0%：采用低温长时间慢熬熟牛乳发酵而成的风味乳饮品，色泽呈暖焦糖色，带有醇厚烤奶香气。 规格：450 г, 900 г。"
      },
      "h1": {
        "ru": "Ряженка томлёная 4,0%",
        "be": "Ражанка томленая 4,0%",
        "en": "Traditional Baked Ryazhenka 4.0%",
        "zh": "传统低温慢熬发酵烤乳 (Ryazhenka) 4.0%"
      }
    }
  },
  {
    "id": "bifitat-probiotic",
    "slug": "bifitat-probiotic",
    "category": "fermented",
    "subcategory": "ryazhenka",
    "name": {
      "ru": "Бифитат пробиотический 2,5%",
      "be": "Біфітат прабіятычны 2,5%",
      "en": "Bifitat Probiotic Fermented Drink 2.5%",
      "zh": "Bifitat 双歧杆菌益生菌发酵乳 2.5%"
    },
    "description": {
      "ru": "Функциональный кисломолочный напиток, обогащённый живыми бифидобактериями Bifidobacterium lactis для комфортного пищеварения и иммунитета.",
      "be": "Функцыянальны кісламалочны напой, узбагачаны жывымі біфідабактэрыямі.",
      "en": "Functional probiotic fermented milk enriched with live Bifidobacterium lactis cultures for gut health and immunity.",
      "zh": "富含活性双歧杆菌 Bifidobacterium lactis 的功能性益生菌发酵乳饮品，温和呵护肠道微生态。"
    },
    "image": ASSETS.productMilkKefir,
    "fatContent": 2.5,
    "proteinContent": 3.2,
    "lactoseFree": false,
    "exportReady": true,
    "featured": false,
    "visible": true,
    "packages": [
      {
        "id": "bif-500",
        "weight": "500 г",
        "weightGrams": 500,
        "shelfLife": {
          "ru": "18 суток",
          "be": "18 сутак",
          "en": "18 days",
          "zh": "18天"
        },
        "storage": {
          "ru": "+2…+6 °C",
          "be": "+2…+6 °C",
          "en": "+2…+6 °C",
          "zh": "+2…+6 °C"
        },
        "packagingType": {
          "ru": "Картон Пюр-Пак с крышкой",
          "be": "Кардон Пюр-Пак з вечкам",
          "en": "Pure-Pak carton with cap",
          "zh": "带盖屋顶盒包装"
        },
        "unitsPerBox": 16,
        "gtin": "4810268023017"
      }
    ],
    "characteristics": {
      "cultures": {
        "ru": "Бифидобактерии B. lactis + ацидофильная палочка",
        "be": "Біфідабактэрыі B. lactis",
        "en": "Bifidobacterium lactis + L. acidophilus",
        "zh": "乳双歧杆菌与嗜酸乳杆菌"
      },
      "probiotics": {
        "ru": "Не менее 1×10⁸ КОЕ/г",
        "be": "Не менш за 1×10⁸ КАЕ/г",
        "en": "Min 1×10⁸ CFU/g",
        "zh": "≥ 1×10⁸ CFU/g 高活性益生菌"
      }
    },
    "useCases": [
      "probiotic",
      "daily"
    ],
    "relatedIds": [
      "kefir-classic",
      "greek-yogurt-protein"
    ],
    "seo": {
      "title": {
        "ru": "Бифитат пробиотический 2,5% (2.5%) — характеристики и фасовка | Молочный Мир",
        "be": "Біфітат прабіятычны 2,5% (2.5%) — характарыстыкі і фасоўка | Малочны Мір",
        "en": "Bifitat Probiotic Fermented Drink 2.5% (2.5% Fat) — Specs & Packaging | Molochny Mir",
        "zh": "Bifitat 双歧杆菌益生菌发酵乳 2.5% (2.5% 乳脂) — 规格与包装 | Molochny Mir"
      },
      "description": {
        "ru": "Бифитат пробиотический 2,5%: Функциональный кисломолочный напиток, обогащённый живыми бифидобактериями Bifidobacterium lactis для комфортного пищевар Фасовки: 500 г.",
        "be": "Біфітат прабіятычны 2,5%: Функцыянальны кісламалочны напой, узбагачаны жывымі біфідабактэрыямі. Фасоўкі: 500 г.",
        "en": "Bifitat Probiotic Fermented Drink 2.5%: Functional probiotic fermented milk enriched with live Bifidobacterium lactis cultures for gut health and immunity. Formats: 500 г.",
        "zh": "Bifitat 双歧杆菌益生菌发酵乳 2.5%：富含活性双歧杆菌 Bifidobacterium lactis 的功能性益生菌发酵乳饮品，温和呵护肠道微生态。 规格：500 г。"
      },
      "h1": {
        "ru": "Бифитат пробиотический 2,5%",
        "be": "Біфітат прабіятычны 2,5%",
        "en": "Bifitat Probiotic Fermented Drink 2.5%",
        "zh": "Bifitat 双歧杆菌益生菌发酵乳 2.5%"
      }
    }
  },
  {
    "id": "greek-yogurt-protein",
    "slug": "greek-yogurt-protein",
    "category": "yogurt",
    "subcategory": "greek",
    "name": {
      "ru": "Йогурт греческий Active Life High Protein",
      "be": "Ёгурт грэчаскі Active Life High Protein",
      "en": "Active Life High-Protein Greek Yogurt",
      "zh": "Active Life 高蛋白希腊酸奶"
    },
    "description": {
      "ru": "Густой натуральный греческий йогурт с удвоенным содержанием молочного белка (8 г на 100 г). Без добавления сахара, крахмала и консервантов.",
      "be": "Густы натуральны грэчаскі ёгурт з падвоеным утрыманнем малочнага бялку (8 г на 100 г). Без цукру і крухмалу.",
      "en": "Thick strained Greek yogurt delivering 8g natural dairy protein per 100g. Zero added sugar, zero starch, ideal for athletes and healthy nutrition.",
      "zh": "浓稠滤乳清希腊酸奶，每100克含8克天然乳蛋白，零添加蔗糖与增稠淀粉，适合运动健身与轻食代餐。"
    },
    "image": ASSETS.productGreekYogurt,
    "fatContent": 2.0,
    "proteinContent": 8.0,
    "lactoseFree": false,
    "exportReady": true,
    "featured": true,
    "visible": true,
    "packages": [
      {
        "id": "gy-140",
        "weight": "140 г",
        "weightGrams": 140,
        "shelfLife": {
          "ru": "21 сутки",
          "be": "21 суткі",
          "en": "21 days",
          "zh": "21天"
        },
        "storage": {
          "ru": "+2…+6 °C",
          "be": "+2…+6 °C",
          "en": "+2…+6 °C",
          "zh": "+2…+6 °C"
        },
        "packagingType": {
          "ru": "Стакан с платинкой",
          "be": "Шклянка з плацінкай",
          "en": "Sealed thermoformed cup",
          "zh": "密封杯装"
        },
        "unitsPerBox": 12,
        "gtin": "4810268051010"
      },
      {
        "id": "gy-350",
        "weight": "350 г",
        "weightGrams": 350,
        "shelfLife": {
          "ru": "21 сутки",
          "be": "21 суткі",
          "en": "21 days",
          "zh": "21天"
        },
        "storage": {
          "ru": "+2…+6 °C",
          "be": "+2…+6 °C",
          "en": "+2…+6 °C",
          "zh": "+2…+6 °C"
        },
        "packagingType": {
          "ru": "Семейный контейнер с крышкой",
          "be": "Сямейны кантэйнер з вечкам",
          "en": "Reclosable family tub",
          "zh": "可重复密封家庭桶"
        },
        "unitsPerBox": 8,
        "gtin": "4810268051027"
      }
    ],
    "characteristics": {
      "flavor": {
        "ru": "Натуральный без наполнителей",
        "be": "Натуральны без напаўняльнікаў",
        "en": "Plain natural",
        "zh": "原味无添加"
      },
      "proteinNote": {
        "ru": "8,0 г / 100 г (высокий белок)",
        "be": "8,0 г / 100 г (высокі бялок)",
        "en": "8.0 g / 100g (High Protein)",
        "zh": "8.0克 / 100克（高蛋白）"
      },
      "sugar": {
        "ru": "Без добавленного сахара",
        "be": "Без дададзенага цукру",
        "en": "No added sugar",
        "zh": "零添加蔗糖"
      }
    },
    "useCases": [
      "high-protein",
      "fitness",
      "salad",
      "daily"
    ],
    "relatedIds": [
      "greek-yogurt-lactose-free",
      "tvorog-grain",
      "milk-lactose-free"
    ],
    "seo": {
      "title": {
        "ru": "Йогурт греческий Active Life High Protein (2.0%) — характеристики и фасовка | Молочный Мир",
        "be": "Ёгурт грэчаскі Active Life High Protein (2.0%) — характарыстыкі і фасоўка | Малочны Мір",
        "en": "Active Life High-Protein Greek Yogurt (2.0% Fat) — Specs & Packaging | Molochny Mir",
        "zh": "Active Life 高蛋白希腊酸奶 (2.0% 乳脂) — 规格与包装 | Molochny Mir"
      },
      "description": {
        "ru": "Йогурт греческий Active Life High Protein: Густой натуральный греческий йогурт с удвоенным содержанием молочного белка (8 г на 100 г). Без добавления сахара, крахм Фасовки: 140 г, 350 г.",
        "be": "Ёгурт грэчаскі Active Life High Protein: Густы натуральны грэчаскі ёгурт з падвоеным утрыманнем малочнага бялку (8 г на 100 г). Без цукру і крухмалу. Фасоўкі: 140 г, 350 г.",
        "en": "Active Life High-Protein Greek Yogurt: Thick strained Greek yogurt delivering 8g natural dairy protein per 100g. Zero added sugar, zero starch, ideal for athle Formats: 140 г, 350 г.",
        "zh": "Active Life 高蛋白希腊酸奶：浓稠滤乳清希腊酸奶，每100克含8克天然乳蛋白，零添加蔗糖与增稠淀粉，适合运动健身与轻食代餐。 规格：140 г, 350 г。"
      },
      "h1": {
        "ru": "Йогурт греческий Active Life High Protein",
        "be": "Ёгурт грэчаскі Active Life High Protein",
        "en": "Active Life High-Protein Greek Yogurt",
        "zh": "Active Life 高蛋白希腊酸奶"
      }
    }
  },
  {
    "id": "yogurt-drink-blueberry",
    "slug": "yogurt-drink-blueberry",
    "category": "yogurt",
    "subcategory": "drinkable",
    "name": {
      "ru": "Йогурт питьевой с черникой и злаками 1,5%",
      "be": "Ёгурт пітны з чарніцай і злакамі 1,5%",
      "en": "Drinkable Yogurt Blueberry & Grains 1.5%",
      "zh": "蓝莓谷物风味饮用酸奶 1.5%"
    },
    "description": {
      "ru": "Лёгкий питьевой йогурт с натуральным пюре лесной черники и цельнозерновыми хлопьями. Без искусственных красителей.",
      "be": "Лёгкі пітны ёгурт з натуральным пюрэ лясной чарніцы і цэльназерневымі шматкі.",
      "en": "Smooth drinkable yogurt blended with wild forest blueberry puree and whole-grain oat flakes. No artificial colors.",
      "zh": "清爽顺滑的饮用型酸奶，融入天然野生蓝莓果泥与全谷物燕麦片，营养饱腹。"
    },
    "image": ASSETS.productGreekYogurt,
    "fatContent": 1.5,
    "proteinContent": 3.1,
    "lactoseFree": false,
    "exportReady": true,
    "featured": false,
    "visible": true,
    "packages": [
      {
        "id": "yd-290",
        "weight": "290 г",
        "weightGrams": 290,
        "shelfLife": {
          "ru": "21 сутки",
          "be": "21 суткі",
          "en": "21 days",
          "zh": "21天"
        },
        "storage": {
          "ru": "+2…+6 °C",
          "be": "+2…+6 °C",
          "en": "+2…+6 °C",
          "zh": "+2…+6 °C"
        },
        "packagingType": {
          "ru": "Порционная ПЭТ-бутылка",
          "be": "Парцыйная ПЭТ-бутэлька",
          "en": "On-the-go PET bottle",
          "zh": "便携PET瓶装"
        },
        "unitsPerBox": 12,
        "gtin": "4810268052017"
      },
      {
        "id": "yd-750",
        "weight": "750 г",
        "weightGrams": 750,
        "shelfLife": {
          "ru": "21 сутки",
          "be": "21 суткі",
          "en": "21 days",
          "zh": "21天"
        },
        "storage": {
          "ru": "+2…+6 °C",
          "be": "+2…+6 °C",
          "en": "+2…+6 °C",
          "zh": "+2…+6 °C"
        },
        "packagingType": {
          "ru": "Семейная ПЭТ-бутылка",
          "be": "Сямейная ПЭТ-бутэлька",
          "en": "Family PET bottle",
          "zh": "家庭装PET瓶"
        },
        "unitsPerBox": 8,
        "gtin": "4810268052024"
      }
    ],
    "characteristics": {
      "flavor": {
        "ru": "Черника — овсяные злаки",
        "be": "Чарніца — аўсяныя злакі",
        "en": "Blueberry & oats",
        "zh": "野生蓝莓燕麦"
      },
      "proteinNote": {
        "ru": "3,1 г / 100 г",
        "be": "3,1 г / 100 г",
        "en": "3.1 g / 100g",
        "zh": "3.1克 / 100克"
      },
      "sugar": {
        "ru": "Пониженное содержание сахара",
        "be": "Паніжанае ўтрыманне цукру",
        "en": "Reduced sugar",
        "zh": "低糖配方"
      }
    },
    "useCases": [
      "daily",
      "fitness"
    ],
    "relatedIds": [
      "greek-yogurt-protein",
      "kefir-classic"
    ],
    "seo": {
      "title": {
        "ru": "Йогурт питьевой с черникой и злаками 1,5% (1.5%) — характеристики и фасовка | Молочный Мир",
        "be": "Ёгурт пітны з чарніцай і злакамі 1,5% (1.5%) — характарыстыкі і фасоўка | Малочны Мір",
        "en": "Drinkable Yogurt Blueberry & Grains 1.5% (1.5% Fat) — Specs & Packaging | Molochny Mir",
        "zh": "蓝莓谷物风味饮用酸奶 1.5% (1.5% 乳脂) — 规格与包装 | Molochny Mir"
      },
      "description": {
        "ru": "Йогурт питьевой с черникой и злаками 1,5%: Лёгкий питьевой йогурт с натуральным пюре лесной черники и цельнозерновыми хлопьями. Без искусственных красителей. Фасовки: 290 г, 750 г.",
        "be": "Ёгурт пітны з чарніцай і злакамі 1,5%: Лёгкі пітны ёгурт з натуральным пюрэ лясной чарніцы і цэльназерневымі шматкі. Фасоўкі: 290 г, 750 г.",
        "en": "Drinkable Yogurt Blueberry & Grains 1.5%: Smooth drinkable yogurt blended with wild forest blueberry puree and whole-grain oat flakes. No artificial colors. Formats: 290 г, 750 г.",
        "zh": "蓝莓谷物风味饮用酸奶 1.5%：清爽顺滑的饮用型酸奶，融入天然野生蓝莓果泥与全谷物燕麦片，营养饱腹。 规格：290 г, 750 г。"
      },
      "h1": {
        "ru": "Йогурт питьевой с черникой и злаками 1,5%",
        "be": "Ёгурт пітны з чарніцай і злакамі 1,5%",
        "en": "Drinkable Yogurt Blueberry & Grains 1.5%",
        "zh": "蓝莓谷物风味饮用酸奶 1.5%"
      }
    }
  },
  {
    "id": "greek-yogurt-lactose-free",
    "slug": "greek-yogurt-lactose-free",
    "category": "yogurt",
    "subcategory": "greek",
    "name": {
      "ru": "Йогурт греческий безлактозный Active Life 2%",
      "be": "Ёгурт грэчаскі безлактозны Active Life 2%",
      "en": "Active Life Lactose-Free Greek Yogurt 2%",
      "zh": "Active Life 零乳糖高蛋白希腊酸奶 2%"
    },
    "description": {
      "ru": "Сочетает два ключевых преимущества: высокое содержание белка (8,2 г) и полное отсутствие лактозы (< 0,01%) для комфортного питания без ограничений.",
      "be": "Спалучае высокае ўтрыманне бялку (8,2 г) і поўную адсутнасць лактозы (< 0,01%).",
      "en": "Combines 8.2g natural dairy protein per 100g with zero lactose (< 0.01%) and zero added sugar for sensitive digestion.",
      "zh": "兼具每100克8.2克高蛋白与零乳糖（<0.01%）双重优势，无添加蔗糖，适合健身与乳糖不耐受人群。"
    },
    "image": ASSETS.productGreekYogurt,
    "fatContent": 2.0,
    "proteinContent": 8.2,
    "lactoseFree": true,
    "exportReady": true,
    "featured": false,
    "visible": true,
    "packages": [
      {
        "id": "gylf-140",
        "weight": "140 г",
        "weightGrams": 140,
        "shelfLife": {
          "ru": "21 сутки",
          "be": "21 суткі",
          "en": "21 days",
          "zh": "21天"
        },
        "storage": {
          "ru": "+2…+6 °C",
          "be": "+2…+6 °C",
          "en": "+2…+6 °C",
          "zh": "+2…+6 °C"
        },
        "packagingType": {
          "ru": "Герметичный стакан 140 г",
          "be": "Герметычны кубак 140 г",
          "en": "Sealed 140g cup",
          "zh": "140克密封杯装"
        },
        "unitsPerBox": 12,
        "gtin": "4810268053014"
      }
    ],
    "characteristics": {
      "flavor": {
        "ru": "Натуральный без лактозы",
        "be": "Натуральны без лактозы",
        "en": "Plain lactose-free",
        "zh": "原味无乳糖"
      },
      "proteinNote": {
        "ru": "8,2 г / 100 г (высокий белок)",
        "be": "8,2 г / 100 г (высокі бялок)",
        "en": "8.2 g / 100g (High Protein)",
        "zh": "8.2克 / 100克（高蛋白）"
      },
      "sugar": {
        "ru": "Без добавленного сахара",
        "be": "Без дададзенага цукру",
        "en": "No added sugar",
        "zh": "零添加蔗糖"
      }
    },
    "useCases": [
      "lactose-free",
      "high-protein",
      "fitness",
      "daily"
    ],
    "relatedIds": [
      "milk-lactose-free",
      "greek-yogurt-protein"
    ],
    "seo": {
      "title": {
        "ru": "Йогурт греческий безлактозный Active Life 2% (2.0%) — характеристики и фасовка | Молочный Мир",
        "be": "Ёгурт грэчаскі безлактозны Active Life 2% (2.0%) — характарыстыкі і фасоўка | Малочны Мір",
        "en": "Active Life Lactose-Free Greek Yogurt 2% (2.0% Fat) — Specs & Packaging | Molochny Mir",
        "zh": "Active Life 零乳糖高蛋白希腊酸奶 2% (2.0% 乳脂) — 规格与包装 | Molochny Mir"
      },
      "description": {
        "ru": "Йогурт греческий безлактозный Active Life 2%: Сочетает два ключевых преимущества: высокое содержание белка (8,2 г) и полное отсутствие лактозы (< 0,01%) для комфортно Фасовки: 140 г.",
        "be": "Ёгурт грэчаскі безлактозны Active Life 2%: Спалучае высокае ўтрыманне бялку (8,2 г) і поўную адсутнасць лактозы (< 0,01%). Фасоўкі: 140 г.",
        "en": "Active Life Lactose-Free Greek Yogurt 2%: Combines 8.2g natural dairy protein per 100g with zero lactose (< 0.01%) and zero added sugar for sensitive digestion. Formats: 140 г.",
        "zh": "Active Life 零乳糖高蛋白希腊酸奶 2%：兼具每100克8.2克高蛋白与零乳糖（<0.01%）双重优势，无添加蔗糖，适合健身与乳糖不耐受人群。 规格：140 г。"
      },
      "h1": {
        "ru": "Йогурт греческий безлактозный Active Life 2%",
        "be": "Ёгурт грэчаскі безлактозны Active Life 2%",
        "en": "Active Life Lactose-Free Greek Yogurt 2%",
        "zh": "Active Life 零乳糖高蛋白希腊酸奶 2%"
      }
    }
  },
  {
    "id": "sour-cream-20",
    "slug": "sour-cream-20",
    "category": "sour-cream",
    "subcategory": "classic-sour-cream",
    "name": {
      "ru": "Сметана 20% традиционная",
      "be": "Смятана 20% традыцыйная",
      "en": "Traditional Sour Cream 20%",
      "zh": "经典发酵酸奶油 20%"
    },
    "description": {
      "ru": "Плотная, глянцевая сметана из нормализованных сливок и чистой культуры молочнокислых бактерий. Отлично подходит к горячим блюдам и выпечке.",
      "be": "Шчыльная смятана з нармалізаваных вяршкоў і чыстай культуры малочнакіслых бактэрый.",
      "en": "Rich, spoonable cultured sour cream crafted exclusively from pure dairy cream and lactic starter cultures.",
      "zh": "纯正鲜奶油与乳酸菌发酵制成的浓稠酸奶油，质地丝滑，适合烹饪佐餐与烘焙。"
    },
    "image": ASSETS.productButterCream,
    "fatContent": 20.0,
    "proteinContent": 2.8,
    "lactoseFree": false,
    "exportReady": true,
    "featured": false,
    "visible": true,
    "packages": [
      {
        "id": "sc-200",
        "weight": "200 г",
        "weightGrams": 200,
        "shelfLife": {
          "ru": "21 сутки",
          "be": "21 суткі",
          "en": "21 days",
          "zh": "21天"
        },
        "storage": {
          "ru": "+2…+6 °C",
          "be": "+2…+6 °C",
          "en": "+2…+6 °C",
          "zh": "+2…+6 °C"
        },
        "packagingType": {
          "ru": "Пластиковый стакан + крышка",
          "be": "Пластыкавы кубак + вечка",
          "en": "Cup with snap lid",
          "zh": "带盖塑料杯"
        },
        "unitsPerBox": 12,
        "gtin": "4810268031012"
      },
      {
        "id": "sc-400",
        "weight": "400 г",
        "weightGrams": 400,
        "shelfLife": {
          "ru": "21 сутки",
          "be": "21 суткі",
          "en": "21 days",
          "zh": "21天"
        },
        "storage": {
          "ru": "+2…+6 °C",
          "be": "+2…+6 °C",
          "en": "+2…+6 °C",
          "zh": "+2…+6 °C"
        },
        "packagingType": {
          "ru": "Большой стакан + крышка",
          "be": "Вялікі кубак + вечка",
          "en": "Family cup with lid",
          "zh": "家庭装大杯"
        },
        "unitsPerBox": 8,
        "gtin": "4810268031029"
      }
    ],
    "characteristics": {
      "consistency": {
        "ru": "Однородная, густая, с глянцевым срезом",
        "be": "Аднародная, густая",
        "en": "Thick, glossy, homogeneous",
        "zh": "质地浓稠均匀有光泽"
      },
      "cultures": {
        "ru": "Мезофильные лактококки",
        "be": "Мезафільныя лактакокі",
        "en": "Mesophilic lactic cultures",
        "zh": "嗜温乳酸菌"
      }
    },
    "useCases": [
      "daily",
      "baking"
    ],
    "relatedIds": [
      "sour-cream-15-horeca",
      "butter-825",
      "tvorog-grain"
    ],
    "seo": {
      "title": {
        "ru": "Сметана 20% традиционная (20.0%) — характеристики и фасовка | Молочный Мир",
        "be": "Смятана 20% традыцыйная (20.0%) — характарыстыкі і фасоўка | Малочны Мір",
        "en": "Traditional Sour Cream 20% (20.0% Fat) — Specs & Packaging | Molochny Mir",
        "zh": "经典发酵酸奶油 20% (20.0% 乳脂) — 规格与包装 | Molochny Mir"
      },
      "description": {
        "ru": "Сметана 20% традиционная: Плотная, глянцевая сметана из нормализованных сливок и чистой культуры молочнокислых бактерий. Отлично подходит к горячи Фасовки: 200 г, 400 г.",
        "be": "Смятана 20% традыцыйная: Шчыльная смятана з нармалізаваных вяршкоў і чыстай культуры малочнакіслых бактэрый. Фасоўкі: 200 г, 400 г.",
        "en": "Traditional Sour Cream 20%: Rich, spoonable cultured sour cream crafted exclusively from pure dairy cream and lactic starter cultures. Formats: 200 г, 400 г.",
        "zh": "经典发酵酸奶油 20%：纯正鲜奶油与乳酸菌发酵制成的浓稠酸奶油，质地丝滑，适合烹饪佐餐与烘焙。 规格：200 г, 400 г。"
      },
      "h1": {
        "ru": "Сметана 20% традиционная",
        "be": "Смятана 20% традыцыйная",
        "en": "Traditional Sour Cream 20%",
        "zh": "经典发酵酸奶油 20%"
      }
    }
  },
  {
    "id": "sour-cream-15-horeca",
    "slug": "sour-cream-15-horeca",
    "category": "sour-cream",
    "subcategory": "classic-sour-cream",
    "name": {
      "ru": "Сметана 15% классическая и HoReCa",
      "be": "Смятана 15% класічная і HoReCa",
      "en": "Cultured Sour Cream 15% (Retail & HoReCa)",
      "zh": "经典与餐饮专供酸奶油 15%"
    },
    "description": {
      "ru": "Нежная сметана пониженной жирности для соусов, салатов, борща и ресторанных кухонь. Поставляется в стаканах 200 г и вёдрах 3 кг.",
      "be": "Далікатная смятана 15% для соўсаў, салатаў і рэстаранных кухняў у шклянках 200 г і вёдрах 3 кг.",
      "en": "Light 15% cultured sour cream ideal for salads, sauces, and commercial kitchens, available in 200g retail cups and 3kg HoReCa pails.",
      "zh": "15%轻脂酸奶油，适合搭配沙拉、调制酱汁与餐厅商用厨房，提供200克杯装与3公斤商用桶装。"
    },
    "image": ASSETS.productButterCream,
    "fatContent": 15.0,
    "proteinContent": 2.9,
    "lactoseFree": false,
    "exportReady": true,
    "featured": false,
    "visible": true,
    "packages": [
      {
        "id": "sc15-200",
        "weight": "200 г",
        "weightGrams": 200,
        "shelfLife": {
          "ru": "21 сутки",
          "be": "21 суткі",
          "en": "21 days",
          "zh": "21天"
        },
        "storage": {
          "ru": "+2…+6 °C",
          "be": "+2…+6 °C",
          "en": "+2…+6 °C",
          "zh": "+2…+6 °C"
        },
        "packagingType": {
          "ru": "Пластиковый стакан",
          "be": "Пластыкавы кубак",
          "en": "Retail plastic cup",
          "zh": "零售塑料杯"
        },
        "unitsPerBox": 12,
        "gtin": "4810268032019"
      },
      {
        "id": "sc15-3000",
        "weight": "3 кг (HoReCa)",
        "weightGrams": 3000,
        "shelfLife": {
          "ru": "21 сутки",
          "be": "21 суткі",
          "en": "21 days",
          "zh": "21天"
        },
        "storage": {
          "ru": "+2…+6 °C",
          "be": "+2…+6 °C",
          "en": "+2…+6 °C",
          "zh": "+2…+6 °C"
        },
        "packagingType": {
          "ru": "Пищевое ведро с контролем вскрытия",
          "be": "Харчовае вядро з кантролем ускрыцця",
          "en": "Tamper-evident 3kg HoReCa pail",
          "zh": "3公斤商用密封桶"
        },
        "unitsPerBox": 2,
        "gtin": "4810268032026"
      }
    ],
    "characteristics": {
      "consistency": {
        "ru": "Нежная, однородная, без отсечения сыворотки",
        "be": "Далікатная, аднародная",
        "en": "Smooth, stable texture",
        "zh": "细腻顺滑无乳清析出"
      },
      "cultures": {
        "ru": "Чистые молочнокислые культуры",
        "be": "Чыстыя малочнакіслыя культуры",
        "en": "Pure lactic cultures",
        "zh": "纯正乳酸菌发酵"
      }
    },
    "useCases": [
      "horeca",
      "daily",
      "salad"
    ],
    "relatedIds": [
      "sour-cream-20",
      "cream-33"
    ],
    "seo": {
      "title": {
        "ru": "Сметана 15% классическая и HoReCa (15.0%) — характеристики и фасовка | Молочный Мир",
        "be": "Смятана 15% класічная і HoReCa (15.0%) — характарыстыкі і фасоўка | Малочны Мір",
        "en": "Cultured Sour Cream 15% (Retail & HoReCa) (15.0% Fat) — Specs & Packaging | Molochny Mir",
        "zh": "经典与餐饮专供酸奶油 15% (15.0% 乳脂) — 规格与包装 | Molochny Mir"
      },
      "description": {
        "ru": "Сметана 15% классическая и HoReCa: Нежная сметана пониженной жирности для соусов, салатов, борща и ресторанных кухонь. Поставляется в стаканах 200 г и вёдр Фасовки: 200 г, 3 кг (HoReCa).",
        "be": "Смятана 15% класічная і HoReCa: Далікатная смятана 15% для соўсаў, салатаў і рэстаранных кухняў у шклянках 200 г і вёдрах 3 кг. Фасоўкі: 200 г, 3 кг (HoReCa).",
        "en": "Cultured Sour Cream 15% (Retail & HoReCa): Light 15% cultured sour cream ideal for salads, sauces, and commercial kitchens, available in 200g retail cups and 3kg H Formats: 200 г, 3 кг (HoReCa).",
        "zh": "经典与餐饮专供酸奶油 15%：15%轻脂酸奶油，适合搭配沙拉、调制酱汁与餐厅商用厨房，提供200克杯装与3公斤商用桶装。 规格：200 г, 3 кг (HoReCa)。"
      },
      "h1": {
        "ru": "Сметана 15% классическая и HoReCa",
        "be": "Смятана 15% класічная і HoReCa",
        "en": "Cultured Sour Cream 15% (Retail & HoReCa)",
        "zh": "经典与餐饮专供酸奶油 15%"
      }
    }
  },
  {
    "id": "tvorog-grain",
    "slug": "tvorog-grain",
    "category": "tvorog",
    "subcategory": "crumbly",
    "name": {
      "ru": "Творог рассыпчатый 5% (высокий белок)",
      "be": "Тварог рассыпісты 5% (высокі бялок)",
      "en": "High-Protein Crumbly Tvorog 5%",
      "zh": "高蛋白颗粒凝乳干酪 5%"
    },
    "description": {
      "ru": "Натуральный рассыпчатый творог с крупным мягким зерном и высоким содержанием казеинового белка (17 г на 100 г). Бережно упакован в защитную газовую среду.",
      "be": "Натуральны рассыпісты тварог з высокім утрыманнем казеінавага бялку (17 г на 100 г).",
      "en": "Clean-label crumbly tvorog rich in slow-digesting casein protein (17g per 100g), packed in modified atmosphere for freshness.",
      "zh": "富含17克优质酪蛋白的传统颗粒凝乳干酪，采用气调锁鲜包装，适合健身营养餐与烘焙。"
    },
    "image": ASSETS.productGreekYogurt,
    "fatContent": 5.0,
    "proteinContent": 17.0,
    "lactoseFree": false,
    "exportReady": true,
    "featured": false,
    "visible": true,
    "packages": [
      {
        "id": "tv-220",
        "weight": "220 г",
        "weightGrams": 220,
        "shelfLife": {
          "ru": "20 суток",
          "be": "20 сутак",
          "en": "20 days",
          "zh": "20天"
        },
        "storage": {
          "ru": "+2…+6 °C",
          "be": "+2…+6 °C",
          "en": "+2…+6 °C",
          "zh": "+2…+6 °C"
        },
        "packagingType": {
          "ru": "Пакет стабило-бэг (МГС)",
          "be": "Пакет стабіла-бэг (МГС)",
          "en": "MAP stabilo pouch",
          "zh": "气调自立袋"
        },
        "unitsPerBox": 12,
        "gtin": "4810268061019"
      },
      {
        "id": "tv-450",
        "weight": "450 г",
        "weightGrams": 450,
        "shelfLife": {
          "ru": "20 суток",
          "be": "20 сутак",
          "en": "20 days",
          "zh": "20天"
        },
        "storage": {
          "ru": "+2…+6 °C",
          "be": "+2…+6 °C",
          "en": "+2…+6 °C",
          "zh": "+2…+6 °C"
        },
        "packagingType": {
          "ru": "Пакет с zip-lock",
          "be": "Пакет з zip-lock",
          "en": "Resealable zip-lock pouch",
          "zh": "自封拉链袋"
        },
        "unitsPerBox": 8,
        "gtin": "4810268061026"
      }
    ],
    "characteristics": {
      "grain": {
        "ru": "Рассыпчатое мягкое зерно",
        "be": "Рассыпістае мяккае зярня",
        "en": "Soft crumbly curds",
        "zh": "松散柔润凝乳粒"
      },
      "proteinNote": {
        "ru": "17,0 г / 100 г",
        "be": "17,0 г / 100 г",
        "en": "17.0 g / 100g",
        "zh": "17.0克 / 100克"
      }
    },
    "useCases": [
      "high-protein",
      "fitness",
      "baking",
      "daily"
    ],
    "relatedIds": [
      "cottage-cheese-cream-5",
      "greek-yogurt-protein",
      "sour-cream-20"
    ],
    "seo": {
      "title": {
        "ru": "Творог рассыпчатый 5% (высокий белок) (5.0%) — характеристики и фасовка | Молочный Мир",
        "be": "Тварог рассыпісты 5% (высокі бялок) (5.0%) — характарыстыкі і фасоўка | Малочны Мір",
        "en": "High-Protein Crumbly Tvorog 5% (5.0% Fat) — Specs & Packaging | Molochny Mir",
        "zh": "高蛋白颗粒凝乳干酪 5% (5.0% 乳脂) — 规格与包装 | Molochny Mir"
      },
      "description": {
        "ru": "Творог рассыпчатый 5% (высокий белок): Натуральный рассыпчатый творог с крупным мягким зерном и высоким содержанием казеинового белка (17 г на 100 г). Бережно  Фасовки: 220 г, 450 г.",
        "be": "Тварог рассыпісты 5% (высокі бялок): Натуральны рассыпісты тварог з высокім утрыманнем казеінавага бялку (17 г на 100 г). Фасоўкі: 220 г, 450 г.",
        "en": "High-Protein Crumbly Tvorog 5%: Clean-label crumbly tvorog rich in slow-digesting casein protein (17g per 100g), packed in modified atmosphere for fresh Formats: 220 г, 450 г.",
        "zh": "高蛋白颗粒凝乳干酪 5%：富含17克优质酪蛋白的传统颗粒凝乳干酪，采用气调锁鲜包装，适合健身营养餐与烘焙。 规格：220 г, 450 г。"
      },
      "h1": {
        "ru": "Творог рассыпчатый 5% (высокий белок)",
        "be": "Тварог рассыпісты 5% (высокі бялок)",
        "en": "High-Protein Crumbly Tvorog 5%",
        "zh": "高蛋白颗粒凝乳干酪 5%"
      }
    }
  },
  {
    "id": "cottage-cheese-cream-5",
    "slug": "cottage-cheese-cream-5",
    "category": "tvorog",
    "subcategory": "grained",
    "name": {
      "ru": "Творог зернёный в сливках 5%",
      "be": "Тварог зярністы ў вяршках 5%",
      "en": "Grained Cottage Cheese in Cream 5%",
      "zh": "鲜奶油颗粒干酪 5%"
    },
    "description": {
      "ru": "Нежное творожное зерно, залитое слегка подсоленными пастеризованными сливками. Готовый белковый завтрак и основа для свежих салатов.",
      "be": "Далікатнае тварожнае зярня ў злёгку падсоленых пастэрызаваных вяршках.",
      "en": "Delicate dairy curd pearls bathed in lightly salted pasteurized cream. Ready-to-eat high-protein breakfast.",
      "zh": "鲜嫩干酪凝乳颗粒配以微咸巴氏杀菌淡奶油，开盖即食的高蛋白营养早餐。"
    },
    "image": ASSETS.productGreekYogurt,
    "fatContent": 5.0,
    "proteinContent": 12.5,
    "lactoseFree": false,
    "exportReady": true,
    "featured": false,
    "visible": true,
    "packages": [
      {
        "id": "cc-150",
        "weight": "150 г",
        "weightGrams": 150,
        "shelfLife": {
          "ru": "18 суток",
          "be": "18 сутак",
          "en": "18 days",
          "zh": "18天"
        },
        "storage": {
          "ru": "+2…+6 °C",
          "be": "+2…+6 °C",
          "en": "+2…+6 °C",
          "zh": "+2…+6 °C"
        },
        "packagingType": {
          "ru": "Стаканчик с фольгой",
          "be": "Кубачак з фальгой",
          "en": "Foil-sealed retail cup",
          "zh": "铝箔封口杯装"
        },
        "unitsPerBox": 12,
        "gtin": "4810268062016"
      },
      {
        "id": "cc-300",
        "weight": "300 г",
        "weightGrams": 300,
        "shelfLife": {
          "ru": "18 суток",
          "be": "18 сутак",
          "en": "18 days",
          "zh": "18天"
        },
        "storage": {
          "ru": "+2…+6 °C",
          "be": "+2…+6 °C",
          "en": "+2…+6 °C",
          "zh": "+2…+6 °C"
        },
        "packagingType": {
          "ru": "Контейнер с крышкой",
          "be": "Кантэйнер з вечкам",
          "en": "Tub with snap lid",
          "zh": "带盖盒装"
        },
        "unitsPerBox": 8,
        "gtin": "4810268062023"
      }
    ],
    "characteristics": {
      "grain": {
        "ru": "Калиброванное зерно в свежих сливках",
        "be": "Калібраванае зярня ў вяршках",
        "en": "Uniform curd pearls in cream",
        "zh": "均匀凝乳粒配鲜奶油"
      },
      "proteinNote": {
        "ru": "12,5 г / 100 г",
        "be": "12,5 г / 100 г",
        "en": "12.5 g / 100g",
        "zh": "12.5克 / 100克"
      }
    },
    "useCases": [
      "high-protein",
      "fitness",
      "salad",
      "daily"
    ],
    "relatedIds": [
      "tvorog-grain",
      "greek-yogurt-protein"
    ],
    "seo": {
      "title": {
        "ru": "Творог зернёный в сливках 5% (5.0%) — характеристики и фасовка | Молочный Мир",
        "be": "Тварог зярністы ў вяршках 5% (5.0%) — характарыстыкі і фасоўка | Малочны Мір",
        "en": "Grained Cottage Cheese in Cream 5% (5.0% Fat) — Specs & Packaging | Molochny Mir",
        "zh": "鲜奶油颗粒干酪 5% (5.0% 乳脂) — 规格与包装 | Molochny Mir"
      },
      "description": {
        "ru": "Творог зернёный в сливках 5%: Нежное творожное зерно, залитое слегка подсоленными пастеризованными сливками. Готовый белковый завтрак и основа для све Фасовки: 150 г, 300 г.",
        "be": "Тварог зярністы ў вяршках 5%: Далікатнае тварожнае зярня ў злёгку падсоленых пастэрызаваных вяршках. Фасоўкі: 150 г, 300 г.",
        "en": "Grained Cottage Cheese in Cream 5%: Delicate dairy curd pearls bathed in lightly salted pasteurized cream. Ready-to-eat high-protein breakfast. Formats: 150 г, 300 г.",
        "zh": "鲜奶油颗粒干酪 5%：鲜嫩干酪凝乳颗粒配以微咸巴氏杀菌淡奶油，开盖即食的高蛋白营养早餐。 规格：150 г, 300 г。"
      },
      "h1": {
        "ru": "Творог зернёный в сливках 5%",
        "be": "Тварог зярністы ў вяршках 5%",
        "en": "Grained Cottage Cheese in Cream 5%",
        "zh": "鲜奶油颗粒干酪 5%"
      }
    }
  },
  {
    "id": "butter-825",
    "slug": "butter-825",
    "category": "butter",
    "subcategory": "sweet-cream",
    "name": {
      "ru": "Масло сливочное несолёное 82,5%",
      "be": "Масла сметанковае несалёнае 82,5%",
      "en": "Unsalted Sweet Cream Butter 82.5%",
      "zh": "82.5% 天然甜奶油无盐黄油"
    },
    "description": {
      "ru": "Классическое сладкосливочное масло высшего качества из отборных пастеризованных сливок. Чистый сливочный аромат, идеальная пластичность для кондитерских изделий и экспорта.",
      "be": "Класічнае салодкасметанковае масла вышэйшай якасці са свежых вяршкоў.",
      "en": "Premium 82.5% milkfat unsalted butter churned from fresh pasteurized sweet cream. Ideal for French pastry lamination, retail, and global export.",
      "zh": "采用巴氏杀菌鲜奶油搅打而成的82.5%高乳脂无盐黄油，奶香纯粹、延展性佳，适用于起酥烘焙及国际出口。"
    },
    "image": ASSETS.productButterCream,
    "fatContent": 82.5,
    "proteinContent": 0.6,
    "lactoseFree": false,
    "exportReady": true,
    "featured": true,
    "visible": true,
    "packages": [
      {
        "id": "but-180",
        "weight": "180 г",
        "weightGrams": 180,
        "shelfLife": {
          "ru": "60 суток (+2…+6 °C) / 120 суток (-16 °C)",
          "be": "60 / 120 сутак",
          "en": "60 days (+2…+6 °C) / 120 days (-16 °C)",
          "zh": "60天冷藏 / 120天冷冻"
        },
        "storage": {
          "ru": "+2…+6 °C или -16 °C",
          "be": "+2…+6 °C или -16 °C",
          "en": "+2…+6 °C или -16 °C",
          "zh": "+2…+6 °C или -16 °C"
        },
        "packagingType": {
          "ru": "Кашированная фольга",
          "be": "Кашыраваная фальга",
          "en": "Laminated foil wrap",
          "zh": "复合铝箔包装"
        },
        "unitsPerBox": 24,
        "gtin": "4810268071018"
      },
      {
        "id": "but-20000",
        "weight": "20 кг (Монолит B2B)",
        "weightGrams": 20000,
        "shelfLife": {
          "ru": "24 месяца при -18 °C",
          "be": "24 месяцы пры -18 °C",
          "en": "24 months at -18 °C",
          "zh": "24个月 (-18 °C)"
        },
        "storage": {
          "ru": "-18 °C",
          "be": "-18 °C",
          "en": "-18 °C",
          "zh": "-18 °C"
        },
        "packagingType": {
          "ru": "Гофрокороб с пергаментным вкладышем",
          "be": "Гофракаробка з пергаментам",
          "en": "20kg export carton with parchment liner",
          "zh": "20公斤出口防潮纸箱"
        },
        "unitsPerBox": 1,
        "gtin": "4810268071094"
      }
    ],
    "characteristics": {
      "standard": {
        "ru": "ГОСТ 32261-2013 / Высший сорт",
        "be": "ДАСТ 32261-2013 / Вышэйшы гатунак",
        "en": "GOST 32261 / Grade A",
        "zh": "GOST 32261 最高等级"
      },
      "method": {
        "ru": "Непрерывное сбивание свежих сливок",
        "be": "Бесперапыннае збіванне вяршкоў",
        "en": "Continuous sweet-cream churning",
        "zh": "鲜奶油连续搅打工艺"
      }
    },
    "useCases": [
      "baking",
      "export",
      "daily",
      "horeca"
    ],
    "relatedIds": [
      "butter-725",
      "cream-33",
      "skim-milk-powder-b2b"
    ],
    "seo": {
      "title": {
        "ru": "Масло сливочное несолёное 82,5% (82.5%) — характеристики и фасовка | Молочный Мир",
        "be": "Масла сметанковае несалёнае 82,5% (82.5%) — характарыстыкі і фасоўка | Малочны Мір",
        "en": "Unsalted Sweet Cream Butter 82.5% (82.5% Fat) — Specs & Packaging | Molochny Mir",
        "zh": "82.5% 天然甜奶油无盐黄油 (82.5% 乳脂) — 规格与包装 | Molochny Mir"
      },
      "description": {
        "ru": "Масло сливочное несолёное 82,5%: Классическое сладкосливочное масло высшего качества из отборных пастеризованных сливок. Чистый сливочный аромат, идеальн Фасовки: 180 г, 20 кг (Монолит B2B).",
        "be": "Масла сметанковае несалёнае 82,5%: Класічнае салодкасметанковае масла вышэйшай якасці са свежых вяршкоў. Фасоўкі: 180 г, 20 кг (Монолит B2B).",
        "en": "Unsalted Sweet Cream Butter 82.5%: Premium 82.5% milkfat unsalted butter churned from fresh pasteurized sweet cream. Ideal for French pastry lamination, re Formats: 180 г, 20 кг (Монолит B2B).",
        "zh": "82.5% 天然甜奶油无盐黄油：采用巴氏杀菌鲜奶油搅打而成的82.5%高乳脂无盐黄油，奶香纯粹、延展性佳，适用于起酥烘焙及国际出口。 规格：180 г, 20 кг (Монолит B2B)。"
      },
      "h1": {
        "ru": "Масло сливочное несолёное 82,5%",
        "be": "Масла сметанковае несалёнае 82,5%",
        "en": "Unsalted Sweet Cream Butter 82.5%",
        "zh": "82.5% 天然甜奶油无盐黄油"
      }
    }
  },
  {
    "id": "butter-725",
    "slug": "butter-725",
    "category": "butter",
    "subcategory": "sweet-cream",
    "name": {
      "ru": "Масло сливочное крестьянское 72,5%",
      "be": "Масла сметанковае сялянскае 72,5%",
      "en": "Sweet Cream Butter 72.5%",
      "zh": "72.5% 经典乡村甜奶油黄油"
    },
    "description": {
      "ru": "Натуральное крестьянское сладкосливочное масло для бутербродов, каш и домашней выпечки в потребительской и весовой фасовке.",
      "be": "Натуральнае сялянскае салодкасметанковае масла 72,5% для штодзённага рацыёну і выпечкі.",
      "en": "Traditional 72.5% milkfat sweet cream butter crafted for everyday spreads, breakfast dishes, and home baking.",
      "zh": "72.5%乳脂含量天然甜奶油黄油，奶香柔和，适合日常佐餐抹酱及家庭烘焙。"
    },
    "image": ASSETS.productButterCream,
    "fatContent": 72.5,
    "proteinContent": 0.8,
    "lactoseFree": false,
    "exportReady": true,
    "featured": false,
    "visible": true,
    "packages": [
      {
        "id": "but72-180",
        "weight": "180 г",
        "weightGrams": 180,
        "shelfLife": {
          "ru": "60 суток (+2…+6 °C)",
          "be": "60 сутак (+2…+6 °C)",
          "en": "60 days (+2…+6 °C)",
          "zh": "60天冷藏"
        },
        "storage": {
          "ru": "+2…+6 °C",
          "be": "+2…+6 °C",
          "en": "+2…+6 °C",
          "zh": "+2…+6 °C"
        },
        "packagingType": {
          "ru": "Кашированная фольга",
          "be": "Кашыраваная фальга",
          "en": "Foil wrap 180g",
          "zh": "180克铝箔包装"
        },
        "unitsPerBox": 24,
        "gtin": "4810268072015"
      },
      {
        "id": "but72-5000",
        "weight": "5 кг (HoReCa)",
        "weightGrams": 5000,
        "shelfLife": {
          "ru": "120 суток (-18 °C)",
          "be": "120 сутак (-18 °C)",
          "en": "120 days (-18 °C)",
          "zh": "120天冷冻"
        },
        "storage": {
          "ru": "-18 °C",
          "be": "-18 °C",
          "en": "-18 °C",
          "zh": "-18 °C"
        },
        "packagingType": {
          "ru": "Короб с пергаментом 5 кг",
          "be": "Каробка 5 кг",
          "en": "5kg HoReCa carton",
          "zh": "5公斤餐饮纸箱"
        },
        "unitsPerBox": 1,
        "gtin": "4810268072022"
      }
    ],
    "characteristics": {
      "standard": {
        "ru": "ГОСТ 32261-2013 / Крестьянское",
        "be": "ДАСТ 32261-2013 / Сялянскае",
        "en": "GOST 32261 / 72.5%",
        "zh": "GOST 32261 标准"
      },
      "method": {
        "ru": "Сбивание пастеризованных сливок",
        "be": "Збіванне пастэрызаваных вяршкоў",
        "en": "Pasteurized sweet-cream churning",
        "zh": "巴氏杀菌稀奶油搅打"
      }
    },
    "useCases": [
      "daily",
      "baking",
      "horeca"
    ],
    "relatedIds": [
      "butter-825",
      "sour-cream-20"
    ],
    "seo": {
      "title": {
        "ru": "Масло сливочное крестьянское 72,5% (72.5%) — характеристики и фасовка | Молочный Мир",
        "be": "Масла сметанковае сялянскае 72,5% (72.5%) — характарыстыкі і фасоўка | Малочны Мір",
        "en": "Sweet Cream Butter 72.5% (72.5% Fat) — Specs & Packaging | Molochny Mir",
        "zh": "72.5% 经典乡村甜奶油黄油 (72.5% 乳脂) — 规格与包装 | Molochny Mir"
      },
      "description": {
        "ru": "Масло сливочное крестьянское 72,5%: Натуральное крестьянское сладкосливочное масло для бутербродов, каш и домашней выпечки в потребительской и весовой фасов Фасовки: 180 г, 5 кг (HoReCa).",
        "be": "Масла сметанковае сялянскае 72,5%: Натуральнае сялянскае салодкасметанковае масла 72,5% для штодзённага рацыёну і выпечкі. Фасоўкі: 180 г, 5 кг (HoReCa).",
        "en": "Sweet Cream Butter 72.5%: Traditional 72.5% milkfat sweet cream butter crafted for everyday spreads, breakfast dishes, and home baking. Formats: 180 г, 5 кг (HoReCa).",
        "zh": "72.5% 经典乡村甜奶油黄油：72.5%乳脂含量天然甜奶油黄油，奶香柔和，适合日常佐餐抹酱及家庭烘焙。 规格：180 г, 5 кг (HoReCa)。"
      },
      "h1": {
        "ru": "Масло сливочное крестьянское 72,5%",
        "be": "Масла сметанковае сялянскае 72,5%",
        "en": "Sweet Cream Butter 72.5%",
        "zh": "72.5% 经典乡村甜奶油黄油"
      }
    }
  },
  {
    "id": "ice-cream-plombir",
    "slug": "ice-cream-plombir",
    "category": "ice-cream",
    "subcategory": "plombir",
    "name": {
      "ru": "Мороженое «Пломбир ГороденЪ» ванильный 15%",
      "be": "Марозіва «Пламбір ГорадзенЪ» ванільны 15%",
      "en": "Goroden Vanilla Plombir Ice Cream 15%",
      "zh": "Goroden 15% 香草经典冰淇淋"
    },
    "description": {
      "ru": "Настоящий сливочный пломбир на цельном молоке и свежих сливках с натуральным экстрактом бурбонской ванили. Нежная тающая текстура без растительных жиров.",
      "be": "Сапраўдны сметанковы пламбір на цэльным малацэ і свежых вяршках з натуральнай ваніллю.",
      "en": "Rich 15% dairy-fat plombir ice cream crafted with fresh cream, whole milk, and natural Bourbon vanilla extract.",
      "zh": "采用全脂鲜奶、稀奶油与天然波旁香草精制成的15%高乳脂经典白俄罗斯冰淇淋，口感绵密无植物油。"
    },
    "image": ASSETS.productIceCream,
    "fatContent": 15.0,
    "proteinContent": 3.5,
    "lactoseFree": false,
    "exportReady": true,
    "featured": false,
    "visible": true,
    "packages": [
      {
        "id": "ice-80",
        "weight": "80 г (стаканчик)",
        "weightGrams": 80,
        "shelfLife": {
          "ru": "12 месяцев",
          "be": "12 месяцаў",
          "en": "12 months",
          "zh": "12个月"
        },
        "storage": {
          "ru": "-18 °C",
          "be": "-18 °C",
          "en": "-18 °C",
          "zh": "-18 °C"
        },
        "packagingType": {
          "ru": "Вафельный стаканчик во флоу-паке",
          "be": "Вафельны стаканчык у флоў-паку",
          "en": "Wafer cup in flow-pack",
          "zh": "脆筒杯密封袋装"
        },
        "unitsPerBox": 30,
        "gtin": "4810268081017"
      },
      {
        "id": "ice-500",
        "weight": "500 г (ванночка)",
        "weightGrams": 500,
        "shelfLife": {
          "ru": "12 месяцев",
          "be": "12 месяцаў",
          "en": "12 months",
          "zh": "12个月"
        },
        "storage": {
          "ru": "-18 °C",
          "be": "-18 °C",
          "en": "-18 °C",
          "zh": "-18 °C"
        },
        "packagingType": {
          "ru": "Контейнер с контролем вскрытия",
          "be": "Кантэйнер з кантролем ускрыцця",
          "en": "Tamper-evident family tub",
          "zh": "防拆家庭装盒"
        },
        "unitsPerBox": 8,
        "gtin": "4810268081024"
      }
    ],
    "characteristics": {
      "iceType": {
        "ru": "Пломбир сливочный 15%",
        "be": "Пламбір сметанковы 15%",
        "en": "15% dairy-fat plombir",
        "zh": "15%乳脂经典冰淇淋"
      },
      "flavor": {
        "ru": "Натуральная ваниль",
        "be": "Натуральная ваніль",
        "en": "Natural vanilla",
        "zh": "天然香草味"
      }
    },
    "useCases": [
      "dessert",
      "export"
    ],
    "relatedIds": [
      "ice-cream-chocolate-15",
      "cream-33",
      "curd-bar-vanilla"
    ],
    "seo": {
      "title": {
        "ru": "Мороженое «Пломбир ГороденЪ» ванильный 15% (15.0%) — характеристики и фасовка | Молочный Мир",
        "be": "Марозіва «Пламбір ГорадзенЪ» ванільны 15% (15.0%) — характарыстыкі і фасоўка | Малочны Мір",
        "en": "Goroden Vanilla Plombir Ice Cream 15% (15.0% Fat) — Specs & Packaging | Molochny Mir",
        "zh": "Goroden 15% 香草经典冰淇淋 (15.0% 乳脂) — 规格与包装 | Molochny Mir"
      },
      "description": {
        "ru": "Мороженое «Пломбир ГороденЪ» ванильный 15%: Настоящий сливочный пломбир на цельном молоке и свежих сливках с натуральным экстрактом бурбонской ванили. Нежная тающая Фасовки: 80 г (стаканчик), 500 г (ванночка).",
        "be": "Марозіва «Пламбір ГорадзенЪ» ванільны 15%: Сапраўдны сметанковы пламбір на цэльным малацэ і свежых вяршках з натуральнай ваніллю. Фасоўкі: 80 г (стаканчик), 500 г (ванночка).",
        "en": "Goroden Vanilla Plombir Ice Cream 15%: Rich 15% dairy-fat plombir ice cream crafted with fresh cream, whole milk, and natural Bourbon vanilla extract. Formats: 80 г (стаканчик), 500 г (ванночка).",
        "zh": "Goroden 15% 香草经典冰淇淋：采用全脂鲜奶、稀奶油与天然波旁香草精制成的15%高乳脂经典白俄罗斯冰淇淋，口感绵密无植物油。 规格：80 г (стаканчик), 500 г (ванночка)。"
      },
      "h1": {
        "ru": "Мороженое «Пломбир ГороденЪ» ванильный 15%",
        "be": "Марозіва «Пламбір ГорадзенЪ» ванільны 15%",
        "en": "Goroden Vanilla Plombir Ice Cream 15%",
        "zh": "Goroden 15% 香草经典冰淇淋"
      }
    }
  },
  {
    "id": "ice-cream-chocolate-15",
    "slug": "ice-cream-chocolate-15",
    "category": "ice-cream",
    "subcategory": "plombir",
    "name": {
      "ru": "Мороженое пломбир шоколадный в глазури 15%",
      "be": "Марозіва пламбір шакаладны ў глазуры 15%",
      "en": "Chocolate Plombir Eskimo 15%",
      "zh": "15% 脆皮巧克力经典雪糕"
    },
    "description": {
      "ru": "Шоколадный сливочный пломбир с какао-маслом в хрустящей шоколадной глазури. Выпускается на палочке (эскимо) и в семейном брикете.",
      "be": "Шакаладны сметанковы пламбір у хрумсткай шакаладнай глазуры на палачцы і ў брыкеце.",
      "en": "Rich cocoa plombir ice cream enrobed in real crisp chocolate glaze, offered as single eskimo bars and 450g family packs.",
      "zh": "浓郁可可奶油冰淇淋外裹酥脆黑巧克力脆皮，提供单支雪糕与450克家庭盒装。"
    },
    "image": ASSETS.productIceCream,
    "fatContent": 15.0,
    "proteinContent": 3.6,
    "lactoseFree": false,
    "exportReady": true,
    "featured": false,
    "visible": true,
    "packages": [
      {
        "id": "icec-75",
        "weight": "75 г (эскимо)",
        "weightGrams": 75,
        "shelfLife": {
          "ru": "12 месяцев",
          "be": "12 месяцаў",
          "en": "12 months",
          "zh": "12个月"
        },
        "storage": {
          "ru": "-18 °C",
          "be": "-18 °C",
          "en": "-18 °C",
          "zh": "-18 °C"
        },
        "packagingType": {
          "ru": "Флоу-пак эскимо на палочке",
          "be": "Флоў-пак эскімо",
          "en": "Eskimo stick flow-pack",
          "zh": "木棒雪糕独立密封袋"
        },
        "unitsPerBox": 30,
        "gtin": "4810268082014"
      },
      {
        "id": "icec-450",
        "weight": "450 г (контейнер)",
        "weightGrams": 450,
        "shelfLife": {
          "ru": "12 месяцев",
          "be": "12 месяцаў",
          "en": "12 months",
          "zh": "12个月"
        },
        "storage": {
          "ru": "-18 °C",
          "be": "-18 °C",
          "en": "-18 °C",
          "zh": "-18 °C"
        },
        "packagingType": {
          "ru": "Пластиковый контейнер 450 г",
          "be": "Пластыкавы кантэйнер 450 г",
          "en": "450g plastic tub",
          "zh": "450克塑料家庭桶"
        },
        "unitsPerBox": 8,
        "gtin": "4810268082021"
      }
    ],
    "characteristics": {
      "iceType": {
        "ru": "Пломбир шоколадный 15%",
        "be": "Пламбір шакаладны 15%",
        "en": "15% chocolate plombir",
        "zh": "15%巧克力经典冰淇淋"
      },
      "flavor": {
        "ru": "Бельгийский какао и тёмный шоколад",
        "be": "Бельгійскі какава і цёмны шакалад",
        "en": "Rich cocoa & dark chocolate",
        "zh": "浓郁可可与黑巧克力"
      }
    },
    "useCases": [
      "dessert",
      "export"
    ],
    "relatedIds": [
      "ice-cream-plombir",
      "curd-mousse-cocoa"
    ],
    "seo": {
      "title": {
        "ru": "Мороженое пломбир шоколадный в глазури 15% (15.0%) — характеристики и фасовка | Молочный Мир",
        "be": "Марозіва пламбір шакаладны ў глазуры 15% (15.0%) — характарыстыкі і фасоўка | Малочны Мір",
        "en": "Chocolate Plombir Eskimo 15% (15.0% Fat) — Specs & Packaging | Molochny Mir",
        "zh": "15% 脆皮巧克力经典雪糕 (15.0% 乳脂) — 规格与包装 | Molochny Mir"
      },
      "description": {
        "ru": "Мороженое пломбир шоколадный в глазури 15%: Шоколадный сливочный пломбир с какао-маслом в хрустящей шоколадной глазури. Выпускается на палочке (эскимо) и в семейном Фасовки: 75 г (эскимо), 450 г (контейнер).",
        "be": "Марозіва пламбір шакаладны ў глазуры 15%: Шакаладны сметанковы пламбір у хрумсткай шакаладнай глазуры на палачцы і ў брыкеце. Фасоўкі: 75 г (эскимо), 450 г (контейнер).",
        "en": "Chocolate Plombir Eskimo 15%: Rich cocoa plombir ice cream enrobed in real crisp chocolate glaze, offered as single eskimo bars and 450g family packs. Formats: 75 г (эскимо), 450 г (контейнер).",
        "zh": "15% 脆皮巧克力经典雪糕：浓郁可可奶油冰淇淋外裹酥脆黑巧克力脆皮，提供单支雪糕与450克家庭盒装。 规格：75 г (эскимо), 450 г (контейнер)。"
      },
      "h1": {
        "ru": "Мороженое пломбир шоколадный в глазури 15%",
        "be": "Марозіва пламбір шакаладны ў глазуры 15%",
        "en": "Chocolate Plombir Eskimo 15%",
        "zh": "15% 脆皮巧克力经典雪糕"
      }
    }
  },
  {
    "id": "cream-33",
    "slug": "cream-33",
    "category": "cream",
    "subcategory": "whipping",
    "name": {
      "ru": "Сливки питьевые для взбивания 33%",
      "be": "Вяршкі пітныя для ўзбівання 33%",
      "en": "UHT Whipping Cream 33%",
      "zh": "33% 超高温灭菌稀奶油（打发专用）"
    },
    "description": {
      "ru": "Ультрапастеризованные натуральные сливки без растительных жиров и стабилизаторов. Быстро взбиваются в устойчивый глянцевый крем для кондитерского производства и кофеен.",
      "be": "Ультрапастэрызаваныя натуральныя вяршкі 33% без раслінных тлушчаў для кандытараў і HoReCa.",
      "en": "Pure 33% UHT dairy whipping cream with zero vegetable fats. Whips to stable peaks for pastry kitchens, bakeries, and specialty coffee shops.",
      "zh": "纯天然动物稀奶油，无植物脂肪添加，打发率高且稳定性极佳，适合高端烘焙及咖啡餐饮。"
    },
    "image": ASSETS.productButterCream,
    "fatContent": 33.0,
    "proteinContent": 2.2,
    "lactoseFree": false,
    "exportReady": true,
    "featured": false,
    "visible": true,
    "packages": [
      {
        "id": "cr-500",
        "weight": "500 мл",
        "weightGrams": 500,
        "shelfLife": {
          "ru": "120 суток",
          "be": "120 сутак",
          "en": "120 days",
          "zh": "120天"
        },
        "storage": {
          "ru": "+2…+25 °C",
          "be": "+2…+25 °C",
          "en": "+2…+25 °C",
          "zh": "+2…+25 °C"
        },
        "packagingType": {
          "ru": "Tetra Brik Aseptic 500 мл",
          "be": "Tetra Brik Aseptic 500 мл",
          "en": "Tetra Brik Aseptic 500ml",
          "zh": "500毫升利乐无菌盒"
        },
        "unitsPerBox": 12,
        "gtin": "4810268091016"
      },
      {
        "id": "cr-1000",
        "weight": "1 л (HoReCa)",
        "weightGrams": 1000,
        "shelfLife": {
          "ru": "120 суток",
          "be": "120 сутак",
          "en": "120 days",
          "zh": "120天"
        },
        "storage": {
          "ru": "+2…+25 °C",
          "be": "+2…+25 °C",
          "en": "+2…+25 °C",
          "zh": "+2…+25 °C"
        },
        "packagingType": {
          "ru": "Tetra Brik Aseptic 1 л",
          "be": "Tetra Brik Aseptic 1 л",
          "en": "Tetra Brik Aseptic 1L",
          "zh": "1升利乐无菌盒"
        },
        "unitsPerBox": 12,
        "gtin": "4810268091023"
      }
    ],
    "characteristics": {
      "purpose": {
        "ru": "Взбивание, ганаш, соусы, бариста",
        "be": "Узбіванне, ганаш, соусы",
        "en": "Whipping, ganache, culinary sauces",
        "zh": "裱花打发、甘纳许、餐饮酱汁"
      },
      "processing": {
        "ru": "Ультрапастеризация (UHT)",
        "be": "Ультрапастэрызацыя (UHT)",
        "en": "UHT aseptic processing",
        "zh": "UHT超高温灭菌"
      }
    },
    "useCases": [
      "baking",
      "horeca",
      "export",
      "coffee"
    ],
    "relatedIds": [
      "cream-10-barista",
      "butter-825",
      "mozzarella-pizza"
    ],
    "seo": {
      "title": {
        "ru": "Сливки питьевые для взбивания 33% (33.0%) — характеристики и фасовка | Молочный Мир",
        "be": "Вяршкі пітныя для ўзбівання 33% (33.0%) — характарыстыкі і фасоўка | Малочны Мір",
        "en": "UHT Whipping Cream 33% (33.0% Fat) — Specs & Packaging | Molochny Mir",
        "zh": "33% 超高温灭菌稀奶油（打发专用） (33.0% 乳脂) — 规格与包装 | Molochny Mir"
      },
      "description": {
        "ru": "Сливки питьевые для взбивания 33%: Ультрапастеризованные натуральные сливки без растительных жиров и стабилизаторов. Быстро взбиваются в устойчивый глянцев Фасовки: 500 мл, 1 л (HoReCa).",
        "be": "Вяршкі пітныя для ўзбівання 33%: Ультрапастэрызаваныя натуральныя вяршкі 33% без раслінных тлушчаў для кандытараў і HoReCa. Фасоўкі: 500 мл, 1 л (HoReCa).",
        "en": "UHT Whipping Cream 33%: Pure 33% UHT dairy whipping cream with zero vegetable fats. Whips to stable peaks for pastry kitchens, bakeries, and spe Formats: 500 мл, 1 л (HoReCa).",
        "zh": "33% 超高温灭菌稀奶油（打发专用）：纯天然动物稀奶油，无植物脂肪添加，打发率高且稳定性极佳，适合高端烘焙及咖啡餐饮。 规格：500 мл, 1 л (HoReCa)。"
      },
      "h1": {
        "ru": "Сливки питьевые для взбивания 33%",
        "be": "Вяршкі пітныя для ўзбівання 33%",
        "en": "UHT Whipping Cream 33%",
        "zh": "33% 超高温灭菌稀奶油（打发专用）"
      }
    }
  },
  {
    "id": "cream-10-barista",
    "slug": "cream-10-barista",
    "category": "cream",
    "subcategory": "whipping",
    "name": {
      "ru": "Сливки питьевые стерилизованные для кофе 10%",
      "be": "Вяршкі пітныя для кавы 10%",
      "en": "Barista Dairy Cream 10% (UHT)",
      "zh": "10% 咖啡调配专用稀奶油"
    },
    "description": {
      "ru": "Стерилизованные натуральные сливки 10% с мягкой сладостью для эспрессо, фильтр-кофе, крем-супов и пасты. Удобный формат для кофеен и офисов.",
      "be": "Натуральныя вяршкі 10% для эспрэса, крэм-супоў і кавярняў у зручнай упакоўцы.",
      "en": "Smooth 10% sterilized dairy cream tailored for coffee bars, espresso, creamy soups, and pasta sauces.",
      "zh": "10%天然稀奶油，口感顺滑柔和，专为浓缩咖啡、浓汤及意式酱汁研发，适合咖啡门店使用。"
    },
    "image": ASSETS.productButterCream,
    "fatContent": 10.0,
    "proteinContent": 2.8,
    "lactoseFree": false,
    "exportReady": true,
    "featured": false,
    "visible": true,
    "packages": [
      {
        "id": "cr10-200",
        "weight": "200 мл",
        "weightGrams": 200,
        "shelfLife": {
          "ru": "150 суток",
          "be": "150 сутак",
          "en": "150 days",
          "zh": "150天"
        },
        "storage": {
          "ru": "+2…+25 °C",
          "be": "+2…+25 °C",
          "en": "+2…+25 °C",
          "zh": "+2…+25 °C"
        },
        "packagingType": {
          "ru": "Tetra Brik Aseptic 200 мл",
          "be": "Tetra Brik Aseptic 200 мл",
          "en": "Tetra Brik 200ml",
          "zh": "200毫升利乐盒"
        },
        "unitsPerBox": 24,
        "gtin": "4810268092013"
      },
      {
        "id": "cr10-500",
        "weight": "500 мл",
        "weightGrams": 500,
        "shelfLife": {
          "ru": "150 суток",
          "be": "150 сутак",
          "en": "150 days",
          "zh": "150天"
        },
        "storage": {
          "ru": "+2…+25 °C",
          "be": "+2…+25 °C",
          "en": "+2…+25 °C",
          "zh": "+2…+25 °C"
        },
        "packagingType": {
          "ru": "Tetra Brik Aseptic 500 мл с крышкой",
          "be": "Tetra Brik Aseptic 500 мл",
          "en": "Tetra Brik 500ml with cap",
          "zh": "500毫升带盖利乐盒"
        },
        "unitsPerBox": 12,
        "gtin": "4810268092020"
      }
    ],
    "characteristics": {
      "purpose": {
        "ru": "Кофе, бариста, кулинарные соусы",
        "be": "Кава, барыста, кулінарныя соусы",
        "en": "Coffee, barista, culinary sauces",
        "zh": "咖啡调配、吧台、烹饪酱汁"
      },
      "processing": {
        "ru": "Стерилизация / UHT",
        "be": "Стэрылізацыя / UHT",
        "en": "Sterilized UHT",
        "zh": "UHT超高温灭菌"
      }
    },
    "useCases": [
      "coffee",
      "horeca",
      "export",
      "daily"
    ],
    "relatedIds": [
      "cream-33",
      "milk-uht-15"
    ],
    "seo": {
      "title": {
        "ru": "Сливки питьевые стерилизованные для кофе 10% (10.0%) — характеристики и фасовка | Молочный Мир",
        "be": "Вяршкі пітныя для кавы 10% (10.0%) — характарыстыкі і фасоўка | Малочны Мір",
        "en": "Barista Dairy Cream 10% (UHT) (10.0% Fat) — Specs & Packaging | Molochny Mir",
        "zh": "10% 咖啡调配专用稀奶油 (10.0% 乳脂) — 规格与包装 | Molochny Mir"
      },
      "description": {
        "ru": "Сливки питьевые стерилизованные для кофе 10%: Стерилизованные натуральные сливки 10% с мягкой сладостью для эспрессо, фильтр-кофе, крем-супов и пасты. Удобный формат  Фасовки: 200 мл, 500 мл.",
        "be": "Вяршкі пітныя для кавы 10%: Натуральныя вяршкі 10% для эспрэса, крэм-супоў і кавярняў у зручнай упакоўцы. Фасоўкі: 200 мл, 500 мл.",
        "en": "Barista Dairy Cream 10% (UHT): Smooth 10% sterilized dairy cream tailored for coffee bars, espresso, creamy soups, and pasta sauces. Formats: 200 мл, 500 мл.",
        "zh": "10% 咖啡调配专用稀奶油：10%天然稀奶油，口感顺滑柔和，专为浓缩咖啡、浓汤及意式酱汁研发，适合咖啡门店使用。 规格：200 мл, 500 мл。"
      },
      "h1": {
        "ru": "Сливки питьевые стерилизованные для кофе 10%",
        "be": "Вяршкі пітныя для кавы 10%",
        "en": "Barista Dairy Cream 10% (UHT)",
        "zh": "10% 咖啡调配专用稀奶油"
      }
    }
  },
  {
    "id": "curd-bar-vanilla",
    "slug": "curd-bar-vanilla",
    "category": "desserts",
    "subcategory": "curd-bars",
    "name": {
      "ru": "Сырок творожный глазированный с ванилью 20%",
      "be": "Сырок тварожны глазураваны з ваніллю 20%",
      "en": "Vanilla Glazed Curd Bar 20%",
      "zh": "香草巧克力涂层凝乳棒 20%"
    },
    "description": {
      "ru": "Классический творожный десерт на основе нежного протёртого творога и сливочного масла, покрытый настоящей тёмной шоколадной глазурью.",
      "be": "Класічны тварожны дэсерт на аснове далікатнага тварагу ў сапраўднай шакаладнай глазуры.",
      "en": "Velvety sweet tvorog dessert coated in real dark chocolate glaze.",
      "zh": "细腻甜味凝乳配以纯正黑巧克力脆皮，带来浓郁的传统白俄罗斯乳品甜点体验。"
    },
    "image": ASSETS.productIceCream,
    "fatContent": 20.0,
    "proteinContent": 8.5,
    "lactoseFree": false,
    "exportReady": true,
    "featured": false,
    "visible": true,
    "packages": [
      {
        "id": "cb-45",
        "weight": "45 г",
        "weightGrams": 45,
        "shelfLife": {
          "ru": "30 суток",
          "be": "30 сутак",
          "en": "30 days",
          "zh": "30天"
        },
        "storage": {
          "ru": "+2…+6 °C",
          "be": "+2…+6 °C",
          "en": "+2…+6 °C",
          "zh": "+2…+6 °C"
        },
        "packagingType": {
          "ru": "Фольгированный флоу-пак",
          "be": "Фальгіраваны флоў-пак",
          "en": "Foil-lined flow-pack",
          "zh": "铝箔密封袋"
        },
        "unitsPerBox": 20,
        "gtin": "4810268101017"
      }
    ],
    "characteristics": {
      "glaze": {
        "ru": "Натуральная тёмная шоколадная глазурь",
        "be": "Натуральная цёмная шакаладная глазура",
        "en": "Real dark chocolate coating",
        "zh": "纯正黑巧克力涂层"
      },
      "flavor": {
        "ru": "Сливочная ваниль",
        "be": "Сметанковая ваніль",
        "en": "Creamy vanilla",
        "zh": "奶油香草"
      }
    },
    "useCases": [
      "dessert",
      "daily"
    ],
    "relatedIds": [
      "curd-mousse-cocoa",
      "ice-cream-plombir"
    ],
    "seo": {
      "title": {
        "ru": "Сырок творожный глазированный с ванилью 20% (20.0%) — характеристики и фасовка | Молочный Мир",
        "be": "Сырок тварожны глазураваны з ваніллю 20% (20.0%) — характарыстыкі і фасоўка | Малочны Мір",
        "en": "Vanilla Glazed Curd Bar 20% (20.0% Fat) — Specs & Packaging | Molochny Mir",
        "zh": "香草巧克力涂层凝乳棒 20% (20.0% 乳脂) — 规格与包装 | Molochny Mir"
      },
      "description": {
        "ru": "Сырок творожный глазированный с ванилью 20%: Классический творожный десерт на основе нежного протёртого творога и сливочного масла, покрытый настоящей тёмной шоколад Фасовки: 45 г.",
        "be": "Сырок тварожны глазураваны з ваніллю 20%: Класічны тварожны дэсерт на аснове далікатнага тварагу ў сапраўднай шакаладнай глазуры. Фасоўкі: 45 г.",
        "en": "Vanilla Glazed Curd Bar 20%: Velvety sweet tvorog dessert coated in real dark chocolate glaze. Formats: 45 г.",
        "zh": "香草巧克力涂层凝乳棒 20%：细腻甜味凝乳配以纯正黑巧克力脆皮，带来浓郁的传统白俄罗斯乳品甜点体验。 规格：45 г。"
      },
      "h1": {
        "ru": "Сырок творожный глазированный с ванилью 20%",
        "be": "Сырок тварожны глазураваны з ваніллю 20%",
        "en": "Vanilla Glazed Curd Bar 20%",
        "zh": "香草巧克力涂层凝乳棒 20%"
      }
    }
  },
  {
    "id": "curd-mousse-cocoa",
    "slug": "curd-mousse-cocoa",
    "category": "desserts",
    "subcategory": "curd-bars",
    "name": {
      "ru": "Десерт творожный взбитый «Сливочный с какао» 5%",
      "be": "Дэсерт тварожны ўзбіты «Сметанковы з какава» 5%",
      "en": "Whipped Cocoa Tvorog Mousse 5%",
      "zh": "轻盈可可打发凝乳慕斯 5%"
    },
    "description": {
      "ru": "Воздушный взбитый творожный мусс с натуральным какао-порошком. Лёгкий молочный десерт с пониженным содержанием жира (5%) и повышенным содержанием белка.",
      "be": "Паветраны ўзбіты тварожны мус з натуральным какава і зніжанай тлустасцю 5%.",
      "en": "Airy whipped dairy tvorog mousse blended with natural cocoa, offering a light 5%-fat treat with 7.2g protein.",
      "zh": "绵密轻盈的打发凝乳可可慕斯，乳脂仅5%却富含7.2克蛋白质，轻负担乳制甜品。"
    },
    "image": ASSETS.productIceCream,
    "fatContent": 5.0,
    "proteinContent": 7.2,
    "lactoseFree": false,
    "exportReady": true,
    "featured": false,
    "visible": true,
    "packages": [
      {
        "id": "cm-130",
        "weight": "130 г",
        "weightGrams": 130,
        "shelfLife": {
          "ru": "21 сутки",
          "be": "21 суткі",
          "en": "21 days",
          "zh": "21天"
        },
        "storage": {
          "ru": "+2…+6 °C",
          "be": "+2…+6 °C",
          "en": "+2…+6 °C",
          "zh": "+2…+6 °C"
        },
        "packagingType": {
          "ru": "Прозрачный стаканчик с платинкой",
          "be": "Празрысты кубачак з плацінкай",
          "en": "Sealed transparent cup",
          "zh": "透明密封杯装"
        },
        "unitsPerBox": 12,
        "gtin": "4810268102014"
      }
    ],
    "characteristics": {
      "glaze": {
        "ru": "Взбитая творожно-сливочная основа",
        "be": "Узбітая тварожна-сметанковая аснова",
        "en": "Aerated tvorog & cream base",
        "zh": "轻盈凝乳鲜奶油基底"
      },
      "flavor": {
        "ru": "Натуральное какао",
        "be": "Натуральнае какава",
        "en": "Natural cocoa",
        "zh": "天然可可风味"
      }
    },
    "useCases": [
      "dessert",
      "daily",
      "low-fat"
    ],
    "relatedIds": [
      "curd-bar-vanilla",
      "greek-yogurt-protein"
    ],
    "seo": {
      "title": {
        "ru": "Десерт творожный взбитый «Сливочный с какао» 5% (5.0%) — характеристики и фасовка | Молочный Мир",
        "be": "Дэсерт тварожны ўзбіты «Сметанковы з какава» 5% (5.0%) — характарыстыкі і фасоўка | Малочны Мір",
        "en": "Whipped Cocoa Tvorog Mousse 5% (5.0% Fat) — Specs & Packaging | Molochny Mir",
        "zh": "轻盈可可打发凝乳慕斯 5% (5.0% 乳脂) — 规格与包装 | Molochny Mir"
      },
      "description": {
        "ru": "Десерт творожный взбитый «Сливочный с какао» 5%: Воздушный взбитый творожный мусс с натуральным какао-порошком. Лёгкий молочный десерт с пониженным содержанием жира (5%) Фасовки: 130 г.",
        "be": "Дэсерт тварожны ўзбіты «Сметанковы з какава» 5%: Паветраны ўзбіты тварожны мус з натуральным какава і зніжанай тлустасцю 5%. Фасоўкі: 130 г.",
        "en": "Whipped Cocoa Tvorog Mousse 5%: Airy whipped dairy tvorog mousse blended with natural cocoa, offering a light 5%-fat treat with 7.2g protein. Formats: 130 г.",
        "zh": "轻盈可可打发凝乳慕斯 5%：绵密轻盈的打发凝乳可可慕斯，乳脂仅5%却富含7.2克蛋白质，轻负担乳制甜品。 规格：130 г。"
      },
      "h1": {
        "ru": "Десерт творожный взбитый «Сливочный с какао» 5%",
        "be": "Дэсерт тварожны ўзбіты «Сметанковы з какава» 5%",
        "en": "Whipped Cocoa Tvorog Mousse 5%",
        "zh": "轻盈可可打发凝乳慕斯 5%"
      }
    }
  },
  {
    "id": "skim-milk-powder-b2b",
    "slug": "skim-milk-powder-b2b",
    "category": "dry-dairy",
    "subcategory": "smp",
    "name": {
      "ru": "Молоко сухое обезжиренное (СОМ) экспортное",
      "be": "Малако сухое абястлушчанае (САМ) экспартнае",
      "en": "Skimmed Milk Powder (SMP) Export Grade",
      "zh": "出口级脱脂奶粉 (SMP) 工业原料"
    },
    "description": {
      "ru": "Распылительной сушки, категория Medium Heat / Low Heat. Высокая растворимость, содержание белка не менее 34%. Поставляется в 4-слойных крафт-мешках с полиэтиленовым вкладышем для международного экспорта.",
      "be": "Распыляльнай сушкі, утрыманне бялку не менш за 34%. Пастаўляецца ў крафт-мяшках па 25 кг для міжнароднага экспарту.",
      "en": "Spray-dried Skimmed Milk Powder (Medium/Low Heat) with >=34% dairy protein. Packed in 25 kg multi-wall kraft bags for international food manufacturing and B2B export.",
      "zh": "喷雾干燥工艺脱脂奶粉（中热/低热型），乳蛋白含量 ≥34%，25公斤多层牛皮纸袋包装，符合国际食品工业及出口质量标准。"
    },
    "image": ASSETS.newsDairyFacility,
    "fatContent": 1.5,
    "proteinContent": 34.0,
    "lactoseFree": false,
    "exportReady": true,
    "featured": false,
    "visible": true,
    "packages": [
      {
        "id": "smp-25000",
        "weight": "25 кг (Крафт-мешок B2B)",
        "weightGrams": 25000,
        "shelfLife": {
          "ru": "24 месяца",
          "be": "24 месяцы",
          "en": "24 months",
          "zh": "24个月"
        },
        "storage": {
          "ru": "0…+20 °C (влажность ≤ 75%)",
          "be": "0…+20 °C (влажность ≤ 75%)",
          "en": "0…+20 °C (влажность ≤ 75%)",
          "zh": "0…+20 °C (влажность ≤ 75%)"
        },
        "packagingType": {
          "ru": "4-слойный бумажный мешок с ПЭ-вкладышем",
          "be": "4-слойны папяровы мяшок з ПЭ-ўкладышам",
          "en": "25kg 4-ply kraft bag with PE liner",
          "zh": "25公斤四层牛皮纸袋内衬PE膜"
        },
        "unitsPerBox": 1,
        "gtin": "4810268111016"
      }
    ],
    "characteristics": {
      "grade": {
        "ru": "ГОСТ 33629-2015 / ADPI Extra Grade",
        "be": "ДАСТ 33629-2015 / Extra Grade",
        "en": "ADPI Extra Grade / GOST 33629",
        "zh": "ADPI 特级 / GOST 33629"
      },
      "moisture": {
        "ru": "Не более 4,0%",
        "be": "Не больш за 4,0%",
        "en": "Max 4.0%",
        "zh": "≤ 4.0%"
      },
      "certifications": {
        "ru": "FSSC 22000, ISO 9001, Китай (GACC)",
        "be": "FSSC 22000, ISO 9001, GACC",
        "en": "FSSC 22000, ISO 9001, China GACC",
        "zh": "FSSC 22000, ISO 9001, 中国海关GACC注册"
      }
    },
    "useCases": [
      "export",
      "b2b",
      "high-protein"
    ],
    "relatedIds": [
      "whole-milk-powder-26",
      "butter-825"
    ],
    "seo": {
      "title": {
        "ru": "Молоко сухое обезжиренное (СОМ) экспортное (1.5%) — характеристики и фасовка | Молочный Мир",
        "be": "Малако сухое абястлушчанае (САМ) экспартнае (1.5%) — характарыстыкі і фасоўка | Малочны Мір",
        "en": "Skimmed Milk Powder (SMP) Export Grade (1.5% Fat) — Specs & Packaging | Molochny Mir",
        "zh": "出口级脱脂奶粉 (SMP) 工业原料 (1.5% 乳脂) — 规格与包装 | Molochny Mir"
      },
      "description": {
        "ru": "Молоко сухое обезжиренное (СОМ) экспортное: Распылительной сушки, категория Medium Heat / Low Heat. Высокая растворимость, содержание белка не менее 34%. Поставляет Фасовки: 25 кг (Крафт-мешок B2B).",
        "be": "Малако сухое абястлушчанае (САМ) экспартнае: Распыляльнай сушкі, утрыманне бялку не менш за 34%. Пастаўляецца ў крафт-мяшках па 25 кг для міжнароднага экспарту. Фасоўкі: 25 кг (Крафт-мешок B2B).",
        "en": "Skimmed Milk Powder (SMP) Export Grade: Spray-dried Skimmed Milk Powder (Medium/Low Heat) with >=34% dairy protein. Packed in 25 kg multi-wall kraft bags for in Formats: 25 кг (Крафт-мешок B2B).",
        "zh": "出口级脱脂奶粉 (SMP) 工业原料：喷雾干燥工艺脱脂奶粉（中热/低热型），乳蛋白含量 ≥34%，25公斤多层牛皮纸袋包装，符合国际食品工业及出口质量标准。 规格：25 кг (Крафт-мешок B2B)。"
      },
      "h1": {
        "ru": "Молоко сухое обезжиренное (СОМ) экспортное",
        "be": "Малако сухое абястлушчанае (САМ) экспартнае",
        "en": "Skimmed Milk Powder (SMP) Export Grade",
        "zh": "出口级脱脂奶粉 (SMP) 工业原料"
      }
    }
  },
  {
    "id": "whole-milk-powder-26",
    "slug": "whole-milk-powder-26",
    "category": "dry-dairy",
    "subcategory": "smp",
    "name": {
      "ru": "Молоко сухое цельное (СЦМ) 26% экспортное",
      "be": "Малако сухое цэльнае (СЦМ) 26% экспартнае",
      "en": "Whole Milk Powder (WMP) 26% Export Grade",
      "zh": "出口级全脂奶粉 (WMP 26%) 工业原料"
    },
    "description": {
      "ru": "Натуральное цельное сухое молоко жирностью 26% для кондитерских фабрик, шоколадного производства, хлебопечения и экспортных контрактов.",
      "be": "Натуральнае цэльнае сухое малако 26% для кандытарскіх фабрык і экспарту.",
      "en": "Instant-soluble spray-dried Whole Milk Powder (26% fat, 25% protein) tailored for confectionery, chocolate manufacturing, and export.",
      "zh": "26%乳脂含量喷雾干燥全脂奶粉，溶解迅速、乳香浓郁，适用于巧克力制作、烘焙食品及出口供应。"
    },
    "image": ASSETS.newsDairyFacility,
    "fatContent": 26.0,
    "proteinContent": 25.0,
    "lactoseFree": false,
    "exportReady": true,
    "featured": false,
    "visible": true,
    "packages": [
      {
        "id": "wmp-25000",
        "weight": "25 кг (Крафт-мешок B2B)",
        "weightGrams": 25000,
        "shelfLife": {
          "ru": "18 месяцев",
          "be": "18 месяцаў",
          "en": "18 months",
          "zh": "18个月"
        },
        "storage": {
          "ru": "0…+20 °C (влажность ≤ 75%)",
          "be": "0…+20 °C (влажность ≤ 75%)",
          "en": "0…+20 °C (влажность ≤ 75%)",
          "zh": "0…+20 °C (влажность ≤ 75%)"
        },
        "packagingType": {
          "ru": "4-слойный бумажный мешок с ПЭ-вкладышем",
          "be": "4-слойны папяровы мяшок з ПЭ-ўкладышам",
          "en": "25kg 4-ply kraft bag with PE liner",
          "zh": "25公斤四层牛皮纸袋内衬PE膜"
        },
        "unitsPerBox": 1,
        "gtin": "4810268112013"
      }
    ],
    "characteristics": {
      "grade": {
        "ru": "ГОСТ 33629-2015 / Экспортный стандарт",
        "be": "ДАСТ 33629-2015 / Экспартны стандарт",
        "en": "GOST 33629 / Export Grade",
        "zh": "GOST 33629 出口标准"
      },
      "moisture": {
        "ru": "Не более 4,0%",
        "be": "Не больш за 4,0%",
        "en": "Max 4.0%",
        "zh": "≤ 4.0%"
      },
      "certifications": {
        "ru": "FSSC 22000, ISO 9001, GACC",
        "be": "FSSC 22000, ISO 9001, GACC",
        "en": "FSSC 22000, ISO 9001, China GACC",
        "zh": "FSSC 22000, ISO 9001, 中国GACC"
      }
    },
    "useCases": [
      "export",
      "b2b",
      "baking",
      "high-protein"
    ],
    "relatedIds": [
      "skim-milk-powder-b2b",
      "butter-825"
    ],
    "seo": {
      "title": {
        "ru": "Молоко сухое цельное (СЦМ) 26% экспортное (26.0%) — характеристики и фасовка | Молочный Мир",
        "be": "Малако сухое цэльнае (СЦМ) 26% экспартнае (26.0%) — характарыстыкі і фасоўка | Малочны Мір",
        "en": "Whole Milk Powder (WMP) 26% Export Grade (26.0% Fat) — Specs & Packaging | Molochny Mir",
        "zh": "出口级全脂奶粉 (WMP 26%) 工业原料 (26.0% 乳脂) — 规格与包装 | Molochny Mir"
      },
      "description": {
        "ru": "Молоко сухое цельное (СЦМ) 26% экспортное: Натуральное цельное сухое молоко жирностью 26% для кондитерских фабрик, шоколадного производства, хлебопечения и экспорт Фасовки: 25 кг (Крафт-мешок B2B).",
        "be": "Малако сухое цэльнае (СЦМ) 26% экспартнае: Натуральнае цэльнае сухое малако 26% для кандытарскіх фабрык і экспарту. Фасоўкі: 25 кг (Крафт-мешок B2B).",
        "en": "Whole Milk Powder (WMP) 26% Export Grade: Instant-soluble spray-dried Whole Milk Powder (26% fat, 25% protein) tailored for confectionery, chocolate manufacturing Formats: 25 кг (Крафт-мешок B2B).",
        "zh": "出口级全脂奶粉 (WMP 26%) 工业原料：26%乳脂含量喷雾干燥全脂奶粉，溶解迅速、乳香浓郁，适用于巧克力制作、烘焙食品及出口供应。 规格：25 кг (Крафт-мешок B2B)。"
      },
      "h1": {
        "ru": "Молоко сухое цельное (СЦМ) 26% экспортное",
        "be": "Малако сухое цэльнае (СЦМ) 26% экспартнае",
        "en": "Whole Milk Powder (WMP) 26% Export Grade",
        "zh": "出口级全脂奶粉 (WMP 26%) 工业原料"
      }
    }
  },
  {
    "id": "whey-mango-drink",
    "slug": "whey-mango-drink",
    "category": "other",
    "subcategory": "whey-drinks",
    "name": {
      "ru": "Напиток сывороточный «Active» с соком манго",
      "be": "Напой сыроватачны «Active» з сокам манга",
      "en": "Active Whey Fruit Drink (Mango)",
      "zh": "Active 芒果味乳清果汁饮品"
    },
    "description": {
      "ru": "Освежающий напиток на основе натуральной молочной сыворотки и концентрированного сока манго. Источник витаминов и лёгких аминокислот.",
      "be": "Асвяжальны напой на аснове натуральнай малочнай сыроваткі і соку манга.",
      "en": "Refreshing beverage crafted from natural dairy whey and mango juice concentrate.",
      "zh": "采用天然乳清与浓缩芒果汁调制的清爽饮品，富含维生素与乳清氨基酸。"
    },
    "image": ASSETS.productMilkKefir,
    "fatContent": 0.1,
    "proteinContent": 0.6,
    "lactoseFree": false,
    "exportReady": true,
    "featured": false,
    "visible": true,
    "packages": [
      {
        "id": "whey-930",
        "weight": "930 г",
        "weightGrams": 930,
        "shelfLife": {
          "ru": "30 суток",
          "be": "30 сутак",
          "en": "30 days",
          "zh": "30天"
        },
        "storage": {
          "ru": "+2…+6 °C",
          "be": "+2…+6 °C",
          "en": "+2…+6 °C",
          "zh": "+2…+6 °C"
        },
        "packagingType": {
          "ru": "ПЭТ-бутылка",
          "be": "ПЭТ-бутэлька",
          "en": "PET bottle",
          "zh": "PET瓶装"
        },
        "unitsPerBox": 12,
        "gtin": "4810268121015"
      }
    ],
    "characteristics": {
      "base": {
        "ru": "Осветлённая молочная сыворотка",
        "be": "Асветленая малочная сыроватка",
        "en": "Clarified dairy whey",
        "zh": "澄清乳清"
      },
      "flavor": {
        "ru": "Манго — маракуйя",
        "be": "Манга — маракуя",
        "en": "Mango & passionfruit",
        "zh": "芒果百香果"
      }
    },
    "useCases": [
      "daily",
      "fitness",
      "export",
      "low-fat"
    ],
    "relatedIds": [
      "kefir-classic",
      "condensed-milk-85"
    ],
    "seo": {
      "title": {
        "ru": "Напиток сывороточный «Active» с соком манго (0.1%) — характеристики и фасовка | Молочный Мир",
        "be": "Напой сыроватачны «Active» з сокам манга (0.1%) — характарыстыкі і фасоўка | Малочны Мір",
        "en": "Active Whey Fruit Drink (Mango) (0.1% Fat) — Specs & Packaging | Molochny Mir",
        "zh": "Active 芒果味乳清果汁饮品 (0.1% 乳脂) — 规格与包装 | Molochny Mir"
      },
      "description": {
        "ru": "Напиток сывороточный «Active» с соком манго: Освежающий напиток на основе натуральной молочной сыворотки и концентрированного сока манго. Источник витаминов и лёгких Фасовки: 930 г.",
        "be": "Напой сыроватачны «Active» з сокам манга: Асвяжальны напой на аснове натуральнай малочнай сыроваткі і соку манга. Фасоўкі: 930 г.",
        "en": "Active Whey Fruit Drink (Mango): Refreshing beverage crafted from natural dairy whey and mango juice concentrate. Formats: 930 г.",
        "zh": "Active 芒果味乳清果汁饮品：采用天然乳清与浓缩芒果汁调制的清爽饮品，富含维生素与乳清氨基酸。 规格：930 г。"
      },
      "h1": {
        "ru": "Напиток сывороточный «Active» с соком манго",
        "be": "Напой сыроватачны «Active» з сокам манга",
        "en": "Active Whey Fruit Drink (Mango)",
        "zh": "Active 芒果味乳清果汁饮品"
      }
    }
  },
  {
    "id": "condensed-milk-85",
    "slug": "condensed-milk-85",
    "category": "other",
    "subcategory": "condensed",
    "name": {
      "ru": "Молоко цельное сгущённое с сахаром 8,5%",
      "be": "Малако цэльнае згушчанае з цукрам 8,5%",
      "en": "Sweetened Condensed Whole Milk 8.5%",
      "zh": "8.5% 经典全脂加糖炼乳"
    },
    "description": {
      "ru": "Традиционное сгущённое молоко из цельного коровьего молока и свекловичного сахара без растительных жиров. Выпускается в жестяных банках 380 г и HoReCa-формате 3,8 кг.",
      "be": "Традыцыйнае згушчанае малако з цэльнага малака і цукру без раслінных тлушчаў.",
      "en": "Traditional Belarusian sweetened condensed whole milk crafted without vegetable fats in 380g cans and 3.8kg bakery pails.",
      "zh": "纯正鲜牛奶与甜菜糖浓缩而成的经典全脂甜炼乳，无植物脂肪添加，提供380克罐装及3.8公斤烘焙商用装。"
    },
    "image": ASSETS.productButterCream,
    "fatContent": 8.5,
    "proteinContent": 7.2,
    "lactoseFree": false,
    "exportReady": true,
    "featured": false,
    "visible": true,
    "packages": [
      {
        "id": "cm-380",
        "weight": "380 г (жестяная банка)",
        "weightGrams": 380,
        "shelfLife": {
          "ru": "12 месяцев",
          "be": "12 месяцаў",
          "en": "12 months",
          "zh": "12个月"
        },
        "storage": {
          "ru": "0…+10 °C",
          "be": "0…+10 °C",
          "en": "0…+10 °C",
          "zh": "0…+10 °C"
        },
        "packagingType": {
          "ru": "Жестяная банка с ключом easy-open",
          "be": "Бляшаная банка easy-open",
          "en": "Easy-open tin can 380g",
          "zh": "380克易拉铁罐"
        },
        "unitsPerBox": 24,
        "gtin": "4810268122012"
      },
      {
        "id": "cm-3800",
        "weight": "3.8 кг (HoReCa)",
        "weightGrams": 3800,
        "shelfLife": {
          "ru": "12 месяцев",
          "be": "12 месяцаў",
          "en": "12 months",
          "zh": "12个月"
        },
        "storage": {
          "ru": "0…+10 °C",
          "be": "0…+10 °C",
          "en": "0…+10 °C",
          "zh": "0…+10 °C"
        },
        "packagingType": {
          "ru": "Пластиковое ведро HoReCa",
          "be": "Пластыкавае вядро HoReCa",
          "en": "3.8kg bakery pail",
          "zh": "3.8公斤烘焙桶装"
        },
        "unitsPerBox": 2,
        "gtin": "4810268122029"
      }
    ],
    "characteristics": {
      "base": {
        "ru": "Цельное коровье молоко + сахар (ГОСТ 31688)",
        "be": "Цэльнае малако + цукар (ДАСТ 31688)",
        "en": "Whole cow milk + sucrose (GOST 31688)",
        "zh": "全脂生牛乳 + 白砂糖"
      },
      "flavor": {
        "ru": "Классическая сливочно-молочная сладость",
        "be": "Класічны сметанкова-малочны густ",
        "en": "Classic sweet creamy taste",
        "zh": "经典浓醇甜奶香"
      }
    },
    "useCases": [
      "baking",
      "dessert",
      "export",
      "horeca"
    ],
    "relatedIds": [
      "cream-33",
      "butter-825"
    ],
    "seo": {
      "title": {
        "ru": "Молоко цельное сгущённое с сахаром 8,5% (8.5%) — характеристики и фасовка | Молочный Мир",
        "be": "Малако цэльнае згушчанае з цукрам 8,5% (8.5%) — характарыстыкі і фасоўка | Малочны Мір",
        "en": "Sweetened Condensed Whole Milk 8.5% (8.5% Fat) — Specs & Packaging | Molochny Mir",
        "zh": "8.5% 经典全脂加糖炼乳 (8.5% 乳脂) — 规格与包装 | Molochny Mir"
      },
      "description": {
        "ru": "Молоко цельное сгущённое с сахаром 8,5%: Традиционное сгущённое молоко из цельного коровьего молока и свекловичного сахара без растительных жиров. Выпускается в  Фасовки: 380 г (жестяная банка), 3.8 кг (HoReCa).",
        "be": "Малако цэльнае згушчанае з цукрам 8,5%: Традыцыйнае згушчанае малако з цэльнага малака і цукру без раслінных тлушчаў. Фасоўкі: 380 г (жестяная банка), 3.8 кг (HoReCa).",
        "en": "Sweetened Condensed Whole Milk 8.5%: Traditional Belarusian sweetened condensed whole milk crafted without vegetable fats in 380g cans and 3.8kg bakery pails Formats: 380 г (жестяная банка), 3.8 кг (HoReCa).",
        "zh": "8.5% 经典全脂加糖炼乳：纯正鲜牛奶与甜菜糖浓缩而成的经典全脂甜炼乳，无植物脂肪添加，提供380克罐装及3.8公斤烘焙商用装。 规格：380 г (жестяная банка), 3.8 кг (HoReCa)。"
      },
      "h1": {
        "ru": "Молоко цельное сгущённое с сахаром 8,5%",
        "be": "Малако цэльнае згушчанае з цукрам 8,5%",
        "en": "Sweetened Condensed Whole Milk 8.5%",
        "zh": "8.5% 经典全脂加糖炼乳"
      }
    }
  }
];

export const legacyRedirects: RedirectRule[] = [
  {
    "from": "/catalog/syry/motsarella-45.html",
    "to": "/ru/product/mozzarella",
    "code": 301,
    "note": "Legacy PHP/HTML Mozzarella product page"
  },
  {
    "from": "/catalog/syry/motsarella-pizza.html",
    "to": "/ru/product/mozzarella-pizza",
    "code": 301,
    "note": "HoReCa pizza mozzarella legacy URL"
  },
  {
    "from": "/catalog/syry/goroden-50.html",
    "to": "/ru/product/goroden-aged",
    "code": 301,
    "note": "Aged cheese Goroden legacy URL"
  },
  {
    "from": "/catalog/syry/bellavista.html",
    "to": "/ru/product/brie-bellavista",
    "code": 301,
    "note": "Soft white-mold cheese legacy URL"
  },
  {
    "from": "/catalog/syry/suluguni.html",
    "to": "/ru/product/suluguni-grodno",
    "code": 301,
    "note": "Suluguni legacy URL"
  },
  {
    "from": "/products/moloko-bezlaktoznoe",
    "to": "/ru/product/milk-lactose-free",
    "code": 301,
    "note": "Unified lactose-free milk path"
  },
  {
    "from": "/catalog/moloko/moloko-32.html",
    "to": "/ru/product/milk-classic",
    "code": 301,
    "note": "Classic whole milk legacy HTML"
  },
  {
    "from": "/catalog/moloko/uht-15.html",
    "to": "/ru/product/milk-uht-15",
    "code": 301,
    "note": "UHT 1.5% milk legacy URL"
  },
  {
    "from": "/catalog/kislomolochnye/kefir-25.html",
    "to": "/ru/product/kefir-classic",
    "code": 301,
    "note": "Classic kefir legacy URL"
  },
  {
    "from": "/catalog/yogurty/active-life-greek.html",
    "to": "/ru/product/greek-yogurt-protein",
    "code": 301,
    "note": "High-protein Greek yogurt legacy URL"
  },
  {
    "from": "/catalog/maslo/maslo-825.html",
    "to": "/ru/product/butter-825",
    "code": 301,
    "note": "Butter 82.5% legacy URL"
  },
  {
    "from": "/catalog/suhie/som-export.html",
    "to": "/ru/product/skim-milk-powder-b2b",
    "code": 301,
    "note": "SMP export legacy URL"
  },
  {
    "from": "/catalog/syry/",
    "to": "/ru/catalog/cheese",
    "code": 301,
    "note": "Cheese category normalization"
  },
  {
    "from": "/catalog/moloko/",
    "to": "/ru/catalog/milk",
    "code": 301,
    "note": "Milk category normalization"
  },
  {
    "from": "/catalog/yogurty/",
    "to": "/ru/catalog/yogurt",
    "code": 301,
    "note": "Yogurt category normalization"
  },
  {
    "from": "/catalog/maslo/",
    "to": "/ru/catalog/butter",
    "code": 301,
    "note": "Butter category normalization"
  },
  {
    "from": "/catalog/morozhenoe/",
    "to": "/ru/catalog/ice-cream",
    "code": 301,
    "note": "Ice cream category normalization"
  },
  {
    "from": "/export-info.php",
    "to": "/ru/export",
    "code": 301,
    "note": "Legacy PHP export page"
  },
  {
    "from": "/en/export-portal.html",
    "to": "/en/export",
    "code": 301,
    "note": "English export legacy URL"
  },
  {
    "from": "/novosti/",
    "to": "/ru/news",
    "code": 301,
    "note": "News archive root normalization"
  },
  {
    "from": "/novosti/eksport-kitay-2026.html",
    "to": "/ru/news/cheese-export-china-2026",
    "code": 301,
    "note": "China export news legacy URL"
  },
  {
    "from": "/partneram/",
    "to": "/ru/partners",
    "code": 301,
    "note": "B2B partner portal route"
  },
  {
    "from": "/o-kompanii.php",
    "to": "/ru/about",
    "code": 301,
    "note": "Legacy company profile PHP page"
  },
  {
    "from": "/kontakty.php",
    "to": "/ru/contacts",
    "code": 301,
    "note": "Legacy contacts PHP page"
  }
];
