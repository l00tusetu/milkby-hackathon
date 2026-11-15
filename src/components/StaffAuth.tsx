import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, Lock, X } from 'lucide-react';
import { DEMO_ADMIN_CREDENTIALS, useAuth } from '../hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';
import { SeoHead } from './SeoHead';

interface StaffLoginFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
}

const StaffLoginForm: React.FC<StaffLoginFormProps> = ({ onSuccess, onCancel }) => {
    const { language } = useLanguage();
    const { login } = useAuth();

    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const copy = {
        ru: {
            loginLabel: 'Логин или e-mail',
            loginPlaceholder: 'admin',
            passwordLabel: 'Пароль',
            passwordPlaceholder: 'Введите пароль',
            showPwd: 'Показать пароль',
            hidePwd: 'Скрыть пароль',
            errInvalid: 'Неверный логин или пароль.',
            submit: 'Войти',
            cancel: 'Отмена',
            demoHint: 'Демо-доступ:',
            fillDemo: 'Заполнить',
        },
        be: {
            loginLabel: 'Лагін або e-mail',
            loginPlaceholder: 'admin',
            passwordLabel: 'Пароль',
            passwordPlaceholder: 'Увядзіце пароль',
            showPwd: 'Паказаць пароль',
            hidePwd: 'Схаваць пароль',
            errInvalid: 'Няправільны лагін або пароль.',
            submit: 'Увайсці',
            cancel: 'Адмена',
            demoHint: 'Дэма-доступ:',
            fillDemo: 'Запоўніць',
        },
        en: {
            loginLabel: 'Username or email',
            loginPlaceholder: 'admin',
            passwordLabel: 'Password',
            passwordPlaceholder: 'Enter password',
            showPwd: 'Show password',
            hidePwd: 'Hide password',
            errInvalid: 'Invalid username or password.',
            submit: 'Sign In',
            cancel: 'Cancel',
            demoHint: 'Demo access:',
            fillDemo: 'Autofill',
        },
        zh: {
            loginLabel: '用户名或邮箱',
            loginPlaceholder: 'admin',
            passwordLabel: '密码',
            passwordPlaceholder: '请输入密码',
            showPwd: '显示密码',
            hidePwd: '隐藏密码',
            errInvalid: '用户名或密码错误。',
            submit: '登录',
            cancel: '取消',
            demoHint: '演示账号:',
            fillDemo: '自动填充',
        },
    }[language];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const ok = login(identifier, password);
        if (!ok) {
            setError(copy.errInvalid);
            return;
        }
        setError('');
        onSuccess?.();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
            <div className="p-3 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg">
            {error}
            </div>
        )}

        <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">
        {copy.loginLabel}
        </label>
        <input
        type="text"
        required
        autoComplete="username"
        value={identifier}
        onChange={(e) => {
            setIdentifier(e.target.value);
            if (error) setError('');
        }}
        placeholder={copy.loginPlaceholder}
        className="w-full h-10 px-3 text-base sm:text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#0057B8]"
        />
        </div>

        <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">
        {copy.passwordLabel}
        </label>
        <div className="relative">
        <input
        type={showPassword ? 'text' : 'password'}
        required
        autoComplete="current-password"
        value={password}
        onChange={(e) => {
            setPassword(e.target.value);
            if (error) setError('');
        }}
        placeholder={copy.passwordPlaceholder}
        className="w-full h-10 pl-3 pr-10 text-base sm:text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#0057B8]"
        />
        <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        aria-label={showPassword ? copy.hidePwd : copy.showPwd}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
        </div>
        </div>

        <div className="pt-1 flex items-center justify-end gap-2.5">
        {onCancel && (
            <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
            >
            {copy.cancel}
            </button>
        )}
        <button
        type="submit"
        className={`${
            onCancel ? 'px-5' : 'w-full'
        } py-2.5 text-sm font-semibold text-white bg-[#0057B8] rounded-lg hover:bg-[#004494] transition-colors`}
        >
        {copy.submit}
        </button>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-[11px] text-slate-400">
        <span className="font-mono">
        {copy.demoHint} {DEMO_ADMIN_CREDENTIALS.username} / {DEMO_ADMIN_CREDENTIALS.password}
        </span>
        <button
        type="button"
        onClick={() => {
            setIdentifier(DEMO_ADMIN_CREDENTIALS.username);
            setPassword(DEMO_ADMIN_CREDENTIALS.password);
            setError('');
        }}
        className="font-medium text-[#0057B8]/85 hover:text-[#0057B8] transition-colors whitespace-nowrap"
        >
        {copy.fillDemo}
        </button>
        </div>
        </form>
    );
};

