import React, { useState } from 'react';
import { Phone, Mail, MapPin, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { SeoHead } from '../components/SeoHead';

export const Contacts: React.FC = () => {
  const { language, t } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('sales');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const copy = {
    ru: {
      seoDesc: 'Контакты ОАО «Молочный Мир»: приёмная, отдел оптовых продаж, отдел экспорта и пресс-служба.',
      depts: [
        { title: 'Отдел оптовых продаж (РБ / HoReCa)', phone: '+375 (152) 44-55-01', email: 'sales@milk.by' },
        { title: 'Отдел внешнеэкономической деятельности (Экспорт)', phone: '+375 (152) 44-55-12', email: 'export@milk.by' },
        { title: 'Приёмная и пресс-служба', phone: '+375 (152) 44-55-00', email: 'info@milk.by' },
      ],
      hq: 'Адрес головного предприятия',
      sentTitle: 'Сообщение отправлено',
      sentDesc: 'Благодарим за обращение. Специалист свяжется с вами в рабочее время.',
      sendAnother: 'Отправить ещё одно сообщение',
      formTitle: 'Обратная связь',
        nameLabel: 'Имя / Организация *',
        deptLabel: 'Подразделение',
        deptOptions: {
          sales: 'Отдел оптовых продаж',
          export: 'Отдел экспорта (ВЭД)',
          quality: 'Служба качества',
          press: 'Пресс-служба',
        },
        msgLabel: 'Сообщение *',
        submit: 'Отправить сообщение',
    },
    be: {
      seoDesc: 'Кантакты ААТ «Малочны Мір»: прыёмная, аддзел аптовых продажаў, аддзел экспарту і прэс-служба.',
      depts: [
        { title: 'Аддзел аптовых продажаў (РБ / HoReCa)', phone: '+375 (152) 44-55-01', email: 'sales@milk.by' },
        { title: 'Аддзел знешнеэканамічнай дзейнасці (Экспарт)', phone: '+375 (152) 44-55-12', email: 'export@milk.by' },
        { title: 'Прыёмная і прэс-служба', phone: '+375 (152) 44-55-00', email: 'info@milk.by' },
      ],
      hq: 'Адрас галаўнога прадпрыемства',
      sentTitle: 'Паведамленне адпраўлена',
      sentDesc: 'Дзякуй за зварот. Спецыяліст звяжацца з вамі ў працоўны час.',
      sendAnother: 'Адправіць яшчэ адно паведамленне',
      formTitle: 'Зваротная сувязь',
        nameLabel: 'Імя / Арганізацыя *',
        deptLabel: 'Падраздзяленне',
        deptOptions: {
          sales: 'Аддзел аптовых продажаў',
          export: 'Аддзел экспарту (ЗЭД)',
          quality: 'Служба якасці',
          press: 'Прэс-служба',
        },
        msgLabel: 'Паведамленне *',
        submit: 'Адправіць паведамленне',
    },
    en: {
      seoDesc: 'Contacts of Molochny Mir JSC: reception, wholesale sales, international export department, and press office.',
      depts: [
        { title: 'Domestic Wholesale & HoReCa', phone: '+375 (152) 44-55-01', email: 'sales@milk.by' },
        { title: 'International Export Department', phone: '+375 (152) 44-55-12', email: 'export@milk.by' },
        { title: 'Corporate Office & Press', phone: '+375 (152) 44-55-00', email: 'info@milk.by' },
      ],
      hq: 'Headquarters',
      sentTitle: 'Message Sent',
      sentDesc: 'Thank you for reaching out. Our team will respond shortly.',
      sendAnother: 'Send another message',
      formTitle: 'Direct Inquiry Form',
        nameLabel: 'Name / Company *',
        deptLabel: 'Department',
        deptOptions: {
          sales: 'Wholesale Sales',
          export: 'International Export',
          quality: 'Quality Control',
          press: 'Press & Media',
        },
        msgLabel: 'Message *',
        submit: 'Send Message',
    },
    zh: {
      seoDesc: '联系 Molochny Mir 股份公司：总机、大宗批发部、国际出口外贸部及新闻媒体部门。',
      depts: [
        { title: '国内批发与餐饮销售部 (HoReCa)', phone: '+375 (152) 44-55-01', email: 'sales@milk.by' },
        { title: '国际外贸出口部门', phone: '+375 (152) 44-55-12', email: 'export@milk.by' },
        { title: '总部办公室与媒体公关', phone: '+375 (152) 44-55-00', email: 'info@milk.by' },
      ],
      hq: '企业总部地址',
      sentTitle: '信息已发送',
      sentDesc: '感谢您的留言，我们的工作人员将在工作时间内尽快与您联系。',
      sendAnother: '再发送一条消息',
      formTitle: '在线联系表单',
        nameLabel: '姓名 / 公司名称 *',
        deptLabel: '联系部门',
        deptOptions: {
          sales: '大宗批发销售部',
          export: '国际出口贸易部',
          quality: '质量控制中心',
          press: '新闻与媒体部',
        },
        msgLabel: '留言内容 *',
        submit: '提交信息',
    },
  }[language];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.includes('@') || !message.trim()) return;
    setSent(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
    <SeoHead
    title={`${t('ctaContact')} — ${t('brandName')}`}
    description={copy.seoDesc}
    canonicalHash="/contacts"
    />

    <div className="space-y-3">
    <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900">
    {t('ctaContact')}
    </h1>
    <p className="text-sm sm:text-base text-slate-600 max-w-2xl">{t('footerLegal')}</p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
    <div className="lg:col-span-5 space-y-4">
    {copy.depts.map((dept) => (
      <div key={dept.email} className="border border-slate-200 rounded-xl p-5 space-y-2 bg-slate-50/60">
      <h2 className="font-display text-base font-semibold text-slate-900">{dept.title}</h2>
      <div className="text-sm text-slate-600 space-y-1 font-mono tabular-nums">
      <div className="flex items-center gap-2">
      <Phone className="w-3.5 h-3.5 text-[#0057B8]" />
      <span>{dept.phone}</span>
      </div>
      <div className="flex items-center gap-2">
      <Mail className="w-3.5 h-3.5 text-[#0057B8]" />
      <span>{dept.email}</span>
      </div>
      </div>
      </div>
    ))}

    <div className="border border-slate-200 rounded-xl p-5 space-y-1.5 text-sm text-slate-600">
    <div className="flex items-center gap-2 font-semibold text-slate-900">
    <MapPin className="w-4 h-4 text-[#0057B8]" />
    <span>{copy.hq}</span>
    </div>
    <p>{t('footerLegal')}</p>
    </div>
    </div>

    <div className="lg:col-span-7 border border-slate-200 rounded-2xl p-6 sm:p-8 bg-white">
    {sent ? (
      <div className="py-10 text-center space-y-3">
      <CheckCircle2 className="w-10 h-10 text-[#0057B8] mx-auto" />
      <h2 className="font-display text-xl font-semibold text-slate-900">{copy.sentTitle}</h2>
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
      <h2 className="font-display text-xl font-semibold text-slate-900">{copy.formTitle}</h2>

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
      className="w-full h-10 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#0057B8]"
      />
      </div>
      <div>
      <label className="block text-xs font-medium text-slate-700 mb-1">E-mail *</label>
      <input
      type="email"
      required
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="w-full h-10 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#0057B8]"
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
      className="w-full h-10 px-3 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-[#0057B8]"
      >
      <option value="sales">{copy.deptOptions.sales}</option>
      <option value="export">{copy.deptOptions.export}</option>
      <option value="quality">{copy.deptOptions.quality}</option>
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
      className="w-full p-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#0057B8]"
      />
      </div>

      <button
      type="submit"
      className="px-5 py-2.5 text-sm font-semibold text-white bg-[#0057B8] rounded-lg hover:bg-[#004494] transition-colors"
      >
      {copy.submit}
      </button>
      </form>
    )}
    </div>
    </div>
    </div>
  );
};
