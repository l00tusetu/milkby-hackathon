import React, { useId, useState } from 'react';
import { Image as ImageIcon, Link2, Trash2, Upload } from 'lucide-react';
import { ASSETS } from '../../data/assets';
import { useLanguage } from '../../hooks/useLanguage';
import { ImageWithFallback } from '../ImageWithFallback';

interface ImagePickerFieldProps {
    label: string;
    value: string;
    onChange: (nextValue: string) => void;
    allowClear?: boolean;
    helperText?: string;
}

const PRESET_IMAGES = [
    { key: 'mozzarella', label: 'Моцарелла', src: ASSETS.productMozzarella },
{ key: 'cheese', label: 'Выдержанный сыр', src: ASSETS.productAgedCheese },
{ key: 'milk', label: 'Молоко и кефир', src: ASSETS.productMilkKefir },
{ key: 'butter', label: 'Масло и сливки', src: ASSETS.productButterCream },
{ key: 'yogurt', label: 'Йогурт / творог', src: ASSETS.productGreekYogurt },
{ key: 'ice', label: 'Мороженое', src: ASSETS.productIceCream },
{ key: 'facility', label: 'Производство', src: ASSETS.newsDairyFacility },
{ key: 'hero', label: 'Витрина (Hero)', src: ASSETS.heroDairyShowcase },
] as const;

function compressImageFile(file: File, maxSide = 1200): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => reject(new Error('File read error'));
        reader.onload = () => {
            const dataUrl = String(reader.result || '');
            if (!dataUrl || file.type === 'image/svg+xml') {
                resolve(dataUrl);
                return;
            }
            const img = new window.Image();
            img.onload = () => {
                const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
                const width = Math.max(1, Math.round(img.width * scale));
                const height = Math.max(1, Math.round(img.height * scale));
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    resolve(dataUrl);
                    return;
                }
                ctx.drawImage(img, 0, 0, width, height);
                const targetMime = file.type === 'image/png' ? 'image/webp' : 'image/jpeg';
                const compressed = canvas.toDataURL(targetMime, 0.84);
                resolve(compressed.length < dataUrl.length ? compressed : dataUrl);
            };
            img.onerror = () => resolve(dataUrl);
            img.src = dataUrl;
        };
        reader.readAsDataURL(file);
    });
}

export const ImagePickerField: React.FC<ImagePickerFieldProps> = ({
    label,
    value,
    onChange,
    allowClear = false,
    helperText,
}) => {
    const { language } = useLanguage();
    const inputId = useId();
    const [showPresets, setShowPresets] = useState(false);
    const [busy, setBusy] = useState(false);

    const copy = {
        ru: {
            upload: 'Загрузить файл',
            loading: 'Сжатие…',
            presets: 'Галерея сайта',
            hidePresets: 'Скрыть галерею',
            urlPlaceholder: 'Или вставьте URL изображения (https://… или /assets/…)',
            clear: 'Убрать фото',
        },
        be: {
            upload: 'Загрузіць файл',
            loading: 'Сціск…',
            presets: 'Галерэя сайта',
            hidePresets: 'Схаваць галерэю',
            urlPlaceholder: 'Або ўстаўце URL выявы (https://…)',
            clear: 'Прыбраць фота',
        },
        en: {
            upload: 'Upload file',
            loading: 'Processing…',
            presets: 'Site library',
            hidePresets: 'Hide library',
            urlPlaceholder: 'Or paste image URL (https://…)',
            clear: 'Remove',
        },
        zh: {
            upload: '上传图片',
            loading: '处理中…',
            presets: '媒体库预设',
            hidePresets: '收起媒体库',
            urlPlaceholder: '或粘贴图片链接 (https://…)',
            clear: '移除图片',
        },
    }[language];

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setBusy(true);
        try {
            const optimized = await compressImageFile(file);
            if (optimized) onChange(optimized);
        } finally {
            setBusy(false);
            e.target.value = '';
        }
    };

    return (
        <div className="space-y-2.5">
        <div className="flex items-center justify-between gap-2">
        <label htmlFor={inputId} className="block text-xs font-medium text-slate-700">
        {label}
        </label>
        {helperText && <span className="text-[11px] text-slate-400">{helperText}</span>}
        </div>

        <div className="flex flex-col sm:flex-row items-start gap-3 p-3 bg-white border border-slate-200 rounded-xl">
        <div className="w-24 h-18 rounded-lg overflow-hidden border border-slate-200 bg-slate-50 shrink-0">
        <ImageWithFallback
        src={value}
        alt={label}
        className="w-full h-full object-cover"
        />
        </div>

        <div className="flex-1 min-w-0 w-full space-y-2">
        <div className="flex flex-wrap items-center gap-2">
        <label className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#0057B8] bg-blue-50 hover:bg-blue-100 rounded-lg cursor-pointer transition-colors">
        <Upload className="w-3.5 h-3.5" />
        <span>{busy ? copy.loading : copy.upload}</span>
        <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        />
        </label>

        <button
        type="button"
        onClick={() => setShowPresets((prev) => !prev)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
        >
        <ImageIcon className="w-3.5 h-3.5" />
        <span>{showPresets ? copy.hidePresets : copy.presets}</span>
        </button>

        {allowClear && value && (
            <button
            type="button"
            onClick={() => onChange('')}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
            >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{copy.clear}</span>
            </button>
        )}
        </div>

        <div className="relative">
        <Link2 className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
        id={inputId}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={copy.urlPlaceholder}
        className="w-full h-8 pl-8 pr-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:bg-white focus:border-[#0057B8]"
        />
        </div>
        </div>
        </div>

        {showPresets && (
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 p-2.5 bg-white border border-slate-200 rounded-xl">
            {PRESET_IMAGES.map((preset) => {
                const selected = value === preset.src;
                return (
                    <button
                    key={preset.key}
                    type="button"
                    title={preset.label}
                    onClick={() => {
                        onChange(preset.src);
                        setShowPresets(false);
                    }}
                    className={`group relative aspect-[4/3] rounded-lg overflow-hidden border transition-all ${
                        selected
                        ? 'border-[#0057B8] ring-2 ring-[#0057B8]/30'
                        : 'border-slate-200 hover:border-[#0057B8]/50'
                    }`}
                    >
                    <img
                    src={preset.src}
                    alt={preset.label}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <span className="sr-only">{preset.label}</span>
                    </button>
                );
            })}
            </div>
        )}
        </div>
    );
};
