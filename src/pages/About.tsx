import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { ASSETS } from '../data/assets';
import { SeoHead } from '../components/SeoHead';
import { ImageWithFallback } from '../components/ImageWithFallback';

export const About: React.FC = () => {
  const { language, t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      <SeoHead
        title={`${t('navAbout')} — ${t('brandName')} (milk.by)`}
        description="О предприятии ОАО «Молочный Мир»: история с 1938 года, производственные площадки, контроль качества и экспорт."
        canonicalHash="/about"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-6 space-y-4 flex flex-col justify-center">
          <p className="text-xs font-semibold text-[#0057B8]">
            {language === 'ru' ? 'Основано в 1938 году · г. Гродно' : 'Established 1938 · Grodno, Belarus'}
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900">
            {language === 'ru'
              ? 'ОАО «Молочный Мир» — один из лидеров молочной отрасли Беларуси'
              : language === 'be'
              ? 'ААТ «Малочны Мір» — адзін з лідараў малочнай галіны Беларусі'
              : language === 'zh'
              ? 'Molochny Mir — 白俄罗斯领先乳制品生产企业'
              : 'Molochny Mir — Leading Belarusian Dairy Producer'}
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            {language === 'ru'
              ? 'Предприятие объединяет современные производственные площадки в Гродно, Щучине, Берестовице и Слониме, перерабатывая свыше 1 500 тонн свежего молока ежесуточно и выпуская более 142 наименований продукции.'
              : 'Operating modern plants across Grodno, Shchuchin, Berestovitsa, and Slonim, the company processes over 1,500 tons of raw milk daily across 142+ dairy SKUs.'}
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              to="/catalog"
              className="px-4 py-2.5 text-sm font-semibold text-white bg-[#0057B8] rounded-lg hover:bg-[#004494] transition-colors"
            >
              {t('heroPrimaryCta')}
            </Link>
            <Link
              to="/contacts"
              className="px-4 py-2.5 text-sm font-semibold text-slate-800 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
            >
              {t('ctaContact')}
            </Link>
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="h-full min-h-[260px] rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
            <ImageWithFallback
              src={ASSETS.newsDairyFacility}
              alt={t('brandName')}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-200">
        {[
          {
            metric: '1 500+ т/сут',
            title: language === 'ru' ? 'Переработка молока' : 'Daily Milk Intake',
            desc:
              language === 'ru'
                ? 'Сырьё исключительно высшего и сорта «Экстра» с собственных и партнёрских ферм.'
                : 'Extra-grade raw milk sourced from audited farms within a strict cold radius.',
          },
          {
            metric: '142 SKU',
            title: language === 'ru' ? 'Широкий ассортимент' : 'Product Portfolio',
            desc:
              language === 'ru'
                ? 'От цельномолочной продукции и йогуртов до выдержанных сыров, масла и сухих ингредиентов.'
                : 'From fresh milk and yogurts to aged cheeses, sweet cream butter, and dry dairy.',
          },
          {
            metric: '25+ стран',
            title: language === 'ru' ? 'География экспорта' : 'Global Presence',
            desc:
              language === 'ru'
                ? 'Регулярные отгрузки в страны СНГ, Китай, Ближний Восток и Юго-Восточную Азию.'
                : 'Regular shipments to CIS, China, Middle East, and Southeast Asia.',
          },
        ].map((box) => (
          <div key={box.metric} className="border border-slate-200 rounded-xl p-6 space-y-2">
            <div className="font-display text-2xl font-bold text-[#0057B8] tabular-nums">
              {box.metric}
            </div>
            <h2 className="font-display text-base font-semibold text-slate-900">{box.title}</h2>
            <p className="text-sm text-slate-600 leading-relaxed">{box.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
