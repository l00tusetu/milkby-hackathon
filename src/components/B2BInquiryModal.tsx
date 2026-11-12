import React, { useState, useEffect } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import { Product } from '../types';
import { useLanguage } from '../hooks/useLanguage';

interface B2BInquiryModalProps {
  open: boolean;
  onClose: () => void;
  product?: Product;
  selectedPackageId?: string;
  defaultChannel?: 'export' | 'wholesale' | 'general';
}

export const B2BInquiryModal: React.FC<B2BInquiryModalProps> = ({
  open,
  onClose,
  product,
  selectedPackageId,
  defaultChannel = 'wholesale',
}) => {
  const { language, localize } = useLanguage();
  const [company, setCompany] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('Беларусь');
  const [volume, setVolume] = useState('1–5 тонн / партия');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (open) {
      setSubmitted(false);
      setError('');
      if (product) {
        const pkg = product.packages.find((p) => p.id === selectedPackageId) || product.packages[0];
        const prefix =
          language === 'ru'
            ? `Запрос спецификации и коммерческого предложения: ${localize(product.name)} (${pkg?.weight || ''})`
            : language === 'be'
            ? `Запыт спецыфікацыі і прапановы: ${localize(product.name)} (${pkg?.weight || ''})`
            : language === 'zh'
            ? `产品规格与商业报价咨询: ${localize(product.name)} (${pkg?.weight || ''})`
            : `Commercial quote & spec request: ${localize(product.name)} (${pkg?.weight || ''})`;
        setMessage(prefix);
      }
    }
  }, [open, product, selectedPackageId, language, localize]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !contactName.trim() || !email.includes('@')) {
      setError(
        language === 'ru'
          ? 'Укажите название компании, контактное лицо и корректный e-mail.'
          : language === 'be'
          ? 'Укажыце кампанію, кантактную асобу і карэктны e-mail.'
          : language === 'zh'
          ? '请填写公司名称、联系人及有效的电子邮箱。'
          : 'Please provide company name, contact person, and a valid email.'
      );
      return;
    }
    setError('');
    setSubmitted(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-semibold text-slate-900">
              {defaultChannel === 'export'
                ? language === 'ru'
                  ? 'Запрос в отдел экспорта'
                  : language === 'zh'
                  ? '国际出口部门咨询'
                  : 'Export Department Inquiry'
                : language === 'ru'
                ? 'Связаться с отделом продаж B2B'
                : language === 'be'
                ? 'Звязацца з аддзелам продажаў B2B'
                : language === 'zh'
                ? '联系 B2B 销售部门'
                : 'B2B Sales Department Inquiry'}
            </h2>
            <p className="text-xs text-slate-500">
              export@milk.by · sales@milk.by
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6">
          {submitted ? (
            <div className="py-6 text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-[#0057B8] mx-auto" strokeWidth={1.5} />
              <div className="space-y-1">
                <h3 className="font-display text-lg font-semibold text-slate-900">
                  {language === 'ru'
                    ? 'Заявка зарегистрирована'
                    : language === 'be'
                    ? 'Заяўка зарэгістравана'
                    : language === 'zh'
                    ? '您的询盘已成功提交'
                    : 'Inquiry Submitted'}
                </h3>
                <p className="text-sm text-slate-600">
                  {language === 'ru'
                    ? `Специалист отдела продаж свяжется с ${company} (${email}) в течение 1 рабочего дня.`
                    : `Our sales specialist will reply to ${company} (${email}) within 1 business day.`}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-[#0057B8] rounded-lg hover:bg-[#004494] transition-colors"
              >
                {language === 'ru' ? 'Закрыть' : language === 'zh' ? '关闭' : 'Close'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    {language === 'ru' ? 'Компания *' : language === 'zh' ? '公司名称 *' : 'Company *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="ООО «Партнёр Трейд»"
                    className="w-full h-10 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#0057B8]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    {language === 'ru' ? 'Контактное лицо *' : language === 'zh' ? '联系人 *' : 'Contact Person *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full h-10 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#0057B8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    E-mail *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="buyer@company.com"
                    className="w-full h-10 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#0057B8]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    {language === 'ru' ? 'Телефон' : language === 'zh' ? '联系电话' : 'Phone'}
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+375 ..."
                    className="w-full h-10 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#0057B8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    {language === 'ru' ? 'Страна поставки' : language === 'zh' ? '目的国/地区' : 'Destination Country'}
                  </label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full h-10 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#0057B8]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    {language === 'ru' ? 'Плановый объём' : language === 'zh' ? '预计采购量' : 'Estimated Volume'}
                  </label>
                  <input
                    type="text"
                    value={volume}
                    onChange={(e) => setVolume(e.target.value)}
                    className="w-full h-10 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#0057B8]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  {language === 'ru' ? 'Комментарий к запросу' : language === 'zh' ? '咨询详情' : 'Message'}
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#0057B8]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  {language === 'ru' ? 'Отмена' : language === 'zh' ? '取消' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold text-white bg-[#0057B8] rounded-lg hover:bg-[#004494] transition-colors"
                >
                  {language === 'ru' ? 'Отправить запрос' : language === 'zh' ? '提交咨询' : 'Submit Inquiry'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
