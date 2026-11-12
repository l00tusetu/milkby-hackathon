import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, MessageSquare, ShieldCheck, Globe2 } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { useCatalogStore } from '../hooks/useCatalogStore';
import { SeoHead } from '../components/SeoHead';
import { B2BInquiryModal } from '../components/B2BInquiryModal';
import { downloadProductB2BSpec } from '../utils/specExport';
import { Product } from '../types';

export const Export: React.FC = () => {
  const { language, localize, t } = useLanguage();
  const { products, categories } = useCatalogStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);

  const exportProducts = products.filter((p) => p.visible && p.exportReady);

  const title =
    language === 'ru'
      ? 'Экспорт и международное партнёрство'
      : language === 'be'
      ? 'Экспарт і міжнароднае партнёрства'
      : language === 'zh'
      ? '国际出口与全球合作伙伴专区'
      : 'Global Export & International B2B';

  const subtitle =
    language === 'ru'
      ? 'Полный ассортимент экспортной продукции ОАО «Молочный Мир» с характеристиками, вариантами фасовки, сроками годности и прямым контактом отдела ВЭД.'
      : language === 'be'
      ? 'Поўны асартымент экспартнай прадукцыі ААТ «Малочны Мір» са спецыфікацыямі і кантактамі.'
      : language === 'zh'
      ? '白俄罗斯 Molochny Mir 出口专供乳制品目录：涵盖规格参数、保质期、大宗包装及国际外贸部门直连。'
      : 'Export-certified dairy catalog with packaging formats, shelf-life specs, downloadable B2B data sheets, and direct export desk contact.';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      <SeoHead
        title={`${title} — ${t('brandName')}`}
        description={subtitle}
        canonicalHash="/export"
      />

      {/* Export Hero */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start border-b border-slate-200 pb-10">
        <div className="lg:col-span-8 space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#0057B8]">
            <Globe2 className="w-4 h-4" />
            <span>FSSC 22000 · ISO 9001 · Halal · China GACC</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900">
            {title}
          </h1>
          <p className="text-base text-slate-600 leading-relaxed max-w-3xl">
            {subtitle}
          </p>
        </div>

        <div className="lg:col-span-4 bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
          <div className="text-sm font-semibold text-slate-900">
            {language === 'ru'
              ? 'Отдел внешнеэкономической деятельности'
              : language === 'zh'
              ? '国际外贸出口部门'
              : 'Export Sales Department'}
          </div>
          <div className="text-xs text-slate-600 space-y-1 font-mono tabular-nums">
            <div>export@milk.by</div>
            <div>+375 (152) 44-55-12</div>
            <div>Incoterms: FCA / DAP / FOB / CIF</div>
          </div>
          <button
            type="button"
            onClick={() => {
              setSelectedProduct(undefined);
              setModalOpen(true);
            }}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#0057B8] rounded-lg hover:bg-[#004494] transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{t('requestSalesBtn')}</span>
          </button>
        </div>
      </section>

      {/* Export Catalog Specification Table */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <h2 className="font-display text-2xl font-bold text-slate-900">
            {language === 'ru'
              ? 'Экспортная матрица продукции и фасовок'
              : language === 'be'
              ? 'Экспартная матрыца прадукцыі і фасовак'
              : language === 'zh'
              ? '出口产品规格与包装矩阵'
              : 'Export Product & Packaging Matrix'}
          </h2>
          <span className="text-xs text-slate-500 tabular-nums">
            {exportProducts.length}{' '}
            {language === 'ru' ? 'позиций готово к отгрузке' : language === 'zh' ? '款产品可供出口' : 'export-ready items'}
          </span>
        </div>

        <div className="border border-slate-200 rounded-xl overflow-x-auto bg-white">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600">
                <th className="py-3.5 px-4">{language === 'ru' ? 'Продукт' : language === 'zh' ? '产品名称' : 'Product'}</th>
                <th className="py-3.5 px-4">{language === 'ru' ? 'Жир / Белок' : language === 'zh' ? '乳脂 / 蛋白' : 'Fat / Protein'}</th>
                <th className="py-3.5 px-4">{language === 'ru' ? 'Фасовки и короб' : language === 'zh' ? '规格与装箱' : 'Pack & Box'}</th>
                <th className="py-3.5 px-4">{language === 'ru' ? 'Срок и хранение' : language === 'zh' ? '保质期与储运' : 'Shelf Life & Storage'}</th>
                <th className="py-3.5 px-4 text-right">{language === 'ru' ? 'B2B-действие' : language === 'zh' ? '操作' : 'B2B Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 tabular-nums">
              {exportProducts.map((prod) => {
                const cat = categories.find((c) => c.id === prod.category);
                const mainPkg = prod.packages[prod.packages.length - 1] || prod.packages[0];
                return (
                  <tr key={prod.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <Link
                        to={`/product/${prod.slug}`}
                        className="font-semibold text-slate-900 hover:text-[#0057B8]"
                      >
                        {localize(prod.name)}
                      </Link>
                      <div className="text-xs text-slate-500">
                        {cat ? localize(cat.name) : prod.category}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      {prod.fatContent ?? '—'}% / {prod.proteinContent ?? '—'} г
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      <div>{prod.packages.map((p) => p.weight).join(', ')}</div>
                      {mainPkg && (
                        <div className="text-xs text-slate-500">
                          {mainPkg.unitsPerBox} шт/кор · {localize(mainPkg.packagingType)}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      {mainPkg ? (
                        <>
                          <div>{localize(mainPkg.shelfLife)}</div>
                          <div className="text-xs text-slate-500">{localize(mainPkg.storage)}</div>
                        </>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => downloadProductB2BSpec(prod, cat, language)}
                          title={t('downloadSpecBtn')}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors whitespace-nowrap"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Spec</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedProduct(prod);
                            setModalOpen(true);
                          }}
                          className="px-2.5 py-1.5 text-xs font-semibold text-white bg-[#0057B8] rounded-md hover:bg-[#004494] transition-colors whitespace-nowrap"
                        >
                          {language === 'ru' ? 'Запрос' : language === 'zh' ? '询价' : 'Quote'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Compliance / Certifications */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: 'FSSC 22000 & ISO 9001',
            desc:
              language === 'ru'
                ? 'Международный менеджмент безопасности пищевой продукции на всех этапах приёмки и переработки молока.'
                : 'Certified food safety management across raw milk intake, processing, and aseptic packaging.',
          },
          {
            title: 'Halal & GACC China',
            desc:
              language === 'ru'
                ? 'Аккредитация для поставок сухого молока, масла и сыров в Китай, страны Персидского залива и Юго-Восточную Азию.'
                : 'Export registration for SMP, butter, and cheeses into China, GCC, and Southeast Asia.',
          },
          {
            title: 'Multimodal Cold Logistics',
            desc:
              language === 'ru'
                ? 'Контейнерные рефрижераторные перевозки, авторефрижераторы и полный пакет ветеринарных сертификатов.'
                : 'Reefer container and cold-truck fulfillment with full veterinary and customs documentation.',
          },
        ].map((item) => (
          <div key={item.title} className="border border-slate-200 rounded-xl p-5 space-y-2 bg-slate-50/60">
            <ShieldCheck className="w-5 h-5 text-[#0057B8]" />
            <h3 className="font-display text-base font-semibold text-slate-900">{item.title}</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </section>

      <B2BInquiryModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        product={selectedProduct}
        defaultChannel="export"
      />
    </div>
  );
};
