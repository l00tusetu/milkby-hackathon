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
import { useCatalogStore } from '../hooks/useCatalogStore';
import { SeoHead } from '../components/SeoHead';
import { DirectoryGroup } from '../types';

export const Contacts: React.FC = () => {
  const { language, localize, t } = useLanguage();
  const { directoryEntries, siteSettings } = useCatalogStore();

  const [activeTab, setActiveTab] = useState<DirectoryGroup>('sales');
  const [directoryQuery, setDirectoryQuery] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('sales');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(true);
  const [sent, setSent] = useState(false);

  const { contactMeta } = siteSettings;

  const copy = {
    ru: {
      seoDesc:
      'Официальные контакты ОАО «Молочный Мир» (milk.by/kontakty): приёмная, руководство, отдел логистики и продаж, ВЭД/экспорт, заявки на воду 19 л и мороженое, филиалы и дилеры.',
      h1: 'Контакты ОАО «Молочный Мир»',
      unpPrefix: 'УНП',
      dirTitle: 'Справочник подразделений, филиалов и дилеров',
      dirSubtitle: 'Актуальные контакты отделов, приёма заявок и производственных площадок.',
      searchPlaceholder:
      'Поиск по отделу, ФИО, телефону или городу (например, «вода», «экспорт», «Щучин»)…',
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
      sentTitle: 'Сообщение отправлено',
      sentDesc: 'Благодарим за обращение. Специалист свяжется с вами в рабочее время.',
      sendAnother: 'Отправить ещё одно сообщение',
      formTitle: 'Обратная связь',
        nameLabel: 'Имя / Организация *',
        deptLabel: 'Подразделение',
        deptOptions: {
          sales: `Отдел логистики и продаж (${contactMeta.salesEmail})`,
          export: `Отдел ВЭД / Экспорт (${contactMeta.exportEmail})`,
          orders: `Заявки на продукцию / воду 19 л (${contactMeta.salesOrdersEmail})`,
          quality: 'Отдел качества и лаборатория (kis@milk.by)',
          hr: 'Отдел кадров (kadry@milk.by)',
          press: `Приёмная / Сектор маркетинга (${contactMeta.receptionEmail})`,
        },
        msgLabel: 'Сообщение *',
        consentLabel: 'Согласен(на) на обработку персональных данных для ответа на обращение',
        submit: 'Отправить сообщение',
    },
    be: {
      seoDesc:
      'Афіцыйныя кантакты ААТ «Малочны Мір» (milk.by/kontakty): прыёмная, кіраўніцтва, аддзел лагістыкі і продажаў, ЗЭД/экспарт, заяўкі і філіялы.',
      h1: 'Кантакты ААТ «Малочны Мір»',
      unpPrefix: 'УНП',
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
      sentTitle: 'Паведамленне адпраўлена',
      sentDesc: 'Дзякуй за зварот. Спецыяліст звяжацца з вамі ў працоўны час.',
      sendAnother: 'Адправіць яшчэ адно паведамленне',
      formTitle: 'Зваротная сувязь',
        nameLabel: 'Імя / Арганізацыя *',
        deptLabel: 'Падраздзяленне',
        deptOptions: {
          sales: `Аддзел лагістыкі і продажаў (${contactMeta.salesEmail})`,
          export: `Аддзел ЗЭД / Экспарт (${contactMeta.exportEmail})`,
          orders: `Заяўкі на прадукцыю / ваду 19 л (${contactMeta.salesOrdersEmail})`,
          quality: 'Аддзел якасці і лабараторыя (kis@milk.by)',
          hr: 'Аддзел кадраў (kadry@milk.by)',
          press: `Прыёмная / Маркетынг (${contactMeta.receptionEmail})`,
        },
        msgLabel: 'Паведамленне *',
        consentLabel: 'Згодны(а) на апрацоўку персанальных даных для адказу на зварот',
        submit: 'Адправіць паведамленне',
    },
    en: {
      seoDesc:
      'Official contacts of OJSC Molochny Mir (milk.by/kontakty): reception, executive leadership, domestic sales & logistics, export (ved@milk.by), branches, and official dealers.',
      h1: 'Contacts — OJSC "Molochny Mir"',
      unpPrefix: 'UNP',
      dirTitle: 'Directory of Departments, Plants & Official Dealers',
      dirSubtitle: 'Direct lines for executive offices, order desks, regional branches, and labs.',
      searchPlaceholder:
      'Search by department, name, phone, or city (e.g. "export", "Shchuchin", "lab")…',
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
      sentTitle: 'Message Sent',
      sentDesc: 'Thank you for reaching out. Our team will respond during business hours.',
      sendAnother: 'Send another message',
      formTitle: 'Direct Inquiry Form',
        nameLabel: 'Name / Company *',
        deptLabel: 'Department',
        deptOptions: {
          sales: `Logistics & Wholesale Sales (${contactMeta.salesEmail})`,
          export: `International Export Dept (${contactMeta.exportEmail})`,
          orders: `Order Desk / 19L Water (${contactMeta.salesOrdersEmail})`,
          quality: 'Quality Control & Lab (kis@milk.by)',
          hr: 'Human Resources (kadry@milk.by)',
          press: `Reception & Marketing (${contactMeta.receptionEmail})`,
        },
        msgLabel: 'Message *',
        consentLabel: 'I consent to the processing of my personal data to reply to this inquiry',
        submit: 'Send Message',
    },
    zh: {
      seoDesc:
      '白俄罗斯 Molochny Mir 乳业股份公司官方联系方式：总部前台、高管团队、国内销售部、国际出口外贸部 (ved@milk.by)、分公司及官方经销商。',
      h1: '联系 Molochny Mir 股份公司',
      unpPrefix: '税号 UNP',
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
      sentTitle: '信息已发送',
      sentDesc: '感谢您的留言，我们的工作人员将在工作时间内尽快与您联系。',
      sendAnother: '再发送一条消息',
      formTitle: '在线联系表单',
        nameLabel: '姓名 / 公司名称 *',
        deptLabel: '联系部门',
        deptOptions: {
          sales: `大宗批发与物流销售部 (${contactMeta.salesEmail})`,
          export: `国际外贸出口部 (${contactMeta.exportEmail})`,
          orders: `产品与 19L 桶装水订单中心 (${contactMeta.salesOrdersEmail})`,
          quality: '质量控制与中心实验室 (kis@milk.by)',
          hr: '人力资源部 (kadry@milk.by)',
          press: `总部前台与市场部 (${contactMeta.receptionEmail})`,
        },
        msgLabel: '留言内容 *',
        consentLabel: '同意处理个人联系信息以便回复本次咨询',
        submit: '提交信息',
    },
  }[language];

  const topCards = [
    {
      title: localize(contactMeta.receptionTitle),
      subtitle: localize(contactMeta.receptionSubtitle),
      phones: [contactMeta.receptionPhone, '+375 (152) 45-39-25', '+375 (152) 45-39-69'].filter(
        (v, i, arr) => v && arr.indexOf(v) === i
      ),
      email: contactMeta.receptionEmail,
    },
    {
      title: localize(contactMeta.salesTitle),
      subtitle: localize(contactMeta.salesSubtitle),
      phones: [contactMeta.salesPhone, '+375 (152) 45-39-01'].filter(
        (v, i, arr) => v && arr.indexOf(v) === i
      ),
      email: contactMeta.salesEmail,
    },
    {
      title: localize(contactMeta.exportTitle),
      subtitle: localize(contactMeta.exportSubtitle),
      phones: [contactMeta.exportPhone, '+375 (152) 45-39-65', contactMeta.exportPhoneAlt].filter(
        (v, i, arr) => v && arr.indexOf(v) === i
      ),
      email: contactMeta.exportEmail,
    },
  ];

  const tabMeta: { id: DirectoryGroup; icon: React.FC<{ className?: string }> }[] = [
    { id: 'sales', icon: Truck },
    { id: 'management', icon: Users },
    { id: 'departments', icon: Briefcase },
    { id: 'branches', icon: Building2 },
  ];

  const displayedEntries = useMemo(() => {
    const visible = directoryEntries.filter((e) => e.visible);
    const q = directoryQuery.trim().toLowerCase();
    if (!q) {
      return visible.filter((item) => item.group === activeTab);
    }

    return visible.filter((item) => {
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
  }, [directoryEntries, activeTab, directoryQuery, language]);

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
    <span>
    {localize(contactMeta.hqAddress)} · {copy.unpPrefix} {contactMeta.unp}
    </span>
    </span>
    <span className="inline-flex items-center gap-2 tabular-nums">
    <Clock className="w-4 h-4 text-[#0057B8] shrink-0" />
    <span>{localize(contactMeta.schedule)}</span>
    </span>
    </div>
    </div>

    {/* 2. Top 3 Primary Channels */}
    <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
    {topCards.map((card, idx) => (
      <div
      key={`${card.email}-${idx}`}
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

    {/* 3. Complete Interactive Contact Directory */}
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
        {localize(entry.title)}
        </h3>
        {entry.person && localize(entry.person) && (
          <p className="text-xs font-medium text-slate-700">{localize(entry.person)}</p>
        )}
        {entry.address && localize(entry.address) && (
          <p className="text-xs text-slate-500 flex items-start gap-1.5 pt-0.5">
          <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-slate-400" />
          <span>{localize(entry.address)}</span>
          </p>
        )}
        {entry.note && localize(entry.note) && (
          <p className="text-xs text-[#0057B8] font-medium pt-0.5">
          {localize(entry.note)}
          </p>
        )}
        </div>

        <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs font-mono tabular-nums text-slate-700">
        {entry.phones.map((phone, i) => (
          <div key={`${entry.id}-ph-${i}`} className="flex items-center gap-2">
          <Phone className="w-3.5 h-3.5 text-[#0057B8] shrink-0" />
          {phone.label && localize(phone.label) && (
            <span className="font-sans text-[11px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
            {localize(phone.label)}
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
    <p className="text-sm text-slate-700 leading-relaxed">
    {t('brandName')} · {copy.unpPrefix} {contactMeta.unp} · {localize(contactMeta.hqAddress)}
    </p>
    <div className="pt-2 border-t border-slate-200 text-xs text-slate-600 space-y-1.5">
    <div className="flex items-start gap-2">
    <Clock className="w-3.5 h-3.5 text-[#0057B8] shrink-0 mt-0.5" />
    <span>{localize(contactMeta.schedule)}</span>
    </div>
    <div className="flex items-start gap-2">
    <Users className="w-3.5 h-3.5 text-[#0057B8] shrink-0 mt-0.5" />
    <span>{localize(contactMeta.citizenHours)}</span>
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
