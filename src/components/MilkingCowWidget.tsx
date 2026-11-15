import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    X,
    Volume2,
    VolumeX,
    Sparkles,
    Trophy,
    Award,
    RotateCcw,
    CheckCircle2,
} from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

interface Particle {
    id: number;
    x: number;
    y: number;
    text: string;
}

const STORAGE_MILK_KEY = 'milk_world_milked_liters_v1';
const BUCKET_CAPACITY = 5.0; // 5 литров на ведро

const UNLOCKABLE_PRODUCTS = [
    { atLiters: 5, name: { ru: 'Свежее молоко «ГороденЪ» 3.2%', be: 'Свежае малако «ГорадзенЪ» 3.2%', en: 'Fresh Milk "Goroden" 3.2%', zh: 'Goroden 纯鲜牛奶 3.2%' } },
{ atLiters: 15, name: { ru: 'Сметана «ГороденЪ» 20%', be: 'Смятана «ГорадзенЪ» 20%', en: 'Sour Cream "Goroden" 20%', zh: 'Goroden 天然酸奶油 20%' } },
{ atLiters: 30, name: { ru: 'Масло сливочное «ГороденЪ» 82,5%', be: 'Масла сметанковае «ГорадзенЪ» 82,5%', en: 'Sweet Cream Butter 82.5%', zh: '82.5% 天然纯脂黄油' } },
{ atLiters: 50, name: { ru: 'Выдержанный сыр «ГуберТ»', be: 'Вытрыманы сыр «ГуберТ»', en: 'Aged Reserve Cheese "Gubert"', zh: 'Gubert 特级陈年干酪' } },
{ atLiters: 75, name: { ru: 'Премиальный Пармезан 12 месяцев', be: 'Прэміяльны Пармезан 12 месяцаў', en: 'Premium Parmesan (12 Mo. Reserve)', zh: '12个月特级黑标帕玛森奶酪' } },
];

function playSquirtAudio(muted: boolean) {
    if (muted) return;
    try {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioContextClass();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(360, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.11);
        gain.gain.setValueAtTime(0.18, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.11);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
    } catch {
        // Audio unsupported or blocked
    }
}

function playMooAudio(muted: boolean) {
    if (muted) return;
    try {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioContextClass();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(115, ctx.currentTime + 0.28);
        osc.frequency.exponentialRampToValueAtTime(85, ctx.currentTime + 0.65);
        gain.gain.setValueAtTime(0.01, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.65);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.7);
    } catch {
        // Audio unsupported
    }
}

function playSuccessAudio(muted: boolean) {
    if (muted) return;
    try {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioContextClass();
        [440, 554, 659, 880].forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.value = freq;
            const startTime = ctx.currentTime + idx * 0.08;
            gain.gain.setValueAtTime(0.14, startTime);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.22);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(startTime);
            osc.stop(startTime + 0.23);
        });
    } catch {
        // Audio unsupported
    }
}