interface StaffAuthModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export const StaffAuthModal: React.FC<StaffAuthModalProps> = ({
    open,
    onClose,
    onSuccess,
}) => {
    const { language } = useLanguage();
    const [mounted, setMounted] = useState(open);
    const [closing, setClosing] = useState(false);

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
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
            window.addEventListener('keydown', onKeyDown);
            return () => window.removeEventListener('keydown', onKeyDown);
    }, [open, onClose]);

    if (!mounted) return null;

    const copy = {
        ru: {
            title: 'Вход для сотрудников',
            subtitle: 'Панель управления каталогом и материалами сайта',
        },
        be: {
            title: 'Уваход для супрацоўнікаў',
            subtitle: 'Панэль кіравання каталогам і матэрыяламі сайта',
        },
        en: {
            title: 'Staff Sign In',
            subtitle: 'Access catalog and website content management',
        },
        zh: {
            title: '员工登录',
            subtitle: '进入产品目录与网站内容管理后台',
        },
    }[language];

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
        className={`bg-white border border-slate-200 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden ${
            closing ? 'modal-panel-out' : 'modal-panel-in'
        }`}
        >
        <div className="px-5 sm:px-6 py-4 border-b border-slate-200 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0057B8] flex items-center justify-center shrink-0">
        <Lock className="w-4 h-4" />
        </div>
        <div className="min-w-0">
        <h2 className="font-display text-base font-semibold text-slate-900 truncate">
        {copy.title}
        </h2>
        <p className="text-xs text-slate-500 truncate">{copy.subtitle}</p>
        </div>
        </div>

        <button
        type="button"
        onClick={onClose}
        aria-label="Close modal"
        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors shrink-0"
        >
        <X className="w-4 h-4" />
        </button>
        </div>

        <div className="p-5 sm:p-6">
        <StaffLoginForm
        onCancel={onClose}
        onSuccess={() => {
            onClose();
            onSuccess?.();
        }}
        />
        </div>
        </div>
        </div>
    );
};

export const StaffAuthGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const { language, t } = useLanguage();

    if (isAuthenticated) {
        return <>{children}</>;
    }

    const copy = {
        ru: {
            title: 'Доступ только для сотрудников',
            subtitle: 'Авторизуйтесь для перехода в панель управления сайтом.',
            backHome: 'Вернуться на главную',
        },
        be: {
            title: 'Доступ толькі для супрацоўнікаў',
            subtitle: 'Аўтарызуйцеся для пераходу ў панэль кіравання сайтам.',
            backHome: 'Вярнуцца на галоўную',
        },
        en: {
            title: 'Staff Access Required',
            subtitle: 'Sign in with an employee account to access website administration.',
            backHome: 'Back to homepage',
        },
        zh: {
            title: '仅限内部员工访问',
            subtitle: '请使用员工账号登录以访问网站管理后台。',
            backHome: '返回首页',
        },
    }[language];

    return (
        <div className="max-w-md mx-auto px-4 py-12 sm:py-16 space-y-5">
        <SeoHead
        title={`${copy.title} — ${t('brandName')}`}
        description={copy.subtitle}
        noIndex
        />

        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-sm space-y-5">
        <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0057B8] flex items-center justify-center shrink-0">
        <Lock className="w-5 h-5" />
        </div>
        <div className="space-y-1">
        <h1 className="font-display text-lg font-bold text-slate-900">{copy.title}</h1>
        <p className="text-xs text-slate-500 leading-relaxed">{copy.subtitle}</p>
        </div>
        </div>

        <StaffLoginForm />
        </div>

        <div className="text-center">
        <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-[#0057B8] transition-colors"
        >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>{copy.backHome}</span>
        </Link>
        </div>
        </div>
    );
};
