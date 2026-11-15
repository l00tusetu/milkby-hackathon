import React, { useState } from 'react';
import {
    ArrowDown,
    ArrowUp,
    Check,
    Edit3,
    Eye,
    EyeOff,
    Plus,
    Trash2,
} from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { useCatalogStore } from '../../hooks/useCatalogStore';
import { Language, TeamMember } from '../../types';
import { ImagePickerField } from './ImagePickerField';

const LANGS: Language[] = ['ru', 'be', 'en', 'zh'];

const ACCENT_PRESETS = [
    { label: 'Синий (бренд)', value: 'bg-blue-50 text-[#0057B8] border-blue-200' },
    { label: 'Графит', value: 'bg-slate-100 text-slate-800 border-slate-200' },
{ label: 'Изумруд', value: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
{ label: 'Янтарь', value: 'bg-amber-50 text-amber-800 border-amber-200' },
{ label: 'Индиго', value: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
{ label: 'Небесный', value: 'bg-sky-50 text-sky-700 border-sky-200' },
];

const createEmptyMember = (): TeamMember => ({
    id: `team-${Date.now().toString(36)}`,
                                             initials: 'ММ',
                                             accentClass: ACCENT_PRESETS[0].value,
                                             photo: '',
                                             channel: 'wholesale',
                                             email: 'sales@milk.by',
                                             phone: '+375 (152) 45-39-42',
                                             visible: true,
                                             name: { ru: '', be: '', en: '', zh: '' },
                                             role: { ru: '', be: '', en: '', zh: '' },
                                             bio: { ru: '', be: '', en: '', zh: '' },
});

export const AdminTeamTab: React.FC = () => {
    const { language, localize } = useLanguage();
    const {
        teamMembers,
        siteSettings,
        updateSiteSettings,
        addTeamMember,
        updateTeamMember,
        toggleTeamMemberVisibility,
        moveTeamMember,
        deleteTeamMember,
    } = useCatalogStore();

    const [editLang, setEditLang] = useState<Language>(language);
    const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
    const [creatingMember, setCreatingMember] = useState<TeamMember | null>(null);

    const { teamSection } = siteSettings;

    const copy = {
        ru: {
            heading: 'Экспертная команда на главной',
            sectionBlock: 'Заголовок и видимость секции',
            sectionOn: 'Секция включена',
            sectionOff: 'Секция скрыта',
            eyebrow: 'Надзаголовок (Eyebrow)',
            title: 'Заголовок секции',
            subtitle: 'Подзаголовок секции',
            addBtn: 'Добавить специалиста',
            newTitle: 'Новый специалист команды',
            editTitle: 'Редактирование специалиста',
            nameLabel: 'ФИО специалиста',
            roleLabel: 'Должность / отдел',
            bioLabel: 'Краткое описание зоны ответственности',
            initialsLabel: 'Инициалы (если нет фото)',
            colorLabel: 'Цвет бейджа инициалов',
            channelLabel: 'Канал заявки B2B',
            photoLabel: 'Фотография специалиста (необязательно)',
            save: 'Сохранить',
            cancel: 'Отмена',
            visible: 'На главной',
            hidden: 'Скрыт',
        },
        be: {
            heading: 'Экспертная каманда на галоўнай',
            sectionBlock: 'Загаловак і бачнасць секцыі',
            sectionOn: 'Секцыя ўключана',
            sectionOff: 'Секцыя схавана',
            eyebrow: 'Надзагаловак',
            title: 'Загаловак секцыі',
            subtitle: 'Падзагаловак секцыі',
            addBtn: 'Дадаць спецыяліста',
            newTitle: 'Новы спецыяліст каманды',
            editTitle: 'Рэдагаванне спецыяліста',
            nameLabel: 'Імя і прозвішча',
            roleLabel: 'Пасада / аддзел',
            bioLabel: 'Кароткае апісанне зоны адказнасці',
            initialsLabel: 'Ініцыялы (калі няма фота)',
            colorLabel: 'Колер бэйджа ініцыялаў',
            channelLabel: 'Канал запыту B2B',
            photoLabel: 'Фотаздымак спецыяліста (неабавязкова)',
            save: 'Захаваць',
            cancel: 'Адмена',
            visible: 'На галоўнай',
            hidden: 'Схаваны',
        },
        en: {
            heading: 'Homepage Leadership & Specialists Slider',
            sectionBlock: 'Section Heading & Visibility',
            sectionOn: 'Section Visible',
            sectionOff: 'Section Hidden',
            eyebrow: 'Eyebrow Label',
            title: 'Section Heading',
            subtitle: 'Section Subtitle',
            addBtn: 'Add Specialist',
            newTitle: 'New Specialist Profile',
            editTitle: 'Edit Specialist Profile',
            nameLabel: 'Full Name',
            roleLabel: 'Role / Department',
            bioLabel: 'Short Bio / Responsibilities',
            initialsLabel: 'Initials (fallback)',
            colorLabel: 'Badge Accent Color',
            channelLabel: 'Default B2B Channel',
            photoLabel: 'Portrait Photo (optional)',
            save: 'Save',
            cancel: 'Cancel',
            visible: 'Visible',
            hidden: 'Hidden',
        },
        zh: {
            heading: '首页专家团队展示管理',
            sectionBlock: '板块标题与显示开关',
            sectionOn: '已开启显示',
            sectionOff: '已隐藏',
            eyebrow: '上方小标题',
            title: '板块主标题',
            subtitle: '板块副标题',
            addBtn: '新增专家成员',
            newTitle: '新增专家成员',
            editTitle: '编辑专家信息',
            nameLabel: '姓名',
            roleLabel: '职位与部门',
            bioLabel: '职责简介',
            initialsLabel: '姓名缩写（无头像时显示）',
            colorLabel: '徽章配色',
            channelLabel: '默认 B2B 询盘渠道',
            photoLabel: '个人头像照片（可选）',
            save: '保存',
            cancel: '取消',
            visible: '首页显示',
            hidden: '已隐藏',
        },
    }[language];

    const renderMemberForm = (
        draft: TeamMember,
        setDraft: React.Dispatch<React.SetStateAction<TeamMember | null>>,
        isNew: boolean
    ) => (
        <form
        onSubmit={(e) => {
            e.preventDefault();
            if (!(draft.name.ru || draft.name.en || draft.name[editLang]).trim()) return;
            if (isNew) {
                addTeamMember(draft);
            } else {
                updateTeamMember(draft);
            }
            setDraft(null);
        }}
        className="border border-[#0057B8]/40 rounded-2xl p-5 bg-blue-50/40 space-y-4"
        >
        <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-display text-base font-bold text-slate-900">
        {isNew ? copy.newTitle : `${copy.editTitle}: ${localize(draft.name)}`}
        </h3>
        <div className="inline-flex bg-white border border-slate-200 rounded-lg p-0.5">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">
        {copy.nameLabel} ({editLang.toUpperCase()}) *
        </label>
        <input
        type="text"
        required={editLang === 'ru'}
        value={draft.name[editLang] || ''}
        onChange={(e) =>
            setDraft((prev) =>
            prev
            ? { ...prev, name: { ...prev.name, [editLang]: e.target.value } }
            : null
            )
        }
        className="w-full h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg"
        />
        </div>
        <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">
        {copy.roleLabel} ({editLang.toUpperCase()})
        </label>
        <input
        type="text"
        value={draft.role[editLang] || ''}
        onChange={(e) =>
            setDraft((prev) =>
            prev
            ? { ...prev, role: { ...prev.role, [editLang]: e.target.value } }
            : null
            )
        }
        className="w-full h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg"
        />
        </div>
        </div>

        <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">
        {copy.bioLabel} ({editLang.toUpperCase()})
        </label>
        <textarea
        rows={2}
        value={draft.bio[editLang] || ''}
        onChange={(e) =>
            setDraft((prev) =>
            prev ? { ...prev, bio: { ...prev.bio, [editLang]: e.target.value } } : null
            )
        }
        className="w-full p-2.5 text-sm bg-white border border-slate-200 rounded-lg"
        />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">E-mail</label>
        <input
        type="email"
        required
        value={draft.email}
        onChange={(e) =>
            setDraft((prev) => (prev ? { ...prev, email: e.target.value } : null))
        }
        className="w-full h-9 px-3 text-sm font-mono bg-white border border-slate-200 rounded-lg"
        />
        </div>
        <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">Телефон</label>
        <input
        type="text"
        required
        value={draft.phone}
        onChange={(e) =>
            setDraft((prev) => (prev ? { ...prev, phone: e.target.value } : null))
        }
        className="w-full h-9 px-3 text-sm font-mono bg-white border border-slate-200 rounded-lg"
        />
        </div>
        <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">
        {copy.initialsLabel}
        </label>
        <input
        type="text"
        maxLength={3}
        value={draft.initials}
        onChange={(e) =>
            setDraft((prev) =>
            prev ? { ...prev, initials: e.target.value.toUpperCase() } : null
            )
        }
        className="w-full h-9 px-3 text-sm font-bold bg-white border border-slate-200 rounded-lg"
        />
        </div>
        <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">
        {copy.colorLabel}
        </label>
        <select
        value={draft.accentClass}
        onChange={(e) =>
            setDraft((prev) => (prev ? { ...prev, accentClass: e.target.value } : null))
        }
        className="w-full h-9 px-2.5 text-xs bg-white border border-slate-200 rounded-lg"
        >
        {ACCENT_PRESETS.map((p) => (
            <option key={p.value} value={p.value}>
            {p.label}
            </option>
        ))}
        </select>
        </div>
        <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">
        {copy.channelLabel}
        </label>
        <select
        value={draft.channel}
        onChange={(e) =>
            setDraft((prev) =>
            prev
            ? { ...prev, channel: e.target.value as TeamMember['channel'] }
            : null
            )
        }
        className="w-full h-9 px-2.5 text-xs bg-white border border-slate-200 rounded-lg"
        >
        <option value="export">Export (ВЭД)</option>
        <option value="wholesale">Wholesale / HoReCa</option>
        <option value="general">General / Quality</option>
        </select>
        </div>
        </div>

        <ImagePickerField
        label={copy.photoLabel}
        value={draft.photo || ''}
        allowClear
        onChange={(url) => setDraft((prev) => (prev ? { ...prev, photo: url } : null))}
        />

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
        <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-lg font-semibold text-slate-900">
        {copy.heading} ({teamMembers.length})
        </h2>

        <div className="flex flex-wrap items-center gap-2">
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

        <button
        type="button"
        onClick={() => {
            setEditingMember(null);
            setCreatingMember(createEmptyMember());
        }}
        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#0057B8] rounded-lg hover:bg-[#004494] transition-colors"
        >
        <Plus className="w-4 h-4" />
        <span>{copy.addBtn}</span>
        </button>
        </div>
        </div>

        {/* Section header & toggle */}
        <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50/70 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-sm font-semibold text-slate-900">{copy.sectionBlock}</span>
        <button
        type="button"
        onClick={() =>
            updateSiteSettings((prev) => ({
                ...prev,
                teamSection: { ...prev.teamSection, enabled: !prev.teamSection.enabled },
            }))
        }
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
            teamSection.enabled
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
            : 'bg-white text-slate-500 border-slate-200'
        }`}
        >
        {teamSection.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
        <span>{teamSection.enabled ? copy.sectionOn : copy.sectionOff}</span>
        </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">
        {copy.eyebrow} ({editLang.toUpperCase()})
        </label>
        <input
        type="text"
        value={teamSection.eyebrow[editLang] || ''}
        onChange={(e) =>
            updateSiteSettings((prev) => ({
                ...prev,
                teamSection: {
                    ...prev.teamSection,
                    eyebrow: { ...prev.teamSection.eyebrow, [editLang]: e.target.value },
                },
            }))
        }
        className="w-full h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg"
        />
        </div>

        <div className="sm:col-span-2">
        <label className="block text-xs font-medium text-slate-700 mb-1">
        {copy.title} ({editLang.toUpperCase()})
        </label>
        <input
        type="text"
        value={teamSection.title[editLang] || ''}
        onChange={(e) =>
            updateSiteSettings((prev) => ({
                ...prev,
                teamSection: {
                    ...prev.teamSection,
                    title: { ...prev.teamSection.title, [editLang]: e.target.value },
                },
            }))
        }
        className="w-full h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg"
        />
        </div>

        <div className="sm:col-span-3">
        <label className="block text-xs font-medium text-slate-700 mb-1">
        {copy.subtitle} ({editLang.toUpperCase()})
        </label>
        <input
        type="text"
        value={teamSection.subtitle[editLang] || ''}
        onChange={(e) =>
            updateSiteSettings((prev) => ({
                ...prev,
                teamSection: {
                    ...prev.teamSection,
                    subtitle: { ...prev.teamSection.subtitle, [editLang]: e.target.value },
                },
            }))
        }
        className="w-full h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg"
        />
        </div>
        </div>
        </div>

        {creatingMember && renderMemberForm(creatingMember, setCreatingMember, true)}
        {editingMember && renderMemberForm(editingMember, setEditingMember, false)}

        {/* Team Members Table */}
        <div className="border border-slate-200 rounded-xl overflow-x-auto bg-white">
        <table className="w-full text-left border-collapse text-sm">
        <thead>
        <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600">
        <th className="py-3 px-4">Специалист</th>
        <th className="py-3 px-4">Контакты</th>
        <th className="py-3 px-4">Статус</th>
        <th className="py-3 px-4 text-right">Действия</th>
        </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
        {teamMembers.map((member, idx) => (
            <tr key={member.id} className="hover:bg-slate-50/70">
            <td className="py-3 px-4">
            <div className="flex items-center gap-3">
            {member.photo ? (
                <img
                src={member.photo}
                alt={localize(member.name)}
                className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                />
            ) : (
                <div
                className={`w-10 h-10 rounded-full border flex items-center justify-center font-display text-xs font-bold shrink-0 ${member.accentClass}`}
                >
                {member.initials}
                </div>
            )}
            <div className="min-w-0">
            <div className="font-semibold text-slate-900">{localize(member.name)}</div>
            <div className="text-xs text-slate-500">{localize(member.role)}</div>
            </div>
            </div>
            </td>
            <td className="py-3 px-4 text-xs font-mono text-slate-600 tabular-nums">
            <div>{member.phone}</div>
            <div className="text-[#0057B8]">{member.email}</div>
            </td>
            <td className="py-3 px-4 text-xs">
            <span
            className={
                member.visible ? 'text-[#0057B8] font-medium' : 'text-slate-400'
            }
            >
            {member.visible ? copy.visible : copy.hidden}
            </span>
            </td>
            <td className="py-3 px-4 text-right">
            <div className="inline-flex items-center gap-1">
            <button
            type="button"
            disabled={idx === 0}
            onClick={() => moveTeamMember(member.id, 'up')}
            title="Move up"
            className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 disabled:opacity-30"
            >
            <ArrowUp className="w-4 h-4" />
            </button>
            <button
            type="button"
            disabled={idx === teamMembers.length - 1}
            onClick={() => moveTeamMember(member.id, 'down')}
            title="Move down"
            className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 disabled:opacity-30"
            >
            <ArrowDown className="w-4 h-4" />
            </button>
            <button
            type="button"
            onClick={() => {
                setCreatingMember(null);
                setEditingMember(member);
            }}
            className="p-1.5 rounded-md text-slate-600 hover:bg-slate-100 hover:text-[#0057B8]"
            >
            <Edit3 className="w-4 h-4" />
            </button>
            <button
            type="button"
            onClick={() => toggleTeamMemberVisibility(member.id)}
            className="p-1.5 rounded-md text-slate-600 hover:bg-slate-100"
            >
            {member.visible ? (
                <Eye className="w-4 h-4" />
            ) : (
                <EyeOff className="w-4 h-4" />
            )}
            </button>
            <button
            type="button"
            onClick={() => deleteTeamMember(member.id)}
            className="p-1.5 rounded-md text-slate-500 hover:bg-red-50 hover:text-red-600"
            >
            <Trash2 className="w-4 h-4" />
            </button>
            </div>
            </td>
            </tr>
        ))}
        </tbody>
        </table>
        </div>
        </div>
    );
};
