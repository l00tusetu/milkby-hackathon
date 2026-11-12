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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.includes('@') || !message.trim()) return;
    setSent(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      <SeoHead
        title={`${t('ctaContact')} — ${t('brandName')}`}
        description="Контакты ОАО «Молочный Мир»: приёмная, отдел оптовых продаж, отдел экспорта и пресс-служба."
        canonicalHash="/contacts"
      />

      <div className="space-y-3">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900">
          {t('ctaContact')}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl">
          {t('footerLegal')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-4">
          {[
            {
              title: language === 'ru' ? 'Отдел оптовых продаж (РБ / HoReCa)' : 'Domestic Wholesale & HoReCa',
              phone: '+375 (152) 44-55-01',
              email: 'sales@milk.by',
            },
            {
              title: language === 'ru' ? 'Отдел внешнеэкономической деятельности (Экспорт)' : 'International Export Department',
              phone: '+375 (152) 44-55-12',
              email: 'export@milk.by',
            },
            {
              title: language === 'ru' ? 'Приёмная и пресс-служба' : 'Corporate Office & Press',
              phone: '+375 (152) 44-55-00',
              email: 'info@milk.by',
            },
          ].map((dept) => (
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
              <span>{language === 'ru' ? 'Адрес головного предприятия' : 'Headquarters'}</span>
            </div>
            <p>{t('footerLegal')}</p>
          </div>
        </div>

        <div className="lg:col-span-7 border border-slate-200 rounded-2xl p-6 sm:p-8 bg-white">
          {sent ? (
            <div className="py-10 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-[#0057B8] mx-auto" />
              <h2 className="font-display text-xl font-semibold text-slate-900">
                {language === 'ru' ? 'Сообщение отправлено' : 'Message Sent'}
              </h2>
              <p className="text-sm text-slate-600">
                {language === 'ru'
                  ? 'Благодарим за обращение. Специалист свяжется с вами в рабочее время.'
                  : 'Thank you for reaching out. Our team will respond shortly.'}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSent(false);
                  setMessage('');
                }}
                className="px-4 py-2 text-xs font-semibold text-[#0057B8] bg-blue-50 rounded-lg"
              >
                {language === 'ru' ? 'Отправить ещё одно сообщение' : 'Send another message'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="font-display text-xl font-semibold text-slate-900">
                {language === 'ru' ? 'Обратная связь' : language === 'zh' ? '在线联系表单' : 'Direct Inquiry Form'}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    {language === 'ru' ? 'Имя / Организация *' : 'Name / Company *'}
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
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    E-mail *
                  </label>
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
                  {language === 'ru' ? 'Подразделение' : 'Department'}
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full h-10 px-3 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-[#0057B8]"
                >
                  <option value="sales">{language === 'ru' ? 'Отдел оптовых продаж' : 'Wholesale Sales'}</option>
                  <option value="export">{language === 'ru' ? 'Отдел экспорта (ВЭД)' : 'International Export'}</option>
                  <option value="quality">{language === 'ru' ? 'Служба качества' : 'Quality Control'}</option>
                  <option value="press">{language === 'ru' ? 'Пресс-служба' : 'Press & Media'}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  {language === 'ru' ? 'Сообщение *' : 'Message *'}
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
                {language === 'ru' ? 'Отправить сообщение' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
