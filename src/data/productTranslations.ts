import { Language } from '../types';

export type LocalizedProductCopy = { name: string; description: string };
export const productTranslations: Record<
  string,
  Partial<Record<Exclude<Language, 'ru'>, LocalizedProductCopy>>
> = {
  "syr-gubert": {
    "be": {
      "name": "Сыр \"ГуберТ\"",
      "description": "Галоўная навінка X Сырнага Фестывалю - сыр «ГуберТ». Выраз павагі да традыцый і горада Гродна, на гербе якога намаляваны алень Святога Губерта. На паспяванне ідзе 4 месяцы, дзякуючы чаму сыр набывае пікантны смак і далікатную тэкстуру."
    },
    "en": {
      "name": "Cheese \"GuberT\"",
      "description": "The main novelty of the X Cheese Festival is “GuberT” cheese. An expression of respect for traditions and the city of Grodno, whose coat of arms depicts the deer of St. Hubert. It takes 4 months to mature, thanks to which the cheese acquires a piquant taste and delicate texture."
    },
    "zh": {
      "name": "奶酪“GuberT”",
      "description": "X奶酪节的主要新奇产品是“GuberT”奶酪。表达了对传统和格罗德诺市的尊重，格罗德诺市的徽章描绘了圣休伯特的鹿。成熟需要 4 个月的时间，因此奶酪具有辛辣的味道和细腻的质地。"
    }
  },
  "syr-grodnenskaya-vezha": {
    "be": {
      "name": "Сыр \"Гродзенская Вежа\"",
      "description": "Сыр “Гродзенская Вежа” тлустасцю 55% спее шэсць месяцаў, мае багатую тэкстуру і літаральна растае ў роце. Названы ў гонар гістарычнай пажарнай каланчы Гродна 1902 года."
    },
    "en": {
      "name": "Cheese \"Grodno Vezha\"",
      "description": "Cheese “Grodnenskaya Vezha” with a fat content of 55% matures for six months, has a rich texture and literally melts in your mouth. Named after the historical fire tower of Grodno in 1902."
    },
    "zh": {
      "name": "奶酪“格罗德诺维扎”",
      "description": "脂肪含量为 55% 的奶酪“Grodnenskaya Vezha”经过六个月的成熟，质地丰富，入口即化。以 1902 年历史悠久的格罗德诺消防塔命名。"
    }
  },
  "syr-prezidentskiy": {
    "be": {
      "name": "Сыр \"Прэзідэнцкі\"",
      "description": "Вытрыманы сыр 12-месячнага паспявання. Па сваёй якая крышыцца крышталічнай тэкстуры і доўгім послевкусію нагадвае спелы Пармезан."
    },
    "en": {
      "name": "Cheese \"Presidential\"",
      "description": "Aged cheese 12 months ripened. Its crumbly crystalline texture and long aftertaste are reminiscent of mature Parmesan."
    },
    "zh": {
      "name": "奶酪“总统”",
      "description": "陈年奶酪 12 个月成熟。其易碎的结晶质地和悠长的余味让人想起成熟的帕尔马干酪。"
    }
  },
  "syr-krones-s-medom-i-myatoy": {
    "be": {
      "name": "Сыр «Кронес» з мёдам і мятай",
      "description": "Далікатная пластычная тэкстура паўцвёрдага сыра дапоўнена саладосцю натуральнага мёда і асвяжальнай ноткай мяты. Створаны для сырнай талеркі і святочнага стала."
    },
    "en": {
      "name": "Krones cheese with honey and mint",
      "description": "The delicate plastic texture of semi-hard cheese is complemented by the sweetness of natural honey and a refreshing note of mint. Created for a cheese plate and a holiday table."
    },
    "zh": {
      "name": "克朗斯奶酪加蜂蜜和薄荷",
      "description": "半硬质奶酪细腻的塑料质感与天然蜂蜜的甜味和清爽的薄荷味相得益彰。专为奶酪盘和节日餐桌而设计。"
    }
  },
  "syr-legkiy": {
    "be": {
      "name": "Сыр \"ЛЁГКІ\"",
      "description": "Змяшчае ўсяго 20% тлушчу і 29 г бялку на 100 г прадукта - ідэальны выбар для тых, хто сочыць за харчаваннем. Падыходзіць для сэндвічаў, салат і карысных перакусаў."
    },
    "en": {
      "name": "Light Cheese",
      "description": "Contains only 20% fat and 29 g of protein per 100 g of product - an ideal choice for those watching their diet. Suitable for sandwiches, salads and healthy snacks."
    },
    "zh": {
      "name": "低脂奶酪",
      "description": "每 100 克产品仅含有 20% 脂肪和 29 克蛋白质 - 对于那些注意饮食的人来说是理想的选择。适用于三明治、沙拉和健康零食。"
    }
  },
  "syr-gauda-premium": {
    "be": {
      "name": "Сыр \"Гаўда прэміум\"",
      "description": "Паўцвёрды сычужны сыр, выраблены па класічнай тэхналогіі. Мае выяўлены сырны густ і малюнак з глазков вуглаватай і шчылінападобнай формы."
    },
    "en": {
      "name": "Cheese \"Gouda premium\"",
      "description": "Semi-hard rennet cheese made using classical technology. It has a pronounced cheese taste and a pattern of angular and slit-shaped eyes."
    },
    "zh": {
      "name": "奶酪“优质豪达”",
      "description": "采用经典技术制成的半硬凝乳酶奶酪。它具有明显的奶酪味道和棱角分​​明、狭缝状的眼睛图案。"
    }
  },
  "syr-parmezan-9-mes": {
    "be": {
      "name": "Сыр Пармезан 9 мес",
      "description": "Натуральны цвёрды сыр з працяглым тэрмінам паспявання 9 месяцаў. Ідэальна падыходзіць для піцы, супаў, пасты і салат."
    },
    "en": {
      "name": "Parmesan cheese 9 months",
      "description": "Natural hard cheese with a long ripening period of 9 months. Ideal for pizza, soups, pasta and salads."
    },
    "zh": {
      "name": "帕尔马干酪 9个月",
      "description": "天然硬质奶酪，成熟期长达 9 个月。非常适合披萨、汤、意大利面和沙拉。"
    }
  },
  "syr-parmezan-12-mes": {
    "be": {
      "name": "Сыр Пармезан 12 мес",
      "description": "Натуральны цвёрды сыр з працяглым тэрмінам паспявання 12 месяцаў. Насычаны сырны водар і чысты пікантны смак для пасты, піцы, супаў і сырных талерак."
    },
    "en": {
      "name": "Parmesan cheese 12 months",
      "description": "Natural hard cheese with a long ripening period of 12 months. Rich, cheesy flavor and clean, savory flavor for pasta, pizza, soups and cheese boards."
    },
    "zh": {
      "name": "帕尔马干酪 12 个月",
      "description": "天然硬质奶酪，成熟期长达12个月。浓郁的奶酪风味和干净的咸味，适用于面食、披萨、汤和奶酪板。"
    }
  },
  "syr-goroden-s-pazhitnikom": {
    "be": {
      "name": "Сыр \"Гарадзен\" з пажытнікам",
      "description": "Далікатны, з малочным густам і лёгкай салодкай ноткай сыр, які расчыняецца цёплым арэхавым водарам насення пажытніка."
    },
    "en": {
      "name": "Cheese \"Goroden\" with fenugreek",
      "description": "Delicate cheese with a milky taste and a slight sweet note, revealing the warm, nutty aroma of fenugreek seeds."
    },
    "zh": {
      "name": "奶酪“Goroden”配胡芦巴",
      "description": "细腻的奶酪，带有奶味和轻微的甜味，散发出胡芦巴种子温暖的坚果香气。"
    }
  },
  "syr-bezlaktoznyy-active-life": {
    "be": {
      "name": "Сыр безлактозны Active Life",
      "description": "Распрацаваны сумесна з Інстытутам мяса-малочнай прамысловасці. Безлактозны сыр - вынік ферментацыі без дабавак. Падыходзіць нават пры высокай ступені лактазнай недастатковасці."
    },
    "en": {
      "name": "Lactose-free cheese Active Life",
      "description": "Developed jointly with the Institute of Meat and Dairy Industry. Lactose-free cheese is the result of fermentation without additives. Suitable even for high degrees of lactase deficiency."
    },
    "zh": {
      "name": "无乳糖奶酪 Active Life",
      "description": "与肉类和乳制品工业研究所联合开发。无乳糖奶酪是在不添加任何添加剂的情况下发酵的结果。即使是高度乳糖酶缺乏症也适用。"
    }
  },
  "syr-goroden-s-tykvennymi-semechkami": {
    "be": {
      "name": "Сыр «Гарадэн» з гарбузовымі семечкамі.",
      "description": "Навінка XI Сырнага Фестывалю! Спалучэнне далікатнага малочнага густу і насычанага арэхавага водару хрумсткіх гарбузовых семечак."
    },
    "en": {
      "name": "Cheese \"Goroden\" with pumpkin seeds",
      "description": "New from the XI Cheese Festival! A combination of delicate milky taste and rich nutty aroma of crunchy pumpkin seeds."
    },
    "zh": {
      "name": "南瓜籽“Goroden”奶酪",
      "description": "XI奶酪节新品！细腻的奶味和松脆南瓜子的浓郁坚果香气的结合。"
    }
  },
  "syr-goroden-s-klyukvoy": {
    "be": {
      "name": "Сыр \"Гарадзен\" з журавінамі",
      "description": "Сыр, дзе далікатная сметанковая аснова гарманічна спалучаецца з яркай асвяжальнай кіслінкай натуральных журавін."
    },
    "en": {
      "name": "Cheese \"Goroden\" with cranberries",
      "description": "A cheese where a delicate creamy base is harmoniously combined with the bright, refreshing sourness of natural cranberries."
    },
    "zh": {
      "name": "奶酪“Goroden”配蔓越莓",
      "description": "一种奶酪，细腻的奶油底与天然蔓越莓的明亮、清爽的酸味和谐地结合在一起。"
    }
  },
  "syr-krones-s-chernym-tryufelem": {
    "be": {
      "name": "Сыр Кронэс з чорным труфелем",
      "description": "Унікальнае спалучэнне паўцвёрдага сыра з інтэнсіўным густам і тонкім водарам італьянскага чорнага труфеля. Рэкамендуецца да белага віна, яблыкам, грушы і вінаграду."
    },
    "en": {
      "name": "Krones cheese with black truffle",
      "description": "A unique combination of semi-hard cheese with an intense taste and subtle aroma of Italian black truffle. Recommended with white wine, apples, pears and grapes."
    },
    "zh": {
      "name": "克朗斯奶酪配黑松露",
      "description": "半硬质奶酪与浓郁的意大利黑松露味道和微妙香气的独特组合。推荐搭配白葡萄酒、苹果、梨和葡萄。"
    }
  },
  "syr-krones-s-belym-tryufelem": {
    "be": {
      "name": "Сыр Кронэс з белым труфелем",
      "description": "Вытанчаны паўцвёрды сыр тлустасцю 55% з водарам італьянскага белага труфеля, тонкімі арэхавымі і кветкавымі нотамі. Ідэальны для вінных сэтаў."
    },
    "en": {
      "name": "Krones cheese with white truffle",
      "description": "Refined semi-hard cheese with a fat content of 55% with the aroma of Italian white truffle, subtle nutty and floral notes. Ideal for wine sets."
    },
    "zh": {
      "name": "克朗斯奶酪配白松露",
      "description": "精制半硬质奶酪，脂肪含量为 55%，具有意大利白松露的香气、微妙的坚果和花香。非常适合酒具。"
    }
  },
  "syr-goroden": {
    "be": {
      "name": "Сыр \"ГародэнЪ\"",
      "description": "Ствараецца па спецыяльнай рэцэптуры з адборнага малака з тэрмінам паспявання не менш за 60 сутак. Мае прыемны сметанковы смак і шчыльную структуру для бутэрбродаў, соусаў і сырных талерак."
    },
    "en": {
      "name": "Cheese \"Goroden\"",
      "description": "It is created according to a special recipe from selected milk with a ripening period of at least 60 days. It has a pleasant creamy taste and dense structure for sandwiches, sauces and cheese plates."
    },
    "zh": {
      "name": "奶酪“戈罗登”",
      "description": "它是根据特殊配方，采用成熟期至少 60 天的精选牛奶制成。它具有宜人的奶油味和致密的结构，适用于三明治、酱汁和奶酪盘。"
    }
  },
  "syr-grand-taller": {
    "be": {
      "name": "Сыр \"Grand Талер\"",
      "description": "Цвёрды жоўты сыр з сакавітым пікантным густам, даўкім водарам і шчыльнай тэкстурай працяглага паспявання. Добры для піцы, спагецці і падачы да белага віна."
    },
    "en": {
      "name": "Cheese \"Grand Taller\"",
      "description": "Hard yellow cheese with a juicy piquant taste, tart aroma and dense texture with long ripening. Good for pizza, spaghetti and served with white wine."
    },
    "zh": {
      "name": "奶酪“高大”",
      "description": "坚硬的黄色奶酪，味道多汁辛辣，酸香浓郁，质地致密，成熟时间长。适合搭配披萨、意大利面，并搭配白葡萄酒。"
    }
  },
  "syr-krones-s-chesnokom-i-bazilikom": {
    "be": {
      "name": "Сыр Кронэс з часныком і базілікам",
      "description": "Паўцвёрды сыр з дабаўленнем сухога лісця базіліка, часныку і натуральнага экстракта хларафіла. Выдатна падыходзіць для піцы, гарачых бутэрбродаў, пасты і соусаў."
    },
    "en": {
      "name": "Krones cheese with garlic and basil",
      "description": "Semi-hard cheese with the addition of dried basil leaves, garlic and natural chlorophyll extract. Great for pizza, hot sandwiches, pasta and sauces."
    },
    "zh": {
      "name": "克朗斯奶酪配大蒜和罗勒",
      "description": "添加干罗勒叶、大蒜和天然叶绿素提取物的半硬质奶酪。非常适合披萨、热三明治、意大利面和酱汁。"
    }
  },
  "syr-rochester": {
    "be": {
      "name": "Сыр Рочэстэр",
      "description": "Цвёрды сыр з пікантным густам і глыбокім водарам працяглага паспявання. Выдатна спалучаецца з белым сухім віном і свежымі морапрадуктамі."
    },
    "en": {
      "name": "Rochester cheese",
      "description": "Hard cheese with a piquant taste and deep aroma of long ripening. Pairs perfectly with dry white wine and fresh seafood."
    },
    "zh": {
      "name": "罗切斯特奶酪",
      "description": "硬质奶酪，具有辛辣的味道和长期成熟的浓郁香气。与干白葡萄酒和新鲜海鲜完美搭配。"
    }
  },
  "syr-gollandskiy-premium": {
    "be": {
      "name": "Сыр Галандскі прэміум",
      "description": "Добрыя традыцыі беларускага сыраварства з далікатным букетам смаку і водару. Выдатна спалучаецца з грэцкімі арэхамі, мёдам і чырвоным віном."
    },
    "en": {
      "name": "Cheese Dutch Premium",
      "description": "Good traditions of Belarusian cheese making with a delicate bouquet of taste and aroma. Pairs perfectly with walnuts, honey and red wine."
    },
    "zh": {
      "name": "荷兰优质奶酪",
      "description": "白俄罗斯奶酪制作的优良传统，具有精致的味道和香气。与核桃、蜂蜜和红酒完美搭配。"
    }
  },
  "syr-smetankovyy": {
    "be": {
      "name": "Сыр Смятанкавы",
      "description": "Паўцвёрды сычужны сыр з далікатным сметанковым густам, адносіцца да расійскай групы насыпных сыроў."
    },
    "en": {
      "name": "Cheese Smetankovy",
      "description": "Semi-hard rennet cheese with a delicate creamy taste, belongs to the Russian group of bulk cheeses."
    },
    "zh": {
      "name": "斯梅坦科维奶酪",
      "description": "半硬凝乳酶奶酪具有细腻的奶油味，属于俄罗斯散装奶酪组。"
    }
  },
  "syr-rossiyskiy-osobyy": {
    "be": {
      "name": "Сыр \"Расійскі асаблівы\"",
      "description": "Класічны паўцвёрды сычужны сыр з выяўленым сырным густам і малюнкам з вочкаў вуглаватай і шчылінападобнай формы."
    },
    "en": {
      "name": "Cheese \"Russian special\"",
      "description": "A classic semi-hard rennet cheese with a pronounced cheesy taste and a pattern of angular and slit-shaped eyes."
    },
    "zh": {
      "name": "“俄罗斯特色”奶酪",
      "description": "一种经典的半硬凝乳酶奶酪，具有明显的奶酪味道和棱角状和狭缝状的眼睛图案。"
    }
  },
  "syr-slivochnyy": {
    "be": {
      "name": "Сыр сметанковы",
      "description": "Далікатны паўцвёрды сыр са сметанковым букетам густу і водару. Выдатна спалучаецца з грэцкімі арэхамі, мёдам і чырвоным віном."
    },
    "en": {
      "name": "Cream Cheese",
      "description": "Delicate semi-hard cheese with a creamy bouquet of taste and aroma. Pairs perfectly with walnuts, honey and red wine."
    },
    "zh": {
      "name": "奶油芝士",
      "description": "精致的半硬质奶酪，具有奶油般的味道和香气。与核桃、蜂蜜和红酒完美搭配。"
    }
  },
  "syr-tilziter": {
    "be": {
      "name": "Сыр «Тыльзіцёр»",
      "description": "Паўцвёрды сыр, выраблены па нямецкіх традыцыях сыраварства. Сметанковы смак з лёгкай кіслінкай і ўмеранай пікантнасцю."
    },
    "en": {
      "name": "Cheese \"Tilsiter\"",
      "description": "Semi-hard cheese made according to German cheese-making traditions. Creamy taste with light sourness and moderate piquancy."
    },
    "zh": {
      "name": "奶酪“蒂尔西特”",
      "description": "根据德国奶酪制作传统制成的半硬奶酪。奶油味，带有淡淡的酸味和适度的辣味。"
    }
  },
  "syr-slavyanskiy-ekstra": {
    "be": {
      "name": "Сыр Славянскі экстра",
      "description": "Паўцвёрды сыр з далікатным букетам густу і водару. Выдатна спалучаецца з грэцкімі арэхамі, мёдам і чырвоным віном."
    },
    "en": {
      "name": "Cheese Slavyansky extra",
      "description": "Semi-hard cheese with a delicate bouquet of taste and aroma. Pairs perfectly with walnuts, honey and red wine."
    },
    "zh": {
      "name": "斯拉维亚奶酪额外",
      "description": "半硬质奶酪，具有细腻的味道和香气。与核桃、蜂蜜和红酒完美搭配。"
    }
  },
  "syr-kostromskoy": {
    "be": {
      "name": "Сыр Кастрамской",
      "description": "Класічны паўцвёрды сыр, шырока ўжывальны ў кулінарыі: для піцы, гарачых бутэрбродаў, запякання і салат."
    },
    "en": {
      "name": "Kostromskaya cheese",
      "description": "A classic semi-hard cheese, widely used in cooking: for pizza, hot sandwiches, baked goods and salads."
    },
    "zh": {
      "name": "科斯特罗姆斯卡亚奶酪",
      "description": "一种经典的半硬奶酪，广泛用于烹饪：用于披萨、热三明治、烘焙食品和沙拉。"
    }
  },
  "syr-poshekhonskiy": {
    "be": {
      "name": "Сыр Пашахонскі",
      "description": "Сыр з тонкім сырным густам для самастойнай падачы і запякання мясных і рыбных страў."
    },
    "en": {
      "name": "Cheese Poshekhonsky",
      "description": "Cheese with a subtle cheesy taste for serving and baking meat and fish dishes independently."
    },
    "zh": {
      "name": "波舍洪斯基奶酪",
      "description": "具有微妙奶酪味道的奶酪，可独立盛放和烘焙肉类和鱼类菜肴。"
    }
  },
  "syr-elegantnyy": {
    "be": {
      "name": "Сыр \"Элегантны\"",
      "description": "Дыетычны сыр з паніжаным утрыманнем тлушчу (30%) і мяккім сметанковым прысмакам дзякуючы асаблівай бактэрыяльнай заквасцы."
    },
    "en": {
      "name": "Cheese \"Elegant\"",
      "description": "Dietary cheese with reduced fat content (30%) and a soft creamy taste thanks to a special bacterial starter culture."
    },
    "zh": {
      "name": "奶酪“优雅”",
      "description": "由于特殊的细菌发酵剂培养物，膳食奶酪的脂肪含量降低了 (30%)，具有柔软的奶油味。"
    }
  },
  "syr-grana-parmezano": {
    "be": {
      "name": "Сыр Грана Пармезана",
      "description": "Спалучэнне асаблівасцяў сыроў цвёрдага і паўцвёрдага тыпаў з насычаным сакавітым густам для пасты, рызота і сырных талерак."
    },
    "en": {
      "name": "Grana Parmigiano Cheese",
      "description": "Combining the characteristics of hard and semi-hard cheeses with a rich, juicy taste for pasta, risotto and cheese plates."
    },
    "zh": {
      "name": "格拉纳帕尔马干酪",
      "description": "将硬质和半硬质奶酪的特点与意大利面、烩饭和奶酪盘的浓郁多汁味道相结合。"
    }
  },
  "syr-grecheskiy": {
    "be": {
      "name": "Сыр Грэцкі",
      "description": "Сыр са слаістай эластычнай кансістэнцыяй і чыстым кісламалочным умерана салёным густам. Выдатна падыходзіць для агароднінных салат, піцы, пірагоў і хачапуры."
    },
    "en": {
      "name": "Greek cheese",
      "description": "Cheese with a layered elastic consistency and a pure fermented milk taste, moderately salty. Great for vegetable salads, pizza, pies and khachapuri."
    },
    "zh": {
      "name": "希腊奶酪",
      "description": "奶酪具有层次感、弹性稠度和纯正发酵奶的味道，咸度适中。非常适合蔬菜沙拉、披萨、馅饼和 Khachapuri。"
    }
  },
  "syr-nikitinskiy": {
    "be": {
      "name": "Сыр \"Нікіцінскі\"",
      "description": "Паўцвёрды сыр з пластычнай кансістэнцыяй, умерана выяўленым сырным густам і малюнкам з глазков няправільнай вуглаватай формы."
    },
    "en": {
      "name": "Cheese \"Nikitinsky\"",
      "description": "Semi-hard cheese with a plastic consistency, a moderately pronounced cheese taste and a pattern of irregular angular eyes."
    },
    "zh": {
      "name": "奶酪“尼基廷斯基”",
      "description": "半硬质奶酪，具有塑性稠度、适度明显的奶酪味道和不规则的角眼图案。"
    }
  },
  "syr-staroslavyanskiy": {
    "be": {
      "name": "Сыр \"Стараславянскі\"",
      "description": "Паўцвёрды сычужны сыр з нізкай тэмпературай другога награвання. Валодае выяўленым сырным густам і далікатнай эластычнай кансістэнцыяй."
    },
    "en": {
      "name": "Cheese \"Old Slavonic\"",
      "description": "Semi-hard rennet cheese with a low second heating temperature. It has a pronounced cheese taste and a delicate elastic consistency."
    },
    "zh": {
      "name": "“老斯拉夫”奶酪",
      "description": "二次加热温度低的半硬凝乳酶奶酪。它具有明显的奶酪味道和细腻的弹性稠度。"
    }
  },
  "syr-korolevskiy": {
    "be": {
      "name": "Сыр \"Каралеўскі\" з водарам топленага малака",
      "description": "Вытрыманы натуральны сычужны сыр з апетытным густам і водарам топленага малака, лёгкай кіслінкай і пластычнай тэкстурай. Пераможца конкурсу \"Лепшая прадукцыя года\"."
    },
    "en": {
      "name": "\"Royal\" cheese with baked milk flavor",
      "description": "Aged natural rennet cheese with an appetizing taste and aroma of baked milk, light sourness and plastic texture. Winner of the “Best Product of the Year” competition."
    },
    "zh": {
      "name": "带有烤奶味的“皇家”奶酪",
      "description": "陈年天然凝乳干酪，具有开胃的味道和烤牛奶的香气，淡淡的酸味和塑料质感。荣获“年度最佳产品”竞赛冠军。"
    }
  },
  "syr-kalozhskiy-premium": {
    "be": {
      "name": "Сыр \"Каложскі прэміум\"",
      "description": "Арыгінальная распрацоўка сыравараў ААТ «Малочны свет» з прыемным саладкаватым густам, пластычнай кансістэнцыяй і буйнымі круглымі вочкамі на разрэзе."
    },
    "en": {
      "name": "Cheese \"Kalozhsky Premium\"",
      "description": "An original development by the cheese makers of Molochny Mir OJSC with a pleasant sweetish taste, plastic consistency and large round eyes on the cut."
    },
    "zh": {
      "name": "奶酪“Kalozhsky Premium”",
      "description": "由 Molochny Mir OJSC 奶酪制造商原创开发，具有令人愉悦的甜味、塑料稠度和切口上的大圆眼。"
    }
  },
  "syr-monarshiy": {
    "be": {
      "name": "Сыр \"Манаршы\"",
      "description": "Паўцвёрды сычужны сыр з далікатным пластычным цестам і ўмерана выяўленым чыстым сырным густам."
    },
    "en": {
      "name": "Cheese \"Monarshiy\"",
      "description": "Semi-hard rennet cheese with a delicate plastic dough and a moderately pronounced pure cheese taste."
    },
    "zh": {
      "name": "奶酪“莫纳希”",
      "description": "半硬凝乳酶奶酪，具有细腻的塑料面团和适度明显的纯奶酪味道。"
    }
  },
  "syr-vladimirskiy": {
    "be": {
      "name": "Сыр \"Уладзімірскі\"",
      "description": "Сыр з ярка выяўленым сырным густам і пластычнай кансістэнцыяй, які ўвабраў лепшыя традыцыі сыраробства."
    },
    "en": {
      "name": "Cheese \"Vladimirsky\"",
      "description": "Cheese with a pronounced cheesy taste and plastic consistency, incorporating the best traditions of cheese making."
    },
    "zh": {
      "name": "“弗拉基米尔”奶酪",
      "description": "奶酪具有明显的奶酪味道和塑料稠度，融合了奶酪制作的最佳传统。"
    }
  },
  "syr-vityaz": {
    "be": {
      "name": "Сыр \"Віцязь\"",
      "description": "Паўцвёрды сычужны сыр тлустасцю 55% з насычаным сметанковым водарам і прыемным сырным густам."
    },
    "en": {
      "name": "Cheese \"Vityaz\"",
      "description": "Semi-hard rennet cheese with a fat content of 55% with a rich creamy aroma and a pleasant cheesy taste."
    },
    "zh": {
      "name": "奶酪“维蒂亚兹”",
      "description": "半硬质凝乳酶奶酪，脂肪含量55%，具有浓郁的奶油香气和宜人的奶酪味道。"
    }
  },
  "syr-gryuver-osobyy": {
    "be": {
      "name": "Сыр \"Грувер асаблівы\"",
      "description": "Цвёрды жоўты сыр з сакавітым пікантным густам і шчыльнай крышталічнай кансістэнцыяй працяглага паспявання. Пераможца конкурсу \"Чэмпіён густу\"."
    },
    "en": {
      "name": "Cheese \"Gruver special\"",
      "description": "A hard yellow cheese with a juicy, piquant taste and a dense crystalline consistency that lasts for a long time. Winner of the “Champion of Taste” competition."
    },
    "zh": {
      "name": "奶酪“格鲁弗特制”",
      "description": "一种坚硬的黄色奶酪，味道多汁、辛辣，结晶稠度浓密，可保存很长时间。荣获“品味冠军”比赛冠军。"
    }
  },
  "syr-berestovitskiy": {
    "be": {
      "name": "Сыр «Бераставіцкі»",
      "description": "Паўцвёрды сыр з водарам сырадою, далікатным сметанковым густам і мяккай тэкстурай."
    },
    "en": {
      "name": "Cheese \"Berestovitsky\"",
      "description": "Semi-hard cheese with the aroma of fresh milk, delicate creamy taste and soft texture."
    },
    "zh": {
      "name": "奶酪“别列斯托维茨基”",
      "description": "半硬质奶酪，具有鲜奶的香气，奶油味细腻，质地柔软。"
    }
  },
  "syr-bravo-forma": {
    "be": {
      "name": "Сыр \"Брава\" форма",
      "description": "Паўцвёрды сыр з чыстым, умерана выяўленым сырным, злёгку кіслявым густам."
    },
    "en": {
      "name": "Cheese \"Bravo\" form",
      "description": "Semi-hard cheese with a clean, moderately pronounced cheesy, slightly sour taste."
    },
    "zh": {
      "name": "奶酪“Bravo”形式",
      "description": "半硬质奶酪，具有干净、适度明显的奶酪味和微酸的味道。"
    }
  },
  "syr-alberi": {
    "be": {
      "name": "Сыр \"Альберы\"",
      "description": "Паўцвёрды сыр з раўнамерным малюнкам з вочкаў вуглаватай формы і чыстым сырным густам. Пераможца конкурсу \"Лепшы густ - 2017\" (г. Масква)."
    },
    "en": {
      "name": "Albery cheese",
      "description": "Semi-hard cheese with a uniform pattern of angular eyes and a pure cheese taste. Winner of the competition “Best Taste - 2017” (Moscow)."
    },
    "zh": {
      "name": "阿尔伯里奶酪",
      "description": "半硬质奶酪，具有均匀的角眼图案和纯正的奶酪味道。 “最佳品味 - 2017”竞赛获奖者（莫斯科）。"
    }
  },
  "syr-alekseevskiy": {
    "be": {
      "name": "Сыр \"Аляксееўскі\"",
      "description": "Паўцвёрды сычужны сыр з нізкай тэмпературай другога награвання, насычаным сметанковым густам і далікатнай эластычнай кансістэнцыяй."
    },
    "en": {
      "name": "Cheese \"Alekseevsky\"",
      "description": "Semi-hard rennet cheese with a low second heating temperature, rich creamy taste and delicate elastic consistency."
    },
    "zh": {
      "name": "奶酪“阿列克谢夫斯基”",
      "description": "半硬质凝乳酶奶酪，二次加热温度低，奶油味浓郁，口感细腻弹性稠度。"
    }
  },
  "syr-belarus-ekstra": {
    "be": {
      "name": "Сыр \"БелаРусь-экстра\"",
      "description": "Класічны паўцвёрды сыр з чыстым сырным злёгку кіслявым густам і раўнамерным карункавым малюнкам глазков."
    },
    "en": {
      "name": "Cheese \"Belarus-extra\"",
      "description": "A classic semi-hard cheese with a clean, slightly sour cheesy taste and a uniform lacy pattern of eyes."
    },
    "zh": {
      "name": "“白俄罗斯特级”奶酪",
      "description": "经典的半硬质奶酪，具有干净、略带酸味的奶酪味道和均匀的花边图案。"
    }
  },
  "syr-myagkiy-slivochnyy-goroden": {
    "be": {
      "name": "Сыр мяккі сметанковы \"ГородЪ\" (Cream Cheese)",
      "description": "Выраблены са свежых вяршкоў на ўстаноўках ультрафільтрацыі. Ідэальны для сушы і ролаў, тварожнікаў, соусаў, супаў і закусак. Даступны ў прафесійных вёдрах HoReCa да 11 кг."
    },
    "en": {
      "name": "Soft cream cheese “Goroden” (Cream Cheese)",
      "description": "Produced from fresh cream using ultrafiltration units. Ideal for sushi and rolls, cheesecakes, sauces, soups and snacks. Available in professional HoReCa buckets up to 11 kg."
    },
    "zh": {
      "name": "软奶油奶酪“Goroden”（奶油奶酪）",
      "description": "使用超滤装置由鲜奶油生产。非常适合寿司和面包卷、芝士蛋糕、酱汁、汤和小吃。提供最大 11 公斤的专业 HoReCa 桶。"
    }
  },
  "syr-myagkiy-cream-cheese": {
    "be": {
      "name": "Сыр мяккі Cream cheese",
      "description": "Далікатны тварожны сыр для тостаў, сырнага супу, салатных заправак і соусаў. Прадстаўлены ў класічным сметанковым варыянце і з гастранамічнымі напаўняльнікамі."
    },
    "en": {
      "name": "Soft cheese Cream cheese",
      "description": "Delicate curd cheese for toasts, cheese soup, salad dressings and sauces. Presented in a classic creamy version and with gastronomic fillings."
    },
    "zh": {
      "name": "软奶酪 奶油奶酪",
      "description": "精致的凝乳干酪，适合吐司、奶酪汤、沙拉酱和酱汁。以经典的奶油版本和美味的馅料呈现。"
    }
  },
  "syr-myagkiy-vzbityy": {
    "be": {
      "name": "Сыр мяккі ўзбіты",
      "description": "Паветраны ўзбіты тварожны сыр «Bela Bovino» з лёгкай мусавай кансістэнцыяй - для сэндвічаў, брускетт і кулінарных закусак."
    },
    "en": {
      "name": "Soft whipped cheese",
      "description": "Airy whipped curd cheese “Bela Bovino” with a light mousse consistency - for sandwiches, bruschettas and culinary snacks."
    },
    "zh": {
      "name": "软质搅打奶酪",
      "description": "通风的搅打凝乳干酪“Bela Bovino”，具有淡慕斯稠度 - 适用于三明治、意式烤面包和烹饪小吃。"
    }
  },
  "syr-myagkiy-vzbityy-ostryy": {
    "be": {
      "name": "Сыр мяккі ўзбіты \"Востры\"",
      "description": "Паветраная растаючая тэкстура тварожнага сыру, узбагачаная яркімі густамі азіяцкай кухні: \"Джу-сай\", \"Кім-Чы\" і \"Том-Ям-Тай\". Ідэальны для закусак і фьюжн-страў."
    },
    "en": {
      "name": "Soft whipped cheese “Ostriy”",
      "description": "The airy melting texture of curd cheese, enriched with the bright flavors of Asian cuisine: Ju-sai, Kim-Chi and Tom-Yam-Tai. Ideal for appetizers and fusion dishes."
    },
    "zh": {
      "name": "软搅打奶酪“Ostriy”",
      "description": "凝乳奶酪轻盈融化的质感，富含亚洲美食的鲜亮风味：Ju-sai、Kim-Chi 和 Tom-Yam-Tai。非常适合开胃菜和融合菜肴。"
    }
  },
  "syr-plavlenyy": {
    "be": {
      "name": "Сыр плаўлены",
      "description": "Пастападобны плаўлены сыр з насычаным сметанковым густам і пластычнай кансістэнцыяй у шклянках па 130 г і 340 г."
    },
    "en": {
      "name": "Processed cheese",
      "description": "Pasty processed cheese with a rich creamy taste and plastic consistency in glasses of 130 g and 340 g."
    },
    "zh": {
      "name": "再制奶酪",
      "description": "130 克和 340 克杯装的糊状加工奶酪，具有浓郁的奶油味和塑料稠度。"
    }
  },
  "syrki-plavlenye-v-folge": {
    "be": {
      "name": "Сыркі плаўленыя (у фальзе/брускамі)",
      "description": "Традыцыйныя плаўленыя сыркі ў фальзе па 90 г: «Сметанковы», «Дружба», «Гарадскі», «З пажытнікам», «Аршанскі» і «Арбіта»."
    },
    "en": {
      "name": "Processed cheeses (in foil/bars)",
      "description": "Traditional processed cheese curds in foil, 90 g each: “Slivochny”, “Druzhba”, “City”, “With fenugreek”, “Orshansky” and “Orbita”."
    },
    "zh": {
      "name": "加工奶酪（铝箔/条状）",
      "description": "传统加工箔纸奶酪凝乳，每块 90 克：“Slivochny”、“Druzhba”、“City”、“胡芦巴”、“Orshansky”和“Orbita”。"
    }
  },
  "syr-plavlenyy-kolbasnyy-belorusskiy": {
    "be": {
      "name": "Сыр плаўлены каўбасны вэнджаны «Беларускі»",
      "description": "Плаўлены каўбасны сыр з суцэльнага малака з далікатным сметанковым густам і лёгкім водарам натуральнага вэнджання. Для бутэрбродаў, піцы і салат."
    },
    "en": {
      "name": "Smoked processed sausage cheese “Belorussky”",
      "description": "Processed sausage cheese made from whole milk with a delicate creamy taste and a light aroma of natural smoking. For sandwiches, pizza and salads."
    },
    "zh": {
      "name": "烟熏加工香肠奶酪“白俄罗斯”",
      "description": "由全脂牛奶制成的加工香肠奶酪，具有细腻的奶油味道和淡淡的自然烟熏香气。用于三明治、披萨和沙拉。"
    }
  },
  "syr-plavlenyy-sladkiy-shokoladnyy": {
    "be": {
      "name": "Сыр плаўлены салодкі шакаладны",
      "description": "Дэсертны плаўлены сыр з насычаным густам натуральнага шакаладу і далікатнай пластычнай кансістэнцыяй."
    },
    "en": {
      "name": "Sweet chocolate processed cheese",
      "description": "Dessert processed cheese with a rich taste of natural chocolate and a delicate plastic consistency."
    },
    "zh": {
      "name": "甜巧克力加工奶酪",
      "description": "甜点加工奶酪，具有浓郁的天然巧克力味道和细腻的塑料稠度。"
    }
  },
  "moloko-sterilizovannoe-bezlaktoznoe": {
    "be": {
      "name": "Малако пітное стэрылізаванае БЯЗЛАКТОЗНАЕ",
      "description": "Лёгка засвойваецца арганізмам, палягчае страваванне і пазбаўляе ад дыскамфорту. Падыходзіць людзям з лактазнай недастатковасцю. Тэрмін захоўвання да 12 месяцаў."
    },
    "en": {
      "name": "LACTOSE-FREE sterilized drinking milk",
      "description": "It is easily absorbed by the body, facilitates digestion and relieves discomfort. Suitable for people with lactase deficiency. Shelf life up to 12 months."
    },
    "zh": {
      "name": "无乳糖灭菌饮用奶",
      "description": "它很容易被人体吸收，促进消化，缓解不适。适合乳糖酶缺乏者。保质期长达12个月。"
    }
  },
  "moloko-sterilizovannoe": {
    "be": {
      "name": "Малако стэрылізаванае",
      "description": "Натуральнае каровіна малако без кансервантаў у герметычным пакаванні Tetra Pak. Захоўваецца да 12 месяцаў, поўнасцю захоўваючы харчовую каштоўнасць."
    },
    "en": {
      "name": "Sterilized milk",
      "description": "Natural cow's milk without preservatives in sealed Tetra Pak packaging. It can be stored for up to 12 months, fully retaining its nutritional value."
    },
    "zh": {
      "name": "灭菌奶",
      "description": "采用密封利乐包装的天然牛奶，不含防腐剂。可保存长达12个月，充分保留其营养价值。"
    }
  },
  "moloko-goroden": {
    "be": {
      "name": "Малако «ГородЪЪ»",
      "description": "Малако «ГороденЪ» адрозніваецца падвышаным утрыманнем бялку дзякуючы дбайнаму сартаванню і адбору лепшай сыравіны."
    },
    "en": {
      "name": "Milk \"Goroden\"",
      "description": "Goroden milk has a high protein content due to careful sorting and selection of the best raw materials."
    },
    "zh": {
      "name": "牛奶“戈罗登”",
      "description": "Goroden牛奶由于经过精心挑选和精选最好的原材料而具有很高的蛋白质含量。"
    }
  },
  "moloko-active-life": {
    "be": {
      "name": "Малако ГМ «Active life»",
      "description": "Малако 2,5% тлустасці, узбагачанае вітамінна-мінеральным комплексам \"Імунітэт\" (вітаміны C, Zn, Se, D, B6, B12, B9). У адной шклянцы - 7,5% сутачнай нормы вітамінаў."
    },
    "en": {
      "name": "Milk TM “Active life”",
      "description": "Milk 2.5% fat, enriched with the vitamin and mineral complex “Immunity” (vitamins C, Zn, Se, D, B6, B12, B9). One glass contains 7.5% of the daily requirement of vitamins."
    },
    "zh": {
      "name": "牛奶TM“活力生活”",
      "description": "牛奶 2.5% 脂肪，富含维生素和矿物质复合物“免疫”（维生素 C、Zn、Se、D、B6、B12、B9）。一杯含有每日维生素需求量的 7.5%。"
    }
  },
  "moloko-ultrapasterizovannoe": {
    "be": {
      "name": "Малако ультрапастэрызаванае",
      "description": "Свежае натуральнае ультрапастэрызаванае малако ў зручных ПЭТ-бутэльках аб'ёмам 500 мл, 950 мл і 1450 мл."
    },
    "en": {
      "name": "UHT milk",
      "description": "Fresh natural UHT milk in convenient PET bottles of 500 ml, 950 ml and 1450 ml."
    },
    "zh": {
      "name": "超高温灭菌牛奶",
      "description": "新鲜天然 UHT 牛奶装在方便的 PET 瓶中，容量为 500 毫升、950 毫升和 1450 毫升。"
    }
  },
  "moloko-pasterizovannoe": {
    "be": {
      "name": "Малако пастэрызаванае",
      "description": "Класічнае пастэрызаванае малако ў поліэтыленавай плёнцы са строгім кантролем якасці на ўсіх этапах вытворчасці."
    },
    "en": {
      "name": "Pasteurized milk",
      "description": "Classic pasteurized milk in plastic film with strict quality control at all stages of production."
    },
    "zh": {
      "name": "巴氏杀菌牛奶",
      "description": "经典的塑料薄膜巴氏杀菌牛奶在生产的各个阶段都经过严格的质量控制。"
    }
  },
  "moloko-tvoya-kruzhka": {
    "be": {
      "name": "Малако ультрапастэрызаванае «Твая кружка»",
      "description": "Ультрапастэрызаванае цэльнае малако тлустасцю 3,9% у зручнай пластыкавай бутэльцы 850 мл."
    },
    "en": {
      "name": "UHT milk “Your mug”",
      "description": "UHT whole milk with 3.9% fat content in a convenient 850 ml plastic bottle."
    },
    "zh": {
      "name": "超高温灭菌牛奶“你的杯子”",
      "description": "UHT 全脂牛奶，脂肪含量为 3.9%，装在方便的 850 毫升塑料瓶中。"
    }
  },
  "toplenoe-moloko": {
    "be": {
      "name": "Топленае малако",
      "description": "Натуральнае каровіна малако, прыгатаванае шляхам знямогі. Валодае характэрным кавава-карамельным послевкусием і багаццем амінакіслот."
    },
    "en": {
      "name": "Baked milk",
      "description": "Natural cow's milk prepared by simmering. It has a characteristic coffee-caramel aftertaste and a wealth of amino acids."
    },
    "zh": {
      "name": "烤牛奶",
      "description": "天然牛奶通过慢火煮制而成。它具有特有的咖啡焦糖余味和丰富的氨基酸。"
    }
  },
  "kefir-goroden": {
    "be": {
      "name": "Кефір «ГородЪЪ»",
      "description": "Кефір з адборнага малака, узбагачаны жывымі біфідабактэрыямі для падтрымкі здароўя і стрававання."
    },
    "en": {
      "name": "Kefir \"Goroden\"",
      "description": "Selected milk kefir enriched with live bifidobacteria to support health and digestion."
    },
    "zh": {
      "name": "开菲尔“戈罗登”",
      "description": "精选开菲尔牛奶，富含活双歧杆菌，有助于健康和消化。"
    }
  },
  "kefir-active-life": {
    "be": {
      "name": "Кефір ГМ «Active life»",
      "description": "Кефір 2,5% тлустасці, узбагачаны вітамінава-мінеральным комплексам \"Імунітэт\" (C, Zn, Se, D, B6, B12, B9)."
    },
    "en": {
      "name": "Kefir TM “Active life”",
      "description": "Kefir 2.5% fat, enriched with the vitamin and mineral complex “Immunity” (C, Zn, Se, D, B6, B12, B9)."
    },
    "zh": {
      "name": "开菲尔TM“积极生活”",
      "description": "开菲尔 2.5% 脂肪，富含维生素和矿物质复合物“免疫”（C、Zn、Se、D、B6、B12、B9）。"
    }
  },
  "kefir-bifidobakteriyami": {
    "be": {
      "name": "Кефір узбагачаны біфідабактэрыямі",
      "description": "Кефір «Твая кружка» 3,9% з цэльнага малака, узбагачаны карыснымі біфідабактэрыямі."
    },
    "en": {
      "name": "Kefir enriched with bifidobacteria",
      "description": "Kefir “Your mug” 3.9% from whole milk, enriched with beneficial bifidobacteria."
    },
    "zh": {
      "name": "富含双歧杆菌的开菲尔",
      "description": "开菲尔“你的杯子”3.9% 来自全脂牛奶，富含有益的双歧杆菌。"
    }
  },
  "kefir-but": {
    "be": {
      "name": "Кефір у ПЭТ-бутэльцы",
      "description": "Класічны свежы кефір у зручнай ПЭТ-бутэльцы аб'ёмам ад 500 г да 1,45 кг. Пераможца конкурсу \"Лепшы густ - 2017\" (г. Масква)."
    },
    "en": {
      "name": "Kefir in a PET bottle",
      "description": "Classic fresh kefir in a convenient PET bottle with a volume of 500 g to 1.45 kg. Winner of the competition “Best Taste - 2017” (Moscow)."
    },
    "zh": {
      "name": "PET 瓶中的开菲尔",
      "description": "经典的新鲜开菲尔装在方便的 PET 瓶中，容量从 500 克到 1.45 公斤不等。 “最佳品味 - 2017”竞赛获奖者（莫斯科）。"
    }
  },
  "kefir-paket": {
    "be": {
      "name": "Кефір у плёнцы",
      "description": "Класічны кісламалочны напой з натуральнага высакаякаснага суцэльнага малака ў традыцыйным пакеце."
    },
    "en": {
      "name": "Kefir in film",
      "description": "A classic fermented milk drink made from natural high-quality whole milk in a traditional package."
    },
    "zh": {
      "name": "电影中的开菲尔",
      "description": "采用传统包装的天然优质全脂牛奶制成的经典发酵乳饮料。"
    }
  },
  "bifitat": {
    "be": {
      "name": "Біфітат",
      "description": "Кісламалочны біяпрадукт дыетычнага, лячэбнага і прафілактычнага харчавання. Высокае ўтрыманне біфідобактерій паляпшае абменныя працэсы і ўмацоўвае імунітэт."
    },
    "en": {
      "name": "Biphytate",
      "description": "Fermented milk bioproduct for dietary, therapeutic and preventive nutrition. The high content of bifidobacteria improves metabolic processes and strengthens the immune system."
    },
    "zh": {
      "name": "联植酸",
      "description": "用于膳食、治疗和预防营养的发酵乳生物制品。高含量的双歧杆菌可改善代谢过程并增强免疫系统。"
    }
  },
  "darayran": {
    "be": {
      "name": "Прадукт кісламалочны «ДарАйран»",
      "description": "Асвяжальны кісламалочны напой па старадаўніх каўказскіх рэцэптах. Выдатна спаталяе смагу і аднаўляе водна-солевы баланс."
    },
    "en": {
      "name": "Fermented milk product \"DarAyran\"",
      "description": "A refreshing fermented milk drink based on ancient Caucasian recipes. Perfectly quenches thirst and restores water-salt balance."
    },
    "zh": {
      "name": "发酵乳制品“DarAyran”",
      "description": "一种基于古老高加索食谱的清爽发酵乳饮料。完美解渴并恢复水盐平衡。"
    }
  },
  "ryazhenka": {
    "be": {
      "name": "Ражанка",
      "description": "Традыцыйны кісламалочны напой з топленага малака з высокім утрыманнем кальцыя і фосфару. Мяккі карамельны густ і далікатная тэкстура."
    },
    "en": {
      "name": "Ryazhenka",
      "description": "A traditional fermented milk drink made from baked milk with a high content of calcium and phosphorus. Soft caramel taste and delicate texture."
    },
    "zh": {
      "name": "里亚任卡",
      "description": "一种传统的发酵乳饮料，由富含钙和磷的烘焙牛奶制成。柔和的焦糖味道和细腻的质感。"
    }
  },
  "prostokvasha-mechnikovskaya": {
    "be": {
      "name": "Прастакваша «Мечнікаўская» (тэрмастатны спосаб)",
      "description": "Густая тэрмастатная сыраватка па старадаўнім рэцэпце Мечнікава - дабратворна ўплывае на мікрафлору кішачніка і страваванне."
    },
    "en": {
      "name": "Yogurt \"Mechnikovskaya\" (thermostatic method)",
      "description": "Thick thermostat yogurt according to Mechnikov’s old recipe has a beneficial effect on intestinal microflora and digestion."
    },
    "zh": {
      "name": "酸奶“Mechnikovskaya”（恒温法）",
      "description": "根据梅奇尼科夫的旧配方制作的浓稠恒温酸奶对肠道菌群和消化有有益的作用。"
    }
  },
  "yogurt-grecheskiy": {
    "be": {
      "name": "Ёгурт «Грэцкі»",
      "description": "Натуральны фільтраваны грэцкі ёгурт без дадання цукру з густой крэмавай тэкстурай і высокім утрыманнем бялку. Ідэальны для сняданкаў, соусаў, марынадаў і выпечкі."
    },
    "en": {
      "name": "Yogurt \"Greek\"",
      "description": "Natural filtered Greek yogurt with no added sugar, thick, creamy texture and high protein content. Ideal for breakfasts, sauces, marinades and baked goods."
    },
    "zh": {
      "name": "酸奶“希腊”",
      "description": "天然过滤希腊酸奶，不添加糖，质地浓稠，奶油状，蛋白质含量高。非常适合早餐、酱汁、腌料和烘焙食品。"
    }
  },
  "yogurt-grecheskiy-napolniteli": {
    "be": {
      "name": "Ёгурт \"Грэчаскі\" з напаўняльнікамі",
      "description": "Густая далікатная тэкстура грэцкага ёгурта і яркія фруктовыя густы: маракуйя, чарніцы, яблык-ківі з насеннем базіліка. Без дабаўленага цукру."
    },
    "en": {
      "name": "Yogurt “Greek” with fillings",
      "description": "Thick, smooth texture of Greek yogurt and bright fruit flavors: passion fruit, blueberry, apple-kiwi with basil seeds. No added sugar."
    },
    "zh": {
      "name": "带馅料的“希腊”酸奶",
      "description": "希腊酸奶质地浓稠、光滑，水果风味明亮：百香果、蓝莓、苹果猕猴桃和罗勒籽。不添加糖。"
    }
  },
  "yogurt-diavita": {
    "be": {
      "name": "Ёгурт DiaVita",
      "description": "Інавацыйны ёгурт з бетулінам (экстрактам кары бярозы), распрацаваны сумесна з Інстытутам біяхіміі НАН Беларусі. Не змяшчае цукру і фарбавальнікаў, падыходзіць для карэкцыі харчавання пры дыябеце 2-га тыпу."
    },
    "en": {
      "name": "Yogurt DiaVita",
      "description": "Innovative yogurt with betulin (birch bark extract), developed jointly with the Institute of Biochemistry of the National Academy of Sciences of Belarus. Does not contain sugar or dyes, suitable for correcting nutrition for type 2 diabetes."
    },
    "zh": {
      "name": "迪亚维塔酸奶",
      "description": "与白俄罗斯国家科学院生物化学研究所联合开发的含有桦木醇（桦树皮提取物）的创新酸奶。不含糖或染料，适合2型糖尿病的营养纠正。"
    }
  },
  "yogurt-active-life-nizkolaktoznyy": {
    "be": {
      "name": "Нізкалактозны ёгурт Active Life з паніжаным утрыманнем цукру",
      "description": "Функцыянальны низколактозный ёгурт са зніжаным утрыманнем цукру, багаты бялком і кальцыем."
    },
    "en": {
      "name": "Low-lactose Active Life yogurt with reduced sugar content",
      "description": "Functional low-lactose yogurt with reduced sugar content, rich in protein and calcium."
    },
    "zh": {
      "name": "低乳糖 Active Life 酸奶，含糖量降低",
      "description": "功能性低乳糖酸奶，糖含量降低，富含蛋白质和钙。"
    }
  },
  "yogurt-yogo-frut-kusochki": {
    "be": {
      "name": "Ёгурт «Ёга Фрут» з кавалачкамі садавіны",
      "description": "Далікатная малочная аснова і буйныя сакавітыя кавалачкі саспелых чарніц, персіка ці трускаўкі ў зручнай шклянцы 350 г."
    },
    "en": {
      "name": "Yogo Fruit yogurt with fruit pieces",
      "description": "Delicate milk base and large juicy pieces of ripe blueberries, peaches or strawberries in a convenient 350 g glass."
    },
    "zh": {
      "name": "Yogo Fruit 酸奶加水果块",
      "description": "精致的牛奶基底和大块多汁的成熟蓝莓、桃子或草莓，装在方便的 350 克玻璃杯中。"
    }
  },
  "yogurt-yogo-fruit": {
    "be": {
      "name": "Ёгурт \"YOGO FRUIT\"",
      "description": "Двухслаёвы ёгурт 150 г з малінавым, персікавым, клубнічным, чарнічным ці вішнёвым джэмам на дне шклянкі."
    },
    "en": {
      "name": "Yogurt “YOGO FRUIT”",
      "description": "Double-layer yoghurt 150 g with raspberry, peach, strawberry, blueberry or cherry jam at the bottom of the glass."
    },
    "zh": {
      "name": "酸奶“YOGO FRUIT”",
      "description": "双层酸奶 150 克，杯底有覆盆子、桃子、草莓、蓝莓或樱桃果酱。"
    }
  },
  "yogurt-yogo-bubble": {
    "be": {
      "name": "Ёгурт Yogo Bubble",
      "description": "Сметанковы ёгурт з якія лопаюцца ў роце сакавітымі джус-балямі (шарыкамі з сокам трускаўкі, маракуі ці памяранца са густам колы)."
    },
    "en": {
      "name": "Yogurt Bubble",
      "description": "Creamy yogurt with juicy juice balls (balls with cola-flavored strawberry, passion fruit or orange juice) bursting in your mouth."
    },
    "zh": {
      "name": "酸奶泡",
      "description": "奶油酸奶和多汁的果汁球（带有可乐味的草莓、百香果或橙汁的球）在你的嘴里爆开。"
    }
  },
  "yogurt-belorusskiy": {
    "be": {
      "name": "Ёгурт «Беларускі»",
      "description": "Натуральны ёгурт з аўтэнтычным беларускім арнаментам - без напаўняльніка (2,0%) і з карыснымі спалучэннямі садавіны, мёду і травы (1,0%)."
    },
    "en": {
      "name": "Yogurt \"Belarusian\"",
      "description": "Natural yogurt with authentic Belarusian designs - without filler (2.0%) and with healthy combinations of fruits, honey and cereals (1.0%)."
    },
    "zh": {
      "name": "“白俄罗斯”酸奶",
      "description": "天然酸奶，采用正宗白俄罗斯设计 - 无填料 (2.0%)，并含有水果、蜂蜜和谷物的健康组合 (1.0%)。"
    }
  },
  "napitok-uznay-mir": {
    "be": {
      "name": "Ёгуртны напой «Даведайся Свет»",
      "description": "Пажыўны пітны ёгурт з малака гатунку «Экстра» на жывых заквасках са густамі знакамітых дэсертаў: клубнічна-малінавы пламбір, вішня-банан, грэцкі арэх-кляновы сіроп і цытрынавы тварожнік."
    },
    "en": {
      "name": "Yogurt drink “Discover the World”",
      "description": "Nutritious drinking yogurt made from “Extra” milk on live starter cultures with the flavors of famous desserts: strawberry-raspberry ice cream, cherry-banana, walnut-maple syrup and lemon cheesecake."
    },
    "zh": {
      "name": "酸奶饮料“发现世界”",
      "description": "营养丰富的饮用酸奶，由“额外”牛奶和活发酵剂制成，具有著名甜点的味道：草莓覆盆子冰淇淋、樱桃香蕉、核桃枫糖浆和柠檬芝士蛋糕。"
    }
  },
  "napitok-yogo-fit": {
    "be": {
      "name": "Кісламалочны напой «Ёга-фіт»",
      "description": "Кісламалочны напой на аснове малака, травы і садавіны (клубніцы-мюслі, чарнасліў-травы, вішня-мюслі, папая-чыа). Крыніца харчовых валокнаў, кальцыя і вавёрка."
    },
    "en": {
      "name": "Fermented milk drink \"Yogo-fit\"",
      "description": "Fermented milk drink based on milk, cereals and fruits (strawberry-muesli, prunes-cereals, cherry-muesli, papaya-chia). Source of dietary fiber, calcium and protein."
    },
    "zh": {
      "name": "发酵乳饮料“Yogo-fit”",
      "description": "基于牛奶、谷物和水果（草莓麦片、李子麦片、樱桃麦片、木瓜奇亚籽）的发酵乳饮料。膳食纤维、钙和蛋白质的来源。"
    }
  },
  "smetana-goroden": {
    "be": {
      "name": "Смятана «ГородЪЪ»",
      "description": "Створана па традыцыйных тэхналогіях з адборных вяршкоў з жорсткім выкананнем усіх норм якасці."
    },
    "en": {
      "name": "Sour cream \"Goroden\"",
      "description": "Created using traditional technologies from selected cream with strict adherence to all quality standards."
    },
    "zh": {
      "name": "酸奶油“Goroden”",
      "description": "采用传统技术从精选奶油中严格遵守所有质量标准而制成。"
    }
  },
  "smetana-active-life-bezlaktoznaya": {
    "be": {
      "name": "Смятана «Active life» безлактозная",
      "description": "Смятана 15% без лактозы - далікатны сметанковы смак без дыскамфорту для людзей з лактазнай недастатковасцю."
    },
    "en": {
      "name": "Sour cream \"Active life\" lactose-free",
      "description": "Sour cream 15% lactose-free - delicate creamy taste without discomfort for people with lactase deficiency."
    },
    "zh": {
      "name": "酸奶油“活力生活”不含乳糖",
      "description": "酸奶油 15% 不含乳糖 - 细腻的奶油味，对于乳糖酶缺乏的人来说不会产生不适。"
    }
  },
  "smetana-active-life": {
    "be": {
      "name": "Смятана ГМ «Active life»",
      "description": "Смятана 20% тлустасці, узбагачаная прабіётыкі (біфідабактэрыямі) для ўмацавання імуннай сістэмы і камфортнага стрававання."
    },
    "en": {
      "name": "Sour cream TM “Active life”",
      "description": "Sour cream 20% fat, enriched with probiotics (bifidobacteria) to strengthen the immune system and comfortable digestion."
    },
    "zh": {
      "name": "酸奶油TM“活力生活”",
      "description": "酸奶油 20% 脂肪，富含益生菌（双歧杆菌），可增强免疫系统和舒适消化。"
    }
  },
  "smetana-ban": {
    "be": {
      "name": "Смятана (у шклянцы)",
      "description": "Класічная смятана з натуральных вяршкоў у шклянках па 200 г, 350 г і 480 г тлустасцю ад 12% да 27%, уключаючы варыянт з біфідабактэрыямі."
    },
    "en": {
      "name": "Sour cream (in a glass)",
      "description": "Classic sour cream made from natural cream in glasses of 200 g, 350 g and 480 g with fat content from 12% to 27%, including an option with bifidobacteria."
    },
    "zh": {
      "name": "酸奶油（玻璃杯中）",
      "description": "由天然奶油制成的经典酸奶油，装在 200 克、350 克和 480 克的玻璃杯中，脂肪含量为 12% 至 27%，包括含有双歧杆菌的选项。"
    }
  },
  "smetana-pak": {
    "be": {
      "name": "Смятана (у плёнцы)",
      "description": "Смятана ААТ «Малочны свет» у поліэтыленавай плёнцы тлустасцю ад 10% да 29% у фасоўках 450 г і 1000 г для дома і кухні."
    },
    "en": {
      "name": "Sour cream (in film)",
      "description": "Sour cream from Molochny Mir OJSC in plastic film with a fat content of 10% to 29% in 450 g and 1000 g packaging for home and kitchen use."
    },
    "zh": {
      "name": "酸奶油（电影中）",
      "description": "Molochny Mir OJSC 的塑料薄膜酸奶油，脂肪含量为 10% 至 29%，采用 450 克和 1000 克包装，供家庭和厨房使用。"
    }
  },
  "bezlaktoznyy-formovannyy-tvorog": {
    "be": {
      "name": "Безлактозны фармаваны тварог",
      "description": "Першы ў Беларусі безлактозны тварог дыетычнага лячэбнага харчавання \"Active life\". Захоўвае высокі бялок і форму ў зручным вакуумным пакаванні «клінок»."
    },
    "en": {
      "name": "Lactose-free molded cottage cheese",
      "description": "The first lactose-free cottage cheese in Belarus for dietary medical nutrition “Active life”. Retains high protein and shape in a convenient blade vacuum packaging."
    },
    "zh": {
      "name": "无乳糖模制干酪",
      "description": "白俄罗斯首款无乳糖干酪，用于膳食医疗营养“积极生活”。在方便的刀片真空包装中保留高蛋白质和形状。"
    }
  },
  "rassypchatyy-tvorog-goroden": {
    "be": {
      "name": "Рассыпісты тварог ГМ «Гарадзень»",
      "description": "Створаны з адборнага малака гатунку \"Экстра\" без кансервантаў. Сакавітыя мяккія зерні, фасоўка 340 г і 700 г з тэрмінам прыдатнасці 40 сутак."
    },
    "en": {
      "name": "Crumbled cottage cheese TM \"Goroden\"",
      "description": "Made from selected “Extra” milk without preservatives. Juicy soft grains, packaged in 340 g and 700 g with a shelf life of 40 days."
    },
    "zh": {
      "name": "碎干酪 TM“Goroden”",
      "description": "由精选的“Extra”牛奶制成，不含防腐剂。多汁柔软的谷物，有340克和700克包装，保质期为40天。"
    }
  },
  "formovannyy-tvorog": {
    "be": {
      "name": "Фармаваны тварог",
      "description": "Тварог у вакуумнай упакоўцы «клінок», які не рассыпаецца пры адкрыцці — зручна наразаць парцыённа і выкарыстоўваць для перакусаў і запяканак."
    },
    "en": {
      "name": "Molded cottage cheese",
      "description": "Cottage cheese in a vacuum-packed “blade” that does not crumble when opened is convenient to cut into portions and use for snacks and casseroles."
    },
    "zh": {
      "name": "模制干酪",
      "description": "真空包装的干酪“刀片”打开后不会碎裂，可以方便地切成小块并用于零食和砂锅菜。"
    }
  },
  "tvorog-goroden": {
    "be": {
      "name": "Тварог «ГородЪЪ»",
      "description": "Выраблены па асаблівай тэхналогіі, якая захоўвае водар і смак сапраўднага вясковага тварагу."
    },
    "en": {
      "name": "Cottage cheese \"Goroden\"",
      "description": "Produced using a special technology that preserves the aroma and taste of real village cottage cheese."
    },
    "zh": {
      "name": "干酪“Goroden”",
      "description": "采用特殊技术生产，保留了真正乡村奶酪的香气和味道。"
    }
  },
  "tvorog-active-life": {
    "be": {
      "name": "Тварог ГМ «Active life»",
      "description": "Тварог 3% тлустасці, узбагачаны прабіётыкі. Валодае высокімі дыетычнымі ўласцівасцямі і спрыяе ўмацаванню імунітэту."
    },
    "en": {
      "name": "Cottage cheese TM “Active life”",
      "description": "Cottage cheese 3% fat, enriched with probiotics. It has high dietary properties and helps strengthen the immune system."
    },
    "zh": {
      "name": "白干酪TM“积极生活”",
      "description": "白干酪，脂肪含量 3%，富含益生菌。它具有很高的饮食特性，有助于增强免疫系统。"
    }
  },
  "tvorog-vesovoy": {
    "be": {
      "name": "Тварог вагавы",
      "description": "Традыцыйны тварог тлустасцю 1%, 6% і 10% з натуральнага малака без кансервантаў."
    },
    "en": {
      "name": "Cottage cheese by weight",
      "description": "Traditional cottage cheese with fat content of 1%, 6% and 10% from natural milk without preservatives."
    },
    "zh": {
      "name": "干酪重量",
      "description": "传统干酪，脂肪含量为 1%、6% 和 10%，来自天然牛奶，不含防腐剂。"
    }
  },
  "tvorog-brik": {
    "be": {
      "name": "Тварог (брыкет)",
      "description": "Класічны брыкетаваны тварог 1%, 6% і 10% тлустасці - крыніца прыроднага кальцыя і лёгказасваяльнага малочнага бялку для ўсёй сям'і."
    },
    "en": {
      "name": "Cottage cheese (briquette)",
      "description": "Classic briquetted cottage cheese with 1%, 6% and 10% fat content is a source of natural calcium and easily digestible milk protein for the whole family."
    },
    "zh": {
      "name": "干酪（块状）",
      "description": "经典的块状干酪，脂肪含量为 1%、6% 和 10%，是全家人天然钙和易于消化的牛奶蛋白的来源。"
    }
  },
  "maslo-goroden": {
    "be": {
      "name": "Масла салодка- сметанковае «ГородЪЪ»",
      "description": "Выраблена па спецыяльнай тэхналогіі з адборных вяршкоў без раслінных тлушчаў. Прадстаўлена тлустасцю 72,5 працэнта і 82,5 працэнта ў фасоўцы ад 180 г да 2 кг."
    },
    "en": {
      "name": "Sweet cream butter \"Goroden\"",
      "description": "Made using special technology from selected cream without vegetable fats. Presented with fat content of 72.5% and 82.5% in packaging from 180 g to 2 kg."
    },
    "zh": {
      "name": "甜奶油黄油“Goroden”",
      "description": "采用特殊技术，精选不含植物脂肪的奶油制成。包装形式为 180 克至 2 公斤，脂肪含量分别为 72.5% 和 82.5%。"
    }
  },
  "maslo-vesovoe": {
    "be": {
      "name": "Масла салодкавяршковае несоленае вагавае (20 кг)",
      "description": "Натуральнае сметанковае масла 72,5% і 82,5% тлустасці ў прамысловых корабах-маналітах па 20 кг для харчовай прамысловасці, пякарняў і міжнароднага экспарту."
    },
    "en": {
      "name": "Sweet cream unsalted butter by weight (20 kg)",
      "description": "Natural butter 72.5% and 82.5% fat in industrial monolithic boxes of 20 kg for the food industry, bakeries and international export."
    },
    "zh": {
      "name": "甜奶油无盐黄油按重量（20公斤）",
      "description": "天然黄油 72.5% 和脂肪 82.5%，装在 20 公斤工业整体盒中，用于食品工业、面包店和国际出口。"
    }
  },
  "maslo-bezlaktoznoe": {
    "be": {
      "name": "Масла безлактознае 82,5%",
      "description": "Насычаны густ натуральных вяршкоў пры поўным расшчапленні лактозы. Падыходзіць для бутэрбродаў, каш і хатняй выпечкі."
    },
    "en": {
      "name": "Lactose-free butter 82.5%",
      "description": "Rich taste of natural cream with complete breakdown of lactose. Suitable for sandwiches, porridges and homemade baked goods."
    },
    "zh": {
      "name": "无乳糖黄油 82.5%",
      "description": "天然奶油的浓郁味道，乳糖完全分解。适用于三明治、粥和自制烘焙食品。"
    }
  },
  "maslo-s-napolnitelyami": {
    "be": {
      "name": "Масла з напаўняльнікамі (у шкле)",
      "description": "Далікатэснае масла 82,5% у шкляным слоіку: з труфелем і марской соллю, з таматамі па-італьянску, з сычуаньскім перцам. Ідэальны акцэнт да стейка, пасты і цёпламу хлебу."
    },
    "en": {
      "name": "Oil with fillers (in glass)",
      "description": "Gourmet oil 82.5% in a glass jar: with truffle and sea salt, with Italian tomatoes, with Sichuan pepper. The perfect accompaniment to steak, pasta and warm bread."
    },
    "zh": {
      "name": "带填料的油（玻璃）",
      "description": "玻璃罐中 82.5% 的优质油：搭配松露和海盐、意大利番茄、四川辣椒。是牛排、意大利面和热面包的完美搭配。"
    }
  },
  "maslo-kisloslivochnoe-goroden": {
    "be": {
      "name": "Масла кісласливкавае салёнае «ГородЪЪ»",
      "description": "Сквашанае закваскай салёнае сметанковае масла 80% тлустасці - надае пікантнасць страў з хлебам, гароднінай і морапрадуктамі."
    },
    "en": {
      "name": "Salted sour cream butter \"Goroden\"",
      "description": "Salted butter fermented with sourdough, 80% fat, adds piquancy to dishes with bread, vegetables and seafood."
    },
    "zh": {
      "name": "咸酸奶油黄油“Goroden”",
      "description": "用酵母发酵而成的咸黄油，脂肪含量为 80%，可为面包、蔬菜和海鲜菜肴增添辛辣味。"
    }
  },
  "maslo-fasovannoe": {
    "be": {
      "name": "Масла салодкавяршковае несоленае фасаванае",
      "description": "Класічны несоленае салодкаалівачны алей 65%, 72,5% і 74% тлустасці са свежых вяршкоў у фальзе 180 г."
    },
    "en": {
      "name": "Packaged unsalted sweet cream butter",
      "description": "Classic unsalted sweet cream butter 65%, 72.5% and 74% fat from fresh cream in foil 180 g."
    },
    "zh": {
      "name": "包装无盐甜奶油黄油",
      "description": "经典无盐甜奶油黄油，含 65%、72.5% 和 74% 新鲜奶油脂肪，铝箔包装，180 克。"
    }
  },
  "morozhenoe-goroden": {
    "be": {
      "name": "Марозіва «ГарадэнЪ» (пламбір 20%)",
      "description": "Прэміяльны пламбір 20% тлустасці з натуральнай ваніллю або какава ў хрумсткай вафельнай шкляначцы."
    },
    "en": {
      "name": "Ice cream \"Goroden\" (ice cream 20%)",
      "description": "Premium ice cream 20% fat with natural vanilla or cocoa in a crispy waffle cup."
    },
    "zh": {
      "name": "冰淇淋“Goroden”（冰淇淋20%）",
      "description": "优质冰淇淋，含 20% 脂肪，搭配天然香草或可可，装在脆皮华夫饼杯中。"
    }
  },
  "plombir-goroden-rozhok": {
    "be": {
      "name": "Пламбір \"ГородЪЪ\" у вафельным цукровым ражку",
      "description": "Насычаны пламбір 15% тлустасці ў хрумсткім цукровым ражку са густамі ванілі, шакаладу і крэм-брюле."
    },
    "en": {
      "name": "Ice cream \"Goroden\" in a waffle sugar cone",
      "description": "Rich ice cream 15% fat in a crispy sugar cone with vanilla, chocolate and creme brulee flavors."
    },
    "zh": {
      "name": "华夫饼甜筒冰淇淋“Goroden”",
      "description": "香脆甜筒中含有 15% 脂肪的浓郁冰淇淋，具有香草、巧克力和焦糖布丁口味。"
    }
  },
  "morozhenoe-active-protein": {
    "be": {
      "name": "Марозіва пратэінавае «Active Protein»",
      "description": "Першае парцыённае пратэінавае марожанае ў Беларусі: 12 г бялку на 100 г (3% тлушчу), без цукру, без ГМА і кансервантаў. Шкляначка з лыжачкай ўнутры."
    },
    "en": {
      "name": "Protein ice cream \"Active Protein\"",
      "description": "The first portioned protein ice cream in Belarus: 12 g of protein per 100 g (3% fat), no sugar, no GMOs and no preservatives. A glass with a spoon inside."
    },
    "zh": {
      "name": "蛋白质冰淇淋“活性蛋白质”",
      "description": "白俄罗斯首款分份蛋白质冰淇淋：每 100 克含有 12 克蛋白质（3% 脂肪），无糖、无转基因生物、无防腐剂。一个玻璃杯，里面有一个勺子。"
    }
  },
  "morozhenoe-bezlaktoznoe-active-life": {
    "be": {
      "name": "Марозіва безлактозная «Active life»",
      "description": "Распрацавана сумесна з Інстытутам мяса-малочнай прамысловасці для людзей з непераноснасцю лактозы. Пламбір 15% з ваніллю або какава ў вафлевым шкляначцы."
    },
    "en": {
      "name": "Lactose-free ice cream “Active life”",
      "description": "Developed together with the Institute of Meat and Dairy Industry for people with lactose intolerance. Ice cream 15% with vanilla or cocoa in a waffle cup."
    },
    "zh": {
      "name": "无乳糖冰淇淋“活力生活”",
      "description": "与肉类和乳制品工业研究所共同为乳糖不耐症患者开发。 15% 冰淇淋，加香草或可可，装在华夫饼杯中。"
    }
  },
  "morozhenoe-coffee-break": {
    "be": {
      "name": "Марозіва пламбір «Coffee Break»",
      "description": "Спалучэнне далікатнага пламбіру 15% і кававых напояў: \"Капучына\", \"Зялёны чай Матчу\" і \"Какосавы Раф\" у вафельнай шкляначцы."
    },
    "en": {
      "name": "Ice cream \"Coffee Break\"",
      "description": "A combination of delicate ice cream 15% and coffee drinks: “Cappuccino”, “Matcha Green Tea” and “Coconut Rough” in a waffle cup."
    },
    "zh": {
      "name": "冰淇淋“咖啡时间”",
      "description": "精致冰淇淋 15% 和咖啡饮料的组合：华夫饼杯中的“卡布奇诺”、“抹茶绿茶”和“椰子原味”。"
    }
  },
  "morozhenoe-uznay-mir": {
    "be": {
      "name": "Марозіва «Даведайся пра свет»",
      "description": "Калекцыя дэсертных густаў у шкляначцы 120 г з лыжачкай усярэдзіне: яблычны штрудель, вішнёвы браўні, тварожнік з малінай і чарнічны мафін."
    },
    "en": {
      "name": "Ice cream “Discover the world”",
      "description": "A collection of dessert flavors in a 120 g glass with a spoon inside: apple strudel, cherry brownie, raspberry cheesecake and blueberry muffin."
    },
    "zh": {
      "name": "冰淇淋“发现世界”",
      "description": "一系列甜点口味装在 120 克玻璃杯中，内含勺子：苹果馅饼、樱桃布朗尼、覆盆子芝士蛋糕和蓝莓松饼。"
    }
  },
  "morozhenoe-simfoniya-vkusa": {
    "be": {
      "name": "Марозіва «Сімфонія густу»",
      "description": "Высакародны пламбір 15% у шакаладнай глазуры: фісташка, марцыпан з какавы і какос."
    },
    "en": {
      "name": "Ice cream “Symphony of taste”",
      "description": "Noble ice cream 15% in chocolate glaze: pistachio, marzipan with cocoa and coconut."
    },
    "zh": {
      "name": "冰淇淋“味觉交响曲”",
      "description": "Noble 冰淇淋 15% 巧克力釉：开心果、杏仁糖、可可和椰子。"
    }
  },
  "morozhenoe-tropic": {
    "be": {
      "name": "Марозіва Tropic (у цукровым ражку)",
      "description": "Трапічны пламбір 16% у хрумсткім вафельным цукровым ражку: манга, чырвоны апельсін з чорнай парэчкай і базілікам, цытрына-лайм."
    },
    "en": {
      "name": "Tropic Ice Cream (in a sugar cone)",
      "description": "Tropical ice cream 16% in a crispy wafer sugar cone: mango, blood orange with blackcurrant and basil, lemon-lime."
    },
    "zh": {
      "name": "热带冰淇淋（甜筒）",
      "description": "脆脆威化糖筒中的热带冰淇淋 16%：芒果、血橙、黑醋栗和罗勒、柠檬酸橙。"
    }
  },
  "morozhenoe-ice-time": {
    "be": {
      "name": "Марожанае пламбір «Ice time» у вафельным цукровым ражку",
      "description": "Вытанчаныя густы ў хрумсткім цукровым ражку: салёная карамель, фундук-какао, халвічная асалода і карамельны папкорн."
    },
    "en": {
      "name": "Ice cream “Ice time” in a waffle sugar cone",
      "description": "Delicious flavors in a crunchy sugar cone: salted caramel, hazelnut cocoa, halvish delight and caramel popcorn."
    },
    "zh": {
      "name": "华夫饼甜筒冰淇淋“冰冻时间”",
      "description": "松脆甜筒中的美味：咸焦糖、榛子可可、半甜果仁和焦糖爆米花。"
    }
  },
  "morozhenoe-slivochnoe-vanil": {
    "be": {
      "name": "Марозіва сметанковае з водарам ванілі (у ражку)",
      "description": "Лёгкае сметанковае марожанае (9% тлушчу) з водарам ванілі ў хрумсткім вафлевым ражку 100 г."
    },
    "en": {
      "name": "Creamy ice cream with vanilla flavor (in a cone)",
      "description": "Light creamy ice cream (9% fat) with vanilla flavor in a crispy waffle cone 100 g."
    },
    "zh": {
      "name": "香草味奶油冰淇淋（甜筒）",
      "description": "淡奶油冰淇淋（9% 脂肪），香草味，脆皮华夫饼蛋卷，100 克。"
    }
  },
  "morozhenoe-bela-bovino": {
    "be": {
      "name": "Марозіва пламбір двухслаёвы Bela Bovino",
      "description": "Яркі двухслаёвы пламбір 15% са густамі «Бабл-гам» і трускаўкі з ваніллю ў хрумсткім вафлевым конусе."
    },
    "en": {
      "name": "Ice cream ice cream two-layer Bela Bovino",
      "description": "Bright two-layer ice cream 15% with the flavors of “Bubble Gum” and strawberry with vanilla in a crispy waffle cone."
    },
    "zh": {
      "name": "冰淇淋冰淇淋两层 Bela Bovino",
      "description": "明亮的 15% 两层冰淇淋，带有“泡泡糖”和草莓香草的味道，装在脆皮华夫饼蛋筒中。"
    }
  },
  "morozhenoe-slivochnoe-stakanchik": {
    "be": {
      "name": "Марозіва «Сметанковае» ў шкляначцы",
      "description": "Сметанковае марозіва 9% тлустасці з паніжанай каларыйнасцю: ваніль, какава і двухслаёвае ў вафельнай шкляначцы 100 г і пластыкавай шклянцы 250 г з лыжкай."
    },
    "en": {
      "name": "Creamy ice cream in a glass",
      "description": "Creamy ice cream 9% fat with reduced calorie content: vanilla, cocoa and two-layer in a 100 g waffle cup and a 250 g plastic cup with a spoon."
    },
    "zh": {
      "name": "玻璃杯中的奶油冰淇淋",
      "description": "奶油冰淇淋，脂肪含量为 9%，热量含量较低：香草、可可和两层，装在 100 克华夫饼杯和 250 克塑料杯（带勺子）中。"
    }
  },
  "morozhenoe-stak": {
    "be": {
      "name": "Марозіва пламбір з напаўняльнікамі (у шкляначцы)",
      "description": "Арыгінальныя густы пламбіру 16% у вафельнай шкляначцы 100 г: фісташка, цытрына-імбір, марозны журавіны і ананас-абляпіха."
    },
    "en": {
      "name": "Ice cream with fillings (in a cup)",
      "description": "Original flavors of ice cream 16% in a 100 g waffle cup: pistachio, lemon-ginger, frosty cranberry and pineapple-sea buckthorn."
    },
    "zh": {
      "name": "带馅料的冰淇淋（装在杯子里）",
      "description": "100 克华夫饼杯中含有 16% 冰淇淋原味：开心果、柠檬姜、糖霜蔓越莓和菠萝沙棘。"
    }
  },
  "morozhenoe-sorbit": {
    "be": {
      "name": "Марозіва з падсалодвальнікаў сорбіт у вафельнай шкляначцы",
      "description": "Пламбір 14% без цукру з падсалодвальнікаў сорбіт. Падыходзіць для тых, хто абмяжоўвае спажыванне цукру, і для дыябетычнага харчавання."
    },
    "en": {
      "name": "Ice cream with sorbitol sweetener in a waffle cup",
      "description": "Ice cream 14% sugar-free with sorbitol sweetener. Suitable for those who limit their sugar intake and for diabetic diets."
    },
    "zh": {
      "name": "华夫饼杯中含有山梨糖醇甜味剂的冰淇淋",
      "description": "冰淇淋 14% 无糖，含有山梨糖醇甜味剂。适合那些限制糖摄入量和糖尿病饮食的人。"
    }
  },
  "morozhenoe-s-izyumom": {
    "be": {
      "name": "Марозіва з разынкамі ў вафельнай шкляначцы",
      "description": "Класічнае спалучэнне сметанковага пламбіру 15% з адборнай разынкамі і водарам ванілі ў вафельнай шкляначкі."
    },
    "en": {
      "name": "Ice cream with raisins in a waffle cup",
      "description": "A classic combination of 15% creamy ice cream with selected raisins and vanilla aroma in a waffle cup."
    },
    "zh": {
      "name": "华夫饼杯里有葡萄干的冰淇淋",
      "description": "华夫饼杯中 15% 奶油冰淇淋与精选葡萄干和香草香气的经典组合。"
    }
  },
  "morozhenoe-pushok": {
    "be": {
      "name": "Марозіва «Пушок» у вафельнай шкляначцы.",
      "description": "Пламбір 14% з водарам ванілі, узбагачаны кальцыем, у класічнай вафельнай шкляначцы."
    },
    "en": {
      "name": "Ice cream “Pushok” in a waffle cup",
      "description": "Ice cream 14% with vanilla flavor, enriched with calcium, in a classic waffle cup."
    },
    "zh": {
      "name": "华夫饼杯中的冰淇淋“Pushok”",
      "description": "冰淇淋 14% 香草味，富含钙，装在经典的华夫饼杯中。"
    }
  },
  "morozhenoe-shayba": {
    "be": {
      "name": "Марозіва «Шайба»",
      "description": "Эскімо пламбір 15% з водарам ванілі ў какавазмяшчальнай глазуры ў арыгінальнай форме хакейнай шайбы."
    },
    "en": {
      "name": "Ice cream \"Shayba\"",
      "description": "Eskimo ice cream 15% with vanilla flavor in cocoa-containing glaze in the original shape of a hockey puck."
    },
    "zh": {
      "name": "冰淇淋“沙巴”",
      "description": "爱斯基摩冰淇淋 15% 香草味，含可可釉，冰球形状。"
    }
  },
  "morozhenoe-plombir-eskimo": {
    "be": {
      "name": "Марозіва «Пламбір» эскімо",
      "description": "Класічнае эскімо 15% тлустасці: з водарам ванілі, з какавы і з разынкамі ў какавазмяшчальнай глазуры."
    },
    "en": {
      "name": "Ice cream \"Plombir\" popsicle",
      "description": "Classic popsicle 15% fat: with vanilla flavor, cocoa and raisins in cocoa-containing glaze."
    },
    "zh": {
      "name": "冰淇淋“Plombi”冰棒",
      "description": "经典冰棒 15% 脂肪：香草味、可可和葡萄干，含可可釉。"
    }
  },
  "desert-summertime": {
    "be": {
      "name": "Дэсерт замарожаны з сыроваткі \"SummerTime\"",
      "description": "Асвяжальны нізкатлушчавай (0,4%) замарожаны дэсерт на аснове натуральнай малочнай сыроваткі з густам персік-маракуя і апельсін."
    },
    "en": {
      "name": "Frozen dessert made from “SummerTime” whey",
      "description": "A refreshing low-fat (0.4%) frozen dessert based on natural whey with peach-passion fruit and orange flavors."
    },
    "zh": {
      "name": "由“SummerTime”乳清制成的冷冻甜点",
      "description": "一种清爽的低脂 (0.4%) 冷冻甜点，以天然乳清为基础，带有桃子、百香果和橙子口味。"
    }
  },
  "morozhenoe-plombir-krupnaya": {
    "be": {
      "name": "Марозіва «Пламбір» у буйной фасоўцы (250 г)",
      "description": "Пламбір 16% у зручным сямейным шкляначцы 250 г з лыжачкай - для дома, дарогі і адпачынку. Густы: ваніль, какава, салёная карамель."
    },
    "en": {
      "name": "Ice cream “Plombir” in large packaging (250 g)",
      "description": "Ice cream 16% in a convenient family cup 250 g with a spoon - for home, travel and leisure. Flavors: vanilla, cocoa, salted caramel."
    },
    "zh": {
      "name": "大包装冰淇淋“Plomir”（250 克）",
      "description": "冰淇淋 16%，装在方便的家庭杯中，250 克，带勺子 - 适合家庭、旅行和休闲。口味：香草、可可、咸焦糖。"
    }
  },
  "plombir-vesovoy": {
    "be": {
      "name": "Пламбір вагавы HoReCa (2,7 кг)",
      "description": "Буйны гастранамічны кантэйнер 2,7 кг з цэльнага малака і свежых вяршкоў для рэстаранаў, кафэ і джэлатэрый - 18 густаў, уключаючы дубайскую, фруктовую і класічную лінейкі."
    },
    "en": {
      "name": "Weight ice cream HoReCa (2.7 kg)",
      "description": "Large 2.7 kg gastronomic container made from whole milk and fresh cream for restaurants, cafes and gelaterias - 18 flavors, including Dubai, fruit and classic lines."
    },
    "zh": {
      "name": "重量冰淇淋 HoReCa（2.7 公斤）",
      "description": "由全脂牛奶和鲜奶油制成的大型 2.7 公斤美食容器，适用于餐厅、咖啡馆和冰淇淋店 - 18 种口味，包括迪拜口味、水果口味和经典口味。"
    }
  },
  "plombir-v-tubakh": {
    "be": {
      "name": "Пламбір у тубах (1 кг)",
      "description": "Класічны сметанковы пламбір 16% з водарам ванілі ці какавы ў зручнай сямейнай тубе вагой 1 кг."
    },
    "en": {
      "name": "Ice cream in tubes (1 kg)",
      "description": "Classic creamy ice cream 16% with vanilla or cocoa flavor in a convenient family tube weighing 1 kg."
    },
    "zh": {
      "name": "管装冰淇淋（1公斤）",
      "description": "经典奶油冰淇淋 16%，香草或可可味，装在方便的家庭用管中，重 1 公斤。"
    }
  },
  "slivochnyy-krem": {
    "be": {
      "name": "Сметанковы крэм 33% (для ўзбівання)",
      "description": "Сліўкі 33% з узмоцненай стабільнасцю для кандытараў і хатняй выпечкі. Без раслінных тлушчаў і кансервантаў - толькі свежыя вяршкі і прыродны карагінан. Узбіваюцца за лічаныя секунды і трымаюць форму."
    },
    "en": {
      "name": "Butter cream 33% (for whipping)",
      "description": "Cream 33% with enhanced stability for confectioners and home baked goods. Without vegetable fats and preservatives - only fresh cream and natural carrageenan. They whip up in a matter of seconds and hold their shape."
    },
    "zh": {
      "name": "奶油33%（搅打用）",
      "description": "奶油 33%，具有增强的稳定性，适用于糖果和家庭烘焙食品。不含植物脂肪和防腐剂 - 仅新鲜奶油和天然卡拉胶。它们会在几秒钟内迅速膨胀并保持形状。"
    }
  },
  "slivki-sterilizovannye": {
    "be": {
      "name": "Сліўкі стэрылізаваныя",
      "description": "Стэрылізаваныя вяршкі тлустасцю 10%, 20% і 33% у асептычнай упакоўцы Tetra Pak 500 г і 980 г для кавы, гарбаты, соусаў і кандытарскіх вырабаў."
    },
    "en": {
      "name": "Sterilized cream",
      "description": "Sterilized cream with fat content of 10%, 20% and 33% in aseptic Tetra Pak packaging 500 g and 980 g for coffee, tea, sauces and confectionery."
    },
    "zh": {
      "name": "灭菌霜",
      "description": "无菌利乐包装中脂肪含量为 10%、20% 和 33% 的灭菌奶油 500 克和 980 克，用于咖啡、茶、酱汁和糖果。"
    }
  },
  "slivki-tet": {
    "be": {
      "name": "Сліўкі пітныя",
      "description": "Свежыя пітныя вяршкі 10% і 12% з суцэльнага малака без кансервантаў ва ўпакоўках Pure Pack і ПЭТ-бутэльках 500 г."
    },
    "en": {
      "name": "Drinking cream",
      "description": "Fresh drinking cream 10% and 12% from whole milk without preservatives in Pure Packs and 500 g PET bottles."
    },
    "zh": {
      "name": "饮用奶油",
      "description": "新鲜饮用奶油 10% 和 12% 来自全脂牛奶，不含防腐剂，采用纯包装和 500 克 PET 瓶装。"
    }
  },
  "syrok-active-protein": {
    "be": {
      "name": "Тварожны пратэінавы сырок Active Protein",
      "description": "20 г чыстага бялку ў 100 г прадукта і без дадання цукру! Далікатна-крэмавая тэкстура з ванільным, клубнічным ці бананавым густам - для перакусу пасля трэніроўкі."
    },
    "en": {
      "name": "Curd protein cheese Active Protein",
      "description": "20 g of pure protein per 100 g of product and no added sugar! Delicately creamy texture with vanilla, strawberry or banana flavors - for a post-workout snack."
    },
    "zh": {
      "name": "凝乳蛋白奶酪活性蛋白",
      "description": "每 100 克产品含有 20 克纯蛋白质，且不添加糖！细腻的奶油质地，带有香草、草莓或香蕉口味 - 适合锻炼后的零食。"
    }
  },
  "syrok-glazirovannyy-goroden": {
    "be": {
      "name": "Сырок глазураваны \"ГородЪЪ\"",
      "description": "Спалучэнне далікатнай тварогавай масы (26% тлустасці) з хрумсткай шакаладнай глазурай - ванільны, з какавы і «Крэм-брюле» з вараным згушчаным малаком."
    },
    "en": {
      "name": "Glazed cheese \"Goroden\"",
      "description": "A combination of delicate curd mass (26% fat) with crispy chocolate glaze - vanilla, cocoa and “Creme Brulee” with boiled condensed milk."
    },
    "zh": {
      "name": "釉面奶酪“Goroden”",
      "description": "细腻的凝乳块（26% 脂肪）与脆脆的巧克力酱的组合 - 香草、可可和“焦糖布丁”以及煮炼乳。"
    }
  },
  "syrok-simfoniya-vkusa": {
    "be": {
      "name": "Сырок глазураваны «Сімфонія густу»",
      "description": "Высакародныя спалучэнні густаў у шакаладнай глазуры: фісташка, марцыпан з какавы і какос."
    },
    "en": {
      "name": "Glazed cheese \"Symphony of taste\"",
      "description": "Noble combinations of flavors in chocolate glaze: pistachio, marzipan with cocoa and coconut."
    },
    "zh": {
      "name": "釉面奶酪“味觉交响曲”",
      "description": "巧克力淋面的高贵风味组合：开心果、杏仁糖、可可和椰子。"
    }
  },
  "syrok-uznay-mir": {
    "be": {
      "name": "Сырок глазураваны «Даведайся Свет»",
      "description": "Тварожныя глазураваныя сыркі з густамі папулярных дэсертаў свету: \"Дубайскі шакалад\", \"Яблычны штрудзель\", \"Вішнёвы браўні\", \"Чызкейк з малінай\", \"Імбірны пернік\" і \"Чарнічны мафін\"."
    },
    "en": {
      "name": "Glazed cheese \"Discover the World\"",
      "description": "Glazed curd cheesecakes with the flavors of popular desserts around the world: “Dubai chocolate”, “Apple strudel”, “Cherry brownie”, “Raspberry cheesecake”, “Gingerbread” and “Blueberry muffin”."
    },
    "zh": {
      "name": "釉面奶酪“发现世界”",
      "description": "釉面凝乳芝士蛋糕具有世界各地流行甜点的口味：“迪拜巧克力”、“苹果馅饼”、“樱桃布朗尼”、“覆盆子芝士蛋糕”、“姜饼”和“蓝莓松饼”。"
    }
  },
  "syrok-kartoshka": {
    "be": {
      "name": "Сырак глазураваны «Бульба»",
      "description": "Глазураваны тварожны сырок з какавы і духмяным печывам «Бульба» са свежага тварагу і сметанковага масла."
    },
    "en": {
      "name": "Glazed cheese \"Potato\"",
      "description": "Glazed curd cheese with cocoa and aromatic Potato cookies made from fresh cottage cheese and butter."
    },
    "zh": {
      "name": "釉面奶酪“土豆”",
      "description": "釉面凝乳干酪配可可和由新鲜干酪和黄油制成的芳香土豆饼干。"
    }
  },
  "syrok-tvorozhnyy-glazirovannyy": {
    "be": {
      "name": "Сырок тварожны глазураваны",
      "description": "Класічныя тварожныя сыркі ў глазуры: з водарам ванілі, з начыннем «лясная ягада», «бульба» і з начыннем карамель на печыва."
    },
    "en": {
      "name": "Glazed curd cheese",
      "description": "Classic curd cheesecakes in glaze: with vanilla flavor, with wild berry, potato filling and with caramel filling on cookies."
    },
    "zh": {
      "name": "釉面凝乳干酪",
      "description": "经典的釉面凝乳芝士蛋糕：香草味、野莓、土豆馅和焦糖馅的饼干。"
    }
  },
  "syrok-tvorozhnyy-sladkiy": {
    "be": {
      "name": "Сырак тварожны салодкі (90 г)",
      "description": "Далікатная лёгказасваяльная тварогавая маса 5% тлустасці без глазуры: з водарам ванілі, з разынкамі і са згушчаным вараным малаком."
    },
    "en": {
      "name": "Sweet curd cheese (90 g)",
      "description": "Delicate, easily digestible curd mass of 5% fat without glaze: with vanilla flavor, with raisins and with condensed boiled milk."
    },
    "zh": {
      "name": "甜凝乳干酪（90 克）",
      "description": "细腻、易消化的凝乳块，含 5% 脂肪，无釉料：带有香草味、葡萄干和炼乳。"
    }
  },
  "krem-tvorozhnyy-s-shokoladom": {
    "be": {
      "name": "Крэм тварожны з шакаладам",
      "description": "Далікатны мяккі тварогавы дэсерт 3% з цёмным шакаладным паліваннем - ваніль, трускаўка ці манга."
    },
    "en": {
      "name": "Curd cream with chocolate",
      "description": "Delicate soft curd dessert 3% with dark chocolate topping - vanilla, strawberry or mango."
    },
    "zh": {
      "name": "凝乳奶油与巧克力",
      "description": "精致的软凝乳甜点 3%，配以黑巧克力配料 - 香草、草莓或芒果。"
    }
  },
  "krem-tvorozhnyy-dvukhsloynyy": {
    "be": {
      "name": "Крэм тварожны двухслаёвы",
      "description": "Паветраны тварожны крэм «Bela Bovino» 3% з фруктова-ягаднымі напаўняльнікамі: суніца, ажына і экзотык."
    },
    "en": {
      "name": "Double-layer curd cream",
      "description": "Airy curd cream “Bela Bovino” 3% with fruit and berry fillings: strawberries, blackberries and exotic."
    },
    "zh": {
      "name": "双层凝乳霜",
      "description": "空气感凝乳“Bela Bovino”3%，含有水果和浆果馅料：草莓、黑莓和异国情调。"
    }
  },
  "krem-tvorozhnyy-vzbityy": {
    "be": {
      "name": "Крэм тварожны ўзбіты «Бялок патрэбен усім»",
      "description": "Лёгкі як воблачка ўзбіты тварожны дэсерт ГМ «Бялок патрэбен усім» са густамі ванілі, трускаўкі і манга."
    },
    "en": {
      "name": "Whipped curd cream “Everyone needs protein”",
      "description": "Light as a cloud whipped curd dessert TM “Everyone Needs Protein” with vanilla, strawberry and mango flavors."
    },
    "zh": {
      "name": "鲜奶油“每个人都需要蛋白质”",
      "description": "轻盈如云的搅打凝乳甜点TM“每个人都需要蛋白质”，具有香草、草莓和芒果口味。"
    }
  },
  "moloko-sukhoe-obezzhirennoe": {
    "be": {
      "name": "Малако сухое абястлушчанае (САМ)",
      "description": "Натуральны прадукт распыляльнай сушкі з пастэрызаванага абястлушчанага малака. Змяшчае 34 г бялку на 100 г і практычна не змяшчае тлушчу. Даступна ў прамысловых мяшках 25 кг (гатунак \"Экстра\") і рознічнай фасоўцы 0,5 кг."
    },
    "en": {
      "name": "Powdered skimmed milk (SOM)",
      "description": "A natural spray-dried product from pasteurized skim milk. Contains 34 g of protein per 100 g and contains virtually no fat. Available in 25 kg industrial bags (Extra grade) and 0.5 kg retail packaging."
    },
    "zh": {
      "name": "脱脂奶粉 (SOM)",
      "description": "巴氏灭菌脱脂奶的天然喷雾干燥产品。每100克含有34克蛋白质，几乎不含脂肪。采用 25 公斤工业袋（特级）和 0.5 公斤零售包装。"
    }
  },
  "pms": {
    "be": {
      "name": "Прадукт малочны сухі (ПМС)",
      "description": "Універсальны сухі малочны прадукт, які атрымліваецца беражлівым высушваннем нармалізаванага каровінага малака. 32 г вавёрка на 100 г, тэрмін прыдатнасці 24 месяцы."
    },
    "en": {
      "name": "Dry milk product (PMS)",
      "description": "A universal dry milk product obtained by carefully drying normalized cow's milk. 32 g of protein per 100 g, shelf life 24 months."
    },
    "zh": {
      "name": "干奶制品（PMS）",
      "description": "通过仔细干燥标准化牛奶而获得的通用干奶产品。每100克含蛋白质32克，保质期24个月。"
    }
  },
  "syvorotka-sd-40": {
    "be": {
      "name": "Сыроватка малочная сухая дэмінералізаваная СД-40",
      "description": "Спецыялізаваны сухі інгрэдыент, атрыманы сушкай і дэмінералізацыяй свежай малочнай сыроваткі. Каштоўны кампанент для кандытарскай галіны і здаровага харчавання."
    },
    "en": {
      "name": "Whey powder demineralized SD-40",
      "description": "A specialized dry ingredient obtained by drying and demineralizing fresh whey. A valuable component for the confectionery industry and healthy nutrition."
    },
    "zh": {
      "name": "脱盐乳清粉 SD-40",
      "description": "通过干燥和脱盐新鲜乳清而获得的特殊干燥成分。糖果行业和健康营养的重要组成部分。"
    }
  },
  "syvorotka-tvorozhnaya-sd-40": {
    "be": {
      "name": "Сыроватка малочная сухая тварожная дэмінералізаваная СД-40",
      "description": "Дэмінералізаваная тварожная сыроватка з чыстым мяккім густам для прадуктаў дзіцячага, дыетычнага і спартыўнага харчавання."
    },
    "en": {
      "name": "Whey powder curd demineralized SD-40",
      "description": "Demineralized curd whey with a pure, mild taste for children's, dietary and sports nutrition products."
    },
    "zh": {
      "name": "脱盐乳清粉凝乳 SD-40",
      "description": "脱盐凝乳清具有纯净、温和的味道，适用于儿童、膳食和运动营养产品。"
    }
  },
  "zcm": {
    "be": {
      "name": "Заменнік суцэльнага малака (ЗЦМ)",
      "description": "Збалансаваныя кармавыя сухія сумесі для выпойвання цялят (МИЛК-2, МИЛК-6, МИЛК-18) і парасят (МИЛК-15) з волкім пратэінам 18-22% у мяшках па 25 кг."
    },
    "en": {
      "name": "Whole milk substitute (WMS)",
      "description": "Balanced dry feed mixtures for feeding calves (MILK-2, MILK-6, MILK-18) and piglets (MILK-15) with crude protein 18–22% in 25 kg bags."
    },
    "zh": {
      "name": "全脂代乳品 (WMS)",
      "description": "用于喂养犊牛（MILK-2、MILK-6、MILK-18）和仔猪（MILK-15）的均衡干饲料混合物，粗蛋白含量为 18-22%，装在 25 公斤袋装中。"
    }
  },
  "voda-aqua-365": {
    "be": {
      "name": "Вада пітная «AQUA 365»",
      "description": "Прыродная артэзіянская пітная вада са свідравіны глыбінёй 250 м (участак \"Парэчча\"). Праходзіць тры ступені ачысткі з захаваннем збалансаванага прыроднага складу."
    },
    "en": {
      "name": "Drinking water \"AQUA 365\"",
      "description": "Natural artesian drinking water from a well 250 m deep (Porechye site). It undergoes three stages of purification while maintaining a balanced natural composition."
    },
    "zh": {
      "name": "饮用水“AQUA 365”",
      "description": "来自 250 m 深井的天然自流饮用水（Porechye 遗址）。它经过三个阶段的纯化，同时保持平衡的天然成分。"
    }
  },
  "voda-kolozhskaya-premium": {
    "be": {
      "name": "Вада купажаваная «Каложская-Прэміум»",
      "description": "Мінеральная вада са свідравіны глыбінёй 446 м на тэрыторыі санаторыя \"Парэчча\". Па лячэбных уласцівасцях і складзе ідэнтычная крыніцам Друскінінкая."
    },
    "en": {
      "name": "Blended water \"Kolozhskaya-Premium\"",
      "description": "Mineral water from a well 446 m deep on the territory of the Porechye sanatorium. In terms of medicinal properties and composition, it is identical to the springs of Druskininkai."
    },
    "zh": {
      "name": "混合水“Kolozhskaya-Premium”",
      "description": "矿泉水来自 Porechye 疗养院境内 446 米深的井。就药用特性和成分而言，它与德鲁斯基宁凯泉水相同。"
    }
  },
  "voda-rodnaya": {
    "be": {
      "name": "Вада пітная «Родная»",
      "description": "Чыстая пітная негазаваная вада ў зручных кішэнных фарматах 0,25 л і 0,5 л для актыўнага дня."
    },
    "en": {
      "name": "Drinking water \"Native\"",
      "description": "Pure drinking still water in convenient pocket formats 0.25 l and 0.5 l for an active day."
    },
    "zh": {
      "name": "饮用水“原生”",
      "description": "方便的袋装纯净饮用水，容量为 0.25 升和 0.5 升，适合活跃的一天。"
    }
  },
  "dostavka-vody": {
    "be": {
      "name": "Дастаўка пітной вады \"AQUA 365\" (5-19 л)",
      "description": "Дастаўка артэзіянскай пітной вады \"AQUA 365\" са свідравіны № 30000/77 глыбінёй 256 м у офіс і дадому. Кулеры, помпы і аксэсуары. Заказ па тэл.: +375 (29) 282-22-22, +375 (29) 382-22-22, +375 (152) 60-40-27."
    },
    "en": {
      "name": "Delivery of drinking water “AQUA 365” (5–19 l)",
      "description": "Delivery of artesian drinking water “AQUA 365” from well No. 30000/77 with a depth of 256 m to the office and home. Coolers, pumps and accessories. Order by phone: +375 (29) 282-22-22, +375 (29) 382-22-22, +375 (152) 60-40-27."
    },
    "zh": {
      "name": "提供饮用水“AQUA 365”（5–19 升）",
      "description": "从深度 256 m 的 30000/77 号井向办公室和家庭输送自流饮用水“AQUA 365”。冷却器、泵和配件。通过电话订购：+375 (29) 282-22-22、+375 (29) 382-22-22、+375 (152) 60-40-27。"
    }
  },
  "napitok-coffee-break": {
    "be": {
      "name": "Напой малочны COFFEE BREAK",
      "description": "Астуджаныя кававыя малочныя напоі 1,3% у ПЭТ-бутэльцы 280 г: Капучына, Латте, Бамбл-кава, Зялёны чай-матча, Какосавы раф і Капучына безлактозны."
    },
    "en": {
      "name": "Milk drink COFFEE BREAK",
      "description": "Chilled coffee milk drinks 1.3% in a 280 g PET bottle: Cappuccino, Latte, Bumble coffee, Green tea matcha, Coconut raffe and Lactose-free cappuccino."
    },
    "zh": {
      "name": "牛奶饮料 咖啡休息",
      "description": "280 克 PET 瓶装 1.3% 冷冻咖啡牛奶饮料：卡布奇诺、拿铁、Bumble 咖啡、抹茶绿茶、椰浆咖啡和无乳糖卡布奇诺。"
    }
  },
  "napitok-milk": {
    "be": {
      "name": "Напой малочны MILK",
      "description": "Смачныя і пажыўныя малочныя кактэйлі 1,3% тлустасці з даданнем фруктова-ягадных напаўняльнікаў BERRY MILK і BANANA MILK."
    },
    "en": {
      "name": "Milk drink MILK",
      "description": "Delicious and nutritious milkshakes 1.3% fat with the addition of fruit and berry fillings BERRY MILK and BANANA MILK."
    },
    "zh": {
      "name": "牛奶饮料 MILK",
      "description": "美味营养的奶昔，脂肪含量为 1.3%，添加水果和浆果馅料（浆果奶和香蕉奶）。"
    }
  },
  "napitok-bio-ritm": {
    "be": {
      "name": "Сыроватачны напой «Бія-Рытм»",
      "description": "Лёгкі асвяжальны напой (0% тлушчу) на аснове натуральнай малочнай сыроваткі з сокам «Апельсін-манга» і «Персік-маракуя»."
    },
    "en": {
      "name": "Whey drink \"Bio-Rhythm\"",
      "description": "Light refreshing drink (0% fat) based on natural whey with Orange-Mango and Peach-Passion Fruit juice."
    },
    "zh": {
      "name": "乳清饮料“生物节奏”",
      "description": "清爽饮料（0% 脂肪），以天然乳清为基础，搭配橙芒果和桃子百香果汁。"
    }
  }
};
