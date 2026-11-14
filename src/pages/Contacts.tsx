import React, { useMemo, useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle2,
  Search,
  X,
  Building2,
  Users,
  Truck,
  Globe2,
  Briefcase,
  ExternalLink,
} from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { SeoHead } from '../components/SeoHead';
import { Language } from '../types';

type DirectoryTab = 'sales' | 'management' | 'departments' | 'branches';

interface ContactPhone {
  label?: Record<Language, string>;
  number: string;
}

interface DirectoryEntry {
  id: string;
  group: DirectoryTab;
  title: Record<Language, string>;
  person?: Record<Language, string>;
  address?: Record<Language, string>;
  note?: Record<Language, string>;
  phones: ContactPhone[];
  emails?: { label?: string; address: string }[];
  website?: string;
}

const DIRECTORY_ENTRIES: DirectoryEntry[] = [
  // ======================== 1. SALES, ORDERS, EXPORT & DEALERS ========================
  {
    id: 'sales-logistics-head',
    group: 'sales',
    title: {
      ru: 'Отдел логистики и продаж (РБ)',
      be: 'Аддзел лагістыкі і продажаў (РБ)',
      en: 'Logistics & Domestic Sales Department',
      zh: '物流与国内销售部（白俄罗斯）',
    },
    person: {
      ru: 'Начальник: Сидо Наталия Станиславовна',
      be: 'Начальнік: Сідо Наталля Станіславаўна',
      en: 'Head: Natalia Sido',
      zh: '负责人: Natalia Sido',
    },
    phones: [{ number: '+375 (152) 45-39-42' }],
    emails: [
      { address: 'sales@milk.by' },
      { label: 'Заявки / Orders', address: 'olip@milk.by' },
    ],
  },
{
  id: 'sales-grodno',
  group: 'sales',
  title: {
    ru: 'Приём заявок — г. Гродно',
    be: 'Прыём заявак — г. Гродна',
    en: 'Order Desk — Grodno City',
    zh: '订单受理 — 格罗德诺市区',
  },
  phones: [
    { number: '+375 (152) 45-39-01' },
    { number: '+375 (152) 45-39-56' },
    { label: { ru: 'A1', be: 'A1', en: 'A1', zh: 'A1' }, number: '+375 (29) 117-99-99' },
  ],
  emails: [{ address: 'olip@milk.by' }],
},
{
  id: 'sales-regions',
  group: 'sales',
  title: {
    ru: 'Приём заявок — регионы Республики Беларусь',
    be: 'Прыём заявак — рэгіёны Рэспублікі Беларусь',
    en: 'Order Desk — Regions of Belarus',
    zh: '订单受理 — 白俄罗斯其他地区',
  },
  phones: [
    { number: '+375 (152) 45-39-02' },
    { label: { ru: 'МТС', be: 'МТС', en: 'MTS', zh: 'MTS' }, number: '+375 (29) 289-99-99' },
    { label: { ru: 'A1', be: 'A1', en: 'A1', zh: 'A1' }, number: '+375 (29) 698-72-07' },
  ],
},
{
  id: 'sales-water-19l',
  group: 'sales',
  title: {
    ru: 'Заявки на доставку воды 19 л («Поречье» / Aquaville)',
    be: 'Заяўкі на дастаўку вады 19 л («Парэчча» / Aquaville)',
    en: '19L Water Delivery Orders (Porechye / Aquaville)',
    zh: '19升桶装水配送订购热线',
  },
  phones: [
    { number: '+375 (152) 60-40-27' },
    { label: { ru: 'МТС', be: 'МТС', en: 'MTS', zh: 'MTS' }, number: '+375 (29) 282-22-22' },
    { label: { ru: 'A1', be: 'A1', en: 'A1', zh: 'A1' }, number: '+375 (29) 382-22-22' },
  ],
},
{
  id: 'sales-ice-cream',
  group: 'sales',
  title: {
    ru: 'Заявки на мороженое',
    be: 'Заяўкі на марозіва',
    en: 'Ice Cream Order Desk',
    zh: '冰淇淋订购热线',
  },
  phones: [
    { number: '+375 (152) 45-39-03' },
    { number: '+375 (152) 45-39-04' },
    { label: { ru: 'МТС', be: 'МТС', en: 'MTS', zh: 'MTS' }, number: '+375 (29) 287-77-77' },
    { label: { ru: 'A1', be: 'A1', en: 'A1', zh: 'A1' }, number: '+375 (29) 117-88-88' },
  ],
},
{
  id: 'sales-ettn',
  group: 'sales',
  title: {
    ru: 'Электронные товарно-транспортные накладные (ЭТТН)',
    be: 'Электронныя таварна-транспартныя накладныя (ЭТТН)',
    en: 'Electronic Waybills (eTTN / EDI Support)',
    zh: '电子货运单据与 EDI 支持 (eTTN)',
  },
  phones: [{ label: { ru: 'A1', be: 'A1', en: 'A1', zh: 'A1' }, number: '+375 (44) 523-49-18' }],
},
{
  id: 'sales-ved-export',
  group: 'sales',
  title: {
    ru: 'Отдел внешнеэкономической деятельности (Экспорт)',
    be: 'Аддзел знешнеэканамічнай дзейнасці (Экспарт)',
    en: 'Foreign Economic Activity / Export Department',
    zh: '对外经济贸易与国际出口部',
  },
  person: {
    ru: 'Начальник: Мелешко Светлана Ивановна',
    be: 'Начальнік: Мялешка Святлана Іванаўна',
    en: 'Head: Svetlana Meleshko',
    zh: '负责人: Svetlana Meleshko',
  },
  phones: [
    { number: '+375 (152) 60-07-52' },
    { number: '+375 (152) 45-39-65' },
    { number: '+375 (152) 48-06-53' },
  ],
  emails: [{ address: 'ved@milk.by' }],
},
{
  id: 'rep-brest',
  group: 'sales',
  title: {
    ru: 'Представитель в г. Бресте',
    be: 'Прадстаўнік у г. Брэсце',
    en: 'Regional Representative — Brest',
    zh: '布列斯特地区代表处',
  },
  phones: [
    { number: '+375 (162) 21-35-34' },
    { label: { ru: 'МТС', be: 'МТС', en: 'MTS', zh: 'MTS' }, number: '+375 (33) 323-38-42' },
    { number: '+375 (29) 792-18-00' },
  ],
},
{
  id: 'dealer-stolica',
  group: 'sales',
  title: {
    ru: 'Официальный дилер в г. Минске — ООО «Молочный Мир - Столица»',
    be: 'Афіцыйны дылер у г. Мінску — ТАА «Малочны Мір - Сталіца»',
    en: 'Official Dealer (Minsk) — Molochny Mir - Stolitsa LLC',
    zh: '明斯克官方经销商 — Molochny Mir - Stolitsa LLC',
  },
  address: {
    ru: '220012, г. Минск, ул. К. Чорного, 25, офис 130',
    be: '220012, г. Мінск, вул. К. Чорнага, 25, офіс 130',
    en: 'Office 130, 25 K. Chornogo St, Minsk 220012',
    zh: '明斯克市 K. Chornogo 街 25 号 130 室 (220012)',
  },
  phones: [
    { number: '+375 (17) 395-79-99' },
    { label: { ru: 'A1', be: 'A1', en: 'A1', zh: 'A1' }, number: '+375 (29) 352-33-50' },
    { label: { ru: 'A1', be: 'A1', en: 'A1', zh: 'A1' }, number: '+375 (29) 176-33-50' },
    { label: { ru: 'A1', be: 'A1', en: 'A1', zh: 'A1' }, number: '+375 (29) 182-33-50' },
    { label: { ru: 'A1', be: 'A1', en: 'A1', zh: 'A1' }, number: '+375 (29) 187-33-50' },
    { label: { ru: 'МТС', be: 'МТС', en: 'MTS', zh: 'MTS' }, number: '+375 (33) 376-02-65' },
  ],
  emails: [{ address: 'mm-stolica@yandex.by' }],
},
{
  id: 'dealer-vostok',
  group: 'sales',
  title: {
    ru: 'Официальный дилер (Минск, Гомель, Могилёв) — ООО «Молочный Мир - Восток»',
    be: 'Афіцыйны дылер (Мінск, Гомель, Магілёў) — ТАА «Малочны Мір - Усход»',
    en: 'Official Dealer (Minsk, Gomel, Mogilev) — Molochny Mir - Vostok LLC',
    zh: '东部区域官方经销商（明斯克/戈梅利/莫吉廖夫）',
  },
  address: {
    ru: '220012, г. Минск, ул. К. Чорного, 25, офис 130',
    be: '220012, г. Мінск, вул. К. Чорнага, 25, офіс 130',
    en: 'Office 130, 25 K. Chornogo St, Minsk 220012',
    zh: '明斯克市 K. Chornogo 街 25 号 130 室 (220012)',
  },
  phones: [
    { label: { ru: 'Минск', be: 'Мінск', en: 'Minsk', zh: '明斯克' }, number: '+375 (44) 700-78-69' },
    { label: { ru: 'Гомель', be: 'Гомель', en: 'Gomel', zh: '戈梅利' }, number: '+375 (29) 641-27-26' },
    { label: { ru: 'Гомель', be: 'Гомель', en: 'Gomel', zh: '戈梅利' }, number: '+375 (29) 672-07-69' },
    { label: { ru: 'Могилёв', be: 'Магілёў', en: 'Mogilev', zh: '莫吉廖夫' }, number: '+375 (29) 606-62-71' },
  ],
  emails: [{ address: 'mm-vostok@yandex.by' }],
},

// ======================== 2. MANAGEMENT ========================
{
  id: 'mgmt-ceo',
  group: 'management',
  title: {
    ru: 'Генеральный директор',
    be: 'Генеральны дырэктар',
    en: 'General Director',
    zh: '总经理',
  },
  person: {
    ru: 'Аникеева Марина Евгеньевна',
    be: 'Анікеева Марына Яўгенаўна',
    en: 'Marina Anikeeva',
    zh: 'Marina Anikeeva',
  },
  note: {
    ru: 'Приём граждан: Среда, 17:00 – 20:00',
    be: 'Прыём грамадзян: Серада, 17:00 – 20:00',
    en: 'Public Reception Hours: Wednesday, 17:00 – 20:00',
    zh: '公众接待时间: 周三 17:00 – 20:00',
  },
  phones: [{ number: '+375 (152) 43-01-72' }],
  emails: [{ address: 'director@milk.by' }],
},
{
  id: 'mgmt-reception',
  group: 'management',
  title: {
    ru: 'Приёмная / Помощник руководителя',
    be: 'Прыёмная / Памочнік кіраўніка',
    en: 'Reception / Executive Assistant',
    zh: '总经理办公室 / 行政前台',
  },
  person: {
    ru: 'Жарникова Олеся Александровна',
    be: 'Жарнікава Алеся Аляксандраўна',
    en: 'Olesya Zharnikova',
    zh: 'Olesya Zharnikova',
  },
  phones: [
    { number: '+375 (152) 43-01-72' },
    { number: '+375 (152) 45-39-25' },
    { number: '+375 (152) 45-39-69' },
  ],
  emails: [{ address: 'info@milk.by' }],
},
{
  id: 'mgmt-first-deputy',
  group: 'management',
  title: {
    ru: 'Первый заместитель генерального директора',
    be: 'Першы намеснік генеральнага дырэктара',
    en: 'First Deputy General Director (Production)',
    zh: '第一副总经理（生产运营）',
  },
  person: {
    ru: 'Михновец Ольга Кузьминична',
    be: 'Міхнавец Вольга Кузьмінічна',
    en: 'Olga Mikhnovets',
    zh: 'Olga Mikhnovets',
  },
  phones: [{ number: '+375 (152) 45-39-35' }],
  emails: [{ address: 'production@milk.by' }],
},
{
  id: 'mgmt-chief-engineer',
  group: 'management',
  title: {
    ru: 'Заместитель генерального директора — главный инженер',
    be: 'Намеснік генеральнага дырэктара — галоўны інжынер',
    en: 'Deputy General Director — Chief Engineer',
    zh: '副总经理兼总工程师',
  },
  person: {
    ru: 'Шапель Юрий Вацлавович',
    be: 'Шапель Юрый Вацлававіч',
    en: 'Yury Shapel',
    zh: 'Yury Shapel',
  },
  phones: [{ number: '+375 (152) 43-21-81' }],
  emails: [{ address: 'engineer@milk.by' }],
},
{
  id: 'mgmt-development',
  group: 'management',
  title: {
    ru: 'Заместитель генерального директора по развитию',
    be: 'Намеснік генеральнага дырэктара па развіцці',
    en: 'Deputy General Director for Development',
    zh: '企业发展副总经理',
  },
  person: {
    ru: 'Агейко Владимир Владимирович',
    be: 'Агейка Уладзімір Уладзіміравіч',
    en: 'Vladimir Ageiko',
    zh: 'Vladimir Ageiko',
  },
  phones: [{ number: '+375 (152) 45-39-46' }],
  emails: [{ address: 'tehotdel@milk.by' }],
},
{
  id: 'mgmt-ideology',
  group: 'management',
  title: {
    ru: 'Заместитель генерального директора по идеологической работе и социально-бытовым вопросам',
    be: 'Намеснік генеральнага дырэктара па ідэалагічнай рабоце і сацыяльна-бытавых пытаннях',
    en: 'Deputy General Director for Corporate Affairs & Social Policy',
    zh: '企业文化与社会事务副总经理',
  },
  person: {
    ru: 'Новицкий Игорь Чеславович',
    be: 'Навіцкі Ігар Часлававіч',
    en: 'Igor Novitsky',
    zh: 'Igor Novitsky',
  },
  phones: [{ number: '+375 (152) 45-39-20' }],
  emails: [{ address: 'ideolog@milk.by' }],
},
{
  id: 'mgmt-econ-security',
  group: 'management',
  title: {
    ru: 'Заместитель генерального директора по экономической и правовой безопасности',
    be: 'Намеснік генеральнага дырэктара па эканамічнай і прававой бяспецы',
    en: 'Deputy General Director for Economic & Legal Security',
    zh: '经济与法务安全副总经理',
  },
  person: {
    ru: 'Кривицкий Андрей Алексеевич',
    be: 'Крывіцкі Андрэй Аляксеевіч',
    en: 'Andrey Krivitsky',
    zh: 'Andrey Krivitsky',
  },
  phones: [{ number: '+375 (152) 45-39-67' }],
  emails: [{ address: 'safety@milk.by' }],
},
{
  id: 'mgmt-hr-security',
  group: 'management',
  title: {
    ru: 'Заместитель генерального директора по безопасности, режиму и кадрам',
    be: 'Намеснік генеральнага дырэктара па бяспецы, рэжыму і кадрах',
    en: 'Deputy General Director for Security & HR',
    zh: '安全合规与人力资源副总经理',
  },
  person: {
    ru: 'Галькин Василий Васильевич',
    be: 'Галькін Васіль Васільевіч',
    en: 'Vasily Galkin',
    zh: 'Vasily Galkin',
  },
  phones: [],
  emails: [{ address: 'brik@milk.by' }],
},

// ======================== 3. DEPARTMENTS & SERVICES ========================
{
  id: 'dept-marketing',
  group: 'departments',
  title: {
    ru: 'Сектор маркетинга',
    be: 'Сектар маркетынгу',
    en: 'Marketing Sector',
    zh: '市场营销部',
  },
  person: {
    ru: 'Якимович Анастасия Геннадьевна',
    be: 'Якімовіч Анастасія Генадзьеўна',
    en: 'Anastasia Yakimovich',
    zh: 'Anastasia Yakimovich',
  },
  phones: [{ number: '+375 (152) 41-25-29' }],
  emails: [{ address: 'market@milk.by' }],
},
{
  id: 'dept-brand-retail',
  group: 'departments',
  title: {
    ru: 'Отдел фирменной торговли',
    be: 'Аддзел фірменнага гандлю',
    en: 'Branded Retail Department',
    zh: '直营品牌零售部',
  },
  person: {
    ru: 'Семенчук Ирина Брониславовна',
    be: 'Семянчук Ірына Браніславаўна',
    en: 'Irina Semenchuk',
    zh: 'Irina Semenchuk',
  },
  phones: [{ number: '+375 (152) 41-62-01' }],
  emails: [{ address: 'firmtorg@milk.by' }],
},
{
  id: 'dept-quality',
  group: 'departments',
  title: {
    ru: 'Отдел качества и стандартизации',
    be: 'Аддзел якасці і стандартызацыі',
    en: 'Quality & Standardization Department',
    zh: '质量与标准化部',
  },
  person: {
    ru: 'Черко Инна Николаевна',
    be: 'Чарко Іна Мікалаеўна',
    en: 'Inna Cherko',
    zh: 'Inna Cherko',
  },
  phones: [{ number: '+375 (152) 43-00-06' }],
  emails: [{ address: 'kis@milk.by' }],
},
{
  id: 'dept-lab',
  group: 'departments',
  title: {
    ru: 'Производственная лаборатория',
    be: 'Вытворчая лабараторыя',
    en: 'Accredited Production Laboratory',
    zh: '中心生产质检实验室',
  },
  person: {
    ru: 'Шалкевич Елена Борисовна',
    be: 'Шалкевіч Алена Барысаўна',
    en: 'Elena Shalkevich',
    zh: 'Elena Shalkevich',
  },
  phones: [{ number: '+375 (152) 45-39-48' }],
  emails: [{ address: 'lab@milk.by' }],
},
{
  id: 'dept-raw-milk',
  group: 'departments',
  title: {
    ru: 'Сырьевой отдел',
    be: 'Сыравінны аддзел',
    en: 'Raw Milk Procurement Department',
    zh: '生牛乳原料采购部',
  },
  phones: [{ number: '+375 (152) 45-39-27' }],
  emails: [{ address: 'syrevoyotdel@milk.by' }],
},
{
  id: 'dept-procurement',
  group: 'departments',
  title: {
    ru: 'Отдел материально-технического снабжения',
    be: 'Аддзел матэрыяльна-тэхнічнага забеспячэння',
    en: 'Material & Technical Supply Department',
    zh: '物资与设备供应链采购部',
  },
  person: {
    ru: 'Жук Михаил Николаевич',
    be: 'Жук Міхаіл Мікалаевіч',
    en: 'Mikhail Zhuk',
    zh: 'Mikhail Zhuk',
  },
  phones: [{ number: '+375 (152) 45-39-44' }],
  emails: [{ address: 'snab@milk.by' }],
},
{
  id: 'dept-economics',
  group: 'departments',
  title: {
    ru: 'Планово-экономический отдел',
    be: 'Планава-эканамічны аддзел',
    en: 'Planning & Economics Department',
    zh: '计划与经济部',
  },
  person: {
    ru: 'Барташ Наталия Александровна',
    be: 'Барташ Наталля Аляксандраўна',
    en: 'Natalia Bartash',
    zh: 'Natalia Bartash',
  },
  phones: [{ number: '+375 (152) 45-39-23' }],
  emails: [{ address: 'econom@milk.by' }],
},
{
  id: 'dept-accounting',
  group: 'departments',
  title: {
    ru: 'Бухгалтерия',
    be: 'Бухгалтэрыя',
    en: 'Accounting Department',
    zh: '财务会计部',
  },
  person: {
    ru: 'Маерович Инна Марьяновна',
    be: 'Маяровіч Іна Мар’янаўна',
    en: 'Inna Maerovich',
    zh: 'Inna Maerovich',
  },
  phones: [{ number: '+375 (152) 45-39-34' }],
  emails: [{ address: 'buh@milk.by' }],
},
{
  id: 'dept-legal',
  group: 'departments',
  title: {
    ru: 'Юридический отдел',
    be: 'Юрыдычны аддзел',
    en: 'Legal Department',
    zh: '法务部',
  },
  person: {
    ru: 'Иванов Александр Васильевич',
    be: 'Іваноў Аляксандр Васільевіч',
    en: 'Alexander Ivanov',
    zh: 'Alexander Ivanov',
  },
  phones: [{ number: '+375 (152) 45-39-26' }],
  emails: [{ address: 'pravo@milk.by' }],
},
{
  id: 'dept-hr',
  group: 'departments',
  title: {
    ru: 'Отдел кадров',
    be: 'Аддзел кадраў',
    en: 'Human Resources Department',
    zh: '人力资源部',
  },
  person: {
    ru: 'Зайко Тамара Борисовна',
    be: 'Зайко Тамара Барысаўна',
    en: 'Tamara Zaiko',
    zh: 'Tamara Zaiko',
  },
  phones: [{ number: '+375 (152) 60-09-36' }],
  emails: [{ address: 'kadry@milk.by' }],
},
{
  id: 'dept-labor',
  group: 'departments',
  title: {
    ru: 'Отдел труда и заработной платы',
    be: 'Аддзел працы і заработнай платы',
    en: 'Labor & Compensation Department',
    zh: '薪酬与劳动管理部',
  },
  person: {
    ru: 'Рудникевич Татьяна Ивановна',
    be: 'Руднікевіч Таццяна Іванаўна',
    en: 'Tatiana Rudnikevich',
    zh: 'Tatiana Rudnikevich',
  },
  phones: [{ number: '+375 (152) 45-39-22' }],
  emails: [{ address: 'otiz@milk.by' }],
},
{
  id: 'dept-ice-dry',
  group: 'departments',
  title: {
    ru: 'Цех мороженого и сухих молочных продуктов',
    be: 'Цэх марозіва і сухіх малочных прадуктаў',
    en: 'Ice Cream & Dry Dairy Production Shop',
    zh: '冰淇淋与干乳制品生产车间',
  },
  person: {
    ru: 'Воробей Ольга Васильевна',
    be: 'Варабей Вольга Васільеўна',
    en: 'Olga Vorobei',
    zh: 'Olga Vorobei',
  },
  phones: [{ number: '+375 (152) 45-39-62' }],
  emails: [{ address: 'ice@milk.by' }],
},
{
  id: 'dept-transport',
  group: 'departments',
  title: {
    ru: 'Транспортный цех',
    be: 'Транспартны цэх',
    en: 'Transport & Fleet Department',
    zh: '冷链车队运输部',
  },
  person: {
    ru: 'Гишкелюк Сергей Петрович',
    be: 'Гішкелюк Сяргей Пятровіч',
    en: 'Sergey Gishkelyuk',
    zh: 'Sergey Gishkelyuk',
  },
  phones: [{ number: '+375 (152) 45-39-51' }],
  emails: [{ address: 'transport@milk.by' }],
},
{
  id: 'dept-construction',
  group: 'departments',
  title: {
    ru: 'Отдел капитального строительства',
    be: 'Аддзел капітальнага будаўніцтва',
    en: 'Capital Construction Department',
    zh: '基建工程部',
  },
  person: {
    ru: 'Жук Сергей Константинович',
    be: 'Жук Сяргей Канстанцінавіч',
    en: 'Sergey Zhuk',
    zh: 'Sergey Zhuk',
  },
  phones: [{ number: '+375 (152) 45-39-31' }],
  emails: [{ address: 'oks@milk.by' }],
},
{
  id: 'dept-energy',
  group: 'departments',
  title: {
    ru: 'Главный энергетик',
    be: 'Галоўны энергетык',
    en: 'Chief Power Engineer',
    zh: '总能源动力工程师',
  },
  person: {
    ru: 'Воробей Артём Олегович',
    be: 'Варабей Арцём Алегавіч',
    en: 'Artem Vorobei',
    zh: 'Artem Vorobei',
  },
  phones: [{ number: '+375 (152) 43-21-98' }],
  emails: [{ address: 'energy@milk.by' }],
},
{
  id: 'dept-mechanic',
  group: 'departments',
  title: {
    ru: 'Главный механик',
    be: 'Галоўны механік',
    en: 'Chief Mechanical Engineer',
    zh: '总机械设备工程师',
  },
  person: {
    ru: 'Борейко Александр Вячеславович',
    be: 'Барэйка Аляксандр Вячаслававіч',
    en: 'Alexander Boreiko',
    zh: 'Alexander Boreiko',
  },
  phones: [{ number: '+375 (152) 45-39-60' }],
  emails: [{ address: 'mechan@milk.by' }],
},
{
  id: 'dept-safety',
  group: 'departments',
  title: {
    ru: 'Служба охраны труда',
    be: 'Служба аховы працы',
    en: 'Occupational Health & Safety Office',
    zh: '职业安全与劳动保护处',
  },
  phones: [{ number: '+375 (152) 45-39-33' }],
  emails: [{ address: 'ot@milk.by' }],
},
{
  id: 'dept-medical',
  group: 'departments',
  title: {
    ru: 'Здравпункт',
    be: 'Здраўпункт',
    en: 'On-Site Medical Unit',
    zh: '企业医疗保健室',
  },
  person: {
    ru: 'Смолина Ольга Михайловна',
    be: 'Смоліна Вольга Міхайлаўна',
    en: 'Olga Smolina',
    zh: 'Olga Smolina',
  },
  phones: [{ number: '+375 (152) 45-39-32' }],
  emails: [{ address: 'doctor@milk.by' }],
},

// ======================== 4. BRANCHES, PLANTS, FARMS & HOLDING ========================
{
  id: 'branch-shchuchin',
  group: 'branches',
  title: {
    ru: 'Щучинский филиал ОАО «Молочный Мир»',
    be: 'Шчучынскі філіял ААТ «Малочны Мір»',
    en: 'Shchuchin Branch — OJSC "Molochny Mir"',
    zh: '休钦分公司 (Shchuchin)',
  },
  person: {
    ru: 'Директор: Пограновский Пётр Григорьевич',
    be: 'Дырэктар: Паграноўскі Пётр Рыгоравіч',
    en: 'Director: Petr Pogranovsky',
    zh: '厂长: Petr Pogranovsky',
  },
  address: {
    ru: '231513, г. Щучин, ул. 17 Сентября, 45',
    be: '231513, г. Шчучын, вул. 17 Верасня, 45',
    en: '45 17 Sentyabrya St, Shchuchin 231513',
    zh: '休钦市 9月17日街 45 号 (231513)',
  },
  phones: [{ number: '+375 (1514) 20-4-03' }],
  emails: [{ address: 'info_msz@schuchin-cheese.by' }],
  website: 'https://schuchin-cheese.by',
},
{
  id: 'branch-dyatlovo',
  group: 'branches',
  title: {
    ru: 'Дятловский филиал ОАО «Молочный Мир»',
    be: 'Дзятлаўскі філіял ААТ «Малочны Мір»',
    en: 'Dyatlovo Branch — OJSC "Molochny Mir"',
    zh: '佳特洛沃分公司 (Dyatlovo)',
  },
  person: {
    ru: 'Директор: Жидко Андрей Павлович',
    be: 'Дырэктар: Жыдко Андрэй Паўлавіч',
    en: 'Director: Andrey Zhidko',
    zh: '厂长: Andrey Zhidko',
  },
  address: {
    ru: '231471, г. Дятлово, ул. Октябрьская, 105',
    be: '231471, г. Дзятлава, вул. Кастрычніцкая, 105',
    en: '105 Oktyabrskaya St, Dyatlovo 231471',
    zh: '佳特洛沃市十月街 105 号 (231471)',
  },
  phones: [{ number: '+375 (1563) 64-7-44' }],
  emails: [{ address: 'cheeseland@mail.ru' }],
  website: 'https://cheeseland.by',
},
{
  id: 'branch-berestovitsa',
  group: 'branches',
  title: {
    ru: 'Производственный цех «Берестовица»',
    be: 'Вытворчы цэх «Бераставіца»',
    en: 'Berestovitsa Cheese Production Site',
    zh: '别列斯托维察奶酪生产分厂',
  },
  person: {
    ru: 'Начальник: Каскевич Олег Аркадьевич',
    be: 'Начальнік: Каскевіч Алег Аркадзьевіч',
    en: 'Head: Oleg Kaskevich',
    zh: '负责人: Oleg Kaskevich',
  },
  address: {
    ru: '231778, г.п. Большая Берестовица, ул. Дзержинского, 15',
    be: '231778, г.п. Вялікая Бераставіца, вул. Дзяржынскага, 15',
    en: '15 Dzerzhinskogo St, Bolshaya Berestovitsa 231778',
    zh: '大别列斯托维察 Dzerzhinskogo 街 15 号 (231778)',
  },
  phones: [{ number: '+375 (1511) 7-44-48' }],
  emails: [{ address: 'berestovica@milk.by' }],
},
{
  id: 'branch-skidel',
  group: 'branches',
  title: {
    ru: 'Производственный цех «Скидель»',
    be: 'Вытворчы цэх «Скідзель»',
    en: 'Skidel Production & Cold-Chain Site',
    zh: '斯基德尔生产与冷链分厂',
  },
  person: {
    ru: 'Начальник: Кочев Алексей Николаевич',
    be: 'Начальнік: Кочаў Аляксей Мікалаевіч',
    en: 'Head: Alexey Kochev',
    zh: '负责人: Alexey Kochev',
  },
  address: {
    ru: '231761, г. Скидель, ул. Зелёная, 1',
    be: '231761, г. Скідзель, вул. Зялёная, 1',
    en: '1 Zelenaya St, Skidel 231761',
    zh: '斯基德尔市 Zelenaya 街 1 号 (231761)',
  },
  phones: [{ number: '+375 (152) 47-30-70' }],
  emails: [{ address: 'skidel@milk.by' }],
},
{
  id: 'branch-porechye',
  group: 'branches',
  title: {
    ru: 'Участок б/а напитков и минеральных вод «Поречье»',
    be: 'Участак б/а напояў і мінеральных вод «Парэчча»',
    en: 'Porechye Mineral Water & Beverage Site',
    zh: '波列奇耶矿泉水与饮品分厂',
  },
  person: {
    ru: 'Начальник: Курман Александр Валерьянович',
    be: 'Начальнік: Курман Аляксандр Валяр’янавіч',
    en: 'Head: Alexander Kurman',
    zh: '负责人: Alexander Kurman',
  },
  address: {
    ru: 'д. Поречье, ул. Озерская, Гродненский район',
    be: 'в. Парэчча, вул. Азерская, Гродзенскі раён',
    en: 'Ozerskaya St, Porechye, Grodno District',
    zh: '格罗德诺区波列奇耶村 Ozerskaya 街',
  },
  phones: [
    { number: '+375 (152) 99-32-37' },
    { label: { ru: 'A1', be: 'A1', en: 'A1', zh: 'A1' }, number: '+375 (29) 699-24-93' },
  ],
  emails: [{ address: 'porechye@milk.by' }],
},
{
  id: 'branch-milkagro',
  group: 'branches',
  title: {
    ru: 'СУП «МилкАгро» (сельхозпредприятие)',
    be: 'СУП «МілкАгра» (сельгаспрадпрыемства)',
    en: 'MilkAgro Agricultural Enterprise',
    zh: 'MilkAgro 自有牧场企业',
  },
  person: {
    ru: 'Директор: Гуз Николай Николаевич',
    be: 'Дырэктар: Гуз Мікалай Мікалаевіч',
    en: 'Director: Nikolay Guz',
    zh: '总经理: Nikolay Guz',
  },
  address: {
    ru: '231770, г.п. Большая Берестовица, ул. Дзержинского, 9',
    be: '231770, г.п. Вялікая Бераставіца, вул. Дзяржынскага, 9',
    en: '9 Dzerzhinskogo St, Bolshaya Berestovitsa 231770',
    zh: '大别列斯托维察 Dzerzhinskogo 街 9 号 (231770)',
  },
  phones: [{ number: '+375 (1511) 46-1-55' }],
  emails: [{ address: 'agromir@milk.by' }],
},
{
  id: 'branch-dvorets',
  group: 'branches',
  title: {
    ru: 'ОАО «Дворец-Агро» (сельхозпредприятие)',
    be: 'ААТ «Дварэц-Агра» (сельгаспрадпрыемства)',
    en: 'OJSC "Dvorets-Agro" Dairy Farm',
    zh: 'Dvorets-Agro 自有牧场企业',
  },
  person: {
    ru: 'Директор: Дожин Дмитрий Валентинович',
    be: 'Дырэктар: Дожын Дзмітрый Валянцінавіч',
    en: 'Director: Dmitry Dozhin',
    zh: '总经理: Dmitry Dozhin',
  },
  address: {
    ru: '231474, аг. Дворец, ул. Новая, 7А, Дятловский р-н',
    be: '231474, аг. Дварэц, вул. Новая, 7А, Дзятлаўскі р-н',
    en: '7A Novaya St, Dvorets 231474, Dyatlovo District',
    zh: '佳特洛沃区 Dvorets 农庄 Novaya 街 7A 号 (231474)',
  },
  phones: [
    { number: '+375 (1563) 34-1-18' },
    { number: '+375 (1563) 34-0-99' },
  ],
  emails: [{ address: 'info@dvoretsagro.by' }],
},
{
  id: 'branch-holding',
  group: 'branches',
  title: {
    ru: 'Управляющая компания холдинга «Гродномясомолпром»',
    be: 'Кіруючая кампанія холдынгу «Гроднамясамалпрам»',
    en: 'Grodnomyasomolprom Holding Management Company',
    zh: '格罗德诺肉乳工业控股集团管理公司',
  },
  phones: [
    { number: '+375 (152) 62-10-02' },
    { label: { ru: 'Факс', be: 'Факс', en: 'Fax', zh: '传真' }, number: '+375 (152) 39-33-99' },
  ],
  emails: [{ address: 'info@grodnommp.by' }],
  website: 'https://grodnommp.by',
},
];

