import React from 'react';
import { Star, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

export const HomeTestimonialSection: React.FC = () => {
  const { language } = useLanguage();

  const copy = {
    ru: {
      quote:
        '«Стабильная плавкость моцареллы в фасовках 500 г и 1 кг, прозрачные спецификации для нашей сети и чёткое соблюдение холодовой цепи делают ОАО «Молочный Мир» одним из самых надёжных поставщиков в категории HoReCa и ритейла.»',
      author: 'Сергей Литвинов',
      position: 'Директор по закупкам, Федеральная сеть «ЕвроФуд Трейд»',
      badge: 'Партнёр с 2019 года',
      starsLabel: 'Оценка 5 из 5',
    },
    be: {
      quote:
        '«Стабільная плаўкасць мацарэлы ў фасоўках 500 г і 1 кг, празрыстыя спецыфікацыі і дакладнае захаванне халадовага ланцуга робяць ААТ «Малочны Мір» адным з самых надзейных пастаўшчыкоў для сегмента HoReCa і рытэйлу.»',
      author: 'Сяргей Літвінаў',
      position: 'Дырэктар па закупках, Гандлёвая сетка «ЕўраФуд Трэйд»',
      badge: 'Партнёр з 2019 года',
      starsLabel: 'Адзнака 5 з 5',
    },
    en: {
      quote:
        '"Consistent stretch performance across 500g and 1kg mozzarella formats, complete export documentation, and unbroken cold-chain logistics make Molochny Mir one of our most reliable dairy suppliers for retail and HoReCa."',
      author: 'Sergey Litvinov',
      position: 'Procurement Director, EuroFood Trade Group',
      badge: 'Export Partner since 2019',
      starsLabel: 'Rated 5 out of 5 stars',
    },
    zh: {
      quote:
        '“500克和1公斤规格马苏里拉奶酪在商业烘焙中表现出极佳的稳定性，加之完整清晰的出口报关单证与全程冷链交付，使 Molochny Mir 成为我们零售与餐饮供应链中值得信赖的核心合作伙伴。”',
      author: 'Sergey Litvinov',
      position: '采购总监，EuroFood Trade 国际食品贸易集团',
      badge: '2019 年起战略出口伙伴',
      starsLabel: '五星合作伙伴评价',
    },
  }[language];

  return (
    <section
      id="testimonial"
      className="bg-slate-50 border-y border-slate-200 py-16 sm:py-20"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center space-y-8">
        <div className="flex items-center gap-1" role="img" aria-label={copy.starsLabel}>
          {Array.from({ length: 5 }).map((_, idx) => (
            <Star
              key={idx}
              className="w-5 h-5 fill-amber-400 text-amber-400"
              aria-hidden="true"
            />
          ))}
        </div>

        <blockquote className="font-display text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
          {copy.quote}
        </blockquote>

        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-5">
          <div className="w-12 h-12 rounded-full bg-[#0057B8] text-white font-display font-bold text-sm flex items-center justify-center shrink-0">
            СЛ
          </div>
          <div className="text-left">
            <div className="text-sm font-semibold text-slate-900">{copy.author}</div>
            <div className="text-xs text-slate-600">{copy.position}</div>
          </div>
          <span className="hidden sm:block w-px h-10 bg-slate-300" aria-hidden="true" />
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700">
            <ShieldCheck className="w-4 h-4 text-[#0057B8]" />
            <span>{copy.badge}</span>
          </div>
        </div>
      </div>
    </section>
  );
};