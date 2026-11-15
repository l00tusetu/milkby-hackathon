import React, { useState } from 'react';
import { Check, Edit3, Eye, EyeOff, MapPin, Plus, Trash2 } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { useCatalogStore } from '../../hooks/useCatalogStore';
import { DirectoryEntry, DirectoryGroup, Language, PlantLocation } from '../../types';

const LANGS: Language[] = ['ru', 'be', 'en', 'zh'];

const createEmptyEntry = (group: DirectoryGroup = 'departments'): DirectoryEntry => ({
    id: `contact-${Date.now().toString(36)}`,
                                                                                     group,
                                                                                     visible: true,
                                                                                     title: { ru: '', be: '', en: '', zh: '' },
                                                                                     person: { ru: '', be: '', en: '', zh: '' },
                                                                                     address: { ru: '', be: '', en: '', zh: '' },
                                                                                     note: { ru: '', be: '', en: '', zh: '' },
                                                                                     phones: [{ number: '+375 (152) ' }],
                                                                                     emails: [{ address: 'info@milk.by' }],
                                                                                     website: '',
});

export const AdminContactsTab: React.FC = () => {
    const { language, localize } = useLanguage();
    const {
        siteSettings,
        updateSiteSettings,
        directoryEntries,
        addDirectoryEntry,
        updateDirectoryEntry,
        toggleDirectoryEntryVisibility,
        deleteDirectoryEntry,
        locations,
        updateLocation,
    } = useCatalogStore();

    const [editLang, setEditLang] = useState<Language>(language);
    const [groupFilter, setGroupFilter] = useState<'all' | DirectoryGroup>('all');
    const [editingEntry, setEditingEntry] = useState<DirectoryEntry | null>(null);
    const [creatingEntry, setCreatingEntry] = useState<DirectoryEntry | null>(null);
    const [editingLocation, setEditingLocation] = useState<PlantLocation | null>(null);

    const { contactMeta } = siteSettings;

    const copy = {
        ru: {
            heading: 'Контакты, реквизиты и площадки',
            globalBlock: 'Основные контакты компании (шапки Контактов, Экспорта, Партнёров и Футер)',
            hqAddress: 'Юридический адрес',
            unp: 'УНП',
            schedule: 'График работы',
            citizenHours: 'Приём граждан',
            receptionCard: 'Приёмная',
            salesCard: 'Отдел продаж и логистики',
            exportCard: 'Отдел ВЭД и экспорта',
            dirTitle: 'Справочник подразделений, филиалов и дилеров',
            addContact: 'Добавить контакт',
            groups: {
                all: 'Все разделы',
                sales: 'Продажи и дилеры',
                management: 'Руководство',
                departments: 'Отделы и службы',
                branches: 'Филиалы и хозяйства',
            },
            locationsTitle: 'Площадки на карте главной страницы',
            save: 'Сохранить',
            cancel: 'Отмена',
        },
        be: {
            heading: 'Кантакты, рэквізіты і пляцоўкі',
            globalBlock: 'Асноўныя кантакты кампаніі (Кантакты, Экспарт, Партнёрам і Футэр)',
            hqAddress: 'Юрыдычны адрас',
            unp: 'УНП',
            schedule: 'Графік працы',
            citizenHours: 'Прыём грамадзян',
            receptionCard: 'Прыёмная',
            salesCard: 'Аддзел продажаў і лагістыкі',
            exportCard: 'Аддзел ЗЭД і экспарту',
            dirTitle: 'Даведнік падраздзяленняў, філіялаў і дылераў',
            addContact: 'Дадаць кантакт',
            groups: {
                all: 'Усе раздзелы',
                sales: 'Продажы і дылеры',
                management: 'Кіраўніцтва',
                departments: 'Аддзелы і службы',
                branches: 'Філіялы і гаспадаркі',
            },
            locationsTitle: 'Пляцоўкі на карце галоўнай старонкі',
            save: 'Захаваць',
            cancel: 'Адмена',
        },
        en: {
            heading: 'Company Contacts, Directory & Map Sites',
            globalBlock: 'Primary Company Channels (Contacts, Export, Partners, B2B Modal & Footer)',
            hqAddress: 'Headquarters Address',
            unp: 'Tax ID (UNP)',
            schedule: 'Working Hours',
            citizenHours: 'Public Reception',
            receptionCard: 'Reception Desk',
            salesCard: 'Sales & Logistics',
            exportCard: 'Export / VED',
            dirTitle: 'Departments, Branches & Dealers Directory',
            addContact: 'Add Contact Entry',
            groups: {
                all: 'All Groups',
                sales: 'Sales & Dealers',
                management: 'Leadership',
                departments: 'Departments',
                branches: 'Branches & Farms',
            },
            locationsTitle: 'Homepage Interactive Map Locations',
            save: 'Save',
            cancel: 'Cancel',
        },
        zh: {
            heading: '联系方式、企业信息与生产基地地图',
            globalBlock: '核心联系方式（同步更新联系页面、出口专区、合作专区及页脚）',
            hqAddress: '总部地址',
            unp: '税号 (UNP)',
            schedule: '工作时间',
            citizenHours: '公众接待时间',
            receptionCard: '总机前台',
            salesCard: '销售与物流部',
            exportCard: '国际出口外贸部',
            dirTitle: '部门、分公司与官方经销商通讯录',
            addContact: '新增联系条目',
            groups: {
                all: '全部分组',
                sales: '销售与经销商',
                management: '公司管理层',
                departments: '职能部门',
                branches: '分公司与牧场',
            },
            locationsTitle: '首页交互地图生产基地',
            save: '保存',
            cancel: '取消',
        },
    }[language];

    const visibleEntries = directoryEntries.filter(
        (item) => groupFilter === 'all' || item.group === groupFilter
    );

    const renderEntryForm = (
        draft: DirectoryEntry,
        setDraft: React.Dispatch<React.SetStateAction<DirectoryEntry | null>>,
        isNew: boolean
    ) => (
        <form
        onSubmit={(e) => {
            e.preventDefault();
            if (!(draft.title.ru || draft.title.en || draft.title[editLang]).trim()) return;
            const cleaned: DirectoryEntry = {
                ...draft,
                phones: draft.phones.filter((p) => p.number.trim()),
          emails: (draft.emails || []).filter((em) => em.address.trim()),
            };
            if (isNew) {
                addDirectoryEntry(cleaned);
            } else {
                updateDirectoryEntry(cleaned);
            }
            setDraft(null);
        }}
        className="border border-[#0057B8]/40 rounded-2xl p-5 bg-blue-50/40 space-y-4"
        >
        <div className="flex flex-wrap items-center justify-between gap-3">
        <h4 className="font-display text-sm font-bold text-slate-900">
        {isNew ? copy.addContact : localize(draft.title)}
        </h4>
        <div className="inline-flex bg-white border border-slate-200 rounded-lg p-0.5">
        {LANGS.map((l) => (
            <button
            key={l}
            type="button"
            onClick={() => setEditLang(l)}
            className={`px-2 py-0.5 text-xs font-semibold rounded ${
                editLang === l ? 'bg-[#0057B8] text-white' : 'text-slate-600'
            }`}
            >
            {l.toUpperCase()}
            </button>
        ))}
        </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">Раздел</label>
        <select
        value={draft.group}
        onChange={(e) =>
            setDraft((prev) =>
            prev ? { ...prev, group: e.target.value as DirectoryGroup } : null
            )
        }
        className="w-full h-9 px-2.5 text-sm bg-white border border-slate-200 rounded-lg"
        >
        <option value="sales">{copy.groups.sales}</option>
        <option value="management">{copy.groups.management}</option>
        <option value="departments">{copy.groups.departments}</option>
        <option value="branches">{copy.groups.branches}</option>
        </select>
        </div>

        <div className="sm:col-span-2">
        <label className="block text-xs font-medium text-slate-700 mb-1">
        Название отдела / карточки ({editLang.toUpperCase()}) *
        </label>
        <input
        type="text"
        required={editLang === 'ru'}
        value={draft.title[editLang] || ''}
        onChange={(e) =>
            setDraft((prev) =>
            prev
            ? { ...prev, title: { ...prev.title, [editLang]: e.target.value } }
            : null
            )
        }
        className="w-full h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg"
        />
        </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">
        Руководитель / ФИО ({editLang.toUpperCase()})
        </label>
        <input
        type="text"
        value={draft.person?.[editLang] || ''}
        onChange={(e) =>
            setDraft((prev) =>
            prev
            ? {
                ...prev,
                person: {
                    ru: prev.person?.ru || '',
                    be: prev.person?.be || '',
                    en: prev.person?.en || '',
                    zh: prev.person?.zh || '',
                    [editLang]: e.target.value,
                },
            }
            : null
            )
        }
        className="w-full h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg"
        />
        </div>

        <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">
        Адрес ({editLang.toUpperCase()})
        </label>
        <input
        type="text"
        value={draft.address?.[editLang] || ''}
        onChange={(e) =>
            setDraft((prev) =>
            prev
            ? {
                ...prev,
                address: {
                    ru: prev.address?.ru || '',
                    be: prev.address?.be || '',
                    en: prev.address?.en || '',
                    zh: prev.address?.zh || '',
                    [editLang]: e.target.value,
                },
            }
            : null
            )
        }
        className="w-full h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg"
        />
        </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">
        Примечание ({editLang.toUpperCase()})
        </label>
        <input
        type="text"
        value={draft.note?.[editLang] || ''}
        onChange={(e) =>
            setDraft((prev) =>
            prev
            ? {
                ...prev,
                note: {
                    ru: prev.note?.ru || '',
                    be: prev.note?.be || '',
                    en: prev.note?.en || '',
                    zh: prev.note?.zh || '',
                    [editLang]: e.target.value,
                },
            }
            : null
            )
        }
        className="w-full h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg"
        />
        </div>
        <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">Website</label>
        <input
        type="text"
        value={draft.website || ''}
        onChange={(e) =>
            setDraft((prev) => (prev ? { ...prev, website: e.target.value } : null))
        }
        placeholder="https://..."
        className="w-full h-9 px-3 text-sm font-mono bg-white border border-slate-200 rounded-lg"
        />
        </div>
        </div>

        {/* Dynamic Phones List */}
        <div className="space-y-2">
        <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-700">Телефоны</span>
        <button
        type="button"
        onClick={() =>
            setDraft((prev) =>
            prev
            ? { ...prev, phones: [...prev.phones, { number: '+375 ' }] }
            : null
            )
        }
        className="text-xs font-semibold text-[#0057B8] hover:underline"
        >
        + Добавить телефон
        </button>
        </div>
        <div className="space-y-2">
        {draft.phones.map((ph, idx) => (
            <div key={idx} className="flex flex-wrap sm:flex-nowrap gap-2">
            <input
            type="text"
            value={ph.label?.[editLang] || ''}
            onChange={(e) => {
                const val = e.target.value;
                setDraft((prev) => {
                    if (!prev) return null;
                    const phones = [...prev.phones];
                    const curLabel = phones[idx].label || { ru: '', be: '', en: '', zh: '' };
                    phones[idx] = {
                        ...phones[idx],
                        label: val ? { ...curLabel, [editLang]: val } : undefined,
                    };
                    return { ...prev, phones };
                });
            }}
            placeholder="Метка (A1, МТС, Факс…)"
            className="w-36 h-8 px-2.5 text-xs bg-white border border-slate-200 rounded-lg"
            />
            <input
            type="text"
            value={ph.number}
            onChange={(e) => {
                const val = e.target.value;
                setDraft((prev) => {
                    if (!prev) return null;
                    const phones = [...prev.phones];
                    phones[idx] = { ...phones[idx], number: val };
                    return { ...prev, phones };
                });
            }}
            placeholder="+375 (152) ..."
            className="flex-1 h-8 px-2.5 text-xs font-mono bg-white border border-slate-200 rounded-lg"
            />
            <button
            type="button"
            onClick={() =>
                setDraft((prev) =>
                prev
                ? { ...prev, phones: prev.phones.filter((_, i) => i !== idx) }
                : null
                )
            }
            className="px-2 text-xs text-red-500 hover:bg-red-50 rounded-lg"
            >
            ✕
            </button>
            </div>
        ))}
        </div>
        </div>

        {/* Dynamic Emails List */}
        <div className="space-y-2">
        <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-700">E-mail адреса</span>
        <button
        type="button"
        onClick={() =>
            setDraft((prev) =>
            prev
            ? { ...prev, emails: [...(prev.emails || []), { address: '' }] }
            : null
            )
        }
        className="text-xs font-semibold text-[#0057B8] hover:underline"
        >
        + Добавить e-mail
        </button>
        </div>
        <div className="space-y-2">
        {(draft.emails || []).map((em, idx) => (
            <div key={idx} className="flex flex-wrap sm:flex-nowrap gap-2">
            <input
            type="text"
            value={em.label || ''}
            onChange={(e) => {
                const val = e.target.value;
                setDraft((prev) => {
                    if (!prev) return null;
                    const emails = [...(prev.emails || [])];
                    emails[idx] = { ...emails[idx], label: val || undefined };
                    return { ...prev, emails };
                });
            }}
            placeholder="Метка (Заявки…)"
            className="w-36 h-8 px-2.5 text-xs bg-white border border-slate-200 rounded-lg"
            />
            <input
            type="email"
            value={em.address}
            onChange={(e) => {
                const val = e.target.value;
                setDraft((prev) => {
                    if (!prev) return null;
                    const emails = [...(prev.emails || [])];
                    emails[idx] = { ...emails[idx], address: val };
                    return { ...prev, emails };
                });
            }}
            placeholder="name@milk.by"
            className="flex-1 h-8 px-2.5 text-xs font-mono bg-white border border-slate-200 rounded-lg"
            />
            <button
            type="button"
            onClick={() =>
                setDraft((prev) =>
                prev
                ? {
                    ...prev,
                    emails: (prev.emails || []).filter((_, i) => i !== idx),
                }
                : null
                )
            }
            className="px-2 text-xs text-red-500 hover:bg-red-50 rounded-lg"
            >
            ✕
            </button>
            </div>
        ))}
        </div>
        </div>

        <div className="flex justify-end gap-2">
        <button
        type="button"
        onClick={() => setDraft(null)}
        className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg"
        >
        {copy.cancel}
        </button>
        <button
        type="submit"
        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#0057B8] rounded-lg"
        >
        <Check className="w-3.5 h-3.5" />
        <span>{copy.save}</span>
        </button>
        </div>
        </form>
    );

    return (
        <div className="space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-lg font-semibold text-slate-900">{copy.heading}</h2>
        <div className="inline-flex bg-slate-100 border border-slate-200 rounded-lg p-0.5">
        {LANGS.map((l) => (
            <button
            key={l}
            type="button"
            onClick={() => setEditLang(l)}
            className={`px-2.5 py-1 text-xs font-semibold rounded ${
                editLang === l ? 'bg-[#0057B8] text-white' : 'text-slate-600'
            }`}
            >
            {l.toUpperCase()}
            </button>
        ))}
        </div>
        </div>

        {/* 1. Global Contacts & HQ Requisites */}
        <section className="border border-slate-200 rounded-2xl p-5 sm:p-6 bg-slate-50/70 space-y-5">
        <h3 className="font-display text-base font-bold text-slate-900 border-b border-slate-200 pb-3">
        {copy.globalBlock}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="sm:col-span-3">
        <label className="block text-xs font-medium text-slate-700 mb-1">
        {copy.hqAddress} ({editLang.toUpperCase()})
        </label>
        <input
        type="text"
        value={contactMeta.hqAddress[editLang] || ''}
        onChange={(e) =>
            updateSiteSettings((prev) => ({
                ...prev,
                contactMeta: {
                    ...prev.contactMeta,
                    hqAddress: { ...prev.contactMeta.hqAddress, [editLang]: e.target.value },
                },
            }))
        }
        className="w-full h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg"
        />
        </div>
        <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">
        {copy.unp}
        </label>
        <input
        type="text"
        value={contactMeta.unp}
        onChange={(e) =>
            updateSiteSettings((prev) => ({
                ...prev,
                contactMeta: { ...prev.contactMeta, unp: e.target.value },
            }))
        }
        className="w-full h-9 px-3 text-sm font-mono bg-white border border-slate-200 rounded-lg"
        />
        </div>
        <div className="sm:col-span-2">
        <label className="block text-xs font-medium text-slate-700 mb-1">
        {copy.schedule} ({editLang.toUpperCase()})
        </label>
        <input
        type="text"
        value={contactMeta.schedule[editLang] || ''}
        onChange={(e) =>
            updateSiteSettings((prev) => ({
                ...prev,
                contactMeta: {
                    ...prev.contactMeta,
                    schedule: { ...prev.contactMeta.schedule, [editLang]: e.target.value },
                },
            }))
        }
        className="w-full h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg"
        />
        </div>
        <div className="sm:col-span-2">
        <label className="block text-xs font-medium text-slate-700 mb-1">
        {copy.citizenHours} ({editLang.toUpperCase()})
        </label>
        <input
        type="text"
        value={contactMeta.citizenHours[editLang] || ''}
        onChange={(e) =>
            updateSiteSettings((prev) => ({
                ...prev,
                contactMeta: {
                    ...prev.contactMeta,
                    citizenHours: {
                        ...prev.contactMeta.citizenHours,
                        [editLang]: e.target.value,
                    },
                },
            }))
        }
        className="w-full h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg"
        />
        </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Reception */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2.5">
        <div className="text-xs font-bold text-[#0057B8] uppercase">
        {copy.receptionCard}
        </div>
        <input
        type="text"
        value={contactMeta.receptionTitle[editLang] || ''}
        onChange={(e) =>
            updateSiteSettings((prev) => ({
                ...prev,
                contactMeta: {
                    ...prev.contactMeta,
                    receptionTitle: {
                        ...prev.contactMeta.receptionTitle,
                        [editLang]: e.target.value,
                    },
                },
            }))
        }
        className="w-full h-8 px-2.5 text-xs border border-slate-200 rounded-lg"
        />
        <input
        type="text"
        value={contactMeta.receptionSubtitle[editLang] || ''}
        onChange={(e) =>
            updateSiteSettings((prev) => ({
                ...prev,
                contactMeta: {
                    ...prev.contactMeta,
                    receptionSubtitle: {
                        ...prev.contactMeta.receptionSubtitle,
                        [editLang]: e.target.value,
                    },
                },
            }))
        }
        className="w-full h-8 px-2.5 text-xs border border-slate-200 rounded-lg"
        />
        <input
        type="text"
        value={contactMeta.receptionPhone}
        onChange={(e) =>
            updateSiteSettings((prev) => ({
                ...prev,
                contactMeta: { ...prev.contactMeta, receptionPhone: e.target.value },
            }))
        }
        className="w-full h-8 px-2.5 text-xs font-mono border border-slate-200 rounded-lg"
        />
        <input
        type="email"
        value={contactMeta.receptionEmail}
        onChange={(e) =>
            updateSiteSettings((prev) => ({
                ...prev,
                contactMeta: { ...prev.contactMeta, receptionEmail: e.target.value },
            }))
        }
        className="w-full h-8 px-2.5 text-xs font-mono border border-slate-200 rounded-lg"
        />
        </div>

        {/* Sales */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2.5">
        <div className="text-xs font-bold text-[#0057B8] uppercase">{copy.salesCard}</div>
        <input
        type="text"
        value={contactMeta.salesTitle[editLang] || ''}
        onChange={(e) =>
            updateSiteSettings((prev) => ({
                ...prev,
                contactMeta: {
                    ...prev.contactMeta,
                    salesTitle: {
                        ...prev.contactMeta.salesTitle,
                        [editLang]: e.target.value,
                    },
                },
            }))
        }
        className="w-full h-8 px-2.5 text-xs border border-slate-200 rounded-lg"
        />
        <input
        type="text"
        value={contactMeta.salesSubtitle[editLang] || ''}
        onChange={(e) =>
            updateSiteSettings((prev) => ({
                ...prev,
                contactMeta: {
                    ...prev.contactMeta,
                    salesSubtitle: {
                        ...prev.contactMeta.salesSubtitle,
                        [editLang]: e.target.value,
                    },
                },
            }))
        }
        className="w-full h-8 px-2.5 text-xs border border-slate-200 rounded-lg"
        />
        <input
        type="text"
        value={contactMeta.salesPhone}
        onChange={(e) =>
            updateSiteSettings((prev) => ({
                ...prev,
                contactMeta: { ...prev.contactMeta, salesPhone: e.target.value },
            }))
        }
        className="w-full h-8 px-2.5 text-xs font-mono border border-slate-200 rounded-lg"
        />
        <div className="grid grid-cols-2 gap-2">
        <input
        type="email"
        value={contactMeta.salesEmail}
        onChange={(e) =>
            updateSiteSettings((prev) => ({
                ...prev,
                contactMeta: { ...prev.contactMeta, salesEmail: e.target.value },
            }))
        }
        className="w-full h-8 px-2 text-xs font-mono border border-slate-200 rounded-lg"
        />
        <input
        type="email"
        value={contactMeta.salesOrdersEmail}
        onChange={(e) =>
            updateSiteSettings((prev) => ({
                ...prev,
                contactMeta: { ...prev.contactMeta, salesOrdersEmail: e.target.value },
            }))
        }
        className="w-full h-8 px-2 text-xs font-mono border border-slate-200 rounded-lg"
        />
        </div>
        </div>

        {/* Export */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2.5">
        <div className="text-xs font-bold text-[#0057B8] uppercase">{copy.exportCard}</div>
        <input
        type="text"
        value={contactMeta.exportTitle[editLang] || ''}
        onChange={(e) =>
            updateSiteSettings((prev) => ({
                ...prev,
                contactMeta: {
                    ...prev.contactMeta,
                    exportTitle: {
                        ...prev.contactMeta.exportTitle,
                        [editLang]: e.target.value,
                    },
                },
            }))
        }
        className="w-full h-8 px-2.5 text-xs border border-slate-200 rounded-lg"
        />
        <input
        type="text"
        value={contactMeta.exportSubtitle[editLang] || ''}
        onChange={(e) =>
            updateSiteSettings((prev) => ({
                ...prev,
                contactMeta: {
                    ...prev.contactMeta,
                    exportSubtitle: {
                        ...prev.contactMeta.exportSubtitle,
                        [editLang]: e.target.value,
                    },
                },
            }))
        }
        className="w-full h-8 px-2.5 text-xs border border-slate-200 rounded-lg"
        />
        <div className="grid grid-cols-2 gap-2">
        <input
        type="text"
        value={contactMeta.exportPhone}
        onChange={(e) =>
            updateSiteSettings((prev) => ({
                ...prev,
                contactMeta: { ...prev.contactMeta, exportPhone: e.target.value },
            }))
        }
        className="w-full h-8 px-2 text-xs font-mono border border-slate-200 rounded-lg"
        />
        <input
        type="text"
        value={contactMeta.exportPhoneAlt}
        onChange={(e) =>
            updateSiteSettings((prev) => ({
                ...prev,
                contactMeta: { ...prev.contactMeta, exportPhoneAlt: e.target.value },
            }))
        }
        className="w-full h-8 px-2 text-xs font-mono border border-slate-200 rounded-lg"
        />
        </div>
        <input
        type="email"
        value={contactMeta.exportEmail}
        onChange={(e) =>
            updateSiteSettings((prev) => ({
                ...prev,
                contactMeta: { ...prev.contactMeta, exportEmail: e.target.value },
            }))
        }
        className="w-full h-8 px-2.5 text-xs font-mono border border-slate-200 rounded-lg"
        />
        </div>
        </div>
        </section>

        {/* 2. Directory Entries CRUD */}
        <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-display text-base font-bold text-slate-900">
        {copy.dirTitle} ({visibleEntries.length})
        </h3>
        <button
        type="button"
        onClick={() => {
            setEditingEntry(null);
            setCreatingEntry(
                createEmptyEntry(groupFilter === 'all' ? 'departments' : groupFilter)
            );
        }}
        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#0057B8] rounded-lg hover:bg-[#004494]"
        >
        <Plus className="w-4 h-4" />
        <span>{copy.addContact}</span>
        </button>
        </div>

        <div className="flex flex-wrap gap-2">
        {(['all', 'sales', 'management', 'departments', 'branches'] as const).map((g) => (
            <button
            key={g}
            type="button"
            onClick={() => setGroupFilter(g)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                groupFilter === g
                ? 'bg-[#0057B8] text-white border-[#0057B8]'
                : 'bg-white text-slate-700 border-slate-200 hover:border-[#0057B8]/40'
            }`}
            >
            {copy.groups[g]}
            </button>
        ))}
        </div>

        {creatingEntry && renderEntryForm(creatingEntry, setCreatingEntry, true)}
        {editingEntry && renderEntryForm(editingEntry, setEditingEntry, false)}

        <div className="border border-slate-200 rounded-xl overflow-x-auto bg-white">
        <table className="w-full text-left border-collapse text-xs">
        <thead>
        <tr className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-600">
        <th className="py-3 px-4">Подразделение / карточка</th>
        <th className="py-3 px-4">Раздел</th>
        <th className="py-3 px-4">Телефоны и e-mail</th>
        <th className="py-3 px-4 text-right">Действия</th>
        </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
        {visibleEntries.map((entry) => (
            <tr key={entry.id} className="hover:bg-slate-50/70">
            <td className="py-2.5 px-4">
            <div className="font-semibold text-slate-900">{localize(entry.title)}</div>
            {entry.person && localize(entry.person) && (
                <div className="text-slate-500 mt-0.5">{localize(entry.person)}</div>
            )}
            </td>
            <td className="py-2.5 px-4 text-slate-500">{copy.groups[entry.group]}</td>
            <td className="py-2.5 px-4 font-mono text-slate-700 tabular-nums">
            <div>{entry.phones.map((p) => p.number).join(' · ') || '—'}</div>
            {entry.emails && entry.emails.length > 0 && (
                <div className="text-[#0057B8]">
                {entry.emails.map((em) => em.address).join(' · ')}
                </div>
            )}
            </td>
            <td className="py-2.5 px-4 text-right">
            <div className="inline-flex items-center gap-1">
            <button
            type="button"
            onClick={() => {
                setCreatingEntry(null);
                setEditingEntry(entry);
            }}
            className="p-1.5 rounded-md text-slate-600 hover:bg-slate-100 hover:text-[#0057B8]"
            >
            <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
            type="button"
            onClick={() => toggleDirectoryEntryVisibility(entry.id)}
            className="p-1.5 rounded-md text-slate-600 hover:bg-slate-100"
            >
            {entry.visible ? (
                <Eye className="w-3.5 h-3.5" />
            ) : (
                <EyeOff className="w-3.5 h-3.5" />
            )}
            </button>
            <button
            type="button"
            onClick={() => deleteDirectoryEntry(entry.id)}
            className="p-1.5 rounded-md text-slate-500 hover:bg-red-50 hover:text-red-600"
            >
            <Trash2 className="w-3.5 h-3.5" />
            </button>
            </div>
            </td>
            </tr>
        ))}
        </tbody>
        </table>
        </div>
        </section>

        {/* 3. Interactive Map Locations */}
        <section className="space-y-4">
        <h3 className="font-display text-base font-bold text-slate-900">
        {copy.locationsTitle}
        </h3>

        {editingLocation && (
            <form
            onSubmit={(e) => {
                e.preventDefault();
                updateLocation(editingLocation);
                setEditingLocation(null);
            }}
            className="border border-[#0057B8]/40 rounded-2xl p-5 bg-blue-50/40 space-y-3"
            >
            <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-slate-900">
            {localize(editingLocation.city)}
            </span>
            <span className="text-xs font-mono text-[#0057B8]">
            {editLang.toUpperCase()}
            </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
            type="text"
            value={editingLocation.city[editLang] || ''}
            onChange={(e) =>
                setEditingLocation({
                    ...editingLocation,
                    city: { ...editingLocation.city, [editLang]: e.target.value },
                })
            }
            placeholder="Город / Площадка"
            className="h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg"
            />
            <input
            type="text"
            value={editingLocation.phone}
            onChange={(e) =>
                setEditingLocation({ ...editingLocation, phone: e.target.value })
            }
            placeholder="+375 ..."
            className="h-9 px-3 text-sm font-mono bg-white border border-slate-200 rounded-lg"
            />
            <input
            type="text"
            value={editingLocation.address[editLang] || ''}
            onChange={(e) =>
                setEditingLocation({
                    ...editingLocation,
                    address: { ...editingLocation.address, [editLang]: e.target.value },
                })
            }
            placeholder="Адрес"
            className="h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg"
            />
            <input
            type="text"
            value={editingLocation.hours[editLang] || ''}
            onChange={(e) =>
                setEditingLocation({
                    ...editingLocation,
                    hours: { ...editingLocation.hours, [editLang]: e.target.value },
                })
            }
            placeholder="Режим работы"
            className="h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg"
            />
            </div>

            <input
            type="text"
            value={editingLocation.focus[editLang] || ''}
            onChange={(e) =>
                setEditingLocation({
                    ...editingLocation,
                    focus: { ...editingLocation.focus, [editLang]: e.target.value },
                })
            }
            placeholder="Специализация площадки"
            className="w-full h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg"
            />

            <div className="flex justify-end gap-2">
            <button
            type="button"
            onClick={() => setEditingLocation(null)}
            className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
            >
            {copy.cancel}
            </button>
            <button
            type="submit"
            className="px-4 py-1.5 text-xs font-semibold text-white bg-[#0057B8] rounded-lg"
            >
            {copy.save}
            </button>
            </div>
            </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {locations.map((loc) => (
            <div
            key={loc.id}
            className="border border-slate-200 rounded-xl p-4 bg-white flex items-start justify-between gap-3"
            >
            <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-1.5 text-sm font-bold text-slate-900">
            <MapPin className="w-4 h-4 text-[#0057B8] shrink-0" />
            <span className="truncate">{localize(loc.city)}</span>
            </div>
            <div className="text-xs text-slate-600">{localize(loc.address)}</div>
            <div className="text-xs font-mono text-[#0057B8] tabular-nums">
            {loc.phone} · {localize(loc.hours)}
            </div>
            </div>
            <button
            type="button"
            onClick={() => setEditingLocation(loc)}
            className="p-1.5 rounded-md text-slate-600 hover:bg-slate-100 hover:text-[#0057B8] shrink-0"
            >
            <Edit3 className="w-4 h-4" />
            </button>
            </div>
        ))}
        </div>
        </section>
        </div>
    );
};
