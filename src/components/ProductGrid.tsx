import React, { useEffect, useRef, useState } from 'react';
import { PackageSearch, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { useLanguage } from '../hooks/useLanguage';

interface ProductGridProps {
  products: Product[];
  onResetFilters?: () => void;
  mobileCarousel?: boolean;
  scrollResetKey?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onResetFilters,
  mobileCarousel = false,
  scrollResetKey,
}) => {
  const { language } = useLanguage();
  const viewportRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const activeIndexRef = useRef(0);
  const countRef = useRef(products.length);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    countRef.current = products.length;
  }, [products.length]);

  useEffect(() => {
    activeIndexRef.current = 0;
    setActiveIndex(0);
    setDragOffset(0);
    setIsDragging(false);
  }, [mobileCarousel, scrollResetKey, products.length]);

  useEffect(() => {
    if (!mobileCarousel) return;
    const viewport = viewportRef.current;
    if (!viewport) return;

    let startX = 0;
    let startY = 0;
    let startTime = 0;
    let lockAxis: 'x' | 'y' | null = null;
    let currentDx = 0;

    const onTouchStart = (e: TouchEvent) => {
      if (window.innerWidth >= 640 || e.touches.length !== 1) return;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      startTime = Date.now();
      lockAxis = null;
      currentDx = 0;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (window.innerWidth >= 640 || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - startX;
      const dy = e.touches[0].clientY - startY;

      if (lockAxis === null) {
        if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
        if (Math.abs(dy) >= Math.abs(dx)) {
          lockAxis = 'y';
          return;
        }
        lockAxis = 'x';
        setIsDragging(true);
      }

      if (lockAxis === 'x') {
        if (e.cancelable) e.preventDefault();
        const maxIdx = Math.max(0, countRef.current - 1);
        const atStart = activeIndexRef.current === 0 && dx > 0;
        const atEnd = activeIndexRef.current >= maxIdx && dx < 0;
        currentDx = atStart || atEnd ? dx * 0.25 : dx;
        setDragOffset(currentDx);
      }
    };

    const finishTouch = () => {
      if (lockAxis === 'x') {
        const elapsed = Date.now() - startTime;
        const threshold = elapsed < 220 ? 25 : 50;
        const cur = activeIndexRef.current;
        const maxIdx = Math.max(0, countRef.current - 1);

        if (currentDx < -threshold && cur < maxIdx) {
          setActiveIndex(cur + 1);
        } else if (currentDx > threshold && cur > 0) {
          setActiveIndex(cur - 1);
        }
      }
      lockAxis = null;
      currentDx = 0;
      setIsDragging(false);
      setDragOffset(0);
    };

    viewport.addEventListener('touchstart', onTouchStart, { passive: true });
    viewport.addEventListener('touchmove', onTouchMove, { passive: false });
    viewport.addEventListener('touchend', finishTouch, { passive: true });
    viewport.addEventListener('touchcancel', finishTouch, { passive: true });

    return () => {
      viewport.removeEventListener('touchstart', onTouchStart);
      viewport.removeEventListener('touchmove', onTouchMove);
      viewport.removeEventListener('touchend', finishTouch);
      viewport.removeEventListener('touchcancel', finishTouch);
    };
  }, [mobileCarousel]);

  const goToSlide = (idx: number) => {
    setIsDragging(false);
    setDragOffset(0);
    setActiveIndex(Math.max(0, Math.min(products.length - 1, idx)));
  };

  if (products.length === 0) {
    return (
      <div className="border border-slate-200 rounded-xl bg-slate-50/70 p-8 sm:p-10 text-center space-y-3">
      <PackageSearch className="w-8 h-8 text-slate-400 mx-auto" strokeWidth={1.5} />
      <h3 className="font-display text-base font-semibold text-slate-900">
      {language === 'ru'
        ? 'По выбранным параметрам товары не найдены'
        : language === 'be'
        ? 'Па выбраных параметрах тавары не знойдзены'
        : language === 'zh'
        ? '未找到符合筛选条件的产品'
    : 'No products match the selected filters'}
    </h3>
    <p className="text-sm text-slate-600 max-w-md mx-auto">
    {language === 'ru'
      ? 'Попробуйте изменить диапазон жирности, сбросить фильтр категории или воспользоваться умным подбором.'
      : language === 'be'
      ? 'Паспрабуйце змяніць дыяпазон тлустасці або скінуць фільтр.'
      : language === 'zh'
      ? '请尝试调整乳脂范围或重置筛选条件。'
    : 'Try adjusting the fat range, clearing category filters, or using the Smart Matcher.'}
    </p>
    {onResetFilters && (
      <button
      type="button"
      onClick={onResetFilters}
      className="inline-flex items-center px-4 py-2 text-xs font-semibold text-white bg-[#0057B8] rounded-lg hover:bg-[#004494] transition-colors"
      >
      {language === 'ru'
        ? 'Сбросить фильтры'
        : language === 'be'
        ? 'Скінуць фільтры'
        : language === 'zh'
        ? '重置筛选'
    : 'Reset filters'}
    </button>
    )}
    </div>
    );
  }

  if (mobileCarousel) {
    return (
      <div className="space-y-4">
      <div
      ref={viewportRef}
      className="overflow-hidden sm:overflow-visible touch-pan-y select-none sm:select-auto"
      >
      <div
      className="flex gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-6 max-sm:[transform:var(--mobile-track-transform)] max-sm:will-change-transform motion-reduce:transition-none"
      style={
        {
          '--mobile-track-transform': `translate3d(calc(-${activeIndex} * (100% + 16px) + ${dragOffset}px), 0, 0)`,
            transition: isDragging
            ? 'none'
            : 'transform 320ms cubic-bezier(0.22, 1, 0.36, 1)',
        } as React.CSSProperties
      }
      >
      {products.map((product) => (
        <div
        key={product.id}
        className="w-full min-w-0 shrink-0 sm:w-auto sm:shrink"
        >
        <ProductCard product={product} />
        </div>
      ))}
      </div>
      </div>

      {products.length > 1 && (
        <div className="flex sm:hidden items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-1.5" role="tablist" aria-label="Product slides">
        {products.map((p, idx) => {
          const isActive = idx === activeIndex;
          return (
            <button
            key={p.id}
            type="button"
            onClick={() => goToSlide(idx)}
            aria-label={`Slide ${idx + 1}`}
            aria-pressed={isActive}
            className={`h-2 rounded-full transition-all duration-200 ${
              isActive ? 'w-6 bg-[#0057B8]' : 'w-2 bg-slate-300 hover:bg-slate-400'
            }`}
            />
          );
        })}
        </div>

        <div className="flex items-center gap-2.5">
        <button
        type="button"
        onClick={() => goToSlide(activeIndex - 1)}
        disabled={activeIndex === 0}
        aria-label="Previous product"
        className="w-10 h-10 rounded-full border border-slate-300 bg-white text-slate-800 flex items-center justify-center hover:border-[#0057B8] hover:text-[#0057B8] disabled:opacity-35 disabled:pointer-events-none transition-colors"
        >
        <ChevronLeft className="w-4 h-4" />
        </button>
        <button
        type="button"
        onClick={() => goToSlide(activeIndex + 1)}
        disabled={activeIndex >= products.length - 1}
        aria-label="Next product"
        className="w-10 h-10 rounded-full border border-slate-300 bg-white text-slate-800 flex items-center justify-center hover:border-[#0057B8] hover:text-[#0057B8] disabled:opacity-35 disabled:pointer-events-none transition-colors"
        >
        <ChevronRight className="w-4 h-4" />
        </button>
        </div>
        </div>
      )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
    {products.map((product) => (
      <ProductCard key={product.id} product={product} />
    ))}
    </div>
  );
};
