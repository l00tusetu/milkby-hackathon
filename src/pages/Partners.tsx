import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, PackageCheck, FileSpreadsheet } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { SeoHead } from '../components/SeoHead';
import { B2BInquiryModal } from '../components/B2BInquiryModal';

export const Partners: React.FC = () => {
  const { language, t } = useLanguage();
  const [modalOpen, setModalOpen] = useState(false);

  const copy = {
    ru: {
      seoDesc: 'Условия сотрудничества для оптовых покупателей, торговых сетей и сегмента HoReCa.',
      h1: 'Для оптовых покупателей, ритейла и HoReCa',
      lead: 'Прямые поставки молочной продукции ОАО «Молочный Мир» для федеральных и региональных сетей, пиццерий, пекарен и дистрибьюторов.',
      steps: [
        { num: '01.', title: 'Подбор продукции и фасовок', desc: 'Выберите позиции в каталоге по жирности, сроку годности и формату (розница или HoReCa 1–20 кг).' },
        { num: '02.', title: 'Спецификация и коммерческие условия', desc: 'Скачайте техническую карточку товара или отправьте запрос на прайс-лист с учётом объёма партии.' },
        { num: '03.', title: 'Холодовая логистика и отгрузка', desc: 'Комплектация с автоматизированного склада в Гродно (4 200 паллетомест) с телеметрией температуры.' },
      ],
      features: [
        { title: 'Форматы HoReCa', desc: 'Моцарелла для пиццы 1 кг и 2,5 кг, сливки 33% 1 л, масло монолит 20 кг, СОМ 25 кг.' },
        { title: 'Собственный автопарк', desc: 'Ежедневная доставка рефрижераторным транспортом с соблюдением режима +2…+6 °C.' },
        { title: 'EDI и документооборот', desc: 'Электронные накладные, GTIN-маркировка и декларации соответствия ЕАЭС.' },
      ],
    },
    be: {
      seoDesc: 'Умовы супрацоўніцтва для аптовых пакупнікоў, гандлёвых сетак і сегмента HoReCa.',
      h1: 'Для аптовых пакупнікоў, рытэйла і HoReCa',
      lead: 'Прамыя пастаўкі малочнай прадукцыі ААТ «Малочны Мір» для федэральных і рэгіянальных сетак, піцэрый, пякарняў і дыстрыб’ютараў.',
      steps: [
        { num: '01.', title: 'Падбор прадукцыі і фасовак', desc: 'Выберыце пазіцыі ў каталогу па тлустасці, тэрміну прыдатнасці і фармату (розніца або HoReCa 1–20 кг).' },
        { num: '02.', title: 'Спецыфікацыя і камерцыйныя ўмовы', desc: 'Спампаваць тэхнічную картку тавару або адправіць запыт на прайс-ліст з улікам аб’ёму партыі.' },
        { num: '03.', title: 'Халадовая лагістыка і адгрузка', desc: 'Камплектацыя з аўтаматызаванага склада ў Гродне (4 200 палетамесцаў) з тэлеметрыяй тэмпературы.' },
      ],
      features: [
        { title: 'Фарматы HoReCa', desc: 'Мацарэла для піцы 1 кг і 2,5 кг, вяршкі 33% 1 л, масла маналіт 20 кг, САМ 25 кг.' },
        { title: 'Уласны аўтапарк', desc: 'Штодзённая дастаўка рэфрыжэратарным транспартам з захаваннем рэжыму +2…+6 °C.' },
        { title: 'EDI і дакументаабарот', desc: 'Электронныя накладныя, GTIN-маркіроўка і дэкларацыі адпаведнасці ЕАЭС.' },
      ],
    },
    en: {
      seoDesc: 'Partnership terms for wholesale buyers, retail chains, and HoReCa foodservice operators.',
      h1: 'For Wholesale Buyers, Retail & HoReCa',
      lead: 'Direct dairy supply from Molochny Mir for retail chains, pizzerias, industrial bakeries, and distributors.',
      steps: [
        { num: '01.', title: 'Select Products & Packaging', desc: 'Filter catalog items by fat content, shelf life, and retail or HoReCa packaging formats.' },
        { num: '02.', title: 'Specifications & Commercial Terms', desc: 'Download B2B product spec sheets or request volume-based wholesale pricing.' },
        { num: '03.', title: 'Cold-Chain Fulfillment', desc: 'Dispatched from our 4,200-pallet automated cold hub in Grodno with continuous temperature logging.' },
      ],
      features: [
        { title: 'HoReCa Packaging', desc: 'Pizza mozzarella 1kg/2.5kg, whipping cream 33% 1L, butter 20kg blocks, SMP 25kg bags.' },
        { title: 'Dedicated Fleet', desc: 'Daily chilled deliveries maintaining strict +2…+6 °C cold chain integrity.' },
        { title: 'Digital EDI & Docs', desc: 'Electronic invoices, GS1 GTIN barcodes, and full quality declarations.' },
      ],
    },
    zh: {
      seoDesc: '面向大宗批发商、连锁商超及 HoReCa 餐饮渠道的合作方案。',
      h1: '面向大宗批发、商超零售与餐饮渠道',
      lead: 'Molochny Mir 为国内外连锁商超、披萨餐饮连锁、工业烘焙及分销商提供工厂直供乳制品。',
      steps: [
        { num: '01.', title: '选择产品与商用规格', desc: '按乳脂含量、保质期及零售/餐饮大包装（1–20公斤）筛选所需产品。' },
        { num: '02.', title: '获取技术规格与报价', desc: '一键下载 B2B 技术规格书，或按采购体量提交阶梯报价咨询。' },
        { num: '03.', title: '冷链配送与稳定交付', desc: '由格罗德诺 4,200 托盘位全自动智能冷链中心全程温控直发。' },
      ],
      features: [
        { title: 'HoReCa 餐饮专供包装', desc: '1公斤/2.5公斤披萨马苏里拉奶酪、1升装33%淡奶油、20公斤块状黄油、25公斤脱脂奶粉。' },
        { title: '自有冷链车队', desc: '每日冷藏专车配送，严格保持 +2…+6 °C 恒温冷链。' },
        { title: '电子单据与合规溯源', desc: '支持 EDI 电子单证、GS1 GTIN 国际条码及完整质量合规声明。' },
      ],
    },
  }[language];

  const icons = [PackageCheck, Truck, FileSpreadsheet];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
    <SeoHead
    title={`${t('navPartners')} — ${t('brandName')}`}
    description={copy.seoDesc}
    canonicalHash="/partners"
    />

    <div className="max-w-3xl space-y-4">
    <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900">{copy.h1}</h1>
    <p className="text-base text-slate-600 leading-relaxed">{copy.lead}</p>
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
    {copy.steps.map((s) => (
      <div key={s.num} className="border border-slate-200 rounded-xl p-6 space-y-2 bg-white">
      <div className="font-mono text-xs font-semibold text-[#0057B8]">{s.num}</div>
      <h2 className="font-display text-lg font-semibold text-slate-900">{s.title}</h2>
      <p className="text-sm text-slate-600 leading-relaxed">{s.desc}</p>
      </div>
    ))}
    </section>

    <section className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
    {copy.features.map((feat, idx) => {
      const Icon = icons[idx];
      return (
        <div key={feat.title} className="space-y-2">
        <Icon className="w-5 h-5 text-[#0057B8]" />
        <h3 className="font-display text-base font-semibold text-slate-900">{feat.title}</h3>
        <p className="text-sm text-slate-600">{feat.desc}</p>
        </div>
      );
    })}
    </section>

    <B2BInquiryModal
    open={modalOpen}
    onClose={() => setModalOpen(false)}
    defaultChannel="wholesale"
    />
    </div>
  );
};