export const MilkingCowWidget: React.FC = () => {
    const { language } = useLanguage();

    const [isOpen, setIsOpen] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [totalLiters, setTotalLiters] = useState<number>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_MILK_KEY);
            return saved ? parseFloat(saved) || 0 : 0;
        } catch {
            return 0;
        }
    });

    const [bucketLiters, setBucketLiters] = useState(0);
    const [activeTeat, setActiveTeat] = useState<'left' | 'right' | null>(null);
    const [particles, setParticles] = useState<Particle[]>([]);
    const [speechIdx, setSpeechIdx] = useState(0);
    const [showCelebration, setShowCelebration] = useState(false);
    const [unlockedItem, setUnlockedItem] = useState<string | null>(null);

    const bubbleTimerRef = useRef<number | null>(null);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_MILK_KEY, totalLiters.toFixed(1));
        } catch {
            // storage ignored
        }
    }, [totalLiters]);

    const copy = {
        ru: {
            cowName: 'Бурёнка Мила',
            cowSubtitle: 'Ферма ОАО «Молочный Мир» · Сорт «Экстра»',
            milkBtn: 'Подоить корову (+0.5 л)',
            teatHint: 'Нажмите на вымя или кнопку, чтобы получить молоко!',
            bucketLabel: 'Ведро для сбора',
            bucketFull: 'Ведро наполнено!',
            deliverBtn: 'Сдать на завод (5 л)',
            totalLabel: 'Всего надоено',
            unlockedTitle: 'Новый продукт разблокирован!',
            speeches: [
                'Му-у-у! Свежее молоко сорта «Экстра»!',
                'Каждая капля пойдёт на сыр «ГуберТ»!',
                'Гродненские луга — самые сочные!',
                'Спасибо за заботу! Му-у-у!',
                'Жирность 3.6%, белок 3.4% — высший класс!',
            ],
            toggleAria: 'Открыть интерактивную корову',
            litersUnit: 'л',
            resetBtn: 'Сбросить',
        },
        be: {
            cowName: 'Буронка Міла',
            cowSubtitle: 'Ферма ААТ «Малочны Мір» · Гатунак «Экстра»',
            milkBtn: 'Падаіць карову (+0.5 л)',
            teatHint: 'Націсніце на вымя або кнопку, каб атрымаць малако!',
            bucketLabel: 'Вядро для збору',
            bucketFull: 'Вядро напоўнена!',
            deliverBtn: 'Здаць на завод (5 л)',
            totalLabel: 'Усяго надоена',
            unlockedTitle: 'Новы прадукт разблакаваны!',
            speeches: [
                'Му-у-у! Свежае малако гатунку «Экстра»!',
                'Кожная кропля пойдзе на сыр «ГуберТ»!',
                'Гродзенскія лугі — самыя сакавітыя!',
                'Дзякуй за клопат! Му-у-у!',
                'Тлустасць 3.6%, бялок 3.4% — найвышэйшы клас!',
            ],
            toggleAria: 'Адкрыць інтэрактыўную карову',
            litersUnit: 'л',
            resetBtn: 'Скінуць',
        },
        en: {
            cowName: 'Mila the Cow',
            cowSubtitle: 'Molochny Mir Farm · Extra-Grade Milk',
            milkBtn: 'Milk the Cow (+0.5 L)',
            teatHint: 'Click udders or button to milk!',
            bucketLabel: 'Milk Bucket',
            bucketFull: 'Bucket is full!',
            deliverBtn: 'Deliver to Dairy Plant (5L)',
            totalLabel: 'Total Milked',
            unlockedTitle: 'New Product Unlocked!',
            speeches: [
                'Moo-oo! Farm-fresh Extra-grade milk!',
                'Every drop goes into reserve Gubert cheese!',
                'Grodno pastures are the greenest!',
                'Thank you for milking me! Moo-oo!',
                '3.6% butterfat and 3.4% natural protein!',
            ],
            toggleAria: 'Open interactive cow',
            litersUnit: 'L',
            resetBtn: 'Reset',
        },
        zh: {
            cowName: '奶牛米拉 (Mila)',
            cowSubtitle: 'Molochny Mir 现代化牧场 · 特级原奶',
            milkBtn: '为奶牛挤奶 (+0.5 升)',
            teatHint: '点击牛乳房或下方按钮即可挤奶！',
            bucketLabel: '鲜奶收集桶',
            bucketFull: '奶桶已装满！',
            deliverBtn: '送往乳品厂加工 (5 升)',
            totalLabel: '累计产奶量',
            unlockedTitle: '解锁全新乳品！',
            speeches: [
                '哞~ 纯正特级生牛乳！',
                '每一滴都将用于制作 Gubert 奶酪！',
                '格罗德诺的牧草最为鲜美多汁！',
                '感谢你的细心照料！哞~',
                '乳脂率 3.6%，天然乳蛋白 3.4%！',
            ],
            toggleAria: '打开互动奶牛',
            litersUnit: '升',
            resetBtn: '重置',
        },
    }[language];

    const handleMilk = useCallback((side: 'left' | 'right' = 'left') => {
        setActiveTeat(side);
        playSquirtAudio(isMuted);

        // Добавляем всплывающий бейдж с литрами
        const newId = Date.now() + Math.random();
        setParticles((prev) => [
            ...prev.slice(-4),
                     {
                         id: newId,
                         x: side === 'left' ? 42 : 58,
                         y: 62,
                         text: `+0.5 ${copy.litersUnit}`,
                     },
        ]);

        setTimeout(() => {
            setParticles((prev) => prev.filter((p) => p.id !== newId));
        }, 900);

        // Сброс анимации струи
        setTimeout(() => {
            setActiveTeat(null);
        }, 220);

        setTotalLiters((prev) => {
            const next = prev + 0.5;
            // Проверка наград
            const reward = UNLOCKABLE_PRODUCTS.find((item) => prev < item.atLiters && next >= item.atLiters);
            if (reward) {
                setUnlockedItem(reward.name[language]);
                playSuccessAudio(isMuted);
            }
            return next;
        });

        setBucketLiters((prev) => Math.min(BUCKET_CAPACITY, +(prev + 0.5).toFixed(1)));

        // Случайная фраза
        if (!bubbleTimerRef.current) {
            setSpeechIdx((prev) => (prev + 1) % copy.speeches.length);
            bubbleTimerRef.current = window.setTimeout(() => {
                bubbleTimerRef.current = null;
            }, 3000);
        }
    }, [isMuted, copy.litersUnit, copy.speeches.length, language]);

    const handleDeliverToPlant = () => {
        playSuccessAudio(isMuted);
        setShowCelebration(true);
        setBucketLiters(0);
        setTimeout(() => {
            setShowCelebration(false);
        }, 2400);
    };

    const bucketPercent = Math.min(100, Math.round((bucketLiters / BUCKET_CAPACITY) * 100));

    return (
        <>
        {/* 1. Плавающая кнопка в углу экрана (свернутое состояние) */}
        <div className="fixed bottom-5 right-5 z-40 select-none">
        {!isOpen && (
            <button
            type="button"
            onClick={() => {
                setIsOpen(true);
                playMooAudio(isMuted);
            }}
            aria-label={copy.toggleAria}
            className="group relative flex items-center gap-2.5 pl-3.5 pr-4 py-2.5 rounded-full bg-white border-2 border-[#0057B8] shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200"
            >
            <span className="relative flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-xl overflow-hidden shrink-0">
            🐮
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse" />
            </span>
            <div className="text-left leading-tight">
            <div className="text-[11px] font-bold text-[#0057B8] uppercase tracking-wider flex items-center gap-1">
            <span>{copy.cowName}</span>
            <Sparkles className="w-3 h-3 text-amber-500" />
            </div>
            <div className="text-xs font-mono font-bold text-slate-800 tabular-nums">
            {totalLiters.toFixed(1)} {copy.litersUnit}
            </div>
            </div>
            </button>
        )}
        </div>

        {/* 2. Модальное окошко с коровой */}
        {isOpen && (
            <div
            role="dialog"
            aria-label={copy.cowName}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-32px)] max-w-sm bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden transition-all animate-in fade-in zoom-in-95 duration-200"
            >
            {/* Шапка диалога */}
            <div className="px-4 py-3 bg-gradient-to-r from-[#0057B8] to-[#0284c7] text-white flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
            <span className="text-2xl shrink-0">🐮</span>
            <div className="min-w-0">
            <div className="font-display text-sm font-bold truncate flex items-center gap-1.5">
            <span>{copy.cowName}</span>
            <span className="px-1.5 py-0.2 bg-white/20 rounded text-[10px] uppercase font-mono">
            Milk.by
            </span>
            </div>
            <div className="text-[10px] text-blue-100 truncate">
            {copy.cowSubtitle}
            </div>
            </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
            <button
            type="button"
            onClick={() => setIsMuted((m) => !m)}
            title={isMuted ? 'Включить звук' : 'Выключить звук'}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white/80 hover:text-white hover:bg-white/15 transition-colors"
            >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Закрыть"
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white/80 hover:text-white hover:bg-white/15 transition-colors"
            >
            <X className="w-4 h-4" />
            </button>
            </div>
            </div>

            <div className="p-4 space-y-3.5 bg-gradient-to-b from-blue-50/40 via-white to-slate-50/70">
            {/* Реплика коровы */}
            <div className="relative bg-white border border-blue-200/80 rounded-2xl p-2.5 text-center shadow-xs">
            <p className="text-xs font-medium text-slate-800 leading-snug">
            {copy.speeches[speechIdx]}
            </p>
            {/* Хвостик спичбаббла */}
            <div
            aria-hidden="true"
            className="absolute left-1/2 -bottom-1.5 -translate-x-1/2 w-3 h-3 bg-white border-r border-b border-blue-200/80 rotate-45"
            />
            </div>

            {/* Векторная интерактивная корова */}
            <div className="relative h-48 w-full bg-gradient-to-b from-sky-100/60 to-emerald-100/50 rounded-2xl border border-blue-100 overflow-hidden flex items-center justify-center select-none">
            {/* Фон: луг и небо */}
            <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-emerald-200/80 to-transparent pointer-events-none"
            />

            {/* Всплывающие партиклы +0.5 л */}
            {particles.map((p) => (
                <div
                key={p.id}
                style={{ left: `${p.x}%`, top: `${p.y}%` }}
                className="absolute -translate-x-1/2 pointer-events-none text-xs font-extrabold text-[#0057B8] bg-white/95 px-2 py-0.5 rounded-full shadow-md animate-bounce z-20"
                >
                {p.text}
                </div>
            ))}

            {/* SVG Корова */}
            <svg
            viewBox="0 0 280 200"
            className="w-full h-full max-h-48 drop-shadow-sm"
            aria-hidden="true"
            >
            {/* Ноги */}
            <rect x="75" y="125" width="16" height="50" rx="6" fill="#f8fafc" stroke="#334155" strokeWidth="3" />
            <rect x="75" y="165" width="16" height="10" rx="3" fill="#334155" />

            <rect x="110" y="125" width="16" height="50" rx="6" fill="#f8fafc" stroke="#334155" strokeWidth="3" />
            <rect x="110" y="165" width="16" height="10" rx="3" fill="#334155" />

            <rect x="155" y="125" width="16" height="50" rx="6" fill="#f8fafc" stroke="#334155" strokeWidth="3" />
            <rect x="155" y="165" width="16" height="10" rx="3" fill="#334155" />

            <rect x="190" y="125" width="16" height="50" rx="6" fill="#f8fafc" stroke="#334155" strokeWidth="3" />
            <rect x="190" y="165" width="16" height="10" rx="3" fill="#334155" />

            {/* Хвост */}
            <path d="M 65 95 Q 45 110 50 135" fill="none" stroke="#334155" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M 48 135 C 44 142 55 146 52 135 Z" fill="#334155" />

            {/* Тело коровы */}
            <rect x="65" y="70" width="145" height="70" rx="30" fill="#ffffff" stroke="#334155" strokeWidth="3.5" />

            {/* Черные пятна на теле */}
            <path d="M 85 75 Q 105 72 108 90 Q 98 110 80 102 Z" fill="#1e293b" />
            <path d="M 140 73 Q 165 72 160 95 Q 135 98 140 73 Z" fill="#1e293b" />
            <path d="M 180 105 Q 205 110 195 130 Q 175 135 180 105 Z" fill="#1e293b" />

            {/* Вымя (Udder) — розовое полукруглое основание */}
            <g id="udder-group" className="cursor-pointer">
            <path
            d="M 120 128 C 120 148 160 148 160 128 Z"
            fill="#fda4af"
            stroke="#e11d48"
            strokeWidth="2.5"
            />

            {/* Левый сосок (кликабельный) */}
            <g
            onClick={() => handleMilk('left')}
            className="hover:scale-110 origin-top transition-transform cursor-pointer"
            >
            <rect
            x="128"
            y="142"
            width="7"
            height={activeTeat === 'left' ? 18 : 13}
            rx="3.5"
            fill="#fb7185"
            stroke="#e11d48"
            strokeWidth="2"
            />
            </g>

            {/* Средний сосок */}
            <g
            onClick={() => handleMilk('left')}
            className="hover:scale-110 origin-top transition-transform cursor-pointer"
            >
            <rect
            x="137"
            y="143"
            width="6"
            height="12"
            rx="3"
            fill="#fb7185"
            stroke="#e11d48"
            strokeWidth="2"
            />
            </g>

            {/* Правый сосок (кликабельный) */}
            <g
            onClick={() => handleMilk('right')}
            className="hover:scale-110 origin-top transition-transform cursor-pointer"
            >
            <rect
            x="146"
            y="142"
            width="7"
            height={activeTeat === 'right' ? 18 : 13}
            rx="3.5"
            fill="#fb7185"
            stroke="#e11d48"
            strokeWidth="2"
            />
            </g>
            </g>

            {/* Анимация струй молока в ведро */}
            {activeTeat === 'left' && (
                <path
                d="M 131 160 L 126 185"
                stroke="#ffffff"
                strokeWidth="3.5"
                strokeLinecap="round"
                className="animate-pulse"
                />
            )}
            {activeTeat === 'right' && (
                <path
                d="M 150 160 L 155 185"
                stroke="#ffffff"
                strokeWidth="3.5"
                strokeLinecap="round"
                className="animate-pulse"
                />
            )}

            {/* Шея и голова */}
            <rect x="180" y="48" width="52" height="55" rx="22" fill="#ffffff" stroke="#334155" strokeWidth="3.5" />
            {/* Пятно на голове */}
            <path d="M 195 49 Q 220 50 215 70 Q 198 75 195 49 Z" fill="#1e293b" />

            {/* Рога */}
            <path d="M 188 50 Q 180 34 192 32 Q 194 45 194 50 Z" fill="#cbd5e1" stroke="#334155" strokeWidth="2" />
            <path d="M 218 50 Q 228 34 216 32 Q 214 45 214 50 Z" fill="#cbd5e1" stroke="#334155" strokeWidth="2" />

            {/* Уши */}
            <ellipse cx="177" cy="58" rx="10" ry="6" fill="#ffffff" stroke="#334155" strokeWidth="2.5" transform="rotate(-20 177 58)" />
            <ellipse cx="232" cy="58" rx="10" ry="6" fill="#ffffff" stroke="#334155" strokeWidth="2.5" transform="rotate(20 232 58)" />

            {/* Глаза (веселые) */}
            <circle cx="195" cy="65" r="4.5" fill="#0f172a" />
            <circle cx="196" cy="63.5" r="1.5" fill="#ffffff" />
            <circle cx="217" cy="65" r="4.5" fill="#0f172a" />
            <circle cx="218" cy="63.5" r="1.5" fill="#ffffff" />

            {/* Мордочка (snout) */}
            <rect x="188" y="78" width="46" height="28" rx="13" fill="#fbcfe8" stroke="#334155" strokeWidth="2.5" />
            <ellipse cx="202" cy="90" rx="3.5" ry="4.5" fill="#831843" />
            <ellipse cx="220" cy="90" rx="3.5" ry="4.5" fill="#831843" />
            <path d="M 207 98 Q 211 102 215 98" fill="none" stroke="#831843" strokeWidth="2" strokeLinecap="round" />

            {/* Колокольчик на шее */}
            <path d="M 198 103 L 205 116 L 191 116 Z" fill="#f59e0b" stroke="#78350f" strokeWidth="2" />
            <circle cx="198" cy="117" r="2.5" fill="#b45309" />
            </svg>

            <div className="absolute bottom-2 left-2 text-[10px] font-semibold bg-white/85 backdrop-blur-xs px-2 py-0.5 rounded-md text-slate-600 border border-slate-200">
            {copy.teatHint}
            </div>
            </div>

            {/* Ведро и индикатор наполнения */}
            <div className="bg-white border border-slate-200 rounded-2xl p-3 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800">
            <span className="flex items-center gap-1.5">
            <span>🪣 {copy.bucketLabel}</span>
            {bucketLiters >= BUCKET_CAPACITY && (
                <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-semibold">
                {copy.bucketFull}
                </span>
            )}
            </span>
            <span className="font-mono text-[#0057B8] tabular-nums">
            {bucketLiters.toFixed(1)} / {BUCKET_CAPACITY} {copy.litersUnit}
            </span>
            </div>

            {/* Прогресс-бар ведра */}
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
            <div
            style={{ width: `${bucketPercent}%` }}
            className={`h-full rounded-full transition-all duration-300 ${
                bucketLiters >= BUCKET_CAPACITY
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                : 'bg-gradient-to-r from-[#0057B8] to-[#0284c7]'
            }`}
            />
            </div>

            {/* Кнопка сдачи на завод при полном ведре */}
            {bucketLiters >= BUCKET_CAPACITY && (
                <button
                type="button"
                onClick={handleDeliverToPlant}
                className="w-full py-2 px-3 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 animate-pulse"
                >
                <Trophy className="w-3.5 h-3.5" />
                <span>{copy.deliverBtn}</span>
                </button>
            )}
            </div>

            {/* Главная кнопка доения */}
            <button
            type="button"
            onClick={() => handleMilk('left')}
            className="w-full py-3 px-4 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-[#0057B8] to-[#0a65c2] hover:from-[#004494] hover:to-[#0057B8] active:scale-[0.98] transition-all shadow-md flex items-center justify-center gap-2"
            >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{copy.milkBtn}</span>
            </button>

            {/* Статистика и открытые продукты */}
            <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-600">
            <span className="font-medium">
            {copy.totalLabel}: <strong className="text-slate-900 font-mono text-sm">{totalLiters.toFixed(1)} {copy.litersUnit}</strong>
            </span>

            <button
            type="button"
            onClick={() => {
                setTotalLiters(0);
                setBucketLiters(0);
            }}
            className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-700 transition-colors"
            >
            <RotateCcw className="w-3 h-3" />
            <span>{copy.resetBtn}</span>
            </button>
            </div>

            {/* Баннер разблокировки продукта */}
            {unlockedItem && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-center space-y-1 animate-in fade-in zoom-in-95">
                <div className="inline-flex items-center gap-1 text-xs font-bold text-amber-800">
                <Award className="w-4 h-4 text-amber-600" />
                <span>{copy.unlockedTitle}</span>
                </div>
                <div className="text-xs font-semibold text-slate-900">{unlockedItem}</div>
                </div>
            )}

            {/* Анимация сдачи на завод */}
            {showCelebration && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-center text-xs font-bold flex items-center justify-center gap-2 animate-bounce">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>5 литров отборного молока сорта «Экстра» отправлено на сырзавод! 🎉</span>
                </div>
            )}
            </div>
            </div>
        )}
        </>
    );
};
