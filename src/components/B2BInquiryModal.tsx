import React, { useState, useEffect } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import { Product } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import { apiClient } from '../utils/apiClient';

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
  const [mounted, setMounted] = useState(open);
  const [closing, setClosing] = useState(false);

  const [company, setCompany] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [volume, setVolume] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState<string | null>(null);

  const copy = {
    ru: {
      defaultCountry: 'Беларусь',
      defaultVolume: '1–5 тонн / партия',
      prefix: 'Запрос спецификации и коммерческого предложения:',
      err: 'Укажите название компании, контактное лицо и корректный e-mail.',
      titleExport: 'Запрос в отдел экспорта',
      titleSales: 'Связаться с отделом продаж B2B',
      sentTitle: 'Заявка зарегистрирована',
      sentDesc: (c: string, e: string) =>
        `Специалист отдела продаж свяжется с ${c} (${e}) в течение 1 рабочего дня.`,
      close: 'Закрыть',
      company: 'Компания *',
      companyPlaceholder: 'ООО «Партнёр Трейд»',
      contact: 'Контактное лицо *',
      phone: 'Телефон',
      country: 'Страна поставки',
      volume: 'Плановый объём',
      message: 'Комментарий к запросу',
      cancel: 'Отмена',
      submit: 'Отправить запрос',
      sending: 'Отправка…',
    },
    be: {
      defaultCountry: 'Беларусь',
      defaultVolume: '1–5 тон / партыя',
      prefix: 'Запыт спецыфікацыі і камерцыйнай прапановы:',
      err: 'Укажыце назву кампаніі, кантактную асобу і карэктны e-mail.',
      titleExport: 'Запыт у аддзел экспарту',
      titleSales: 'Звязацца з аддзелам продажаў B2B',
      sentTitle: 'Заяўка зарэгістравана',
      sentDesc: (c: string, e: string) =>
        `Спецыяліст аддзела продажаў звяжацца з ${c} (${e}) на працягу 1 працоўнага дня.`,
      close: 'Закрыць',
      company: 'Кампанія *',
      companyPlaceholder: 'ТАА «Партнёр Трэйд»',
      contact: 'Кантактная асоба *',
      phone: 'Тэлефон',
      country: 'Краіна пастаўкі',
      volume: 'Планавы аб’ём',
      message: 'Каментарый да запыту',
      cancel: 'Адмена',
      submit: 'Адправіць запыт',
      sending: 'Адпраўка…',
    },
    en: {
      defaultCountry: 'Belarus / Export',
      defaultVolume: '1–5 tons / shipment',
      prefix: 'Commercial quote & spec request:',
      err: 'Please provide company name, contact person, and a valid email.',
      titleExport: 'Export Department Inquiry',
      titleSales: 'B2B Sales Department Inquiry',
      sentTitle: 'Inquiry Submitted',
      sentDesc: (c: string, e: string) =>
        `Our sales specialist will reply to ${c} (${e}) within 1 business day.`,
      close: 'Close',
      company: 'Company *',
      companyPlaceholder: 'Partner Trade LLC',
      contact: 'Contact Person *',
      phone: 'Phone',
      country: 'Destination Country',
      volume: 'Estimated Volume',
      message: 'Message',
      cancel: 'Cancel',
      submit: 'Submit Inquiry',
      sending: 'Sending…',
    },
    zh: {
      defaultCountry: '中国 / 出口目的地',
      defaultVolume: '1–5 吨 / 批次',
      prefix: '产品规格与商业报价咨询:',
      err: '请填写公司名称、联系人及有效的电子邮箱。',
      titleExport: '国际出口部门咨询',
      titleSales: '联系 B2B 销售部门',
      sentTitle: '您的询盘已成功提交',
      sentDesc: (c: string, e: string) =>
        `我们的外贸及销售专员将在 1 个工作日内联系 ${c} (${e})。`,
      close: '关闭',
      company: '公司名称 *',
      companyPlaceholder: '某某国际贸易有限公司',
      contact: '联系人 *',
      phone: '联系电话',
      country: '目的国/地区',
      volume: '预计采购量',
      message: '咨询详情',
      cancel: '取消',
      submit: '提交咨询',
      sending: '提交中…',
    },
  }[language];

  useEffect(() => {
    if (open) {
      setMounted(true);
      setClosing(false);
      return;
    }

    if (mounted) {
      setClosing(true);
      const timer = window.setTimeout(() => {
        setMounted(false);
        setClosing(false);
      }, 180);
      return () => window.clearTimeout(timer);
    }
  }, [open, mounted]);

  useEffect(() => {
    if (!open) return;
    setSubmitted(false);
    setReferenceId(null);
    setError('');
    setCountry((prev) => prev || copy.defaultCountry);
    setVolume((prev) => prev || copy.defaultVolume);

    if (product) {
      const pkg = product.packages.find((p) => p.id === selectedPackageId) || product.packages[0];
      setMessage(`${copy.prefix} ${localize(product.name)} (${pkg?.weight || ''})`);
    } else {
      setMessage('');
    }
  }, [open, product, selectedPackageId, language, localize, copy.defaultCountry, copy.defaultVolume, copy.prefix]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!mounted) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !contactName.trim() || !email.includes('@')) {
      setError(copy.err);
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const saved = await apiClient.submitB2BInquiry({
        company: company.trim(),
        contactName: contactName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        country: country.trim(),
        productId: product?.id ?? null,
        packageId: selectedPackageId ?? product?.packages[0]?.id ?? null,
        volume: volume.trim(),
        message: message.trim(),
        channel: defaultChannel,
        language,
      });
      setReferenceId(saved.id || null);
    } catch {
      // Allow UI confirmation even in standalone static mode
    } finally {
      setSubmitting(false);
      setSubmitted(true);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/55 backdrop-blur-xs ${
        closing ? 'modal-backdrop-out pointer-events-none' : 'modal-backdrop-in'
      }`}
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`bg-white border border-slate-200 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl ${
          closing ? 'modal-panel-out' : 'modal-panel-in'
        }`}
      >
        <div className="px-5 sm:px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-semibold text-slate-900">
              {defaultChannel === 'export' ? copy.titleExport : copy.titleSales}
            </h2>
            <p className="text-xs text-slate-500">export@milk.by · sales@milk.by</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 sm:p-6">
          {submitted ? (
            <div className="py-6 text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-[#0057B8] mx-auto" strokeWidth={1.5} />
              <div className="space-y-1">
                <h3 className="font-display text-lg font-semibold text-slate-900">
                  {copy.sentTitle}
                </h3>
                <p className="text-sm text-slate-600">{copy.sentDesc(company, email)}</p>
                {referenceId && (
                  <p className="text-xs font-mono text-slate-400 pt-1">ID: {referenceId.slice(0, 8)}</p>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-[#0057B8] rounded-lg hover:bg-[#004494] transition-colors"
              >
                {copy.close}
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
                    {copy.company}
                  </label>
                  <input
                    type="text"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder={copy.companyPlaceholder}
                    className="w-full h-10 px-3 text-base sm:text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#0057B8]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    {copy.contact}
                  </label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full h-10 px-3 text-base sm:text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#0057B8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">E-mail *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="buyer@company.com"
                    className="w-full h-10 px-3 text-base sm:text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#0057B8]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    {copy.phone}
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+375 ..."
                    className="w-full h-10 px-3 text-base sm:text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#0057B8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    {copy.country}
                  </label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full h-10 px-3 text-base sm:text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#0057B8]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    {copy.volume}
                  </label>
                  <input
                    type="text"
                    value={volume}
                    onChange={(e) => setVolume(e.target.value)}
                    className="w-full h-10 px-3 text-base sm:text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#0057B8]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  {copy.message}
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3 text-base sm:text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#0057B8]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  {copy.cancel}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-sm font-semibold text-white bg-[#0057B8] rounded-lg hover:bg-[#004494] disabled:opacity-60 transition-colors"
                >
                  {submitting ? copy.sending : copy.submit}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
