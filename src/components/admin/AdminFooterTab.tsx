import React, { useState } from 'react';
import { Phone, Mail } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { useCatalogStore } from '../../hooks/useCatalogStore';
import { Language } from '../../types';

const LANGS: Language[] = ['ru', 'be', 'en', 'zh'];

interface AdminFooterTabProps {
    onJumpToContacts: () => void;
}

export const AdminFooterTab: React.FC<AdminFooterTabProps> = ({ onJumpToContacts }) => {
    const { language } = useLanguage();
    const { siteSettings, updateSiteSettings } = useCatalogStore();
    const [editLang, setEditLang] = useState<Language>(language);

    const { footer, contactMeta } = siteSettings;

    const copy = {
        ru: {
            heading: 'Содержимое и структура футера',
            brandDesc: 'Текст описания компании под логотипом',
            address: 'Строка адреса и графика работы',
            copyright: 'Копирайт и УНП в нижней строке',
            heritage: 'Слоган традиций справа внизу',
            ctaLabel: 'Текст кнопки «Связаться»',
            columnsTitle: 'Видимость колонок футера',
            colProducts: 'Показывать колонку «Продукция»',
            colCompany: 'Показывать колонку «Компания и партнёрам»',
            colContacts: 'Показывать колонку «Связаться с нами»',
            syncedNote:
            'Телефоны и e-mail в футере автоматически синхронизируются с разделом «Контакты»:',
            editContactsBtn: 'Изменить номера в Контактах',
        },
        be: {
            heading: 'Змесціва і структура футэра',
            brandDesc: 'Тэкст апісання кампаніі пад лагатыпам',
            address: 'Радок адраса і графіка працы',
            copyright: 'Капірайт і УНП у ніжнім радку',
            heritage: 'Слоган традыцый справа ўнізе',
            ctaLabel: 'Тэкст кнопкі «Звязацца»',
            columnsTitle: 'Бачнасць калонак футэра',
            colProducts: 'Паказваць калонку «Прадукцыя»',
            colCompany: 'Паказваць калонку «Кампанія і партнёрам»',
            colContacts: 'Паказваць калонку «Звязацца з намі»',
            syncedNote: 'Тэлефоны і e-mail у футэры аўтаматычна сінхранізуюцца з раздзелам «Кантакты»:',
            editContactsBtn: 'Змяніць нумары ў Кантактах',
        },
        en: {
            heading: 'Footer Copy & Column Controls',
            brandDesc: 'Company Description Paragraph',
            address: 'Address & Working Hours Line',
            copyright: 'Bottom Copyright & Legal Text',
            heritage: 'Bottom Right Heritage Tagline',
            ctaLabel: 'Contact CTA Button Text',
            columnsTitle: 'Footer Columns Visibility',
            colProducts: 'Show "Products" Column',
            colCompany: 'Show "Company & Partners" Column',
            colContacts: 'Show "Get in Touch" Column',
            syncedNote: 'Footer phone numbers & email are automatically synced with the Contacts tab:',
            editContactsBtn: 'Edit Numbers in Contacts',
        },
        zh: {
            heading: '页脚文案与布局设置',
            brandDesc: '品牌简介段落',
            address: '地址与工作时间行',
            copyright: '底部版权声明与税号',
            heritage: '右下角企业传承标语',
            ctaLabel: '联系按钮文案',
            columnsTitle: '页脚栏目显示控制',
            colProducts: '显示“产品系列”栏目',
            colCompany: '显示“企业与合作”栏目',
            colContacts: '显示“联系我们”栏目',
            syncedNote: '页脚电话与邮箱已与“联系方式”板块实时同步:',
            editContactsBtn: '前往联系方式修改号码',
        },
    }[language];

    return (
        <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-lg font-semibold text-slate-900">{copy.heading}</h2>

        <div className="inline-flex bg-slate-100 border border-slate-200 rounded-lg p-0.5">
        {LANGS.map((l) => (
            <button
            key={l}
            type="button"
            onClick={() => setEditLang(l)}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                editLang === l ? 'bg-[#0057B8] text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
            >
            {l.toUpperCase()}
            </button>
        ))}
        </div>
        </div>

        <div className="border border-slate-200 rounded-2xl p-5 sm:p-6 bg-slate-50/70 space-y-4">
        <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">
        {copy.brandDesc} ({editLang.toUpperCase()})
        </label>
        <textarea
        rows={2}
        value={footer.brandDesc[editLang] || ''}
        onChange={(e) =>
            updateSiteSettings((prev) => ({
                ...prev,
                footer: {
                    ...prev.footer,
                    brandDesc: { ...prev.footer.brandDesc, [editLang]: e.target.value },
                },
            }))
        }
        className="w-full p-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#0057B8]"
        />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">
        {copy.address} ({editLang.toUpperCase()})
        </label>
        <input
        type="text"
        value={footer.address[editLang] || ''}
        onChange={(e) =>
            updateSiteSettings((prev) => ({
                ...prev,
                footer: {
                    ...prev.footer,
                    address: { ...prev.footer.address, [editLang]: e.target.value },
                },
            }))
        }
        className="w-full h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#0057B8]"
        />
        </div>

        <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">
        {copy.ctaLabel} ({editLang.toUpperCase()})
        </label>
        <input
        type="text"
        value={footer.ctaLabel[editLang] || ''}
        onChange={(e) =>
            updateSiteSettings((prev) => ({
                ...prev,
                footer: {
                    ...prev.footer,
                    ctaLabel: { ...prev.footer.ctaLabel, [editLang]: e.target.value },
                },
            }))
        }
        className="w-full h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#0057B8]"
        />
        </div>

        <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">
        {copy.copyright} ({editLang.toUpperCase()})
        </label>
        <input
        type="text"
        value={footer.copyright[editLang] || ''}
        onChange={(e) =>
            updateSiteSettings((prev) => ({
                ...prev,
                footer: {
                    ...prev.footer,
                    copyright: { ...prev.footer.copyright, [editLang]: e.target.value },
                },
            }))
        }
        className="w-full h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#0057B8]"
        />
        </div>

        <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">
        {copy.heritage} ({editLang.toUpperCase()})
        </label>
        <input
        type="text"
        value={footer.heritage[editLang] || ''}
        onChange={(e) =>
            updateSiteSettings((prev) => ({
                ...prev,
                footer: {
                    ...prev.footer,
                    heritage: { ...prev.footer.heritage, [editLang]: e.target.value },
                },
            }))
        }
        className="w-full h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#0057B8]"
        />
        </div>
        </div>

        <div className="pt-3 border-t border-slate-200 space-y-2">
        <div className="text-xs font-semibold text-slate-700">{copy.columnsTitle}</div>
        <div className="flex flex-wrap gap-5 text-xs text-slate-700">
        <label className="inline-flex items-center gap-2">
        <input
        type="checkbox"
        checked={footer.showProductsColumn}
        onChange={(e) =>
            updateSiteSettings((prev) => ({
                ...prev,
                footer: { ...prev.footer, showProductsColumn: e.target.checked },
            }))
        }
        />
        <span>{copy.colProducts}</span>
        </label>
        <label className="inline-flex items-center gap-2">
        <input
        type="checkbox"
        checked={footer.showCompanyColumn}
        onChange={(e) =>
            updateSiteSettings((prev) => ({
                ...prev,
                footer: { ...prev.footer, showCompanyColumn: e.target.checked },
            }))
        }
        />
        <span>{copy.colCompany}</span>
        </label>
        <label className="inline-flex items-center gap-2">
        <input
        type="checkbox"
        checked={footer.showContactsColumn}
        onChange={(e) =>
            updateSiteSettings((prev) => ({
                ...prev,
                footer: { ...prev.footer, showContactsColumn: e.target.checked },
            }))
        }
        />
        <span>{copy.colContacts}</span>
        </label>
        </div>
        </div>
        </div>

        <div className="border border-blue-200/80 bg-blue-50/50 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1.5">
        <p className="text-xs font-medium text-slate-700">{copy.syncedNote}</p>
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-800 tabular-nums">
        <span className="inline-flex items-center gap-1.5">
        <Phone className="w-3.5 h-3.5 text-[#0057B8]" />
        {contactMeta.receptionPhone} · {contactMeta.salesPhone}
        </span>
        <span className="inline-flex items-center gap-1.5">
        <Mail className="w-3.5 h-3.5 text-[#0057B8]" />
        {contactMeta.exportEmail}
        </span>
        </div>
        </div>

        <button
        type="button"
        onClick={onJumpToContacts}
        className="px-3.5 py-2 text-xs font-semibold text-[#0057B8] bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors whitespace-nowrap shrink-0"
        >
        {copy.editContactsBtn}
        </button>
        </div>
        </div>
    );
};
