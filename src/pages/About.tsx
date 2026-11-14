import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage, useLocalizedPath } from '../hooks/useLanguage';
import { ASSETS } from '../data/assets';
import { SeoHead } from '../components/SeoHead';
import { ImageWithFallback } from '../components/ImageWithFallback';

export const About: React.FC = () => {
  const { language, t } = useLanguage();
  const lp = useLocalizedPath();

  const copy = {
    ru: {
      seoDesc: 'О предприятии ОАО «Молочный Мир»: история с 1938 года, производственные площадки, контроль качества и экспорт.',
      kicker: 'Основано в 1938 году · г. Гродно',
      h1: 'ОАО «Молочный Мир» — один из лидеров молочной отрасли Беларуси',
      lead: 'Предприятие объединяет современные производственные площадки в Гродно, Щучине, Берестовице и Слониме, перерабатывая свыше 1 500 тонн свежего молока ежесуточно и выпуская более 142 наименований продукции.',
      boxes: [
        { metric: '1 500+ т/сут', title: 'Переработка молока', desc: 'Сырьё исключительно высшего и сорта «Экстра» с собственных и партнёрских ферм.' },
        { metric: '142 SKU', title: 'Широкий ассортимент', desc: 'От цельномолочной продукции и йогуртов до выдержанных сыров, масла и сухих ингредиентов.' },
        { metric: '25+ стран', title: 'География экспорта', desc: 'Регулярные отгрузки в страны СНГ, Китай, Ближний Восток и Юго-Восточную Азию.' },
      ],
    },
    be: {
      seoDesc: 'Аб прадпрыемстве ААТ «Малочны Мір»: гісторыя з 1938 года, вытворчыя пляцоўкі, кантроль якасці і экспарт.',
      kicker: 'Заснавана ў 1938 годзе · г. Гродна',
      h1: 'ААТ «Малочны Мір» — адзін з лідараў малочнай галіны Беларусі',
      lead: 'Прадпрыемства аб’ядноўвае сучасныя вытворчыя пляцоўкі ў Гродне, Шчучыне, Бераставіцы і Слонiме, перапрацоўваючы звыш 1 500 тон свежага малака штосутачна і выпускаючы больш за 142 найменні прадукцыі.',
      boxes: [
        { metric: '1 500+ т/сут', title: 'Перапрацоўка малака', desc: 'Сыравіна выключна вышэйшага і гатунку «Экстра» з уласных і партнёрскіх ферм.' },
        { metric: '142 SKU', title: 'Шырокі асартымент', desc: 'Ад цэльнамалочнай прадукцыі і ёгуртаў да вытрыманых сыроў, масла і сухіх інгрэдыентаў.' },
        { metric: '25+ краін', title: 'Геаграфія экспарту', desc: 'Рэгулярныя адгрузкі ў краіны СНД, Кітай, Блізкі Усход і Паўднёва-Усходнюю Азію.' },
      ],
    },
    en: {
      seoDesc: 'About Molochny Mir JSC: heritage since 1938, modern production facilities, quality control, and global export.',
      kicker: 'Established 1938 · Grodno, Belarus',
      h1: 'Molochny Mir — Leading Belarusian Dairy Producer',
      lead: 'Operating modern plants across Grodno, Shchuchin, Berestovitsa, and Slonim, the company processes over 1,500 tons of raw milk daily across 142+ dairy SKUs.',
      boxes: [
        { metric: '1,500+ t/day', title: 'Daily Milk Intake', desc: 'Extra-grade raw milk sourced from audited farms within a strict cold radius.' },
        { metric: '142 SKU', title: 'Product Portfolio', desc: 'From fresh milk and yogurts to aged cheeses, sweet cream butter, and dry dairy.' },
        { metric: '25+ countries', title: 'Global Presence', desc: 'Regular shipments to CIS, China, Middle East, and Southeast Asia.' },
      ],
    },
    zh: {
      seoDesc: '关于白俄罗斯 Molochny Mir 乳业股份公司：始于1938年的历史、现代化工厂、质量管控与全球出口。',
      kicker: '始创于 1938 年 · 白俄罗斯格罗德诺',
      h1: 'Molochny Mir — 白俄罗斯领先乳制品生产企业',
      lead: '公司在格罗德诺、休钦、别列斯托维察和斯洛尼姆拥有现代化生产基地，日处理优质生牛乳超过1,500吨，在产乳制品SKU超过142种。',
      boxes: [
        { metric: '1,500+ 吨/日', title: '日均鲜奶加工量', desc: '100%采用来自认证牧场的特级与优级生牛乳原料，冷链半径严格受控。' },
        { metric: '142+ SKU', title: '全品类产品矩阵', desc: '涵盖鲜奶、酸奶、陈年与马苏里拉奶酪、天然黄油及工业干乳制品原料。' },
        { metric: '25+ 国家/地区', title: '全球出口版图', desc: '常态化稳定出口独联体、中国、中东及东南亚市场。' },
      ],
    },
  }[language];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
    <SeoHead
    title={`${t('navAbout')} — ${t('brandName')} (milk.by)`}
    description={copy.seoDesc}
    canonicalPath="/about"
    />

    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
    <div className="lg:col-span-6 space-y-4 flex flex-col justify-center">
    <p className="text-xs font-semibold text-[#0057B8]">{copy.kicker}</p>
    <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900">{copy.h1}</h1>
    <p className="text-base text-slate-600 leading-relaxed">{copy.lead}</p>
    <div className="pt-2 flex flex-wrap gap-3">
    <Link
    to={lp("/catalog")}
    className="px-4 py-2.5 text-sm font-semibold text-white bg-[#0057B8] rounded-lg hover:bg-[#004494] transition-colors"
    >
    {t('heroPrimaryCta')}
    </Link>
    <Link
    to={lp("/contacts")}
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
    {copy.boxes.map((box) => (
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
