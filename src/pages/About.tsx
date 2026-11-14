import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  Building2,
  CheckCircle2,
  Factory,
  Globe2,
  History,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  MapPin,
} from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { ASSETS } from '../data/assets';
import { SeoHead } from '../components/SeoHead';
import { ImageWithFallback } from '../components/ImageWithFallback';

export const About: React.FC = () => {
  const { language, t } = useLanguage();
  const [selectedStructureFilter, setSelectedStructureFilter] = useState<'all' | 'plants' | 'agro'>('all');

  const copy = {
    ru: {
      seoDesc:
      'ОАО «Молочный Мир» (milk.by): история с 1938 года, производственная структура в Гродно, Щучине и Дятлово, системы менеджмента качества, награды и экспорт.',
      badge: 'Орден Трудовой Славы · Основано в 1938 году',
      h1: 'ОАО «Молочный Мир» — эталон молочной отрасли Беларуси',
      lead:
      'Предприятие непрерывного цикла и один из крупнейших производителей молочной продукции в Республике Беларусь. Ежегодно на площадках компании перерабатывается около 600 тысяч тонн молока и выпускается свыше 200 наименований продукции — от более чем 60 сортов сыра и цельномолочной линейки до масла, мороженого, сухих молочных ингредиентов и минеральной воды «Поречье».',
      stats: [
        { metric: '~600 тыс. т', title: 'Переработка в год', desc: 'Около 1 500 тонн свежего молока ежесуточно от проверенных ферм.' },
        { metric: '200+ / 60+', title: 'Ассортимент и сыры', desc: 'Более 200 видов продукции, в том числе свыше 60 видов твёрдых и полутвёрдых сыров.' },
        { metric: '73%+ экспорт', title: '30+ стран мира', desc: 'Прямые поставки в СНГ, Китай, Юго-Восточную Азию и на Ближний Восток.' },
        { metric: '100%', title: 'Автоматизация и бережливость', desc: 'Современные закрытые линии переработки и собственный роботизированный логистический хаб.' },
      ],
      leadershipEyebrow: 'Стратегия и руководство',
      leadershipTitle: 'Три составляющие успеха: Инновации · Маркетинг · Инвестиции',
      leadershipBody:
      'С 2012 года предприятие возглавляет генеральный директор Марина Евгеньевна Аникеева — заслуженный работник сельского хозяйства Республики Беларусь. За более чем десятилетие комплексной модернизации ОАО «Молочный Мир» стало признанным драйвером качества и экспорта, объединив традиции гродненских сыроделов, принципы бережливого производства и 100%-ю автоматизацию ключевых технологических процессов.',
      missionTitle: 'Миссия предприятия',
      missionText:
      'Выпуск высококачественной, безопасной и конкурентоспособной молочной продукции, максимально удовлетворяющей запросы потребителей, за счёт постоянного обновления и совершенствования технологий и реализации потенциала каждого работника.',
      visionTitle: 'Стратегическое видение',
      visionText:
      'Удерживать лидерство среди производителей молочной продукции Республики Беларусь, развивать прямые контракты с ведущим мировым ритейлом, открывать новые рынки сбыта и повышать благосостояние коллектива.',
      historyEyebrow: 'Летопись предприятия',
      historyTitle: 'История развития с 1938 года',
      history: [
        {
          year: '1938',
          title: 'Основание гормолзавода в Гродно',
          desc: 'В октябре 1938 года введён в строй Гродненский городской молочный завод мощностью до 10 тонн переработки молока в сутки.',
        },
        {
          year: '1967',
          title: 'Первая крупная реконструкция',
          desc: 'Запуск обновлённых производственных мощностей, увеличение объёма переработки до 50 тонн молока в сутки.',
        },
        {
          year: '1993',
          title: 'Масштабное расширение',
          desc: 'Вторая комплексная реконструкция и строительство новых цехов на ул. Гаспадарчей — мощность выросла до 240 тонн в сутки.',
        },
        {
          year: '1996',
          title: 'Акционирование предприятия',
          desc: 'Преобразование государственного завода в открытое акционерное общество «Гродненский молочный комбинат».',
        },
        {
          year: '2007',
          title: 'Имя ОАО «Молочный Мир»',
          desc: 'Решением администрации СЭЗ «Гродноинвест» № 30 от 22.05.2007 предприятие получило современное название ОАО «Молочный Мир».',
        },
        {
          year: '2019',
          title: 'Присоединение филиалов',
          desc: 'В состав ОАО «Молочный Мир» вошли Щучинский и Дятловский маслосырзаводы, сформировав мощный региональный сыродельный кластер.',
        },
        {
          year: '2023–2026',
          title: 'Орден Трудовой Славы и экспортный прорыв',
          desc: 'Указом Президента РБ № 33 от 10.02.2023 коллектив удостоен ордена Трудовой Славы; запущена линия Паста Филата HoReCa, автоматизированный хаб на 4 200 паллетомест и получено звание «Лучший экспортёр года».',
        },
      ],
      structureEyebrow: 'География и структура',
      structureTitle: 'Производственные площадки и сырьевая база',
      filterAll: 'Все подразделения',
      filterPlants: 'Производство и филиалы',
      filterAgro: 'Сырьевая база',
      structure: [
        {
          kind: 'plants' as const,
          name: 'Головная площадка — г. Гродно',
          address: 'ул. Гаспадарчая, 28, г. Гродно',
          desc: 'Цех цельномолочной продукции, сыродельный цех, цех мороженого и сухих молочных продуктов, аккредитованная лаборатория.',
        },
        {
          kind: 'plants' as const,
          name: 'Щучинский филиал',
          address: 'ул. 17 Сентября, 45, г. Щучин',
          desc: 'Производство твёрдых и полутвёрдых сычужных сыров, сливочного масла и сухой деминерализованной сыворотки.',
        },
        {
          kind: 'plants' as const,
          name: 'Дятловский филиал',
          address: 'ул. Октябрьская, 105, г. Дятлово',
          desc: 'Элитные сорта сыра, плавленые сыры и цельномолочная продукция (бренд Cheeseland).',
        },
        {
          kind: 'plants' as const,
          name: 'Производственный цех «Берестовица»',
          address: 'ул. Дзержинского, 15, г.п. Большая Берестовица',
          desc: 'Выпуск полутвёрдых, выдержанных и рассольных сыров в розничной и промышленной фасовке.',
        },
        {
          kind: 'plants' as const,
          name: 'Производственный цех «Скидель»',
          address: 'ул. Зелёная, 1, г. Скидель',
          desc: 'Сыродельная площадка и автоматизированный экспортно-логистический центр на 4 200 паллетомест.',
        },
        {
          kind: 'plants' as const,
          name: 'Участок «Поречье» (воды и напитки)',
          address: 'ул. Озерская, д. Поречье',
          desc: 'Добыча и розлив минеральной лечебно-столовой и питьевой воды «Поречье», «Родная», «Aquaville» и доставка 19 л.',
        },
        {
          kind: 'agro' as const,
          name: 'Молокоприёмный пункт «Индура»',
          address: 'аг. Индура, Гродненский район',
          desc: 'Первичный приём, охлаждение и лабораторный контроль входящего сырого молока высшего и сорта «Экстра».',
        },
        {
          kind: 'agro' as const,
          name: 'Собственные сельхозпредприятия',
          address: 'СУП «МилкАгро» (Берестовица) · ОАО «Дворец-Агро» (Дятловский р-н)',
          desc: 'Собственная кормовая и животноводческая база для гарантированного качества сырья от фермы до прилавка.',
        },
      ],
      qualityTitle: 'Сертифицированные системы менеджмента',
      qualityDesc:
      'Безопасность, прозрачность и прослеживаемость каждой партии подтверждены независимыми национальными и международными аудитами.',
      certs: [
        { code: 'СТБ ISO 9001', title: 'Менеджмент качества', desc: 'Единые стандарты управления всеми производственными и бизнес-процессами.' },
        { code: 'FSSC 22000 & ISO 22000', title: 'Безопасность пищевой продукции', desc: 'Полный цикл контроля критических точек HACCP (СТБ 1470) от фермы до отгрузки.' },
        { code: 'СТБ ISO 45001-2020', title: 'Охрана труда и безопасность', desc: 'Международный стандарт защиты здоровья и безопасности сотрудников на производстве.' },
        { code: 'СТБ ISO 37001-2020', title: 'Антикоррупционный комплаенс', desc: 'Прозрачность закупок, контрактной политики и деловой этики предприятия.' },
        { code: 'Halal & China GACC', title: 'Экспортные допуски', desc: 'Аккредитация для регулярных поставок в Китай, страны Ближнего Востока и Азии.' },
      ],
      awardsTitle: 'Награды и международное признание',
      awards: [
        { title: 'Орден Трудовой Славы', detail: 'Государственная награда Республики Беларусь (Указ Президента № 33 от 10.02.2023).' },
        { title: '«Лучший экспортёр года»', detail: 'Многократный победитель республиканского конкурса (включая 2024 и 2025 гг.).' },
        { title: '7× Премия Правительства РБ', detail: 'Семикратный лауреат Премии Правительства за достижения в области качества.' },
        { title: 'Республиканская доска Почёта', detail: 'Занесение по итогам социально-экономического развития (2014, 2018, 2023 гг.).' },
        { title: 'Международные золотые медали', detail: 'Гран-при «Продэкспо», «Продукт года», «Чемпион вкуса», Углич; участник Gulfood и Foodex Japan.' },
      ],
      brandsTitle: 'Ключевые бренды и линейки',
      brands: [
        {
          name: 'Линейка «ГороденЪ»',
          desc: 'Флагманская серия из отборного молока сорта «Экстра» с повышенным содержанием белка: выдержанные сыры, пломбир 20%, глазированные сырки и масло.',
          to: '/catalog/cheese',
        },
        {
          name: 'Линейка Active Life',
          desc: 'Функциональное питание: безлактозное молоко (<0,01% лактозы) и высокобелковый греческий йогурт без добавленного сахара.',
          to: '/catalog/yogurt',
        },
        {
          name: 'HoReCa & Экспорт B2B',
          desc: 'Термостабильная моцарелла для пиццы до 400 °C, сливки 33%, масло 20 кг и сухое обезжиренное молоко (СОМ) в крафт-мешках 25 кг.',
          to: '/export',
        },
      ],
      ctaCatalog: 'Перейти в каталог',
      ctaExport: 'Экспорт и B2B',
      ctaContacts: 'Контакты подразделений',
    },
    be: {
      seoDesc:
      'ААТ «Малочны Мір» (milk.by): гісторыя з 1938 года, вытворчая структура ў Гродне, Шчучыне і Дзятлаве, сістэмы якасці і ўзнагароды.',
      badge: 'Ордэн Працоўнай Славы · Заснавана ў 1938 годзе',
      h1: 'ААТ «Малочны Мір» — эталон малочнай галіны Беларусі',
      lead:
      'Прадпрыемства бесперапыннага цыклу і адзін з найбуйнейшых вытворцаў малочнай прадукцыі ў Рэспубліцы Беларусь. Штогод перапрацоўваецца каля 600 тысяч тон малака і выпускаецца звыш 200 найменняў прадукцыі — у тым ліку больш за 60 відаў сыроў, цэльнамалочная лінейка, масла, марожанае, сухія інгрэдыенты і мінеральная вада «Парэчча».',
      stats: [
        { metric: '~600 тыс. т', title: 'Перапрацоўка за год', desc: 'Каля 1 500 тон свежага малака штосутачна з правераных гаспадарак.' },
        { metric: '200+ / 60+', title: 'Асартымент і сыры', desc: 'Больш за 200 відаў прадукцыі, у тым ліку звыш 60 гатункаў сыру.' },
        { metric: '73%+ экспарт', title: '30+ краін свету', desc: 'Прамыя пастаўкі ў СНД, Кітай, Паўднёва-Усходнюю Азію і на Блізкі Усход.' },
        { metric: '100%', title: 'Аўтаматызацыя', desc: 'Сучасныя закрытыя лініі перапрацоўкі і рабатызаваны хаб на 4 200 палетамесцаў.' },
      ],
      leadershipEyebrow: 'Стратэгія і кіраўніцтва',
      leadershipTitle: 'Тры складнікі поспеху: Інавацыі · Маркетынг · Інвестыцыі',
      leadershipBody:
      'З 2012 года прадпрыемства ўзначальвае генеральны дырэктар Марына Яўгенаўна Анікеева — заслужаны работнік сельскай гаспадаркі Рэспублікі Беларусь. За дзесяцігоддзе мадэрнізацыі кампанія аб’яднала традыцыі гродзенскіх сыраробаў, прынцыпы беражлівай вытворчасці і поўную аўтаматызацыю працэсаў.',
      missionTitle: 'Місія прадпрыемства',
      missionText:
      'Выпуск высакаякаснай, бяспечнай і канкурэнтаздольнай малочнай прадукцыі, якая максімальна задавальняе запыты спажыўцоў, за кошт пастаяннага абнаўлення тэхналогій і развіцця патэнцыялу кожнага работніка.',
      visionTitle: 'Стратэгічнае бачанне',
      visionText:
      'Замацоўваць лідарства сярод вытворцаў малочнай прадукцыі Беларусі, развіваць прамыя пастаўкі ў сусветны рытэйл і павышаць дабрабыт калектыву.',
      historyEyebrow: 'Летапіс прадпрыемства',
      historyTitle: 'Гісторыя развіцця з 1938 года',
      history: [
        { year: '1938', title: 'Заснаванне гармолзавода ў Гродне', desc: 'У кастрычніку 1938 года запрацаваў Гродзенскі гарадскі малочны завод магутнасцю да 10 тон у суткі.' },
        { year: '1967', title: 'Першая рэканструкцыя', desc: 'Павелічэнне вытворчай магутнасці прадпрыемства да 50 тон малака ў суткі.' },
        { year: '1993', title: 'Маштабнае пашырэнне', desc: 'Будаўніцтва новых цэхаў на вул. Гаспадарчай — магутнасць вырасла да 240 тон у суткі.' },
        { year: '1996', title: 'Акцыянаванне', desc: 'Пераўтварэнне прадпрыемства ў ААТ «Гродзенскі малочны камбінат».' },
        { year: '2007', title: 'Імя ААТ «Малочны Мір»', desc: 'Рашэннем СЭЗ «Гроднаінвест» № 30 ад 22.05.2007 зацверджана сучасная назва ААТ «Малочны Мір».' },
        { year: '2019', title: 'Далучэнне філіялаў', desc: 'У склад увайшлі Шчучынскі і Дзятлаўскі масласырзаводы, утварыўшы буйны сыраробны кластар.' },
        { year: '2023–2026', title: 'Ордэн Працоўнай Славы і рост экспарту', desc: 'Указам № 33 ад 10.02.2023 прадпрыемства ўзнагароджана ордэнам Працоўнай Славы; запушчана лінія Паста Філата і хаб на 4 200 палетамесцаў.' },
      ],
      structureEyebrow: 'Геаграфія і структура',
      structureTitle: 'Вытворчыя пляцоўкі і сыравінная база',
      filterAll: 'Усе падраздзяленні',
      filterPlants: 'Вытворчасць і філіялы',
      filterAgro: 'Сыравінная база',
      structure: [
        { kind: 'plants' as const, name: 'Галаўная пляцоўка — г. Гродна', address: 'вул. Гаспадарчая, 28, г. Гродна', desc: 'Цэх цэльнамалочнай прадукцыі, сыраробны цэх, цэх марожанага і сухіх прадуктаў, лабараторыя.' },
        { kind: 'plants' as const, name: 'Шчучынскі філіял', address: 'вул. 17 Верасня, 45, г. Шчучын', desc: 'Цвёрдыя і сычужныя сыры, сметанковае масла, сухая дэмінералізаваная сыроватка.' },
        { kind: 'plants' as const, name: 'Дзятлаўскі філіял', address: 'вул. Кастрычніцкая, 105, г. Дзятлава', desc: 'Элітныя гатункі сыру, плаўленыя сыры і цэльнамалочная прадукцыя.' },
        { kind: 'plants' as const, name: 'Вытворчы цэх «Бераставіца»', address: 'вул. Дзяржынскага, 15, г.п. Вялікая Бераставіца', desc: 'Паўцвёрдыя, вытрыманыя і расольныя сыры ў рознічнай і прамысловай фасоўцы.' },
        { kind: 'plants' as const, name: 'Вытворчы цэх «Скідзель»', address: 'вул. Зялёная, 1, г. Скідзель', desc: 'Сыраробная пляцоўка і экспартна-лагістычны цэнтр на 4 200 палетамесцаў.' },
        { kind: 'plants' as const, name: 'Участак «Парэчча»', address: 'вул. Азерская, в. Парэчча', desc: 'Мінеральныя і пітныя воды «Парэчча», «Родная», «Aquaville» і дастаўка 19 л.' },
        { kind: 'agro' as const, name: 'Малакапрыёмны пункт «Індура»', address: 'аг. Індура, Гродзенскі раён', desc: 'Прыём, ахалоджванне і лабараторны кантроль сырога малака гатунку «Экстра».' },
        { kind: 'agro' as const, name: 'Уласныя сельгаспрадпрыемствы', address: 'СУП «МілкАгра» · ААТ «Дварэц-Агра»', desc: 'Уласная сыравінная база для гарантаванай якасці малака ад фермы да прылаўка.' },
      ],
      qualityTitle: 'Сертыфікаваныя сістэмы менеджменту',
      qualityDesc: 'Бяспека і прасочвальнасць кожнай партыі пацверджаны незалежнымі нацыянальнымі і міжнароднымі аўдытамі.',
      certs: [
        { code: 'СТБ ISO 9001', title: 'Менеджмент якасці', desc: 'Адзіныя стандарты кіравання вытворчымі і бізнес-працэсамі.' },
        { code: 'FSSC 22000 & ISO 22000', title: 'Бяспека харчовай прадукцыі', desc: 'Кантроль крытычных кропак НАССР (СТБ 1470) на ўсім ланцугу.' },
        { code: 'СТБ ISO 45001-2020', title: 'Ахова працы', desc: 'Міжнародны стандарт бяспекі і аховы здароўя персаналу.' },
        { code: 'СТБ ISO 37001-2020', title: 'Антыкарупцыйны менеджмент', desc: 'Празрыстасць закупак і дзелавой этыкі прадпрыемства.' },
        { code: 'Halal & China GACC', title: 'Экспартныя допускі', desc: 'Акрэдытацыя для паставак у Кітай, краіны Блізкага Усходу і Азіі.' },
      ],
      awardsTitle: 'Узнагароды і міжнароднае прызнанне',
      awards: [
        { title: 'Ордэн Працоўнай Славы', detail: 'Дзяржаўная ўзнагарода Рэспублікі Беларусь (Указ № 33 ад 10.02.2023).' },
        { title: '«Лепшы экспарцёр года»', detail: 'Шматразовы пераможца рэспубліканскага конкурсу (уключаючы 2024 і 2025 гг.).' },
        { title: '7× Прэмія Урада РБ', detail: 'Сяміразовы лаўрэат Прэміі Урада за дасягненні ў галіне якасці.' },
        { title: 'Рэспубліканская дошка Пашаны', detail: 'Занясенне па выніках развіцця (2014, 2018, 2023 гг.).' },
        { title: 'Міжнародныя залатыя медалі', detail: 'Гран-пры «Прадэкспа», «Чэмпіён смаку», «Лепшыя тавары РБ», Gulfood, Foodex Japan.' },
      ],
      brandsTitle: 'Ключавыя брэнды і лінейкі',
      brands: [
        { name: 'Лінейка «ГорадзенЪ»', desc: 'Флагманская серыя з адборнага малака гатунку «Экстра» з павышаным бялком: сыры, пломбір 20%, сыркі і масла.', to: '/catalog/cheese' },
        { name: 'Лінейка Active Life', desc: 'Функцыянальнае харчаванне: безлактознае малако (<0,01% лактозы) і высокабялковы грэчаскі ёгурт.', to: '/catalog/yogurt' },
        { name: 'HoReCa & Экспарт B2B', desc: 'Тэрмастабільная мацарэла для піцы, вяршкі 33%, масла 20 кг і сухое малако САМ 25 кг.', to: '/export' },
      ],
      ctaCatalog: 'Перайсці ў каталог',
      ctaExport: 'Экспарт і B2B',
      ctaContacts: 'Кантакты падраздзяленняў',
    },
    en: {
      seoDesc:
      'About OJSC Molochny Mir (milk.by): heritage since 1938, plants in Grodno, Shchuchin, Dyatlovo, ISO/FSSC certifications, awards, and 30+ export markets.',
      badge: 'Order of Labor Glory · Established 1938',
      h1: 'OJSC "Molochny Mir" — Benchmark of Belarusian Dairy Craft',
      lead:
      'A continuous-cycle enterprise and one of the largest dairy producers in Belarus. Every year, our plants process roughly 600,000 tons of extra-grade raw milk across more than 200 products — including over 60 hard and semi-hard cheeses, whole-milk dairy, butter, ice cream, dry dairy ingredients, and Porechye mineral waters.',
      stats: [
        { metric: '~600k t/yr', title: 'Annual Milk Processing', desc: 'Around 1,500 tons of farm-fresh milk processed every single day.' },
        { metric: '200+ / 60+', title: 'SKUs & Cheese Varieties', desc: 'Over 200 dairy items including more than 60 aged and semi-hard cheeses.' },
        { metric: '73%+ Export', title: '30+ Countries', desc: 'Direct shipments across CIS, China, Southeast Asia, and the Middle East.' },
        { metric: '100%', title: 'Automated Processing', desc: 'Closed European production lines and an automated 4,200-pallet cold-chain hub.' },
      ],
      leadershipEyebrow: 'Strategy & Leadership',
      leadershipTitle: 'Three Pillars of Success: Innovation · Marketing · Investment',
      leadershipBody:
      'Led since 2012 by General Director Marina Anikeeva — Honored Worker of Agriculture of Belarus — the enterprise has completed a decade-long modernization combining Grodno cheesemaking craft, lean manufacturing, and 100% process automation.',
      missionTitle: 'Our Mission',
      missionText:
      'Delivering safe, high-quality, and globally competitive dairy products that exceed consumer expectations through continuous technology upgrades and employee excellence.',
      visionTitle: 'Strategic Vision',
      visionText:
      'Sustaining national leadership in Belarus while expanding direct contracts with international retail chains, new export geographies, and employee prosperity.',
      historyEyebrow: 'Company Heritage',
      historyTitle: 'Milestones Since 1938',
      history: [
        { year: '1938', title: 'Grodno City Dairy Plant Founded', desc: 'Commissioned in October 1938 with initial daily processing capacity of up to 10 tons.' },
        { year: '1967', title: 'First Major Reconstruction', desc: 'Capacity expanded fivefold to 50 tons of raw milk per day.' },
        { year: '1993', title: 'Large-Scale Plant Expansion', desc: 'New processing shops commissioned on Gaspadarchaya Street, raising capacity to 240 tons/day.' },
        { year: '1996', title: 'Joint-Stock Transformation', desc: 'Reorganized into Open Joint-Stock Company "Grodno Dairy Plant".' },
        { year: '2007', title: 'Rebranded as OJSC "Molochny Mir"', desc: 'Official corporate name adopted under FEZ "Grodnoinvest" Decision No. 30 (May 22, 2007).' },
        { year: '2019', title: 'Regional Branch Integration', desc: 'Merged with Shchuchin and Dyatlovo cheese & butter plants, forming a major dairy cluster.' },
        { year: '2023–2026', title: 'Order of Labor Glory & Export Surge', desc: 'Awarded the Order of Labor Glory (2023); launched automated HoReCa mozzarella line, 4,200-pallet hub, and "Best Exporter of the Year" recognition.' },
      ],
      structureEyebrow: 'Production Network',
      structureTitle: 'Manufacturing Plants & Agricultural Base',
      filterAll: 'All Units',
      filterPlants: 'Plants & Branches',
      filterAgro: 'Raw Milk Base',
      structure: [
        { kind: 'plants' as const, name: 'Headquarters — Grodno Main Plant', address: '28 Gaspadarchaya St, Grodno', desc: 'Fresh dairy, cheese, ice cream & dry milk powder shops plus accredited QA laboratory.' },
        { kind: 'plants' as const, name: 'Shchuchin Branch', address: '45 17 Sentyabrya St, Shchuchin', desc: 'Hard and semi-hard rennet cheeses, sweet cream butter, and demineralized whey powder.' },
        { kind: 'plants' as const, name: 'Dyatlovo Branch', address: '105 Oktyabrskaya St, Dyatlovo', desc: 'Specialty reserve cheeses, processed cheeses, and fresh dairy (Cheeseland brand).' },
        { kind: 'plants' as const, name: 'Berestovitsa Cheese Plant', address: '15 Dzerzhinskogo St, Bolshaya Berestovitsa', desc: 'Semi-hard, aged, and brined cheeses for retail and bulk HoReCa supply.' },
        { kind: 'plants' as const, name: 'Skidel Production & Logistics Site', address: '1 Zelenaya St, Skidel', desc: 'Cheese manufacturing and 4,200-pallet automated cold-chain export hub.' },
        { kind: 'plants' as const, name: 'Porechye Mineral Water & Beverage Plant', address: 'Ozerskaya St, Porechye', desc: 'Natural mineral & drinking waters ("Porechye", "Rodnaya", "Aquaville") and 19L delivery.' },
        { kind: 'agro' as const, name: 'Indura Milk Intake Station', address: 'Indura, Grodno District', desc: 'Primary chilling and incoming laboratory grading of extra-grade raw milk.' },
        { kind: 'agro' as const, name: 'In-House Dairy Farms', address: 'MilkAgro (Berestovitsa) · Dvorets-Agro (Dyatlovo)', desc: 'Vertically integrated farms safeguarding raw milk traceability from farm to shelf.' },
      ],
      qualityTitle: 'Certified Management Systems',
      qualityDesc: 'Traceability and food safety audited by accredited domestic and international bodies.',
      certs: [
        { code: 'ISO 9001', title: 'Quality Management', desc: 'Unified standards across procurement, production, and logistics.' },
        { code: 'FSSC 22000 & ISO 22000', title: 'Food Safety & HACCP', desc: 'End-to-end CCP monitoring from raw milk intake to sealed packaging.' },
        { code: 'ISO 45001-2020', title: 'Occupational Health & Safety', desc: 'International workplace safety and employee wellbeing standards.' },
        { code: 'ISO 37001-2020', title: 'Anti-Bribery Compliance', desc: 'Transparent procurement, contract governance, and business ethics.' },
        { code: 'Halal & China GACC', title: 'Global Export Accreditations', desc: 'Registered clearance for China, GCC, Middle East, and Asia.' },
      ],
      awardsTitle: 'Honors & International Recognition',
      awards: [
        { title: 'Order of Labor Glory', detail: 'State award of Belarus (Presidential Decree No. 33, Feb 10, 2023).' },
        { title: '"Best Exporter of the Year"', detail: 'Repeated national export champion (including 2024 & 2025).' },
        { title: '7× Government Quality Award', detail: 'Seven-time laureate of the Belarus Government Prize for Quality.' },
        { title: 'Republican Board of Honor', detail: 'Recognized for industrial & economic performance (2014, 2018, 2023).' },
        { title: 'Global Gold Medals & Exhibitions', detail: 'Prodexpo Grand Prix, Product of the Year, Uglich Cheese Contest; exhibitor at Gulfood & Foodex Japan.' },
      ],
      brandsTitle: 'Signature Product Lines',
      brands: [
        { name: 'Goroden Reserve Series', desc: 'Crafted from protein-rich Extra-grade milk: 90-day aged cheeses, 20% plombir, glazed curd bars, and butter.', to: '/catalog/cheese' },
        { name: 'Active Life Range', desc: 'Functional nutrition: <0.01% lactose-free milk and 8g high-protein Greek yogurt with zero added sugar.', to: '/catalog/yogurt' },
        { name: 'HoReCa & Export B2B', desc: '400°C pizza mozzarella, 33% whipping cream, 20kg butter blocks, and 25kg export SMP bags.', to: '/export' },
      ],
      ctaCatalog: 'Explore Catalog',
      ctaExport: 'Export & B2B',
      ctaContacts: 'Department Contacts',
    },
    zh: {
      seoDesc:
      '关于白俄罗斯 Molochny Mir 乳业股份公司 (milk.by)：始创于1938年的历史沿革、格罗德诺/休钦/佳特洛沃生产基地、国际体系认证及出口成果。',
      badge: '国家劳动光荣勋章企业 · 始创于 1938 年',
      h1: 'Molochny Mir 股份公司 — 白俄罗斯乳制品工业品质标杆',
      lead:
      '白俄罗斯领先的连续化乳品加工企业。公司旗下基地每年加工约 60 万吨优质生牛乳，生产品类超过 200 种——涵盖 60 余种硬质与半硬质奶酪、鲜乳制品、天然黄油、冰淇淋、脱盐乳清与奶粉工业原料以及 Porechye 矿泉水系列。',
      stats: [
        { metric: '~60 万吨/年', title: '年均原奶加工量', desc: '每日稳定加工来自认证牧场约 1,500 吨特级生牛乳。' },
        { metric: '200+ / 60+', title: '全品类与奶酪矩阵', desc: '超过 200 种乳品 SKU，其中涵盖 60 余种特色陈年及半硬质奶酪。' },
        { metric: '73%+ 出口', title: '30+ 出口国家', desc: '直供独联体、中国、东南亚及中东海湾市场。' },
        { metric: '100%', title: '全自动冷链工艺', desc: '封闭式欧洲自动化产线与 4,200 托盘位智能冷链物流枢纽。' },
      ],
      leadershipEyebrow: '发展战略与管理',
      leadershipTitle: '核心驱动力：技术创新 · 品牌营销 · 持续投资',
      leadershipBody:
      '自 2012 年起由白俄罗斯共和国功勋农业工作者 Marina Anikeeva 担任总经理。十余年来公司持续推进数字化与精益生产改造，将格罗德诺百年奶酪传统工艺与 100% 自动化封闭产线紧密结合。',
      missionTitle: '企业使命',
      missionText: '通过持续迭代加工工艺并激发每一位员工的潜能，生产安全、优质且具国际竞争力的乳制品，全面满足消费者需求。',
      visionTitle: '战略愿景',
      visionText: '巩固白俄罗斯乳制品行业领军地位，深化与国际大型商超零售的直供合作，拓展全球新市场并持续提升团队福祉。',
      historyEyebrow: '发展历程',
      historyTitle: '1938 年至今的重要里程碑',
      history: [
        { year: '1938', title: '格罗德诺城市乳品厂成立', desc: '1938 年 10 月正式投产，初期日处理鲜奶能力达 10 吨。' },
        { year: '1967', title: '首次大规模技术改造', desc: '完成核心设备升级，日均鲜奶加工能力提升至 50 吨。' },
        { year: '1993', title: '新厂区扩建投产', desc: '在 Gaspadarchaya 街建成现代化车间，日产能跃升至 240 吨。' },
        { year: '1996', title: '股份制改革', desc: '改制为开放式股份公司“格罗德诺乳品联合体”。' },
        { year: '2007', title: '正式更名 Molochny Mir', desc: '依据格罗德诺自由经济区第 30 号决议（2007.05.22）启用现用企业名称。' },
        { year: '2019', title: '整合区域奶酪黄油分厂', desc: '正式并入休钦 (Shchuchin) 与佳特洛沃 (Dyatlovo) 乳品厂，形成区域专业奶酪产业集群。' },
        { year: '2023–2026', title: '劳动光荣勋章与出口跨越', desc: '2023 年 2 月获颁白俄罗斯国家“劳动光荣勋章”；投产 HoReCa 披萨奶酪线及 4,200 托盘冷链中心，蝉联“年度最佳出口商”。' },
      ],
      structureEyebrow: '组织与产能网络',
      structureTitle: '五大专业生产基地与自有牧场奶源',
      filterAll: '全部单位',
      filterPlants: '工厂与分厂',
      filterAgro: '奶源与农业',
      structure: [
        { kind: 'plants' as const, name: '格罗德诺总部主厂区', address: '格罗德诺市 Gaspadarchaya 街 28 号', desc: '鲜乳车间、奶酪车间、冰淇淋与干乳粉车间及国家认证中心实验室。' },
        { kind: 'plants' as const, name: '休钦分公司 (Shchuchin)', address: '休钦市 9月17日街 45 号', desc: '专业生产硬质/半硬质成熟奶酪、天然黄油及脱盐乳清粉。' },
        { kind: 'plants' as const, name: '佳特洛沃分公司 (Dyatlovo)', address: '佳特洛沃市十月街 105 号', desc: '精品陈年奶酪、再制奶酪及鲜乳制品 (Cheeseland 系列)。' },
        { kind: 'plants' as const, name: '别列斯托维察奶酪车间', address: '大别列斯托维察 Dzerzhinskogo 街 15 号', desc: '零售及餐饮商用半硬质、陈年与盐水奶酪基地。' },
        { kind: 'plants' as const, name: '斯基德尔生产与物流基地', address: '斯基德尔市 Zelenaya 街 1 号', desc: '奶酪生产及 4,200 托盘位自动化冷链出口物流枢纽。' },
        { kind: 'plants' as const, name: '波列奇耶矿泉水基地 (Porechye)', address: '波列奇耶村 Ozerskaya 街', desc: '天然矿泉水与饮用水 (Porechye, Aquaville) 灌装及 19 升桶装配送。' },
        { kind: 'agro' as const, name: '因杜拉原奶收购站', address: '格罗德诺区 Indura 农庄', desc: '特级生牛乳一级冷却、快速化验及冷链转运中心。' },
        { kind: 'agro' as const, name: '自有合作现代化牧场', address: 'MilkAgro · Dvorets-Agro 农业公司', desc: '从牧场饲料到货架的全链路可追溯优质生牛乳保障体系。' },
      ],
      qualityTitle: '国际质量与安全管理体系认证',
      qualityDesc: '每一批次产品的安全性与可追溯性均通过国内外权威机构独立审核认证。',
      certs: [
        { code: 'ISO 9001', title: '质量管理体系', desc: '覆盖采购、加工与冷链发运的标准化质量管控。' },
        { code: 'FSSC 22000 & ISO 22000', title: '食品安全与 HACCP', desc: '全流程关键控制点监测，确保生牛乳至成品包装零缺陷。' },
        { code: 'ISO 45001-2020', title: '职业健康与安全', desc: '严格保障生产一线员工工作环境安全与健康标准。' },
        { code: 'ISO 37001-2020', title: '反贿赂合规管理', desc: '确保招标采购、外贸合同及企业运营的公开透明。' },
        { code: 'Halal & 中国 GACC', title: '国际出口准入资质', desc: '持有输华海关 GACC 注册及清真认证，畅行亚洲及中东市场。' },
      ],
      awardsTitle: '荣誉奖项与国际展会认可',
      awards: [
        { title: '国家“劳动光荣勋章”', detail: '根据白俄罗斯总统第 33 号令（2023.02.10）授予国家级最高荣誉。' },
        { title: '“年度最佳出口商”', detail: '多次蝉联白俄罗斯国家级出口大赛优胜奖（含 2024 及 2025 年度）。' },
        { title: '7 次政府质量大奖', detail: '七次荣获白俄罗斯共和国政府质量成就奖。' },
        { title: '国家荣誉榜上榜企业', detail: '2014、2018 及 2023 年多次荣登白俄罗斯共和国荣誉榜。' },
        { title: '国际金奖与行业盛会', detail: 'Prodexpo 食品展大奖、乌格利奇奶酪大赛金奖，并亮相 Gulfood 及日本 Foodex 国际食品展。' },
      ],
      brandsTitle: '核心品牌系列',
      brands: [
        { name: 'Goroden 臻选系列', desc: '采用高蛋白特级生牛乳打造：90 天陈年奶酪、20% 冰淇淋与纯脂黄油。', to: '/catalog/cheese' },
        { name: 'Active Life 健康系列', desc: '功能性营养乳品：零乳糖牛奶 (<0.01%) 与零蔗糖高蛋白希腊酸奶。', to: '/catalog/yogurt' },
        { name: 'HoReCa 与全球出口', desc: '耐 400°C 披萨马苏里拉奶酪、33% 淡奶油、20 公斤黄油及 25 公斤脱脂奶粉。', to: '/export' },
      ],
      ctaCatalog: '浏览产品目录',
      ctaExport: '国际出口与合作',
      ctaContacts: '各部门联系方式',
    },
  }[language];

  const visibleStructure = copy.structure.filter(
    (s) => selectedStructureFilter === 'all' || s.kind === selectedStructureFilter
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-14 sm:space-y-16">
    <SeoHead
    title={`${t('navAbout')} — ${t('brandName')} (milk.by)`}
    description={copy.seoDesc}
    canonicalHash="/about"
    />

    {/* 1. Corporate Hero */}
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
    <div className="lg:col-span-6 space-y-5 flex flex-col justify-center">
    <div className="inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-full bg-blue-50 text-[#0057B8] border border-blue-200/80 text-xs font-semibold">
    <Award className="w-3.5 h-3.5 shrink-0" />
    <span>{copy.badge}</span>
    </div>

    <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
    {copy.h1}
    </h1>

    <p className="text-sm sm:text-base text-slate-600 leading-relaxed">{copy.lead}</p>

    <div className="pt-1 flex flex-wrap gap-3">
    <Link
    to="/catalog"
    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#0057B8] rounded-xl hover:bg-[#004494] transition-colors"
    >
    <span>{copy.ctaCatalog}</span>
    <ArrowRight className="w-4 h-4" />
    </Link>
    <Link
    to="/export"
    className="px-4 py-2.5 text-sm font-semibold text-slate-800 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
    >
    {copy.ctaExport}
    </Link>
    <Link
    to="/contacts"
    className="px-4 py-2.5 text-sm font-semibold text-[#0057B8] bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
    >
    {copy.ctaContacts}
    </Link>
    </div>
    </div>

    <div className="lg:col-span-6">
    <div className="h-full min-h-[280px] rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 shadow-xs">
    <ImageWithFallback
    src={ASSETS.newsDairyFacility}
    alt={t('brandName')}
    className="w-full h-full object-cover"
    />
    </div>
    </div>
    </section>

    {/* 2. Key Performance Metrics */}
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
    {copy.stats.map((box) => (
      <div
      key={box.metric}
      className="border border-slate-200 rounded-2xl p-5 sm:p-6 bg-white space-y-2"
      >
      <div className="font-display text-2xl sm:text-3xl font-bold text-[#0057B8] tabular-nums">
      {box.metric}
      </div>
      <h2 className="font-display text-base font-semibold text-slate-900">{box.title}</h2>
      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{box.desc}</p>
      </div>
    ))}
    </section>

    {/* 3. Leadership, Mission & Vision */}
    <section className="rounded-3xl bg-slate-50 border border-slate-200 p-6 sm:p-10 space-y-8">
    <div className="max-w-3xl space-y-3">
    <p className="text-xs font-semibold uppercase tracking-wider text-[#0057B8]">
    {copy.leadershipEyebrow}
    </p>
    <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
    {copy.leadershipTitle}
    </h2>
    <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
    {copy.leadershipBody}
    </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-2.5">
    <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#0057B8]">
    <Sparkles className="w-4 h-4" />
    <span>{copy.missionTitle}</span>
    </div>
    <p className="text-sm text-slate-700 leading-relaxed">{copy.missionText}</p>
    </div>
    <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-2.5">
    <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#0057B8]">
    <Globe2 className="w-4 h-4" />
    <span>{copy.visionTitle}</span>
    </div>
    <p className="text-sm text-slate-700 leading-relaxed">{copy.visionText}</p>
    </div>
    </div>
    </section>

    {/* 4. History Timeline (1938 -> 2026) */}
    <section className="space-y-6">
    <div className="space-y-1.5">
    <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#0057B8]">
    <History className="w-3.5 h-3.5" />
    <span>{copy.historyEyebrow}</span>
    </p>
    <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
    {copy.historyTitle}
    </h2>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    {copy.history.map((item, idx) => (
      <div
      key={item.year}
      className={`border rounded-2xl p-5 space-y-2 ${
        idx === copy.history.length - 1
        ? 'lg:col-span-2 bg-blue-50/60 border-[#0057B8]/40'
        : 'bg-white border-slate-200'
      }`}
      >
      <div className="font-mono text-sm font-bold text-[#0057B8] tabular-nums">
      {item.year}
      </div>
      <h3 className="font-display text-base font-semibold text-slate-900">{item.title}</h3>
      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{item.desc}</p>
      </div>
    ))}
    </div>
    </section>

    {/* 5. Production Structure & Agricultural Base */}
    <section className="space-y-6">
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
    <div className="space-y-1.5">
    <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#0057B8]">
    <Factory className="w-3.5 h-3.5" />
    <span>{copy.structureEyebrow}</span>
    </p>
    <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
    {copy.structureTitle}
    </h2>
    </div>

    <div className="inline-flex p-1 bg-slate-100 border border-slate-200 rounded-xl self-start sm:self-auto">
    {(
      [
        ['all', copy.filterAll],
      ['plants', copy.filterPlants],
      ['agro', copy.filterAgro],
      ] as const
    ).map(([val, label]) => (
      <button
      key={val}
      type="button"
      onClick={() => setSelectedStructureFilter(val)}
      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
        selectedStructureFilter === val
        ? 'bg-white text-[#0057B8] shadow-xs'
        : 'text-slate-600 hover:text-slate-900'
      }`}
      >
      {label}
      </button>
    ))}
    </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    {visibleStructure.map((unit) => (
      <div
      key={unit.name}
      className="border border-slate-200 rounded-2xl p-5 bg-white space-y-2.5 hover:border-[#0057B8]/40 transition-colors"
      >
      <div className="flex items-start gap-2">
      <Building2 className="w-4 h-4 text-[#0057B8] shrink-0 mt-1" />
      <h3 className="font-display text-sm sm:text-base font-bold text-slate-900 leading-snug">
      {unit.name}
      </h3>
      </div>
      <div className="flex items-start gap-1.5 text-xs text-slate-500">
      <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-slate-400" />
      <span>{unit.address}</span>
      </div>
      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{unit.desc}</p>
      </div>
    ))}
    </div>
    </section>

    {/* 6. Management Systems & Awards */}
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
    <div className="lg:col-span-6 border border-slate-200 rounded-2xl p-6 sm:p-7 bg-white space-y-5">
    <div className="space-y-1.5">
    <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#0057B8]">
    <ShieldCheck className="w-4 h-4" />
    <span>ISO · FSSC 22000 · HACCP</span>
    </div>
    <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
    {copy.qualityTitle}
    </h2>
    <p className="text-xs sm:text-sm text-slate-600">{copy.qualityDesc}</p>
    </div>

    <div className="divide-y divide-slate-100">
    {copy.certs.map((c) => (
      <div key={c.code} className="py-3 first:pt-0 last:pb-0 flex items-start gap-3">
      <CheckCircle2 className="w-4 h-4 text-[#0057B8] shrink-0 mt-0.5" />
      <div className="space-y-0.5">
      <div className="text-sm font-semibold text-slate-900">
      <span className="font-mono text-[#0057B8] mr-1.5">{c.code}</span>
      <span>— {c.title}</span>
      </div>
      <p className="text-xs text-slate-600">{c.desc}</p>
      </div>
      </div>
    ))}
    </div>
    </div>

    <div className="lg:col-span-6 border border-slate-200 rounded-2xl p-6 sm:p-7 bg-slate-50/70 space-y-5">
    <div className="space-y-1.5">
    <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#0057B8]">
    <Award className="w-4 h-4" />
    <span>milk.by</span>
    </div>
    <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
    {copy.awardsTitle}
    </h2>
    </div>

    <div className="space-y-3">
    {copy.awards.map((a) => (
      <div
      key={a.title}
      className="bg-white border border-slate-200 rounded-xl p-4 space-y-1"
      >
      <div className="font-display text-sm font-bold text-slate-900">{a.title}</div>
      <p className="text-xs text-slate-600 leading-relaxed">{a.detail}</p>
      </div>
    ))}
    </div>
    </div>
    </section>

    {/* 7. Signature Product Lines */}
    <section className="space-y-5">
    <h2 className="font-display text-2xl font-bold text-slate-900">{copy.brandsTitle}</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
    {copy.brands.map((brand) => (
      <Link
      key={brand.name}
      to={brand.to}
      className="group border border-slate-200 rounded-2xl p-6 bg-white hover:border-[#0057B8]/50 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 flex flex-col justify-between gap-4"
      >
      <div className="space-y-2">
      <h3 className="font-display text-lg font-bold text-slate-900 group-hover:text-[#0057B8] transition-colors">
      {brand.name}
      </h3>
      <p className="text-sm text-slate-600 leading-relaxed">{brand.desc}</p>
      </div>
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0057B8]">
      <span>{copy.ctaCatalog}</span>
      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
      </span>
      </Link>
    ))}
    </div>
    </section>
    </div>
  );
};