export const Contacts: React.FC = () => {
  const { language, t } = useLanguage();

  const [activeTab, setActiveTab] = useState<DirectoryTab>('sales');
  const [directoryQuery, setDirectoryQuery] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('sales');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(true);
  const [sent, setSent] = useState(false);

  const copy = {
    ru: {
      seoDesc:
      'Официальные контакты ОАО «Молочный Мир» (milk.by/kontakty): приёмная, руководство, отдел логистики и продаж, ВЭД/экспорт, заявки на воду 19 л и мороженое, филиалы и дилеры.',
      h1: 'Контакты ОАО «Молочный Мир»',
      lead: '230005, Республика Беларусь, г. Гродно, ул. Гаспадарчая, 28 · УНП 500040357',
      schedule: 'Пн–Пт: 08:00 – 17:00 (обед: 13:00 – 14:00) · Сб–Вс: выходной',
      topCards: [
        {
          title: 'Приёмная и канцелярия',
          subtitle: 'Жарникова Олеся Александровна · Общие вопросы',
          phones: ['+375 (152) 43-01-72', '+375 (152) 45-39-25', '+375 (152) 45-39-69'],
          email: 'info@milk.by',
        },
        {
          title: 'Отдел логистики и продаж (РБ)',
          subtitle: 'Сидо Наталия Станиславовна · Заявки: olip@milk.by',
          phones: ['+375 (152) 45-39-42', '+375 (152) 45-39-01'],
          email: 'sales@milk.by',
        },
        {
          title: 'Отдел внешнеэкономической деятельности',
          subtitle: 'Мелешко Светлана Ивановна · Международный экспорт',
          phones: ['+375 (152) 60-07-52', '+375 (152) 45-39-65', '+375 (152) 48-06-53'],
          email: 'ved@milk.by',
        },
      ],
      dirTitle: 'Справочник подразделений, филиалов и дилеров',
      dirSubtitle: 'Актуальные контакты отделов, приёма заявок и производственных площадок.',
      searchPlaceholder: 'Поиск по отделу, ФИО, телефону или городу (например, «вода», «экспорт», «Щучин»)…',
      searchActiveHint: (n: number) => `Найдено по запросу во всех разделах: ${n}`,
      tabs: {
        sales: 'Продажи, заявки и дилеры',
        management: 'Руководство',
        departments: 'Отделы и службы',
        branches: 'Филиалы, хозяйства и холдинг',
      },
      emptyDir: 'По вашему запросу контакты не найдены. Попробуйте изменить ключевое слово.',
      resetSearch: 'Сбросить поиск',
      hqTitle: 'Головное предприятие и приём граждан',
      hqRequisites: 'ОАО «Молочный Мир» · УНП 500040357 · 230005, Республика Беларусь, г. Гродно, ул. Гаспадарчая, 28',
      citizenHours: 'Приём граждан генеральным директором (Аникеева М.Е.): Среда, 17:00 – 20:00',
      sentTitle: 'Сообщение отправлено',
      sentDesc: 'Благодарим за обращение. Специалист свяжется с вами в рабочее время.',
      sendAnother: 'Отправить ещё одно сообщение',
      formTitle: 'Обратная связь',
        nameLabel: 'Имя / Организация *',
        deptLabel: 'Подразделение',
        deptOptions: {
          sales: 'Отдел логистики и продаж (sales@milk.by)',
          export: 'Отдел ВЭД / Экспорт (ved@milk.by)',
          orders: 'Заявки на продукцию / воду 19 л (olip@milk.by)',
          quality: 'Отдел качества и лаборатория (kis@milk.by)',
          hr: 'Отдел кадров (kadry@milk.by)',
          press: 'Приёмная / Сектор маркетинга (info@milk.by)',
        },
        msgLabel: 'Сообщение *',
        consentLabel: 'Согласен(на) на обработку персональных данных для ответа на обращение',
        submit: 'Отправить сообщение',
    },
    be: {
      seoDesc:
      'Афіцыйныя кантакты ААТ «Малочны Мір» (milk.by/kontakty): прыёмная, кіраўніцтва, аддзел лагістыкі і продажаў, ЗЭД/экспарт, заяўкі і філіялы.',
      h1: 'Кантакты ААТ «Малочны Мір»',
      lead: '230005, Рэспубліка Беларусь, г. Гродна, вул. Гаспадарчая, 28 · УНП 500040357',
      schedule: 'Пн–Пт: 08:00 – 17:00 (абед: 13:00 – 14:00) · Сб–Нд: выхадны',
      topCards: [
        {
          title: 'Прыёмная і канцылярыя',
          subtitle: 'Жарнікава Алеся Аляксандраўна · Агульныя пытанні',
          phones: ['+375 (152) 43-01-72', '+375 (152) 45-39-25', '+375 (152) 45-39-69'],
          email: 'info@milk.by',
        },
        {
          title: 'Аддзел лагістыкі і продажаў (РБ)',
          subtitle: 'Сідо Наталля Станіславаўна · Заяўкі: olip@milk.by',
          phones: ['+375 (152) 45-39-42', '+375 (152) 45-39-01'],
          email: 'sales@milk.by',
        },
        {
          title: 'Аддзел знешнеэканамічнай дзейнасці',
          subtitle: 'Мялешка Святлана Іванаўна · Міжнародны экспарт',
          phones: ['+375 (152) 60-07-52', '+375 (152) 45-39-65', '+375 (152) 48-06-53'],
          email: 'ved@milk.by',
        },
      ],
      dirTitle: 'Даведнік падраздзяленняў, філіялаў і дылераў',
      dirSubtitle: 'Актуальныя кантакты аддзелаў, прыёму заявак і вытворчых пляцовак.',
      searchPlaceholder: 'Пошук па аддзеле, прозвішчы, тэлефоне або горадзе…',
      searchActiveHint: (n: number) => `Знойдзена па запыце ва ўсіх раздзелах: ${n}`,
      tabs: {
        sales: 'Продажы, заяўкі і дылеры',
        management: 'Кіраўніцтва',
        departments: 'Аддзелы і службы',
        branches: 'Філіялы, гаспадаркі і холдынг',
      },
      emptyDir: 'Па вашым запыце кантакты не знойдзены.',
      resetSearch: 'Скінуць пошук',
      hqTitle: 'Галаўное прадпрыемства і прыём грамадзян',
      hqRequisites: 'ААТ «Малочны Мір» · УНП 500040357 · 230005, Рэспубліка Беларусь, г. Гродна, вул. Гаспадарчая, 28',
      citizenHours: 'Прыём грамадзян генеральным дырэктарам (Анікеева М.Я.): Серада, 17:00 – 20:00',
      sentTitle: 'Паведамленне адпраўлена',
      sentDesc: 'Дзякуй за зварот. Спецыяліст звяжацца з вамі ў працоўны час.',
      sendAnother: 'Адправіць яшчэ адно паведамленне',
      formTitle: 'Зваротная сувязь',
        nameLabel: 'Імя / Арганізацыя *',
        deptLabel: 'Падраздзяленне',
        deptOptions: {
          sales: 'Аддзел лагістыкі і продажаў (sales@milk.by)',
          export: 'Аддзел ЗЭД / Экспарт (ved@milk.by)',
          orders: 'Заяўкі на прадукцыю / ваду 19 л (olip@milk.by)',
          quality: 'Аддзел якасці і лабараторыя (kis@milk.by)',
          hr: 'Аддзел кадраў (kadry@milk.by)',
          press: 'Прыёмная / Маркетынг (info@milk.by)',
        },
        msgLabel: 'Паведамленне *',
        consentLabel: 'Згодны(а) на апрацоўку персанальных даных для адказу на зварот',
        submit: 'Адправіць паведамленне',
    },
    en: {
      seoDesc:
      'Official contacts of OJSC Molochny Mir (milk.by/kontakty): reception, executive leadership, domestic sales & logistics, export (ved@milk.by), branches, and official dealers.',
      h1: 'Contacts — OJSC "Molochny Mir"',
      lead: '28 Gaspadarchaya St, Grodno 230005, Republic of Belarus · UNP 500040357',
      schedule: 'Mon–Fri: 08:00 – 17:00 (Break: 13:00 – 14:00) · Sat–Sun: Closed',
      topCards: [
        {
          title: 'Reception & General Inquiries',
          subtitle: 'Olesya Zharnikova · Corporate Front Desk',
          phones: ['+375 (152) 43-01-72', '+375 (152) 45-39-25', '+375 (152) 45-39-69'],
          email: 'info@milk.by',
        },
        {
          title: 'Logistics & Domestic Sales',
          subtitle: 'Natalia Sido · Orders: olip@milk.by',
          phones: ['+375 (152) 45-39-42', '+375 (152) 45-39-01'],
          email: 'sales@milk.by',
        },
        {
          title: 'International Export (VED)',
          subtitle: 'Svetlana Meleshko · Global Contracts',
          phones: ['+375 (152) 60-07-52', '+375 (152) 45-39-65', '+375 (152) 48-06-53'],
          email: 'ved@milk.by',
        },
      ],
      dirTitle: 'Directory of Departments, Plants & Official Dealers',
      dirSubtitle: 'Direct lines for executive offices, order desks, regional branches, and labs.',
      searchPlaceholder: 'Search by department, name, phone, or city (e.g. "export", "Shchuchin", "lab")…',
      searchActiveHint: (n: number) => `Matches across all tabs: ${n}`,
      tabs: {
        sales: 'Sales, Orders & Dealers',
        management: 'Executive Leadership',
        departments: 'Departments & Labs',
        branches: 'Branches, Farms & Holding',
      },
      emptyDir: 'No directory records match your search query.',
      resetSearch: 'Reset search',
      hqTitle: 'Headquarters & Reception Schedule',
      hqRequisites: 'OJSC "Molochny Mir" · UNP 500040357 · 28 Gaspadarchaya St, Grodno 230005, Belarus',
      citizenHours: 'Public reception with General Director M. Anikeeva: Wednesday, 17:00 – 20:00',
      sentTitle: 'Message Sent',
      sentDesc: 'Thank you for reaching out. Our team will respond during business hours.',
      sendAnother: 'Send another message',
      formTitle: 'Direct Inquiry Form',
        nameLabel: 'Name / Company *',
        deptLabel: 'Department',
        deptOptions: {
          sales: 'Logistics & Wholesale Sales (sales@milk.by)',
          export: 'International Export Dept (ved@milk.by)',
          orders: 'Order Desk / 19L Water (olip@milk.by)',
          quality: 'Quality Control & Lab (kis@milk.by)',
          hr: 'Human Resources (kadry@milk.by)',
          press: 'Reception & Marketing (info@milk.by)',
        },
        msgLabel: 'Message *',
        consentLabel: 'I consent to the processing of my personal data to reply to this inquiry',
        submit: 'Send Message',
    },
    zh: {
      seoDesc:
      '白俄罗斯 Molochny Mir 乳业股份公司官方联系方式：总部前台、高管团队、国内销售部、国际出口外贸部 (ved@milk.by)、分公司及官方经销商。',
      h1: '联系 Molochny Mir 股份公司',
      lead: '白俄罗斯格罗德诺市 Gaspadarchaya 街 28 号 (230005) · 税号 UNP 500040357',
      schedule: '周一至周五: 08:00 – 17:00（午休: 13:00 – 14:00）· 周末休息',
      topCards: [
        {
          title: '总部前台与综合事务',
          subtitle: 'Olesya Zharnikova · 综合咨询',
          phones: ['+375 (152) 43-01-72', '+375 (152) 45-39-25', '+375 (152) 45-39-69'],
          email: 'info@milk.by',
        },
        {
          title: '物流与国内销售部',
          subtitle: 'Natalia Sido · 订单邮箱: olip@milk.by',
          phones: ['+375 (152) 45-39-42', '+375 (152) 45-39-01'],
          email: 'sales@milk.by',
        },
        {
          title: '国际外贸出口部门 (VED)',
          subtitle: 'Svetlana Meleshko · 国际业务专线',
          phones: ['+375 (152) 60-07-52', '+375 (152) 45-39-65', '+375 (152) 48-06-53'],
          email: 'ved@milk.by',
        },
      ],
      dirTitle: '各部门、分公司与官方经销商通讯录',
      dirSubtitle: '直通管理层、订单中心、检测实验室、分厂及合作牧场。',
      searchPlaceholder: '搜索部门名称、负责人、电话或城市（如“出口”、“休钦”、“实验室”）…',
      searchActiveHint: (n: number) => `跨分类匹配结果数: ${n}`,
      tabs: {
        sales: '销售、订单与经销商',
        management: '公司管理层',
        departments: '职能部门与实验室',
        branches: '分公司、牧场与控股集团',
      },
      emptyDir: '未找到匹配的联系信息，请尝试其他关键词。',
      resetSearch: '重置搜索',
      hqTitle: '总部地址与接待时间',
      hqRequisites: 'Molochny Mir 股份公司 · UNP 500040357 · 白俄罗斯格罗德诺市 Gaspadarchaya 街 28 号',
      citizenHours: '总经理 Marina Anikeeva 公众接待日: 每周三 17:00 – 20:00',
      sentTitle: '信息已发送',
      sentDesc: '感谢您的留言，我们的工作人员将在工作时间内尽快与您联系。',
      sendAnother: '再发送一条消息',
      formTitle: '在线联系表单',
        nameLabel: '姓名 / 公司名称 *',
        deptLabel: '联系部门',
        deptOptions: {
          sales: '大宗批发与物流销售部 (sales@milk.by)',
          export: '国际外贸出口部 (ved@milk.by)',
          orders: '产品与 19L 桶装水订单中心 (olip@milk.by)',
          quality: '质量控制与中心实验室 (kis@milk.by)',
          hr: '人力资源部 (kadry@milk.by)',
          press: '总部前台与市场部 (info@milk.by)',
        },
        msgLabel: '留言内容 *',
        consentLabel: '同意处理个人联系信息以便回复本次咨询',
        submit: '提交信息',
    },
  }[language];

  const tabMeta: { id: DirectoryTab; icon: React.FC<{ className?: string }> }[] = [
    { id: 'sales', icon: Truck },
    { id: 'management', icon: Users },
    { id: 'departments', icon: Briefcase },
    { id: 'branches', icon: Building2 },
  ];

  const displayedEntries = useMemo(() => {
    const q = directoryQuery.trim().toLowerCase();
    if (!q) {
      return DIRECTORY_ENTRIES.filter((item) => item.group === activeTab);
    }

    return DIRECTORY_ENTRIES.filter((item) => {
      const searchable = [
        item.title.ru,
        item.title.be,
        item.title.en,
        item.title.zh,
        item.person?.ru,
        item.person?.be,
        item.person?.en,
        item.address?.ru,
        item.address?.en,
        item.note?.ru,
        ...item.phones.map((p) => `${p.label?.[language] || ''} ${p.number}`),
                                    ...(item.emails?.map((e) => e.address) || []),
                                    item.website,
      ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

      return searchable.includes(q);
    });
  }, [activeTab, directoryQuery, language]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.includes('@') || !message.trim() || !consent) return;
    setSent(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
    <SeoHead
    title={`${t('navContacts')} — ${t('brandName')} (milk.by)`}
    description={copy.seoDesc}
    canonicalHash="/contacts"
    />

    {/* 1. Header & Working Hours */}
    <div className="space-y-3 border-b border-slate-200 pb-6">
    <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900">{copy.h1}</h1>
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-600">
    <span className="inline-flex items-center gap-2">
    <MapPin className="w-4 h-4 text-[#0057B8] shrink-0" />
    <span>{copy.lead}</span>
    </span>
    <span className="inline-flex items-center gap-2 tabular-nums">
    <Clock className="w-4 h-4 text-[#0057B8] shrink-0" />
    <span>{copy.schedule}</span>
    </span>
    </div>
    </div>

    {/* 2. Top 3 Primary Channels */}
    <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
    {copy.topCards.map((card, idx) => (
      <div
      key={card.email}
      className="border border-slate-200 rounded-2xl p-6 bg-slate-50/70 flex flex-col justify-between space-y-4"
      >
      <div className="space-y-1.5">
      <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#0057B8]">
      {idx === 2 ? <Globe2 className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
      <span>milk.by</span>
      </div>
      <h2 className="font-display text-lg font-bold text-slate-900">{card.title}</h2>
      <p className="text-xs text-slate-500">{card.subtitle}</p>
      </div>

      <div className="space-y-1.5 font-mono text-sm tabular-nums text-slate-700 pt-2 border-t border-slate-200/80">
      {card.phones.map((phone) => (
        <div key={phone} className="flex items-center gap-2">
        <Phone className="w-3.5 h-3.5 text-[#0057B8] shrink-0" />
        <a
        href={`tel:${phone.replace(/[^+\d]/g, '')}`}
        className="hover:text-[#0057B8] transition-colors"
        >
        {phone}
        </a>
        </div>
      ))}
      <div className="flex items-center gap-2 pt-0.5">
      <Mail className="w-3.5 h-3.5 text-[#0057B8] shrink-0" />
      <a
      href={`mailto:${card.email}`}
      className="text-[#0057B8] font-semibold hover:underline"
      >
      {card.email}
      </a>
      </div>
      </div>
      </div>
    ))}
    </section>

    {/* 3. Complete Interactive Contact Directory (milk.by/kontakty) */}
    <section className="space-y-6">
    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
    <div className="space-y-1">
    <h2 className="font-display text-2xl font-bold text-slate-900">{copy.dirTitle}</h2>
    <p className="text-sm text-slate-600">{copy.dirSubtitle}</p>
    </div>

    <div className="relative w-full lg:w-96">
    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
    <input
    type="text"
    value={directoryQuery}
    onChange={(e) => setDirectoryQuery(e.target.value)}
    placeholder={copy.searchPlaceholder}
    className="w-full h-10 pl-10 pr-9 text-base sm:text-sm bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0057B8] focus:ring-2 focus:ring-[#0057B8]/15"
    />
    {directoryQuery && (
      <button
      type="button"
      onClick={() => setDirectoryQuery('')}
      aria-label="Clear search"
      className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100"
      >
      <X className="w-4 h-4" />
      </button>
    )}
    </div>
    </div>

    {/* Category Tabs */}
    <div className="flex overflow-x-auto no-scrollbar gap-2 pb-1">
    {tabMeta.map(({ id, icon: Icon }) => {
      const active = activeTab === id && !directoryQuery.trim();
      return (
        <button
        key={id}
        type="button"
        onClick={() => {
          setDirectoryQuery('');
          setActiveTab(id);
        }}
        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold whitespace-nowrap shrink-0 transition-colors ${
          active
          ? 'bg-[#0057B8] text-white border-[#0057B8] shadow-xs'
          : 'bg-white text-slate-700 border-slate-200 hover:border-[#0057B8]/40 hover:text-[#0057B8]'
        }`}
        >
        <Icon className="w-4 h-4 shrink-0" />
        <span>{copy.tabs[id]}</span>
        </button>
      );
    })}
    </div>

    {directoryQuery.trim() && (
      <div className="text-xs font-medium text-[#0057B8] bg-blue-50/70 border border-blue-200/70 rounded-xl px-4 py-2 tabular-nums">
      {copy.searchActiveHint(displayedEntries.length)}
      </div>
    )}

    {displayedEntries.length === 0 ? (
      <div className="border border-slate-200 rounded-2xl bg-slate-50/70 p-8 text-center space-y-3">
      <p className="text-sm text-slate-600">{copy.emptyDir}</p>
      <button
      type="button"
      onClick={() => setDirectoryQuery('')}
      className="px-4 py-2 text-xs font-semibold text-white bg-[#0057B8] rounded-lg"
      >
      {copy.resetSearch}
      </button>
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {displayedEntries.map((entry) => (
        <article
        key={entry.id}
        className="border border-slate-200 rounded-2xl p-5 bg-white flex flex-col justify-between gap-3.5 hover:border-[#0057B8]/40 transition-colors"
        >
        <div className="space-y-1.5">
        <h3 className="font-display text-sm sm:text-base font-bold text-slate-900 leading-snug">
        {entry.title[language]}
        </h3>
        {entry.person && (
          <p className="text-xs font-medium text-slate-700">{entry.person[language]}</p>
        )}
        {entry.address && (
          <p className="text-xs text-slate-500 flex items-start gap-1.5 pt-0.5">
          <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-slate-400" />
          <span>{entry.address[language]}</span>
          </p>
        )}
        {entry.note && (
          <p className="text-xs text-[#0057B8] font-medium pt-0.5">
          {entry.note[language]}
          </p>
        )}
        </div>

        <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs font-mono tabular-nums text-slate-700">
        {entry.phones.map((phone, i) => (
          <div key={`${entry.id}-ph-${i}`} className="flex items-center gap-2">
          <Phone className="w-3.5 h-3.5 text-[#0057B8] shrink-0" />
          {phone.label && (
            <span className="font-sans text-[11px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
            {phone.label[language]}
            </span>
          )}
          <a
          href={`tel:${phone.number.replace(/[^+\d]/g, '')}`}
          className="hover:text-[#0057B8] transition-colors"
          >
          {phone.number}
          </a>
          </div>
        ))}

        {entry.emails?.map((em) => (
          <div key={em.address} className="flex items-center gap-2">
          <Mail className="w-3.5 h-3.5 text-[#0057B8] shrink-0" />
          {em.label && (
            <span className="font-sans text-[11px] text-slate-500">{em.label}:</span>
          )}
          <a
          href={`mailto:${em.address}`}
          className="text-[#0057B8] hover:underline truncate"
          >
          {em.address}
          </a>
          </div>
        ))}

        {entry.website && (
          <div className="flex items-center gap-2 pt-0.5">
          <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <a
          href={entry.website}
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-600 hover:text-[#0057B8] hover:underline truncate"
          >
          {entry.website.replace(/^https?:\/\//, '')}
          </a>
          </div>
        )}
        </div>
        </article>
      ))}
      </div>
    )}
    </section>

    {/* 4. HQ Requisites + Direct Feedback Form */}
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-2">
    <div className="lg:col-span-5 space-y-4">
    <div className="border border-slate-200 rounded-2xl p-6 bg-slate-50/70 space-y-3">
    <div className="flex items-center gap-2 font-display text-base font-bold text-slate-900">
    <MapPin className="w-4 h-4 text-[#0057B8] shrink-0" />
    <span>{copy.hqTitle}</span>
    </div>
    <p className="text-sm text-slate-700 leading-relaxed">{copy.hqRequisites}</p>
    <div className="pt-2 border-t border-slate-200 text-xs text-slate-600 space-y-1.5">
    <div className="flex items-start gap-2">
    <Clock className="w-3.5 h-3.5 text-[#0057B8] shrink-0 mt-0.5" />
    <span>{copy.schedule}</span>
    </div>
    <div className="flex items-start gap-2">
    <Users className="w-3.5 h-3.5 text-[#0057B8] shrink-0 mt-0.5" />
    <span>{copy.citizenHours}</span>
    </div>
    </div>
    </div>
    </div>

    <div className="lg:col-span-7 border border-slate-200 rounded-2xl p-5 sm:p-8 bg-white">
    {sent ? (
      <div className="py-10 text-center space-y-3">
      <CheckCircle2 className="w-10 h-10 text-[#0057B8] mx-auto" />
      <h2 className="font-display text-xl font-semibold text-slate-900">
      {copy.sentTitle}
      </h2>
      <p className="text-sm text-slate-600">{copy.sentDesc}</p>
      <button
      type="button"
      onClick={() => {
        setSent(false);
        setMessage('');
      }}
      className="px-4 py-2 text-xs font-semibold text-[#0057B8] bg-blue-50 rounded-lg"
      >
      {copy.sendAnother}
      </button>
      </div>
    ) : (
      <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="font-display text-xl font-semibold text-slate-900">
      {copy.formTitle}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
      <label className="block text-xs font-medium text-slate-700 mb-1">
      {copy.nameLabel}
      </label>
      <input
      type="text"
      required
      value={name}
      onChange={(e) => setName(e.target.value)}
      className="w-full h-10 px-3 text-base sm:text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#0057B8]"
      />
      </div>
      <div>
      <label className="block text-xs font-medium text-slate-700 mb-1">E-mail *</label>
      <input
      type="email"
      required
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="w-full h-10 px-3 text-base sm:text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#0057B8]"
      />
      </div>
      </div>

      <div>
      <label className="block text-xs font-medium text-slate-700 mb-1">
      {copy.deptLabel}
      </label>
      <select
      value={department}
      onChange={(e) => setDepartment(e.target.value)}
      className="w-full h-10 px-3 text-base sm:text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-[#0057B8]"
      >
      <option value="sales">{copy.deptOptions.sales}</option>
      <option value="export">{copy.deptOptions.export}</option>
      <option value="orders">{copy.deptOptions.orders}</option>
      <option value="quality">{copy.deptOptions.quality}</option>
      <option value="hr">{copy.deptOptions.hr}</option>
      <option value="press">{copy.deptOptions.press}</option>
      </select>
      </div>

      <div>
      <label className="block text-xs font-medium text-slate-700 mb-1">
      {copy.msgLabel}
      </label>
      <textarea
      rows={4}
      required
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      className="w-full p-3 text-base sm:text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#0057B8]"
      />
      </div>

      <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer select-none">
      <input
      type="checkbox"
      required
      checked={consent}
      onChange={(e) => setConsent(e.target.checked)}
      className="mt-0.5 w-4 h-4 rounded border-slate-300 text-[#0057B8] focus:ring-[#0057B8]"
      />
      <span>{copy.consentLabel}</span>
      </label>

      <button
      type="submit"
      className="w-full sm:w-auto px-5 py-2.5 text-sm font-semibold text-white bg-[#0057B8] rounded-lg hover:bg-[#004494] transition-colors"
      >
      {copy.submit}
      </button>
      </form>
    )}
    </div>
    </section>
    </div>
  );
};
