import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, PackageCheck, FileSpreadsheet } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { SeoHead } from '../components/SeoHead';
import { B2BInquiryModal } from '../components/B2BInquiryModal';

export const Partners: React.FC = () => {
  const { language, t } = useLanguage();
  const [modalOpen, setModalOpen] = useState(false);

  const title = t('navPartners');

  const steps = [
    {
      num: '01.',
      title:
        language === 'ru'
          ? 'Подбор продукции и фасовок'
          : language === 'zh'
          ? '选择产品与商用规格'
          : 'Select Products & Packaging',
      desc:
        language === 'ru'
          ? 'Выберите позиции в каталоге по жирности, сроку годности и формату (розница или HoReCa 1–20 кг).'
          : 'Filter catalog items by fat content, shelf life, and retail or HoReCa packaging formats.',
    },
    {
      num: '02.',
      title:
        language === 'ru'
          ? 'Спецификация и коммерческие условия'
          : language === 'zh'
          ? '获取技术规格与报价'
          : 'Specifications & Commercial Terms',
      desc:
        language === 'ru'
          ? 'Скачайте техническую карточку товара или отправьте запрос на прайс-лист с учётом объёма партии.'
          : 'Download B2B product spec sheets or request volume-based wholesale pricing.',
    },
    {
      num: '03.',
      title:
        language === 'ru'
          ? 'Холодовая логистика и отгрузка'
          : language === 'zh'
          ? '冷链配送与稳定交付'
          : 'Cold-Chain Fulfillment',
      desc:
        language === 'ru'
          ? 'Комплектация с автоматизированного склада в Гродно (4 200 паллетомест) с телеметрией температуры.'
          : 'Dispatched from our 4,200-pallet automated cold hub in Grodno with continuous temperature logging.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      <SeoHead
        title={`${title} — ${t('brandName')}`}
        description="Условия сотрудничества для оптовых покупателей, торговых сетей и сегмента HoReCa."
        canonicalHash="/partners"
      />

      <div className="max-w-3xl space-y-4">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900">
          {language === 'ru'
            ? 'Для оптовых покупателей, ритейла и HoReCa'
            : language === 'be'
            ? 'Для аптовых пакупнікоў, рытэйла і HoReCa'
            : language === 'zh'
            ? '面向大宗批发、商超零售与餐饮渠道'
            : 'For Wholesale Buyers, Retail & HoReCa'}
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          {language === 'ru'
            ? 'Прямые поставки молочной продукции ОАО «Молочный Мир» для федеральных и региональных сетей, пиццерий, пекарен и дистрибьюторов.'
            : 'Direct dairy supply from Molochny Mir for retail chains, pizzerias, industrial bakeries, and distributors.'}
        </p>
        <div className="pt-2 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-[#0057B8] rounded-lg hover:bg-[#004494] transition-colors"
          >
            {t('requestSalesBtn')}
          </button>
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-slate-800 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <span>{t('heroPrimaryCta')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((s) => (
          <div key={s.num} className="border border-slate-200 rounded-xl p-6 space-y-2 bg-white">
            <div className="font-mono text-xs font-semibold text-[#0057B8]">{s.num}</div>
            <h2 className="font-display text-lg font-semibold text-slate-900">{s.title}</h2>
            <p className="text-sm text-slate-600 leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </section>

      <section className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <PackageCheck className="w-5 h-5 text-[#0057B8]" />
          <h3 className="font-display text-base font-semibold text-slate-900">
            {language === 'ru' ? 'Форматы HoReCa' : 'HoReCa Packaging'}
          </h3>
          <p className="text-sm text-slate-600">
            {language === 'ru'
              ? 'Моцарелла для пиццы 1 кг и 2,5 кг, сливки 33% 1 л, масло монолит 20 кг, СОМ 25 кг.'
              : 'Pizza mozzarella 1kg/2.5kg, whipping cream 33% 1L, butter 20kg blocks, SMP 25kg bags.'}
          </p>
        </div>
        <div className="space-y-2">
          <Truck className="w-5 h-5 text-[#0057B8]" />
          <h3 className="font-display text-base font-semibold text-slate-900">
            {language === 'ru' ? 'Собственный автопарк' : 'Dedicated Fleet'}
          </h3>
          <p className="text-sm text-slate-600">
            {language === 'ru'
              ? 'Ежедневная доставка рефрижераторным транспортом с соблюдением режима +2…+6 °C.'
              : 'Daily chilled deliveries maintaining strict +2…+6 °C cold chain integrity.'}
          </p>
        </div>
        <div className="space-y-2">
          <FileSpreadsheet className="w-5 h-5 text-[#0057B8]" />
          <h3 className="font-display text-base font-semibold text-slate-900">
            {language === 'ru' ? 'EDI и документооборот' : 'Digital EDI & Docs'}
          </h3>
          <p className="text-sm text-slate-600">
            {language === 'ru'
              ? 'Электронные накладные, GTIN-маркировка и декларации соответствия ЕАЭС.'
              : 'Electronic invoices, GS1 GTIN barcodes, and full quality declarations.'}
          </p>
        </div>
      </section>

      <B2BInquiryModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultChannel="wholesale"
      />
    </div>
  );
};
